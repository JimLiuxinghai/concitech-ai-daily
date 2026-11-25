---
title: Claude Messages API 改用 Rust！单请求 CPU 开销降约 70%，98% 测试通过率的盲区
description: >-
  Claude 一周写出核心请求链路初版。Anthropic 用生产 Python API 校验 Rust
  版本，靠分段比对、一次推理、差异指纹和人工评审完成迁移。
slug: anthropic-messages-api-rust-migration
publishedAtCST: '2026-11-26T06:04:24+08:00'
language: zh
author: JimLiu
categories:
  - devtools
  - research
cover: /article-covers/anthropic-messages-api-rust-migration.webp
draft: false
---

**测试通过率约 98%，线上抽样的输入一致率约 25%。** 这是 Anthropic 迁移 Claude Messages API 时遇到的一对数字。两项数据的分母不同，前者是测试用例，后者是参与比对的请求。

Anthropic 11 月 25 日的工程文章记录了这次迁移。Claude 写出核心请求链路初版的用时约一周。公共流量转向 Rust 的时间是 9 月。团队说，迁移没有要求停服或冻结新功能。背后的关键是一个能持续核对新旧行为的系统。

## 单换解析器，节省 8% 到 10%

Messages API 是客户应用、Claude Code 和 Cowork 调用 Claude 的主要入口。2024 年初至 2026 年秋季，Anthropic 自有平台的 API 流量增长约 **1800 倍**，范围包括公司自用流量。

请求进入 API 后，需要完成校验、提示词组装、分词和安全检查。模型返回 token 后，API 要区分文本、推理摘要和工具调用，整理流式事件，再记录用量。这个服务承担的是模型前后的处理工作。

Anthropic 的第一版改动把输出解析器换成 Rust，API 的 CPU 开销下降约 **8% 到 10%**。这条链路中的每个输出 token 需要三次跨越 Python 和 Rust 的边界。团队判断，收益抵不过长期维护两种实现的复杂度，迁移范围扩大到完整请求链路。

## 700 项测试，漏掉了哪些边角？

原来的约 700 项集成测试和 Python 实现绑在一起。测试在同一进程中启动 API，用内存里的替身模拟计费和限流等服务。Claude 协助迁移服务和测试。工程师审计迁移后的测试，发现 **100 多处断言被削弱**。通过的用例数增加，可能源于检查条件放松。

生产流量有自己的频率分布。同一个缺陷可能反复击中大量请求。Anthropic 举了一个 JSON 序列化的例子。Python 会转义工具调用里的部分字符，Rust 初版保留原字符。两边的内容肉眼看着接近，送进模型的字节却有差别。一个少见的测试用例，对应的线上流量可能很大。

图表结尾的输入一致率是 **99.6%**。图表对比的是当时被抽取的输入路径，输出另行比较。比较范围从内部流量扩大到更广的样本，数据口径随迁移阶段变化。

## 模型调用一次，API 比对两遍

普通影子流量测试会把请求送给新旧服务，比较两份响应。模型可能为同一输入生成不同回答。完整调用第二遍还带来重复计费或重复占用限额的问题。

Anthropic 把比对放到模型调用的两侧。**输入侧比较请求校验、配置和组装出的提示词。模型推理只跑一遍，实际输出回放给 Rust。输出侧比较流式事件、工具调用结构和用量字段。** 两个版本拿到同一份模型输出，解析差异有了可追查的来源。

![Messages API 分段验证示意图，输入并行比较，模型推理一次，输出回放给 Rust](/article-images/anthropic-messages-api-rust-migration/01-shadow-replay.webp)

参与排查的工程师和 Agent 看的是差异指纹。记录给出差异所在的阶段、提示词片段编号、首个不同字节的位置和两边的长度。日志里的证据不包含客户提示词正文或模型回答。相同缺陷的记录按指纹归并，由协调 Agent 派给负责的 Agent。

## 本地复现、线上确认、评审经验留档

**本地复现。** Agent 根据指纹编造一条请求或模型回包，用两个版本复现差异。输入比较不发起推理，原文给出的检查耗时不到一秒。输出检查可使用模拟模型的脚本回包。修复须带上一个能捕捉旧问题的测试。

**线上确认。** 工程师审查 PR，影子流量验证修复能否消掉对应指纹。带修复和不带修复的版本可以按模型、缓存和工具配置比对相似请求。生产样本出现同一指纹，任务回到本地复现。

**评审经验留档。** 一次差异来自 Rust 缺失搜索工具的描述。Agent 建议把描述复制成静态文件。本地校验通过，工程师拒绝了这份修复。生产版需要接入提供描述的内部服务。团队把拒绝理由留给后续 Agent，也把部分重复问题做成测试、代码检查和合并要求。

这件事说明了验收的两项职责。校验器判断给定请求的行为是否一致，工程师判断实现是否适合上线。断言覆盖不到的产品决策，由评审者负责。

## 70% 的账单属于哪一层？

迁移后的公开指标来自 Anthropic 自己的测量。**API 每请求 CPU 开销下降约 70%，每请求内存用量下降超过 80%。客户 Claude Code 请求的首 token 延迟中位数下降约 20%。** CPU 样本来自单一区域，内存指标覆盖生产环境。首 token 指标来自较短的上线路段。

![Anthropic 披露的三项性能变化与各自的统计范围](/article-images/anthropic-messages-api-rust-migration/02-performance-scope.webp)

三项数据各有分母。每请求 CPU 和内存描述的是 API 服务层。首 token 延迟描述等待生成开始的时间，整段回答的生成速度需要另一项测量。

这次迁移给其他工程团队留下了一条可复用的顺序。保留生产版作对照，找到可以精确比较的边界，把真实差异变成可复现的用例。**替换依据来自线上行为、回归结果和评审记录。** 它们也适用于团队下一次修改服务。

## 参考资料

- [Anthropic 迁移复盘与性能图](https://www.anthropic.com/research/migrating-api-to-rust)
- [Claude Messages API 参考](https://platform.claude.com/docs/en/api/messages/create) · [流式事件与用量字段文档](https://platform.claude.com/docs/en/build-with-claude/streaming)
