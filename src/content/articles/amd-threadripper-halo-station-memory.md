---
title: "AMD Halo Station：1 万亿参数背后的内存账"
description: "AMD Threadripper Halo Station 包含 96 核 CPU、四块 MI350P、576GB HBM3E 和 2TB RDIMM。产品身份是原型机，上市时间为 2027 年。‘1 万亿参数’表达容量上限；模型速度、软件成熟度与整机功耗属于另一组问题。"
slug: "amd-threadripper-halo-station-memory"
publishedAtCST: "2026-09-08T21:16:47+08:00"
language: zh
author: "JimLiu"
categories: [products]
cover: "/article-covers/amd-threadripper-halo-station-memory.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-QznH9dYVt1cMjRkw1NBnXTaxBL-Fyn3GOONP3jGOUXI"
draft: false
---
一台塔式工作站。四块数据中心加速卡。576GB HBM3E。

这套机器的名字是 Threadripper Halo Station。X 原帖给出一句判断：一台桌面机器容纳一万亿参数模型。

这个判断包含真相与省略。

硬件规格刷新塔式工作站的容量尺度。省略项包括产品状态、内存结构、功耗预算与软件完成度。

## 原型机身份与 2027 年日期

AMD 产品页写着 **Coming in 2027**。FAQ 使用 **prototype system** 一词。产品身份是原型机。产品首秀场合是 IFA 2026。

发布会展机装有两块液冷 MI350P。四卡属于规格上限。价格、整机功耗、操作系统、存储方案、网络配置和交付厂商处于待公布状态。

“发布”与“上市”代表两个节点。当前节点是产品发布。商业交付年份是 2027 年。

![AMD IFA 2026 舞台原型机](/article-images/amd-threadripper-halo-station-memory/stage.webp)

*AMD IFA 2026 舞台原型机。画面含两块液冷 Instinct 加速卡。图片来源：AMD 发布会画面、X 原帖。*

## 96 核 CPU 与四块 MI350P

处理器为 Threadripper PRO 9995WX。它拥有 96 个 Zen 5 核心、192 个线程、128 条 PCIe 5.0 通道和 350W TDP。

单张 Instinct MI350P 提供 144GB HBM3E、4TB/s 峰值带宽和 600W 最大板卡功耗。四卡规格产生三组数字：

- 576GB HBM3E
- 16TB/s HBM 峰值带宽总和
- 2400W GPU 最大板卡功耗总和

系统内存上限为 2TB DDR5 RDIMM。AMD 的总容量数字是 2.6TB。这个数字来自 576GB HBM3E 与 2TB RDIMM 的求和。

AMD 的总带宽数字是 16.4TB/s。这个数字来自 16TB/s HBM 峰值总和与 410GB/s RDIMM 带宽的求和。

数字抓人。口径决定含义。

## 1 万亿参数的权重体积

参数数量是第一项变量。每个参数的字节数决定权重体积。

一万亿参数对应三种常见体积：

- FP16 或 BF16 权重：2TB
- INT8 权重：1TB
- 4-bit 权重：500GB

四卡 HBM 容量上限为 576GB。4-bit 权重占用 500GB。理论余量是 76GB。

![一万亿参数的权重体积](/article-images/amd-threadripper-halo-station-memory/model-memory.webp)

*一万亿参数的权重体积。4-bit 口径与 576GB HBM 容量接近。*

这 76GB 的用途包括 KV Cache、运行时缓存、通信缓冲区和框架开销。

上下文长度、批量大小与并发数支配 KV Cache 容量。“权重装载”与“推理吞吐”是两项指标。

训练属于另一张表。

Hugging Face 的模型内存说明列出权重、梯度、优化器状态、激活值、临时张量与其他开销。混合精度 AdamW 训练的典型内存口径是每个参数 18 字节。激活值属于附加项。

一万亿参数的全量训练需求超过 18TB。576GB HBM 对应量化推理、PEFT 微调、模型分片实验和多代理服务。完整预训练属于机架集群任务。

## 2.6TB 是两类内存

Halo Station 的容量表包含两个池：

- GPU HBM3E：576GB，16TB/s
- CPU DDR5 RDIMM：2TB，410GB/s

HBM 带宽是 RDIMM 的 39 倍。每张 GPU 的 HBM 容量是 144GB。“16TB/s”代表四张卡的峰值带宽总和。

![HBM 与 RDIMM 两类内存](/article-images/amd-threadripper-halo-station-memory/two-memory-pools.webp)

