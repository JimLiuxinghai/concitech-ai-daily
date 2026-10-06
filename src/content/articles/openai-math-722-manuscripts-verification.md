---
title: "OpenAI 公开 722 篇数学手稿：独立顾问团划清责任边界"
description: "OpenAI 的数学仓库收录 722 篇手稿、372 个成果系列，包含论文、部分 Lean 形式化文件和推理摘要。独立顾问团强调咨询与背书的区别。证明核验、学术归属和人类理解构成后续任务。"
slug: "openai-math-722-manuscripts-verification"
publishedAtCST: "2026-10-07T07:20:00+08:00"
language: zh
author: JimLiu
categories: [research]
cover: "/article-covers/openai-math-722-manuscripts-verification.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-VZzWwF8iiQI7qBO99M_IqACY9vB2p-HpH5_PT2Rdkom"
draft: false
---

[OpenAI 公布了一座数学成果仓库](https://x.com/openai/status/2107596713791767021)。[仓库首页](https://github.com/openai/math)标注两个数字：**722 篇手稿，372 个成果系列**。它们出自一款内部模型；模型公开访问渠道缺席。手稿 PDF、部分 Lean 形式化文件和推理摘要进入公众视野。

手稿数量反映文件规模。成果系列把主论文、配套论证、推论与替代证明归在一起。正确性、原创性和数学价值属于三项不同的审查任务。

## 722 篇手稿包含什么

[README](https://github.com/openai/math#readme)描述了仓库结构。`preprints/` 收录论文 PDF 与源文件；`lean/` 收录部分结果的形式化证明；`reasoning_traces/` 收录选定结果的模型推理摘要。README 明言：成果处于不同验证阶段，未形式化结果存在出错风险。OpenAI 承诺保留公开版本历史，修订与勘误会形成新版本。

目录中的题目包括“准黎曼猜想”和“有理数域上的希尔伯特第十问题”。这些名称来自[手稿目录](https://github.com/openai/math/blob/main/CONTENTS.md)，代表论文主张，属于待核验材料。数学界的接受状态需要独立证据。

![OpenAI 数学仓库的两个数字：722 篇手稿与 372 个成果系列；两者采用不同计数单位](/article-images/openai-math-722-manuscripts-verification/release-numbers.webp)

OpenAI 披露了生成流程：模型接受约 4000 道题目；大部分结果采用同一套流程；单项结果的平均计算量约为三小时的 ChatGPT Pro thinking compute。仓库经过成果聚合与重要性筛选。4000 是输入题目数，372 是筛选后的系列数。这两个数字的比值与模型解题成功率属于不同口径。

## Lean 证明解决哪一层问题

Lean 是定理证明器。仓库的[形式化目录](https://github.com/openai/math/blob/main/lean/formalization.yaml)列出部分手稿的机器可检查证明，仓库还提供[复核说明](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/README.md)。这些材料提高了可检查性；它们覆盖的范围小于整座手稿仓库。

[Lean 官方文档](https://lean-lang.org/doc/reference/latest/ValidatingProofs/)给出关键边界：内核接受一段证明，意味着形式化陈述能够由所用定义、定理与公理推出。数学家承担另一项审查：形式化陈述与自然语言论文的命题是否一致。依赖的公理、引用的前人工作和结果的重要性构成其他核验对象。

![数学结果的核验链：手稿、形式化陈述、专家审查与学术吸收；Lean 核验覆盖其中一层](/article-images/openai-math-722-manuscripts-verification/verification-chain.webp)

一份可编译的 Lean 文件属于强证据。它与“全部 722 篇手稿已获确认”之间存在距离。缺少 Lean 文件的手稿需要人工证明审查；拥有 Lean 文件的手稿需要命题对应与学术价值审查。

## 顾问团声明：咨询职责与成果背书分离

OpenAI 称，发布方案参考了数学与人工智能独立顾问团 AGMAI 的建议。[AGMAI 的发布当日声明](https://agmai.org/statement-oct6/)划出边界：顾问身份属于程序建议，成果认可属于数学共同体。顾问团把公开材料视为人类理解过程的起点。

[顾问团的发布建议](https://agmai.org/general-sep29/)提出两项要求。第一，AI 公司应提供模型、提示词、生成过程摘要、计算耗时和成本等材料，披露形式化状态。第二，研究共同体需要独立存储、长期引用和理解成果的资源支持。顾问团建议使用独立于 AI 公司的学术仓库，提倡数学家主导吸收过程。

这次发布提供手稿目录、部分形式化证明和选定结果的推理摘要。材料存放于 OpenAI 的 GitHub 仓库；README 写有社区托管仓库的探索计划。开放文件是一项进展，独立保存与同行审查是另外两项工作。

![OpenAI 与独立顾问团的责任边界：公司公开材料，数学共同体评估结果](/article-images/openai-math-722-manuscripts-verification/responsibility-boundary.webp)

读者需要记住三个计数单位：722 是手稿数，372 是成果系列数，经过共同体确认的数学突破数缺少统一统计。OpenAI 展示了模型产出的规模；证明的正确性、方法的原创性和概念的传承，需要数学家的工作。仓库提供了审查入口，学术结论来自审查工作。

## 参考资料

- [OpenAI：数学成果发布推文](https://x.com/openai/status/2107596713791767021)
- [OpenAI 数学成果仓库：README、目录与形式化材料](https://github.com/openai/math)
- [OpenAI：数学与人工智能顾问团公告](https://openai.com/index/advisory-group-on-mathematics-and-ai/)
- [AGMAI：对 OpenAI 数学成果发布的声明](https://agmai.org/statement-oct6/)
- [AGMAI：AI 生成数学成果的发布建议](https://agmai.org/general-sep29/)
- [Lean 官方文档：证明核验](https://lean-lang.org/doc/reference/latest/ValidatingProofs/)
