---
title: "Claude 刚发布 AI 原生开发手册：代码不再是瓶颈后，麻烦才刚开始"
description: "Anthropic把AI编程从写代码扩展到规划、设计、测试、部署和运维。真正的变化不是产出更多代码，而是重做整条软件交付流水线。"
slug: "claude-ai-native-sdlc-playbook"
publishedAtCST: "2026-09-08T21:16:47+08:00"
language: zh
author: "JimLiu"
categories: [devtools]
cover: "/article-covers/claude-ai-native-sdlc-playbook.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-Z2QDEoItQnF6FR18ylc7t7CitJHQhFtCZQhBLqChw6V"
draft: false
---
过去一年，AI 编程工具最常见的卖点是：代码写得更快了。

Anthropic 最新发布的《AI-Native SDLC Playbook》，却从另一个角度切入：**当代码生成快到以小时计算，原来围绕“人类写代码”设计的软件研发流程，反而成了最大的阻力。**

需求还在排会，设计还在跨团队交接，安全评审按周排期，部署要等人工签字。Build 阶段被 Agent 压缩了，Plan、Test、Deploy 仍然按人的速度运行。

结果并不一定是交付更快，也可能只是 Review 队列更长、待验证代码更多、治理成本更高。

Anthropic 给出的答案，不是再买一个 Coding Agent，而是重做整条软件开发生命周期，也就是 SDLC。

这份手册覆盖 Plan、Design、Build、Test、Deploy、Maintain 六个阶段。更激进的是，它要把软件开发从一条由人推动的流水线，改造成一套由事件触发、Agent 执行、工件交接、人类把关的闭环系统。

## 写代码变快，为什么团队反而更堵

传统 SDLC 有大量文档、评审、审批和交接，并不完全是官僚主义。

代码过去很贵。一个需求可能要开发数周，团队有充足理由在动手前反复对齐，也有时间逐行审查最终 Diff。安全、合规和发布流程，都是围绕这种生产速度设计的。

Agent 改变了供给端。一名工程师可以同时启动多个任务，几小时内产生过去几天甚至几周的代码量。但安全团队的人数没变，测试环境没变，发布窗口也没变。

于是瓶颈从 Build 向两边迁移：左边是需求和设计，右边是测试、审查与部署。

![Agent 加速 Build 后，瓶颈转移到规划、测试和发布环节。图片来源：Anthropic](/article-images/claude-ai-native-sdlc-playbook/build-bottleneck.webp)

这也是手册中最值得重视的判断：**AI 编程的收益不会自动传导到交付速度。** 只优化代码生成，相当于把高速发动机装进一条仍然人工收费的道路。

## 第一处变化：每个阶段都要交付“可执行工件”

Anthropic 为整条流程设计了一条工件链：

`intent.md → spec.md → plan.md → code + tests → PR review → incident record`

这些文件既给人看，也给 Agent 读。上一个阶段提交工件，下一个阶段读取工件。Git 记录谁提出需求、Agent 生成了什么、谁批准了它。

这比“给 Agent 更多上下文”具体得多。

很多团队的问题不是模型能力不足，而是上下文散落在会议、Slack、Jira、个人经验和过时文档里。每次启动 Agent，都要重新解释一遍。AI-native SDLC 要做的，是把隐性知识变成版本化、可验证、可追踪的输入。

六个阶段因此有了清晰的交付物：

| 阶段 | 核心工件 | 人类负责什么 |
| --- | --- | --- |
| Plan | `intent.md` | 判断问题是否值得解决 |
| Design | `spec.md` | 处理冲突，批准需求与设计 |
| Build | `plan.md`、代码、测试 | 审查方案和高风险变更 |
| Test | 测试结果、Evals | 定义通过标准，处理异常 |
| Deploy | PR、审查记录、审批日志 | 保留发布与合规签字权 |
| Maintain | 事件记录、新的 `intent.md` | 决定修复、排期或忽略 |

