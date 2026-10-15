---
title: "Meta 开放 8160 亿参数模型：700GB 显存，商用有门槛"
description: "Meta 发布 Muse Spark Open，规格包括 8160 亿总参数、420 亿激活参数与百万 Token 上下文。本文介绍模型能力、显存要求、官方评测和 Muse 许可条款，拆解开放权重与部署成本、商业使用之间的区别。"
slug: "muse-spark-open-weights"
publishedAtCST: "2026-10-16T07:42:34+08:00"
language: zh
author: JimLiu
categories: [models, devtools, business]
cover: "/article-covers/muse-spark-open-weights.webp"
draft: false
wechatMediaId: "qwac_8j4kaaga6WV5YUa-ULtcwIJ6z2LsTDx5uQNdM20xDRM2bd8-TMNNgQ6vBkL"
---

Meta 交出了 Muse Spark Open 的模型权重。

官方公告的发布日期是 2026 年 10 月 15 日。这款模型的总参数达到 8160 亿，定位是编程、多步推理和 Agent 工作流，输入覆盖文字、图像、视频与音频。[Meta 公告](https://research.meta.ai/blog/muse-spark-open)

“开放权重”给开发者带来下载、自托管和定制模型的入口。模型的部署门槛与商业条款，构成另一半新闻。

NVFP4 版本的官方最低显存要求是 700GB。Muse 许可证包含署名义务、用途限制，以及特定模型服务业务的额外协议要求。

模型文件的获得，算力的拥有，商业使用的许可，是三个问题。

## 8160 亿参数，420 亿参与单个 Token 计算

Muse Spark Open 采用稀疏混合专家架构，英文缩写是 MoE。其总参数是 816B，单个 Token 的激活参数是 42B。两者对应中文数字 8160 亿与 420 亿。

模型拥有 256 个专家，每个 Token 的路由选择其中 8 个。专家选择减少了单个 Token 的计算规模，完整模型权重的装载占用存储与显存。Meta 开发者文档给出了这项区别。[架构与部署文档](https://dev.meta.ai/docs/muse-spark-open)

一个通俗的类比是图书馆：一次查阅涉及几排书架，整座图书馆占据的空间取决于全部藏书。这个类比解释计算与存储的区别，省略了真实推理系统的分片、通信与缓存细节。

官方规格中的上下文窗口是百万 Token；开发者文档列出的精确上限是 1,048,576 Token。Token 是模型处理内容的单位，区别于汉字数和页数。

输入支持四种模态，输出是文字。视频理解和音频理解属于输入能力，视频生成与语音生成属于另一类能力。

编程任务需要处理源码、日志、界面截图和操作说明。多模态输入给这些材料提供了共同入口，输出代码的正确性需要编译、测试和人工审查。

## 700GB 显存，究竟是什么门槛

Meta 提供 BF16 与 NVFP4 两种权重版本。开发者文档列出的权重体积是：BF16 约 1.65TB，NVFP4 约 537GB。

权重文件的大小，区别于运行中的显存需求。KV Cache、激活值和推理框架占用额外空间。模型卡给出的最低显存要求是 NVFP4 700GB、BF16 2TB。[官方模型卡](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B)

![Muse Spark Open 的参数规模与显存要求；本文依据 Meta 模型卡及开发者文档整理](/article-images/muse-spark-open-weights/memory.webp)

这些数字描述的是部署预算的起点。并发会话、上下文长度、推理精度和运行框架影响实际配置；一份下载清单缺少推理服务的完整成本信息。

Meta 的桌面方案使用两台 M5 Ultra Mac Studio，每台配置 512GB 统一内存，运行框架是 MLX。官方公告展示了编程与视频编辑工作流，缺少这套桌面配置的完整速度、并发和成本对照。

“两台桌面电脑运行模型”是一项特定硬件配置的展示。普通个人电脑的配置，缺少承接这项结论的依据。统一内存、GPU 显存与模型文件体积的数字，具有不同含义。

团队的部署比较需要同一组任务：相同代码仓库、相同完成标准、相同并发量，以及一次任务的实际耗时。硬件价格、维护成本与失败重试构成自托管与 API 的成本对照内容。

## 它擅长什么，评测说了多少

Meta 的定位是长流程任务：模型规划步骤、调用工具、处理失败、修改代码，完成跨文件的软件工程工作。

NVIDIA 的技术介绍描述了这类任务与单次补全的差异：一个函数的生成具有局部上下文，一次多文件重构涉及代码导航、测试反馈和任务恢复。该介绍属于发布合作方材料，性能描述保留厂商归属。[NVIDIA 技术介绍](https://developer.nvidia.com/blog/scale-agentic-coding-workflows-with-metas-muse-spark-open-on-nvidia-gb300-nvl72/)

Meta 模型卡的对照表给出了优势与落差。

MCP-Atlas 一项，Muse Spark Open 的成绩是 89.2；表中的 Qwen3.8 是 84.5，GLM 5.3 是 84.2。Terminal-Bench 2.1 一项，Muse Spark Open 是 76.4，GLM 5.3 是 83.9，Kimi K3 是 85.0。

前一项关注工具使用，后一项涉及终端环境中的任务执行。同一张表里的结果支持能力差异，缺少“所有编程任务第一”的结论。

这组成绩来自 Meta 公布的评测表，Muse 使用 xhigh 推理设置。表中的终端测试采用 Terminus 2 Agent；其他测试具有对应的工具或执行框架。它们构成厂商披露的横向比较，区别于本文完成的独立复现。

一个团队关心的结果，是自己的 Bug 修复成功率、回归测试结果、代码审查负担和单次任务成本。榜单帮助筛选候选模型，仓库测试决定接入选择。

## 商用许可：一条 2000 万美元的分界

Muse Model License 授予使用、修改、微调、蒸馏和分发等权利。许可正文要求保留版权声明、许可证与使用政策，并展示指定署名。

署名文字是 **Built with Muse Spark Open**。展示位置包括产品界面、配套文档、网站或设置菜单。条款中的衍生模型定义包含使用模型输出进行训练或改进的模型。

第 3 条关注 Model as a Service，即模型服务业务。触发判断包含两项条件：业务是第三方模型访问与输出的 API 或类似服务；许可使用者与关联方的合计总营收超过 2000 万美元，统计期是任意连续 12 个月。

条款要求这类业务通知 Meta，并签署另一份书面协议。营收口径是公司与关联方的合计总营收，区别于这个模型产生的收入。

![Muse 许可第3条的适用范围与例外；本文整理，实际业务需审阅完整条款](/article-images/muse-spark-open-weights/license.webp)

第 3 条的例外包含内部使用、研究、模型服务以外的商业活动，以及自身非模型服务产品的功能组件。其余署名义务和使用政策具有另外的适用要求。

例如，企业内部代码助手与第三方模型 API 平台具有不同的业务性质；一个带 AI 功能的产品，与一个出售模型访问的服务，需要对应的条款判断。产品名称缺少决定业务分类的效力，服务内容与合同关系是审查对象。

使用政策涉及违法活动、侵权、恶意代码、具有伤亡风险的军事等活动，以及未经授权或缺少执照的专业服务。年龄相关文字包含未成年人部署的风险评估要求，绝对禁用的概括丢失了模型卡的语境。

这些是许可文本的摘要，商业上线需要完整条款与具体业务的合规审查。[Muse 许可与使用政策](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B#license)

## 开放的是模型控制权，接手的是运行责任

开放权重给企业增加了选择：数据处理边界、推理配置、版本固定和模型定制进入自身控制范围。

控制权带来运维、安全与验证工作。模型读取私有仓库、执行终端命令和接触生产数据，需要工具权限、日志与危险操作确认机制。

Meta 模型卡提醒，量化与下游修改存在质量和安全行为变化，发布检查点的测试结果缺少覆盖所有下游配置的保证。Agent 的执行能力与部署系统的安全性，是不同层次的验收对象。

一项合适的试点，是一个隔离仓库、一组历史问题和固定的测试环境。验收记录包含修改结果、测试覆盖、人工修正与总成本。这是本文的工程建议，区别于 Meta 的能力承诺。

Muse Spark Open 的价值，是一个大规模多模态 Agent 模型的权重交付。它的采用需要任务效果、硬件预算与许可审查的验收。

下载入口解决文件获取。上线决定需要另一份验收报告。

## 参考资料

1. [Meta：Muse Spark Open 发布公告](https://research.meta.ai/blog/muse-spark-open)
2. [Meta：架构、权重与部署文档](https://dev.meta.ai/docs/muse-spark-open)
3. [Meta：模型卡、评测与 Muse 许可证](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B)
4. [NVIDIA：Muse Spark Open 的 Agent 编程与部署介绍](https://developer.nvidia.com/blog/scale-agentic-coding-workflows-with-metas-muse-spark-open-on-nvidia-gb300-nvl72/)
5. [选题线索：原始推文](https://x.com/dotey/status/2110787582808441277)
