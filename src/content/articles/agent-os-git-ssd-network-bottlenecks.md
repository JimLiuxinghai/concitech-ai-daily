---
title: "Agent 的新瓶颈：Git、SSD、内存和网络"
description: "Agent 任务包含模型推理、Git 操作、工作区创建、进程运行和网络传输。模型提速改变各环节的耗时比例；并发任务增加 SSD 与内存压力。本文拆解延迟账本、工作区成本、资源配额和截图上行瓶颈。"
slug: "agent-os-git-ssd-network-bottlenecks"
publishedAtCST: "2026-10-07T07:54:00+08:00"
language: zh
author: JimLiu
categories: [devtools, research]
cover: "/article-covers/agent-os-git-ssd-network-bottlenecks.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-VVtY6rTQXl0zzrNRVdNrZxepUrnV9S96rlphyhSG0Rw"
draft: false
---

模型吞吐量上升，Agent 任务耗时的结构发生变化。一次代码任务包含推理、工具调用、文件读写、测试和结果提交。一次 Computer Use 任务包含截图、上行传输、模型判断与动作执行。任务的完成时间属于整条执行链。

工程预算需要两个账本：单任务的端到端延迟，以及并发任务的资源峰值。前者回答“用户等多久”，后者回答“机器能承载多少任务”。Git、SSD、内存和网络对应不同成本。

## Git：模型提速改变延迟占比

单轮耗时的简化账本是：**推理时间 + 工具时间 + 环境等待时间**。工具时间包含 Git、测试、依赖安装等操作。模型速度属于其中一项变量。

一个算术示例：推理耗时 10 秒，`git add` 耗时 3 秒。两项合计 13 秒，Git 占 23%。另一组假设保留 3 秒 Git 耗时，推理耗时改为 0.5 秒。两项合计 3.5 秒，Git 占 86%。这组数字是比例演示。仓库、硬件和缓存条件缺席。基准测试结论缺少依据。

![推理时间与 Git 时间的假设计算：10 秒加 3 秒；0.5 秒加 3 秒](/article-images/agent-os-git-ssd-network-bottlenecks/latency-budget.webp)

[`git add` 的官方文档](https://git-scm.com/docs/git-add)说明，该命令把指定文件的内容放入索引。文件规模、文件数、存储状态与索引配置影响一次调用的开销。性能分析需要拆出文件枚举、内容读取和索引写入等阶段；一次命令的总耗时提供整体结果，阶段归因需要额外测量。

Agent 的多轮任务放大这个问题。每轮动作产生工具调用与校验；任何一段等待进入总账。优化目标因任务而异：代码编辑关注仓库和测试，浏览器操作关注页面加载和截图，远程环境关注队列与容器启动。

## SSD：隔离工作区有物理成本

并发代码任务需要隔离目录。[Git worktree 文档](https://git-scm.com/docs/git-worktree)说明，多个工作树共享仓库管理数据。每棵工作树拥有工作目录与独立索引。共享版本对象减轻仓库复制成本；工作文件、依赖目录、构建产物与日志构成磁盘占用。依赖与缓存的共享程度取决于项目配置。

工作区的成本有三部分：基础文件、任务写入增量和遗留数据。任务结束后的目录、容器层、测试产物和日志形成长尾。创建速度、单任务磁盘增量、磁盘峰值、回收时间与失败回收率构成工作区指标。Git 的 `worktree prune` 处理失效管理信息；工作文件的删除与保留属于另一项操作，涉及未提交成果。

[LayerFS 仓库](https://github.com/Ephemeral-AI-Lab/layerfs)展示一条研究路线：内容寻址、分块和写时复制复用基础内容，任务分支保留增量。项目的 0.1.6 版本属于 Developer Preview，仓库声明缺少断电持久性保证。它说明增量存储的设计方向，生产数据需要可靠副本。

![Agent 工作区的生命周期：创建、运行、提交和回收](/article-images/agent-os-git-ssd-network-bottlenecks/workspace-lifecycle.webp)

## 内存：并发数决定资源峰值

一个 Agent 任务占用模型客户端、工具进程、语言服务、测试进程和浏览器内存。任务副本数量增加，进程常驻内存与瞬时峰值叠加。八个任务、每个任务 1.5 GB 工作集，单项合计 12 GB；共享服务、文件缓存和峰值突发构成其他需求。这是容量计算示例，实际额度需要进程测量。

内存不足带来换页、进程终止和任务重试。重试增加 CPU 与磁盘负荷。调度器需要任务并发上限、内存配额、超限处置、进程树回收和队列背压。平均内存掩盖高峰；任务峰值与机器峰值属于两张不同报表。

## 网络：截图传输占据任务延迟

Computer Use 包含截图采集、上传、模型判断和动作执行。上行传输量与有效带宽决定纯上传时间。一个示意计算：截图 8 MB，有效上行 8 Mbps，纯上传时间为 8 秒。压缩、排队和网络往返形成额外开销。

[Sema 论文](https://arxiv.org/abs/2604.20940)报告一组受限上行链路实验：截图上传占动作端到端延迟的比例超过 60%。论文提出可访问性树或 OCR 文本与压缩视觉 Token 的组合。模拟 WAN 实验中的截图上行带宽缩减 130 至 210 倍，任务准确率与原始传输的差距小于等于 0.7 个百分点。**带宽缩减倍数与延迟改善倍数属于不同指标。**这些数据对应论文实验条件。

![Computer Use 的截图、上行网络、模型和动作执行链](/article-images/agent-os-git-ssd-network-bottlenecks/computer-use-path.webp)

## Agent 平台需要任务级计分板

模型调用耗时是一项指标。任务平台需要端到端延迟的中位数与尾部值、各工具阶段耗时、单任务磁盘增量、进程内存峰值、上行字节数和失败任务回收时间。指标对应不同优化对象。

任务队列决定并发；资源配额约束 CPU、内存和 SSD；工作区生命周期管理成果与临时数据；网络表征决定截图与语义信息的传输量。Agent 系统的性能目标是任务完成成本与可靠性，模型速度占据这张账本的一列。

## 参考资料

- [Git 官方文档：git-add](https://git-scm.com/docs/git-add)
- [Git 官方文档：git-worktree](https://git-scm.com/docs/git-worktree)
- [LayerFS 项目仓库与版本限制](https://github.com/Ephemeral-AI-Lab/layerfs)
- [Sema 论文：Semantic Transport for Real-Time Multimodal Agents](https://arxiv.org/abs/2604.20940)
