---
title: "DeepSeek Harness 与 Pi：两套 Agent Harness，两种复杂度管理方式"
description: "DeepSeek Harness 开源后，很多人的第一反应是：它是不是 DeepSeek 版的 Pi？"
slug: "deepseek-harness-vs-pi"
publishedAtCST: "2026-08-14T11:42:00+08:00"
language: zh
author: JimLiu
categories: [devtools, products]
cover: "/article-covers/deepseek-harness-vs-pi.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-QLI_dDIyGxjYiqOuDggThnPYozWSARDqFUorhPIV5YX"
draft: false
---
DeepSeek Harness 开源后，很多人的第一反应是：它是不是 DeepSeek 版的 Pi？

把两个仓库的 README、架构文档和核心包对着看一遍，会发现这个问题问反了。它们都能驱动模型读代码、改文件、跑命令，也都支持会话、模型切换和扩展，但两边真正处理的是不同层次的问题。

Pi 首先是一款终端编码工具。它希望默认核心尽量小，把工作流选择留给使用者。

DeepSeek Harness 更像一个可组装的 Agent 应用平台。编码 Agent 只是它的一种成品形态，Web 界面、权限策略、子 Agent、工作流和持久化都由同一套插件机制拼起来。

还有一个容易被忽略的事实：DeepSeek Harness 的通用多模型适配器，直接依赖 `@earendil-works/pi-ai`。所以两者并不是从模型 API 到用户界面都各做一套。DeepSeek 在模型接入层复用了 Pi，分歧主要发生在 Agent 运行时和产品层。

> 本文基于 2026 年 8 月 14 日的仓库状态。DeepSeek Harness 的 npm 版本为 `0.1.0-rc.6`，仍处于 developer preview；Pi 为 `0.84.1`。两边更新都很快，具体命令和接口以后可能变化。

## 先看结论

| 维度 | DeepSeek Harness | Pi |
|---|---|---|
| 产品重心 | 可组装的 Agent 平台 | 终端优先的编码 Agent |
| 默认入口 | Web UI；另有 headless 单次任务模式 | 交互式 TUI；另有 print、JSON、RPC 模式 |
| 扩展方式 | Cordis 插件、服务、事件、profile 与 patch | TypeScript Extension、Skill、Prompt、Theme、Pi Package |
| 默认能力 | 沙箱、审批、计划、目标、任务、子 Agent、工作流、MCP 等模块随发行版提供 | 默认四个工具，其他能力按需安装或自己写 |
| 安全边界 | 默认 `workspace-write + ask` | 默认继承当前用户权限，隔离交给容器、VM 或扩展 |

如果只是想在终端里找一个顺手、透明、容易改造的 coding agent，我会先选 Pi。

如果要给团队搭一套有 Web UI、权限控制、多 Agent 调度和可替换基础设施的 Agent 产品底座，DeepSeek Harness 的上限更高，但学习和维护成本也明显更高。

## 设计哲学：都讲扩展，含义并不一样

Pi 对自己的定位很直接：`minimal terminal coding harness`。Mario Zechner 写 Pi 的直接动机，是 Claude Code 逐渐变成了一艘塞满功能的“飞船”，系统提示词和工具还会随版本变化，让他的工作流失去可预测性。他想要的是一个能看清上下文、能检查每一步、能自己改造的工具。

所以 Pi 从做减法开始。它默认只给模型四个工具：`read`、`write`、`edit`、`bash`。Mario 的设计文章给出了一个具体数字：默认系统提示词加工具定义合计不到 1000 token。仓库还把几项“不做什么”写得很清楚：默认不内置 MCP、不内置子 Agent、不弹权限确认、不提供计划模式，也不塞一套待办系统。

维护者刻意不替用户规定工作流。需要审批，可以写一个拦截危险命令的扩展；需要子 Agent，可以从 tmux 拉起另一个 Pi，或者安装现成 package。专用能力则可以把 CLI 和说明文档包装成 Skill。

Pi 的核心思路可以概括为：先给一套足够工作的原语，剩下的由开发者决定。框架不主动接管复杂度。使用者确实需要时，再通过 Extension、Skill、外部 CLI 或 tmux 加回来。

DeepSeek Harness 走的是另一条路：先做加法，再把增加出来的复杂度拆开。它的口号是 `Everything is a Plugin`，底层采用 Cordis。模型适配器、工具注册表、会话日志、Agent Loop，甚至 Web 表层都被组织成插件或可替换的能力提供方。这些部分通过服务和类型化事件连接，插件卸载时，它注册的能力和副作用也会一并撤销。

