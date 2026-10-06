---
title: "Agent 的新瓶颈：Git、SSD、内存和网络"
description: "两条讨论聚焦 Agent 基础设施。话题包括工具调用、工作区、内存与截图传输。本文核对 Git 文档、LayerFS 项目和 Sema 论文，区分工程经历与速度预测。"
slug: "agent-os-git-ssd-network-bottlenecks"
publishedAtCST: "2026-10-07T06:48:00+08:00"
language: zh
author: JimLiu
categories: [devtools, research]
cover: "/article-covers/agent-os-git-ssd-network-bottlenecks.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-Z741ADdcbl_D3lQe5htEJcyiBLAUvdfpHc_fFLNynrJ"
draft: false
---

模型提速，Agent 提速吗？[徐一帆的一条讨论](https://x.com/yifanxu_ephai/status/2107104655490912678)把问题转向机器本身：CPU、内存、SSD、网络，以及一个不起眼的 `git add`。[李博杰的回复](https://x.com/bojie_li/status/2107469512476098813)补上生产环境的细节：工作区占满硬盘，并行任务压住内存，截图上传吃掉等待时间。

这两条帖子提出一项工程问题：Agent 是一条执行链。模型、工具、文件系统和网络决定任务耗时。这组示例固定其他环节的耗时，推理时间缩短抬高了工具耗时占比。GPU 的资源需求属于另一项问题。

## 一个 `git add`，暴露延迟账本

徐一帆给出一组例子：一次模型推理耗时 10 秒，`git add` 耗时 3 秒。单轮合计 13 秒，Git 操作占约 23%。他的设想把模型推理压到 0.5 秒，Git 操作保持 3 秒。单轮合计变成 3.5 秒，Git 操作占约 86%。

![模型推理速度假设与 Git 操作的单轮耗时占比；数字取自徐一帆的示例](/article-images/agent-os-git-ssd-network-bottlenecks/latency-budget.webp)

这个计算属于示例。通用 benchmark 需要统一的仓库和硬件条件。0.5 秒推理属于速度假设；`git add` 的耗时取决于仓库规模、文件数量、磁盘状态和索引配置。**单轮耗时 = 推理时间 + 工具执行时间 + 环境等待时间。** 模型提速改变其中一项。

李博杰提供另一组工程经历。他称团队的核心 Agent 系统采用 Go。团队的 Python 实时语音方案面临单核并发与实时性问题。该案例描述特定架构；其他 Python 语音系统的并发能力需要独立测试。他称多个子 Agent 的任务造成内存压力，服务器出现 SSH 连接失败。帖子给出工程经历；可复查的压测数据缺席。

## Worktree 把“并行”变成硬盘问题

多 Agent 开发要求隔离工作区。[Git 官方文档](https://git-scm.com/docs/git-worktree)说明，linked worktree 允许同一仓库拥有多个工作树。它们共享仓库管理数据；每个工作树保留独立目录。项目源码、构建产物和依赖缓存产生磁盘成本。

李博杰称，开发机的单个 worktree 占用数 GB，子 Agent 遗留的工作区填满 3 TB SSD。这组数字属于他的项目；Git worktree 的开销取决于工作目录内容。工作区生命周期带来一个问题：谁负责判断保留期限、清理对象和可恢复范围？

[LayerFS 项目](https://github.com/Ephemeral-AI-Lab/layerfs)提供一种实验方向：共享基础内容，使用内容寻址与写时复制记录增量，给每个 Agent 分配隔离工作区。项目仓库把 0.1.6 标为 Developer Preview。其存储缺少断电持久性保证，仓库要求重要数据保留独立副本。项目呈现一种解决思路；企业级落地需要更多验证。

![并行 Agent 的资源生命周期：创建、运行、提交、回收；工作区管理包含文件、进程与配额](/article-images/agent-os-git-ssd-network-bottlenecks/workspace-lifecycle.webp)

## 截图传输占据另一段等待时间

Computer Use 的循环包含截图采集、上传、模型判断和动作执行。李博杰称，部分客户的截图上传耗时超过模型推理耗时。这项描述来自他的客户经历。[他参与的 Sema 论文](https://arxiv.org/abs/2604.20940)提供一组实验数据：受限上行链路的视觉流程，截图上传占端到端动作延迟的比例超过 60%。

Sema 的视觉表征包含可访问性树或 OCR 文本，以及压缩视觉 Token。论文的模拟 WAN 实验报告截图上行带宽缩减 130 至 210 倍，任务准确率与原始传输的差距小于等于 0.7 个百分点。这是作者实验条件下的结果；带宽压缩倍数与客户网络的延迟改善倍数属于不同指标。

![Computer Use 的执行链：截图、网络、模型、动作；网络成本与推理成本的占比比较](/article-images/agent-os-git-ssd-network-bottlenecks/computer-use-path.webp)

## “Agent 操作系统”需要哪些能力

李博杰提出三个方向：低延迟任务管理、Agent 与用户的 UI 隔离、软件自我修改。他的工程经历指向资源调度与工作区回收。Agent 运行平台需要任务队列、CPU 与内存配额、工作区生命周期、可取消的工具调用，以及人机并行操作的权限边界。这里的“操作系统”指一组运行时能力；替代 Windows 或 Linux 的新内核属于另一项命题。

原帖提到 OpenAI 对 Omarchy 的支持。[Omarchy 基金会公告](https://omarchy.org/news/2026/09/omacom-foundation-secures-tokens-from-leading-labs/)列出的事实是 OpenAI 提供 **15 万美元的 Token 赞助**。赞助确认合作关系；Agent 操作系统研发计划缺少对应公告。

模型速度的增长改变系统各段的相对成本。Agent 数量增加放大资源争用。Agent 工程的计分板需要四项指标：模型能力、单轮端到端延迟、每任务存储增量、失败任务的资源回收时间。

## 参考资料

- [徐一帆：CPU、RAM、SSD 与网络的瓶颈讨论](https://x.com/yifanxu_ephai/status/2107104655490912678)
- [李博杰：Agent 系统与生产环境经历](https://x.com/bojie_li/status/2107469512476098813)
- [Git 官方文档：git-worktree](https://git-scm.com/docs/git-worktree)
- [LayerFS 官方仓库](https://github.com/Ephemeral-AI-Lab/layerfs)
- [Sema 论文：Semantic Transport for Real-Time Multimodal Agents](https://arxiv.org/abs/2604.20940)
- [Omarchy 基金会：OpenAI Token 赞助](https://omarchy.org/news/2026/09/omacom-foundation-secures-tokens-from-leading-labs/)
