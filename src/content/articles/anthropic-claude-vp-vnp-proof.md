---
title: Claude 交出 VP≠VNP 证明！P vs NP 的代数版有了新结果
description: >-
  昨天的 P=NP 话题有了后续。Anthropic 公开 Claude 的 VP≠VNP 论文和 Lean 4
  代码。两个问题各自计算什么，超多项式下界管什么，机器核验查到了哪一步？
slug: anthropic-claude-vp-vnp-proof
publishedAtCST: '2026-11-24T08:14:37+08:00'
language: zh
author: JimLiu
categories:
  - research
cover: /article-covers/anthropic-claude-vp-vnp-proof.webp
draft: false
---

我昨天那篇《P=NP 的证明会改变什么？》讨论了一个假设。P=NP 成立，排班、程序搜索和加密会发生什么变化？

说来就来。Anthropic 的 GitHub 仓库多了一个名叫 `vp-vnp` 的目录。里面有一篇论文和一套 Lean 4 证明。论文的结论是 **VP≠VNP，适用于所有域**。Anthropic 把发现归于一款内部研究版 Claude。

两个字母 **V** 决定了这条新闻的范围。论文的结论属于代数电路。克雷数学研究所页面上的经典 **P vs NP** 状态是「未解决」。

## 两个 V，换了哪道题？

昨天文章里的排班例子，问题是「有没有一份 100 小时内完工的排程？」答案是「有」或「没有」。P 关心能用多项式时间求解的判定问题，NP 关心「有」这类答案的证书能否用多项式时间核验。

VP 和 VNP 属于 Leslie Valiant 的代数复杂性框架。它研究的是一族多项式所需的运算步骤。**VP** 要求多项式的变量数、次数和算术电路规模具有多项式上界。电路里的运算是加法和乘法。**VNP** 允许把一个容易计算的多项式的取值求和，求和的索引是一组 0 和 1 组成的串。串的长度受多项式限制，求和项数的上界呈指数增长。

换成一个例子。给定一张带权的图，每条经过全部顶点并回到出发点的有向回路，贡献一个乘积。乘积里的因子是它使用的各条边的权重。所有这类回路的乘积之和，构成哈密顿回路多项式。**描述每一项的规则很短，整份和式能否用一条短电路计算？** 这就是论文要回答的问题。

![P vs NP 比较布尔判定问题，VP vs VNP 比较多项式的算术电路规模](/article-images/anthropic-claude-vp-vnp-proof/01-two-computation-models.webp)

## 论文给电路划了一条什么线？

Claude 的论文主张，哈密顿回路多项式的通用算术电路需要超过 **m^(c·(log₂ m)^(1/3))** 个门。m 是顶点数，c 是一个正的绝对常数。该下界的适用范围是充分大的 m，起始规模取决于域的特征。

超多项式的含义就在指数里。m²、m¹⁰ 和 m¹⁰⁰ 的指数固定，论文这条下界的指数随 m 增长。这条下界的增长速度超过任意固定次数的多项式。论文给出的下界适用于深度和结构任意的**通用算术电路**。

第二个对象是方阵的**积和式（permanent）**。2×2 矩阵的行列式是 ad−bc，积和式是 ad+bc。两者的符号规则给出了不同的运算难度。特征为 2 的域满足 1+1=0，减法和加法相同，积和式和行列式重合。论文用哈密顿回路多项式覆盖了这类域。论文给出的近似版本讨论多项式系数的形式极限，适用对象是算术电路的边界复杂度。

论文的两路推导都从小电路的假设出发。一路用张量的分解性质约束电路规模。另一路从假设中导出一种加速求和的程序，再构造一个这类程序无法满足的等式。论文第二节给出证明结构，附录收录技术步骤。

## P vs NP 的难点在哪？

拿 **x²** 和 **x** 举例。x 取 0 或 1，两式的值相同。实数 x 取 2，两式分别给出 4 和 2。布尔电路的约束允许利用 0 和 1 上的等价关系。算术电路的目标是输出指定的形式多项式。

Claude 论文第二节点出了差别造成的具体问题。证明读取了电路中间结果的低次项和多线性部分。保留所有 0、1 输入答案的等价变形，可以改变这些部分。论文下界的适用范围是它指定的代数对象。经典 P vs NP 的答案需要适用于布尔判定问题的论证。

昨天稿子里的说法有一个前提。排程、程序搜索和密码学的变化，取决于经典 P=NP 能否成立以及相关算法的实际代价。**本次公开成果给出的是电路规模的下界，回答的是一类多项式的计算需要多少门。**

## Lean 的绿灯核验了什么？

仓库的 `Statement.lean` 定义了电路、多项式、复杂性类别，以及它们之间的关系。`Solution.lean` 提供证明。GitHub 的运行记录显示，Lean 构建和 Comparator 检查成功。项目说明记录了另一个独立编写的检查器 **nanoda** 对证明的复核。

![论文、Lean 机器校验、人类数学审读三项证据的状态](/article-images/anthropic-claude-vp-vnp-proof/02-proof-evidence.webp)

**机器核验的对象是写进 Lean 的命题。** 论文的自然语言、数学家熟悉的标准定义、`Statement.lean` 中的定义，需要逐项对应。附录 Q 列出了对应表和差异。论文另列一项关于行列式复杂度的推论。该推论缺少对应的 Lean 定理。项目 README 将论文和形式化的撰写者列为 AI 模型，数学家审读的状态是待复核。

这份证明材料给同行留下了两个具体的入口。去 `Statement.lean` 核对定义，去论文附录理解两路证明各自用掉了什么条件。**论文的突破主张是通用算术电路的超多项式下界。** 经典 P vs NP 是另一道待解的题。

## 参考资料

- [上一篇《P=NP 的证明会改变什么？排班、代码和加密的三场变化》](https://ai.concitech.org/articles/p-equals-np-what-changes/)
- [Anthropic 的 GitHub 目录、论文与 Lean 文件](https://github.com/anthropics/formal-math/tree/main/vp-vnp) · [Hexagon 预印本](https://hexagonmath.org/2611.00954v1)
- [Statement.lean](https://github.com/anthropics/formal-math/blob/main/vp-vnp/Statement.lean) · [GitHub 自动校验记录](https://github.com/anthropics/formal-math/actions/runs/45266217321)
- [Valiant 的 1979 年论文](https://doi.org/10.1145/800135.804419)
- [克雷数学研究所的 P vs NP 项目页](https://www.claymath.org/millennium/p-vs-np/)
