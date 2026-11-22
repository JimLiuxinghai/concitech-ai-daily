---
title: OpenAI 公布内部模型损失 0.732！首席科学家的 2027 年 AI 研发「雪崩」推演
description: >-
  OpenAI 公布基础模型的预训练损失。内部模型点是 0.732，0.68–0.70 是能力推演区间。首席科学家 Jakub Pachocki
  提议设行业共同上限，跨线条件包括可验证的监测里程碑。
slug: openai-perplexity-2027-pretraining-avalanche
publishedAtCST: '2026-11-23T06:00:47+08:00'
language: zh
author: JimLiu
categories:
  - research
  - policy
cover: /article-covers/openai-perplexity-2027-pretraining-avalanche.webp
draft: false
---

**OpenAI 的预训练曲线多了一个内部模型点，数值是 0.732。**

首席科学家 Jakub Pachocki 的文章《Perplexity and Intelligence》公布了一组公司内部使用的训练指标。图中有 GPT-3.5、GPT-4、GPT-6.2 Astra 的历史分数，以及一个标作「Internal model」的点。图下方的 0.68–0.70 色带对应作者对未来能力的推演。

Pachocki 的 X 帖提出了行业安全上限。前沿实验室应讨论可共用的安全门槛。跨越开发上限的条件是可核验的行为监测里程碑。

## 0.732 衡量的是下一 token 预测

语言模型给每个候选 token 分配概率。正确 token 获得的概率越低，模型承担的预测损失越高。这些预测损失的平均值是交叉熵。图中的 log-perplexity 是困惑度的对数，对应这项平均损失。

OpenAI 的测试材料来自一份固定的**内部代码库留出集**。留出集给模型的预测表现提供评估样本。这份图的刻度取决于语料、分词方式和统计口径，跨公司比较需要可比的评估协议。

![OpenAI 基础模型对数困惑度曲线与作者推演区间](/article-images/openai-perplexity-2027-pretraining-avalanche/01-pretraining-loss-chart.webp)

官方图表的数据包含几处关键节点。

- **0.986 与 0.913** 是 GPT-3.5 和 GPT-4 的基础模型分数。
- **0.761** 是 GPT-6.2 Astra 的图表分数，旁边的注释提到千禧年数学难题。
- **0.732** 是 2026 年 11 月的内部模型数据点。方点与公开模型的折线分开标注。
- **0.68–0.70** 是 Pachocki 对近期进展的外推区间，能力清单和测试定义有待研究。

0.761 和 0.732 的数值差是 0.029。它衡量两种基础模型对这份代码样本的平均预测损失差。

## 2027 年的「雪崩」指向 AI 研发

Pachocki 的推演起点是数学。他说，OpenAI 有一年以上的公开难题评估历史，约 0.76 的基础模型一代带来了一批此前难以获得的数学成果。OpenAI 9 月公开的 Navier–Stokes 论文和 Lean 形式化是相关例子。克雷数学研究所的问题页标注状态为 Active。

图上的 0.761 是基础模型分数。数学解题系统的材料涉及强化学习后的模型、多智能体合作和工具执行。历史结果让研究者看到能力变化，这些数学结果的适用范围取决于模型和解题系统的组合。

Pachocki 接下来的问题是，**AI 能否为训练下一代 AI 提出更好的预训练方法？** 编写实验代码和提出新的训练算法，是两类研究贡献。预训练实验决定哪些新算法进入下一代模型。

OpenAI 的另一份研究报告给了两个例子。受访研究员称，Codex 帮他们找到了 GPT-6.2 Astra 预训练中的关键思路。另一位受访者称，Codex 建议的改动让人类提出的方案取得成效。这些经历来自内部研究员的回顾。

Pachocki 视 2027 年为预训练基础进展集中出现的潜在窗口。他的文末注明，2026 年曲线加速的主要归因是长期研究与算力投入，自动化是较小的因素。模型设计的参与有内部研究案例，研发周期的下一轮变化属于推演。

## 0.68–0.70 的未知项，是评估覆盖范围

Pachocki 预期 0.68–0.70 一带会出现影响重大的新能力。具体能力和现有测试的覆盖范围是未知项。公开图的色带表达的是预测，数值门槛和出现日期缺少实测结论。

这种不确定性给安全评估带来一个问题。测试集的设计依赖研究者能描述的能力。实际研究中的异常结果能提供能力线索和新测试题目。新能力的预测和风险判定需要各自的证据。

行为监测面临压力。OpenAI 11 月的监测研究发现，基础损失下降与缺少显式思维链时的推理能力提升相关。论文把相关测量称为代理指标。研究关注的是，任务复杂度增长之后的思维链信息含量。

## 一条安全线，三个执行问题

Pachocki 的提案包含困惑度和其他测量指标。他希望实验室建立共同的评估、红队测试与透明度规范，约定第一道开发上限，以及跨越门槛需要满足的条件。他举出的条件之一是思维链监测工具的后继方案达到具体里程碑。

![行业共同上限提案的测量、监测和跨线条件](/article-images/openai-perplexity-2027-pretraining-avalanche/02-shared-safety-limit.webp)

评论提出了三项执行问题。Dimitris Papailiopoulos 建议发布有代表性的公开验证集。John Wittle 希望第三方审计者获得更深入的访问权限。另一条回复追问行业承诺的范围。处于追赶位置的实验室是否愿意接受共同约束？Sam Altman 引用原帖，公开支持形成行业共同上限。

这几种意见谈的是同一项提案的不同条件。**指标要可比较，证据要可复查，参与方要明确。** 可比较需要一套评估协议，复查需要审计者接触原始证据，承诺需要明确谁在什么阶段承担约束。Pachocki 的文章给出了原则，行业边界的数值和实施安排有待讨论。

0.732 提供了一个实际的预训练观测点。下一项待验证的工作是可复查的行为监测方案。共同上限有没有约束力，取决于跨线所需的证据，以及谁有权判断这些证据合格。

## 参考资料

- [Pachocki 原推文](https://x.com/merettm/status/2124549218995949967) · [OpenAI 原文与图表](https://openai.com/index/perplexity-and-intelligence/)
- [OpenAI 数学论文与 Lean 材料](https://openai.com/index/navier-stokes-solution/) · [克雷数学研究所状态](https://www.claymath.org/millennium/navier-stokes-equation/)
- [OpenAI 的 AI 研发实证报告](https://openai.com/index/research-acceleration-jagged-frontier/) · [思维链可监测性研究](https://openai.com/safety-alignment/cot-monitorability-model-lifecycle/)
- [Altman 的回应](https://x.com/sama/status/2124551594691932405) · [公开验证集建议](https://x.com/DimitrisPapail/status/2124566074440171776)
- [第三方审计观点](https://x.com/JohnWittle/status/2124574672582771151) · [行业共同承诺的评论](https://x.com/MeganTec/status/2124601129413586954)
