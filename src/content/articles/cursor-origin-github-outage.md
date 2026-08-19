---
title: "GitHub 大面积故障当天，Cursor 上线了“自己的 GitHub”"
description: "GitHub 大面积故障与 Cursor Origin 上线发生在同一天。事故暴露了开发基础设施的单点依赖，也说明 Origin 为什么值得关注。"
slug: "cursor-origin-github-outage"
publishedAtCST: "2026-08-18T10:53:45+08:00"
language: zh
author: JimLiu
categories: [devtools, products, business]
cover: "/article-covers/cursor-origin-github-outage.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-Qshbg6_jrVaLDj9fQaCaDHTWCrq7hrrEoytSLcH28vj"
draft: false
---
Cursor 终于把手伸到了 GitHub 的地盘。

8 月 17 日，Cursor 宣布代码托管平台 Origin 开始上线。现在，用户可以直接在 Cursor 创建仓库，也可以把 GitHub 仓库同步进来，在网页里浏览代码、搜索、开 Pull Request、审查和合并。[Cursor 官方更新](https://cursor.com/en-US/changelog)

偏偏就在同一天，GitHub 发生了一次大面积故障。Pull Request、Issues、Git 操作、Actions 和 API 等多项服务同时受影响。Cursor 宣布 Origin 时，GitHub 的事故状态尚未解除。

这只是时间上的巧合，却让 Origin 的意义突然变得具体：当越来越多开发工具、CI 和 AI Agent 都围绕 GitHub 运转，代码托管平台一旦出问题，停下来的远不只一个网页。

最简单的理解是：Cursor 做了一个自己的 GitHub。

这个说法不算错，但容易让人高估 Origin 当前的完成度，也低估 Cursor 真正想做的事。

翻完官方文档后，我的判断是：Origin 暂时还替代不了 GitHub。Cursor 现在抢的也不是代码存储这门生意，而是 AI Agent 从接到任务到代码合并的整条控制链。

## 先说清楚，Origin 现在能做什么

Origin 目前仍是 early beta，正在向 Pro、Teams 和 Enterprise 付费用户分批开放，免费计划不能使用。

如果创建一个 Origin 原生仓库，它已经具备代码托管平台最基本的能力：

1. 使用标准 Git clone、push 和 pull。
2. 在网页中浏览与搜索代码。
3. 创建、评论、审查和合并 Pull Request。
4. 让 Cursor Cloud Agent 直接创建仓库、修改代码和提交 PR。
5. 接入 Vercel、Depot 和 Buildkite，处理预览部署与 CI。

这些功能已经可以组成一个最小可用的 Git forge。Cursor 对 Origin 的官方定义也是“为 Agent 时代设计的 Git forge”。[Origin 官方文档](https://cursor.com/docs/origin)

不过，Cursor 自己在更新日志里写得很谨慎：这一版先提供仓库、PR、代码浏览和 GitHub 同步，更多“Agent-native”功能随后才会推出。

换句话说，Origin 的基础设施已经上线，它最有野心的部分还没完全交付。

## 从 GitHub 同步，不等于迁移到 Origin

Origin 这次最聪明的设计，是没有逼用户立即搬家。

连接 GitHub 后，用户可以选择一个仓库建立镜像。代码历史、分支、标签和 PR 会进入 Origin，PR 评论还能在两边双向同步。你可以在 Cursor 里审查和合并，GitHub 页面几秒后也会出现对应变化。

但这类仓库仍以 GitHub 为事实源。向 Origin 镜像执行 push，改动最终仍会进入 GitHub。GitHub Issues、Actions 工作流和 secrets 也不会被同步。[GitHub 镜像说明](https://cursor.com/docs/origin/mirror-github)

这说明 Cursor 当前更想成为 GitHub 上方的一层，而非立刻把 GitHub 从团队里拔掉。

用户不需要迁移权限、CI、Issue 和历史协作关系，只要复制一份代码与 PR 数据，就能先尝试 Cursor 的浏览、搜索、Agent 和审查体验。觉得合适，再把镜像解除绑定，Origin 才会成为新的事实源。

这是典型的低风险切入方式。对用户来说，它降低了试用成本；对 Cursor 来说，它获得了一个逐步接管工作流的入口。

## Origin 上线当天，GitHub 恰好出了大故障

根据 GitHub 官方状态记录，这次事故开始于 8 月 17 日 13:40 UTC，到 21:15 UTC 才被标记为完全解决，事故状态为 critical。

高峰期，GitHub 网页和 API 流量的错误率约为 20%，归档文件和 raw 仓库内容下载的错误率约为 50%。受影响范围包括 Git Operations、Webhooks、API Requests、Issues、Pull Requests、Actions、Pages 和 Copilot；SAML、OIDC、SCIM 与 Team Sync 等企业认证和同步能力也出现问题。[GitHub 官方事故记录](https://www.githubstatus.com/incidents/zkxwbgr0cnmx)

GitHub 表示已经定位到问题组件并采取了修正措施，但截至本文更新时，详细根因分析尚未发布。现阶段不能把事故归因于 AI Agent 流量，也没有证据表明它与 Origin 发布存在任何关系。

真正值得讨论的是故障的放大方式。

GitHub 已经不只是代码远程仓库。PR 审查、Issue、CI、软件包、身份认证、部署触发器和 Agent 任务都在依赖它。过去 GitHub 宕机，开发者可能暂时无法 push；现在，一个 API 故障会让后台 Agent 无法读取任务、创建分支、更新 PR 或汇报结果，还可能触发大量无效重试。

这给 Origin 增加了一个发布会上不太醒目的价值：多一个托管平台，也多一个故障域。对于直接创建在 Origin 上的原生仓库，代码的事实源不再是 GitHub，团队至少不会因为 GitHub 单点故障而失去全部读写能力。

但当前的 GitHub 镜像不能当成完整灾备。

官方文档明确写着，镜像仓库的 push 仍会转发到 GitHub，GitHub 继续充当事实源；Issues、Actions 配置和 secrets 也不会复制到 Origin。GitHub 故障时，Origin 中已经同步的代码或许仍能浏览和拉取，写入、PR 双向同步与后续 CI 却可能被卡住。

所以，这次事故确实让 Origin 的需求更容易被理解，也把要求抬高了。它需要证明的不只是托管速度，还包括可用性、数据可导出性、多远程仓库支持，以及外部平台故障时能否安全降级。

## 那些惊人的性能数字，要谨慎看

在 Cursor Compile 大会的 Origin 演示中，现场展示过单仓库每秒 22.6 次提交。外界报道还流传着每小时约 29.6 万次 clone、全球同步延迟低于 400 毫秒等数据。

数字确实夸张。每秒 22.6 次提交相当于一天接收约 195 万次提交，已经完全脱离人类开发团队的工作节奏，只有大批 Agent 并行运行才可能产生这种流量。

但这些数字目前只能叫演示数据。

Cursor 的 Origin 页面、更新日志和技术文档都没有公布完整测试方法。我们不知道仓库大小、单次提交内容、持续时间、服务器配置，也不知道是否同时运行了权限检查、hooks 和 CI。没有这些条件，就无法把现场数字当作可复现的生产性能基准。

它更像一句设计宣言：Cursor 假设未来仓库的主要写入者会从人变成机器，所以先按照机器速度建设管道。

至于这根管道能否让团队更快交付，仅凭 commit 吞吐量还回答不了。

## Agent 压垮的是 Git 周围的流程

Git 本身并不在意提交来自人还是 Agent。压力集中在审查、冲突处理和 CI。

过去，一名开发者写完代码，创建 PR，等待一两名同事审查，再排队合并。团队每天处理的变更数量有限，冲突也能靠作者记忆解决。

现在，一个人可以同时启动十几个 Agent。它们各自建立分支、修改相同文件、运行测试并提交 PR。代码生成速度提高后，新的队列会堆在审查、冲突处理和 CI 上。

每秒多接收几个 commit，只解决了最不紧张的一环。更难的问题是：

谁来判断十几个 Agent 的改动是否重复？谁来发现它们对同一模块做出了互相矛盾的设计？某个基础分支变化后，哪些任务需要重跑？CI 失败时，是修代码、改测试，还是判定需求本身有问题？

这些才是 Origin 必须交出的答案。

从这个角度看，Agent-native 代码平台的核心也许是一张实时变化的任务图：知道每个 Agent 在做什么、依赖什么、影响什么，并在合并前自动协调。

## Graphite 为什么是关键拼图

2025 年 12 月，Cursor 宣布收购代码审查公司 Graphite。双方当时给出的理由很直接：写代码变快后，审查和安全合并已经成为新瓶颈。[Cursor 收购 Graphite](https://cursor.com/blog/graphite)

Graphite 长期主打 stacked PR 和 merge queue。所谓 stacked PR，是把一项大改动拆成多个有依赖关系的小 PR，让它们可以分别审查，又能保持前后顺序。这套方法原本服务于高效率的人类团队，现在很适合管理 Agent 并行产生的大量小变更。

Graphite 当时还预告了几件事：打通 Cursor 的本地开发、后台 Agent 和 PR；合并 Graphite AI Reviewer 与 Cursor Bugbot；让 PR 更接近自动驾驶。

几个月后 Origin 出现，产品路线正好接上了这次收购。Graphite 的团队和经验补齐了 Cursor 的代码审查能力。

不过，官方没有说明 Origin 的底层托管技术直接来自 Graphite。把它写成“Graphite 改名后做出的 GitHub”并不准确。更稳妥的理解是，Graphite 帮 Cursor 补上了从代码生成到审查、合并之间缺失的一段。

## GitHub 并没有站着不动

把 Origin 描述成“AI 原生”，再把 GitHub 描述成十年前的旧架构，听起来很痛快，但不符合现状。

GitHub 已经在 Agent HQ 中支持同时调度 Copilot、Claude 和 Codex，Copilot Code Review 也能读取 AGENTS.md、调用 skills 与 MCP，并把修改继续交给云端 Agent。GitHub 走的是开放代理平台路线：让不同 Agent 留在现有 Issue、PR、Actions、安全规则和企业权限体系里。[GitHub Agent HQ](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/)

Cursor 的优势是纵向整合。编辑器、模型、Cloud Agent、代码审查和托管都由同一家公司控制，理论上能共享更完整的任务上下文，减少工具之间反复同步。

GitHub 的优势则是已经存在。它拥有开发者身份、开源网络、Actions 生态、Issue、Packages、安全扫描、企业审计和大量第三方集成。团队不会因为 Cursor 多了一个仓库页面，就放弃这套基础设施。

因此，短期竞争焦点是谁能成为 Agent 工作的主界面。代码可以继续存放在 GitHub，开发者每天真正打开的页面却可能逐渐变成 Cursor。

## 现阶段最合适的用法

如果已经在使用 Cursor 付费计划，现在没必要把核心仓库直接迁走。

更稳妥的方式，是先选择一个非关键项目建立 GitHub 镜像，保留 GitHub 作为事实源，让 Origin 接管代码浏览、Agent 任务和 PR 审查。这样既能测试体验，也保留随时退出的能力。

对于由 Agent 大量生成的实验项目、内部工具或短生命周期仓库，可以直接创建 Origin 原生仓库。它们更适合验证 Cursor 所设想的完整闭环，也不必先背上迁移成本。

接下来真正值得观察的，不是 Origin 能承受多少 commit，而是 Agent-native 功能上线后能否处理并行任务协调与可信审查，并在 GitHub 或其他外部服务故障时保持可用。

如果这三件事做不好，Origin 只是另一个托管代码的网页。

如果做成了，代码仓库会从人类提交作品的档案柜，变成一群 Agent 持续工作的运行时。

Cursor 想抢的，就是这个位置。

---

**资料来源**

1. [宝玉关于 Cursor Origin 的帖子](https://x.com/dotey/status/2089412415108600221)
2. [Cursor：Origin Code Hosting 更新日志](https://cursor.com/en-US/changelog)
3. [Cursor：Origin 官方文档](https://cursor.com/docs/origin)
4. [Cursor：GitHub 仓库镜像说明](https://cursor.com/docs/origin/mirror-github)
5. [GitHub：8 月 17 日 GitHub.com 事故记录](https://www.githubstatus.com/incidents/zkxwbgr0cnmx)
