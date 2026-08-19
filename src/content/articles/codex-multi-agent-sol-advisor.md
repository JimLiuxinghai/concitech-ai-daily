---
title: "Codex 重大更新：一个 2000 Star 的社区项目，提前两周押中了什么？"
description: "社区项目 Sol Advisor 提前跑通跨模型调度，Codex 随后将它原生化。这个新能力究竟怎么用，又是否真的节约 token？"
slug: "codex-multi-agent-sol-advisor"
publishedAtCST: "2026-08-16T09:37:55+08:00"
language: zh
author: JimLiu
categories: [devtools, products]
cover: "/article-covers/codex-multi-agent-sol-advisor.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-VTCwhMTxkGOF_vAs8dKrtt4dcXGHkgRFVXlUdiTt5xE"
draft: false
---
8 月 15 日，Codex DX 团队的 Eric Provencher 发了一条很短的更新：支持 Multi-agent v2 的模型，现在可以把任务委派给任意受支持模型，包括 GPT-5.6 Luna。

单看这条推文，它只是“子 Agent 可以换模型”。把时间往前拨两周，意思就不一样了。

8 月 1 日，社区项目 Sol Advisor 在 GitHub 上发布。它给出的核心工作流几乎就是这次官方能力的示范答案：Sol 负责规划和调度，Luna 处理常规实现，Terra 接手复杂任务，再用一个全新上下文的 Sol 做最终审查。

社区先把跨模型 Agent 团队做成了产品，Codex 随后补上了原生调度能力。

这不是说 OpenAI 直接采用了 Sol Advisor 的代码，目前没有这方面的证据。但从时间线和功能形态看，官方确实把社区已经跑通的方向，从插件技巧变成了 Multi-agent v2 的标准能力。

## 社区先跑通了用法

Sol Advisor 发布时，Codex 已经有 Multi-agent v2，却缺少一个关键能力：Sol 看不到 `spawn_agent` 里的 `model`、`reasoning_effort` 和 `agent_type` 等路由参数。结果是，Sol 启动的子 Agent 往往继续继承 Sol，无法自然组成“Sol 调度、Luna 和 Terra 执行”的异构团队。

这个问题并非事后推测。OpenAI Codex 仓库 7 月 9 日就有人提交 Issue，标题直接写着：“GPT-5.6 Sol 无法指定子 Agent 模型，导致所有子 Agent 都是 Sol。”

Sol Advisor 的提交记录也留下了很清楚的痕迹。

最初版本直接要求每次派发都指定模型和推理强度；同一天，项目改成了另一条路：预先安装三份自定义 Agent TOML，用角色配置固定 Luna、Terra 和 Sol，再让主 Agent 按角色名派发。简单说，社区用配置层绕过了运行时路由能力的缺口。

8 月 15 日，Codex 把这个缺口补上了。Multi-agent v2 的父模型终于可以直接委派给任意受支持模型，Luna 也正式进入可选范围。同一天，Sol Advisor 又把默认执行路径调整为原生 Luna / Max。

所以，这次更新的重点不只是多了一个参数。它让 Sol Advisor 代表的社区实践，不再必须依靠预装角色和配置技巧才能实现。

## 官方原生化的，是模型路由

Codex 早就支持并行 Agent。你可以让不同线程分别检查安全问题、测试缺口和代码质量，最后由主线程汇总。

Multi-agent v2 往前走了一步：父 Agent 可以把不同任务交给不同模型，自定义 Agent 也可以单独指定 `model` 和 `model_reasoning_effort`。

例如：

- 主 Agent 用 GPT-5.6 Sol，负责理解模糊需求、拆任务、处理冲突和最终决策；
- 中间层用 GPT-5.6 Terra，负责需要判断的实现、代码审查、故障诊断和复杂验证；
- 大量执行层用 GPT-5.6 Luna，负责边界明确的实现、搜索、归类、查文档和批量扫描。

如果不指定模型，Codex 会自己在智能、速度和价格之间做选择；如果需要确定性，也可以把模型和推理强度固定在 Agent 配置里。

OpenAI 对三者的定位也很明确：GPT-5.6 适合需要规划、工具调用和持续验证的复杂任务；Terra 适合探索、长文件审阅等偏读取的工作；Luna 适合边界清楚、可重复、高吞吐的工作。

这不是简单的“强模型带弱模型”。准确地说，是让模型能力、推理预算和任务不确定性匹配。

## 一套 Agent，不该人人都是专家

很多多 Agent 演示有一个隐含问题：所有 Agent 都跑同一个最强模型。

这种做法通常能提高覆盖率，却也会迅速放大 token 消耗。更麻烦的是，任务越简单，昂贵推理的浪费越明显。让最强模型同时负责搜索文件、读取日志、整理链接和做架构决策，就像让总架构师负责逐行清点仓库。

