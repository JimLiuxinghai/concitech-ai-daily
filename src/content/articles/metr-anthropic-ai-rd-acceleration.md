---
title: METR公布Anthropic评估！基准增速1.9倍，关键证据遭删减
description: >-
  METR公布Anthropic研发加速评估，AECI基准增速估计为此前1.9倍，95%置信区间为1.5—2.8倍。AI贡献约八成属于高不确定性的主观判断。报告保留公开基准分析，部分关键内部证据遭删减，数据访问与公开复核存在边界。
slug: metr-anthropic-ai-rd-acceleration
publishedAtCST: '2026-11-06T09:15:09+08:00'
language: zh
author: JimLiu
categories:
  - research
  - policy
cover: /article-covers/metr-anthropic-ai-rd-acceleration.webp
draft: false
wechatMediaId: "qwac_8j4kaaga6WV5YUa-VJiLPKYO36AAuEznzh59N9KHjHSTgD2_u3bx9eTtDjO"
---

AI参与研发，研发产出的新模型参与下一轮研发。这条反馈链的增强，带来研发节奏与安全评估节奏的匹配问题。

METR的11月5日报告提供了一份外部评估。研究对象是Anthropic，评估时间为2026年8月12日至10月29日。

公开分析给出一个数字：**Anthropic模型的AECI基准增速估计为2025年10月之前的1.9倍，95%置信区间为1.5—2.8倍。**

这个结果描述基准进步的速度。模型能力变成1.9倍、训练效率提高1.9倍、工程师产出增加1.9倍，属于不同命题。[METR报告](https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/)

报告的另一个重要事实是证据删减：Anthropic删除了METR认为信息价值最高的大部分内部依据。公众获得风险结论与部分分析，完整复核受到限制。

## 1.9倍，测量的是哪条曲线？

