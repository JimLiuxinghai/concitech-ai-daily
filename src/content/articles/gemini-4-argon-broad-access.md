---
title: "Gemini 4 Argon 开放：百万 Token 长任务与限时半价"
description: "Google 扩大 Gemini 4 Argon 的开放范围。App 会员与 API 付费层有不同入口，输入、思考、输出共享百万 Token 额度。本文介绍限时价格、后台长输出、第三方成绩和代码优化案例，说明计费与工程边界。"
slug: "gemini-4-argon-broad-access"
publishedAtCST: "2026-10-14T07:12:29+08:00"
language: "zh"
author: "JimLiu"
categories: ["models","devtools"]
cover: "/article-covers/gemini-4-argon-broad-access.webp"
draft: false
wechatMediaId: "qwac_8j4kaaga6WV5YUa-d9e3aUMY7YX3RtjohtqUwOehA-KFBJ9pDUUGZBOVK3f"
---

Gemini 4 Argon 的开放范围扩大了。

Google 公告的日期是 2026 年 10 月 13 日。Gemini App、搜索 AI Mode、开发者 API 和企业平台，构成了这次开放的入口。

这个模型的首次公布日期是 9 月 30 日，初期对象包括经过筛选的网络安全防御团队。10 月 13 日的消息，是开发者、企业和付费消费者的接入范围扩大。[Google 开放公告](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/)

Argon 的定位是复杂、多步骤任务，涉及软件工程、专业知识工作和科研。使用者需要关注三个问题：入口的权限、长任务的额度、结果的验收。

“百万 Token”有具体的条件。“限时半价”有具体的期限。它们需要产品规格与价格表的说明。

## 谁能使用，入口是什么