模型路由提供了另一种组织方式：

**Luna 扩大搜索面，Terra 提高证据质量，Sol 承担最终责任。**

它与混合专家模型有一点相似，只不过路由发生在应用层：不同 Agent 有独立上下文、工具、权限和工作说明，主 Agent 根据任务继续派发、追问或终止。

这里的瓶颈不在并发数，而在主 Agent 的判断力。它必须知道什么可以低成本试错，什么必须升级处理，什么根本不该拆开。

## 省的不是 token，而是 Sol token

从节约 token 的角度看，这件事很容易被说反。

OpenAI 的文档明确提醒：与同类单 Agent 任务相比，子 Agent 工作流通常会消耗更多 token。每个线程都要读取指令、调用工具、维护上下文并返回摘要；父线程还要接收结果、处理冲突和继续验证。Sol Advisor 又增加了强制复验和全新 Sol 终审，总 token 很可能进一步上升。

所以，多 Agent 本身不是 token 优化器。它优化的是 token 的分配。

以当前 API 文档的每百万 token 价格为例：

| 模型 | 输入 | 输出 | 相对 Sol 单价 |
|---|---:|---:|---:|
| GPT-5.6 Sol | 5 美元 | 30 美元 | 100% |
| GPT-5.6 Terra | 2 美元 | 12 美元 | 40% |
| GPT-5.6 Luna | 0.2 美元 | 1.2 美元 | 4% |

三款模型的输入和输出价格刚好保持相同比例。也就是说，同样数量的 token，Luna 约是 Sol 成本的 1/25，Terra 约为 Sol 的 2/5。

假设原来一个任务需要 100 份 Sol token。改成跨模型后用了 20 份 Sol、20 份 Terra 和 100 份 Luna，总 token 从 100 增加到了 140；按 API 单价折算，成本却从 100 个相对单位降到 32 个。

这只是说明原理，不是 Sol Advisor 的实测数据。该项目目前没有公布真实仓库上的 token、耗时和成功率基准，而且 API 单价也不能直接换算成 Codex 订阅套餐的周额度。

如果目标真的是控制 token，而不只是体验多 Agent，我会加上五条约束：

- 小任务不拆，单文件修改优先使用一个 Agent；
- 搜索、分类和日志分析使用 Luna 的 low 或 medium，不默认拉到 Max；
- 子 Agent 只接收必要文件、明确问题和验收标准，不复制主线程全部历史；
- 返回文件引用、结论和关键证据，不回传整段日志或重复粘贴完整 diff；
- 同时记录总 token、Sol token 占比、模型加权成本和最终成功率，不能只看并发速度。

从这个角度说，Sol Advisor 更像成本路由器，而不是 token 压缩器。它是否省钱，取决于 Luna 承担的实现量，能不能覆盖新增的 Sol 规划、父线程复验和 Sol 终审开销。

## 最佳用法：并行读，分区写，集中验收

如果只记住一条实践原则，我会选这一条：

> 读取和取证可以并行；写入必须划清文件所有权，同一个文件只保留一个执行者；验证与验收回到主线程。

OpenAI 的文档也给出了相近的边界：子 Agent 最适合代码探索、测试、故障分诊、资料比较和摘要；对多个 Agent 同时修改共享状态要更谨慎，因为冲突和协调成本可能吃掉并行收益。Sol Advisor 又往前加了一步：执行可以交给 Luna 或 Terra，但父线程必须检查完整 diff 并重跑验证。

基于这个原则，下面五种场景最值得尝试。

### 1. 大型代码库的地图绘制

先让多个 Luna Agent 分别扫描入口、数据流、权限路径、测试和依赖，每个 Agent 只返回文件、符号、调用关系和证据。再让 Terra 检查遗漏与矛盾，最后由 Sol 决定修改方案。

价值不只是更快。更重要的是，海量搜索结果不会污染主线程，主 Agent 看到的是压缩后的代码地图。

### 2. PR 审查流水线

可以把一个 PR 拆成正确性、安全、并发、测试覆盖和兼容性五个独立视角。简单扫描交给 Luna，风险复核交给 Terra，主 Agent 去重、排序并验证高风险结论。

这比“让五个 Agent 都完整审一遍”更经济，也更容易发现每条结论是怎么来的。

### 3. 前端与浏览器故障诊断

一个 Luna Agent 画出前后端代码路径，一个 Terra Agent 在浏览器里复现问题、收集控制台和网络证据，主 Agent 根据两边结果选择唯一的实现者。

关键是先复现、再定位、最后修改，而不是三个 Agent 同时猜问题并改代码。

### 4. 长文档与多来源研究

按章节、来源或假设拆给多个 Luna Agent，要求它们只返回结构化事实和出处；Terra 负责交叉验证，Sol 负责形成判断。