“Everything is a Plugin”也不能理解成“系统没有任何核心”。Cordis 上下文、Service Contract、事件语义和 Session Log 仍是基础约束。DSH 真正激进的地方，是默认实现通常没有不可触碰的特权；替换者不必照抄原实现，但必须遵守相应的 capability seam。

一套正在运行的 dsh，本质上是一棵插件树。`profile` 决定使用哪些组合包，组合包提供一组 Cordis 配置，用户再通过 `cordis.patch.yml` 覆盖其中的条目。官方目前随包提供 `web` 和 `headless` 两种 profile，其他形态可以继续组装。

复杂度依然存在，只是被拆成了可替换、可重组的部件。当前仓库在 `packages/` 下有 226 个 `package.json`。数字本身不代表好坏，但很能说明它的工程取向：DeepSeek Harness 在认真处理大型 Agent 系统的组合、生命周期和能力边界。

## 为什么有人把它理解成“Agent OS”

anionex 的架构分析\[1\]用了一个很有帮助的类比：DSH 正从 Coding Agent 走向 Agent OS-like 架构。这个名称并非 DeepSeek 官方定位，也不能把 dsh 等同于 Linux。它不负责硬件、内存或 CPU 调度，所谓“OS 感”来自另一件事：它开始统一管理 Agent 的运行主干、能力提供方、工作单元、权限、状态和交互界面。

按这个类比，Capability Provider 有点像驱动，Session Event Log 接近日志系统，Agent、Subagent 和 Workflow Worker 是工作单元，Cordis Plugin 则像动态模块。比喻只是帮助理解，真正有用的是它揭示了 DSH 的三层组合关系。

`Profile` 管进程级装配，决定启动 Web 还是 headless、使用哪套持久化和 API Gateway，以及宿主的安全策略。`Agent Preset` 管单个 Agent 的 Persona、Tool、Skill、Prompt 和工具呈现方式。`Scope` 再按 `agent → preset → global` 解析实际可见能力，近层覆盖远层。因此，同一个 dsh 进程可以同时承载能力不同的 Agent，不必为了切换工具集再启动一套服务。

Preset 目前也有明确边界。`recompose()` 只允许尚未产出内容的空白 Agent 换装配，因为已有会话里可能记录了新 Preset 无法执行的工具调用。长会话中的 Tool history、PTY、Approval、Task 和 Subagent 怎么迁移，还没有一套可以随便切换的通用语义。

## 控制权交给谁：开发者，还是运行时

还可以从控制权的角度继续往下看：Pi 与 DSH 对“谁应该拥有系统控制权”给出了不同答案，插件 API 的繁简只是表面结果。

Pi 把控制权留给开发者。核心保持稳定、透明，开发者决定是否安装扩展、是否启用额外工作流，以及用容器还是本机执行。模型当然能通过 `bash` 写代码，但 Pi 官方的扩展路径仍是人编写 TypeScript、显式安装或 `/reload`。运行中的模型不会因为发现能力不足，就自动改变 Pi 的核心装配。

DSH 先把更多控制点交给运行时组合。Agent Loop 本身也是挂进 Cordis 上下文的插件，文件系统、Shell、LLM、工具策略和界面都通过服务接口接起来。开发者可以换实现；更特别的是，DSH 还在尝试让 Agent 参与这件事。

在 `cordis` Preset 中，模型可以先用 `cordis_inspect_list` 和 `cordis_inspect_query` 阅读当前 Host、Client、Service、Event、Tool 与 UI Slot 的真实接口，再通过 `cordis_define` 写入一份 Host 或浏览器侧的 JavaScript Package。`cordis_run` 经用户批准后激活它；如果这个 Package 注册了新工具，模型下一步就能调用刚刚获得的能力。失败时，它还能读取诊断、生成新版本并回滚。

这已经接近运行时自修改，但离“自主进化”还有距离。动态 Package 只保存在进程内存中，重启后消失，不会自动沉淀到 Profile；代码能接触真实运行时，因此需要审批，并应按高权限扩展对待。它解决的是“Agent 能否现场补一块能力”，还没有解决版本治理、分发、跨重启学习和不可信代码隔离。

## 模型接入：表面相似，底层其实有亲缘关系

Pi 把模型能力单独做成了 `pi-ai`。它统一处理 OpenAI、Anthropic、Google、Bedrock、Vertex、OpenRouter、DeepSeek 等提供方，还覆盖 OAuth、模型目录、推理档位、图片输入、工具调用和不同 API 协议之间的差异。

