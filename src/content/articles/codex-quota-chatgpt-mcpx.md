---
title: "Codex额度用完怎么办？有人找到了一个新入口"
description: "社区监测显示部分Codex账户的周额度大幅下降。与此同时，一条通过Remote MCP连接本地开发环境的新路径，暴露了ChatGPT订阅里容易被忽略的第二个入口。"
slug: "codex-quota-chatgpt-mcpx"
publishedAtCST: "2026-08-21T03:07:46+08:00"
language: zh
author: JimLiu
categories: [devtools, products]
cover: "/article-covers/codex-quota-chatgpt-mcpx.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-cqCXj-wt3HxWjS2oBmZI_M4tkbiYImmSRLtWPZV_Z0c"
draft: false
---

最近几天，不少 Codex 用户都在问同一个问题：为什么这周的额度突然变得特别不耐用？

有人过去能连续工作几天，现在几个小时就见底。也有人没有换模型、没有提高 reasoning effort，任务习惯基本没变，周额度消耗速度却明显加快。

这一次，社区拿出了比“体感”更具体的数据。

一名 Pro 5x 用户用本地工具读取 Codex 的 Token 记录和周额度百分比，再按公开 API 价格折算，得到的七天 API 等值从 674.05 美元降到 156.95 美元，降幅为 76.72%。同一人的 Plus 账户则从 159.76 美元降到 130.77 美元，下降 19.15%。

另一个 Plus 账户记录到的变化是从约 160 美元降到 80 美元，接近腰斩。

数字很夸张。但“Codex 已经面向所有人统一砍掉 76%”这个结论，目前还不能成立。

## 76%是怎么测出来的

这些数据主要来自一个名为 NerfTrack 的开源工具。

它不会读取提示词，也不是从 Codex 界面上的进度条凭感觉猜额度。它读取本机保存的 Codex JSONL 记录，将输入 Token、缓存输入 Token 和输出 Token 按公开 API 费率折算，再把一段时间内的 Token 成本变化与周额度百分比变化配对。

核心计算很简单：

```text
估算周额度API等值
= 本段Token的API等值成本 ÷ 本段消耗的周额度百分比
```

比如一段任务按 API 价格折算消耗了 2 美元，同时周额度下降 2%，那么整周额度的估算值就是 100 美元。NerfTrack 会使用近期多个有效观测值的中位数，过滤短时波动。

这种方法比“我今天怎么用得特别快”可靠，但仍有三个限制。

第一，它测到的是某个账户在特定时间窗口里的额度变化，不是全体用户的随机抽样。

第二，API 等值不等于 OpenAI 的真实推理成本，更不是用户收到的账单。它只是用统一价格把不同模型、缓存和输出换算到同一把尺子上。

第三，Codex 的计量还会受到模型、上下文长度、推理强度、Fast 模式、工具调用和内部任务影响。NerfTrack 最近还专门补了 Auto Review 的计价映射，说明估算工具本身也在快速修正。

所以更准确的说法是：多个社区样本显示，部分账户的有效周额度近期出现了明显下降，其中一个 Pro 5x 样本下降 76.72%。截至 8 月 21 日，OpenAI 尚未公开确认一次面向所有账户的统一下调。

这组变化之所以敏感，还因为两个月前的基线非常高。SemiAnalysis 在 6 月购买了 OpenAI 和 Anthropic 的各档订阅，用长时间编码任务跑到周限额，再按 API 价格折算。当时得到的月度最高 API 等值约为：

| 套餐 | 月费 | 当时测得的月度最高API等值 |
|---|---:|---:|
| ChatGPT Plus | 20美元 | 约700美元 |
| ChatGPT Pro 5x | 100美元 | 约3500美元 |
| ChatGPT Pro 20x | 200美元 | 约14000美元 |

这些数字描述的是 6 月测试条件下，重度用户把套餐跑满后对应的 API 零售价，不是 OpenAI 为用户实际承担了同等成本，也不代表今天仍能拿到同样额度。它能说明的是，订阅制曾经给高强度 Agent 用户提供了很大的价格缓冲，而最近的社区样本显示，这个缓冲对部分账户可能正在快速缩小。

这也不排除系统异常。OpenAI 在 6 月就处理过一次“Codex 额度消耗快于预期”的事故，当时官方确认，部分账户被反滥用和欺诈防护系统错误限流，但表示影响范围有限。

## 订阅额度从来不是一个总钱包

这场争议里，比 76% 更值得注意的是 ChatGPT 的计量结构。

OpenAI 当前的官方说明写得很清楚：Codex、ChatGPT Work、ChatGPT for Excel 和 Workspace Agents 会共享一套 agentic usage，也就是智能体额度池。普通 ChatGPT 对话不计入这套 Codex 智能体额度。

换句话说，一个 ChatGPT 订阅并不是只有一只水桶。

你可能已经耗尽 Codex 的周额度，但普通聊天仍然可用。过去这块剩余额度很难承担本地开发任务，因为网页聊天碰不到你的文件系统，也不能直接运行测试。

现在 Remote MCP 改变了这件事。

理论链路如下：

```text
普通 ChatGPT 对话
        ↓
自定义 MCP App
        ↓ HTTPS / OAuth
远程 MCP 入口
        ↓
本地 MCP Runtime
        ↓
指定 Workspace、文件、命令和测试
```

ChatGPT 本身仍然运行在网页端。实际读文件、修改代码和执行命令的是本地 MCP Runtime。ChatGPT 只通过经过授权的工具接口发出请求，再读取执行结果。

OpenAI 的官方文档还说明，ChatGPT 中的 Apps 没有单独的特殊限额，它们遵循对应套餐的普通 ChatGPT 限额。这意味着，在支持完整 MCP 的账户上，普通聊天可以成为 Codex 之外的另一个工作入口。

