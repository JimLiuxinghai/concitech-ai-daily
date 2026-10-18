---
title: "Anthropic 的 Code Review：七层防线、风险审批与审查收敛"
description: "Claude Code 团队的代码审查包含七层质量控制。本文介绍验证证据、多 Agent 审查、REVIEW.md、安全门禁、风险审批、合并队列与事故评测，补充缓存隔离案例、审批伪代码和接入方案，区分内部流程、公开产品能力与工程解读。"
slug: "anthropic-code-review-engineering"
publishedAtCST: "2026-10-18T11:30:15+08:00"
language: zh
author: JimLiu
categories: [devtools, security]
cover: "/article-covers/anthropic-code-review-engineering.webp"
draft: false
wechatMediaId: "qwac_8j4kaaga6WV5YUa-RlzVHVn2stU4FE5Bwxvt24791dKabx8u2A_z1O71dDo"
---

代码生成消耗算力，代码审查消耗工程师的注意力。

AI 提高代码产量，Review 队列承担压力。代码阅读、评论、返工、复审占用时间；漏检造成的故障占用另一笔时间。审查系统的成本包括这两笔账。

Anthropic 的《How the Claude Code team does code review》介绍了 Claude Code 团队的实践。对象是该团队的仓库，范围区别于 Anthropic 的大型 monorepo。[原文](https://claude.dev/blog/solving-code-review-at-anthropic/)

这套设计的主线是：机器处理常规检查，人承担风险决策与交付责任。审查覆盖代码生成、PR、合并和发布生命周期。

下文包含官方机制介绍和工程解读。缓存案例、规则样例与审批伪代码属于本文编写的示例，区别于官方源码。

![Claude Code 团队的七层质量控制，公开流程整理示意](/article-images/anthropic-code-review-engineering/01-delivery-layers.webp)

## 01 验证证据：PR 的输入条件

“功能完成”是一句结论。测试输出、构建结果和页面截图是一组证据。

Anthropic 的最佳实践要求 Agent 获得可执行的验收条件、展示检查结果；独立上下文的审查者负责检查修改。[最佳实践](https://code.claude.com/docs/en/best-practices)

任务定义需要对应可观察的行为。一个“修复缓存问题”的任务，验收条件需要说明请求身份、缓存键、过期边界和预期结果。“测试通过”缺少测试对象、命令与代码版本，证据价值有限。

下面是本文设计的交付记录示例：

```yaml
change: tenant-scoped-cache
commit: "<head_sha>"
checks:
  - command: "pnpm test cache-isolation"
    exit_code: 0
    artifact: "cache-isolation.junit.xml"
  - command: "pnpm typecheck"
    exit_code: 0
risk: "跨租户缓存数据混用"
rollback: "关闭 tenant_cache_v2 功能开关"
owner: "PR 负责人"
```

这里的 `commit` 关联验证对象，`artifact` 提供复查入口，`rollback` 定义恢复动作。测试通过证明测试覆盖的行为，业务正确性取决于验收条件的质量。

独立上下文承担另一项工作：检查实现结果。实现会话包含任务解释和方案选择，审查会话需要代码、需求与证据。上下文隔离降低“接受作者解释”的倾向；相同模型具有相似盲区，隔离本身缺少正确性保证。

## 02 多 Agent 审查：发现与验证的职责分离

公开 Code Review 服务的流水线包含四个环节：发现候选问题、验证证据、去重分级、发布意见。多个 Agent 检查 diff 与周边代码，验证阶段过滤误报，结果表现为行内评论、摘要和 check run。[产品文档](https://code.claude.com/docs/en/code-review)

![多 Agent 审查的发现、验证与意见输出，公开产品机制示意](/article-images/anthropic-code-review-engineering/02-findings-pipeline.webp)

“发现”和“验证”的目标存在区别。发现者追求可疑路径覆盖；验证者追问可达性、前置条件与实际后果。

以下缓存修改展示这种区别。示例属于本文构造：

```ts
const cacheKey = `${resourceId}:${locale}`;
const hit = await cache.get(cacheKey);
if (hit) return hit;

const result = await loadForTenant(tenantId, resourceId);
await cache.set(cacheKey, result);
return result;
```

发现者提出“缓存键缺少租户维度”。验证者需要检查 `resourceId` 的唯一性范围、缓存实例的共享范围，以及命中分支的鉴权逻辑。

全局唯一的资源标识、租户独占的缓存实例，具有不同于共享缓存的风险。函数名、变量名和一行 diff 缺少这组语义。

有效 finding 需要描述完整链路：租户 A 写入缓存；租户 B 访问相同资源编号；缓存命中绕过租户加载逻辑；响应包含 A 的数据。文件行号、调用入口和对应测试提供验证入口。

本文建议的 finding 结构包含五项：

1. 问题位置与代码版本。
2. 触发条件与调用路径。
3. 受影响的不变量及用户后果。
4. 支持结论的代码或运行证据。
5. 修复方向与验证方法。

多个 Agent 的一致意见属于信号，业务不变量和代码证据承担判断依据。相同上下文缺失造成的共同误判，需要测试、领域规则和人工判断补位。

官方产品区分三类意见：Important 表示合并前的修复项，Nit 表示次要问题，Pre-existing 表示本次 PR 引入范围之外的历史缺陷。分类表达问题优先级与归因，历史缺陷具有不同于新增回归的处理语境。[意见分类](https://code.claude.com/docs/en/code-review-pull-requests)

## 03 CLAUDE.md 与 REVIEW.md：项目知识和审查规则

`CLAUDE.md` 描述项目约定；`REVIEW.md` 描述审查重点。托管服务读取两者，本地 `/code-review` 读取 `CLAUDE.md`，其输入排除 `REVIEW.md`。两套工具具有不同的规则读取行为。[定制文档](https://code.claude.com/docs/en/code-review-customize)

项目说明负责技术栈、运行命令与模块边界；审查说明负责业务失败条件、证据要求和意见范围。lint 负责格式检查，审查规则描述领域不变量，职责划分减少评论噪声。

下面是一份本文编写的 `REVIEW.md` 示例：

```markdown
# Review contract

## Important
数据越权、账单金额错误、会话失效失败、回滚阻断。

## 业务不变量
- 数据访问遵守调用方的租户边界。
- 支付重试保持幂等语义。
- 数据迁移保持新旧版本的读写兼容性。

## 证据
每条问题包含文件行号、触发条件、影响和验证入口。

## 范围
生成文件和格式问题交给 CI。
Nit 数量上限：3。
空结果摘要：0 条问题。
```

这份文件是审查契约，完整性责任属于代码所有者。支付重试和租户边界描述的是业务风险，命名偏好描述的是风格风险，两者需要不同优先级。

规则文件具有信任边界。官方服务采用基础分支或默认分支的 `REVIEW.md`，选择取决于分支保护配置；PR 自身的规则修改属于后续审查的输入。降低严重性、跳过路径等配置依赖受保护的默认分支。[规则读取说明](https://code.claude.com/docs/en/code-review-customize#which-branch-reviewmd-is-read-from)

这一设计限制“修改代码的人修改审查尺度”的路径。普通团队的权限模型需要相同约束：规则变更需要维护者审查，敏感路径需要所有者审批。

## 04 安全审查：检查能力与门禁能力

Claude Code 团队的[内部流程](https://claude.dev/blog/solving-code-review-at-anthropic/)要求解决 bug 审查和安全审查的开放问题。公开 Code Review 产品提供 findings，其 check run 的结论排除失败；产品本身承担的职责是提出意见，合并权限属于仓库规则。[意见处理文档](https://code.claude.com/docs/en/code-review-pull-requests)

这是接入中的常见陷阱：绿色流水线与安全问题清零是两个条件。安装审查工具、要求 check 完成、要求问题解决，具有三种不同语义。

公开的安全审查 Action 提供另一条接入路径：读取 PR 修改、分析代码语义、生成漏洞解释和修复建议、过滤误报、发布评论。仓库声明该工具缺少提示注入防护加固，适用对象是可信 PR；外部贡献者的工作流需要维护者批准。[官方仓库](https://github.com/anthropics/claude-code-security-review)

PR 内容属于不可信输入。源码注释、测试数据和文档包含文本，模型存在指令与数据混淆的风险。Agent 的执行身份、网络访问和凭据权限决定故障影响范围。

接入设计需要采用只读分析身份、最小化令牌权限和隔离执行环境。部署凭据与审查身份需要权限分离；第三方 Action 需要固定可信提交版本。提示词属于软约束，身份和网络策略属于执行边界。

模型审查补充语义分析，依赖扫描、密钥扫描和确定性测试保留原有职责。安全审查的空结果表示工具的发现结果，安全保证需要完整的威胁模型与验证体系。

## 05 风险审批：0、1、2 人与 commit 绑定

Claude Code 团队采用风险分级：

| 风险 | 示例 | 人工审批要求 |
| --- | --- | --- |
| 低 | 文档、文案、内部功能、开关保护的增量修改 | 自动检查和安全检查通过：0 人 |
| 中 | 常规产品修改，缓存、更新器、系统提示词等敏感改动 | 1 人 |
| 高 | 最高风险代码及指定路径 | 2 人 |

简化路径的适用对象是可信作者。敏感路径和 CI 工作流保留人工要求，分类器支持风险升级；Agent 审批缺少人工名额效力。指挥 Agent 的人承担责任，其审批计入相应要求。审批绑定特定 commit，新增未获背书的提交触发审批刷新。[团队流程](https://claude.dev/blog/solving-code-review-at-anthropic/)

“0 人审批”描述一个受约束的分支，范围区别于所有 PR。可信身份解决操作资格问题，变更风险解决审查强度问题，两者属于不同维度。

commit 绑定解决的是审批与内容的对应关系。工程师审查 commit A，Agent 提交 commit B；旧审批证明 A 的审查状态，缺少 B 的审查含义。

![commit 绑定的审批与证据刷新，本文工程抽象](/article-images/anthropic-code-review-engineering/03-approval-sha.webp)

以下伪代码表达一组门禁关系，代码属于本文工程抽象，区别于 Anthropic 的内部实现：

```python
required = approval_policy(risk, author, changed_paths)

merge_allowed = (
    ci_passed(head_sha)
    and findings_resolved(head_sha)
    and human_approvals(head_sha) >= required
    and merge_queue_passed(base_sha, head_sha)
)
```

这里有四种状态：测试状态、问题状态、审批状态和候选合并状态。每种状态需要版本标识。一个笼统的 `approved = true` 存在审批对象丢失风险，异步 Agent 的多次推送放大这个问题。

风险分类器需要审计信息。触发路径、风险理由、规则版本和人工覆盖记录，构成排查错误放行的证据。分类错误本身属于需要评测的故障类型。

## 06 审查收敛：旧问题与本次回归的分流

团队的审查策略包含三轮后的方案重审节点、后续增量复审、问题去重和同类缺陷归并。三轮节点触发方案重审，含义区别于放行。团队报告的平均审查通过轮数变化为 2.08→1.32，指标对象是内部 PR，数据属于团队自报。[团队流程](https://claude.dev/blog/solving-code-review-at-anthropic/)

PR 的变更范围是一条边界。历史缺陷值得修复，但历史缺陷治理和本次变更验收需要不同队列。审查范围的扩张使当前 PR 承担历史问题的修复责任，造成目标漂移。

缓存键缺少租户维度，修复任务需要识别同类键结构，补充隔离测试。十条相同问题产生十次返工；缺陷类别与检索边界支持一次系统性修复。

增量复审存在另一项取舍：局部修改具有跨模块影响。复审对象需要包括新增 diff、修复涉及的不变量和相邻调用关系。“增量”描述检查的起点，完整性要求取决于影响范围。

审查器的问题身份具有工程价值：`缺陷类别＋受影响行为＋位置范围`。代码行号变化，问题语义帮助去重。审查的收敛失败需要人工重审需求和方案，增加审查轮数缺少天然收益。

## 07 合并与发布：组合验证和恢复能力

团队使用合并队列、功能开关与分阶段发布；事故和回滚案例进入工程师确认的日常评测。审批自动收紧的熔断器属于团队待办。共享代码理解缺少正式流程，依赖模块解释材料等做法。[团队流程](https://claude.dev/blog/solving-code-review-at-anthropic/)

合并队列处理组合风险：PR A 通过检查，PR B 通过检查，A 与 B 的组合存在失败空间。两个修改涉及同一依赖版本、协议假设或构建配置，单 PR 验证缺少组合状态。

功能开关处理运行风险。代码合入与行为启用具有不同时间点，开关提供停止新行为的手段。遥测记录版本、开关状态和用户分组，这些信息构成故障定位的比较对象。

恢复设计需要区分动作类型。界面开关具有恢复空间；删除数据、扣款和外发消息产生业务副作用。后一类变更需要兼容迁移、幂等和补偿机制。Git revert 恢复代码，业务状态恢复需要另一套设计。

事故评测的价值是保存真实失败模式。本文建议每个样本包含故障提交、故障条件、正确行为与专家确认结果；评测输入使用故障版本，答案保存于评分侧，防止未来修复信息泄漏给审查器。

命中率需要配对误报成本。正常 PR 的测试集检测“制造问题”的倾向；评论处理结果区分有效修复、误报、预期行为和低价值建议。评论数量缺少质量含义。

Anthropic 的安全生命周期文章补充了治理措施：新审查器的影子模式、自动决策抽检、操作日志与风险监控。它描述的是公司的安全治理，范围区别于某个仓库的具体审批表。[安全生命周期](https://claude.com/resources/articles/how-anthropic-secures-its-ai-native-software-development-lifecycle)

## 08 团队接入：五个验收项

接入目标是可核查的质量控制系统。本文建议采用五个验收项：

1. **证据契约**：PR 包含代码版本、验证命令、结果与恢复方案。
2. **审查规则**：`CLAUDE.md` 和 `REVIEW.md` 定义业务边界，规则来源具有保护。
3. **合并门禁**：CI、开放问题与人工审批状态绑定提交版本。
4. **恢复演练**：功能开关、候选合并验证与副作用补偿具有操作记录。
5. **审查器评测**：事故样本、正常样本、人工处理时间和漏检结果进入评估。

共享理解需要独立验收：修改负责人的交付说明包含行为变化、设计假设和故障排查入口。AI 生成的模块说明提供学习材料，负责人对材料的理解承担另一项责任。

Anthropic 的经验指向一种职责划分：审查器提供候选问题和证据，仓库政策决定合并资格，工程师承担设计与交付责任。成熟度取决于这些职责的边界，以及故障发生后的追溯和恢复能力。

## 参考资料

1. [Claude Code 团队的审查流程](https://claude.dev/blog/solving-code-review-at-anthropic/)
2. [Code Review 产品机制](https://code.claude.com/docs/en/code-review)；[意见与 check run](https://code.claude.com/docs/en/code-review-pull-requests)
3. [审查定制与规则读取](https://code.claude.com/docs/en/code-review-customize)；[本地审查](https://code.claude.com/docs/en/code-review-local)
4. [Claude Code 最佳实践](https://code.claude.com/docs/en/best-practices)；[安全审查 Action](https://github.com/anthropics/claude-code-security-review)
5. [Anthropic 的 AI 原生安全生命周期](https://claude.com/resources/articles/how-anthropic-secures-its-ai-native-software-development-lifecycle)
