---
title: "Jev开源复刻项目清单：8个GitHub仓库与四条技术路线"
description: "8个Jev开源复刻项目覆盖Logit读取、专用编码器、Qwen决策微调和扩散填空。本文整理每个仓库的GitHub链接、模型规格、核心实现、硬件要求与项目测试数据。"
slug: "jev-open-source-race"
publishedAtCST: "2026-09-21T19:40:00+08:00"
language: zh
author: JimLiu
categories: [research, devtools]
cover: "/article-covers/jev-open-source-race.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-UuiEXmbOGSJQi8TdLoSqt-usJP5wF6GmBr4JPpeYc3k"
draft: false
---

Jev 是 TypeSafe AI 的 System One 决策模型。它接收状态、问题与候选项，输出类型化结果和概率。

开源社区围绕这套接口推出八个仓库。实现路线包含 Logit 读取、专用编码器、Qwen 决策微调和扩散模型填空。

本文内容限定为仓库信息：GitHub 链接、模型规格、核心实现、运行方式与项目测试。性能数字来自各仓库 README 和测试记录，属于项目方口径。

![八个Jev开源复刻项目的四条技术路线](/article-images/jev-open-source-race/cover.webp)

## 1. SemIf：现成模型的候选 Logit

GitHub：[TheoLeeCJ/SemIf](https://github.com/TheoLeeCJ/SemIf)

SemIf 使用 Qwen3.5-4B、MiniCPM5-2B 等开放模型。推理流程读取候选 token 的 Logit，Softmax 产生选项概率。文本生成环节缺席。

仓库提供 CUDA、Apple MLX 和浏览器 WebGPU 路径。共享状态模式复用 KV Cache，多道问题共用一份 state。

RTX 3090 项目测试包含 21 个二元问题。Logit 路径中位耗时是 1.023 秒，紧凑 JSON 数组生成耗时是 5.332 秒。两条路径的答案一致项数量是 18。

项目定位是接口模式复现。Jev 的模型架构与训练配方位于复现范围之外。

## 2. Simple Jev：通用模型包装器

GitHub：[featherless-ai/simple-jev](https://github.com/featherless-ai/simple-jev)

Simple Jev 是 Hugging Face 因果语言模型的 Jev 风格包装器。项目支持 Choice、Rubric 和 Support 三类问题。

核心方案包含候选 token Logit、公共前缀复用和批量后缀计算。相同 state 的公共前缀计算次数为一次，问题后缀形成批处理。

仓库提供 FastAPI 服务、Python 客户端、Docker 配置和公开演示。默认演示参数包含 2000 token 上下文与每秒两次请求限制。

项目定义是推理基线。准确率、校准度和 Jev 性能等价性位于承诺范围之外。

## 3. Laya：英语与多语言编码器

GitHub：[NandhaKishorM/laya](https://github.com/NandhaKishorM/laya)

Laya 是非自回归决策模型。英语版本使用 ModernBERT-large，参数量是 4.21 亿；多语言版本使用 mmBERT-base，参数量是 3.22 亿。

仓库支持 Choice、Score 和 Noul。文字脚本决定英语模型与多语言模型的路由选择。多语言版本覆盖 100 多种语言，标称上下文长度是 1024。

Tesla T4 项目测试给出两个单问题延迟：英语模型 39.5 毫秒，多语言模型 32.8 毫秒。英语模型的十问题批处理耗时是 158.6 毫秒，多语言模型的耗时是 72.3 毫秒。

仓库包含微调 Notebook、语言路由器、校准脚本和类型化决策数据集评测。

## 4. Von：3.95亿参数的决策模型

GitHub：[wfzyx/von](https://github.com/wfzyx/von)

Von 使用 ModernBERT-Large，参数量是 3.95 亿，模型体积是 1.5GB。架构包含 Option Marker 与联合注意力，输出包含离散选择、概率和序数结果。

训练数据规模是 25 万条类别平衡样本。损失函数组合交叉熵与 Brier Score。温度缩放承担训练后校准。

项目方的 78 用例测试给出 93.5% 宏平均准确率和 18 毫秒本地延迟。扩大版测试包含 869 个用例，Von 的宏平均准确率是 71.5%。

仓库提供 Python API、批量问题接口、两阶段高候选数路由和 Doom 控制演示。

## 5. Verdict：1.51亿参数与WebGPU

GitHub：[Heman10x-NGU/Verdict-open-jev](https://github.com/Heman10x-NGU/Verdict-open-jev)

Verdict 使用 ModernBERT-base 与 GLiClass 分类头，参数量是 151,378,177。模型权重提供 PyTorch、ONNX 和浏览器 WebGPU 版本。

模型输入包含状态、候选描述和拒答选项。容量上限是 24 个实质候选项加一个拒答项。训练损失组合交叉熵与 Brier Score。

仓库附带完整评测报告。231 项公开任务的结果分成 Easy、Standard 和 Hard 三档。三档准确率是 87.5%、69.4% 和 36.9%。单线程 WebAssembly 的 K=5 延迟中位数是 35.58 毫秒。

测试项目包含候选顺序、难负例、拒答泛化、数据污染和 FP16 一致性。

## 6. Kev：Qwen3.5决策模型家族

GitHub：[jaredpalmer/kev](https://github.com/jaredpalmer/kev)

Kev 包含 8 亿、40 亿和 90 亿参数三个版本，基础模型来自 Qwen3.5。训练组件包含 LoRA 与指针式候选读出头。

仓库提供训练代码、评测数据、模型卡、Hugging Face 权重、CUDA 服务和 Apple Silicon 服务。API 形状兼容 TypeSafe System One SDK。

三个版本的新来源测试集准确率是 66.8%、83.2% 和 83.7%。90 亿参数版本的新来源 Brier Score 是 0.243。项目建议的起始版本是 Kev-4B。

仓库测试覆盖共享状态复用、候选顺序、长上下文、日期运算和高置信错误。

## 7. Nimble：对比数据训练方案

GitHub：[bespokelabsai/nimble](https://github.com/bespokelabsai/nimble)

Nimble 使用 Qwen3.5-9B 与 LoRA。训练方法称为 Contrastive Data Curation。每组样本包含事实相近的两个版本，一处事实变化触发正确标签变化。

训练集含 2676 条样本，类别数量是 10。留出集含 324 条样本。参考标签来自合成流程，人工复核缺席。

项目测试结果是 Nimble 90.12%、基础 Qwen3.5-9B 66.36%、Jev 1.13.0 93.21%。H100 测试的 Nimble 中位延迟是 106 毫秒，M5 Pro 测试的中位延迟是 444 毫秒。

仓库包含数据生成流程、数据校验器、训练脚本、推理服务和评测工具。

## 8. OpenJev：DiffusionGemma扩散填空

GitHub：[razorback16/openjev](https://github.com/razorback16/openjev)

OpenJev 使用 DiffusionGemma-26B-A4B-it-NVFP4。答案位置是待填空白，离散扩散负责整块 token 画布的去噪。

CUDA 路径使用 vLLM，显存需求是 24GB；Apple Silicon 路径使用 MLX，空闲内存需求是 16GB。模型权重体积是 18GB。

RTX PRO 6000 项目测试的请求规格是三个问题。单并发中位延迟是 94 毫秒；64 并发中位延迟是 760 毫秒，P95 是 1109 毫秒。

置信度计算采用归一化熵。可选不确定性检查使用新噪声，重复读取上限是四次。仓库提供 OpenAI 风格文本接口、工具调用和流式输出。

## 仓库索引

- [SemIf](https://github.com/TheoLeeCJ/SemIf)：Qwen 与 MiniCPM 的候选 Logit。
- [Simple Jev](https://github.com/featherless-ai/simple-jev)：通用 Hugging Face 模型包装器。
- [Laya](https://github.com/NandhaKishorM/laya)：英语与多语言专用编码器。
- [Von](https://github.com/wfzyx/von)：ModernBERT-Large 决策模型。
- [Verdict](https://github.com/Heman10x-NGU/Verdict-open-jev)：151M 编码器与 WebGPU。
- [Kev](https://github.com/jaredpalmer/kev)：Qwen3.5 决策模型家族。
- [Nimble](https://github.com/bespokelabsai/nimble)：对比数据与 Qwen3.5-9B LoRA。
- [OpenJev](https://github.com/razorback16/openjev)：DiffusionGemma 决策服务。

---

数据来源：八个 GitHub 仓库的 README、模型卡、评测报告与复现实验文件。性能数字属于项目方测试。
