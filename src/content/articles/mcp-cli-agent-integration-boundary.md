---
title: "MCP“凉了”？Claude Code 团队给出相反答案"
description: "本地编程偏爱 CLI，云端集成与企业治理偏爱 MCP。工具延迟加载、无状态协议与 OAuth 改变成本结构，MCP 完成一次角色迁移：工具包装层退场，连接与治理层登场。"
slug: "mcp-cli-agent-integration-boundary"
publishedAtCST: "2026-09-18T07:47:55+08:00"
language: zh
author: JimLiu
categories: [devtools, products, business]
cover: "/article-covers/mcp-cli-agent-integration-boundary.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-bCJwlRB0OW_aYUGfxMWNh2bks13xK2hSAO9Khks0Aan"
draft: false
---

MCP 遇到一种尴尬。

Coding Agent 用户偏爱 CLI。`git`、`gh`、`docker`、`ffmpeg` 拥有成熟命令。Agent 读帮助文档，拼管道，筛字段。MCP 服务增加 Schema、进程和 Token 成本。

一张厂商更新列表呈现另一幅图景：Gemini CLI、Claude Code、OpenAI Agents SDK 和 MCP SDK 的 MCP 更新密集。

社区体感与厂商投入形成反差。

Claude Code 团队成员 Thariq 给出一个相反判断：多数集成选择 MCP 优于 CLI。他给出的理由有三项：模型工具调用能力提升，工具定义支持延迟加载，MCP 协议完成无状态化。

矛盾来自场景混用。

CLI 擅长本地执行。MCP 擅长远程连接、身份和治理。两者服务于 Agent 工具链的不同层级。

## CLI 的终端优势

CLI 是程序员几十年积累的工具接口。

它有三个明显优势。

命令组合成本低。管道、重定向、退出码和标准输入输出形成一套稳定语法。Agent 组成一条管道：`gh issue list` 的结果交给 `jq`，筛选结果进入下一条命令。

成熟 CLI 支持字段选择。`--json`、`--query`、`--format` 让数据裁剪停留于进程边界，模型接收的 Token 数下降。

本地凭证与环境现成可用。操作系统管理 Git 凭证、Docker Socket、SSH 配置和文件权限。Agent 复用现成能力，额外服务层缺少收益。

Git、Docker、Kubernetes、媒体处理和代码搜索属于 CLI 优势区。调用频率高、数据靠近本机、命令接口成熟，这组特征支持 CLI。

![CLI 与 MCP 的选择地图：本地执行偏向 CLI，身份与治理偏向 MCP](/article-images/mcp-cli-agent-integration-boundary/decision-map.webp)

这类任务带来合理的“MCP 笨重”体感。

问题是结论外推。Figma 画布、Sentry 事件、Stripe 账户、Notion 工作区和 Linear 项目具有丰富对象模型。云端 Agent 的典型运行环境缺少 Shell。CLI 的优势条件消失，MCP 的价值出现。

## 三项变化重写 MCP 成本

Thariq 的判断有技术依据。MCP 的技术条件发生变化。

![MCP 的三项结构变化：模型、上下文与协议](/article-images/mcp-cli-agent-integration-boundary/protocol-shift.webp)

### 模型理解工具的能力提高

早期模型面对几十个工具 Schema，常见问题是选错工具、填错参数和遗漏必填字段。CLI 提供自由文本接口，Shell 经验帮助模型完成任务。

新模型的结构化调用能力提高。复杂 Schema 的代价下降。MCP 工具由“模型负担”变成“模型可理解的对象”。

坏 Schema 的问题保留。好 Schema 的收益提高。

### 工具定义退出初始上下文

旧 MCP 客户端的初始提示包含全部工具定义。十个服务器、上百个工具挤占大量 Token，工具选择受到干扰。

Anthropic 的 Tool Search Tool 改变了这项成本。`defer_loading: true` 是工具延迟加载标记。搜索工具构成模型初始上下文的工具部分，任务触发具体工具加载。

Anthropic 的内部测试给出两组结果：工具定义 Token 使用量下降 85%；Opus 4 的 MCP 评测准确率原值 49%，新值 74%；Opus 4.5 原值 79.5%，新值 88.1%。这些数字来自 Anthropic 测试，外部复现实验处于空白状态。

延迟加载拆分“工具总数”与“单次上下文成本”。大型工具目录获得实用性。

### MCP 变成无状态 HTTP 协议

