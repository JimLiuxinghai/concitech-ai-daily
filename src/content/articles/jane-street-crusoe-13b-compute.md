---
title: "一家量化公司，为什么要买 130 亿美元算力？"
description: "Jane Street 被曝与 Crusoe 签下五年约 130 亿美元 AI 云合同。它已经拥有数万块 GPU，还与 CoreWeave 签过 60 亿美元协议。真正值得看的，是量化交易怎样变成一门算力生意。"
slug: "jane-street-crusoe-13b-compute"
publishedAtCST: "2026-09-04T13:15:18+08:00"
language: zh
author: JimLiu
categories: [business, products]
cover: "/article-covers/jane-street-crusoe-13b-compute.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-Tf9YpuzMDjuyEs4XB4e9EKxWa4J9exKndYBnqDI09aq"
draft: false
---

一家量化交易公司，准备花掉一家前沿模型实验室级别的钱去买 GPU 云服务。

彭博社 9 月 3 日援引知情人士称，Jane Street 与 AI 基础设施公司 Crusoe 签下一份五年期合同，总价值约 130 亿美元。Crusoe 将提供训练和推理所需的 GPU 集群与配套基础设施。

130 亿美元，平均到五年是每年 26 亿美元。这个除法很容易做，也很容易误导：公开报道没有披露付款节奏、最低采购额、续约条件和算力选择权。合同总价值更不能直接当成已经发生的支出。截至发稿，Crusoe 与 Jane Street 也没有公开确认这笔交易。

所以，先给这条消息加一个清楚的标签：**据报道，尚未官宣。**

即便打过折扣，它依然值得认真看。因为 Jane Street 不是第一次大手笔锁定 AI 算力。2026 年 4 月，它已经与 CoreWeave 公布了一份约 60 亿美元的 AI 云协议，并另外向 CoreWeave 投资 10 亿美元。后一笔是股权投资，不能算作云服务采购。

如果这次报道属实，Jane Street 在两家专业 GPU 云厂商处签下的云合同规模将达到约 190 亿美元。

![Jane Street 在 2026 年公开确认与据报道的两笔 AI 云合同。10 亿美元 CoreWeave 股权投资单独列示，不计入云合同。](/article-images/jane-street-crusoe-13b-compute/commitments.png)

用“金融公司也在试用 AI”来概括，已经明显不够。Jane Street 正在把自己的研究机器扩建到数据中心尺度。

## 它早就把自己当成一家研究实验室

Jane Street 官网有一句很不寻常的自我介绍：可以把它想成“一家附带交易台的研究实验室”。

这不是招聘文案随手写出的比喻。官网列出的数字包括数万块高端 GPU、超过 1 EB 的存储，以及每天约 4000 亿美元的成交金额。研究人员训练的神经网络会直接进入交易策略，工作内容覆盖分布式训练、模型架构、强化学习、计算机视觉、LLM、训练库和 CUDA 内核。

它在得州的一座数据中心就部署了 4032 块液冷 GPU。另一份机器学习工程职位介绍得更直白：团队处理的是“大模型、非平稳数据，以及竞争性的多智能体环境”。

这几个词把量化交易与普通企业 AI 的差别说透了。

市场数据量很大，但有用信号非常稀薄。规律会随着参与者、监管、利率和流动性变化，昨天有效的模型明天可能就失灵。更麻烦的是，交易者自己的动作会影响价格；当很多机构同时发现相似信号，利润空间也会被迅速挤掉。

模型不是训练一次便交付。它要持续吸收新数据、反复实验，再尽快进入生产环境。Jane Street 在 CoreWeave 的公告里说，公司的工作包括在海量、高噪声数据上训练大型复杂模型，并持续改进。

这就解释了为什么它需要长期锁定算力，而不是临时租几台服务器。

## 训练吃吞吐，交易吃延迟

“数万块 GPU”也容易引出另一个误会：是不是显卡越多，交易下单越快？

没这么简单。

研究阶段追求吞吐。研究人员要并行处理数据、训练多个模型、搜索超参数，算力越充足，单位时间内能完成的实验越多。分布式训练、存储带宽和集群网络决定研究速度。

真正进入交易环节后，目标换成了延迟和稳定性。Jane Street 的性能工程页面提到，一些推理系统必须在微秒尺度内响应。这里要靠低延迟网络、CPU、定制硬件、编译器和精心优化的 CUDA 代码共同完成，不能只看 GPU 数量。

![量化交易的两段算力链：离线训练重吞吐，在线交易重延迟。GPU 集群很重要，但不能替代低延迟网络和执行系统。](/article-images/jane-street-crusoe-13b-compute/training-vs-trading.png)

可以把它理解成两条紧挨着的生产线：前一条不断制造更好的模型，后一条负责在极短时间内把模型输出变成真实订单。算力投入首先缩短的是研究周期，最终才可能转化成交易优势。

这里没有公开数据能证明每多花一美元云费用，就能增加多少利润。130 亿美元合同若属实，只说明 Jane Street 判断“算力不足的机会成本”足够高，愿意为未来数年的供给确定性付钱。

## 为什么同时押注 CoreWeave 和 Crusoe

CoreWeave 和 Crusoe 都属于近几年快速扩张的专业 AI 云厂商。它们不像传统公有云那样什么都卖，主要围绕大规模 GPU 集群、网络、存储和数据中心建设提供服务。

对 Jane Street 这样的客户，采购对象并不是一批摆在仓库里的显卡，而是未来几年能按时通电、联网并稳定运行的整套系统。先进 GPU 经常受制于电力、机房工期、散热、网络设备和供应链。签长约的意义，是提前拿到容量。

