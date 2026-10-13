---
title: "马斯克谈中国制造：长鑫 4F² 的技术进展与量产考验"
description: "长鑫存储提出采用 4F² 架构的 DDR5 RDIMM 产品计划，马斯克讨论中国制造的规模扩张能力。本文解释存储单元面积与密度的关系，区分产品计划和规模量产，梳理 DDR5、HBM 与 NAND 的差别及市场份额的证据口径。"
slug: "cxmt-4f2-manufacturing-scale"
publishedAtCST: "2026-10-13T08:41:20+08:00"
language: "zh"
author: "JimLiu"
categories: ["business","research"]
cover: "/article-covers/cxmt-4f2-manufacturing-scale.webp"
draft: false
wechatMediaId: "qwac_8j4kaaga6WV5YUa-ZJDI42vdCoDNuSUY95IkdGct0fNKDDE_t0Eik6VGWNl"
---

一种存储架构的进展，引出了马斯克关于中国制造的判断。

他关注规模扩张。制造技术拓展设计空间，生产体系影响产品的产业规模。长鑫存储的 4F² DRAM 进展，提供了一个具体讨论对象。

用户提供的推文引用了马斯克原帖。原帖的北京时间是 2026 年 10 月 13 日。马斯克认为，中国具有强大的规模化制造能力。他的例子是太阳能与锂电池。他提出 SpaceX 这个反例，保留了存储行业存在不同结果的空间。[马斯克原帖](https://x.com/elonmusk/status/2109690977279426846)

这是他的产业判断，区别于长鑫产品的量产证明。讨论需要区分四件事：架构进展、产品计划、稳定制造和客户交付。

## 一、长鑫提出了什么计划

第一财经的会议报道记录了长鑫存储总裁曹堪宇的介绍。会议日期是 2026 年 10 月 10 日。公司提出采用 4F² 架构的新一代 DDR5 RDIMM 产品计划，时间目标是 2026 年底。[第一财经会议报道](https://www.yicai.com/news/103388707.html)

DDR5 是一种 DRAM 产品标准。RDIMM 是注册式内存模组，服务器是本次计划的目标应用。芯片是模组的组成部分，模组是系统使用的产品，二者具有不同的验证层次。[三星 DDR 产品说明](https://semiconductor.samsung.com/dram/ddr/)

这条新闻的确定对象是一项公开产品计划。产品推出、实现高良率制造和形成持续交付能力，属于不同节点。

原始讨论的上游包含一篇存储行业投资评论。它混合了技术消息、市场表现和投资判断。本文关注技术与产业条件，股价变化的原因需要独立证据，投资结论缺少本文的支持。

## 二、4F² 缩小的是存储单元

![相同特征尺寸条件下，6F² 与 4F² 的理想面积和密度关系](/article-images/cxmt-4f2-manufacturing-scale/cell-area-density.webp)

F 是描述单元布局的特征尺寸尺度，F² 是相应的面积单位。6F² 与 4F² 描述单个存储单元的归一化面积，区别于“6 纳米”与“4 纳米”的工艺节点名称。

一个简单的面积计算解释了它的吸引力：4F² ÷ 6F² = 2/3。相同 F 的比较，得到单元面积减少约 33.3% 的理想结果。

固定阵列面积的单元数量，与单元面积成反比。6 ÷ 4 = 1.5，对应约 50% 的理想密度增幅。

这两组数字是同一组几何关系的不同表达。它们具有明确的前提：相同的 F、理想阵列和相同的比较边界。它们属于本文的面积推算，区别于长鑫实测的整颗芯片收益。

一颗芯片包含存储阵列、外围电路和其他区域。模组包含芯片与配套部件。单元面积、芯片面积、模组容量和制造成本，具有不同的计算对象。

33.3% 的单元面积变化，缺少 33.3% 成本降幅的直接等号。工艺步骤、设备利用率、缺陷、测试和封装，影响合格产品的成本。

4F² 因而包含一个有价值的方向：改善存储密度。它的商业价值需要工程结果来说明。

## 三、三维结构带来收益，工程问题需要验证

长鑫的会议介绍涉及垂直包围沟道晶体管，以及存储阵列与外围电路的工艺安排。第一财经报道提到晶圆级混合键合，这是一项结构与制造的协同方案。[会议介绍的技术细节](https://www.yicai.com/news/103388707.html)

这类方向具有行业研究背景。

SK hynix 的研究资料介绍了 4F² 垂直栅 DRAM、阵列与外围电路的集成，以及相关电学验证。资料讨论了相邻结构的干扰、背栅设计和位线屏蔽，显示密度设计与读写性能存在配套问题。[SK hynix 的 4F² 研究说明](https://research.skhynix.com/blog/insights/detail/summary-electrical-characteristics-of-the-4f2-vertical-gate-dram-integrated-with-bit-line-shielding-and-back-gate-transistor)

这份资料属于 SK hynix 的研究，区别于长鑫的测试报告。它说明的是研究方向与工程问题，缺少两家产品性能高低的直接比较。

单元尺寸的缩小，需要电学性能的支撑。阵列与外围电路的组合，需要连接和制造质量的支撑。一项结构创新进入产品，验证对象包括数据保持、读写表现和可靠性。

这解释了技术突破与量产考验的关系。架构提供新的设计空间，工厂需要稳定实现设计，客户需要确认产品满足系统要求。

## 四、DDR5、HBM 和 NAND，属于不同对象

马斯克的原帖提到了 LP5、LP6、HBM，以及逻辑与存储的三维集成。长鑫本次产品计划的对象是 DDR5 RDIMM。两种讨论具有交集，具体产品与技术层次存在区别。

DDR5 RDIMM 面向服务器系统内存。HBM 是高带宽 DRAM 的一种实现，涉及堆叠、宽接口和先进封装。三星的官方说明介绍了 TSV 堆叠与宽接口，说明它的系统带宽来自整套产品设计。[三星 HBM 技术说明](https://semiconductor.samsung.com/dram/hbm/)

NAND 是另一类存储技术，承担持久存储用途；DRAM 承担易失性内存用途。美光的技术介绍说明了这种区别。[美光：SSD、NAND 与 DRAM](https://in.micron.com/about/micron-glossary/solid-state-drives)

一个 DDR5 单元架构的进展，缺少替代 HBM 全部技术要求的证明。HBM 的竞争包含存储器件、堆叠、互联、封装和系统集成。NAND 的产品路线和成本结构需要自己的分析。

马斯克认为，先进 HBM 与逻辑存储集成具有复杂的技术要求。这是他给出的边界。原帖的观点比“中国掌握存储，全球竞争结束”这种表达具有更多限定。

## 五、规模的证据，是合格产品与持续交付

![架构进展、晶圆制造、模组验证与持续交付的四层证据](/article-images/cxmt-4f2-manufacturing-scale/manufacturing-gates.webp)

中国存储企业的市场规模具有可查数据，数据来源需要说明。

TrendForce 的 2026 年第二季度品牌 DRAM 厂商营收表列出：长鑫排名第四，营收份额为 9.5%，第一季度为 7.6%。这是一家研究机构的营收统计，区别于晶圆产能、出货位数或 HBM 份额。[TrendForce 原始发布与表格](https://www.trendforce.com/presscenter/news/20260907-13219.html)

第一财经的报道引用 Counterpoint，给出同一季度 7% 的营收份额估计。两个来源存在差异，公开信息缺少足够的方法说明。本文保留各自出处，统一精确数值缺少依据。

这类数据说明长鑫具有市场存在感，缺少新架构量产结果的替代作用。客户购买既有产品，与新产品达到交付条件，是不同事实。

我认为，4F² 的后续进展需要四类证据：产品规格、制造良率、系统验证和持续交付。

产品规格说明容量、接口与功耗等条件。制造良率说明设计形成合格芯片的情况。系统验证说明模组与目标平台的匹配。持续交付说明客户获得稳定供给的情况。

一座厂房的规划产能，是建设目标；一条生产线的合格产出，是制造结果。新增供给的价格影响，需要结合需求、产品结构和交付时间。架构公告与行业供过于求，缺少直接等号。

马斯克关注的规模化能力，有一个值得检验的落点：技术成果转化为可靠产品的能力。研发、生产、成本控制与客户验证，构成同一条产业链上的不同任务。

长鑫的 4F² 计划提出了一个具体观察节点：2026 年底的产品推出目标。目标的兑现需要产品材料，规模优势的成立需要交付数据。

我认为，这条新闻的价值是新架构进入服务器产品的方向。它的结果取决于制造和客户验证。技术进展值得关注，产业胜负需要合格产品证明。

## 参考资料

1. 原始讨论：[本次推文](https://x.com/mylifeonmystyle/status/2109713425156764147)；[马斯克原帖](https://x.com/elonmusk/status/2109690977279426846)；[上游帖子](https://x.com/MelvinInvests/status/2109655913758110018)
2. [第一财经：长鑫 4F² 会议报道](https://www.yicai.com/news/103388707.html)
3. [SK hynix：4F² 垂直栅 DRAM 电学研究](https://research.skhynix.com/blog/insights/detail/summary-electrical-characteristics-of-the-4f2-vertical-gate-dram-integrated-with-bit-line-shielding-and-back-gate-transistor)
4. 产品说明：[三星 DDR](https://semiconductor.samsung.com/dram/ddr/)；[三星 HBM](https://semiconductor.samsung.com/dram/hbm/)；[美光 NAND 与 DRAM](https://in.micron.com/about/micron-glossary/solid-state-drives)
5. [TrendForce：2026 年第二季度 DRAM 营收发布](https://www.trendforce.com/presscenter/news/20260907-13219.html)
