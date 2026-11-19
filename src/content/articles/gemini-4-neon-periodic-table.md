---
title: 谷歌又发模型了！Gemini 4 Neon登场，元素周期表够用吗？
description: >-
  Gemini 4 Neon占了氖的格子。七周四款Gemini
  4模型，氩、碳、氢、氖组成了谷歌的元素名单。Neon主打复杂高频工作，API单价低于两款竞品旗舰，Carbon的限时优惠改变了两款谷歌模型的价格关系。
slug: gemini-4-neon-periodic-table
publishedAtCST: '2026-11-19T09:30:14+08:00'
language: zh
author: JimLiu
categories:
  - models
  - products
cover: /article-covers/gemini-4-neon-periodic-table.webp
draft: false
wechatMediaId: qwac_8j4kaaga6WV5YUa-UY5pwYZjA5I5eHLo5mdYuR40A9FEa9pu8Dhc93Frw_e
---

氩、碳、氢、氖。一份 AI 模型发布清单，读起来像一张化学课复习提纲。

谷歌的 11 月 18 日公告带来了 **Gemini 4 Neon**。Neon 是氖，元素符号是 Ne。Gemini 4 家族的模型名单占了元素周期表上的四个格子。**谷歌这是准备把元素周期表全占满？**[1][2]

## 七周四款，Neon 占下第四格

9 月 30 日的公告介绍 Argon。11 月 10 日的公告扩大 Carbon 的开放范围。11 月 12 日的新成员是 Hydrogen，11 月 18 日的新成员是 Neon。这四个节点跨越 49 天。Carbon 的日期代表扩大开放，早期受邀试用属于另一阶段。[1][2]

![Gemini 4 的四个元素及其公告节点](/article-images/gemini-4-neon-periodic-table/element-grid.webp)

*元素位置对应周期表前三周期。日期对应谷歌公告节点。*[1][2]

谷歌的 Neon 公告给出了三档产品定位。**Hydrogen 负责日常任务，Carbon 负责最难的长流程项目，Neon 负责复杂且高频的工作。**Argon 的名字缺席这份对比图，API 模型目录包含 `gemini-4-argon`。[1][3]

软件团队的任务提供了三个例子。中小型代码改动和常规问答属于日常任务。跨文件修改、测试与反复核验属于复杂工作。架构迁移和难定位的故障占用的时间和审查成本更高。模型的组合给团队提供了不同的预算选项。

## Neon 的单价和单题成本

Neon 的标准付费档按每百万 Token 计价，输入 **3 美元**，输出 **15 美元**，缓存输入 **0.15 美元**。输出费用包含思考 Token。缓存输入费率适用于符合条件的隐式缓存命中。[3]

GPT-6.2 Astra 的短上下文标准输入与输出单价是 8 美元和 40 美元，Claude Fable 5.2 的基础费率相同。Neon 的对应单价是两者的 **37.5%**。对照的单位是 Token 单价，实际账单取决于模型用量和工具费用。[3][5]

Artificial Analysis 的 11 月 18 日发布评测记录了 Neon 的 xhigh 档 **61 分**，排名第三，前两名是 GPT-6.2 Astra 和 Claude Fable 5.2 的 Max 档。Neon 的 high 档是 **60 分**，与 Carbon 的 high 档同分。这里的分数来自综合智能指数，适用范围是该次评测的题集和配置。[4]

![Neon 两个推理档位与 Carbon 的综合评测对比](/article-images/gemini-4-neon-periodic-table/task-cost.webp)

*数据来源为 Artificial Analysis。Carbon 单题成本采用非促销价格。*[4]

Neon xhigh 的平均单题成本是 **6.44 美元**，Carbon high 的非促销价格估算是 **7.76 美元**。Neon xhigh 的平均单题推理耗时是 **21.5 分钟**，Carbon high 是 **36.1 分钟**。AA 的报告显示，Neon xhigh 的输出 Token 用量超过 Carbon high，输出速率优势缩短了推理耗时。[4]

Carbon 和 Argon 的优惠期终点是 11 月 30 日，输入与输出费率为 2 美元和 10 美元。12 月 1 日的标准价为 4 美元和 20 美元。Neon 的单价高于两款模型的优惠价，低于两款模型的优惠期后标价。[3]

## Neon 的用途包括分派工作

谷歌的 Antigravity 演示介绍了 Neon 的协调角色。Neon 担任 Orchestrator，多个 Hydrogen 子智能体负责分派的任务。一个软件团队的示意分工是，协调模型归纳需求和合并变更，子智能体检查相关模块、补充测试。接口冲突、重复修改和遗漏的验收项，决定这类分工的价值。[1]

办公场景的输入包括 PDF、表格、图片、音视频和文本。模型目录标注的上下文是 **100 万 Token**。Neon 的公开评测页面列出的输出模态是文本。工具链承担文件生成等操作。[3][4]

四个思考档位是 low、medium、high 和 xhigh。high 是默认档。AA 记录的 high 与 xhigh 档分差是 1 分，平均单题推理耗时差是 6.7 分钟。团队自己的验收指标包括合格交付率、等待时间、人工返工量和总费用。[1][4]

## 使用入口

Gemini App 的入口面向 Google AI Pro 和 Ultra 订阅者。开发者的模型 ID 是 `gemini-4-neon`，Gemini API 支持付费层。Antigravity 的适用范围包括 Google AI Pro 和 Ultra 订阅用户。企业入口是 Gemini for business 的 API 和模型菜单。[1][3]

## 参考资料

1. [谷歌 Neon 发布公告](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/) · [宝玉的推文](https://x.com/dotey/status/2123214459703267673)
2. 谷歌的 [Argon 公告](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/) · [Carbon 开放公告](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/) · [Hydrogen 公告](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/)
3. [Gemini API 模型目录](https://ai.google.dev/gemini-api/docs/models#gemini-4) · [Gemini API 价目表](https://ai.google.dev/gemini-api/docs/pricing#gemini-4-neon)
4. Artificial Analysis 的 [发布评测](https://artificialanalysis.ai/es/articles/gemini-4-neon-intelligence-gain) · [Neon 各档数据](https://artificialanalysis.ai/models/gemini-4-neon) · [评测数据表](https://artificialanalysis.ai/embed/llm-performance-leaderboard)
5. [OpenAI API 定价](https://developers.openai.com/api/docs/pricing) · [Claude API 定价](https://platform.claude.com/docs/en/about-claude/pricing)
