---
title: "Pi 把 Agent 砍到只剩 4 个工具，却做出了“无限记忆”"
description: "Pi 团队展示了一套极简 Agent 实践：代码作为事实源，历史记录保存为 JSONL，能力通过 Bash 和 Skill 按需加载，大结果写入文件而不是全部塞进上下文。"
slug: "pi-infinite-memory"
publishedAtCST: "2026-08-17T16:20:17+08:00"
language: zh
author: JimLiu
categories: [devtools]
cover: "/article-covers/pi-infinite-memory.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-VrbSQBSO5B5wU0TMjZpvP8yIfdxEI9S35qdYO4wJXJR"
draft: false
---
8 月 16 日，Pi 官方账号发布了一段 2 分 56 秒的视频。Mario Zechner 和 Armin Ronacher 介绍了他们目前使用 coding agent 的几种具体做法，内容集中在代码记忆、Bash、Skill、MCP 和上下文控制。

视频配文把这些做法概括为三点：

1. 代码是事实源。
2. Bash 足以承担通用工具层。
3. 工具必须控制上下文消耗。

这些做法与 Pi 当前的产品设计一致。

## Pi 默认只有四个工具

Pi 是一个终端 coding agent。根据官方 README，它默认向模型提供四个工具：

```text
read
write
edit
bash
```

Pi 没有内置 MCP、Subagent、Plan Mode、待办事项和后台 Bash，也不会默认弹出权限确认框。

这些能力可以通过 TypeScript Extension、Skill 或第三方 Pi Package 添加。Pi 的核心保持最小，用户根据自己的工作流选择扩展。

当前版本还提供 `grep`、`find`、`ls` 等可选内置工具，并允许通过 `--tools`、`--exclude-tools`、`--no-builtin-tools` 等参数调整实际暴露给模型的工具集合。

## 代码仓库承担项目记忆

Pi 团队在 coding 场景中把代码仓库视为项目的主要事实源。

模型可以直接读取当前代码、目录结构和代表性文件，判断项目的实现方式与编码风格。项目级说明则放在 `AGENTS.md`、`CLAUDE.md` 或简短的目录地图中。

Pi 会从用户目录、项目父目录和当前目录加载这些上下文文件。项目也可以使用 `AGENTS.override.md` 覆盖同目录下的默认说明。

这套方式没有额外维护代码向量库或 AST 记忆索引。代码发生变化后，Agent 下次读取的是当前文件，不需要同步另一套项目记忆。

Pi 仍然支持会话保存与压缩。会话以 JSONL 文件存储，并通过 `id` 和 `parentId` 保存分支结构。长会话接近上下文上限时，Pi 会压缩较早的消息，同时把完整历史保留在原始 JSONL 会话文件中。

## 历史记录保存为 JSONL，需要时再查询

视频还展示了另一种长期记忆实现。

Mario 的 Slack Bot 名为 MOM，即 Master of Mischief。它把频道中的问题、回答和系统响应保存到 append-only JSONL 文件中，再使用 `jq` 查询需要的记录。

完整历史保存在文件系统里，不需要在每次模型调用时全部进入上下文。模型处理具体问题时，只加载查询命中的数据。

这一实现由三个普通组件组成：

1. JSONL 负责追加保存历史。
2. 文件系统负责持久化。
3. `jq` 负责过滤和组合结果。

视频中将这种方式称为近似“无限记忆”。这里的“无限”指历史容量不受单次模型上下文窗口限制，并不表示每轮调用都能同时读取全部记录。

## Bash 作为统一的组合层

Pi 默认保留 Bash，是因为模型可以直接调用现有 CLI，也可以临时生成脚本处理数据。

命令行工具之间可以通过文件、管道、标准输入和标准输出组合。大结果可以先写入磁盘，再用 `jq`、`rg`、`sed` 或其他程序筛选，筛选后的内容才进入模型上下文。

Mario 在 2025 年发布过一组浏览器 CLI 工具，用来替代自己工作流中的通用浏览器 MCP。按他当时的统计：

