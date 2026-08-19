---
title: "Dario 留下一个时间表：几个月后，Claude 会交出什么？"
description: "Dario 暗示 Anthropic 将在几个月内展示生物医学进展。Claude 最可能先突破哪里，AI 科学家的真正形态又是什么？"
slug: "anthropic-biology-glimmers"
publishedAtCST: "2026-08-17T17:04:00+08:00"
language: zh
author: JimLiu
categories: [research, business]
cover: "/article-covers/anthropic-biology-glimmers.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-eNT9Rvy4ECAluJH8T19qQZVa-b7Iz4MzooIDzbrGpwO"
draft: false
---
在回应外界对 AI 行业的质疑时，Anthropic CEO Dario Amodei 留下了一句很容易被忽略的话：

> Anthropic 正在生物学和医学领域迅速加大投入，希望未来几年取得令人难以置信的成果，并在未来几个月看到一些初步曙光。

“未来几年”可以被理解成愿景，“未来几个月”却接近一张可以检查的时间表。

Anthropic 究竟可能交出什么？

先排除一个最容易误读的答案。几个月内出现一款由 Claude 独立研发、完成临床试验并获批的新药，几乎不可能。药物从靶点发现走到患者，仍要经过实验验证、临床试验、监管审批和规模化生产。

Dario 所说的“曙光”，更可能发生在科学发现链条的前端：AI 找到一个人类没有明确提出的新假设，设计出验证路径，并在真实实验中得到支持。

如果这件事发生，意义会远大于又一项漂亮的模型跑分。

## 判断曙光，需要一把更严格的尺子

AI 公司很容易把“会答生物学问题”描述成“正在改变医学”。两者之间其实隔着五个台阶：

1. 在生物学评测中取得高分。
2. 更快完成文献、数据和分析工作。
3. 提出新颖且可检验的科学假设。
4. 假设被真实实验独立验证。
5. 研究最终转化成有效、可获得的治疗。

目前，大模型已经相当明确地站上前两个台阶，正在试探第三和第四个。

