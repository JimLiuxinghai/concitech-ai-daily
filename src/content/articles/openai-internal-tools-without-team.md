---
title: "OpenAI 拒建专职工具团队：Codex 改写内部软件"
description: "Gergely Orosz 披露一段 OpenAI 内部争论。前 Meta 员工主张建设专职内部工具团队，管理层选择 Codex 路线。官方数据展示了内部应用、研究代码和技术支持的结构变化。"
slug: "openai-internal-tools-without-team"
publishedAtCST: "2026-09-08T21:16:47+08:00"
language: zh
author: "JimLiu"
categories: [devtools]
cover: "/article-covers/openai-internal-tools-without-team.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-ayjltjWiJCDfjjdr0Jx3NkDQW86onLyEckQ_IWPR29q"
draft: false
---
Gergely Orosz 讲了一个 OpenAI 内部故事。

一批前 Meta 员工加入 OpenAI。他们熟悉 Meta 的内部工具文化。他们主张建设一支专职团队。OpenAI 管理层拒绝了这项提议。

管理层给出的理由带有强烈的 AGI 色彩：AGI 优先的组织失去内部工具团队这个角色。

宝玉转发了这段故事。他给出的评价是“AI Native”。员工需要一件工具，员工生成一件工具。工具贴合个人任务，中央团队退出需求排期。

这段故事抓住了软件生产方式的变化。一个误解随故事出现：专职团队消失，平台工作消失。

事实指向另一幅图景。工具生产发生分散。治理能力保留集中建设模式。

![转述、官方事实与本文判断](/article-images/openai-internal-tools-without-team/evidence.webp)

*转述、官方事实与本文判断属于三种证据。*

## 一段转述，两组官方证据

管理层对话缺少 OpenAI 官方确认。Gergely 的帖子属于人物转述。宝玉的帖子属于中文解读。

OpenAI 的公开资料提供了两组旁证。

第一组旁证是员工使用数据。OpenAI 披露，Codex 的内部用户覆盖所有部门。法律、财务和招聘部门采用 Codex 作为主要 AI 工具。研究团队拥有最高增幅。2026 年 6 月的中位使用量是 2025 年 11 月的 56 倍。

第二组旁证是工具产出。OpenAI 披露，Codex 支持非技术团队的内部应用、仪表盘和管理材料。一个内部产品实验产生约 100 万行代码。Codex 写出了应用逻辑、测试、持续集成、文档、可观测性和内部工具。团队估算的开发时间是手写方案的十分之一。

转述描述组织选择。官方资料展示组织结果。两者证据等级不同。两者方向一致：工具开发权离开专职软件团队。

## Meta 模式的价值

Meta、Google 一类大型科技公司拥有复杂的内部平台。专职团队负责构建开发框架、数据平台、部署系统、权限服务和运营后台。

这种模式解决三个问题。

- 重复需求获得统一产品；
- 安全规范进入统一流程；
- 基础能力形成规模复用。

代价清晰。需求进入队列。通用产品覆盖最大公约数。边缘需求等待资源。小工具的沟通成本高于开发成本。

生成式编程改写了这笔账。一个分析师描述表格、权限和指标。Codex 产出页面、脚本和连接器。需求沟通变成软件产出。一次性工具获得经济性。

工具开发的固定成本下降。专职团队的排期优势收缩。

## Codex 模式的组织结构

“员工生成工具”与“员工承担全部系统责任”是两个命题。

OpenAI 的内部数据智能体提供了一个样本。该系统服务 3500 多名内部用户，覆盖 600PB 数据和 7 万个数据集。系统入口包含 Slack、网页、IDE、Codex CLI 和内部 ChatGPT。

智能体承担产品界面。底层条件包含权限、数据语义、运行时上下文、机构知识、记忆和审计。这些条件构成平台。

![工具生产权与平台责任](/article-images/openai-internal-tools-without-team/architecture.webp)

*Codex 分散工具生产权。平台层承载共同责任。*

OpenAI 的安全文章列出四项组织能力：托管配置、受限执行、网络策略、智能体日志。安全团队掌握边界和遥测。员工掌握具体工具。

新的分工出现：

- 业务团队定义意图和验收标准；
- Codex 生成应用和自动化流程；
- 平台团队维护身份、数据、运行环境和共享组件；
- 安全团队维护权限、审计和风险门槛。

传统内部工具团队交付成品。新平台团队交付生成条件。

## 工具爆发产生新债务

软件产量上升带来四类债务。

第一类是发现债务。两个团队生成两套相同工具。组织缺少目录，复用机会消失。

第二类是数据债务。同名指标拥有两种口径。语义冲突需要数据治理。

第三类是安全债务。临时脚本读取敏感数据。统一底座提供最小权限、密钥管理和日志保存。

第四类是维护债务。工具作者离开项目，代码维持运行。元数据记录责任人、停用日期和故障渠道。

“无专职工具团队”改变这些问题的承载位置。问题保留原有生命力。

## 内部工具团队的下一种形态

内部工具团队面临岗位转移。人数归零属于过度推论。

产品经理减少需求排期，增加能力目录设计。工程师减少页面开发，增加执行环境、数据契约和评测体系建设。安全人员减少逐项审批，增加策略即代码和异常检测。设计师减少组件拼装，增加设计约束和生成规范。

衡量指标发生变化。交付功能数失去代表性。有效工具数、重复率、平均存活期、事故率和复用率接近组织价值。

一个工具拥有三种结局：个人使用、共享目录、完成退役。平台提供三种出口。组织获得创新速度和维护秩序。

## 我的判断

“工具团队”与“工具缺失”构成一个错误的二选一。

组织选择存在于两种软件工厂之间。

第一种工厂拥有需求中心和应用中心。第二种工厂拥有分散应用生成与中央底座。

Codex 降低了应用层成本。身份、数据、安全、审计和可靠性的成本保留原位。代码成本下降，治理价值上升。

Gergely 讲述的故事包含一个激进命题：AGI 消灭内部工具团队。

OpenAI 的公开实践给出一个温和版本：Codex 消灭大量内部工具排期。平台工程获得新的核心任务。

## 参考资料

1. [Gergely Orosz 的 X 帖子](https://x.com/GergelyOrosz/status/2097055218173423886)
2. [宝玉的 X 帖子](https://x.com/dotey/status/2097068079771500664)
3. [OpenAI：Research acceleration](https://openai.com/index/research-acceleration-view-inside-openai/)
4. [OpenAI：Codex for every role, tool, and workflow](https://openai.com/index/codex-for-every-role-tool-workflow/)
5. [OpenAI：Harness engineering](https://openai.com/index/harness-engineering/)
6. [OpenAI：Inside our in-house data agent](https://openai.com/index/inside-our-in-house-data-agent/)
7. [OpenAI：Running Codex safely at OpenAI](https://openai.com/index/running-codex-safely/)
