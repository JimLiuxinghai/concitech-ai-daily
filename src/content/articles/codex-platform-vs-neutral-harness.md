---
title: "OpenAI把Codex变成平台，Pi却在追问：Agent到底该属于谁？"
description: "同一天，两篇关于Agent Harness的文章给出了两条不同路线：一条把Codex做成可嵌入的软件底座，另一条希望用户真正拥有自己的Agent。"
slug: "codex-platform-vs-neutral-harness"
publishedAtCST: "2026-08-21T08:39:05+08:00"
language: zh
author: JimLiu
categories: [devtools, products]
cover: "/article-covers/codex-platform-vs-neutral-harness.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-c39fTmbgYlaPOoYxQ6CEVsis8ZvAIjzjZg_SjGfAbuu"
draft: false
---

8 月 20 日，两篇谈 Agent Harness 的文章先后发布。

Earendil 写了一篇《What is a Harness?》，从最基础的问题开始解释：Harness 到底是什么，为什么它可能比模型本身更值得用户掌握。

几小时后，OpenAI 发布《Codex as a platform》，宣布把 Codex 从一个编码工具，进一步推向可以嵌入其他软件的 Agent 平台。

两篇文章看上去一个在做科普，一个在发布开发者产品，实际上讨论的是同一个问题：当模型能力逐渐商品化，Agent 真正的控制层应该放在哪里？

双方给出的答案并不相同。

Earendil 希望 Harness 属于用户。OpenAI 希望 Codex Harness 成为开发者构建产品时可以直接调用的基础设施。

一个强调“我可以随时换掉背后的模型”，另一个强调“我不用从头再造一遍 Agent Loop”。

这两条路线，可能会决定下一代 AI 软件长什么样。

## 先说清楚：Harness到底是什么

过去一年，大家很容易把 Agent 的能力归到模型头上。

同一个任务做得好，说明模型聪明；做砸了，说明模型不行。但只要同时用过 Claude Code、Codex、Pi、OpenCode 或其他 Coding Agent，就会发现事情没这么简单。

相同模型放进不同 Agent，表现可以差很多。

Earendil 把 Harness 拆成四个部分：

1. **System Prompt**：告诉模型它是谁、应该怎样工作，以及哪些规则不能越过。
2. **Tools**：让模型能够读文件、写代码、搜索网页、运行命令或发送邮件。
3. **Agentic Loop**：模型调用工具、检查结果、继续行动，直到判断任务完成的循环。
4. **Translation Layer**：把不同模型的接口、消息格式和工具调用方式翻译成 Harness 能理解的统一结构。

OpenAI 的定义没有本质区别，只是更偏工程实现。

Codex Harness 负责维护会话状态、管理上下文、调用工具、流式返回进度、处理失败、执行沙箱策略、发起人工审批，并让任务可以跨多个回合继续运行。

模型负责推理，Harness 决定模型能看到什么、能做什么、做错了怎么恢复，以及什么时候必须停下来问人。

OpenAI 在文章里给了一个很能说明问题的数据。在 ARC-AGI-3 测试中，仅仅加入保留推理和上下文压缩等 Harness 机制，GPT-5.6 Sol 的得分就从 13.3% 提升到 38.3%，输出 Token 同时减少到原来的六分之一。

模型没有换，结果却接近三倍。

这也是两篇文章最重要的共识：Agent 的能力不只存在于权重里。上下文怎样保存、工具怎样暴露、循环怎样收敛，都会直接改变效果和成本。

## OpenAI的新动作：不再只卖一个Codex应用

大多数人接触 Codex，是通过桌面 App、CLI 或 IDE 插件。

OpenAI 这次想说的是：这些只是 Codex Harness 的几个官方界面。开发者现在可以把同一套 Agent 能力放进自己的产品，而不必要求用户离开原来的工作台，打开一个通用聊天框。

OpenAI 给出了三层入口：

| 接入方式 | 适合场景 | 开发者获得什么 |
|---|---|---|
| `codex exec` | 脚本、CI、一次性后台任务 | 运行一个边界明确的 Agent 任务并返回结构化结果 |
| Codex SDK | 应用代码、自动化流程 | 启动、继续、恢复和流式读取 Codex 线程 |
| Codex app-server | 深度产品集成 | 直接控制会话、事件、审批、工具和 Agent 生命周期 |

