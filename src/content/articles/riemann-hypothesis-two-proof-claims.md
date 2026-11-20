---
title: Claude 联手数学家！黎曼猜想迎来两份候选证明，940 页人类手稿公开
description: >-
  Alpöge 公布与 Claude 合作的 Lean 证明，Masullo 的 940
  页手稿提出另一条路线。两份材料的目标包含黎曼猜想，广义版本的范围有别。MIT 数学家的机器核验报告给出了哪些证据？
slug: riemann-hypothesis-two-proof-claims
publishedAtCST: '2026-11-21T06:38:50+08:00'
language: zh
author: JimLiu
categories:
  - research
cover: /article-covers/riemann-hypothesis-two-proof-claims.webp
draft: false
---

**11 月 20 日是两份黎曼猜想候选证明的公开日期。**

Anthropic 数学家 Levent Alpöge 的个人网站挂出一份四页说明和 14 个 Lean 压缩分卷。他称自己与 Claude 完成了黎曼猜想的证明。文件的结论涵盖狄利克雷 L 函数的广义版本。

美国数学会主席 Ravi Vakil 的个人博客公布了另一份候选证明。那是 Alessandro Maria Masullo 的 940 页手稿《素数的音乐》。Vakil 的公告称，手稿的研究过程无 AI 参与。斯坦福数学家 Brian Conrad 的审读工作持续了数月。

两份材料的公开日期重合，研究周期各有历史。MIT 数学家 Andrew Sutherland 提供了机器核验的公开证据。他公布的日志显示，Lean 校验器复查了全部模块，独立内核 nanoda 接受了完整的证明导出文件。Masullo 的手稿则列出了作者和 Conrad 知晓的待修订之处。

## 167 年的难题，问的是一条线

黎曼猜想的提出年份是 1859 年。猜想涉及一个函数 ζ(s)。函数值等于零的输入叫零点，这里的输入是复数。复数的实部和虚部对应平面上的横坐标和纵坐标。

**黎曼猜想要求 ζ(s) 的每个非平凡零点的实部等于 1/2。** 这个条件对应复平面上的一条竖线，数学家称它为临界线。

![黎曼猜想的临界带和临界线示意](/article-images/riemann-hypothesis-two-proof-claims/01-critical-line.webp)

素数的分布给这条线赋予了意义。素数定理提供了素数计数的近似规律，黎曼猜想约束实际计数偏离近似规律的幅度。零点的位置决定相关估计的误差界。猜想的关键词是「每个」。一个偏离临界线的非平凡零点构成反例。

广义黎曼猜想把类似的问题扩展到一族 L 函数。这次的两个项目给出了不同范围。Alpöge 的文件涵盖狄利克雷 L 函数。Masullo 的手稿主张涵盖任意数域的幺正 Hecke 特征所对应的 L 函数。「证明 GRH」这四个字省略了函数族，比较两份材料需要读出结论里的量词。

## Alpöge 的 4 页说明，指向 17 万个 Lean 文件

四页 PDF 交代了研究路径、发布决定以及代码的下载地址。原作者提供的证明材料是 Lean 项目。镜像项目的统计包括 **175,187 个 Lean 文件、17,374,215 行源码**。两项数字统计的是整个项目的源码。

Alpöge 的说明提到了傅里叶分析和连续的 theta 提升，后者是构造和研究相关数学对象的工具。他把写作计划留给后续工作，目标包括解释论证和寻找简化。猜想的结论占一行，证明的结构是另一项工作。

Anthropic 的 8 月研究给出了一个参照。那项结果把「ζ 函数的非平凡零点是单零点且位于临界线」的已知比例下界从约 41.6% 推到约 67.2%。11 月材料的目标是全部非平凡零点的位置。比例估计与全称命题对应两种不同的任务。

## MIT 的复核记录给出了什么

Lean 的内核检查证明对象。复核者的工作包括核对问题的数学定义、查明证明使用的公理，检查每一步推导。Sutherland 公布了校验报告、日志和文件指纹。

![Andrew Sutherland 公布的 Lean 证明复核项目](/article-images/riemann-hypothesis-two-proof-claims/02-lean-verification.webp)

他确认主结论引用的是 Mathlib 数学库的标准 `RiemannHypothesis` 定义。五个主要定理的公理审计列出了 Lean 的三个标准公理。全部 175,187 个模块的内核复查没有拒绝项。独立实现的 nanoda 内核接受了全量导出文件。

这份报告标注的更新时间是 11 月 20 日 19:45 UTC。报告列出的进行中项目包括 `lake comparator` 的全程运行和全量导出的其他 Lean 内核检查。

这项结果给出了机器核验的证据。核验结论的范围是报告所列的形式命题、公理和定义。数论学家的任务包括解释证明的主干、寻找简化方案，以及研究这些方法能解决的其他问题。

## 940 页人类手稿的审查任务

Masullo 的《素数的音乐》走的是论文路线。稿件包含论证、章节和写给数论学家 Peter Sarnak 的信件节选。作者的致谢页记载了近 12 年的成稿过程。作者和 Conrad 知道稿件有若干需要修整的地方。

原定计划包含 Masullo 的一年返校修稿期和更多同行的审读。Vakil 的博客公告公开了现有草稿。公告邀请读者检查论证、开展形式化、填补可能出现的小缺口。Conrad 几个月的审读是有分量的前期工作，这份工作会进入更广泛的复核。

940 页这个数字容易成为新闻标题。审稿的线索包括核心命题的位置、各章的依赖关系和作者指出的待修事项。长篇证明包含大量技术细节。数学共同体需要知道哪些细节关系到主结论、哪些步骤有替代推导。

## 百万美元奖项的时间表

克雷数学研究所的千禧年大奖有三个评审门槛。证明须经合格渠道发表，发表后的等待期限是两年，国际数学共同体须形成普遍认可。奖项评审与学界对证据的讨论有各自的时间表。

我关心的下一件事是两份材料的可读版本。Alpöge 的写作计划包括解释 Lean 证明的主论证和寻找简化。Masullo 手稿的后续审查需要厘清关键步骤，确认待修订处对主结论的影响。

## 参考资料

- [Levent Alpöge 的原始说明与 Lean 源码入口](https://alpo.ge/remark.pdf)
- [Ravi Vakil 公告与手稿入口](https://math216.wordpress.com/2026/11/20/hurried-announcement-alessandro-masullo-grh/)
- [Alessandro Maria Masullo《素数的音乐》草稿](https://math216.wordpress.com/wp-content/uploads/2026/11/the-music-of-the-primes.pdf)
- [Andrew Sutherland 的独立核验记录与日志](https://math.mit.edu/~drew/grh/)
- [Lean 镜像项目的源码统计与核验笔记](https://github.com/Deicyde/riemann-hypothesis/blob/main/verification/NOTES.md)
- [Anthropic 8 月的 ζ 函数零点研究](https://www.anthropic.com/research/riemann-zeta)
- [克雷数学研究所的黎曼猜想说明](https://www.claymath.org/millennium/riemann-hypothesis/)
- [克雷数学研究所的千禧年大奖评审规则](https://www.claymath.org/millennium-problems/rules/)
