---
title: "Anthropic推出claude.dev：Claude工程团队的公开笔记库"
description: "Anthropic推出开发者站点claude.dev。工程复盘、模型成本、评测设计、Skills和Claude Code Mods构成内容主体。文档负责产品规则，新站点展示工程判断与实践经验。"
slug: "anthropic-claude-dev-engineering-notes"
publishedAtCST: "2026-10-02T07:34:00+08:00"
language: zh
author: JimLiu
categories: [devtools, products]
cover: "/article-covers/anthropic-claude-dev-engineering-notes.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-QXpYpc-Fi_hTR1HzqB4i1aawH9uWHo1AShQqiollIlH"
draft: false
---

Anthropic推出开发者站点[claude.dev](https://claude.dev/)。首页的自我介绍很短：来自Anthropic开发者的技巧、经验和观点。

claude.dev与Claude API文档分属两个入口。[产品文档](https://code.claude.com/docs)承担规则查询。claude.dev收录工程复盘、模型使用指南、实战手册和团队经验。读者能看到Claude团队的任务选择、成本计算和故障排查过程。

它像一份公开的工程笔记。产品功能清单属于文档。

![claude.dev与产品文档的分工](/article-images/anthropic-claude-dev-engineering-notes/cover.webp)

## 文档给规则，文章给判断

产品文档回答“接口是什么”“参数怎么填”“功能支持什么”。claude.dev回答另一组问题：任务成本由哪些因素组成？评测集如何设计？模型的推理强度该怎么选？网页性能问题如何定位？

首页分类包含Agents、Engineering、Playbooks、Skills和Tutorials。原推文提到四类；站点现有分类多出Tutorials。首页推荐文章发生变化：[Claude Code Mods入门教程](https://claude.dev/blog/getting-started-with-claude-code-mods/)的日期是10月1日。新文章改变首页清单。

顶部导航保留[D] Docs入口，目标是Claude Code文档。另一个入口是[T] Terminal。[终端模式](https://claude.dev/terminal/)提供文章列表和`/help`命令。H、M、D、T分别对应首页、Mods、文档和终端。站点外观带有开发者玩笑，内容重心落在工程实践。

![claude.dev的内容地图](/article-images/anthropic-claude-dev-engineering-notes/content-map.webp)

## 五篇文章，五个工程问题

新站点的价值可以从具体文章判断。下面五篇覆盖提示上下文、成本、评测、性能和扩展能力。

**1. [Claude 5代模型的上下文工程新规则](https://claude.dev/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models/)**

Anthropic工程师Thariq Shihipar披露一项调整：Claude Code面向新模型的系统提示词削减超过80%。团队报告的编码评测成绩维持原有水平。文章讨论上下文负担。旧规则、Skills、项目说明和工具描述存在冲突风险。模型能力变化要求团队审视上下文负担。

**2. [一个Opus 5.5任务花多少钱](https://claude.dev/blog/what-a-task-costs-on-opus-5-5/)**

Addy Osmani拆开Agent任务账单：回合数、缓存读取、输出Token和模型价格。一次任务的总成本包含多次请求的费用。失败重试会产生新回合。文章给出的示例数字属于API标价与假设任务；个人账单取决于实际用量。

**3. [Claude的评测设计与爬山优化](https://claude.dev/blog/automating-eval-design-and-hillclimbing/)**

Lance Martin介绍`/claude-api build-eval`与`/claude-api hillclimb`。任务样本来自生产记录、故障单、人工案例和代码库。优化流程区分训练集与保留测试集。训练集分数上升、测试集分数停滞，构成过拟合信号。文章的重点是评测可信度。

**4. [Claude网页两周提速的工程复盘](https://claude.dev/blog/how-we-made-claude-ai-faster/)**

Anthropic团队披露一轮性能冲刺。文章给出P75页面可输入时间：3.1秒降至0.55秒。团队列出测量、瓶颈定位、代码变更和回归监控。数字属于Anthropic披露的内部指标；文章缺少外部复现所需的完整环境。指标定义和验证链路具有参考价值。

**5. [Claude Code Mods入门](https://claude.dev/blog/getting-started-with-claude-code-mods/)**

10月1日的新教程介绍Mods。一个Mod是Claude Code插件里的JavaScript或TypeScript模块。它接收事件，改变行为，绘制终端界面。示例包含上下文用量提示、危险命令拦截和代码修改回放。教程注明Claude Code 2.1.287及之后的版本要求。文中附有API版本变化提醒。

五篇文章回答同一个问题：模型能力之外，工程团队靠什么交付稳定结果？答案来自上下文、成本、评测、性能和工具接口。

![五篇文章对应的五个工程问题](/article-images/anthropic-claude-dev-engineering-notes/five-questions.webp)

## 这座站点的作用

我的判断：claude.dev承担开发者教育和技术信任建设。产品文档给出规范，工程文章展示取舍。读者看到成功案例、性能瓶颈、成本变量、评测噪声和版本限制。

这类内容具有商业意义。开发者面对多个模型和工具，选型依据需要超出排行榜。工程复盘展示产品团队的实践能力，并给使用者提供项目模板。

边界清楚：这是Anthropic自己的出版物。性能数字、成本示例和模型效果需要独立验证。具体API行为、权限和版本要求以产品文档为准。

claude.dev的读者包括两类人：Claude Code与API的现有用户；负责Agent工程流程的团队。前者能找到功能用法，后者能读到经验背后的测量方法。

终端彩蛋是入口。工程材料是价值核心。模型公司的内部工程问题变成了开发者可阅读、可讨论、可质疑的材料。

## 参考资料

- [claude.dev首页](https://claude.dev/)
- [Claude Code产品文档](https://code.claude.com/docs)
- [Claude Code Mods教程](https://claude.dev/blog/getting-started-with-claude-code-mods/)
- [上下文工程文章](https://claude.dev/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models/)
- [任务成本文章](https://claude.dev/blog/what-a-task-costs-on-opus-5-5/)
- [评测设计文章](https://claude.dev/blog/automating-eval-design-and-hillclimbing/)
- [性能复盘文章](https://claude.dev/blog/how-we-made-claude-ai-faster/)
- [原推文](https://x.com/dotey/status/2105431620769427549)