其中最值得关注的是 app-server。

它把 Codex 内部能力通过一套有文档的 JSON-RPC 协议暴露出来。应用可以创建 Thread、启动 Turn、接收工具执行和文件修改事件、暂停任务，也可以在高风险操作发生前弹出自己的审批界面。

这意味着你不必再做一个“套壳 Codex”。

安全团队可以把 Agent 放进告警调查台；客服团队可以把它放进客户记录和日志旁边；物流团队可以让它查看异常订单，比较补救方案，并在改签之前等待人工批准。

OpenAI 的示例 Relay 就是这样一个物流操作台。用户不需要从空白输入框开始描述问题，只要选中一票延误货物，点击“比较恢复方案”。应用负责提供订单、业务规则和可调用的 MCP 工具，Codex 负责调查、推理和执行循环。

OpenAI 对双方边界划得很清楚：

- 应用拥有界面、业务上下文、数据、工具和审批规则；
- Codex Harness 负责会话状态、Agent Loop、工具编排和沙箱执行。

这是一条典型的平台路线。OpenAI 不再要求所有工作都迁入 Codex，而是让 Codex 进入已有的软件。

## Earendil关心的是另一件事：你有没有退出权

Earendil 的文章没有讨论 SDK 的易用性，也没有展示一个企业控制台。

它更关心 Harness 最后属于谁。

模型通常由大公司训练，普通用户不可能真正拥有。但 Harness 可以运行在自己的电脑上，系统提示词可以修改，工具可以增减，会话记录可以保存在本地，背后的模型也可以替换。

这正是 Pi 的设计方向。

Pi 默认保持一个很薄的核心，用户再按自己的工作方式添加扩展。有人改变提示词，有人增加新工具，有人把它接进特定工作流。Earendil 在文章中称，Pi 用户已经共享了超过 5000 个扩展。

这里的模型翻译层不只是一个兼容功能，而是一种产品立场。

如果 Anthropic 涨价，可以换 OpenAI；如果云端模型不合适，可以尝试本地开放权重模型；如果同一个任务需要比较三个模型，历史记录也不必散落在三个厂商的应用里。

Earendil 想保留的是用户的退出权。

用户真正拥有的不是某个模型，而是积累下来的会话、工具、偏好和工作方式。模型只是其中可以替换的一层。

这和 OpenAI 的平台路线有一个细微但重要的区别。

OpenAI 文章里的主体是“应用开发者”。开发者拥有产品界面和业务规则，再把 Codex 嵌进去。Earendil 文章里的主体是“最终用户”。用户拥有 Harness，再决定接入哪个模型和哪些工具。

## 两种开放，不是同一回事

把这两条路线简单概括成“Pi 开放、Codex 封闭”并不准确。

Codex CLI、app-server 和 SDK 都有开源组件，主仓库采用 Apache 2.0 许可证。开发者可以检查模型与应用之间的代码，理解沙箱、审批和工具调用怎样工作，也可以改造自己的集成。

Codex 也不是完全不能切换模型。官方配置支持自定义 Model Provider，还内置 Ollama 和 LM Studio 作为本地模型入口。只是自定义 Provider 目前需要兼容 Responses API 协议，某些工具和模型特性也未必能在不同 Provider 上得到一致表现。

OpenAI 自己也明确写道：开源的是 Harness 和集成层，模型访问与托管服务仍是分开的。

所以，双方强调的是两种不同的开放：

| | Earendil / Pi | OpenAI / Codex Platform |
|---|---|---|
| 首要目标 | 让用户拥有并改造自己的 Agent | 让开发者快速把成熟 Agent 能力嵌入产品 |
| 核心控制权 | 用户控制模型、提示词、工具和本地会话 | 应用控制界面、业务数据、工具与审批 |
| 模型关系 | 把跨模型切换当成核心价值 | 支持 Provider 抽象，但官方体验以 Codex 模型为中心 |
| 扩展方式 | 用户安装和分享扩展 | `exec`、SDK、app-server 与 MCP |
| 主要场景 | 个人 Agent、终端、邮件和可定制工作流 | CI、内部系统、垂直业务软件和企业流程 |
| 最大优势 | 可迁移、可拥有、厂商依赖较低 | Loop 成熟，沙箱、状态和审批能力完整 |
| 主要风险 | 生态质量不一，配置和维护成本落到用户身上 | 产品可能逐步依赖 Codex 的协议与模型能力 |

