---
title: Claude Code 推出 Code Mode！一段 JavaScript 串起工具，长任务有了后台
description: >-
  Claude Code 的实验功能 Code Mode 把工具调用写进
  JavaScript。脚本处理搜索、筛选和测试，模型读取任务需要的结果。文章拆解工具编排、后台任务和权限检查，附终端启用方式。
slug: claude-code-code-mode
publishedAtCST: '2026-11-22T11:20:50+08:00'
language: zh
author: JimLiu
categories:
  - devtools
cover: /article-covers/claude-code-code-mode.webp
draft: false
---

一次仓库排查需要搜目录、读文件、跑测试。搜索结果包含几十条路径，测试输出包含大段日志。一处定义、两个调用点和一条失败断言，就是一次测试诊断需要的证据。

Claude Code 团队公布了实验功能 Code Mode。**Claude 写 JavaScript，脚本调用工具和处理数据，模型读取脚本返回的结果。** 一段脚本可以包括搜索、筛选、多个独立命令，以及结果汇总。用户的入口是自然语言。

这项改动改变了模型和运行环境的分工。模型决定任务步骤和返回字段，运行环境执行脚本。

## 一段脚本包含搜索、判断和下一次调用

普通会话的基本循环是模型发出工具请求、接收结果、决定下一步。独立工具调用可以成批发出。结果间存在依赖的任务需要额外的模型交互。例如，第二次读取的路径取决于第一次搜索的命中。

Code Mode 提供名为 `REPL` 的工具。Claude 生成一段 JavaScript，Claude Code 执行它。脚本的变量保存搜索结果，筛选逻辑确定候选路径，读取工具取得文件内容。独立检查支持并发执行。返回值的示例是一组路径、几段代码和一个测试摘要。

![普通调用与 Code Mode 的工具执行和结果回传](/article-images/claude-code-code-mode/01-tool-flow.webp)

拿文档链接检查举例。任务输入是一个仓库。脚本的步骤包括枚举 Markdown 文件、提取相对链接、判断目标文件是否存在。任务输出是一份失效链接清单，每条记录包含来源文件、目标路径和行号。模型用清单解释问题。仓库里成百上千条正常链接属于程序检查的中间数据。

Claude Code 的会话界面展示工具活动，例如编辑差异。代码本身位于 transcript viewer。终端快捷键 `Ctrl+O` 打开该视图，`Code` 行包含生成的脚本。审查者有两种材料，一种是实际发生的工具调用，一种是决定调用顺序和返回内容的代码。

## 上下文的节省来自中间结果

脚本的一个用处是缩短模型输入。原始测试日志包含每次用例执行的输出。诊断摘要的常用字段有失败用例、错误栈和相关输出。脚本负责提取这些字段。

Anthropic 早期的 MCP 研究给过一个量级参照。研究文章的跨应用示例涉及工具定义加载和中间结果处理，token 数从 15 万降为 2,000。该数字属于研究案例。Claude Code 这项终端功能的实际用量取决于任务、调用结果和脚本输出。

摘要存在信息损失。测试日志的尾部有失败摘要，首个错误的位置取决于日志内容。截取尾部的脚本会丢掉中段的线索。我希望每条失败记录包含原始日志位置和退出状态，摘要负责报告问题，原文提供复核依据。

## 一场长测试，两种等待方式

官方推文提到长命令运行期间的对话能力。文档对两种运行方式给出了条件。前台脚本的等待上限是 10 分钟。后台脚本的运行上限是 2 小时，运行期间支持对话。

![Code Mode 的前台等待和后台执行差异](/article-images/claude-code-code-mode/02-long-running.webp)

后台能力取决于**会话启动时的权限模式**。官方文档列出的模式有 auto 和 `bypassPermissions`。启动权限模式决定后台资格。终端的 `/tasks` 提供后台任务的查看和停止入口。

一场十几分钟的测试提供了一个使用场景。用户的下一条消息是「哪些行为属于这轮测试的范围？」测试结论取决于进程退出状态。后台状态、阶段进展和测试结论是三个不同的信息。

## 脚本审查与工具权限

Code Mode 的权限检查分成两个层次。auto 模式的分类器负责整段脚本的运行前审查。Bash、文件和 MCP 调用分别适用对应工具的 `deny`、`ask` 规则和 `PreToolUse` hook。前一步的结果是后续调用的参数来源之一。分类器的审查材料是脚本，实际参数值属于运行阶段。

匹配 `REPL` 的 hook 提供整段脚本的审查入口。具体的路径、写入和 MCP 工具限制由对应工具的规则负责。**Bash 沙箱的适用范围是 shell 命令。** 官方文档将 JavaScript 和文件、网页、MCP 调用列在 Bash 沙箱范围之外。容器或虚拟机是整套会话的隔离选项。

## 终端的启用方式

Code Mode 处于实验阶段，初始状态为关闭。官方文档给出的最低版本是 Claude Code v2.1.323，入口是原生客户端的交互式终端会话。支持的模型包括 Opus 5.5、Sonnet 5.5、Haiku 5.5 和 Fable 5.2。直连 Anthropic 的订阅或 Console 账户属于支持范围，适用条件见官方文档。

macOS、Linux 或 WSL 的单次启动命令如下。

```bash
CLAUDE_CODE_EXPERIMENTAL_CODE_MODE=1 claude
```

首个 Code Mode 会话会出现确认。会话恢复需要继续启用这个模式。文档链接检查、测试日志归类和多处代码引用查找是三个试用题。衡量项包括模型交互次数、回传结果大小和摘要的定位证据。

我会选一项常做的仓库检查，对照两种模式的交互次数和结果质量。回传结果的缩减有价值，定位证据的完整性决定这份结果能否交给下一位工程师。

## 参考资料

- [Claude Code 团队的 Code Mode 公告](https://x.com/ClaudeDevs/status/2122801681939234950)
- [Claude Code 的 Code Mode 使用文档](https://code.claude.com/docs/en/code-mode)
- [Claude Code 的权限模式](https://code.claude.com/docs/en/permission-modes)
- [Claude Code 的 Bash 沙箱范围](https://code.claude.com/docs/en/sandboxing)
- [Anthropic 的 MCP 代码执行研究](https://www.anthropic.com/research/code-execution-with-mcp)
