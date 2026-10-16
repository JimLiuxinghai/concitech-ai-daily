---
title: "Google 的 99.99%：AI 与量子计算的双向加速"
description: "Google 报告了 99.99% 的逻辑 T 态保真度，原始论文给出的实验尝试保留率是 8%。这项进展涉及容错计算的资源瓶颈。本文介绍量子计算、AI 纠错和分子模拟的联系，区分实验结果与科学发现的未来设想。"
slug: "quantum-ai-magic-state"
publishedAtCST: "2026-10-16T09:23:34+08:00"
language: zh
author: JimLiu
categories: [research]
cover: "/article-covers/quantum-ai-magic-state.webp"
draft: false
wechatMediaId: "qwac_8j4kaaga6WV5YUa-UApWbMQ3huA1ekxHPyZ2wHdaA6YXdjfPUyy96Usb0mu"
---

99.99%，一项量子计算实验交出了这个数字。

Google 的公告介绍了 Willow 处理器上的“魔法态培育”实验。成果涉及通用容错量子计算的一项资源瓶颈：高质量特殊量子态的制备。[官方公告](https://blog.google/innovation-and-ai/models-and-research/quantum-computing/magic-state-cultivation-quantum-computing/)

这个数字衡量的是逻辑 T 态的保真度。整台计算机的准确率、完整算法的成功率，以及分子模拟的误差，属于另外的指标。

理解这项进展，需要看见两层变化：量子工程减少错误的能力，AI 与量子计算之间的协作空间。

前者有实验依据，后者包含研究证据与未来设想。

## 一、99.99%，附带一个 8%

“魔法态”是一类量子资源。容错计算需要一组足够丰富的操作，高质量 T 态支持其中的非 Clifford 操作。它的制备成本影响整套计算系统的资源预算。

培育方案包含状态注入、错误检查和筛选，研究者保留符合检查要求的尝试。原始论文报告，错误改善约 40 倍，状态保真度是 0.9999(1)，对应的尝试保留率是 8%。[实验论文](https://arxiv.org/abs/2512.13908)

括号表示测量的不确定度，8% 表示筛选的代价。高保真度与高产出率，是不同指标。

一个生产过程产出高质量样品，质量指标回答“合格样品有多好”；保留率回答“多少尝试进入结果”。两项指标决定资源预算，这个类比省略了量子测量与编码的技术细节。

![99.99%逻辑T态保真度、约40倍错误改善、8%实验尝试保留率；本文依据原始论文整理](/article-images/quantum-ai-magic-state/evidence.webp)

时间线存在一个细节：Google 公告的日期是 2026 年 10 月 15 日，公告说明成果发表于《Science》；对应预印本的首次提交日期是 2025 年 12 月 15 日。新闻发布、期刊发表与研究首次公开，具有不同时间点。

这项结果证明了一种制备路线的实验可行性。规模化生产、系统集成与实用算法，需要另外的验收。

## 二、量子比特增加，计算优势需要算法

经典比特的取值是 0 或 1。量子比特的状态包含这两个基态的叠加，振幅决定测量结果的概率。多个量子比特的联合状态包含纠缠等关联。

n 个量子比特对应 2 的 n 次方个计算基态。例如，10 个量子比特对应 1024 个基态。这个数字描述状态空间的维度，区别于一次计算交付的答案数量。

一次标准测量产生一个结果。量子算法设计干涉过程，改变结果的概率分布。状态空间的增长，缺少对所有任务的加速保证。[IBM 量子信息课程](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information)

“多少量子比特超越经典电脑”的问题，需要具体任务、精度和比较方法。电路结构、模拟方法与计算资源，影响经典模拟的实际难度。

这种区别影响新闻判断：一个庞大的数学空间，缺少代替任务成绩的能力。计算优势需要相同问题、相同精度要求，以及可信的经典基线。

容错计算的另一个区分，是物理量子比特与逻辑量子比特。前者是硬件器件，后者是纠错编码保护的信息单元。器件数量、逻辑单元数量和可执行程序的长度，具有不同含义。

## 三、AI 帮助量子工程，证据是什么

一个具体例子是 AlphaQubit。

Google DeepMind 与 Quantum AI 团队发表了这项神经网络解码器研究。输入是纠错过程的一致性检查记录，任务是推断逻辑信息的错误。模型学习错误模式，辅助量子纠错。[AlphaQubit 官方研究介绍](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/alphaqubit-quantum-error-correction/)

2024 年研究的 Sycamore 实验显示，最大规模实测中的解码错误降幅是 6% 与 30%，两个对照是张量网络方法与关联匹配方法。这些是指定实验与比较对象的成绩，区别于所有设备上的通用提升。

那篇研究的限制包含实时速度与扩展性。研究当时的 AlphaQubit 缺少超导处理器实时纠错所需的速度。它提供了解码准确率的证据，完整部署需要时延、吞吐和训练成本的检查。

AlphaQubit 与魔法态培育属于不同研究。两者服务于量子计算的可靠性。这项 99.99% 来自魔法态培育，AlphaQubit 的成绩属于另一条证据链。

AI 参与量子工程的价值，体现为具体环节的改进。解码器预测错误、控制参数影响器件表现、编译方案改变电路成本；每个环节需要对应的实验和基线。一个环节的改善，进入整机性能需要系统验证。

## 四、量子计算回馈 AI，回馈的是什么

一个有吸引力的方向是分子与材料模拟。

电子结构、分子能量和反应过程具有量子性质。经典计算提供大量有用的近似方法，部分高精度计算面对规模与成本限制。量子算法研究尝试扩展计算对象和精度范围。

Google 的量子化学研究讨论过这类限制：小规模设备中的化学计算使用活性空间等近似，减少量子比特需求的选择，会引入表示误差；测量与算法设计需要处理这些误差。[量子化学表示精度研究](https://research.google/pubs/increasing-the-representation-accuracy-of-quantum-simulations-of-chemistry-without-extra-quantum-resources/)

量子模拟提供的是指定模型、误差范围和算法条件下的性质估计。它区别于“现实世界的绝对真值”。

一种未来协作方案是：AI 提议候选分子，经典计算筛选候选，量子计算估计选定的性质，实验室检验样品。结果进入下一轮模型训练与候选选择。

这是协作设想，缺少大规模药物或材料发现闭环完成的证明。量子计算承担哪部分工作，需要任务难度与成本比较。

![AI辅助量子工程的研究证据，与量子模拟反馈候选筛选的未来设想；本文整理](/article-images/quantum-ai-magic-state/collaboration.webp)

分子能量的计算与药物疗效之间，隔着合成、稳定性、毒性和临床验证。材料性质的估计与产品量产之间，隔着制造工艺、寿命和成本。

计算工具扩大可研究范围，现实实验检验适用性。两种工作的结合，需要样品与数据的往返。

## 五、双向加速，需要怎样的证明

AI 帮助改进量子计算，量子计算帮助研究物质，这个观点具有技术上的吸引力。它包含两种不同程度的证据：前一方向有解码研究等具体结果，后一方向包含算法研究、原型实验和规模化应用设想。

判断这条路线的进展，需要四项检查：

1. 质量：逻辑错误率、估计误差和统计不确定度。
2. 产出：保留率、制备速度与资源消耗。
3. 系统：纠错时延、编码连接与长期运行表现。
4. 应用：同等精度的总耗时、总成本和经典方法对照。

这份清单是本文的评估建议。一个高保真度数字提供局部证据，端到端收益需要完整流程的测量。

99.99% 值得重视，8% 值得保留。两者描述的是这项实验的成果与代价。

AI 与量子计算的结合，需要一串可复核的研究结果。科学发现的加速，接受算法、硬件和实验室的验收。

## 参考资料

1. [Google：魔法态培育的 Willow 实验公告](https://blog.google/innovation-and-ai/models-and-research/quantum-computing/magic-state-cultivation-quantum-computing/)
2. [原始实验论文：Magic state cultivation on a superconducting quantum processor](https://arxiv.org/abs/2512.13908)；[Science 期刊页面](https://www.science.org/doi/10.1126/science.aee7961)
3. [Google DeepMind：AlphaQubit 纠错解码研究](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/alphaqubit-quantum-error-correction/)
4. [IBM：量子信息与测量基础](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information)
5. [Google Research：量子化学模拟的表示精度](https://research.google/pubs/increasing-the-representation-accuracy-of-quantum-simulations-of-chemistry-without-extra-quantum-resources/)
