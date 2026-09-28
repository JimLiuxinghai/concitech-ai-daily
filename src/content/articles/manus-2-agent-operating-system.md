---
title: "被遗忘的Manus回来了：2.0押注Agent操作系统"
description: "Manus经历爆红、Meta收购与交易拆分，独立运营状态迎来2.0。Cascade、Cloud Computer、Studio与Cue组成四层产品结构。模型退到供应层，运行环境、身份、权限与人机协作成为竞争焦点。"
slug: "manus-2-agent-operating-system"
publishedAtCST: "2026-09-29T08:20:00+08:00"
language: zh
author: JimLiu
categories: [products, business, devtools]
cover: "/article-covers/manus-2-agent-operating-system.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-dSxo0uI0tyKET96XwRpW37zlZu5l3CODNevdGFWHviM"
draft: false
---

Manus的名字挤满过技术媒体。

Manus的公开亮相日期是2025年3月。邀请制和演示视频带来第一轮热度。产品定位清楚：用户给出目标，Agent拆解任务、调用工具、交付结果。

热度的主角换了几轮。Claude Code、Codex、ChatGPT Agent和各类Computer Use产品占据讨论。Manus的新闻转向收购、监管和拆分，产品本身失去聚光灯。

这个被遗忘的名字发布了2.0。

![被遗忘的Manus与2.0产品结构](/article-images/manus-2-agent-operating-system/cover.webp)

Manus 2.0的重点是产品结构。Cascade负责Agent调度，Cloud Computer提供运行环境，Studio提供专业工作台，Cue提供个人Agent身份。四层组合接近一套Agent操作系统。

官方名称是通用AI Agent。“Agent操作系统”是本文对产品结构的概括。

## 一年的公司命运

Meta的收购公告日期是2025年12月29日。交易金额的媒体口径超过20亿美元。Meta的计划包含Manus业务延续与Agent技术整合。

中国监管部门交易撤销要求的发布时间是2026年4月。路透社的8月报道确认拆分安排和用户数据处理。Manus的独立运营公告日期是9月1日，创始团队恢复公司领导权。2.0发布日期是9月28日。

这条时间线解释“被遗忘感”。公司的身份变化盖过产品变化。2.0是独立运营状态恢复后的首个大型版本。

## 2.0的核心是运行层

大模型负责推理。Agent harness负责上下文、工具、状态、错误恢复和任务调度。Manus给这层系统命名为Cascade。

Cascade的初始项目形态保持轻量。视频、网页和自动化等专业能力的加载条件是任务需求。每个项目共享简报、页面、视频和自动化上下文。

Manus公布一项测试配置。Cascade的Token消耗降幅是23.2%，任务时间降幅是28.2%，运行成本降幅是32%。这些数字属于公司内部测试。公告的披露范围缺少任务集、样本量、模型组合和误差区间。

![Cascade测试数据，来源：Manus](/article-images/manus-2-agent-operating-system/cascade.webp)

这组数据的方向符合工程常识。全量工具与全量指令占用上下文。专业能力的任务制加载减少提示词负担和工具选择空间。具体降幅保留官方口径属性。

## Cloud Computer给Agent一块驻留地

聊天产品围绕会话运行。持续Agent围绕状态运行。

Cloud Computer是一台专属云端环境。多人游戏服务器、自动化流程和长期项目获得固定运行位置。云电脑的运行状态与用户设备状态分离。

Automations补上触发器。邮件、广告数据、日历、Slack和Notion事件形成任务入口。定时任务由时钟触发，2.0的自动化由业务事件触发。

这套Agent系统具备三项基础设施：上下文、计算环境和事件源。这个组合属于软件运行时形态。

## Studio交出可编辑结果

AI生成工具的常见缺陷是返工粒度。一个镜头或一段音乐发生变化，整份结果面临重做。

Manus Studio的视频编辑器交出时间线。片段、图片、文字、动效和音频保持独立。用户编辑结果，Manus接收修改版并承担下一轮处理。视频编辑器的目标内容包括30至60秒产品广告、AI UGC、数据动画、教程和vlog。

Game Dev组合视频、图像和代码模型。编辑面板包含运行预览、素材管理、代码和场景。项目出口包括网页发布与多人游戏。Cloud Computer承担多人游戏服务器。

Remote Control连接Computer Use与个人电脑。授权会话限定文件、浏览器和应用。用户手机显示桌面操作过程。

这些功能共享一个设计：Agent交付可编辑工程，用户拥有中间状态。产品价值从“一次生成”转向“项目协作”。

## Cue给Agent发身份证

Cue是独立应用。每个个人Agent拥有邮箱、电话号码、钱包和电脑。Agent发送消息、接听电话、提交通话摘要、执行预算内支付。群聊支持多个Agent的任务交接。

![Cue个人Agent，来源：Manus](/article-images/manus-2-agent-operating-system/cue.webp)

身份改变Agent边界。邮箱提供通信入口，手机号连接线下服务，钱包赋予交易能力，电脑提供执行环境。四项资源组成数字员工的基本账户体系。

能力扩张带来责任问题。公告的披露范围缺少身份验证、支付争议、误操作追责和审计记录细节。钱包与电话号码的地区覆盖范围缺少清单。

Cue处于邀请制早期体验。网页、桌面和移动端构成首批入口。iOS版本处于App Store审核环节。

## 四层产品结构

Manus 2.0包含四层。

模型层提供文本、图像、视频和代码能力。Cascade层分配上下文与工具。Cloud Computer层保存状态并执行任务。Studio与Cue层连接工作和生活场景。

![Manus 2.0四层产品结构](/article-images/manus-2-agent-operating-system/stack.webp)

这套结构解释Manus的路线选择。基础模型公司拥有模型优势。操作系统公司拥有入口、运行环境、权限和应用生态。Manus选择模型外层。

这条路线的风险来自复杂度。视频编辑、游戏开发、远程控制、云电脑和个人Agent跨越多类产品。每条产品线包含质量、成本、安全和支持负担。功能数量与商业结果属于两类指标。用户留存和付费意愿决定商业结果。

## 被遗忘之后

Manus 1.0卖的是“Agent替你完成任务”。Manus 2.0卖的是一套常驻执行环境。

两者差别落在四个问题：Agent在哪里运行，Agent用什么身份行动，用户怎样修改结果，系统怎样响应外部事件。

Manus第二次产品定义的难度高于第一次。第一次产品定义的引擎是演示惊喜。第二次产品定义依赖日常使用、权限信任和单位经济模型。

“被遗忘”给了Manus一次安静重构的窗口。2.0交出架构和产品。市场结果留给活跃度、留存率和收入数据。

---

## 参考资料

1. Manus, [Introducing Manus 2.0](https://manus.im/blog/introducing-manus-2-0)
2. Manus, [Manus Resumes Independent Operations](https://manus.im/blog/manus-resumes-independent-operations)
3. Reuters, [AI startup Manus to resume independent operations as deal with Meta unwinds](https://www.investing.com/news/stock-market-news/ai-startup-manus-to-resume-independent-operations-as-deal-with-meta-unwinds-4852256)
4. Meta, [Q4 2025 Follow Up Call Transcript](https://s21.q4cdn.com/399680738/files/doc_financials/2025/q4/META-Q4-2025-Follow-Up-Call-Transcript.pdf)
5. 宝玉, [Manus 2.0中文介绍](https://x.com/dotey/status/2104614931962232959)