这种方式特别适合技术选型、竞品研究、法规核对和超长上下文分析。子 Agent 的意义不是替主 Agent 写更多字，而是把噪音隔离在独立上下文里。

### 5. 测试与评估矩阵

让 Luna 并行跑不同环境、输入和失败类型的测试，Terra 分析不稳定样本，主 Agent 只接收失败聚类、复现步骤和关键日志。

同样的架构还能用于 Prompt 回归测试：廉价模型负责铺开样本，较强模型只裁决边界案例。

## 可以直接照抄的配置

先把并发控制在 3 到 4 个，不要一开始就追求“Agent 军团”。项目级配置可以放在 `.codex/config.toml`：

```toml
[agents]
max_concurrent_threads_per_session = 4
default_subagent_model = "gpt-5.6-luna"
default_subagent_reasoning_effort = "medium"
```

再定义一个只读探索 Agent：

```toml

name = "code_mapper"
description = "只读扫描代码路径，返回文件、符号和证据。"
model = "gpt-5.6-luna"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = """
定位入口、状态流转和相关测试。
引用具体文件与符号，不修改代码，不提前设计修复方案。
"""
```

复杂审查则升级到 Terra：

```toml
# .codex/agents/reviewer.toml
name = "reviewer"
description = "复核正确性、安全风险和测试缺口。"
model = "gpt-5.6-terra"
model_reasoning_effort = "high"
sandbox_mode = "read-only"
developer_instructions = """
只报告有证据、可复现、会影响行为的问题。
按风险排序，指出文件、符号、触发条件和缺失测试。
"""
```

日常使用时，一句话就能启动这套结构：

> 先让两个 code_mapper 分别扫描调用路径和测试覆盖，再让 reviewer 复核矛盾与高风险点。所有 Agent 只读，由主线程汇总证据、制定方案并完成唯一一次写入。

这段提示词里最重要的不是模型名，而是四个约束：任务边界、交付格式、权限和最终写入者。

## 官方补了原语，社区项目还没有过时

