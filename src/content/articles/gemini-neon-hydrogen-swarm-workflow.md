---
title: Gemini 4 Neon 组队实战！Neon 做计划，Hydrogen 干活，谁来验收？
description: >-
  Antigravity 的 Orchestrator 和 /swarm
  解决两类协作问题。文章附一份可改用的仓库审计提示词，包含任务边界、独立验收与上线前检查。
slug: gemini-neon-hydrogen-swarm-workflow
publishedAtCST: '2026-11-26T06:09:51+08:00'
language: zh
author: JimLiu
categories:
  - devtools
  - products
cover: /article-covers/gemini-neon-hydrogen-swarm-workflow.webp
draft: false
---

一个网站仓库需要查文档、补测试、找构建瓶颈。三个问题各有证据和文件。把它们交给同一条对话，模型要在三套资料之间切换。Antigravity 的分工可以拆开这些工作，给验收者留一份独立的证据清单。

Google 发布 Gemini 4 Neon 时给了一个对照数字。SWE-sweep 上，Neon 在 mini-SWE 工具环境的得分是 **12.8%**，在 Google Antigravity 环境是 **39.0%**。差值是 26.2 个百分点。这是 Google 公布的两套运行环境结果，工具和运行配置的影响包含在这个差值里。单独测量 `/swarm` 的贡献需要另一场实验。

0xMovez 的长文把这种配合拆成几个角色。**Neon 负责计划与检查进度，Hydrogen 承担常规执行，验证者复查证据。** 我把方法落到一个网站仓库上。它的起点是一轮只读审计。

## 1. 选 Orchestrator，分开计划和执行

Antigravity App 的模型选择器有 **Orchestrator**。设置页的 **Models → Orchestrator Settings** 管理规划模型和执行模型。Google 文档列出的默认搭配是 **Gemini 4 Neon + Gemini 4 Hydrogen**。Neon 的可用范围取决于账户套餐与组织配置，模型选择器反映当前账户的选项。

Orchestrator 是一个会话里的两类工作。规划模型读代码、出计划和检查进度。执行模型处理搜索、编辑、构建和测试。原帖作者建议从较高的推理档位开始。实践的成本比较应记录一次任务的结果、耗时和额度消耗。并行会话的等待时间和总消耗是两项指标。

**`/swarm`** 增加的是多个命名工作成员和共享看板。协调者分派任务，成员汇报各自结果，`@verifier` 查证后再交给协调者汇总。Orchestrator 的模型设置与 Swarm 成员的实际模型是两处信息。成员页可以查看每个角色实际使用的模型。

![Orchestrator 的规划、执行分工，以及 Swarm 中的协调者、工作成员和验证者](/article-images/gemini-neon-hydrogen-swarm-workflow/01-orchestrator-and-swarm.webp)

## 2. 第一轮任务选只读审计

下面的提示词假设任务对象是自己的项目仓库。请将文件路径替换为本地项目的实际路径。

```text
/swarm 审查当前项目。范围是只读。禁止改文件和提交。
1. @docs 检查 README 中的启动和测试命令，
   对照 package.json 或项目任务配置。
2. @tests 阅读 tests/，找出两个缺少断言的行为。
3. @build 检查构建脚本，找出重复执行的步骤。
@verifier 独立打开原文件，复核每条路径、行号和结论。
协调者按影响汇总：发现、证据、验证状态、后续改动范围。
证据不足的结论标为待验证。报告保留未运行的检查。
```

提示词的三个约束是**文件范围、交付格式、验证方式**。验证者的工作是打开证据所在文件，复跑允许的检查，驳回无从验证的判断。Antigravity 支持在提示词里指定另一款可用的验证模型。验收证据来自文件、命令和结果。

开发者 Flavio Copes 的实测有一个细节。验证者指出链接审计报告的两处错误，工作成员交回修正版，协调者才整理最终清单。该回合的成员面板显示协调者、工作成员和验证者的标签均为 Hydrogen。案例说明独立会话可以产生有效的复查，选中 Neon 规划配置不代表每个成员都在运行 Neon。

## 3. 让仓库记住任务边界

`AGENTS.md` 适合记录仓库的构建命令、测试命令和完成条件。自定义验证者可以写在 `.agents/agents/verifier.md`。Antigravity 文档列出了这个路径。较长的角色也可使用 `.agents/agents/verifier/agent.md`，附带自己的文件。

验证规则可以写成四个字段。**发现**说明行为，**证据**列路径和行号，**检查**写实际执行的命令与结果，**结论**区分已确认和待复核。协调者收报告时就知道哪些结论能进入最终清单。

第一项写入任务可以选一个已确认的问题。任务单写明负责文件、预期行为、验证命令和禁改范围。多个成员涉及重叠文件时，Google 文档给出的选项是独立工作副本。合并前，验证者要看最终 diff 并运行相关测试。两条分支各自通过测试，合并后的版本仍有自己的验证步骤。

![从只读审计到允许写入的四个验收关口](/article-images/gemini-neon-hydrogen-swarm-workflow/02-task-and-verification.webp)

## 4. 把分工带到其他工具

T3 Code 项目合入了 Antigravity 的官方 ACP 接入。这个入口可以保留不同 Agent 的会话。模型的可选范围取决于各自运行时和账户。

Codex 或 Claude Code 可以把生图、音频转写和后台调研交给 `gemini-api`。终端命令返回文件路径或者任务 ID，宿主保管任务上下文。创意项目也适用这套分工。动效的验收对象可以是总时长、帧率和音轨峰值。脚本提供测量结果，人负责审看效果。

需要周期运行的任务，可以写成 **Google ADK 2.0** 的工作流。Google 的实践文档给出了并行节点、`JoinNode` 汇总和条件路由。一个仓库质量巡检可以让文档检查与测试检查并行执行，汇总节点收齐结果，条件节点决定交回补证据或移交人审。固定的人审关口和终止条件，属于工作流本身。

这套方法最值得复制的是任务单和验收规则。任务单规定谁能改什么。验证规则要求每条结论有可查的依据。换模型、换运行工具，团队仍有同一份证据要求。

## 参考资料

- [0xMovez 原帖与八步教程](https://x.com/0xmovez/status/2125577359269019791) · [Google 的 Gemini 4 Neon 发布公告](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/)
- [Antigravity 模型选择文档](https://antigravity.google/docs/models) · [Swarm 文档](https://antigravity.google/docs/swarm) · [自定义成员文档](https://antigravity.google/docs/subagents)
- [Flavio Copes 的仓库审计实测](https://flaviocopes.com/antigravity-swarm/)
- [T3 Code 的 Antigravity ACP 集成](https://github.com/pingdotgg/t3code/pull/9348)
- [Gemini API CLI 上手文章](https://ai.concitech.org/articles/google-gemini-api-cli/) · [Google Cloud 的 ADK 工作流文档](https://cloud.google.com/blog/topics/developers-practitioners/graph-workflows-in-adk-everything-you-need-to-know)