关键不在 Markdown。换成结构化 Ticket、数据库记录或内部系统也可以。关键在于每次交接都有一个明确、版本化、机器可读取的状态，而不是靠人重新复述。

## 第二处变化：SDLC 从直线变成循环

传统流程从 Plan 一路走到 Maintain。线上出现问题后，人重新建 Ticket，再从头启动一次。

AI-native SDLC 把 Maintain 接回 Plan。生产指标越过控制带、用户提交故障、CI 出现异常，都可以触发一个只读 Agent 先诊断，再写出新的 `intent.md`。被接受后，它重新进入设计、构建、测试与发布。

![传统 SDLC 是一条线，AI-native SDLC 是持续运行的循环。图片来源：Anthropic](/article-images/claude-ai-native-sdlc-playbook/lifecycle-loop.webp)

这个闭环不是让模型全天候自由修改生产系统。Anthropic 反复强调两层约束：

1. **触发尽量确定。** 是否越过阈值，由脚本、指标和规则判断，不让模型凭感觉决定何时行动。
2. **执行分级授权。** 低风险任务可以自动处理，高风险任务只能诊断、开 PR 或调用预先批准的 Runbook。

手册举了一个控制带的例子：1σ 只记录，2σ 允许 Agent 只读诊断，3σ 才允许提出修改或触发预批准回滚。人的注意力集中在升级点和批准点，而不是每一步都手工启动。

## 六个阶段，具体怎么改

### 1. Plan：先写 `intent.md`

需求不再先变成一串 Story Point，而是由提出者与 Claude 对话，写清问题、目标、影响范围、限制和未决问题。产品负责人审核后提交到 Git。

好处是减少转述损耗。最初提出问题的人可以保留自己的表达，Agent 和后续团队读取同一份内容。

### 2. Design：把规则带进设计现场

Claude 从 `intent.md` 生成 `spec.md`，同时加载安全、品牌、合规和 UX Skills。政策不再等到开发完成后才在评审会上被发现，而是在 Spec 形成时就作为约束参与。

人仍然决定冲突怎么处理。Agent 的作用是把问题提早暴露，而不是替政策负责人签字。

### 3. Build：没有批准的 Plan，不开始写代码

手册建议默认从 Claude Code Plan Mode 开始。Agent 先读取代码库，列出修改文件、实施顺序、风险和验证方式，工程师审查后把计划保存为 `plan.md`。

团队知识则写入 `CLAUDE.md` 与 Skills。前者保存项目命令、架构、约定和常见错误；后者封装安全审查、迁移流程等可复用知识。Hooks 把禁止事项写成代码，例如没有变更单就不能修改数据库迁移。

### 4. Test：让 Agent 在交付前看见自己的结果

如果 Agent 无法运行测试、构建项目或查看截图，它就没有反馈回路，只能猜工作是否完成。

Anthropic 建议先把验证动作收敛成稳定的一条命令，并在 `CLAUDE.md` 中写明健康输出。修 Bug 时先复现失败测试，再修改代码，直到同一测试通过。UI 任务则要让 Agent 通过浏览器或截图检查真实结果。

这里还有一个容易混淆的点：自我验证不等于独立审查。负责实现的上下文可能带着同一套错误假设，所以最终还需要一个新上下文或独立 Agent 做验证。

### 5. Deploy：把治理从会议变成执行边界

AI Review 先跑 Bug、安全和合规检查，人类把时间留给高风险代码与最终批准。分支保护确保写代码的 Agent 不能批准自己的 PR。

Hooks 可以在危险动作发生前选择允许、询问或阻止；Sandbox 控制文件、网络和凭证；部署能力通过 MCP 以白名单工具暴露，而不是给 Agent 一个装满生产密钥的 Shell。

这套设计的原则很朴素：**Agent 可以一路工作到生产门口，但不能自己跨过那扇门。**

### 6. Maintain：让生产问题自动回到需求入口