注意，这不是“无限 Codex”，也不是把 Codex 的额度重置了。它只是把工作换到另一个产品入口和计量路径。

## MCPX做了什么

MCPX 是这条链路里比较完整的一种本地 Runtime 实现。

它可以登记多个 Workspace，让远程客户端读取源码、生成并检查 Unified Diff、修改文件、运行命令和测试，并把会话状态保存在本地 SQLite 中。不同客户端可以通过 Remote Session 接回同一个任务，不必每次从头读取整个项目。

它还提供了一些适合开发场景的约束：

- 文件读取会返回 SHA-256 revision，修改时可以检查文件是否已变化；
- 文件操作限制在显式登记的 Workspace 内；
- 命令可以配置为允许、确认或拒绝；
- 修改、命令、审批和任务结果可以写入审计日志；
- 高风险删除采用准备、确认、提交的分段流程。

这比简单地把一个 Shell 端口暴露给模型强得多。但它仍然不是成熟的企业安全产品。

MCPX 仓库在 7 月 30 日才创建，当前版本为 0.9.7，官方也把它定位为学习、研究和授权开发环境自动化项目。更需要警惕的是，它当前生成的默认配置里，未知命令的兜底策略是 `allow`。如果要远程连接，应该先改成 `confirm` 或 `deny`，而不是装完就把端口暴露到公网。

## 不是所有ChatGPT账户都能这样做

这里有一个很容易被忽略的门槛。

截至 8 月 21 日，OpenAI 官方说明是：完整 MCP，包括修改和写入操作，仍在向 ChatGPT Business、Enterprise 和 Edu 推出测试版。Pro 用户可以在开发者模式连接自定义 MCP，但官方目前只保证 read 和 fetch，不保证 edit 和 execute。

因此，个人 Plus 或 Pro 用户即使在设置中看到了 custom MCP，也不能直接推导出“我可以让普通聊天接管本机写代码”。账户、套餐和灰度批次都可能不同，应该以自己设置页里实际出现的权限和工具扫描结果为准。

对个人用户，目前最稳妥的用法反而是只读分流：

- 让普通 ChatGPT 读取指定项目，做架构梳理、故障定位和代码审查；
- 把长文档、历史记录和研究任务放到普通聊天处理；
- 让它生成明确的修改方案和测试清单；
- 最后的改文件、跑测试和提交仍交给 Codex 或本地工具。

这样已经能减少 Codex 为理解背景、反复搜索和整理上下文付出的额度，而且不必把整个仓库手工复制到网页聊天框。

Business、Enterprise 和 Edu 用户如果已经获得完整 MCP，可以进一步把低风险的实现与验证任务放到这条链路里。但生产部署、凭证操作、资金相关任务和公开发布，仍应保留独立的人类确认。

## 省额度靠路由，不靠绕过

如果 Codex 的有效额度确实在收紧，最差的应对方式是把所有工作不加区分地搬到另一个入口，然后继续让模型无限读取、无限重试。

更合理的做法是按任务拆分：

| 任务 | 更合适的入口 |
|---|---|
| 项目背景梳理、长文档阅读、方案比较 | 普通 ChatGPT + 只读 MCP |
| 精确修改、运行测试、Git 操作 | Codex 本地模式 |
| 长时间、低风险、可恢复的后台任务 | 支持完整 MCP 的 ChatGPT Workspace |
| 生产部署、密钥、账户和资金操作 | 人工审批后再执行 |

普通 ChatGPT 负责理解和规划，Codex 负责落地和验收，可以减少 Codex 会话里的长上下文、无效搜索和反复交接。Remote Session 则把任务状态留在本地 Runtime 中，换模型或换聊天时不必重新把项目喂一遍。

当然，新的成本也会出现：Remote MCP 的部署、OAuth、权限策略、审计和安全维护都需要投入。为了省几十美元额度，把一台能执行 Shell 的机器裸露在公网，是一笔非常糟糕的交易。

## 结论

Codex 额度是否发生了全局下调，还需要 OpenAI 的正式说明和更多可重复样本。现有数据足以证明部分用户遇到了真实变化，但不足以把 76% 写成所有账户的统一结论。

AI 订阅正在从“买一个聊天框”，变成“购买多个入口、多个额度池和一组可连接的执行能力”。当这些入口都能通过 MCP 接触同一份 Workspace，最重要的能力就不再是死盯某一个额度条，而是知道什么任务应该走哪条路。

Codex 见底以后，普通 ChatGPT 可能确实还有余量。能不能把它接进真实工作，要看你的套餐、MCP 权限和安全配置。

别把它当漏洞。把它当路由。

## 参考资料

- [OpenAI：Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan/)
- [OpenAI：Developer mode and MCP apps in ChatGPT](https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt)
- [OpenAI：Apps in ChatGPT](https://help.openai.com/en/articles/11487775/)
- [OpenAI Status：Codex Usage Limits Depleting Faster Than Expected](https://status.openai.com/incidents/01KW2E6W0503W4NXJNCVAG8V6T)
- [MCPX GitHub 仓库](https://github.com/opentokenz/mcpx)
- [NerfTrack GitHub 仓库](https://github.com/Ayaan-Lashari/NerfTrack)
- [社区样本：Plus 周额度变化](https://www.reddit.com/r/codex/comments/1vpz69p/yall_need_to_make_more_noise_on_social_media/)
- [社区样本：Pro 5x 与 Plus 前后对比](https://www.reddit.com/r/codex/comments/1vs86k7/evidence_of_severe_nerf_on_my_5x_pro_account/)
- [SemiAnalysis：订阅套餐的 API 等值测试](https://threadreaderapp.com/thread/2064815044085318040.html)