日常使用时，Pi 的路径很短。启动 `pi` 后运行 `/login`，或者通过环境变量提供密钥；自建模型和公司网关可以写进 `~/.pi/agent/models.json`。模型选择、推理强度和费用统计都直接显示在 TUI 里。

DeepSeek Harness 有自己的 DeepSeek 适配器，同时提供 `dsh-llm-pi-ai`，借用 Pi 的模型目录和协议实现来接入其他厂商。Web 用户可以在“设置 → 模型”中添加提供方、填写密钥或配置 OpenAI 兼容端点，保存后立即生效，不需要重启。

所以“谁支持的模型更多”这个问题价值有限。dsh 的多提供方能力本来就建立在 Pi 的模型层之上。两者主要差在配置体验：Pi 把模型管理放在终端和配置文件里，dsh 为它做了表单、凭据引用和热更新。

## Agent 能力：一个克制，一个预装了完整工具箱

Pi 的默认工具面很窄，但它的会话体验并不简陋。

它会自动保存会话，可以继续、恢复、克隆和 fork；`/tree` 能从历史节点开出新分支，`/compact` 用摘要释放上下文。Agent 工作时仍可提交 steering message 或 follow-up。文件通过 `@` 引用，图片可以粘贴或拖入终端，`!command` 直接执行 shell。需要接入其他程序时，还能使用 print、JSON、RPC 模式或 TypeScript SDK。

DeepSeek Harness 随发行版提供的能力面大得多。基础组合中能看到文件搜索、持久终端、Skill、计划模式、目标、后台任务、子 Agent、工作流、MCP、网页搜索、LSP、会话检索和工具结果裁剪等模块。子 Agent 还区分 spawn 与 fork：前者创建新上下文，后者继承父会话历史；后台子 Agent 可以继续接收消息。

这些工具没有各自重复处理审批、超时和展示。一次 Tool Call 会经过统一流水线：执行前拦截、guard、approval、工具主体、执行后处理、结果归一化、日志和 UI presenter。文件工具与 Shell 工具可以复用同一套策略，Web 端再把结果渲染成 Diff、终端或普通卡片。

Code Mode 又把工具调用改成另一种形态。模型看到的主要入口变为 `run_code` 和一份生成的 TypeScript SDK，可以在一段程序里做条件判断、循环和多次工具调用。内部子调用仍然经过原有 Policy 与 Session Log。它能减少模型和工具之间的往返，也能避免把每个中间结果都重新塞进上下文。当前已发布后端是 worker thread，官方文档明确提醒：这描述的是运行方式，不是强安全隔离。

它的会话模型也更偏平台工程。会话是只追加的事件日志，模型看到的历史由日志投影得到；原始流式 chunk 会保留，用于精确回放和 UI 渲染。fork、恢复、遥测和持久化都建立在同一条事件流上。默认使用 JSONL 保存会话，也预留了 SQLite 检索和其他存储实现。

简单说，Pi 先把“一个开发者如何高效地和 Agent 对话”打磨好；dsh 还要回答“多个界面、多个 Agent 和多种后端怎样共享一套运行时”。

## 实测：软件模块化，不等于模型行为模块化

架构图上的差别，最后会落到账单和上下文里。在我的这组实测中，DSH 的 token 消耗大致处于 Pi 的 3 倍量级。两个模型的方向一致，幅度并不相同。以 Pi 的消耗为 `1×`：

| 模型 | DSH / Pi token | DSH / Pi cost |
|---|---:|---:|
| DeepSeek V4 Pro | `5.3×` | `3.8×` |
| Grok 4.6 | `2.7×` | `2.4×` |

这组数据还不足以外推到所有任务。样本只覆盖这次测试环境，准确倍率会受任务长度、缓存命中、模型计价、失败重试和完成质量影响。但两种模型都出现同方向差距，已经足以提醒我们：Harness 的能力面需要付出成本。

这次测试里，DSH 会话向模型暴露了 25 个 tool，Pi 则是默认的 4 个。额外的 21 项同时带来描述和参数 schema；相关插件还可能贡献 system prompt、Skill 目录、上下文片段与结果呈现规则。它们会占用输入 token，也会扩大模型每一步的选择面。

Loop Policy 不一定直接写进 prompt，却会改变哪些调用被允许、结果怎样回填、什么时候停止以及下一轮看到什么。于是，一个插件在代码层面可以与其他插件松耦合，它对模型轨迹的影响却很难隔离。加一个工具、改一段描述，甚至修复一处看似局部的 bug，都可能改变前几步选择，再被后续轮次逐步放大。

