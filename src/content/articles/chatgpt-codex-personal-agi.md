---
title: "ChatGPT 和 Codex 最终只剩一个入口？OpenAI 负责人把终局说透了"
description: "Codex负责人Tibo首次系统谈到产品终局：ChatGPT与Codex将走向同一个Personal AGI，复杂的Skills、Memory和Sub-agent可能只是过渡形态。"
slug: "chatgpt-codex-personal-agi"
publishedAtCST: "2026-09-08T21:16:47+08:00"
language: zh
author: "JimLiu"
categories: [products]
cover: "/article-covers/chatgpt-codex-personal-agi.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-dT6K_PGzNI_DqoetPP9p_PTq_ILtl71-PPNJh9o_HyZ"
draft: false
---
ChatGPT 和 Codex 会不会最终合并？

OpenAI Codex 负责人 Tibo Sottiaux 最近给了一个少见的直接回答：**会。**

在 Matthew Berman 的一场 44 分钟访谈中，他把原因概括成一句话：未来的模型希望它们被合并。因为聊天、编程、研究、语音和工具调用，底层正在变成同一套模型、同一个 Agent Harness，以及同一种持续工作的方式。

但这里很容易产生误读。

这不是 OpenAI 宣布明天关闭 Codex，也不是简单地在 ChatGPT 里增加一个“写代码”按钮。Tibo 描述的是更长期的产品终局：**用户面对的可能不再是一排 AI 工具，而是一个了解你、可以调用不同能力、界面会随任务变化的 Personal AGI。**

换句话说，不是 Codex 被塞进 ChatGPT，而是 ChatGPT 会越来越像一个拥有 Codex 执行能力的 Agent 操作系统。

![OpenAI Codex 负责人 Tibo 在访谈中讨论 ChatGPT 与 Codex 的产品方向](/article-images/chatgpt-codex-personal-agi/tibo-interview.webp)

## 为什么两个产品迟早会碰到一起

今天，ChatGPT 和 Codex 的分工看起来仍然清晰。

ChatGPT 更像通用助手，负责对话、写作、搜索和建议；Codex 更像执行环境，可以读取项目、修改文件、运行命令、连接工具并交付结果。

可一旦 ChatGPT 也拥有长期记忆、语音、视觉、电脑操作和外部工具，这条边界就很难继续维持。用户说“帮我分析这份销售数据”，最终可能同时涉及查邮件、读取表格、写脚本、生成图表、制作汇报和发送结果。很难说这究竟是聊天任务，还是编程任务。

OpenAI 今年 6 月披露，Codex 已有超过 500 万周活跃用户，其中知识工作者约占 20%。他们使用 Codex 制作报告、表格、演示文稿和合同，也进行研究与数据分析。到这次访谈时，Tibo 又提到 Codex 已达到 2000 万活跃用户。

从这些用途看，Codex 已经越过“程序员工具”的边界。ChatGPT 与 Codex 合并，是为了抹掉通用助手与执行型 Agent 之间的产品缝隙。

## Skills、Memory 和 Sub-agent，可能都只是脚手架

Tibo 在访谈里提到，高级用户已经习惯了一套复杂的 Agent 工作流：维护 Skill 文件，处理偶尔失忆的 Memory，再组织多个 Sub-agent 协作。

这些机制很有用，但也把越来越多系统管理工作推给了用户。为了让 Agent 工作，人反而要先学会如何管理 Agent。

OpenAI 想要的下一步，是让系统自己理解用户的目标、日常工作与团队关系。用户只表达结果，Agent 负责选择模型、加载能力、拆分任务和维护上下文。

Prompt、Skill、Memory 和 Agent 编排不会立即消失，但很可能逐渐下沉到产品内部。未来用户购买的不是一套更复杂的积木，而是一套尽量不需要看见积木的工作系统。

这也提醒我们：**现在为某个 Agent 产品精心搭建的复杂工作流，未必会成为长期资产。** 更值得沉淀的是干净的数据、明确的权限、可验证的流程、稳定的工具接口和任务评测。

## 下一代 Agent，为什么越来越依赖云端

Tibo 认为，笔记本电脑已经开始成为 Agent 的限制。

电脑的窗口数量、交互方式和资源分配，本来是围绕人的工作速度设计的。人很难同时操作 100 个应用，但模型可以并行探索多个方案、运行测试、编译项目并验证假设。