监控脚本发现异常后启动 Agent。Agent 读取指标、日志和最近变更，给出诊断，并把结果写回 `intent.md`。修复完成后，这次事故还要新增一个 Eval，防止同类问题再次发生。

到这里，SDLC 才形成闭环。生产环境不只是最后一站，也开始持续为下一轮开发提供输入。

## 不要一口气全上

这份 Playbook 很长，但 Anthropic 并不建议一次铺满所有环节。官方依赖图里，`intent.md`、`CLAUDE.md`、反馈回路、Hooks 和 Plan Mode 都可以作为起点，后续再增加 Skills、Sub-agent、Evals、PR Review、CI/CD 和闭环运维。

![Anthropic 给出的 AI-native SDLC 实践依赖图，可从顶部任一入口开始。图片来源：Anthropic](/article-images/claude-ai-native-sdlc-playbook/adoption-graph.webp)

如果团队今天刚开始，我会按下面的顺序做：

1. **先做反馈回路。** 确保 Agent 能用一条命令运行测试、构建和检查结果。
2. **再写 `CLAUDE.md`。** 只放真实、稳定、能减少重复犯错的信息。
3. **复杂任务强制 Plan。** 让方案先于 Diff 被审查，并写清验收标准。
4. **把高频错误变成 Hook 或 Eval。** 不要只在 Review 评论里重复提醒。
5. **最后才做自动闭环。** 在权限、回滚和审查还不可靠时，自动触发只会更快制造事故。

前三步不需要改造整套组织，几天内就能验证效果。后三步涉及平台、合规与生产权限，应该用真实指标逐步扩大。

## 这份手册最容易被误读的三点

第一，AI-native 不等于无人化。

Anthropic 的终点是“The loop keeps running, human judgement stays above it”。循环可以持续运行，但需求取舍、政策冲突、生产授权和责任归属仍然在人。

第二，工件越多不一定越规范。

`intent.md`、`spec.md` 和 `plan.md` 如果与代码脱节，只会制造一套新的文档债务。必须通过 Commit、Hook 或 CI 检查，让工件变更与实现同步，否则 Agent 会在过时上下文上高速犯错。

第三，Agent Review 不能替代验证系统。

模型审查可以压缩等待时间，但它仍可能漏掉同类错误。确定性测试、权限隔离、审计日志、回滚和生产指标不能省。Agent 适合处理需要判断的部分，机器规则负责不可越过的边界。

## 该用什么指标判断改造是否有效

不要看生成了多少代码，也不要看开了多少个 Agent。

更有用的是端到端指标：从想法到 `intent.md` 的时间、需求在 Build 后返工的次数、首次 Review 等待时间、自动解决的 Review 评论比例、逃逸到生产的缺陷、平均恢复时间，以及同类事故是否重复发生。

本质上，要衡量的是有用结果是否更快到达生产，同时风险有没有上升。

如果代码量翻倍，PR 排队时间也翻倍，那不是 AI-native，只是把拥堵从开发桌面搬到了审查队列。

## 最后

Anthropic 这份 Playbook 最有价值的地方，是把讨论从“模型会不会写代码”推到了“组织能不能消化 Agent 的产能”。

当 Build 不再最慢，软件工程不会变简单。需求质量、验证能力、权限边界和生产反馈会变得更重要。

未来高效的团队未必拥有最多 Agent。他们更可能早早把知识写成工件、把规则写成代码，并把验证接回每个步骤。

代码不再是瓶颈后，团队设计本身就成了产品。

## 参考资料

1. [Anthropic：The AI-Native SDLC Playbook](https://claude.com/blog/the-ai-native-sdlc-playbook)
2. [Claude Code：Skills 文档](https://code.claude.com/docs/en/skills)
3. [Claude Code：Settings 与 Hooks 文档](https://code.claude.com/docs/en/settings)
4. [Claude Code：GitHub Actions](https://code.claude.com/docs/en/github-actions)