Anthropic 今年发布的 BioMysteryBench 使用真实生物数据评估开放式研究能力。公司报告称，新一代 Claude 在部分问题上达到人类专家水平，还解决了一些专家小组未能解决的问题。不过，评测仍有明确答案，距离面对未知机制的真实科研还有差距。[BioMysteryBench](https://www.anthropic.com/research/Evaluating-Claude-For-Bioinformatics-With-BioMysteryBench)

工作流压缩也已经出现。Anthropic 公布的 Claude Science 案例中，UCSF 一个研究团队称，原本耗时更长的胶质瘤遗传分析被压缩到约十分之一，并由团队独立验证结果。另一个 Allen Institute 团队用多智能体处理数千篇论文，生成带证据数据库和审查流程的长篇综述。[Claude Science](https://www.anthropic.com/news/claude-science-ai-workbench)

这些成果很实用，但还属于“把已知工作做得更快”。分水岭在于，AI 能否发现此前没人知道的东西。

## 线索已经出现：Claude 开始生成新假设

Anthropic 在 2026 年 6 月发布 Claude Fable 5 和受限访问的 Mythos 5 时，透露了两项更接近科学发现的内部结果。

按照公司的说法，研究人员在盲测中更偏好 Mythos 5 提出的分子生物学假设，其中一些已经进入实验验证；另一个关于大肠杆菌蛋白机制的假设，后来被独立研究团队的工作印证。

Anthropic 还称，Mythos 5 用一周多时间完成了一项近乎自主的基因组学研究：汇总 138 个动物物种、数百万个细胞的单细胞数据，设计并训练模型，尝试识别不同物种中承担相同功能的细胞。公司计划公布更完整的研究结果。

这些仍是 Anthropic 的自我报告，部分结果尚未经过完整同行评议，不能提前当作定论。但它们把 Dario 的“几个月”缩小到了一个更具体的范围：最有可能出现的第一批曙光，是一篇有实验结果支撑的论文，或者一个由外部实验室确认的新机制，而非一款面向消费者的新产品。[Claude Fable 5 与 Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)

## Anthropic 想做的，可能是“科学研究版 Claude Code”

过去的科学 AI 往往是一个专用模型解决一个专门问题。AlphaFold 预测蛋白质结构，其他模型负责分子生成、单细胞分析或化学反应预测。它们能力很强，却只覆盖研究流程中的一段。

Anthropic 选择了另一条路线。

Claude Science 接入了 60 多种科研技能、数据库和连接器，覆盖基因组学、单细胞、蛋白质组学、结构生物学和化学信息学。它可以调用外部专业模型、编写分析代码、提交高性能计算任务、生成图表和论文，还会让审查智能体检查引用、数字和图表是否一致。

这套结构很像 Claude Code，只是代码仓库被换成了实验室：

研究者提出目标，Claude 拆解任务；专业智能体查询论文和数据库；计算任务在本地集群或 GPU 上运行；结果保留代码和完整轨迹；审查智能体寻找错误；研究者再决定下一轮实验。

Anthropic 未必想亲自成为一家药企。它更可能希望成为科研工作流的智能调度层，让实验室已有的数据、软件、专业模型、算力和仪器围绕 Claude 运转。

如果 Claude Code 的价值是让一个人调度一支软件工程团队，那么 Claude Science 的终局，就是让一个科学家调度一支不会休息的计算研究团队。

## 更大的跃迁，是把实验室接入循环

今天的 Claude Science 主要活跃在计算世界。它能读文献、处理数据、运行模型、提出假设，但生物学最终要接受湿实验检验。

Anthropic 与 HHMI 和 Allen Institute 的合作已经指向下一步。公开计划包括开发实验室专用智能体，把模型接入科学仪器和分析管线；多智能体系统则负责多组学分析、知识图谱、动态建模和实验设计。[Anthropic 与 Allen Institute、HHMI 的合作](https://www.anthropic.com/news/anthropic-partners-with-allen-institute-and-howard-hughes-medical-institute)

一旦实验数据能自动回到模型，科研流程就会从一条直线变成循环：

提出假设，设计实验，仪器执行，分析结果，否定错误方向，再生成下一组实验。

“AI 科学家”的想象力就在这里。它未必会在某一次灵感上超过顶尖科学家，却能同时维护成百上千条假设链，记录每次失败，并持续选择最值得验证的下一步。

科学家的角色也不会简单消失。问题品位、因果判断、实验伦理和研究方向仍需要人来负责。AI 最先减少的，可能是大量等待、检索、数据清洗、代码调试和重复分析，让科学家把更多时间放在“应该问什么”。

## 科研瓶颈会移动，而不是消失

当分析速度提高十倍，实验速度不会自动提高十倍。

新的瓶颈会转向高质量数据、自动化实验设备、样本、试剂、实验动物、临床队列和验证能力。一个实验室能否让 AI 读取多年积累但从未整理的数据，能否调用机器人完成实验，可能比购买哪家模型更重要。

这也会重估生命科学行业的资产。

过去最值钱的是论文、专利和明星科学家；下一阶段，结构化私有数据、可被智能体调用的实验管线、快速验证假设的能力，会变得更重要。AI 可以廉价生成一万个听起来合理的方向，稀缺的是快速淘汰其中九千九百九十九个错误方向。

因此，第一批明显受益者很可能是拥有优质数据和实验闭环的研究机构、生物技术公司与制药企业。医学收益要传导给普通人，还得经过临床、监管、生产和支付体系。

## 越接近曙光，越不可能完全公开

生物医学也是典型的双重用途领域。同一种能力既能帮助设计疗法，也可能降低危险生物操作的知识门槛。

Anthropic 目前对 Fable 5 的部分生物和化学请求设置了限制，并计划通过受信任访问项目，向少量经过筛选的研究者开放更完整的 Mythos 5 生物能力。

这带来一个现实结果：真正先进的生物能力，可能最先出现在封闭合作、受控实验室和迟到几个月的论文里，而不会像聊天功能那样公开演示。外界看到的“曙光”，也许只是实验完成后的结果，无法直接接触产生结果的完整系统。

安全限制有现实理由，但也会带来新的权力问题。谁能进入受信任名单，谁能审查实验，谁能验证公司的突破声明，都不能只由模型公司决定。能力越强，独立复现、第三方评估和透明的准入标准越重要。

## 几个月后，应该检查什么

Dario 已经给出了时间表，接下来可以用四个问题检查这束“曙光”是否真的出现：

1. 结果是否包含此前未知、可证伪的科学结论？
2. 是否经过真实实验和外部研究者验证？
3. AI 在发现中究竟完成了哪一步，贡献能否被追溯？
4. 同样的方法能否复制到其他问题，而非只展示一个精心挑选的案例？

如果 Anthropic 交出的只是更高的 benchmark、更快的文献综述或一批合作公告，那仍是工具进步。

如果 Claude 提出了一个非显而易见的生物学机制，实验室按它的建议完成验证，其他团队还能复现，那么 Dario 所说的“曙光”就有了明确含义。

那一刻最重要的变化，是 AI 第一次真正参与了人类新知识的生产。

---

**资料来源**

1. [Dario Amodei 回应 thread](https://x.com/DarioAmodei/status/2088758819304443967)
2. [Anthropic：Claude Science](https://www.anthropic.com/news/claude-science-ai-workbench)
3. [Anthropic：Claude Fable 5 与 Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)
4. [Anthropic：BioMysteryBench](https://www.anthropic.com/research/Evaluating-Claude-For-Bioinformatics-With-BioMysteryBench)
5. [Anthropic 与 Allen Institute、HHMI 的科研合作](https://www.anthropic.com/news/anthropic-partners-with-allen-institute-and-howard-hughes-medical-institute)