截至发稿，[Sol Advisor](https://github.com/DannyMac180/sol-advisor) 已经获得约 2,000 个 Star。Codex 原生支持跨模型委派后，它并没有失去价值，只是角色变了。

官方整合的是底层原语，解决“父 Agent 能把任务交给哪个模型”；Sol Advisor 留下的是上层工作流，解决“什么时候派给谁、交付什么、如何验收、失败后怎么办”。

它没有重新造 Agent Runtime，而是用 Codex 插件和 Skill，把路由策略、工作合同与质量门禁固化下来。这部分不会因为 `spawn_agent` 多了模型参数就自动出现。

它先把派单变成合同。Luna 和 Terra 拿到的不是一句随意指令，而是一份五段式工作包：目标、文件所有权、接口、约束和验证方式。执行者必须返回具体命令与实际证据；父线程把执行报告视为待核实的声明，仍要亲自检查 diff、文件范围和测试结果。

终审也被单独隔离。Sol 必须从一个全新线程开始，默认请求只读沙箱，只看目标、完整变更和验证证据。它只能返回 `ship`、`fix-first` 或 `rethink`。只要代码又发生修改，旧结论立即失效，必须重新验证和审查。

更细的一点，是这个项目在路由失败时选择停止，而不是悄悄换模型。安装器会检查三份 Agent 配置是否精确匹配，拒绝覆盖被修改或符号链接指向的文件；运行时还能核对实际启动的角色、模型、推理强度和沙箱类型。

我在本地用 Python 3.11 跑了项目自带的 `verify.sh`，三角色固定、安装幂等、冲突拒绝、运行时识别和 Shell 语法测试均通过。

它也有三个需要看清的边界。

- 它是一套由 Skill 和角色契约驱动的软编排，不是写死在调度器里的确定性状态机。Skill 本身不能替用户切换主会话模型，路由质量仍取决于 Sol 是否遵守协议。
- 项目把 Luna 固定在 Max，是“降低模型档位、保留推理强度”的质量取舍，不是 token-first 配置。若目标是减少推理 token，Luna medium 可能更合适，但那已经偏离 Sol Advisor 的原始合同，需要单独评估。
- 全新 Sol 终审能隔离实现过程的上下文偏差，但本质上仍是 Sol 审核 Sol 制定的架构。项目文档也明确承认，这不是跨模型家族的独立复核。

因此，Sol Advisor 最适合需求基本明确、实现步骤较多、又需要严格验收的中大型功能，以及迁移、公共 API 和高风险重构。一个文件里改几行代码，或者仍在快速试错的原型，没有必要走完这套流程。

它的安装方式也很直接，需要当前版本的 Codex、插件支持和 `jq`：

```sh
codex plugin marketplace add DannyMac180/sol-advisor --ref main
codex plugin add sol-advisor@sol-advisor
plugin_dir="$(codex plugin list --json | jq -r '.installed[] | select(.pluginId == "sol-advisor@sol-advisor") | .source.path')" && test -n "$plugin_dir" && test "$plugin_dir" != null && test -d "$plugin_dir" && test -f "$plugin_dir/scripts/install-agents.sh" && sh "$plugin_dir/scripts/install-agents.sh"
```

开启一个新的 Sol / High 会话后，使用：

> Use $sol-advisor:orchestration to build this feature, verify it, and obtain the fresh Sol review before reporting done.

如果不想安装插件，也值得抄走它的三条纪律：执行者只拥有明确的文件，父线程必须重跑验证，最后审查必须使用全新上下文。

## 路由看的是不确定性

不要按“职位名称”机械分配模型。两个都叫“代码审查”的任务，难度可能完全不同。

更合理的升级规则是：

- 目标明确、步骤重复、结果可验证：交给 Luna；
- 需要跨文件追踪、判断边界条件、处理相互冲突的证据：升级到 Terra；
- 需求模糊、失败代价高、需要取舍或最终签字：留给 Sol；
- Agent 连续两次得不到证据：不要继续堆并发，升级模型或重新拆任务；
- 涉及共享文件、生产操作和不可逆动作：收回到单一写入线程。

换句话说，路由器应该观察的是不确定性、可验证性和失败成本，而不是任务听起来是否“高级”。

## 这里还有一个容易混淆的地方

目前 Codex 的自定义子 Agent 与 Responses API 的 Multi-agent beta 不是完全相同的产品形态。

Codex 文档已经支持在 Agent 文件中分别指定模型与推理强度；而 Responses API 当前的 Multi-agent 请求里，子 Agent 仍共享该次请求的模型和工具。后者解决的是单次 API 调用内的并行协作，前者才更接近这次推文所说的跨模型委派。

如果不区分这两层，很容易误以为任何 `multi_agent.enabled` 请求都已经能自动混用 Sol、Terra 和 Luna。

目前还不是。

## 想象空间：从“Agent 团队”到模型操作系统

我更关心的不是做一个花哨的虚拟公司，而是让项目拥有一张可版本管理的“计算组织图”。

`.codex/agents` 里的每个文件，都可以同时定义岗位、模型、推理预算、工具、技能和沙箱权限。它不再只是一组 Prompt，而是项目运行方式的一部分。

再往前一步，理想的调度器可以根据历史成功率、预计 token、上下文大小、任务风险和截止时间动态选模型：先用 Luna 扩大搜索面，证据不足时升到 Terra，只有出现冲突或高风险决策时才调用 Sol。完成后，再把结果质量和实际成本写回评估系统。

这部分目前更多是架构推演，不是 Codex 已经完整提供的自动能力。但 Multi-agent v2 已经补上了一个关键前提：不同 Agent 终于不必绑定同一种模型。

一旦模型、推理强度、权限和工具都能按任务调度，多 Agent 的竞争重点就会变化。

比的将不再是谁能同时启动更多 Agent，而是谁能用更少的高价推理，稳定得到更好的最终结果。

## 最后

多 Agent 最危险的误区，是把并发本身当成智能。

有效的系统应该反过来：先减少主线程里的噪音，再扩大可并行的证据收集；先限制写权限，再增加读取并发；先定义升级条件，再考虑模型数量。

Sol Advisor 先证明了一种组织方式：便宜的模型承担规模，较强的模型承担判断，最强的模型承担责任。Codex 这次更新，则把它最难绕过的跨模型委派做成了原生能力。

社区不必再花力气证明“能不能派给 Luna”，可以继续解决“什么时候升级到 Terra”“什么证据才能交付”“怎样评价总成本”这些更难的问题。

这才是两条信息放在一起后，Codex Multi-agent v2 打开的想象空间。

## 参考资料

1. [Eric Provencher：Multi-agent v2 支持委派给任意受支持模型](https://x.com/pvncher/status/2088641056237580632)
2. [Sol Advisor 仓库](https://github.com/DannyMac180/sol-advisor)、[初始提交](https://github.com/DannyMac180/sol-advisor/commit/ba392f4)与[自定义 Agent 路由提交](https://github.com/DannyMac180/sol-advisor/commit/bbc3dc1)
3. [OpenAI Codex Issue #31814：Sol 无法指定子 Agent 模型](https://github.com/openai/codex/issues/31814)
4. [OpenAI：Codex Subagents 配置与模型选择](https://learn.chatgpt.com/docs/agent-configuration/subagents)
5. [OpenAI：Responses API Multi-agent 指南](https://developers.openai.com/api/docs/guides/responses-multi-agent)、[GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol)、[Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra)与[Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna)模型说明
