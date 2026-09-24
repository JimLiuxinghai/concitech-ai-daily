---
title: "Paseo爆火：一个界面指挥Claude Code、Codex与Copilot"
description: "Paseo为Claude Code、Codex、Copilot、OpenCode和Pi提供统一控制台。本文介绍本地Daemon、Agent交接、顾问模式、委员会模式、手机控制、安装方法与安全边界。"
slug: "paseo-multi-agent-control-plane"
publishedAtCST: "2026-09-25T04:50:11+08:00"
language: zh
author: JimLiu
categories: [devtools, products]
cover: "/article-covers/paseo-multi-agent-control-plane.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-ewCdQpRnH9zlut-90V9zBe-ZCEIt2OIfd_RGHFvTIzd"
draft: false
---

Claude Code 负责方案，Codex 负责实现，Copilot 负责审查。这个工作流具备合理分工。交接过程充满复制粘贴。

方案、文件路径、失败尝试、约束条件散落于多个会话。开发者承担状态核对。Agent 数量影响控制成本。

开源项目 Paseo 瞄准这个问题。它给 Claude Code、Codex、GitHub Copilot、OpenCode 和 Pi 提供统一控制台。

它管理会话、工作区、终端、模型和权限。桌面端、手机端、网页端与 CLI 共享一套状态。

![Paseo多Agent控制台](/article-images/paseo-multi-agent-control-plane/cover.webp)

仓库数据记录了 18,440 Star 与 2,112 Fork。项目版本号是 v0.9.2，许可证是 Apache-2.0。

## Paseo 是 Agent 控制台

Paseo 属于编排层。现有 Agent CLI 承担代码任务，Paseo 承担启动、监督、交接和展示。

开发者保留原有订阅、配置、Skills、MCP Server 与身份凭据。每个 Provider 负责自己的认证。Paseo 的职责范围是进程与会话管理。

原生适配器覆盖 Claude Code、Codex、OpenCode 和 Pi。ACP 通用适配器扩展了 Cursor、Gemini、GitHub Copilot、Hermes、Kimi、Qwen Code 等工具。项目文档列出的 ACP Agent 数量超过 25 个。

![Paseo桌面端与手机端界面，图片来源：Paseo项目官网](/article-images/paseo-multi-agent-control-plane/desktop.webp)

桌面界面包含会话列表、Agent 对话、代码差异、文件浏览器和终端。用户查看多条 Agent 任务线，分支与 Worktree 进入工作区模型。

CLI 暴露同一套能力：

```bash
paseo run "fix the tests"
paseo ls
paseo attach <agent-id>
paseo send <agent-id> "also fix linting"
paseo logs <agent-id>
paseo stop <agent-id>
```

TypeScript SDK 面向 Issue 集成、内部看板和编排服务。API 包含 Agent 创建、消息发送、完成等待和结果读取。

## 本地 Daemon 是系统中心

Paseo 采用客户端与服务器结构。开发机是 Daemon 宿主。Daemon 创建 Agent 进程，保存会话记录，管理工作区，并输出 WebSocket API。

桌面端、手机端、网页端和 CLI 属于客户端。Agent CLI 是普通子进程。代码和开发环境留在 Daemon 主机。

![Paseo客户端、Daemon与编码Agent架构](/article-images/paseo-multi-agent-control-plane/architecture.webp)

这套架构带来一个清晰分工：客户端负责操作界面，Daemon 负责状态与权限，Agent 负责代码任务。

桌面应用自带 Daemon 管理。CLI 版本的安装命令是两行：

```bash
npm install -g @getpaseo/cli
paseo
```

运行条件包含一个 Agent CLI 与对应账号认证。Docker 镜像适合服务器与远程开发机，挂载卷承载工作区和凭据目录。

## 三种 Agent 协作方式

Paseo 提供三套编排 Skill：Handoff、Advisor 和 Committee。

### Handoff：任务交接

