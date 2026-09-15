---
title: "Anthropic 的 AI 编码账单：8 倍代码产量，25 倍 CI 任务"
description: "Anthropic 工程团队披露一场 CI 扩容事故：代码产量增至过去的 8 倍，测试数量增至 10 倍，CI Job 半年增长 25 倍。三次补丁失效，团队重写了测试影响分析服务。"
slug: "anthropic-agentic-coding-ci"
publishedAtCST: "2026-09-16T07:30:10+08:00"
language: zh
author: JimLiu
categories: [devtools, business]
cover: "/article-covers/anthropic-agentic-coding-ci.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-dOrB5bSZxwXDf6dLtMrF9OeIOMx5KMc4IXIJdebK0gC"
draft: false
---
AI 编码提高了代码产量。CI 系统收到新账单。

Anthropic 工程师披露了一组内部数据。工程师的季度代码交付量达到 2021 至 2025 年平均水平的 8 倍。Claude 编写的合并代码占比是 80% 左右。测试数量增长 10 倍。工程师数量增幅有限。

CI Job 的六个月增长倍数是 25。

测试影响分析服务承受了这股流量。团队加机器、做进程内分片、设置每日重启。三次补丁寿命是 70 天、29 天和不足一天。

答案是一场架构重写。

这段经历揭示了 Agentic Coding 的另一面：代码生成成本下降，验证系统成为生产瓶颈。

![CI Job 数量与三次补丁寿命，来源：Anthropic](/article-images/anthropic-agentic-coding-ci/ci-growth.webp)

## 代码稀缺性的消失

传统软件团队的工作分配包含编码、评审与测试。Agent 改变前两项的速度。

Anthropic 表示，Claude 承担大量代码编写，参与 PR 评审与批准。PR 数量增长，PR 粒度变小。Agent 提交覆盖夜间和周末，CI 的低谷被抬高。人类工程师保留方向与批准权，流量带有突发性。

代码量增长带来测试量增长。Anthropic 的测试数量达到原来的 10 倍。单个小 PR 对应多个 CI Job 的概率上升。代码产量、测试数量和 PR 频率形成乘法关系。

“开发者快了 8 倍”与“软件交付快了 8 倍”缺少等价关系。流水线速度取决于瓶颈环节。代码编写加速促使瓶颈转移。PR 评审、CI、发布、监控与事故处理接管瓶颈位置。

## 全量测试的扩展上限

每个 PR 执行全部测试是一种简单策略。代码库与提交量增长促使这项策略产生长队列和高成本。

Anthropic 使用确定性的 Test Impact Analysis，中文可称测试影响分析。服务根据历史测试结果与 Package 相关性选择测试集合。

系统有两个核心组件。

Listener 记录每次 CI 运行的测试结果。Selector 读取历史数据，决定一个 PR 对应哪些测试。

这套设计依赖数据新鲜度。Listener 延迟 20 分钟，数万条测试更新滞留于 Selector 之外。坏提交带来共享测试持续失败风险。依赖波动带来 Flaky Red 风险。新测试或修复结果存在缺席选择逻辑的风险。

CI 执行保持完整。风险来自选择器的陈旧历史。风险类型包括已知 Flaky 测试的重复运行与新关联关系的遗漏。工程师和 Agent 得到一组低质量反馈，修复循环变慢。

## 单进程设计碰到增长墙

初版 Listener 保存每个测试的运行历史。一个写入者维护顺序。单进程拥有全部内存状态。

这个设计易于理解，横向扩展难度高。副本增加产生状态冲突。单机扩容增加纵向容量。

![测试选择服务重构前后，来源：Anthropic](/article-images/anthropic-agentic-coding-ci/architecture.webp)

第一次告警日期是 2025 年 10 月。团队给服务增加一倍 CPU 核心。补丁寿命接近 70 天。

第二次方案采用 Package 分片。每个 Package 拥有独立写入者。Claude 生成了分片代码。这个方案维持 29 天。

第三次方案是每日重启。进程内存触顶时段是工作日下午。团队发现四个 Bug，更换内存分配器的效果为零。每日重启换来不足一天，服务积压保持增长。

根因保持存在。状态与进程绑定，吞吐上限与一台机器绑定。

## 重写方案：状态离开 Worker

新架构加入内存数据存储。

每个 Listener Worker 接收任意测试结果，结果写入 Journal。Worker 无测试历史状态。一个小型 Consumer 汇总 Journal，生成每个测试的历史。Selector 查询汇总数据。