| 方案 | 工具数量 | 工具说明占用 |
|---|---:|---:|
| Playwright MCP | 21 | 约 13.7K token |
| Chrome DevTools MCP | 26 | 约 18.0K token |
| 自用浏览器 CLI 的 README | 少量命令 | 约 225 token |

这组数据来自 2025 年 11 月的文章，相关 MCP 的工具数量和 Schema 之后可能已经变化。它反映的是当时特定版本与特定工作流的对比。

## Skill 按需加载完整说明

Pi 支持 Agent Skills 标准。Skill 可以包含 `SKILL.md`、辅助脚本、参考文档和资源文件。

Pi 启动时只扫描 Skill 的名称和描述，并把这些元数据放进系统提示词。任务匹配后，Agent 才使用 `read` 加载完整的 `SKILL.md`。Skill 中更长的参考资料和脚本继续保存在文件里，需要时再读取或执行。

官方文档将这种机制称为 progressive disclosure，也就是渐进披露。

因此，一个 Skill 不需要把全部使用说明、API 文档和示例永久放进每个会话。常驻上下文只承担能力发现，具体任务承担完整加载成本。

## Sentry Skill 只返回样例和文件路径

视频中的 Sentry 案例展示了一个具体输出策略。

Agent 为固定需求创建了一个 Skill，由它处理认证、拉取 Sentry 数据并转换为常用格式。当查询返回 52 条记录时，工具不会把 52 条记录全部返回给模型，而是：

1. 把完整结果保存为 JSON 文件。
2. 在当前上下文中展示 3 条样例。
3. 告诉 Agent 完整文件的位置。
4. 由 Agent 判断字段结构是否正确，再使用 `jq` 查询完整数据。

对应的输出可以概括为：

```text
共找到 52 条记录，完整结果已保存到指定 JSON 文件。
当前展示 3 条样例。
如需继续分析，请使用 jq 查询完整文件。
```

这种接口把数据存储与模型上下文分开。记录数量增加时，返回给模型的摘要仍然可以保持固定大小。

## 这套实践如何节约 Token

Pi 团队展示的几种做法都在减少常驻或重复进入上下文的内容：

| 内容 | 保存位置 | 进入上下文的时机 |
|---|---|---|
| 当前代码 | 代码仓库 | Agent 按需读取文件 |
| 项目规则 | `AGENTS.md` 等文件 | 启动或进入项目时加载 |
| 完整会话 | JSONL 会话文件 | 恢复、分支或查询时使用 |
| Slack 历史 | append-only JSONL | `jq` 查询命中后加载 |
| Skill 说明 | `SKILL.md` | 任务匹配后加载 |
| 大型 API 结果 | JSON 文件 | 先看样例，再按需查询 |

工具 Schema、完整历史、API 大结果和长篇文档不会同时常驻在每一次模型决策中。

## 适用范围

这套方式适合具备文件系统和代码执行环境的 coding agent。仓库代码可以直接验证，CLI 输出可以保存和二次处理，Skill 也可以围绕个人工作流快速修改。

企业环境仍可能需要 MCP 或其他标准化集成提供统一发现、权限、审计和跨客户端兼容。Pi 也允许用户通过 Extension 添加 MCP 支持。

安全方面，Pi 官方提醒，第三方 Extension 会执行任意代码，Skill 也可能指示模型运行程序。安装前需要审查来源和实现，并根据使用环境增加容器、沙箱或权限控制。

Pi 的实现把记忆和工具拆成文件、命令与按需说明。模型上下文只保留当前任务需要的部分，其余内容留在可以查询和验证的外部存储中。

## 参考资料

1. [Pi 官方推文与视频](https://x.com/pidotdev/status/2088951405155426757)
2. [Pi Coding Agent：README 与设计哲学](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md)
3. [Pi Skills：渐进披露与按需加载](https://pi.dev/docs/latest/skills)
4. [Mario Zechner：What if you don't need MCP at all?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)
5. [Mario Zechner：What I learned building an opinionated and minimal coding agent](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