`/paseo-handoff` 生成一份自足任务简报。简报包含目标、背景、相关文件、进度、失败尝试、决策、验收标准和约束。

接收方拥有零上下文。交接对象是任务简报。模型内部状态位于交接范围之外。

这个机制适合角色切换：Claude Code 负责方案，Codex 接手实现；Codex 完成代码，Copilot 接手审查。独立修改任务的隔离选项包含单独 Worktree。

### Advisor：第二意见

`/paseo-advisor` 创建一名顾问 Agent。顾问读取问题与相关文件，输出建议与理由。文件修改权留在主 Agent。

设计评审、迁移方案和风险检查属于合适场景。Provider 差异形成多种视角。

### Committee：双路分析

`/paseo-committee` 创建两名高推理 Agent。两个 Agent 采用异构 Provider 家族，任务是根因分析和方案设计。

主 Agent 收集两份结果，传递分歧，整理共识。委员会成员承担分析职责，文件编辑位于职责范围之外。

三种 Skill 的共同原理是上下文工程。Paseo 负责 Agent 发现、Profile 选择、工作区放置和生命周期；任务简报负责语义连续性。

## 手机端控制开发机

Paseo 客户端覆盖 iOS、Android、桌面、网页与 CLI。手机端包含并行任务、多台主机、代码差异和终端操作界面。

![Paseo手机端的并行Agent、多主机、代码差异与终端，图片来源：Paseo项目官网](/article-images/paseo-multi-agent-control-plane/mobile.webp)

远程连接有三条路线。SSH 适合桌面端与 CLI，Tailscale 适合私有网络，Paseo Relay 适合手机配对。

Relay 使用 Curve25519 完成密钥交换，XSalsa20-Poly1305 负责消息加密。官方威胁模型采用零信任 Relay 设定。Relay 元数据包含 IP 地址、时间、消息大小、会话 ID 和公开密钥握手信息。

客户端能力包含语音输入和语音对话。开发者发起任务、检查状态、回复 Agent 和审查差异。

## 安全边界

本地优先与沙箱属于两个概念。

Daemon 用户权限决定 Agent 权限。Agent 和终端具备代码执行与工作区修改权限。连接客户端属于受信任操作方。Daemon 进程的文件读取权限决定文件预览范围。

Daemon 监听地址的缺省值是 `127.0.0.1`。公网监听要求密码、网络隔离或加密 Relay。配对链接是信任锚点，泄露风险等同密码泄露。

插件拥有 Daemon 用户权限。项目文档要求用户信任插件代码、依赖和更新。插件服务端代码与 Git 准备命令运行于非沙箱环境。

HTML 文件预览存在边界。Source 视图执行零脚本；页面预览允许页面脚本。恶意页面自导航列入官方文档的风险清单。

这些限制值得保留。Paseo 管的是开发机控制面，它的权限等级接近 IDE、终端和 Docker Daemon。

## 适合谁

Paseo 适合三类团队。

第一类是多 Agent 用户。异构工具承担任务规划、实现与审查，交接成本超过模型选择成本。

第二类是多设备用户。开发机负责计算，手机负责查看、批准和补充指令。

第三类是平台团队。CLI、SDK、计划任务、Heartbeat、插件和 Provider 适配器构成内部 Agent 平台的基础部件。

单一 Agent、单一会话和短任务对 Paseo 的需求较弱。Daemon、工作区和权限系统引入额外运维面。

Paseo 的目标是编码 Agent 的组织问题。代码生成能力来自 Agent，控制平面组织这些工具与任务。

---

## 参考资料

- [Paseo GitHub 仓库](https://github.com/getpaseo/paseo)
- [Paseo 官方文档](https://paseo.sh/docs)
- [Paseo 架构文档](https://github.com/getpaseo/paseo/blob/main/docs/architecture.md)
- [Paseo 安全文档](https://github.com/getpaseo/paseo/blob/main/SECURITY.md)
- [Paseo 编排 Skills](https://paseo.sh/docs/skills)