AECI是Anthropic版本的Epoch Capabilities Index。Epoch的ECI方法整合多项基准成绩，形成能力指数，目的是减少单项测评饱和对长期比较的影响。[Epoch方法介绍](https://epoch.ai/eci)

METR比较2025年10月前后的AECI趋势。官方图给出的两段拟合斜率为每年约15点、每年约29点，比值构成1.9倍估计。

1.9倍增速的近似含义是：相同基准进展的实现耗时，接近此前的一半。这里的进展属于指数曲线，任务成功率与现实工作收益需要对应的测量。

![METR发布的Anthropic模型AECI趋势，包含内部模型与95%置信区间](/article-images/metr-anthropic-ai-rd-acceleration/official-aeci-trend.webp)

*图1：METR原始图。绿色表示公开模型，橙色表示内部模型。横轴日期对应大多数Anthropic员工的模型访问权限开放节点。来源：METR。*

日期口径决定比较范围：员工可用日期与产品公开发布日期，属于不同时间点。内部模型进入分析，提供了公开产品之外的信息。内部可用性与公众可用性，需要对应的确认。

方法选择影响结果。METR的替代统计设定给出1.1—2.9倍估计；模型范围、基准选择与任务难度分布，构成额外的不确定性来源。[方法与稳健性分析](https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/#benchmark-scores-aeci)

**95%置信区间描述指定分析中的统计不确定性。方法设定的变化，需要另外的稳健性检验。**

## “八成来自AI”，是一项归因判断

METR综合判断的近似值是2024年3月至2025年10月进步速度的2倍，范围是Anthropic的目标明确型任务能力进步。团队成员存在分歧，这个结论带有较高不确定性。

AI的贡献份额属于另一个问题。METR认为，AI使用是2026年10月加速的主要原因，主观份额猜测的近似值为80%。这是主观归因估计，缺少随机对照实验的因果识别强度。

这里的80%指向加速的归因，模型能力的80%、员工工作的80%或研发岗位的替代比例，属于不同指标。

METR考察了算力、招聘、数据与算法等因素。评估方排除了“训练算力增长速度加快”这一解释，详细依据遭删减；其他因素的作用需要辨析。[主观判断与归因](https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/#our-conclusions-on-risk)

排除一种解释，与证明某项因素贡献八成，是两个论证任务。研发过程包含人员、实验、数据与训练等环节。单个环节的劳动提速与组织层面的能力进步，采用不同的度量。

员工访谈与效率自报属于线索，提供使用者的观察。无AI条件下的组织进展，是需要推断的反事实量；它与实际观察具有不同的证据性质。

报告描述的主要形态是AI辅助研发。报告认为，AI对关键训练环节的重大自主贡献，属于待实现能力。递归自我改进的风险讨论与无人类研发闭环的完成，属于不同状态。

报告关注的风险是加速反馈：模型能力支持研发效率，研发效率支持模型能力。反馈持续性的判断，取决于瓶颈与边际收益。

## 评估方看到了什么，公众看到了什么？

METR向Anthropic提交了一份约100页的完整报告。公开版保留基准分析，删减内容包括关键中间指标、算法进步估计、投入因素分解，以及部分瓶颈与预测依据。

这个区别关系到结论的可复核性。

评估方接触内部材料，形成判断；公众接触公开材料，检查论证。两者掌握的信息存在差距，报告作者的可信度承担了额外权重。

Anthropic联合创始人Sam McCandlish承认，大量删减增加了外界检查METR工作的难度。他给出两项理由：商业敏感性，以及细节公开对其他开发者加速研发的帮助。他认为这项取舍合理。[Sam的回应](https://x.com/Sam_McCandlish/status/2118422266669371519)

商业保密、风险控制与公众知情，构成这次公开过程的张力。删减的存在，缺少证明结论错误的充分性。评估机构的署名提供责任归属，完整证据支持外部复核。

![统计结果、AI归因、证据披露与研发工作方式的四层区别](/article-images/metr-anthropic-ai-rd-acceleration/evidence-boundaries.webp)

*图2：本文对报告证据层次的归纳。统计估计、归因判断与公开复核具有不同边界。*

## “外部评估”包含哪些访问边界？

Anthropic的10月15日公告介绍了一项员工式访问安排：特定METR团队获得内部工具与系统权限，具有公开分析的权利；保密类别的删减权归Anthropic。[官方说明](https://www.anthropic.com/news/an-update-on-independent-evaluators)

**这份11月报告所对应的研发加速项目，与上述驻场安排是两个项目。**

本次项目采用请求式信息获取。Anthropic具有批准或拒绝请求的权利。METR认为信息访问超过初始预期。访问通道较窄、部分请求遭拒，以及遗漏未知材料的风险，构成报告披露的访问限制。

机构独立性、访问深度与公开证据完整度，构成三个不同维度。一张“独立评估”的标签，需要方法、权限与披露安排支撑。

报告披露了一项利益冲突：一名参与者与Anthropic洽谈过职位，收到录用邀请，选择拒绝。该成员持有竞对股权。无冲突成员复核了该参与者的相关工作；METR更新后的政策要求此类情况回避。报告称，项目成员持有Anthropic股权的情况为零。[过程与利益冲突披露](https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/#process-transparency-disclosures)

这些披露提供判断评估过程的材料，缺少证明研究遭操纵的充分性。支持结论的证据、潜在偏差来源与补救措施，构成审阅对象。

## 后续判断，需要三类材料

这份报告提供了加速信号，现实影响的大小与成因，需要后续证据。

1. **能力外推**：真实研发任务、复杂工程与开放问题需要对应测量。
2. **归因材料**：AI使用、其他投入与结果的关系，需要可比较的记录和替代解释检验。
3. **监督条件**：访问权限、公开材料与利益冲突处理，需要支持外部检查的制度安排。

METR对未来瓶颈的判断带有不确定性；Sam预告的公司分析与安全措施，属于待发布计划。该项目的目标是研发加速评估，安全政策门槛的判定属于另一项工作。

**1.9倍是一项基准增速估计，80%是一项归因猜测，删减证据留下公开复核的缺口。**

三者的边界，决定这条新闻的实际分量。

## 参考资料

- [METR：Independent Assessment of AI R&D Acceleration at Anthropic in October 2026，2026-11-05](https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/)
- [Epoch AI：Epoch Capabilities Index](https://epoch.ai/eci)
- [Anthropic：An update on independent evaluators，2026-10-15](https://www.anthropic.com/news/an-update-on-independent-evaluators)
- [Sam McCandlish：对METR报告的回应](https://x.com/Sam_McCandlish/status/2118422266669371519)