同时向两家供应商采购，也能降低单点依赖。CoreWeave 的已确认协议包括下一代 NVIDIA Vera Rubin 算力；Crusoe 若能履约，则再提供一条独立的扩容路径。具体工作负载会怎样分配，目前没有公开信息，不能断言某家负责训练、另一家负责推理。

![Jane Street 的算力采购逻辑：用多家专业 AI 云厂商预订未来容量，减少单一供应商与单一园区带来的交付风险。](/article-images/jane-street-crusoe-13b-compute/two-clouds.png)

从供应商视角看，Jane Street 也很有吸引力。前沿模型公司是 AI 云最显眼的客户，但它们融资、训练节奏和模型路线变化很快。量化交易公司能带来另一种需求：预算来自交易业务，数据和模型长期迭代，而且对保密、性能与稳定性要求很高。

如果这份合同最终确认，Crusoe 得到的不只是大客户，还得到一张向资本市场证明需求的订单。

## Crusoe 的转身，比合同金额更有意思

Crusoe 2018 年成立时，做的是一门颇具争议、但工程逻辑很直接的生意：把油田原本要燃烧排放的伴生天然气就地发电，用来运行比特币矿机。

挖矿和 AI 训练看起来相距很远，底层难题却有重叠。都要寻找便宜能源、建设高密度机房、管理散热，并让大量芯片持续运行。

2025 年，Crusoe 把比特币挖矿和 Digital Flare Mitigation 业务出售给 NYDIG，把资源集中到 AI 数据中心与云平台。公司官网称，它参与建设了得州阿比林 1.2 吉瓦的 Stargate 园区。到 2026 年 6 月，Crusoe 宣布已签约的 AI 基础设施容量达到 4.9 吉瓦，开发管线超过 40 吉瓦。

![Crusoe 的业务迁移：从油田伴生气供电与比特币挖矿，转向大规模 AI 数据中心和 GPU 云。](/article-images/jane-street-crusoe-13b-compute/crusoe-pivot.png)

同一周，TechCrunch 援引知情人士称 Crusoe 正以约 300 亿美元估值融资 30 亿美元。融资与大客户合同在时间上靠得很近，但外界看不到合同条款，也不能据此判断融资估值是否合理。

能确定的是，AI 基础设施公司的竞争已经从“谁拿到更多 GPU”，推进到“谁能把电力、土地、机房和长期客户一起锁定”。Crusoe 从油田边的矿机走到吉瓦级 AI 园区，核心能力并没有完全换掉，只是计算任务和客户变了。

## 130 亿美元能说明什么，不能说明什么

它说明 AI 算力的买家正在变多。前沿模型实验室之外，量化交易这种高利润、数据密集、对模型时效极敏感的行业，也可能成为 GPU 云的主力客户。

它还说明，云厂商争夺的不是一次训练任务，而是五年甚至更长时间的基础设施预算。能提前签下长期需求，就更容易为下一座数据中心融资。

但这笔交易不能证明整个华尔街都开始了 GPU 军备竞赛。Jane Street 有独特的研究文化、资本实力和技术栈，一家公司不能代表所有银行、券商或对冲基金。它也不能证明 190 亿美元的云承诺一定能产生更高交易利润。

![阅读 130 亿美元合同需要保留的四个边界：报道状态、付款口径、交付细节和行业代表性。](/article-images/jane-street-crusoe-13b-compute/deal-caveats.png)

我更在意的其实是另一件事。

过去谈 AI 基础设施，市场习惯盯着 OpenAI、Anthropic、xAI 和大型科技公司。Jane Street 把另一类买家推到台前：它不训练通用聊天机器人，也不对外出售基础模型；它用模型处理自己最核心的生产问题，而且每一点微小改进都有机会直接进入损益表。

这样的公司未必很多，可一旦出现，购买力会很强。

“量化基金为什么突然做 AI”，这个问题已经晚了很多年。更迫切的是：当金融、制药、工业和机器人公司都开始把专有数据变成大模型，下一批吉瓦级数据中心究竟会被谁预订？

答案可能不再只写着几家前沿实验室的名字。

## 参考资料

- [sleepy.md：关于 Jane Street 与 Crusoe 合同的整理](https://x.com/sleepy0x13/status/2095676741843116179)
- [Reuters：Crusoe signs $13 billion AI cloud deal with Jane Street, Bloomberg News reports](https://www.streetinsider.com/Reuters/Crusoe%2Bsigns%2B%2413%2Bbillion%2BAI%2Bcloud%2Bdeal%2Bwith%2BJane%2BStreet,%2BBloomberg%2BNews%2Breports/27024731.html)
- [Jane Street：Machine Learning](https://www.janestreet.com/join-jane-street/machine-learning/)
- [Jane Street：Performance Engineering](https://www.janestreet.com/performance-engineering/)
- [Jane Street：Machine Learning Engineer 职位](https://www.janestreet.com/join-jane-street/position/4276720002/)
- [CoreWeave：与 Jane Street 签署 60 亿美元 AI 云协议](https://www.sec.gov/Archives/edgar/data/1769628/000176962826000167/ex991.htm)
- [Crusoe：出售比特币挖矿业务，聚焦 AI 基础设施](https://www.crusoe.ai/resources/blog/powering-the-future-of-ai-responsibly-our-next-chapter-at-crusoe)
- [Crusoe：已签约 AI 基础设施容量接近 5 吉瓦](https://www.crusoe.ai/resources/newsroom/crusoes-contracted-ai-infrastructure-capacity-approaches-5-gigawatts-across-data-centers-and-cloud)
- [Crusoe：公司发展历程](https://www.crusoe.ai/about/company)
- [TechCrunch：Crusoe reportedly raises $3B at a $30B valuation](https://techcrunch.com/2026/09/03/crusoe-reportedly-raises-3b-at-a-30b-valuation/)