Pi 给用户的是退出权。Codex 给开发者的是组合权。

前者允许你替换发动机，后者允许你把整套动力系统装进自己的车。

## 真正被争夺的，已经不是聊天框

早期 AI 产品的竞争集中在聊天界面：谁响应更快，谁能上传更多文件，谁的答案看起来更聪明。

Agent 普及以后，聊天框的重要性正在下降。

一个长期运行的 Agent 会积累项目历史、工具权限、审批习惯、个人偏好、失败经验和可复用技能。换掉模型也许只需要改一个配置，迁走这些东西却可能非常麻烦。

这也是 Harness 开始成为平台的原因。

OpenAI 希望开发者把 Codex Loop 当成现成基础设施。它的优势很现实：线程管理、上下文压缩、流式事件、沙箱和审批都已经完成，产品团队可以把精力放在业务本身。

Earendil 则提醒用户，便利也可能形成新的绑定。如果会话、记忆、工具和身份都沉淀在某个平台里，模型能不能切换就不再是唯一问题。

对个人开发者来说，Pi 这类中立 Harness 更像一套自己的工作台。你愿意花时间维护它，换来的是自由度和本地控制。

对企业产品团队来说，Codex app-server 更像一块已经验证过的 Agent 底盘。它未必最中立，但能少走很多工程弯路，而且审批、沙箱和事件流正是企业落地时最费时间的部分。

两者没有简单的胜负。

如果你要给现有运维系统加一个能调查、建议并执行的 Agent，Codex Platform 是更直接的选择。如果你想建立一套跟着自己走、可以不断换模型和改工具的个人 AI 环境，Pi 的路线更符合目标。

## 最有可能的未来，是两条路线汇合

这两篇文章放在一起看，真正有意思的并不是谁会取代谁。

OpenAI 正在把 Codex 从一个完整应用拆成 CLI、SDK、app-server 和 MCP 接口，让外部产品拿走界面与业务控制权。Pi 则从另一端出发，把 Harness 做薄，让用户拿走模型选择权和扩展权。

两边都在拆掉“一个模型配一个聊天 App”的旧结构。

更合理的下一步，可能是一种类似浏览器的关系：

- 业务应用定义当前工作流、数据和审批规则；
- 用户选择自己信任的 Harness、模型和记忆系统；
- 双方通过标准协议交换上下文、工具和执行结果；
- 高风险动作由应用和用户共同授权。

到了那一步，用户进入一个物流、财务或研发系统时，不必使用平台指定的唯一 Agent。应用也不必自己训练模型、重写 Agent Loop，只需要声明它能提供什么上下文、哪些动作可调用、什么操作必须确认。

这比“所有软件最后都变成聊天框”更接近真实世界。

人们不会因为有了 Agent 就放弃地图、时间线、表格和业务面板。这些界面仍然是理解工作最有效的方式。Agent 应该进入这些界面，而不是把它们全部抹掉。

OpenAI 已经在解决“怎样把 Agent 放进软件”。Earendil 追问的则是“放进去以后，Agent 到底归谁”。

这两个问题，最终必须一起回答。

## 参考资料

- [Earendil：What is a Harness?](https://earendil.com/posts/what-is-a-harness/)
- [OpenAI：Codex as a platform](https://developers.openai.com/blog/codex-as-a-platform)
- [OpenAI：Codex app-server](https://developers.openai.com/codex/app-server/)
- [OpenAI：Codex SDK](https://developers.openai.com/codex/codex-sdk/)
- [OpenAI：Codex Configuration Reference](https://developers.openai.com/codex/config-reference/)
- [OpenAI Codex GitHub 仓库](https://github.com/openai/codex)