当 Agent 从“一次完成一个任务”变成“同时维护几十条工作轨迹”，瓶颈就不再只是模型智力，还包括 CPU、内存、网络、沙箱和并发资源。云端 Agent 因此不只是远程运行的 Coding Agent，而是下一代 AI 产品获得规模化并行能力的基础设施。

这也解释了为什么 OpenAI 持续把 Codex 扩展到 Remote、Cloud Agent 和多 Agent 协作。Personal AGI 的“Personal”描述的是它服务谁，不代表所有计算都发生在个人电脑上。

## 速度不只是体验，它会改变工作方式

这场访谈中另一个重要判断，是 Ultra Fast 可能在 1 至 2 年后接近默认速度。

OpenAI 已经在有限预览中让 GPT-5.6 Sol 达到最高 14 倍于标准处理的速度，最高约 750 个输出 Token 每秒。不过，14 倍 Token 速度不等于所有任务快 14 倍。Tibo 解释，如果一条 Agent 轨迹包含大量工具调用，瓶颈会转移到网络、CPU 和外部系统，整体加速可能只有 3 到 4 倍。

比数字更值得看的是交互模式。

今天运行十几个 Agent，通常意味着不断切换窗口、等待结果和重新恢复上下文。Agent 如果快到能够跟上人的表达速度，工作流就会从“下达任务后回来验收”变成“边说、边看、边修改”。语音、实时原型和快速执行会被压进同一个连续过程。

AI 产品争夺的核心资源，也会从算力进一步转向人的注意力。最快的 Agent 不一定是每秒输出 Token 最多的 Agent，而是最少打断用户思路、最少要求用户重新解释背景的 Agent。

## Personal AGI 的另一面，是 Full Automation

Tibo 把 Agent 的方向分成两类。

第一类是 Personal AGI。它长期理解一个人，覆盖编程、研究、建议和日常工作，并在合适的时候主动行动。

第二类是 Full Automation。它持续读取生产日志，发现回归后提交修复；扫描器发现漏洞后自动打补丁；系统性能下降后主动定位并优化。人在流程中主要负责批准高风险操作。

两条路线看起来不同，底层却是同一个问题：Agent 是否拥有足够稳定的上下文、工具、权限和反馈，能够长期工作，而不只是完成一次漂亮的演示。

OpenAI 已经在企业 Agent 产品 Presence 中采用类似思路：企业限定知识范围、可执行动作、审批条件和升级规则，Agent 在边界内行动。这说明“主动工作”并不等于无限授权，越强的 Agent 反而越需要清晰的权限系统。

## 难题不在界面

一个长期理解用户的 Personal AGI，必须持续接触聊天记录、文件、日历、代码、团队关系和个人偏好。它越有用，掌握的信息就越完整。

因此，ChatGPT 与 Codex 合并最难的不是界面，而是四个问题：记忆归谁所有，权限如何最小化，错误由谁负责，以及云端长期运行的成本由谁承担。

如果这些问题没有解决，一个“什么都懂、什么都能做”的 Agent，也可能变成权限过大、行为难以预测的黑箱。产品终局不只是把能力集中到一个入口，还要让用户随时看见它知道什么、正在做什么、为什么行动，以及如何撤销。

## 最后

这次访谈最重要的信息，不是 ChatGPT 和 Codex 将出现一个合并按钮。

它透露的是 OpenAI 对产品形态的判断：**编程 Agent 不会永远是一个独立品类，它会成为通用 AI 的执行层；通用 AI 也不会永远停留在聊天框里，它会获得记忆、工具、环境和持续行动能力。**

今天我们还在选择 ChatGPT、Codex、Research、Voice 和不同 Agent。OpenAI 想做的终局，是让用户不再需要选择产品，只需要说清楚自己要完成什么。

如果这条路线成立，未来只剩下的那个入口，不会只是一个更强的聊天框。

它更像一个始终在线、随你变化、也能动手干活的个人工作系统。

## 参考资料

1. [Matthew Berman：与 OpenAI Codex 负责人 Tibo Sottiaux 的完整访谈](https://x.com/MatthewBerman/status/2091959711423996249)
2. [OpenAI：Codex is becoming a productivity tool for everyone](https://openai.com/index/codex-for-knowledge-work/)
3. [OpenAI：Previewing Ultrafast mode](https://openai.com/index/previewing-ultrafast/)
4. [OpenAI：Advancing the price-performance frontier with GPT-5.6](https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/)
5. [OpenAI：Introducing OpenAI Presence](https://openai.com/index/introducing-openai-presence/)