状态离开 Listener，Worker 变成无状态进程。副本数量具有弹性。内存分析拥有明确边界。Journal 提供统一事件记录，Consumer 负责顺序与聚合。

这个方案增加了基础设施成本，换来横向扩展能力。

Anthropic 表示，一名工程师用了三周完成项目。作者给出一年前工期估计：接近一个季度。Claude 承担了 Journal 容量和 Worker 数量的部分调优工作。

![Listener 积压变化，来源：Anthropic](/article-images/anthropic-agentic-coding-ci/backlog.webp)

官方图表显示，重构前的未处理事件峰值超过 250 万。5 月 9 日是新架构切换日，5 月 14 日是容量调优完成日。调优后的积压接近水平线。团队称服务保持稳定。

## 三次补丁为什么越来越短命

第一次补丁增加固定容量。第二次补丁提高单进程并行度。第三次补丁释放内存。三者延续同一种状态模型。

负载增长曲线改变了补丁价值。固定容量购买一个时间窗口。增长率升高，窗口长度缩短。70 天、29 天、不足一天形成一条清晰序列。

Anthropic 作者给出的建议是两个季度 25 倍负载的设计目标。这个建议来自单家公司与特殊工作流，缺少行业通用基准。25 倍数字缺少普遍适用性。

稳妥原则是容量假设包含 Agent 增长项。v0 扩展路径包含状态外置、队列可观测、Worker 无状态、写入幂等、积压可回放。

这些条件提高首版成本。AI 降低重构成本。旧时代的“过度设计”边界发生移动。

## CI 反馈的精度要求

人类工程师拥有无关测试失败识别能力。Agent 依赖明确上下文。

有效测试集合帮助 Agent 自检、修复和提交。无关 Flaky 测试把 Agent 引向错误方向。陈旧选择数据制造错误置信。

测试影响分析具有双重价值：减少 CI 成本，改善 Agent 的反馈信号。

选择器本身成为高风险组件。它漏掉相关测试，回归风险增加。保护措施包括全量测试、抽样审计、规则回退或发布前门禁。Anthropic 原文缺少召回率、漏测率和成本数据。

确定性选择服务的审计成本低于模型负责测试选择。历史记录与 Package 相关性提供可解释依据。这个选择值得注意：AI 生成大量代码，确定性系统管理测试门禁。

## 监控系统成为 Claude 的感官

Anthropic 工程师给内部 Claude Tag 建立了长期会话。Listener 的积压告警阈值是 5 万 Job。Claude 发送提醒，保留前次讨论上下文。

作者建议给关键服务提供机器可读指标。输入 Job 数量与输出 Job 数量相等是守恒指标。队列深度、处理延迟、内存、失败率和吞吐量构成 Agent 的观察面。

稳定遥测支持故障诊断与参数调优闭环。聊天窗口里的日志片段缺少连续状态。

这条经验超出 CI。同类观测接口适用于数据库迁移、消息队列、数据管道和发布系统。

## 这篇复盘的证据边界

文章来自 Anthropic 自家工程团队。8 倍代码量、80% Claude 代码、10 倍测试量和 25 倍 CI Job 属于公司内部统计。原始数据集与计算口径处于非公开状态。

三周重构时间与作者的一年前工期估计包含主观判断。该估计值接近一个季度。服务稳定性来自团队陈述。外部团队缺少独立复现条件。

架构案例本身保有参考价值。单进程有状态 Listener 的扩展上限、Journal 加无状态 Worker 的改造逻辑、积压图表和补丁寿命构成一条完整工程证据链。

Agentic Coding 的收益进入第二阶段。代码数量失去稀缺性，验证吞吐产生价格。

企业购买编码 Agent，预算表包含 CI 分钟、测试存储、队列容量、Flaky Test 治理和发布门禁。模型订阅费是其中一行。

AI 编码的真实速度，等于整条软件流水线的速度。

* * *

## 参考资料

1. [Anthropic：Agentic coding is straining CI](https://claude.com/blog/agentic-coding-is-straining-ci-heres-how-we-scaled-test-impact-analysis-at-anthropic)
2. [Anthropic Institute：Measuring AI-assisted software development](https://www.anthropic.com/institute/recursive-self-improvement)
3. [Anthropic：AI-native SDLC playbook](https://claude.com/blog/the-ai-native-sdlc-playbook)
