---
title: "Google AX开源：Agent任务的“Kubernetes”控制平面"
description: "Google AX定义Task、Workspace和Model三类资源。Agent Substrate承担沙箱、挂起与恢复。本文拆解架构、安装方式、项目现状与安全边界。"
slug: "google-ax-agent-control-plane"
publishedAtCST: "2026-09-25T14:55:39+08:00"
language: zh
author: JimLiu
categories: [devtools, business]
cover: "/article-covers/google-ax-agent-control-plane.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-ZsFuSwgDDBVHRC7gO82NjJ1gvzKz9R-8btnDmv5noLN"
draft: false
---

微服务有固定入口，批任务有明确终点。Agent任务拥有状态、等待、模型调用、工具调用、代码执行和人工审批。传统编排系统面对一种陌生负载。

Google开源项目AX给出一套答案：开发者声明任务、工作区和模型，控制平面负责调度，Agent Substrate负责沙箱计算。

“Agent版Kubernetes”是一个方便的类比。AX采用声明式资源、控制器调和与命令行工具。两者的管理对象存在差异。Kubernetes管理服务和容器，AX管理带有目标、上下文、模型与工具的Agent任务。

![Google AX控制平面封面](/article-images/google-ax-agent-control-plane/cover.webp)

## AX的管理对象：任务

AX仓库的定位是高吞吐声明式编排器。任务获得隔离沙箱、CPU与内存配额、工作区和模型配置。命令行提供apply、get、describe、watch、delete、suspend、resume和ssh等操作。

三类核心资源构成仓库资源模型。

**Task**描述一次Agent工作。定义包括运行时、工作区、模型、资源限制和调试开关。

**Workspace**描述任务环境。定义包括Git仓库、MCP服务、Skill和目标文本。

**Model**描述模型连接。定义包括服务商、模型标识、参数与密钥引用。

![AX仓库包含Task、Workspace和Model三类资源](/article-images/google-ax-agent-control-plane/primitives.webp)

这个模型解决一个工程问题。Agent应用呈现一种混杂结构：任务定义、代码仓库、工具配置、模型密钥和执行容器进入业务代码。环境复用与任务审计面临阻力。AX资源模型拆分这些元素，控制平面承担生命周期管理。

## 两层系统：AX加Agent Substrate

AX与沙箱平台分工明确。仓库架构包含两个层次。

AX控制层接收gRPC请求。`ax-server`提供API，Redis保存任务状态与队列，`ax-controller`执行调和逻辑。控制器创建底层Actor。控制器更新任务状态。

Agent Substrate计算层提供Actor、Worker和沙箱。项目方宣称该层支持gVisor或microVM隔离、状态挂起与恢复、计算资源复用。控制层承载任务语义，Substrate承载计算载体。

![AX控制层与Agent Substrate计算层](/article-images/google-ax-agent-control-plane/architecture.webp)

这项分层来自一次重大改造。2026年9月20日发布的v0.3.0完成AX通用编排层改造。旧版内置Python Agent Harness，新版移除这层绑定。Redis取代Kubernetes CRD，成为任务状态和队列的存储。

设计文档给出改造原因。etcd适合保存集群期望状态。短生命周期任务的海量写入超过其承载边界。Redis Hash保存对象，Redis Streams和Pub/Sub承担队列与通知。`ax-server`保持无状态，控制器支持横向扩展。

9月24日提交删除Gateway资源。原因是Gateway与Agent Substrate职责重叠。README列出Task、Workspace和Model三类资源。

## Workspace：Agent环境的声明文件

Workspace是AX的核心设计。

普通容器镜像覆盖依赖封装。Agent的代码来源、MCP工具、Skill和任务目标缺少统一描述。AX Workspace容纳这些要素。`ax-task-runner`是沙箱PID 1，职责包括代码仓库克隆、Skill铺设、元数据服务启动和访客服务启动。

AX提供目标驱动的Workspace引导。开发者提交目标文本，Antigravity负责环境生成。该功能要求Gemini API密钥，文档给出的超时值是10分钟。

这类环境生成的代价包括攻击面扩大。调试开关开放进程执行和文件访问能力，文档的缺省值为关闭。Git来源、分支、MCP服务和Skill属于供应链边界。

## 十亿任务：项目目标与公开证据

AX官网写着“每个集群十亿级任务”，Agent Substrate仓库写着“数百万沙箱”和“500毫秒以下恢复”。这些数字来自项目方陈述或演示，缺少第三方生产基准。

仓库暴露一个文档同步问题。AX官网保留四类原语，其中包括Gateway；代码删除Gateway。官网描述空闲检测与挂起，仓库路线图中的规划项包含空闲检测。

![AX仓库现状、网站表述与路线图的证据区别](/article-images/google-ax-agent-control-plane/status.webp)

Google Cloud五月发布的介绍文章描述了旧版AX能力，包括事件日志、快照、断线补发和轨迹分支。仓库经历九月重构。三份材料对应三份各有差异的能力清单。

可靠判断包含三种标签：代码存在、文档宣称、路线图规划。AX路线图容纳空闲检测、任务分支、权限收敛、预算和审批策略。发布能力清单排除这些条目。

## 安全与成熟度：预览项目的真实边界

AX采用Apache 2.0许可证。仓库获得一万多颗GitHub星标，仓库版本号为v0.3.0。README给出醒目警告：核心概念、协议和规范处于演化期，稳定版本前会有重大破坏性改动。

公开Issue报告了若干关键缺口：`ax-server`缺少认证与授权；Workspace中的Git地址和分支存在命令注入风险报告；Model文档展示Anthropic配置，相关Issue称代码实现Google服务商。资源限制和控制器并发存在开放报告。

这些Issue属于风险信号，AX的生产成熟度处于验证期。部署清单包括API鉴权、网络隔离、来源白名单、密钥边界和审计日志。公网暴露控制面属于高风险配置。

## 谁该关注AX

平台工程团队值得关注AX。此类团队拥有Kubernetes、内部Agent任务、沙箱需求和模型密钥管理需求。AX提供一份有价值的控制平面样本。

单体Agent应用适合轻量方案。AX依赖Kubernetes、Agent Substrate、Redis、镜像仓库、Go、kubectl和ko。基础设施成本高于普通队列加容器任务。

研究团队能从AX获得一个清晰问题定义：Agent基础设施超出模型API封装范畴。任务状态、工作区、身份、预算、审批、调试、恢复和轨迹各自拥有独立设计要求。

AX的核心贡献是一条架构边界，而非完成品。Agent框架负责思考与工具调用，AX负责任务语义和生命周期，Agent Substrate负责隔离计算。三层解耦给大规模Agent系统提供了工程坐标。

AX的方向清晰，接口和能力处在变化期。生产团队适合阅读设计、搭建测试集群、验证自家任务。正式业务部署取决于安全模型、版本稳定性和规模数据。

---

## 参考资料

1. Google, [google/ax GitHub仓库](https://github.com/google/ax)
2. Google Cloud, [Agent Executor: Google’s distributed agent runtime](https://cloud.google.com/blog/products/ai-machine-learning/agent-executor-googles-distributed-agent-runtime)
3. AX, [项目官网](https://agentexecutor.io/)
4. Google, [AX设计文档](https://github.com/google/ax/blob/main/DESIGN.md)
5. Google, [AX路线图](https://github.com/google/ax/blob/main/docs/roadmap.md)
6. Agent Substrate, [项目仓库](https://github.com/agent-substrate/substrate)
