---
title: "美团LongCat 2.5的中秋节首秀：百万上下文，榜单席位待定"
description: "LongCat-2.5-Preview拥有1.6T总参数和100万Token上下文，激活参数的官方表述为“约48B”。发布日期对应2026年中秋节，主流独立榜单缺少该模型成绩。"
slug: "longcat-2-5-mid-autumn-preview"
publishedAtCST: "2026-09-26T10:56:06+08:00"
language: zh
author: JimLiu
categories: [models, products]
cover: "/article-covers/longcat-2-5-mid-autumn-preview.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-eXByBuMixRUW7Td9Vv6r8HGVMSituXFF-ZmqpEy6bxa"
draft: false
---

2026年中秋节的模型发布名单增加一位成员：美团LongCat-2.5-Preview。

LongCat官方X帖子的时间戳是2026年9月25日14:16 UTC，北京时间是9月25日22:16。国务院办公厅公布的中秋节日期是9月25日，假期覆盖9月25日至27日。该模型的发布标签是中秋节产品。

官方产品信息包括1.6T总参数、100万Token上下文、原生多模态和长流程Agent任务，激活参数的官方表述是“约48B”。发布渠道包括LongCat Chat与API平台。

![美团LongCat 2.5中秋节首秀](/article-images/longcat-2-5-mid-autumn-preview/cover.webp)

## 发布日：中秋节

LongCat团队的发布时间是中秋节晚间。官方账号的英文消息是全球发布入口。中文社交平台出现中文转述。

该日期是2026年中秋节。官方海报使用黑绿配色、猫耳轮廓和数据粒子，标题是LongCat-2.5-Preview。

![LongCat-2.5-Preview官方发布海报（来源：LongCat官方X账号）](/article-images/longcat-2-5-mid-autumn-preview/official-release.webp)

“Preview”是产品状态的一部分。LongCat官方GitHub组织与Hugging Face论文页的公开模型列表止于LongCat-2.0。LongCat 2.5的开放权重、训练报告和完整模型卡缺少公开材料。API与聊天产品构成本次发布的主要交付形式。

## 1.6T总参数，激活参数的官方表述“约48B”

官方参数表述包含四项：1.6T总参数、100万Token上下文、原生多模态，以及“约48B”的激活参数。

总参数与激活参数的差异呈现稀疏专家模型特征。每个Token的激活参数官方表述是“约48B”，计算量与1.6T全量参数存在显著差距。LongCat 2.0采用MoE架构；2.5技术报告缺席，路由器、专家数量和注意力结构缺少公开细节。

![LongCat-2.5-Preview官方参数与目标场景](/article-images/longcat-2-5-mid-autumn-preview/specs.webp)

100万Token上下文延续LongCat 2.0的长上下文路线。官方目标场景包括终端、浏览器、GUI、电子表格和设计工具。这些场景属于长流程Agent任务：模型读取大量上下文，调用工具，保存中间状态，完成多轮操作。

2.5与2.0的产品差异包括原生多模态。官方更新日志列出图像内容解析、跨模态问答、内容摘要和视觉推理。LongCat网站列出Claude Code、Hermes、OpenClaw、OpenCode和Kilo Code兼容性。

这些内容属于产品说明。工具调用成功率、长任务完成率、视觉推理精度和上下文有效长度缺少2.5独立评测。

## 价格沿用LongCat 2.0

LongCat API文档给出标准价和限时价。每百万Token的限时价格是：普通输入0.30美元或2元，缓存输入0.006美元或0.04元，输出1.20美元或8元。

标准价格是：普通输入0.75美元或5元，缓存输入0.015美元或0.10元，输出2.95美元或20元。2.5和2.0的价格表相同。

![LongCat 2.5 API标准价格与限时价格](/article-images/longcat-2-5-mid-autumn-preview/price.webp)

缓存输入与普通输入的限时价差是50倍。百万上下文任务携带仓库、历史记录或工具文档的重复内容。缓存命中率影响账单。官方文档缺少限时价结束日期，平台账单记录拥有价格解释权。

## LongCat 2.5排名：公开榜单席位空缺

LongCat-2.5-Preview的独立排名处于空白状态。

2026年9月26日的Artificial Analysis公开模型页收录LongCat 2.0，Intelligence Index分数是19。该页面缺少LongCat 2.5条目。

Arena文本综合榜收录两个LongCat旧型号。`longcat-flash-chat-2602-exp`综合名次是第93名，`longcat-flash-chat`综合名次是第146名。榜单缺少LongCat-2.5-Preview条目。

![LongCat 2.5与LongCat旧型号的公开榜单状态](/article-images/longcat-2-5-mid-autumn-preview/ranking.webp)

这些结果给“LongCat 2.5排名”一个答案：榜单席位空缺。LongCat 2.0分数与LongCat Flash名次属于旧型号。旧型号数据与2.5成绩是两组对象。

发布时间与检索时间的间隔小于一天。模型接入、样本积累和评测构成榜单周期。排名空白属于数据状态，能力结论保持开放。

## 产品信息与证据边界

LongCat-2.5-Preview的确认事实包括发布时间、参数规模、上下文长度、图像输入、目标场景、API入口和价格。性能结论缺少统一证据。

官方页面的2.5基准表处于空白状态。技术报告、模型卡和开放权重处于相同状态。Agent目标覆盖终端、浏览器和表格。成功率、平均任务长度、失败恢复和工具兼容范围缺少公开数字。

中秋节日期是发布事实的一部分。LongCat 2.5的竞争地位缺少独立评测。证据清单缺少技术报告、统一Agent基准和公开榜单成绩。

---

## 参考资料

1. LongCat, [LongCat-2.5-Preview官方发布帖](https://x.com/Meituan_LongCat/status/2103488918788411728)
2. LongCat, [官方网站](https://longcat.ai/)
3. LongCat API Docs, [LongCat 2.5价格](https://longcat.ai/platform/docs/pricing/longcat-2.5)
4. LongCat API Docs, [更新日志](https://longcat.ai/platform/docs/ChangeLog.html)
5. 国务院办公厅, [2026年部分节假日安排](https://www.gov.cn/zhengce/zhengceku/202511/content_7047091.htm)
6. Artificial Analysis, [模型排行榜](https://artificialanalysis.ai/leaderboards/models/)
7. Arena, [文本模型排行榜](https://arena.ai/leaderboard?mode=text)
