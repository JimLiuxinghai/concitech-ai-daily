---
title: "MiniMax M3.1 Flash 揭面：太空兔的低价与实测成绩单"
description: "MiniMax M3.1 Flash 揭晓太空兔身份。本文核对价格、权重计划与官方成绩，结合独立测评、平台测速和编程及业务实测，介绍版本差异、思考预算、任务表现与交付成本，保留测试条件与证据边界。"
slug: "minimax-m31-flash-field-tests"
publishedAtCST: "2026-10-20T10:18:17+08:00"
language: zh
author: JimLiu
categories: [models, devtools]
cover: "/article-covers/minimax-m31-flash-field-tests.webp"
draft: false
wechatMediaId: "qwac_8j4kaaga6WV5YUa-RdMDuLKxoLfXt-evEmZiYvcKGeUiG4WY2AYoCfjbxD_"
---


太空兔的身份揭晓了：MiniMax M3.1 Flash。

MiniMax 的发布日期是 2026 年 10 月 19 日。官方确认，匿名模型 Space Bunny 属于 M3.1 Flash 的早期版本，并给出每百万 Token 输入 0.15 美元、输出 0.60 美元、缓存读取 0.015 美元的价格。[发布推文](https://x.com/MiniMax_AI/status/2112150867868541221)

低价与使用热度构成了关注理由。工程团队需要另一份答案：这个模型能完成什么任务，失败的代价是什么？

第三方材料提供了几类证据：Artificial Analysis 的标准化测评、OpenRouter 的服务数据、AICodeKing 的预览版编程案例，以及 Spring Prompt 的发布日业务测试。本文做资料核对与结果分析，缺少本人运行模型的实验记录。

## 一、型号、价格与权重的时间表

官方文档中的模型标识是 `MiniMax-M3.1-Flash`，上下文窗口为 100 万 Token，输入包含文字、图片和视频，输出为文字。思考强度 `effort` 包含 `low`、`medium`、`high`、`xhigh`、`max` 五档，默认值为 `max`，关闭思考属于接口拒绝的配置。[模型文档](https://platform.minimax.io/docs/guides/text-generation)

上下文容量描述一次请求的容纳范围，含义区别于输出预算。100 万 Token 上下文与 32000 Token 输出上限属于可共存的配置。任务完成情况取决于思考与回答的预算分配。

API、M Plan 和 MiniMax Code 是官方提供的入口。官方推文给出的权重发布时间是 10 月 23 日，官网正文的说法是后续开放。本文核对日期是 10 月 20 日，权重下载与许可条件属于待确认事项，“开源模型发布完成”缺少证据。[官方介绍](https://www.minimax.io/blog/minimax-m31f)

Space Bunny、9 月预览版和 10 月正式版需要保留版本区别。早期版本的成功或失败，提供历史经验，缺少正式版能力证明的效力。

## 二、官方成绩与第三方测评的对照

MiniMax 的官方对照表记录了这些结果：

| 测试 | M3.1 Flash | DeepSeek V4.1 Flash 1017 | Opus 5 |
| --- | ---: | ---: | ---: |
| Automation-Bench v1.0.6 | 62.2 | 60.5 | 50.3 |
| DeepSWE v1.1 | 73.7 | 77.0 | 74.0 |
| Terminal Bench 4.0 | 38.1 | 42.3 | 51.8 |
| BabyVision，含工具 | 91.0 | 92.5 | 94.1 |

来源是 MiniMax 发布表，属于厂商报告，含义区别于本文复测。表内 M3.1 Flash 的自动化成绩领先，编程、终端和视觉任务呈现不同排序。比较对象中的 Opus 5 与 GPT-5.6 Sol，缺少各厂商最新旗舰的代表性。[官方成绩表](https://pbs.twimg.com/media/HU_d5nbXEAAict2.jpg?name=orig)

Artificial Analysis 的发布期模型页记录 Intelligence Index 得分 42，指数任务的加权平均成本为 0.22 美元。它与 GLM-5.3 Flash 的对比页显示，两者的取整指数为 42；M3.1 Flash 的任务成本为 0.22 美元，GLM-5.3 Flash 的任务成本为 0.28 美元。该页面的综合指数覆盖多种任务，单个业务场景需要专项结果。[模型测评](https://artificialanalysis.ai/models/minimax-m3-1-flash) · [同站对比](https://artificialanalysis.ai/models/comparisons/minimax-m3-1-flash-vs-glm-5-3-flash)

0.22 美元是该套测评的统计量，缺少“任何 Agent 任务成本”的普遍含义。模型页和榜单存在更新节奏差异，本文保留查询日期，省略存在组别歧义的全球排名。

![官方报告、独立测评与平台服务数据的证据边界；本文整理](/article-images/minimax-m31-flash-field-tests/evidence-layers.webp)

## 三、OpenRouter 的实测与速度边界

OpenRouter 的披露记录，匿名测试期间的首 Token 时间由 1.95 秒降至 1.22 秒，吞吐由每秒 70 Token 升至 100 Token，错误率由 1.4% 降至 0.7%。[平台披露](https://x.com/OpenRouter/status/2112152058912755726)

这是服务平台对匿名运行阶段改进的报告。测量对象包含部署环境、服务负载和版本变化，含义区别于正式版对所有请求的速度保证。平台错误率描述请求服务表现，代码正确率属于另一种指标。

MiniMax 的“相较 M3 三倍速度”与上述匿名阶段数据采用不同比较对象。官方介绍中的 170+ Token/s 中位速度、200+ Token/s 输出表现，属于厂商口径。三个数字需要各自的测试条件，拼接成统一结论会造成误读。

OpenRouter 披露 Space Bunny 的 Token 用量为 56.7T，其平台用量榜首位的保持时间为十天；MiniMax 披露匿名阶段用量超过 200T。两项披露的统计范围缺少统一定义，本文保留来源区别。用量体现采用情况，模型质量需要评测证据。[OpenRouter 揭面说明](https://x.com/OpenRouter/status/2112152045461680591)

## 四、编程实测：漂亮的页面与正确的交互，是两件事

AICodeKing 的测试视频日期是 9 月 28 日，测试对象为 M3.1 Flash Preview。KingBench 3 包含八个任务，每项满分十分，总分八十分，模型得到 53 分，折算为 66.25%。这个百分比表示得分比例，含义区别于完整任务成功率。[原始测试视频](https://www.youtube.com/watch?v=acPS3TGflXU)

视频作者检查保存的代码与预览交互，案例包含明显差异：

| 案例 | 分数 | 作者观察 |
| --- | ---: | --- |
| 3D 折叠桌 | 9/10 | 滑块控制折叠与展开，几何运动具有连贯性 |
| 隐形眼镜盒 | 8/10 | 盒盖交互可用，内部凹槽建模存在问题 |
| 射箭游戏 | 4/10 | 靶面位置、移动靶和计时逻辑出现错误 |
| 电梯模拟 | 3/10 | 生成人物按钮触发异常，核心流程失败 |

![AICodeKing 的四项预览版案例得分，选自八项测试；非正式版复测](/article-images/minimax-m31-flash-field-tests/preview-task-scores.webp)

评测表缺少思考档位，保存产物的检查缺少生成尝试次数与修正过程记录。这个小样本展示能力分布，缺少发布日正式版复测的身份。它提出的验收问题具有普适性：页面完成，需要检查按钮、状态转换和业务流程。

## 五、正式版业务实测：短任务有亮点，长任务需要兜底

Spring Prompt 的 10 月 19 日测试使用 OpenRouter 的 `:free` 路由，模型供应方为 MiniMax，推理设置采用供应方默认配置。免费路由存在限流，测试机构放弃自身速度结论。

CatalogBench 使用 56 个虚构商品，提供源数据和图片，每个商品测试三次。M3.1 Flash 的事实型商品说明获得 50% 的“三次重复的结果符合发布标准”比例。这是该测试定义的可靠发布指标，含义区别于一般事实准确率。

长任务出现另一种表现：SurveyBench 的 24 个规划与分析步骤中，18 步耗尽 32000 Token 输出预算，答案为空。报告中的八份演示文稿有两份缺少输出。[Spring Prompt 原始报告](https://springprompt.com/blog/minimax-m3-1-flash-review)

这些结果属于免费路由、默认思考设置与指定输出上限的组合，缺少其他路由和预算条件的代表性。测试机构的付费路由复测属于后续计划。

这组实测说明，Token 生成速度、答案完成时间和有效交付率，需要不同记录。低单价带来试错空间，空输出、重试和人工修复消耗这个空间。

## 六、开发者需要算“交付账”

官方计价允许一种透明演算：一次请求包含 10 万个非缓存输入 Token 和 2 万个计费输出 Token，模型费用为 0.015 + 0.012 = 0.027 美元。全部输入满足缓存读取条件的同量请求，模型费用为 0.0015 + 0.012 = 0.0135 美元。

这是本文的假设计算，排除了工具调用、外部服务、税费和重试成本；输入命中缓存属于前提。思考 Token 的计费归属需要核对接口账单，预算采用计费输出量。

一次合格交付的成本，包含模型费用、工具费用、失败重试和人工验收。便宜的单次调用与便宜的合格结果，需要成功率连接。

我的判断是，M3.1 Flash 适合进入候选池：材料抽取、结构化草稿、可运行测试覆盖的代码任务，具有明确验收入口；复杂交互、长报告和外部系统写入，需要超时、重试与审批边界。这属于本文的选型建议，效果需要真实项目验证。

一组项目试验需要记录五项：型号与日期、服务路由、思考档位与输出上限、任务验收结果、完整费用与人工时间。相同任务和预算构成比较基础，历史预览版与正式版采用独立记录。

太空兔揭面解决了身份问题。模型选型需要解决交付问题：每一笔费用，换回了什么合格结果？

## 参考资料

1. [MiniMax 发布推文](https://x.com/MiniMax_AI/status/2112150867868541221)；[官方介绍](https://www.minimax.io/blog/minimax-m31f)；[模型文档](https://platform.minimax.io/docs/guides/text-generation)。
2. [Artificial Analysis 模型页](https://artificialanalysis.ai/models/minimax-m3-1-flash)；[GLM-5.3 Flash 对比页](https://artificialanalysis.ai/models/comparisons/minimax-m3-1-flash-vs-glm-5-3-flash)。查询日期：2026 年 10 月 20 日。
3. [OpenRouter 揭面与用量披露](https://x.com/OpenRouter/status/2112152045461680591)；[服务表现改进](https://x.com/OpenRouter/status/2112152058912755726)。
4. [AICodeKing：M3.1 Flash Preview 八任务测试](https://www.youtube.com/watch?v=acPS3TGflXU)，2026 年 9 月 28 日。
5. [Spring Prompt：发布日免费路由测评](https://springprompt.com/blog/minimax-m3-1-flash-review)，2026 年 10 月 19 日。
