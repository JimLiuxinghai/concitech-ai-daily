---
title: 谷歌开源 Gemini API CLI！Codex、Claude Code 的终端工具能生图、读 PDF、跑调研
description: >-
  一个 Go 二进制把 Gemini 的图像、语音、文件分析和托管 Agent 变成终端命令。本文拆解文件路径、离线预览和后台任务 ID，附 v0.5.0
  的命令验证。
slug: google-gemini-api-cli
publishedAtCST: '2026-11-24T22:14:14+08:00'
language: zh
author: JimLiu
categories:
  - devtools
  - products
cover: /article-covers/google-gemini-api-cli.webp
draft: false
---

Codex 接到一份落地页需求。页面需要一张插图、一段配音和一份竞品调研。开发者可以把写代码和组装页面交给 Codex，把图像和音频交给 Gemini。谷歌的 **Gemini API CLI** 把这次交接变成了终端命令。

项目名是 `google-gemini/gemini-api-cli`，命令名是 **`gemini-api`**。谷歌的更新日志把 Beta 发布日期列为 10 月 27 日。GitHub 的 v0.5.0 发布日期是 11 月 20 日。macOS、Linux 和 Windows 有官方预编译包。

## 一个命令，三种交付物

`gemini-api` 是 Gemini Interactions API 的命令行客户端。**Codex 或 Claude Code 负责拆任务和接成果，Gemini 负责执行对应的模型调用。** 名字相近的 `@google/gemini-cli` 是具备对话界面的编码 Agent，两者承担不同的工作。

`image` 生成或编辑图片，`tts` 生成配音，`music` 和 `video` 处理音乐与视频。媒体命令的交付物是文件。标准输出支持文件路径和 JSON 元数据，文件路径供宿主 Agent 引用素材。

`analyze` 可以读取 PDF、图片、音视频和其他受支持的输入。`transcribe` 可以生成 SRT 字幕。项目可以把这两条命令接到资料整理或字幕生成流程。文本输出可以交给应用代码、下一条命令或宿主 Agent。

`agent run` 可以调用托管 Agent。后台任务的交付物是 **interaction ID**。调用者可以保存 ID，查进度或取结果。

![Codex 或 Claude Code 调用 Gemini API CLI，接收文件、文本或后台任务 ID](/article-images/google-gemini-api-cli/01-workflow.webp)

## 终端里的生图预览是什么样？

我选了「奶油色背景上的折纸灯塔」作为测试提示词。测试使用 GitHub Releases 的 v0.5.0 官方二进制，校验了 SHA-256。下面这条命令走的是离线预览。

```bash
gemini-api image "An isometric origami lighthouse, cream background, no text" \
  --out ./assets/lighthouse.jpg \
  --dry-run --output-format json
```

预览返回了请求方法、API 路径和 JSON 请求体。该版本的生图默认模型是 `gemini-nano-banana-2.1`。预览内容显示输出类型为图片。测试凭据为空，图片路径无文件。实际执行需要可用的 Gemini API 凭据，命令的区别是移除 `--dry-run`。

命令能告诉 Agent 自己支持什么。`--usage` 输出机器可读的命令树，格式是 KDL。`gemini-api image --schema` 输出请求体的 JSON Schema。`--body @文件名` 供调用方传入自定义请求。一次陌生的调用可以分成三件事，查命令、看字段、预览请求。参数错在哪里，Agent 有本地证据可查。

批处理的输出格式也有区别。文本生成的默认设置是流式输出。完整 JSON 对象的输出设置是 `--stream=false --output-format json`。`--jq` 可以从响应中提取字段。代码 2 表示参数或校验错误，代码 3 表示认证或授权失败。脚本可以给两类失败安排不同的处理方式。

## 后台调研的任务单是一个 ID

开发者可以把「比较 iCalendar 和 JSCalendar」交给 Deep Research。工作流保存交互 ID，查询命令使用该 ID。

```bash
RESEARCH_ID=$(gemini-api agent run \
  "Compare iCalendar and JSCalendar and cite primary sources" \
  --agent deep-research-preview-04-2026 \
  --background --stream=false --jq '.id')

gemini-api agent status "$RESEARCH_ID" --output-format json
```

我核对了启动请求的离线预览。请求体里的 `background` 为 `true`，`stream` 为 `false`。这组设置让提交任务和等待结果分成两步。上面两条命令展示实际调用写法。测试覆盖的是请求预览。

**本地客户端不保存对话状态，服务端的交互对象有自己的留存规则。** 文件上传和后台任务各有编号。谷歌文档给出的内联原始文件上限是约 14 MB，更大的文件可以走 Files API。上传文件的留存时间是 48 小时。Interactions API 的默认设置包含交互对象存储。`store=false` 与后台执行和后续交互引用不兼容。

![Gemini API CLI 的本地请求预览、远程模型调用和后台任务三个环节](/article-images/google-gemini-api-cli/02-local-and-remote.webp)

## 它放在项目的哪一层？

有 shell 访问能力的 Agent、定时脚本和 CI 可以共用同一套命令。机器需要可执行文件，宿主进程需要可用的 API 凭据。谷歌维护了一份配套 Skill，内容是命令发现、参数使用和输出读取。脚本或 CI 的版本可以固定到一个 Release，项目的 Beta 状态允许后续版本改变接口。

应用后端的长期集成有另一套接口需求。请求类型、超时、重试和日志要进入业务代码，Google GenAI SDK 提供了语言级客户端。`gemini-api` 的工作对象是终端里的单次调用和任务交接。页面构建脚本可以拿图片路径，调研工具可以存任务 ID，字幕任务可以交付一个 SRT 文件。**宿主 Agent 的工作记忆留在原来的工具里，Gemini 的能力可以从终端调用。**

## 参考资料

- [Gemini API CLI 的 GitHub 仓库](https://github.com/google-gemini/gemini-api-cli) · [v0.5.0 Releases](https://github.com/google-gemini/gemini-api-cli/releases/tag/v0.5.0)
- [Google AI Studio 的 CLI 指南](https://aistudio.google.com/docs/cli) · [Gemini API 更新日志](https://aistudio.google.com/docs/changelog#10-27-2026)
- [Interactions API 存储与留存文档](https://aistudio.google.com/docs/interactions-overview#data-storage-retention)
- [Deep Research 文档](https://aistudio.google.com/docs/deep-research)
- [谷歌维护的 gemini-api-cli Skill](https://github.com/google-gemini/gemini-skills/tree/main/skills/gemini-api-cli)
