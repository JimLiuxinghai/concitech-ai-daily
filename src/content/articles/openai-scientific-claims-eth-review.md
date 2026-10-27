---
title: OpenAI 宣称推翻 ETH：数百篇论文的前提，进入复核视野
description: >-
  OpenAI 公布数学、计算机与物理三项成果，ETH 反证涉及众多条件性复杂度结论。公开手稿、Lean
  形式化与专家审读代表不同验证环节。本文介绍三项主张、公开资料与影响边界，区分次指数算法、P vs NP 和杨–米尔斯质量间隙。
slug: openai-scientific-claims-eth-review
publishedAtCST: '2026-10-27T09:42:20+08:00'
language: zh
author: JimLiu
categories:
  - research
cover: /article-covers/openai-scientific-claims-eth-review.webp
draft: false
wechatMediaId: qwac_8j4kaaga6WV5YUa-VrotygDcov-r59Nbzz3OYrjdAaAoME7KAf3jRlo7IG1
---

一项关于计算难度的假设，支撑了数百篇论文的条件性结论。OpenAI 公布了一份反证，公开仓库包含自然语言手稿与 Lean 形式化材料。

这项假设叫 ETH，指数时间假设。

OpenAI 的 [10 月 26 日公告](https://openai.com/index/building-scientific-understanding-with-academic-communities/)包含三项科学成果主张：所有维度的局部光滑猜想、ETH 的反证，以及四维量子场论的存在性构造。

**这是发布方的成果声明与公开复核安排。材料的公开、形式化验证与学界确认，是三个环节。**本文负责新闻核对，完整证明的独立复算属于另一项工作。

## 数学：波的聚焦，与所有维度的 Kakeya 问题

局部光滑猜想由 Sogge 提出，时间是 1991 年。一个直观解释是：波的极端聚焦与时间平均下的表现存在差别，猜想关注聚焦的持续性及其定量限制。

OpenAI 称，其模型给出了所有维度的证明，该证明的推论包括 Kakeya 猜想和 Stein 限制猜想的相关结论。自然语言手稿与形式化材料的入口是 [openai/math 仓库](https://github.com/openai/math)。

仓库的 [形式化范围说明](https://github.com/openai/math/blob/main/lean/docs/079.md)列明了维度、参数和损失项。它包含欧氏半波的局部光滑估计、Kakeya 极大算子估计，以及 Kakeya 集的满 Hausdorff 维数等结论。

Kakeya 的一个几何图景是：一个集合包含每个方向的一条单位线段，这种集合的维数受到什么限制？问题的表述简单，相关估计牵连调和分析中的一组难题。

维度范围与端点参数范围，是两个问题。“所有维度”的说法需要搭配手稿中的具体定理条件，形式化说明提供了核对入口。

![三项科学成果的主张与资料公开范围](/article-images/openai-scientific-claims-eth-review/three-claims.webp)

*图：发布方的三项成果主张与资料状态。图示描述发布安排，学界确认属于后续验证环节。资料核对日期：2026 年 10 月 27 日。*

## 计算机：ETH 的反证，改变哪种“困难”

布尔可满足性问题研究真假变量与逻辑约束：满足全部约束的一组取值存在吗？3-SAT 限制了每个子句的大小，是复杂度理论中的基本问题。

ETH 的常见表述，排除了以变量数为参数的 3-SAT 次指数时间算法。Impagliazzo、Paturi 与 Zane 的 [原始研究](https://www.ccs.neu.edu/home/viola/classes/papers/ImpagliazzoPaturiZane01Which.pdf)讨论了这些问题之间的次指数归约关系。

OpenAI 公布的 [ETH 形式化范围说明](https://github.com/openai/math/blob/main/lean/docs/378.md)描述了一台确定性机器及其固定子句宽度公式的精确计数能力。该机器的运行时间具有次指数因子，空间使用量具有多项式界。说明保留了输入编码长度与变量数的区别。

这个结论的潜在影响，来自复杂度研究中的条件性下界。

一个示意命题的形式是：**`ETH ⇒ 某种算法下界`**。这条推导的结构是 `A ⇒ B`。A 的反证使 B 失去这条前提支持，但归约证明的逻辑正确性与假设的真实性，属于不同问题。

这要求相关研究分类：依赖 ETH 的复杂度下界、使用其他假设的结论、独立成立的算法或归约。整篇论文的作废，缺少这种分类提供的依据。

研究者需要辨认的是每条结论的前提，研究方向的变化需要新算法与新证明。

## ETH 与 P vs NP，隔着什么

次指数算法与多项式算法存在差别。

一个示意函数是 `2^√n`。它属于次指数增长，其渐近增长速度超过任何固定次数的多项式。这个例子说明，指数时间假设的反证缺少“3-SAT 获得多项式时间算法”的必然含义。

P vs NP 询问的是一类可验证问题与高效求解能力之间的关系。[Clay 数学研究所的说明](https://www.claymath.org/millennium/p-vs-np/)介绍了这个问题。ETH 属于具体的精细复杂度假设，其反证与 P=NP 的证明，具有不同的逻辑强度。

“理论时间界改善”与“实际软件提速”，属于另一组区别。隐藏常数、适用规模、数据结构与实现成本，决定理论算法的工程价值。公开主张的成立，提供的是算法研究的新问题，缺少通用应用的交付承诺。

OpenAI 公布的复核安排由 **Russell Impagliazzo、Ramamohan Paturi 和 Ryan Williams** 牵头。前两位参与了 ETH 的提出，Williams 具有相关算法与下界研究背景。人员参与与结论背书，属于不同信息。

## 物理：存在性，与质量间隙的区别

OpenAI 的第三项主张涉及四维相互作用量子场论的严格存在性，包括 QCD 以及包含标准模型场内容的一种统一理论补全。纯杨–米尔斯理论的存在性，是其中的子问题。

公开公告描述的物理审读组由 **David Gross** 牵头，成员包含 Michael Douglas、Arthur Jaffe、Igor Klebanov 与 Nikita Nekrasov。原始证明产物的公开时间由合作组决定。

这限制了外部读者的独立检查范围。物理部分的公开信息，属于发布方说明与合作安排。

**“纯杨–米尔斯存在性”与“完整千禧年难题的解决”，存在范围差别。**

Clay 的 [正式问题描述](https://www.claymath.org/wp-content/uploads/2022/06/yangmills.pdf)要求四维非平凡量子杨–米尔斯理论的存在，并要求正的质量间隙。存在性与质量间隙，构成两项要求。

一个通俗区分是：存在性回答数学对象的严格构造，质量间隙回答真空之上的激发谱结构。OpenAI 公告强调的是存在性，完整千禧年难题的完成需要另一组证据与认定。

## Lean 验证，增加什么证据

Lean 的价值是形式化推理检查。数学定义、定理陈述与证明对象进入同一套可检查的逻辑体系。

[Lean 官方验证指南](https://lean-lang.org/doc/reference/latest/ValidatingProofs/)区分了两个问题：证明的有效性，以及定理陈述的含义。指南介绍了公理依赖检查、内核复查和外部检查器等验证层级。

人类审读的任务包含检查形式化陈述与原问题的对应关系、假设范围、概念解释，以及证明与既有工作的联系。这些任务与机械验证具有互补性。

![科学成果的验证环节与职责](/article-images/openai-scientific-claims-eth-review/verification-layers.webp)

*图：发布材料、形式化检查与专家审读的职责区别。证据链的环节具有不同任务；图中各环节的完成状态需要对应记录。*

公开仓库提供了 [Comparator 配置](https://github.com/openai/math/blob/main/lean/ComparatorChallenges/SubexponentialSAT.json)，其验证目标指向实际证明模块，并列出允许的标准公理。声明模板与实际证明模块的区别，需要验证配置的配合说明。

一段截图、一个通过提示或一份文件名，缺少替代这条检查链的能力。本文引用的是发布方的形式化说明与公开配置，独立复现属于额外工作。

## OpenAI 的选择：放弃学术功劳诉求

公告提出了学术功劳诉求的放弃，并主张研究者获得其理解、说明文稿与其他产物对应的认可。合作原则包含透明、志愿参与和结论独立。

这提供了一种 AI 科研分工：模型生成证明产物，专家建立可理解的论证与边界，社区完成审查与传播。

“发现一个结论”“验证一份证明”“建立一套解释”，具有不同价值。科学共同体需要识别每种贡献的承担者。

我的判断是，这次发布的检验题有两道：三项证明的数学内容，以及 AI 生成材料进入学术验证体系的路径。第一道检验成果的成立，第二道检验其他研究者的使用与复核能力。

**我关注 ETH 专家组的公开结论，以及具体定理、验证产物与修订记录的对应。**数百篇论文前提的改变，需要这类可检查的证据。

## 参考资料

1. [OpenAI：与学术共同体建立科学理解，2026 年 10 月 26 日](https://openai.com/index/building-scientific-understanding-with-academic-communities/)
2. [GitHub：openai/math 仓库](https://github.com/openai/math)；[局部光滑形式化范围](https://github.com/openai/math/blob/main/lean/docs/079.md)；[ETH 形式化范围](https://github.com/openai/math/blob/main/lean/docs/378.md)
3. [Impagliazzo、Paturi、Zane：次指数复杂度研究原文](https://www.ccs.neu.edu/home/viola/classes/papers/ImpagliazzoPaturiZane01Which.pdf)
4. [Clay：杨–米尔斯存在性与质量间隙正式问题](https://www.claymath.org/wp-content/uploads/2022/06/yangmills.pdf)；[P vs NP](https://www.claymath.org/millennium/p-vs-np/)
5. [Lean：形式化证明验证指南](https://lean-lang.org/doc/reference/latest/ValidatingProofs/)
