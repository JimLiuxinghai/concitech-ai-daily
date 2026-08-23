---
title: "ACP 想做 Agent 世界的 LSP，为什么接入越多，兼容问题反而越多？"
description: "ACP 正在成为编辑器接入 Coding Agent 的通用接口，但它并不是为 Agent Swarm 设计的编排协议。本文拆解它真正解决的问题、现阶段的优势，以及容易被忽略的能力边界。"
slug: "acp-agent-client-protocol"
publishedAtCST: "2026-08-24T06:03:13+08:00"
language: zh
author: JimLiu
categories: [devtools]
cover: "/article-covers/acp-agent-client-protocol.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-Vzh8lHEweQdNq5yEBcdhi089TqiXuZM-944zQuDVUvQ"
draft: false
---
最近看到一种对 ACP 的评价，很尖锐：

它本来是为了让 Agent 更容易集成，实际使用中，兼容问题最多的恰恰是那些通过 ACP 接进来的 Agent。拿它去驱动没有 GUI 的 Agent Swarm，还会发现中途插话、子 Agent 通信等能力都不够顺手。

这不是凭空挑刺。

但问题可能不全在 ACP。更准确地说，很多人正在把一个“编辑器与 Coding Agent 之间的接口”，当成“所有 Agent 之间的通用操作系统”。它原本没有打算包办后者。

## ACP 到底是什么

这里的 ACP，全称是 Agent Client Protocol，由 Zed 在 2025 年推出，最初与 Google 合作，把 Gemini CLI 接入 Zed。后来 JetBrains 加入共同建设，Codex、Claude Code、Cursor、OpenCode 等 Agent 也陆续通过原生实现或适配器进入这个生态。

ACP 想解决的问题很具体。

过去，一个编辑器想支持五个 Coding Agent，往往要维护五套接口；一个 Agent 想进入五个编辑器，也要分别适配。双方越多，组合数量增长得越快。

ACP 在两者中间放了一层公共协议：

```text
编辑器 / 桌面客户端 / TUI
            ↕ ACP
Codex / Claude Code / Gemini CLI / OpenCode
```

这很像 LSP 对编辑器和语言服务器所做的事。编辑器不必内置每一种语言的分析引擎，只要双方都实现 LSP，就能交换补全、跳转和诊断信息。ACP 试图把这个思路搬到 Coding Agent 上。

它和 MCP 解决的不是同一个问题：

```text
ACP：客户端怎样与 Agent 通信
MCP：Agent 怎样调用工具和数据
```

一个典型的本地 ACP Agent 会作为编辑器的子进程启动，通过 stdio 传输 JSON-RPC 消息。客户端先完成版本和能力协商，再创建或恢复会话，把用户提示交给 Agent。Agent 随后持续发送消息、思考、工具调用、终端输出、计划和文件变更，遇到敏感操作还可以向客户端申请权限。

换句话说，ACP 传递的不只是聊天文本。它试图把 Coding Agent 的工作过程，翻译成编辑器能够理解和渲染的结构化事件。

## ACP 最有价值的地方，不是“能聊天”

如果 ACP 只能把一段文本从 A 发到 B，它没有多少存在价值。终端、HTTP，甚至几行自定义代码都能做到。

它真正有用的地方，是把 Agent 的能力和客户端的交互界面拆开了。

例如 Codex 在后台执行命令时，可以把终端输出实时交给 Zed 或 JetBrains；Agent 修改多个文件时，编辑器可以使用自己的语法高亮和 Diff 界面展示；Agent 准备执行危险操作时，权限确认由客户端统一呈现。Agent 不需要为每个编辑器重复开发一套 UI。

这带来几个很实际的好处。

第一，Agent 的分发成本下降。接入一次 ACP，就有机会进入多个编辑器、桌面客户端和 TUI。官方 Registry 又补上了发现、安装和更新这一层。

第二，用户可以保留熟悉的工作环境。换 Agent 不一定要换编辑器，也不必接受每家厂商各自设计的终端界面。

第三，本地模式很简单。编辑器启动一个子进程，双方通过标准输入输出通信，代码不必先经过额外的中转服务器。对个人开发环境来说，这种部署方式容易理解，也容易控制数据边界。

第四，ACP 保留了扩展口。双方可以在初始化阶段协商能力，用 `_meta` 携带自定义数据，也可以增加下划线开头的私有方法。新 Agent 不必等协议收录每项新能力后才能开始实验。

从采用情况看，这条路已经跑起来了。ACP 官方列表里不只有 Zed 和 JetBrains，还出现了 Neovim、Emacs、VS Code 插件、Obsidian、桌面客户端、消息平台和多 Agent 工作台。它已经不再只是 Zed 的内部接口。

## 为什么接入越多，兼容问题反而会冒出来

协议统一了消息格式，不等于统一了 Agent 行为。

同样叫“工具调用”，不同 Agent 的生命周期可能完全不同；同样叫“恢复会话”，有的会完整重放历史，有的只恢复模型上下文；同样是取消任务，有的能立即终止，有的只能等当前命令结束。

这就是 ACP 最难处理的部分。

JSON Schema 可以规定一个字段是字符串还是数组，却无法保证两套 Agent 对这个字段的理解完全一致。实现数量越多，原本藏在单一产品内部的差异就越容易暴露出来。

更麻烦的是，成熟 Agent 往往比公共协议走得快。

Codex 有自己的推理事件、审查流程、Sandbox 配置和 Subagent；Claude Code 也有自己的权限、Hook 和任务模型。为了不丢掉这些能力，适配器只能把一部分信息塞进 `_meta`，或定义私有方法。这样虽然没有破坏 ACP 的基础格式，但客户端想完整支持它们，仍然要写厂商特定逻辑。

