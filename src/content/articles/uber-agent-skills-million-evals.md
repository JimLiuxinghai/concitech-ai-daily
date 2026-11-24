---
title: Uber 单月 Skill 调用破 100 万！5000 多个技能，靠什么管质量？
description: >-
  Uber 披露了企业内 5000 多个 Agent Skill 的管理方法。文章拆解调用遥测、数据仓库查询的消融盲评、单次成本估算，以及 Agent
  提报故障的流程。
slug: uber-agent-skills-million-evals
publishedAtCST: '2026-11-24T22:31:03+08:00'
language: zh
author: JimLiu
categories:
  - devtools
  - research
cover: /article-covers/uber-agent-skills-million-evals.webp
draft: false
---

两条 Agent 会话调用同一个 PR 技能。两次调用共用一份临时文件，提交说明发生串写。Uber 的工程文章把这件事当成一个 Skill 故障来处理。它有负责人、修复过程和回归测试。

Uber 的共享技能库从 2025 年 10 月的 1 个增长到一年后的 **5000 多个**。公司记录的 **2026 年 10 月 Skill 调用量超过 100 万次**，统计覆盖 Claude Code、Codex、OpenCode 和 Uber 自有 Agent。调用次数说明技能的使用规模。任务完成质量需要另一套证据。

## 87% 是一个 Skill 的盲评胜率

Uber 选取真实请求做消融实验。每条请求生成两份答案，两组分别启用和移除待测 Skill。评审看不到分组，选择质量更好的答案。其他轮次可以把 Skill 的部分段落移除，检验哪条说明产生了收益。

数据仓库查询 Skill 的实验结果是 **有 Skill 的答案赢了 87% 的比较**。对照组的工具调用次数多 13%，工具错误次数是 6 倍，耗时长 31%。四个数属于这一个查询 Skill 的测试。“6 倍”指错误次数的比值，分母是有 Skill 组的错误次数。“87%”的分母是这项任务的盲评比较次数。

![Uber 数据仓库查询 Skill 的四项消融指标，来源为 Uber Engineering](/article-images/uber-agent-skills-million-evals/01-warehouse-ablation.webp)

一项查询任务的质量有两层。结果层关心表格和结论的准确性。执行过程关心 Agent 选择的表、时间范围和工具调用顺序。错误的统计口径同样能产出看似正确的数字。Uber 给真实请求做轨迹评分，检查 Agent 的操作过程。固定输入和预期输出的用例有自己的角色，适合验证有明确答案的行为。

Uber 建议的用例配比约为 **5% 固定答案用例、80% 真实请求的轨迹评分、15% 作者评审**。这是工程经验给出的配比。作者保留了人工标注和重复评分，给模型评审提供比较基准。短指令和长指令的收益，取决于任务和模型的实际结果。

## 5000 多个 Skill，谁来维护？

Uber 的共享技能库用 Git 保留归属、变更历史和审查记录。团队技能属于 **Domain** 层，可以走本领域同行审批和 CI。广泛使用的技能进入 **Core** 层，由团队维护，平台团队审查变更。约 100 个通用技能属于 **Always-on** 层，纳入全员默认配置。

“默认可用”的内容有体积差别。Agent 的技能描述供任务匹配使用。完整的 `SKILL.md` 正文在触发后加载。脚本和参考文件随步骤读取。一个企业技能库的文件总量和单次会话的实际输入量是两套数字。

Uber 的内部命令行工具 **aifx** 负责不同 Agent 的配置和安装。仓库需求、团队配置和个人选择可以汇入同一套分发流程。Skill Workshop 则保存技能的目标、预期产物、允许的动作和目标模型，并用这些规格生成 `SKILL.md` 与测试提示。换模型或运行环境时，规格和用例可以继续对照。

## 一次调用的成本怎么算？

Agent 钩子负责采集 OpenTelemetry 使用事件。事件字段包括技能名、版本与触发方式，触发方式可区分用户输入命令和 Agent 主动选择。**这类使用事件的字段不含提示词正文和文件内容。** 事件数据可用于统计使用量、延迟、成本和错误。

成本估算来自会话累计费用的两张快照。一张来自调用前，另一张来自调用后。差额涵盖技能指令读取、时间窗内的后续对话与其他工具调用。这是一段执行窗口的费用估计，适合比较同一技能变更前后的开销。

Uber 把固定步骤放进脚本。受 Cloudflare Code Mode 启发，他们让脚本走工具网关，把任务需要的结果交回给 Agent。长工具定义和完整结果占用的上下文随之减少。成本较低的子 Agent 可以承担简单查询，主会话接收有长度约束的摘要。Uber 给出的一个追踪 Skill 案例，改造后的单次调用成本比改造前低 46%。另一个部署 Skill 的首周数据缺少同样的降幅。

## Agent 卡住了，谁会收到工单？

Uber 给 Agent 配了一个名为 `log-papercut` 的通用技能。Agent 遇到命令参数失效或配置查询异常时，可以提交一条结构化报告，写明做了什么、预期是什么、实际发生了什么以及建议修复。报告归到对应 Skill 的负责人名下。

![Uber 技能故障从登记、分派、修复到回归验证的流程](/article-images/uber-agent-skills-million-evals/02-feedback-loop.webp)

Uber 披露了三个月的统计数据，Agent 提报数千条，修复数百条。驳回和返工的 PR 构成新测试样本的来源。故障报告提供线索，修复和发布各有审查环节。

Skill 的寿命可以用三项信息判断。调用记录说明有没有人在用，消融实验说明它给任务带来了多少收益，故障与成本记录说明维护代价。模型升级后，一段指令的收益可能消失。一组可反复运行的测试，能给保留、改写或下线这个技能的决定提供依据。

## 参考资料

- [Uber Engineering 原文与数据图表](https://www.uber.com/us/en/blog/optimizing-ubers-agent-skills/) · [Uber Engineering 的 X 长文](https://x.com/ubereng/status/2125008806249930999)
- [Agent Skills 格式规范](https://agentskills.io/specification)
- [Cloudflare 对 Code Mode 的介绍](https://blog.cloudflare.com/code-mode-mcp/)