这也是插件式 Agent 最难的地方。传统软件可以给模块写单元测试，接口不变时，调用方通常不必关心内部实现。模型不是确定性调用方。同一组 schema、提示词和历史共同塑造下一步概率分布，接口兼容不代表行为兼容。

以当前模型能力，我更愿意把 Agent 当成一台精密仪器：工具少一些，提示词短一些，默认路径稳定一些。DSH 的模块化适合搭平台，但每增加一项默认能力，都应该用固定任务重新测成功率、token、成本和轨迹，而不能只验证插件能否加载。

软件模块化，不等于模型行为模块化。这条路还很长。

## 扩展体验：写一个脚本，还是设计一块系统组件

给 Pi 写扩展，入口通常是一个 TypeScript 文件。扩展可以注册工具和命令，监听生命周期事件，拦截工具调用，定制压缩逻辑，保存会话状态，也能直接绘制 TUI 组件。文件放进 `.pi/extensions/` 后运行 `/reload`，就能重新加载。

Skill、Prompt、Theme 和 Extension 还可以打成 Pi Package，通过 npm、Git 或本地路径安装。这个模型对个人开发者很友好：先写几十行代码解决自己的问题，稳定后再整理成 package。

dsh 插件的表达能力更系统。开发者需要先理解 Cordis 的 Context、Service、Event、Effect 和 Fiber，再决定一个能力由哪个 service definition 声明、谁提供实现、哪些 consumer 使用它。要改变整套应用，还要理解 profile、bundle、配置树和 patch 的覆盖顺序。

回报是更强的组合能力。文件系统和进程执行可以一起切到远程沙箱；Web UI、headless runner 或未来的其他界面可以复用同一个 Agent 服务；插件也可以通过事件在不修改 Agent Loop 的前提下拦截请求、工具和轮次。

E2B POC 则说明了 Capability Seam 的另一层价值：换掉 `ctx.fs` 与 `ctx.subprocess`，现有 Bash、PTY 和 LSP 就能把可变操作放进同一个远程 Linux 沙箱，不需要维护三套 E2B 专用实现。Harness 进程、模型请求、Agent、Session 和持久化仍留在宿主侧；当前 POC 也没有承诺网络能力一起迁移。

代价同样具体。dsh 的 patch 会整体替换目标条目的 `config`，覆盖时必须重述要保留的字段。再加上 developer preview 阶段明确允许破坏兼容性的改动，现在基于它开发产品，需要为升级留出测试时间。

## 安全哲学：这是两者最实际的分界

DeepSeek Harness 把权限做成运行时的一等能力。默认 profile 使用 `workspace-write` 沙箱，并对越界或高风险操作发起一次性审批；还提供 `read-only` 和 `danger-full-access` 预设。审批决定和权限变化都会写进会话日志，恢复会话时沿用原来的权限状态。

Pi 的文档则明确说明：它没有内置沙箱，也没有默认权限弹窗。`bash`、`write` 和扩展代码都以启动 Pi 的用户权限运行。项目 trust 只决定是否加载项目里的 `.pi` 配置与扩展，并不限制模型之后能通过工具做什么。

Pi 建议在不可信仓库、无人值守任务或高风险场景里使用 Docker、VM、Gondolin 微虚拟机或 OpenShell。这个选择很坦率，也很适合已经有成熟开发容器的用户。对刚接触 coding agent 的人来说，dsh 的默认边界更省心。

## 实际使用：谁更快进入工作状态

Pi 的上手路径很短：

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
cd /path/to/project
pi
```

进入界面后运行 `/login` 即可配置模型。Pi 直接工作在当前目录，不需要先创建 workspace。常用动作都有键盘入口，终端用户几乎不用改变习惯。默认能力少也有一个好处：模型的工具选择简单，行为比较容易预期。

dsh 的最短路径是：

```bash
npx @deepseek-ai/dsh web
```

命令会启动本地 Web 服务，默认地址是 `http://127.0.0.1:3080`。第一次进入后，需要在设置里配置模型，再添加并选择工作区。此后模型配置、会话、计划、工具执行和审批都在浏览器里完成。

如果团队成员不习惯终端，或者任务需要频繁查看子 Agent、审批记录和长会话，Web 界面更容易理解。headless profile 也能执行一次性任务并把最终结果写到 stdout，适合脚本和自动化。

但 dsh 现在还没有到“装完就不再关心底层”的成熟阶段。它刚公开发行，版本仍是 RC，官方也明确提示会有不兼容改动。仓库已有 12,000 多次提交和非常细的架构文档，工程积累并不少；真正待观察的是 Plugin Contract、分发链路和动态组合的隔离语义能否稳定。anionex 的文章基于 8 月 13 日的一个具体 commit，仓库随后已从文中的 internal testing 状态进入公开 developer preview，因此本文仍以当前 README 和源码为准。

