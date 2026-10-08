---
title: "Claude Haiku 5.5 降价 90%？10 万 Token 分界线决定账单"
description: "Anthropic 发布 Claude Haiku 5.5。短请求输入价格为每百万 Token 0.1 美元，长请求采用另一档费率。本文核对价格、性能与使用场景。"
slug: "claude-haiku-55-price-threshold"
publishedAtCST: "2026-10-08T08:14:00+08:00"
language: zh
author: JimLiu
categories: [models, products]
cover: "/article-covers/claude-haiku-55-price-threshold.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-fS5FaW0yBL2f_dcCRuHL8kD1LHZy8BvMw2fv0jYHHm9"
draft: false
---

Claude Haiku 5.5 发布。Anthropic 给它贴上三个标签：小模型、低成本、高速度。价格表写着一个数字：90%。价格表还有一道分界线：单次请求的提示词长度为 10 万 Token。

这道分界线影响预算。短请求与长请求拥有两套费率。“降价 90%”对应前者。长请求的降幅是 50%。Anthropic 估算，实际任务的平均成本降幅约为 75%。

## 一张价格表，两种费率

Claude API 按输入、输出、缓存读写分别计费。Haiku 5.5 的价格表如下。单位是美元／百万 Token。

| 请求提示词长度 | 输入 | 输出 | 缓存读取 | 缓存写入 |
| --- | ---: | ---: | ---: | ---: |
| 不超过 10 万 Token | 0.10 | 0.50 | 0.01 | 0.125 |
| 超过 10 万 Token | 0.50 | 2.50 | 0.05 | 0.625 |
| Haiku 4.5 参考价 | 1.00 | 5.00 | 0.10 | 1.25 |

![Haiku 5.5 短请求、长请求与 Haiku 4.5 的价格比较，单位为美元每百万 Token](/article-images/claude-haiku-55-price-threshold/pricing.webp)

*图：Anthropic 公布的 Claude API 价格。10 万 Token 指单次请求的提示词长度。*

一个账单例子：某项业务累计消耗 1000 万输入 Token 与 100 万输出 Token，每次请求的提示词长度处于 10 万 Token 以内。Haiku 5.5 的基础费用为 1.50 美元；Haiku 4.5 为 15 美元。相同消耗量对应长请求费率的基础费用为 7.50 美元。缓存、批处理与平台附加费用属于例子之外。

Anthropic 称，Haiku 4.5 的请求中约有 90% 落入短请求区间。这个比例指请求数量，缺少 Token 消耗分布。新模型的分词器产生的 Token 数量有变化。90% 的单价降幅与 75% 的平均任务成本降幅属于两种口径。

## 性能提升，证据来自官方评测

Anthropic 发布了两组醒目的对比数据。OSWorld 2.1 的离线子集测试衡量计算机操作任务，Haiku 4.5 的成绩为 15.7%，Haiku 5.5 为 72.4%。Terminal-Bench 4.0 衡量命令行复杂任务，成绩由 0.0% 升至 39.2%。

![Anthropic 公布的 Haiku 4.5 与 Haiku 5.5 基准成绩对比](/article-images/claude-haiku-55-price-threshold/benchmarks.webp)

*图：Anthropic 发布的评测结果；OSWorld 2.1 使用离线子集。数字属于厂商披露，跨平台表现需要业务评测。*

这组数据说明能力跨度。它缺少真实业务中的错误成本、重试次数、工具环境与任务分布。Asana 的早期测试提供另一种观察：任务完成延迟降幅超过 30%。这个数字来自 Asana 自有评测，比较对象是其现用模型，不能当作 Haiku 4.5 的统一延迟对比。

## 小模型的位置：高频任务与子任务

Anthropic 给 Haiku 5.5 列出的场景包括摘要、分类、请求路由、上下文压缩、客服响应、浏览器操作与范围明确的代码修改。模型提供可调节的 effort 档位。任务质量与费用形成一组可选参数。

一套 Agent 系统可以拆成两类工作：主模型负责规划与复杂判断；小模型承担资料提取、字段分类、结果摘要等子任务。此处的收益取决于任务边界。低价模型若触发更多失败与重试，费用优势便会缩水。

Anthropic 自己给出了边界：Sonnet 5.5 和 Opus 5.5 更适合复杂 Agent 编程。Terminal-Bench 4.0 的官方成绩支持这句话：Haiku 5.5 为 39.2%，Sonnet 5.5 为 70.6%。Haiku 5.5 的角色是高频、范围清晰的工作负载，非旗舰模型替身。

## 发布范围与配套调整

Haiku 5.5 的 API 模型 ID 是 `claude-haiku-5-5`。Claude 网页与移动端、Claude Code、AWS、Google Cloud、Microsoft Azure 均列入官方可用范围。

这次发布包含 Sonnet 5.5 的缓存读取降价：每百万 Token 从 0.20 美元变成 0.10 美元。Anthropic 估算，多数 Agent 任务的 Sonnet 5.5 成本降幅约为 20%。Max 与 Team 用户的每月 API 额度属于本周推出计划，发布公告没有宣称全部账户到账。

Haiku 5.5 的关键变化不是一句“更便宜”。它给高频短任务提供了新价格，给复杂工作保留了模型分工。预算表该多一列：单次提示词长度。

## 参考资料

- [Anthropic：Claude Haiku 5.5 发布公告](https://www.anthropic.com/claude-haiku-5-5)
- [Anthropic：Claude Haiku 产品页](https://www.anthropic.com/claude/haiku)
- [宝玉对发布消息的介绍](https://x.com/dotey/status/2107896388163919908)
