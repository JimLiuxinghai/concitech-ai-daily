---
title: 黎曼猜想证明通过核验！Meta 首席 AI 官追问，谁掌握下一代 AI 的研发方向？
description: >-
  Alexandr Wang 把黎曼猜想的证明视为超智能的信号。数学推理、实验闭环和研发控制权各有证据要求。文章结合 Lean 核验及 AI
  研发数据，解释人类决策权的含义。
slug: meta-wang-superintelligence-human-control
publishedAtCST: '2026-11-24T07:19:36+08:00'
language: zh
author: JimLiu
categories:
  - research
  - policy
cover: /article-covers/meta-wang-superintelligence-human-control.webp
draft: false
---

Meta 首席 AI 官 Alexandr Wang 的长文《Superintelligence is Arriving》发布于北京时间 11 月 23 日。他的切入点是黎曼猜想，落点是一个关于控制权的问题。AI 参与下一代模型的研发之后，谁决定研究目标、实验范围和部署条件？

Wang 的判断很大胆。AI 的推理能力足以进入许多领域的前沿，限制进展的是领域知识、实验条件和反馈速度。他预计 AI 研究将走向自动化，人类的理解和监督面临时间压力。他希望行业选择一条能扩大人类自主权的发展路径。

这篇长文的论证围绕两个时间点展开。第一个是 o3 的竞赛数学表现，第二个是 Claude 参与的黎曼猜想证明。

## 167 年的数学难题，核验到了哪一步？

11 月 20 日，数论学家 Levent Alpöge 发布与 Claude 合作的黎曼猜想证明材料。黎曼猜想关心 ζ 函数的非平凡零点是否全落在实部等于 1/2 的直线上。这个命题关联素数计数的误差范围。它的提出年份是 1859 年。

11 月 21 日，Lean FRO 和 Mathlib Initiative 发布联合声明，确认经典黎曼猜想的形式化命题和证明有效。社区比较了 Alpöge 证明的结论与 Mathlib 的标准定义，并用多个检查器验证了导出的证明。MIT 数学家 Andrew Sutherland 的报告记录了独立构建、证明导出一致性和内核核验。克雷数学研究所的项目页列为 **Active**。

这项证据确立了一件具体的事。**人类研究者和 AI 的协作，产出了一个顶级开放数学问题的可复核证明。** 后续数学工作还包括理解证明的主干，辨认其中的新方法，以及寻找更短的论证。

## 从 AIME 到科研，中间差一套验证方式

Wang 回想起 2024 年末 o3 的数学竞赛表现。他的看法是，AIME 难题需要复杂推理。模型具备这项能力之后，代码、商业等领域的落地取决于领域信息、工具和任务环境。

2025 年正式发布版 o3 的公开结果提供了一项参照。OpenAI 报告的 AIME 2025 单次正确率是 98.4%，测试条件包含 Python 工具。竞赛题有确定的题意和标准答案。原始长文提及的 2024 年末是预览场景，98.4% 对应后续正式版本的评测结果。

![竞赛数学、形式化证明和实验研究的验证方式](/article-images/meta-wang-superintelligence-human-control/01-evidence-types.webp)

数学推理提供新的理论起点。实验研究有自己的证据链。一项预训练设想需要选择数据、确定对照、分配算力、观察收敛和复现实验。一次小模型实验的收益能否迁移到大模型，属于另一条待检验的命题。

软件工程的证据来自不同环节。测试是补丁的验收依据之一。确认需求、选择可维护的方案、评估生产环境的后果，需要团队掌握更多信息。系统边界、验收规则和责任分配决定模型能承担哪一段工作。

## AI 参与 AI 研发的证据

OpenAI 11 月发布的内部研发报告提供了一组估计。3 月至 10 月，预估需要人类工程师 2 至 4 小时的研究任务，Agent 独立成功率从 23% 升到 46%。预估需要 4 至 8 小时的任务，估计值从 13% 升到 35%。

任务分项的差异更大。监控训练运行的估计成功率是 79%，启动训练是 35%，编写推理与服务系统代码是 25%。报告的范围是 OpenAI 内部任务。指标反映各类任务的自动化程度。

![OpenAI 内部研发报告披露的分任务估计成功率](/article-images/meta-wang-superintelligence-human-control/02-research-task-rates.webp)

报告记录了 Codex 对 GPT-6.2 Astra 预训练思路的贡献。受访研究员描述了人机协作的过程，一位研究员称 Codex 建议的改动让方案取得成效。

Wang 关心的是这些局部能力能否连接成闭环。一个模型帮助提出训练改动，团队验证改动，收益进入下一代模型，新模型参与后续研究，这就是递归改进的基本过程。算力预算、实验有效性和人类授权决定这个过程的速度和范围。Wang 关于全流程自动化的判断属于对这一过程的外推。

## 谁决定研究目标，谁承担部署后果？

Wang 的结尾把讨论引向人类自主权。他批评一种行业预设。这种预设视超智能为必然，视安全交付为行业的唯一问题。他关心的结果是普通人获得更强的行动能力，有权决定技术服务什么目标。

这项主张对应三个具体的决定。研究议程由谁制定，重大实验与权限扩大由谁批准，部署后出现问题由谁负责暂停和回退。改进训练算法的 Agent 涉及三种权限，提出实验、消耗算力、启用新版本。每一种授权都有不同的影响范围。

黎曼猜想的案例给出了一个具体参照。作者交付了可检查的证明，独立社区给出了公共核验。AI 研发的下一项难题是建立同样可复查的决策链。模型可以提供候选方案，项目需要留下实验依据、权限记录和签字人。研究成果的用途需要人类作出决定。

## 参考资料

- [Alexandr Wang 的 X 长文](https://x.com/alexandr_wang/status/2124636606959345776) · [Meta 对 Wang 职务的署名](https://about.fb.com/news/2025/10/teen-ai-safety-approach/)
- [Alpöge 发布说明](https://alpo.ge/remark.pdf) · [Lean 与 Mathlib 核验声明](https://leanprover-community.github.io/blog/posts/riemann-hypothesis/)
- [MIT 核验记录](https://math.mit.edu/~drew/grh/) · [克雷数学研究所项目页](https://www.claymath.org/millennium/riemann-hypothesis/)
- [OpenAI o3 发布与 AIME 评测](https://openai.com/index/introducing-o3-and-o4-mini/)
- [OpenAI 内部研发加速报告](https://openai.com/index/research-acceleration-jagged-frontier/)