MCP 2026-07-28 规范移除协议层会话、初始化握手和 `Mcp-Session-Id`。每个请求带有完整信息，任意服务器实例处理请求。

这个枯燥变化决定 MCP 的企业基础设施资格。

无状态请求进入普通负载均衡器。`Mcp-Method` 与 `Mcp-Name` 请求头支持网关路由、授权和限流。工具列表带有缓存提示。W3C Trace Context 支持跨服务追踪。

MCP 接近标准 Web 工作负载。企业团队熟悉的扩容、审计、网关和可观测性体系获得复用。

## MCP 的核心价值是身份

CLI 的认证依赖本机环境。这个模式适合个人电脑，企业云端 Agent 面临另一组问题。

谁发起调用？

调用代表哪个用户？

工具拥有什么权限？

删除、付款、发消息对应哪级审批？

操作记录进入哪套审计系统？

身份和治理承载这些问题，命令语法负责其他问题。

MCP 的授权规范支持 OAuth 发现、令牌验证和受保护资源元数据。MCP Apps 支持服务器级授权与工具级授权。公开工具保持开放，敏感工具触发授权流程。

Sentry、Stripe、Notion 和 Linear 这类 SaaS 偏爱账户授权。企业服务器托管 MCP。用户身份、权限范围、审计日志与撤销机制归入一套体系。客户端的长期 API Key 数量下降。

跨客户端复用构成 MCP 的另一个优势。Claude、ChatGPT、IDE 和内部 Agent 连接同一服务端。服务端维护工具契约、认证规则和对象模型。

CLI 解决命令执行。MCP 解决身份、权限与能力映射。

## 好 MCP 与好 CLI 共享克制原则

协议升级与单个 MCP 服务质量属于两个问题。

工具设计决定真实成本。

一个工具返回整张对象树，模型支付无用 Token。一个查询工具缺少字段筛选，固定 JSON 结构放大输出。一个服务器暴露几十个粒度相近的工具，模型承担路由压力。

Thariq 给出具体建议：组合与过滤成为 MCP 参数，参数例子是 `query`。服务端完成筛选，客户端接收任务所需数据。

优秀 MCP 工具具有几项特征：参数明确、返回可裁剪、副作用清楚、错误可机器读取、调用结果带有凭据。优秀 CLI 具有相同设计原则。

MCP 问题的常见根源是产品团队暴露内部 API 原始结构。Agent 任务对象与后台数据库结构属于两套抽象。

## 选择标准超出 MCP 与 CLI 二选一

选择标准有四个。

运行位置决定第一层选择。Agent 与工具共享本机环境，CLI 成本占优。云端 Agent 偏向远程 MCP。

对象复杂度决定接口形态。文件、进程和文本流适合 CLI。画布、事件、账户和工作区适合 MCP 的结构化工具。

身份模型决定连接方式。个人凭证适合 CLI。OAuth、组织权限与代理身份适合 MCP。

治理要求决定部署层级。个人任务重视速度。企业任务重视审批、审计、限流和撤销，MCP 网关承担这些责任。

这个框架给出一个简单结论：本地高频任务选择 CLI；远程账户型服务选择 MCP；复杂流程采用混合模式。

混合模式具备主流潜力。Skill 负责流程知识，CLI 负责本地执行，MCP 负责远程能力。Agent 负责调度三者。

## MCP 的角色迁移

模型函数包装层场景偏爱 CLI，它的成本占优。

企业眼中的 MCP 是“Agent 连接层”。`curl` 是原比较对象，新比较对象是 API Gateway、OAuth 客户端、权限系统和审计管道的总和。

这解释了社区使用感与厂商投入的反差。

个人开发者看见的是一次命令调用。平台厂商看见的是跨客户端、跨账户和跨组织的连接市场。

MCP 与 CLI 的战争问错了问题。

正确问题是能力归属：本地执行，或远程连接与治理。

能力归属决定工具选择，选择结果简单。

## 参考资料

- [Thariq：MCPs are better than CLIs for most integrations](https://x.com/trq212/status/2099958388230873165)
- [Model Context Protocol：The 2026-07-28 Specification](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- [Anthropic：Introducing advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)
- [MCP Apps：Authorization](https://apps.extensions.modelcontextprotocol.io/api/documents/authorization.html)
- [Claude Code user FAQ](https://support.claude.com/en/articles/14554922-claude-code-user-faq)