最后就会出现一个尴尬结果：基础功能确实“实现一次，到处可用”，高级功能却重新回到逐家适配。

这并非 ACP 独有。所有跨厂商标准都会遇到“最小公分母”问题。标准太薄，兼容性好但能力有限；标准太厚，又会追着每家产品不断增加概念，版本升级和实现成本随之上升。

## Steering 的争议，暴露了 ACP 的原始边界

这次讨论中，一个具体争议是 steering，也就是 Agent 正在工作时，用户或上级 Agent 能否追加一条指令，而不必先取消当前任务。

ACP v1 的 `session/prompt` 请求会一直保持到本轮工作结束。客户端想中途改变方向，标准做法主要是先发送 `session/cancel`，再发起新的 prompt。这对传统的一问一答界面还算自然，对长时间运行的 Agent 就很别扭。

例如主 Agent 发现子 Agent 正在查错方向，只想发一句“不要改代码，先验证数据库版本”。理想状态是把这条消息注入正在运行的任务。若只能取消再重开，已经完成的推理和工具状态可能被打断。

需要校正一个流传较广的说法：**ACP 2.0 目前并没有正式完成标准化 steering。**

2026 年 7 月发布的 ACP v2 仍处于 Draft。它改变了 prompt 的生命周期：Agent 接受消息后立即返回确认，后续运行状态和输出改由通知持续上报。这样一来，后台任务、消息排队、多客户端观察和中途输入更容易实现。

但官方文档也明确写着，steering 和 queueing 仍是独立问题。名为 `session/inject` 的中途输入提案截至本文写作时仍处于开放状态。部分适配器已经用 `_session/steering` 之类的私有扩展先做起来了，那不等于所有 ACP 客户端和 Agent 都能互通。

所以 v2 更像是修好了地基，还没有把 steering 这间房子交付。

## 为什么 ACP 不适合直接充当 Agent Swarm 的内部协议

ACP 的官方介绍写得很清楚：它假设用户主要待在编辑器里，并从编辑器调用 Agent。

这个前提决定了协议关注什么：会话、消息流、Diff、终端展示、权限询问和用户交互。

Agent Swarm 关心的是另一组问题：父子任务关系、并发调度、重试、超时、背压、结果聚合、共享记忆、故障恢复、资源配额，以及上级 Agent 如何接管或改写下级任务。

两者有交集，但不是一回事。

当然可以把每个子 Agent 包装成 ACP Agent，再由一个无界面客户端统一调用。社区里也已经有项目这么做。只是当编排越来越复杂，开发者会逐渐发现自己需要在 ACP 之外补一套任务系统。否则，很多信息只能被伪装成普通 prompt、tool call 或私有元数据。

这时继续坚持“所有内部通信都必须符合 ACP”，往往会增加工作量。你既要实现每种 Agent 的底层 transport，还要维护 ACP 适配层、能力降级和私有扩展，最终不一定比直接调用各家 SDK 更省事。

## ACP 最好的用法，是放在系统边缘

如果正在设计一个 Agent 产品，我更倾向于把 ACP 放在面向用户的北向接口，而不是强行塞进每个内部节点。

```text
Zed / JetBrains / 桌面客户端
              ↕ ACP
        Orchestrator Agent
              ↕
原生 SDK / RPC / 消息队列 / 工作流引擎
              ↕
       多个专用 Subagent
```

客户端通过 ACP 获得统一的会话、进度、权限和 Diff 体验。Orchestrator 内部则根据任务需要，选择更适合编排的通信方式。这样既能利用 ACP 的生态，又不用让一个 UI 协议承担它不擅长的调度职责。

如果只是固定的一对一组合，例如一个内部客户端只调用一个内部 Agent，自定义 transport 可能更直接。ACP 的收益来自互换性。没有互换需求时，标准化本身就是一笔成本。

准备正式接入 ACP 的团队，还应该做三件事：固定协议和 SDK 版本；为能力协商和降级路径写测试；记录真实消息轨迹，验证不同 Agent 对取消、权限和会话恢复的语义是否一致。只通过 Schema 校验远远不够。

## ACP 没有失败，只是边界正在被重新发现

ACP 已经解决了一个真实问题：让 Coding Agent 离开自带终端，进入用户熟悉的编辑器，同时保留工具调用、文件修改和权限控制等结构化体验。

它的优势很明确，局限也同样明确。

ACP 可以成为 Agent 世界的 LSP，但它暂时不是 Agent 世界的 Kubernetes。前者负责让客户端看懂 Agent，后者还要负责怎样组织、调度和恢复一群 Agent。

一套协议被用于越来越多的新场景，问题自然会暴露。真正需要警惕的不是 ACP 还有缺失特性，而是把“支持 ACP”误解为“所有 Agent 已经可以无损互换”，再把协议之外的复杂度全部忽略。

现阶段最稳妥的判断是：用 ACP 接入用户界面，用专门的编排系统管理 Agent。等 v2 稳定、steering、远程会话和多客户端等能力逐步落地之后，再决定它是否应该进入更深的一层。

## 参考资料

1. [Agent Client Protocol 官方介绍](https://agentclientprotocol.com/get-started/introduction)
2. [Zed：Bring Your Own Agent to Zed](https://zed.dev/blog/bring-your-own-agent-to-zed)
3. [ACP v2 Draft 公告](https://agentclientprotocol.com/announcements/acp-v2-draft)
4. [ACP v2 协议概览](https://agentclientprotocol.com/protocol/v2/overview)
5. [ACP `session/inject` 提案](https://github.com/agentclientprotocol/agent-client-protocol/pull/1261)
6. [ACP Registry](https://agentclientprotocol.com/get-started/registry)
7. [Codex ACP Adapter](https://github.com/agentclientprotocol/codex-acp)
