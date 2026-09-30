---
title: "OpenAI发布Decisions API：AI成为软件里的选择题引擎"
description: "OpenAI推出基于GPT-6 Luna的Decisions API。开发者给出问题、候选答案及文本或图像，模型承担分类、路由与Agent动作选择。本文梳理产品边界、Jev对比及上线验收要点。"
slug: "openai-decisions-api-choice-engine"
publishedAtCST: "2026-09-30T12:00:00+08:00"
language: zh
author: JimLiu
categories: [products, devtools, business]
cover: "/article-covers/openai-decisions-api-choice-engine.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-UGp2vPa0KLDSePq6mu6mv5bIOn7H4ifRXhXAbpem0rH"
draft: false
---

OpenAI给开发者一道选择题。

开发者写出问题和候选答案，并交给模型一段文本或一张图片。模型选出答案，软件接手后续流程。这套接口叫Decisions API，底层模型是GPT-6 Luna。

这条产品消息出现在OpenAI DevDay 2026。OpenAI列出的用途包括内容分类、请求路由、Agent下一步动作选择。产品状态是限量预览，开放范围预计扩大。

![Decisions API的输入、选择和软件执行链路](/article-images/openai-decisions-api-choice-engine/decision-flow.webp)

这件事的新闻价值，在于模型的工作单位变化：一篇回答变成一道选择题。对软件系统来说，一道选择题对应一条可执行分支。

## 一次调用承担什么工作

设想一套客服工单系统。用户写下：“账号扣款成功，会员权益消失。”开发者给出四个答案：支付问题、账号问题、权益问题、人工复核。

生成式模型的常见输出是一段分析。系统承担文本读取、标签提取与格式检查。Decisions API的产品定义把问题和答案空间交给开发者。模型的任务是选项判断；系统的任务是执行分支。

同一结构适用于安全审核、邮件分流、搜索意图判断，以及Agent工具选择。图像输入带来另一类场景：商品照片进入售后流程，模型选择“包装破损”“型号不符”或“证据不足”。

候选答案由开发者设计。候选集缺少“证据不足”或“人工复核”，系统面临退路缺失。有限答案约束输出范围，答案的正确性取决于输入质量、选项设计和模型能力。

## “150毫秒”代表什么

原推文提到约150毫秒的决策时间，以及普通Luna调用约1.6秒的对照。多家媒体报道了这组数字。OpenAI的DevDay官方回顾确认了产品用途、模型基础与预览状态。回顾正文缺少延迟测试条件与服务等级承诺。

150毫秒属于产品演示或厂商口径，缺少业务系统延迟保证。网络距离、图片大小、并发量和尾部延迟，会改变生产环境的结果。

OpenAI官方回顾缺少产品定价、候选答案数量上限、置信度字段语义和正式接口文档。GPT-6 Luna常规API的价格与Decisions API报价属于不同信息。

![公开信息与待核实信息的边界](/article-images/openai-decisions-api-choice-engine/evidence-boundary.webp)

## Jev与OpenAI盯上同一层

TypeSafe AI的9月15日公告推出Jev。它把文本状态映射成类型化决策，并给出概率与置信度。TypeSafe公布的Jev输入价格是每百万Token 0.042美元，输出价格为零；这是厂商定价，服务处于早期开放阶段。该公司给出的端到端延迟范围是70—500毫秒，测试环境与任务形态决定具体数值。

OpenAI的9月29日公告发布Decisions API。官方确认的差异点之一是图像输入。Jev发布资料描述的重点是结构化状态、类型安全输出与概率校准。两家产品的可用范围、任务集合和计费口径缺少统一公开测试。单项演示数据不足以形成产品排名。

现有证据不足以支持“抄袭”判断。分类器、规则引擎、受约束输出和概率评分，属于软件与机器学习领域的既有范式。两家公司的产品方向指向一个市场需求：软件要求AI作决定，答案进入程序分支。

![规则、决策模型与生成模型的分工](/article-images/openai-decisions-api-choice-engine/three-layers.webp)

## 软件工程的关键变化

工程师的既有工具箱包含`if/else`和大模型：前者处理明确条件，后者处理开放任务。两者之间存在一批灰色问题：退款理由属于哪类？这张图片能否支撑投诉？下一步该找检索工具，还是找人工客服？

决策接口填补这层空白。它的职责是有限选项判断。长篇解释属于生成模型的任务；执行属于业务软件的任务。代码保留权限控制、审计记录、回滚机制和业务规则；模型承担模糊判断。

一条生产流程需要四项验收：

1. **准确率**：使用自家历史样本，按类别、语言、图片质量和长尾案例统计错误。
2. **延迟**：记录中位数、95分位和99分位；把网络与下游动作计入完整链路。
3. **不确定性**：保留“证据不足”“人工复核”等选项；核对置信度与真实正确率的关系。
4. **责任边界**：支付、封禁、医疗和金融等高风险动作，保留规则门槛与人工审批。

第三项关乎系统责任。一个类型正确的答案存在事实错误风险。一个数字为0.95的置信度，校准验证依赖目标业务数据。

## 选择题背后的市场

聊天模型服务人，决策接口服务软件。前者交付语言，后者交付可进入代码的选择。前者展示模型的表达能力，后者接受延迟、错误率与成本考核。

Decisions API的产品机会，来自成千上万处软件分支。它的产品难题，也藏在这些分支里：开发者给出的选项是否完整，错误能否被发现，系统是否留有安全出口。

OpenAI交出了一套接口定义。竞争结果取决于正式文档、价格和生产环境数据。

### 资料来源

- [OpenAI DevDay 2026官方回顾](https://openai.com/index/devday-2026-recap/)
- [OpenAI Developers产品公告](https://x.com/OpenAIDevs/status/2105003318917697873)
- [TypeSafe AI：Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [TypeSafe AI产品主页](https://typesafe.ai/)
- [dotey推文](https://x.com/dotey/status/2105065658149208338)
