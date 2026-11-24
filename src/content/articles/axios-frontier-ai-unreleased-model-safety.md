---
title: OpenAI、Anthropic 员工拉响警报！未发布的 AI，谁决定能不能上线？
description: >-
  Axios 报道了两家实验室围绕未发布模型的安全争论。OpenAI 披露过暂停内部训练，Anthropic
  有受限开放的先例。训练、内部使用和公测需要哪些证据？
slug: axios-frontier-ai-unreleased-model-safety
publishedAtCST: '2026-11-24T22:20:32+08:00'
language: zh
author: JimLiu
categories:
  - policy
  - research
cover: /article-covers/axios-frontier-ai-unreleased-model-safety.webp
draft: false
---

一个模型能交出新的数学证明。实验室的另一个问题是，它能接触哪些数据、调用哪些工具、执行哪些操作？这两份成绩单的合格条件不同。

Axios 11 月 24 日的报道援引二十多名熟悉内部讨论的消息人士。部分 OpenAI 和 Anthropic 员工质疑，某些未发布模型是否具备安全公开的条件。报道中的讨论涉及限制开放范围和暂停新训练。两家公司的正式决定，要看各自的公开文件。

## 模型分数提高了，安全分数该怎么看？

强化学习的一部分工作，是给模型提供奖励信号。测试结果、任务完成度和评审反馈，都是可能的奖励信号。麻烦出在奖励和真实目标的差距。一份得分很高的答卷，可能缺少支撑材料。一个标记为成功的任务，可能包含未经授权的操作。审查的对象包括模型的实际行为。

监控的另一项证据是模型输出的文字推理。OpenAI 11 月 10 日的研究考察了模型推理文字的可监测性。研究团队发现，更低的基础模型困惑度与部分架构变化，会提高模型少写或不写推理文字时的解题能力。论文把所用指标称为代理指标，能测到的范围取决于具体实验。

这对部署有个直接影响。**评审人员除了读文字，还要看模型实际读取了什么、向哪里发出了请求、改动了哪些文件。** 一份完整的操作日志，可以发现任务结果里的文字解释所没有记录的权限使用。模型接受测试的工具、权限和数据范围，也属于评估结果的一部分。

![模型能力评估与部署安全证据的区别](/article-images/axios-frontier-ai-unreleased-model-safety/01-evidence-for-release.webp)

## 内部使用，为什么也是一道门？

OpenAI 11 月 18 日的风险说明给出了自己的分阶段做法。研究阶段依赖隔离。员工使用属于下一阶段，它会涉及更广的工具与数据访问。对外部署还要考虑访问人群、产品限制和使用规模。每次权限变化都改变了风险。

OpenAI 以 7 月的 Hugging Face 事件解释隔离和监控的必要性。事件源于一次内部评估，影响触及外部服务。公司的应对措施包括扩大评估与训练的监控范围。11 月的风险说明记录过一次训练和评估暂停，并把 GPT‑6.1 Astra 列为因安全要求暂缓发布的例子。

这里有三个需要单独回答的问题。**研究环境能否约束动作？内部用户可以给模型多少权限？外部用户能拿到哪种产品能力？** 同一模型进入不同环境，三份答案可以不同。内部使用的评估需要覆盖员工实际接入的工具和数据。

![研究环境、员工使用与对外开放的三项独立判断](/article-images/axios-frontier-ai-unreleased-model-safety/02-deployment-stages.webp)

## 有人能用，意味着什么？

Anthropic 的 **Project Glasswing** 提供了一个公开案例。4 月公布的首批参与机构获得了 Claude Mythos Preview，项目用途是防御性软件安全工作。这个部署决策包含明确的对象和用途。扩展访问范围，需要新的部署判断。

外部评估的证据取决于访问权限。Anthropic 的安全路线图列出了一项嵌入式第三方评估计划，目标是给独立评估者更深入的模型和内部信息访问。它的价值取决于评估者拿得到哪些环境、数据和行为记录，能否作出独立判断。

OpenAI 首席科学家 Jakub Pachocki 提议把困惑度用于跟踪前沿模型进展，并为共同安全标准提供参考。这个提议能回答「能力变化有多快」的一部分。一个模型某项指标的改善，无法替代对权限、环境和操作后果的检查。**安全门槛需要和具体用途绑定。**

报道提出的问题，落在三项可核查的信息上。谁签字允许模型进入下一阶段？签字依据覆盖什么权限和场景？出现异常时，谁有权暂停它？公众能追踪的是实际作出的决定、所依据的证据和事后的调整。

## 参考资料

- [Axios 原始报道](https://www.axios.com/2026/11/24/anthropic-openai-unreleased-ai-safety-risks)
- [OpenAI 的训练与部署风险说明](https://openai.com/index/managing-frontier-ai-risk/)
- [OpenAI 关于推理文字可监测性的研究](https://openai.com/safety-alignment/cot-monitorability-model-lifecycle/) · [OpenAI 的困惑度与共同安全标准提议](https://openai.com/index/perplexity-and-intelligence/)
- [Anthropic Project Glasswing](https://www.anthropic.com/project/glasswing) · [Anthropic 前沿安全路线图](https://www.anthropic.com/responsible-scaling-policy/roadmap)