普通用户的入口是 Gemini App 与搜索的 AI Mode，订阅条件是 Google AI Pro 或 Ultra。Google 的 App 公告确认了 Pro 与 Ultra 用户的访问权益。[App 开放说明](https://blog.google/innovation-and-ai/products/gemini-app/gemini-4-argon-availability/)

个人开发者的 Antigravity 入口要求 Google AI Ultra。App 会员权限、编程工具权限、API 计费账户，是不同层级的权益。

开发者与企业的入口包括 Google AI Studio、Google Cloud 的 Gemini 平台，以及付费 Gemini API。模型标识是 `gemini-4-argon`。免费 API 层缺少这个模型的访问权益。[Google Cloud 公告](https://cloud.google.com/blog/products/ai-machine-learning/gemini-4-argon-available-on-google-cloud)

一份 Pro 订阅提供 App 使用权，API 集成需要核对对应的付费层。两个入口的计费与额度需要分开检查，账号的会员标识缺少统一覆盖所有产品的含义。

开放消息的价值，是正式接入与评估的条件具备了。具体账号的可用模型、地区和使用限额，需要对应入口的确认。

## 百万 Token，是一份共享预算

Argon 的统一额度上限是 1,048,576 Token。输入、模型思考和输出，共享这份额度。[模型规格与迁移说明](https://ai.google.dev/gemini-api/docs/latest-model?hl=en)

一份占用 600,000 Token 的输入，留下 448,576 Token 的思考与输出空间。这是额度计算的示例，结果长度取决于模型行为与请求设置。

它区别于“百万输入加百万输出”。输入材料的占用量与思考、输出的剩余空间，存在取舍。

长代码分析需要这种预算意识。输入材料的数量，与保留给验证、推理和生成的空间，存在取舍。

普通调用的输出额度是 65,536 Token。后台长输出需要 `background: true`，并设置高于 65,536 的 `max_output_tokens`。这个字段包含思考与输出的总预算。

后台任务的最长运行时间是 24 小时。运行上限与完成质量是不同指标；任务有完成、失败、额度耗尽和等待工具等状态。[长输出文档](https://ai.google.dev/gemini-api/docs/long-decode)

![Argon 的共享 Token 预算与长输出条件，Google 文档数据及解释用算例](/article-images/gemini-4-argon-broad-access/token-budget.webp)

这项能力适合需要大量推理与生成的单次响应。普通摘要、分类和短问答，缺少消耗大额度的必要性。

一个工具调用很多的 Agent，其任务长度取决于状态维护、工具结果和验收规则。单次生成的输出上限，缺少对完整 Agent 可靠性的充分说明。

## 价格有两个阶段，思考属于输出费用

标准 Gemini API 的计价单位是美元／百万 Token。[官方价格表](https://ai.google.dev/gemini-api/docs/pricing)

| 计费项目 | 引入期：至 2026 年 11 月 30 日 | 常规期：2026 年 12 月 1 日起 |
| --- | ---: | ---: |
| 非缓存输入 | 2 美元 | 4 美元 |
| 输出，包含思考 | 10 美元 | 20 美元 |
| 缓存命中输入 | 0.10 美元 | 0.20 美元 |

“半价”指引入价格与公告的常规价格之比。它区别于长期价格承诺，缓存费用需要缓存命中条件。

Batch 与 Flex 档的输入、输出价格，是同期标准档的一半。处理方式、等待要求与适用条件，需要业务选择。

一个简单的成本算例是 100 万非缓存输入 Token，加上 10 万输出与思考 Token：引入期费用是 3 美元，常规期是 6 美元。算例缺少搜索等额外工具费用，真实账单需要完整的用量记录。

长输出采用分段接续，每段的输入包含原始材料与已有结果。累计输入 Token 包含这些重复读取，区别于实际上下文的唯一内容量。

Google 的长输出文档说明，重复输入有 95% 的隐式缓存折扣，取消或失败任务的已完成工作计入费用。[计费说明](https://ai.google.dev/gemini-api/docs/long-decode#understand-billing)

一项长任务的成本，需要输入、思考、输出、缓存和重试记录。输出字数缺少对全部费用的说明。

![标准 API 的引入价格与常规价格，单位美元／百万 Token，来源 Google 官方定价](/article-images/gemini-4-argon-broad-access/api-pricing.webp)

## 第三方第一名，属于哪一张榜单

Vals AI 的模型页面记录：Argon 的 Vals Index 成绩为 68.90%，名次是第一。该页面的评测说明列出 Claude Sonnet 5.5 的 67.04% 与 Claude Opus 5.5 的 66.97%。[Vals AI 原始评测](https://www.vals.ai/models/google_gemini-4-argon)

差距是 1.86 与 1.93 个百分点，属于算术比较，缺少对所有任务的胜负说明。

Vals Index 涉及金融、编程、法律、税务等工作。榜单的任务分布、评分方式与参数设置，决定这份成绩的含义。

同一页面的 CUA-bench 成绩为 4.83%，名次是第七／八。专业任务的领先，与电脑操作能力的全域领先，是不同结论。

该页记录的评测设置包括高推理强度和 262,144 的最大输出预算。不同配置的产品体验，需要独立的对照测试。

排名提供筛选线索。实际项目需要自己的评估任务：正确率、审核时间、成本和失败类型，决定模型与工作流的适配程度。

## 11 小时优化，六项建议与两项采纳

Google 的 ADK 工程案例提供了一项可检查的细节。

团队报告称，Argon 的第二轮运行持续了 11 小时，提出六项优化建议，两项获得采纳，四项被代码审核排除。采纳结果包括长会话内存准备时间减少约 40%、冷导入时间改善 21%。[Google 工程复盘](https://developers.googleblog.com/en/optimizing-a-200000-line-python-codebase-overnight-with-gemini-4-argon/)

这些数字属于特定框架开销，区别于模型响应速度或所有应用的总耗时。新进程首次模型请求的耗时是 3.07 秒与 3.09 秒，这组数据缺少提速收益。

这份复盘的价值包含成绩和拒绝理由。模型找到了性能优化方向，维护者检查了兼容性、状态风险与收益范围。

长任务的结果需要筛选。一个 Agent 运行了整夜，提交了改动，生产环境的采纳条件需要测试与审查。运行记录、生成代码、可合并方案，有不同的完成标准。

该案例属于 Google 的工程报告，本文的证据范围是原始报告，独立复现属于后续验证工作。[合并提交与基准记录](https://github.com/google/adk-python/commit/1754b3eeb6cdb2c16e3b30619a12066623df132e)提供了修改与验证方法的核对入口。

## 一次接入，需要四项验证

Argon 提供了评估长任务的入口，项目需要接入证据。

1. 权限：对应入口支持模型，订阅或 API 付费层匹配使用方式。
2. 预算：输入、思考与输出的上限有记录，计费阶段与缓存条件明确。
3. 状态：后台任务的完成、失败、额度耗尽和工具请求有处理路径。
4. 质量：结果包含验证材料，旧功能与关键约束有回归检查。

这份清单属于本文建议。它适用于长推理与代码工作流，具体要求需要对应业务。

Google 的这次开放，提供了模型、工具与产品入口。百万 Token 预算扩大了单次任务的空间，限时价格降低了评估阶段的计算费用。它们的实际价值，需要合格交付的数量与总成本回答。

Gemini 4 Argon 的能力评估，需要预算、证据与验收。

## 参考资料

1. [Google：首次公布 Argon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/) · [扩大开放公告](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/)
2. [Gemini App 会员入口](https://blog.google/innovation-and-ai/products/gemini-app/gemini-4-argon-availability/) · [Google Cloud 入口](https://cloud.google.com/blog/products/ai-machine-learning/gemini-4-argon-available-on-google-cloud)
3. [模型规格](https://ai.google.dev/gemini-api/docs/latest-model?hl=en) · [价格表](https://ai.google.dev/gemini-api/docs/pricing) · [长输出与计费](https://ai.google.dev/gemini-api/docs/long-decode)
4. [Vals AI：Argon 评测](https://www.vals.ai/models/google_gemini-4-argon)
5. [Google：ADK 优化工程复盘](https://developers.googleblog.com/en/optimizing-a-200000-line-python-codebase-overnight-with-gemini-4-argon/)

额度与费用计算属于解释用算例，接入清单属于实践建议；模型成绩与案例保留来源及适用条件。
