---
title: "Claude算出九圈振幅：数千美元的科研Agent压力测试"
description: "Anthropic披露Claude Science完成N=4超杨-米尔斯六粒子九圈振幅计算。两条路线相互校验，Lance Dixon核验结果；公开文件展示计算产物与限制。成果指向长流程科研执行力，新理论创造力缺少证据。"
slug: "claude-nine-loop-amplitude-science-agent"
publishedAtCST: "2026-09-27T11:15:00+08:00"
language: zh
author: JimLiu
categories: [research, products]
cover: "/article-covers/claude-nine-loop-amplitude-science-agent.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-TAu254xELrybjs16RJZiPJ_SvJ2oXbD6STDOsjmCh02"
draft: false
---

粒子物理学的一项九圈振幅计算有了答案。完成者名单出现Claude。

Anthropic的2026年9月25日科学博客披露这场实验。两名Anthropic物理学家Liam Fitzpatrick和Siddharth Mishra-Sharma提出任务，Fable 5.1模型承担计算，Claude Science承担工具、环境和算力调度。SLAC与斯坦福大学物理学家Lance Dixon核验结果。

题目全名是平面N=4超杨-米尔斯理论的六粒子MHV振幅九圈计算。名字晦涩。实验问题是科研Agent的端到端执行能力。

答案是肯定的。新物理原理保持空白。

![Claude九圈振幅计算与科研Agent压力测试](/article-images/claude-nine-loop-amplitude-science-agent/cover.webp)

## “九圈”代表什么

散射振幅描述粒子反应的概率。量子场论采用微扰展开，每一圈代表一层量子修正。高圈数带来高精度与指数级计算量。

现实粒子振幅的常见计算深度是二圈或三圈。此次对象属于N=4超杨-米尔斯理论。该理论是方法试验场，粒子配置带有高度对称性，现实粒子预测属于其他理论任务。

Dixon与Yu-Ting Liu的2023年论文给出该六粒子振幅的八圈结果。物理学家兼科学作家Matt von Hippel的2026年8月挑战提出下一目标：学术团队预算、九圈计算、可验证结果。

![六粒子振幅的圈数阶梯](/article-images/claude-nine-loop-amplitude-science-agent/loop-ladder.webp)

## 一句话提示，两条计算路线

初始提示是一句话：计算平面N=4超杨-米尔斯理论的六粒子九圈振幅。

人类后续留言提供任务延续指令。模型运行周期为数日。外部科研指导接近空白，Claude Science保存状态、调用Python与SymPy、提交集群任务、检查中间产物。

Claude完成两条计算链。

第一条是直接Bootstrap。系统构造候选函数空间，对称性、解析性质、共线极限和算符乘积展开负责约束系数。

第二条是Form Factor路线。系统计算九圈三点Form Factor，Antipodal Duality生成振幅特定曲面数据，升维步骤补全运动学空间。

两条表示的107053个非零系数比较结果一致。直接Bootstrap产生Septuple Coproduct表示，Form Factor路线产生Quintuple Coproduct表示。

![Claude九圈振幅的两条计算路线](/article-images/claude-nine-loop-amplitude-science-agent/workflow.webp)

成本口径有两层。每条路线的用户成本估计为1000至2000美元，Claude用量占主要部分。Bootstrap计算的CPU账单估计值为100美元，配置为96颗CPU，运行周期为一周。

## 公开文件写着什么

项目页面Cosmic9提供机器可读结果、样本系数、校验记录、文件校验和与复现说明。九圈符号空间包含1018297个非零基坐标，1014476个坐标获得有理数认证，占比99.62%。

校验材料包含两个31位素数下的结果、三素数Form Factor认证、八圈已知结果回归测试、对称性测试、零条件测试和两条路线的系数对照。

公开文件列出证据边界：

- 结果主体位于Symbol层；Zeta值项与完整函数超出该说明范围。
- 3821个基坐标缺少两素数有理数认证。
- 五个OPE固定方向缺少独立于双胶子Flux-Tube数据的检验。
- Form Factor计算程序缺席。
- 论文同行评审记录缺席。

![九圈振幅成果的证据边界](/article-images/claude-nine-loop-amplitude-science-agent/evidence.webp)

这些限制削弱“完整复现”说法，保留“公开结果与多重校验”说法。

## 中国团队的并行结果

中国科学院理论物理研究所宋贺、景继荣和李想向Zenodo提交《The Symbols of Six-Gluon MHV Amplitudes through Nine Loops》。数据集包含二圈至九圈的六胶子MHV振幅Symbol，发布日期为2026年9月17日。

Anthropic文章称，该团队使用GPT-6辅助部分约束计算，研究团队掌握整体框架。Dixon收到Claude结果的日期是9月1日。两组工作拥有不同公开日期、计算路径和自动化程度。

并行结果增加交叉核对价值。“机器单独突破人类边界”的叙事缺少支撑。人类团队获得主要结果，AI参与两条路线。

## 成果类型：计算突破，理论创新空白

Matt von Hippel的判断措辞克制。Claude采用Dixon团队方法，计算资源规模超过既有尝试。新算法缺席。软件工程质量、长任务稳定性和算力编排构成优势来源。

这项成果属于科研执行突破。它包含文献理解、形式化约束、代码开发、集群作业、错误修复和结果校验。人类研究工程师的处理周期单位是周或月，科研Agent给出数日级运行记录。

理论创造属于另一层能力。新对称性、新物理原则和新解释缺席。九圈计算扩展既有路线，物理学家承担研究意义分析。

Anthropic文章属于付费客座稿。Anthropic支付作者稿酬并参与草稿反馈，Dixon获得Claude使用额度。公司发布是博客的材料属性。公开数据与独立论文承担证据主体角色。

## 科研Agent的工作岗位

Claude Science属于科研工作台，底层模型是Fable 5.1。工作台提供持久状态、代码环境、数据库连接、HPC调度和产物溯源。九圈实验测试的是整套系统，而非聊天窗口里的单次回答。

科研工作的瓶颈分成新思想与执行成本两类。后一类任务覆盖符号计算、数值扫描、数据清洗、软件移植和复现检查。科研Agent获得一份清晰岗位说明：接管长链执行。研究者负责问题选择、结果验收和科学解释。

九圈成果跨过执行门槛。理论创造门槛保留空位。

---

## 参考资料

1. Anthropic, [Yes, Claude can do Nine Loops](https://www.anthropic.com/research/yes-claude-can-do-nine-loops)
2. Cosmic9, [Cosmically Normalized Six-Point Amplitudes at Nine Loops](https://smsharma.io/cosmic-nine-loops/)
3. Cosmic9, [Method and Validation](https://smsharma.io/cosmic-nine-loops/validation/method_and_validation.md)
4. Song He, Jirong Jing, Xiang Li, [The Symbols of Six-Gluon MHV Amplitudes through Nine Loops](https://doi.org/10.5281/zenodo.22800071)
5. Lance Dixon, Yu-Ting Liu, [An Eight Loop Amplitude via Antipodal Duality](https://arxiv.org/abs/2308.08199)
6. Matt von Hippel, [It Only Counts When AI Gets to My Field](https://4gravitons.com/2026/08/07/it-only-counts-when-ai-gets-to-my-field/)
7. Anthropic, [Claude Science](https://claude.com/product/claude-science)