*576GB HBM 与 2TB RDIMM。总容量是求和结果，带宽差距是 39 倍。*

关键问题是数据所在内存池。GPU 计算需要 HBM 数据。RDIMM 承担容量扩展、CPU 工作集和模型卸载空间。HBM 溢出引入数据搬运。PCIe 5.0 x16 是传输路径之一。

AMD 产品页缺少跨卡互连拓扑、地址空间一致性机制与真实模型吞吐数据。2.6TB 表达容量规模。16.4TB/s 表达两类峰值带宽之和。统一内存性能分数需要另一套测试。

## “个人超算”的功耗尺度

四张 MI350P 的最大板卡功耗总和是 2400W。Threadripper PRO 9995WX 的 TDP 是 350W。CPU 与 GPU 的额定值合计 2750W。

风扇、泵、主板、2TB RDIMM、存储和网络属于额外耗电项。整机功耗：待公布。

这套配置属于机房级供电与散热尺度。“个人”的含义接近单人或小团队专属算力。“消费级”与它属于不同类别。

## 3.4 倍内存与 DGX Station

AMD 宣称 Halo Station 拥有 DGX Station 3.4 倍的系统内存。该口径来自 2.6TB 与 748GB 的比较。算术结果成立。架构口径不同。

Halo Station 使用四块 PCIe GPU、576GB HBM 与 2TB RDIMM。NVIDIA DGX Station 使用 GB300 Grace Blackwell Ultra、252GB HBM3E 与 496GB LPDDR5X。CPU 与 GPU 之间的 NVLink-C2C 带宽为 900GB/s。NVIDIA 的 748GB 定义是一致性内存。

![AMD Halo Station 与 NVIDIA DGX Station](/article-images/amd-threadripper-halo-station-memory/amd-vs-dgx.webp)

*两款桌边 AI 超算的公开规格。体验取决于原始容量、互连、软件与功耗。*

DGX Station 的公开规格包含 1600W 整机功耗、Ubuntu、NVIDIA AI 软件栈和 OEM 合作厂商。产品页面提供订购入口。

Halo Station 公开资料的中心是容量指标。交付日期是 2027 年。性能结论等待真实模型基准。

采购结论需要六项数据：容量、互连、模型吞吐、软件生态、功耗与价格。

## “几百个 Agent”属于工作负载描述

AMD 产品页写着“运行数百个 Agent”。“几百个 Agent”属于工作负载描述。基准测试信息处于空白状态。

模型尺寸、上下文长度、并发要求、工具延迟与服务等级支配 Agent 数量。一百个小模型 Agent 与十个大型推理 Agent 代表不同负载。

CPU 核心数、系统内存容量、GPU 显存与网络接口决定并发上限。软件调度器决定利用率。单一 Agent 数量缺少比较意义。

## 桌边 AI 服务器的新形态

Threadripper Halo Station 的价值来自一种产品方向：机架级 AI 硬件进入工作站形态。

研究团队、模型开发者、工程仿真团队和敏感数据业务获得一台专属计算节点。云端承担弹性高峰与大规模训练；桌边机器承担研发、推理、实验和私有数据任务。

AMD 选择 96 核 Threadripper 与四块 MI350P。这个选择强调 PCIe 扩展、内存容量与开放软件栈。NVIDIA 选择 Grace Blackwell 超级芯片。这个选择强调一致性内存、专用互连与完整软件环境。

交付产品与模型基准决定路线胜负。

产品结论：技术信号强，采购信息不足。

“容纳一万亿参数”回答容量问题。“产品采购”需要基准测试、价格、功耗、噪音与交付信息。

---

**参考资料**

1. [X 原帖：AMD Threadripper Halo Station](https://x.com/0x0sojalsec/status/2095929349421818226)
2. [AMD Threadripper Halo Station 产品页](https://www.amd.com/en/products/workstations/amd-threadripper-halo-station.html)
3. [AMD Instinct MI350P 产品规格](https://www.amd.com/en/products/accelerators/instinct/mi350/mi350p.html)
4. [AMD Threadripper PRO 9995WX 产品规格](https://www.amd.com/en/products/processors/workstations/ryzen-threadripper/9000-wx-series/amd-ryzen-threadripper-pro-9995wx.html)
5. [NVIDIA DGX Station 产品规格](https://www.nvidia.com/en-us/products/workstations/dgx-station/)
6. [Hugging Face：GPU memory usage](https://huggingface.co/docs/transformers/model_memory_anatomy)