Pi 的版本、文档和日常交互更成熟。它也有自己的粗糙处，例如安全边界需要用户自行负责，第三方扩展拥有完整进程权限；如果团队想统一审批、沙箱和多 Agent 编排，每个人各写一套 Extension 很快会变成新的维护负担。

## 前景：为什么我会多看 DSH 一眼

如果只谈远期想象力，我会把更多注意力放在 DSH 的运行时自扩展上。动态 Cordis 目前仍是实验能力，但检查接口、定义 Package、审批运行、诊断和版本切换已经形成了一条完整链路。

Pi 已经证明了另一件事：一个足够薄的 harness 也能形成很强的外溢影响。OpenClaw 的官方 README 专门致谢 Mario Zechner 和 Pi，代码也直接依赖 `pi-tui`。这能说明 Pi 的组件和设计影响了大型 Agent 项目，但还不足以把 OpenClaw 简化成“Pi 的衍生项目”，更不能用某个时间点的 star 增长替代架构分析。

DSH 的上限更高，风险也更集中。它要让 Plugin Contract、动态代码权限、持久化与升级迁移真正稳定下来，才能把运行时自扩展从演示变成可长期维护的能力。Pi 的赌注是“给人一套更少、更清楚的积木”；DSH 的赌注是“让积木在受控条件下重新组合，甚至临时长出新积木”。后者更难，也更值得跟踪。

## 怎么选

日常个人开发、终端操作、快速定制，选 Pi 更稳妥。它的默认界面集中，四个核心工具足以覆盖大量编码任务，Extension API 也容易开始。

如果选择 DSH，不要把完整默认能力面当成免费午餐。更稳妥的做法是从 `minimal` Preset 起步，冻结模型、Prompt 和 Tool Schema，再一次增加一个能力，用同一套任务做轨迹回归。否则代码上的可插拔，很容易变成效果上的不可预测。

团队平台、Web 交付、受控执行、多 Agent 与后台工作流，值得试 DeepSeek Harness。它已经把这些问题放进同一套组合模型里，不需要先用零散扩展拼出一个小型平台。

如果你在开发自己的 Agent 产品，选择会更微妙。只需要一个好用的模型层和 Agent Loop，可以直接使用 `pi-ai`、`pi-agent-core` 或 Pi SDK；需要替换存储、沙箱、UI、工具策略和 Agent 编排，dsh 的 service seam 与事件系统会更合适。

把它们看成竞合关系更准确。Pi 把复杂度留到用户确实需要的时候，DeepSeek Harness 则提前给复杂系统划好了模块边界。一个适合从工具开始，一个适合从平台开始。

至于同一个模型在两边“谁更聪明”，仅看仓库没有答案。系统提示词、工具 schema、上下文压缩和任务环境都会改变结果。要比较这一点，应该固定模型、代码库和任务做成套评测，单次主观对话说明不了问题。

## 参考资料

-   • DeepSeek Harness 仓库与运行说明\[2\]
-   • DeepSeek Harness 架构文档\[3\]
-   • dsh 对 pi-ai 的适配说明\[4\]
-   • Pi Coding Agent README 与设计哲学\[5\]
-   • Pi 安全模型说明\[6\]
-   • Mario Zechner：What I learned building an opinionated and minimal coding agent\[7\]
-   • DeepSeek Harness Tool Schema Catalog\[8\]
-   • OpenClaw README\[9\]
-   • DeepSeek Harness 架构解析：从 Coding Agent 到 Agent OS\[1\]

#### 引用链接

`[1]` anionex 的架构分析: *https://blog.anionex.me/archives/deepseek-harness-agent-os*  
`[2]` DeepSeek Harness 仓库与运行说明: *https://github.com/deepseek-ai/deepseek-harness*  
`[3]` DeepSeek Harness 架构文档: *https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.zh.md*  
`[4]` dsh 对 pi-ai 的适配说明: *https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/llm/llm-pi-ai/README.zh.md*  
`[5]` Pi Coding Agent README 与设计哲学: *https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md*  
`[6]` Pi 安全模型说明: *https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/security.md*  
`[7]` Mario Zechner：What I learned building an opinionated and minimal coding agent: *https://mariozechner.at/posts/2025-11-30-pi-coding-agent/*  
`[8]` DeepSeek Harness Tool Schema Catalog: *https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/tool-catalog.md*  
`[9]` OpenClaw README: *https://github.com/openclaw/openclaw#readme*
