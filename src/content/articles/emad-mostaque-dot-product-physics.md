---
title: Stability AI 创始人发布 4 页论文！一个点积推导了哪些物理定律？
description: >-
  Emad Mostaque 的论文重建自由标量场，推导玻恩规则与洛伦兹结构。推导的前提包括点积、概率规则和格点约束。GitHub 的 Lean
  检查覆盖论文表 1 的十二项形式化陈述。评论区的争议集中于推导的前提，以及这套方法的物理边界。
slug: emad-mostaque-dot-product-physics
publishedAtCST: '2026-11-27T14:18:15+08:00'
language: zh
author: JimLiu
categories:
  - research
cover: /article-covers/emad-mostaque-dot-product-physics.webp
draft: false
---

Stability AI 创始人 Emad Mostaque 的新论文有 4 页。推导的起点是一条几何公理。位移的度量来自一个正定点积。推导的结果包括量子测量的玻恩规则、决定时间演化的幺正算符，以及狭义相对论的光锥。仓库包含论文、Lean 源码和交互讲解。

Mostaque 的推文提到了量子力学和狭义相对论的公理。**论文的对象是有质量的自由标量场。** 「标量」指场的读数是一个数。「自由」指场方程的相互作用项为零。这类模型是量子场论的基础。 [原推文](https://x.com/EMostaque/status/2126045673581957242) · [论文原文](https://github.com/emad-ii/dot-product/blob/f916a3de81301c74ebcbe898134f9625699a6011/paper/A_Dot_Product_Is_All_You_Need_Final.pdf)

## 一条勾股关系，两条推导

点积决定向量的长短与夹角。两支垂直箭头的合成长度满足勾股定理。两段直角边的长度平方之和，就是斜边的长度平方。

论文的第一条推导关注场的读数。两个独立、同分布的读数是两个坐标。读数对的联合分布满足旋转对称性。独立性对应概率特征函数的乘法，平方和对应它的输入。两项要求把特征函数锁定为高斯形式。

硬币是个反例。两个坐标的取值各为 +1 或 −1，四种组合对应正方形的四个角。45 度旋转后的四个点位于坐标轴上。独立的硬币读数满足乘法规则，旋转前后的分布有差异。论文的旋转对称性假设排除了它。

第二条推导关注量子测量。玻恩规则给测量结果分配概率。每个测量结果对应一个子空间。归一化量子态在这个子空间的投影长度平方等于该结果的概率。平方权重的推导依赖正交事件的概率加法与对称性。 [交互讲解](https://emad-ii.github.io/dot-product/)

![勾股关系的两条推导，分别指向高斯读数和玻恩概率](/article-images/emad-mostaque-dot-product-physics/01-two-derivations.webp)

## 一张反射平面和狭义相对论

高斯分布给出读数的分布类型。空间里的两个位置具有怎样的关联？协方差描述读数之间的关系。论文选择格点读数的均方值和相邻格点读数之差的均方值作为约束。最大熵计算确定有限格点上的协方差结构。连续模型的协方差由质量尺度和涨落尺度参数化。

论文引入一张平面。平面一侧的读数与镜像读数的配对提供内积。这个构造需要反射正性。反射正性要求配对产生的平方范数为非负数。一正一负的两个脉冲构成反例，排除了指定的局部多项式类中的高阶候选算符。适用范围是该候选类，这个检验的假设包括对称性和正性条件。

平面法向位移产生指数衰减。衰减因子的解析延拓给出量子态随时间演化的相位，欧氏旋转的解析延拓给出洛伦兹变换。对应的时空间隔为「空间距离的平方减去时间的平方」。间隔等于零的方向组成光锥。光锥的斜率取决于时间和空间的单位。论文采用统一单位，斜率的绝对值是 1。 [论文第 2、3 节](https://github.com/emad-ii/dot-product/blob/f916a3de81301c74ebcbe898134f9625699a6011/paper/A_Dot_Product_Is_All_You_Need_Final.pdf)

## Lean 的绿灯覆盖哪些命题？

GitHub 的检查日志给出了可查证的结果。发布提交 `f916a3d` 的 Lean 任务通过，核查对象是 `DotProduct.theorem1_table1_axioms`。这个定理汇总表 1 的 12 项陈述，涵盖玻恩规则、幺正演化、唯一真空等性质。日志列出 `propext`、`Classical.choice` 和 `Quot.sound` 三个依赖公理，三者属于 Lean 的标准基础。 [GitHub 检查日志](https://github.com/emad-ii/dot-product/actions/runs/45889230992/job/140147485232) · [Lean 公理文档](https://lean-lang.org/doc/reference/latest/Axioms/)

**Lean 的公理审计回答的是逻辑依赖问题。** 定理的参数和定义包含物理假设。质量参数为正就是一个例子。玻恩规则的子命题引用 `EventRules`。概率规则属于定理陈述的一部分。审核者需要检查这些定义表达的条件。

仓库的证明指南列出了形式化的边界。有限格点的计算、高斯分布的推导和双脉冲反例有 Lean 证明。有限区域逼近连续空间的位置空间论证、一般非线性制备的连续反射正性，以及完整庞加莱群的乘法律，属于形式化未覆盖的部分。源码给出了平移、旋转和指定方向洛伦兹推动的相关性质。 [Lean 源码与证明范围](https://github.com/emad-ii/dot-product/blob/f916a3de81301c74ebcbe898134f9625699a6011/docs/plane-proof-guide.md#what-the-plane-lean-file-proves)

![Lean 检查覆盖的命题与形式化范围之外的论证](/article-images/emad-mostaque-dot-product-physics/02-lean-scope.webp)

## 评论区的分歧集中在哪些前提？

马斯克回了一个「Cool」。Manuel Alfaro 的评论和附件提出了两个具体问题。读数服从哪种对称性？相邻格点之差的均方值凭什么成为最大熵计算的约束？前者关系到高斯分布的推导，后者关系到局部自由场的形式。 [马斯克的回复](https://x.com/elonmusk/status/2126063139339059274) · [Alfaro 的评论](https://x.com/density_theory/status/2126131598165000294)

评论者 Alfonso Spencer 提到了狭义相对论的双曲几何和量子力学的线性代数。他认为点积的出现符合预期。Mostaque 的回复强调的是推导的简洁性。另一条评论的疑问是，模型给出了怎样的新物理预测？论文给出的结果属于对已知理论结构的重建。 [Spencer 与 Mostaque 的讨论](https://x.com/AlfonsoSpencer9/status/2126056033718083765) · [关于可检验预测的评论](https://x.com/Zcreateworld_/status/2126119963098526053)

几何公理约束了什么？概率与局部性条件决定了什么？这两道问题构成了争论的焦点。类似的问题有一段研究史。Lucien Hardy 的量子理论重建采用五条公理，研究决定量子形式的一组条件。Mostaque 的切入点是自由标量场和一套特定的几何与概率规则。两项工作的起点和论证对象各有范围。 [Hardy 的论文](https://arxiv.org/abs/quant-ph/0101012)

## AI 参与了哪一段？

Mostaque 称，自己花了一年多打磨核心思路，AI 参与了构思讨论。GPT 6.2 Astra 和 Gemini Neon 参与了收尾和形式化工作。仓库致谢注明了参与项目的 Logos 系统和这两款模型。 [作者说明](https://x.com/EMostaque/status/2126050281817334147) · [仓库致谢](https://github.com/emad-ii/dot-product/tree/f916a3de81301c74ebcbe898134f9625699a6011)

仓库公开了推导的前提和可检查的 Lean 定理。争论涉及一个具体问题。哪条前提的改变会改变自由场的结论？相互作用场的重建需要独立的构造和证明。
