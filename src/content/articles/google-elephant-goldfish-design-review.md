---
title: 谷歌开源「大象金鱼」！数千工程师的 AI 编程法，藏着 5 道审查关
description: Google 组织开源 EGM。大象负责需求与设计，金鱼负责新上下文审查，开发者掌握架构取舍与批准权。文章拆解五阶段审查、三个核心命令及适用边界。
slug: google-elephant-goldfish-design-review
publishedAtCST: '2026-11-01T11:48:06+08:00'
language: zh
author: JimLiu
wechatMediaId: 'qwac_8j4kaaga6WV5YUa-d5-BBiA42cKsgN1-cqii2LfSou5ysFauOg9AnPKbvyP'
categories:
  - devtools
cover: /article-covers/google-elephant-goldfish-design-review.webp
draft: false
---

AI 编程有一种熟悉的失败：需求讨论顺畅，代码生成迅速，交付结果偏离了原始目标。

问题的根源是设计。一个含糊的要求，变成一个错误假设；接口、数据结构和测试承接了这个假设，代码外壳遮住了问题。

Google 组织开源的 **Elephant-Goldfish Model，简称 EGM**，给出了一套分工：**大象负责理解与设计，金鱼负责审查，开发者掌握取舍与批准权。**

项目 README 的使用规模表述是“数千名谷歌工程师”。这是项目方的介绍。仓库采用 Apache 2.0 许可证，定位是软件设计与审查技能集合；名称中的 Model 指一种协作方法，公开内容包含技能、审查角色和文档标准。[项目仓库](https://github.com/google/elephant-goldfish-model)

它强调代码生成的前置工作：**需求需要明确，文档需要读懂，反对意见需要处理。**

## 一、大象保存背景，金鱼保留陌生感

大象是持有项目背景的主代理。需求讨论、系统架构、系统约束和方案取舍，构成它的工作材料。它的设计交付物是文档。

金鱼是新上下文中的审查代理。它拥有设计文档及引用资料，前期聊天历史属于隔离对象。源码、接口说明和被引用的文档，属于它的核对材料。

| 角色 | 掌握的材料 | 主要责任 |
| --- | --- | --- |
| 大象 | 项目背景、需求、历史决策 | 澄清问题，编写设计 |
| 金鱼 | 文档、引用资料、相关源码 | 寻找遗漏、歧义和实施风险 |
| 开发者 | 业务目标、现实约束 | 作出取舍，批准设计 |

![EGM 分工：大象编写设计文档，新上下文金鱼审查，开发者作出取舍与批准](/article-images/google-elephant-goldfish-design-review/roles-and-context.webp)

这种分工针对一种偏差：设计者知道大量背景，文档遗漏了其中的一部分。聊天伙伴记得解释，陌生读者面对空白。

设计示例是“复用现有权限系统”。旧对话参与者知道权限系统的入口，新读者需要知道具体模块、权限边界及参考资料。缺失的信息，留下了执行者的猜测空间。

**大象承担背景整合，金鱼检验文档的自足性。**

“大象”指背景整合，项目的持久记录来自文件与代码仓库，聊天窗口拥有上下文容量限制。“金鱼”的价值是对话历史隔离，审查能力取决于模型、输入材料和审查标准。[架构说明](https://github.com/google/elephant-goldfish-model/blob/403d8881d62022490637d740657b33f01e321ea8/docs/designs/architecture.md)

## 二、三个命令，连接想法与设计材料

EGM 的核心入口是三个技能。

**`egm-brainstorm`：澄清想法。**

开发者与代理讨论目标、限制和方案。项目的头脑风暴流程包含不同视角的审查，产物是概念简报 `concepts_brief.md`。

**`egm-draft`：编写设计。**

代理编写 Markdown 设计文档，输入材料是简报或项目笔记。编写过程包含分节反馈，设计需要解释目标、方案、备选路径和实施安排。高层设计与详细实施计划拥有不同的内容边界。

**`egm-review`：审查文档。**

新上下文审查者核对文档的完整性、理解难度、设计风险及实施准备程度。反馈形成报告，开发者决定接受哪些修改。

仓库说明允许技能组合，完整流水线属于一种用法。架构决策清晰的小型 Bug 修复，常规编码流程是项目推荐的选择。存在接口变化、跨模块依赖和架构取舍的功能，属于设计流程的目标场景。[工作流指南](https://github.com/google/elephant-goldfish-model/blob/403d8881d62022490637d740657b33f01e321ea8/docs/getting_started.md)

## 三、五道审查关，检查对象是什么

完整的设计审查包含五个阶段。阶段的职责存在差别，目的超出了“让几个 AI 看看文档”。

1. **全局检查**：检查方案的复杂性、必要性与代码复用机会。现有组件承担同类职责的证据，影响新增系统的合理性。
2. **理解检查**：审查者复述设计目标和现有系统的工作方式，标记未定义的项目术语、缺失的前提和逻辑断层。
3. **设计批评**：不同角色检查结构、设计取舍、边界条件和失败模式，反馈形成批评报告。
4. **全局复查**：检查文档修订带来的复杂性，核对新增措施与原始目标的关系。
5. **实施就绪检查**：检查详细实施计划的文件路径、数据结构、函数签名及测试安排，寻找执行者需要猜测的部分。

![EGM 五阶段设计审查：全局检查、理解检查、设计批评、全局复查、实施就绪检查](/article-images/google-elephant-goldfish-design-review/five-review-stages.webp)

理解检查有一个具体要求：**复述是交付物的一部分。**

审查者需要解释“这份文档提议了什么”以及“文档描述的现有系统是什么”。错误的复述暴露理解偏差，作者检查文档与真实意图的差异。“通过”是结论，复述提供理解过程的证据。[理解审查角色](https://github.com/google/elephant-goldfish-model/blob/403d8881d62022490637d740657b33f01e321ea8/agents/comprehension.md)

理解审查检验文档的解释，实施就绪审查检验执行所需的细节。高层设计与实施计划，需要不同的审查标准。

项目的实际协议包含报告、问题处理与人工检查点。金鱼提供结论与发现，开发者拥有最终决定权。[审查协议](https://github.com/google/elephant-goldfish-model/blob/403d8881d62022490637d740657b33f01e321ea8/skills/egm-review/SKILL.md)

## 四、一个 webhook 功能，暴露多少隐形需求

项目 README 使用 webhook 投递作为入门场景。下面的细节属于本文构造的示例。

原始需求是一句话：“订单完成事件触发客户系统通知。”

这句话省略了大量决定：对方超时的处理、重试间隔、重复投递的识别、事件签名、失败记录的查询与重放。

审查意见提出的是数据与状态问题：事件 ID 的生成规则是什么？投递成功的判定是什么？超时后的订单状态是什么？重复消息的处理责任属于哪一方？

设计文档需要给出这些答案。代码生成有了明确的输入：事件结构、状态变化、调用位置、失败分支和验收条件。

这份文档形成了工程资产。新的开发者、后续代码代理与故障排查者，拥有同一份解释材料。

EGM 提供 `egm-drift-report`，比较设计文档与现有源码的差异。差异处理的决定权属于开发者：修改文档或修改代码。`egm-bootstrap` 服务于存量项目的文档初始化，生成的文档需要人工核对。[架构与维护流程](https://github.com/google/elephant-goldfish-model/blob/403d8881d62022490637d740657b33f01e321ea8/docs/designs/architecture.md)

**设计、实现和文档维护，构成一个循环。**

## 五、安装入口与使用边界

推文写了“Antigravity 独占”，当前仓库的支持列表包含其他环境。核验版本是 `403d888`，日期是 **2026 年 11 月 1 日**。

README 提供 Antigravity CLI、Claude Code、Codex 的安装命令，环境指南补充了应用、IDE 扩展与云端环境的区别。项目强调完整插件安装：`skills/` 依赖 `agents/` 和 `resources/`，技能目录副本缺少完整运行材料。[安装与环境指南](https://github.com/google/elephant-goldfish-model/blob/403d8881d62022490637d740657b33f01e321ea8/docs/harnesses.md)

三个核心命令的名称是：

```text
egm-brainstorm
egm-draft
egm-review
```

Antigravity CLI 与 Claude Code 的入口使用 `/egm:` 前缀。命令示例是 `/egm:egm-brainstorm`。Codex 使用技能选择器。仓库指南提供具体安装路径和命令。

**金鱼审查需要创建新上下文子代理的能力。** 缺少该能力的宿主，审查流程停止。同一聊天的角色扮演沿用同一段对话历史；EGM 要求新上下文，二者存在区别。独立 Antigravity IDE 与 Antigravity 的应用、IDE 扩展属于不同支持对象，名称相近，能力存在差别。

项目测试记录列出了 Antigravity CLI、Claude Code 和 Codex 的安装、隔离与工作流测试；部分云端环境保留验证缺口。测试对象是插件流程；业务缺陷率的改善，需要真实项目的数据。[测试记录](https://github.com/google/elephant-goldfish-model/blob/403d8881d62022490637d740657b33f01e321ea8/TESTING.md)

审查意见需要人的判断，代码需要测试，权限与安全要求需要团队的审查标准。多个会话拥有隔离的历史，共享同一基础模型的能力局限。仓库的维护说明标注：非谷歌正式支持产品。

**EGM 的方法是：背景进入文档，歧义进入报告，取舍属于开发者。代码生成拥有了一份明确的设计依据。**

## 参考资料

1. [GitHub：google/elephant-goldfish-model](https://github.com/google/elephant-goldfish-model)。
2. [EGM 工作流与架构](https://github.com/google/elephant-goldfish-model/blob/403d8881d62022490637d740657b33f01e321ea8/docs/designs/architecture.md)。
3. [五阶段审查协议](https://github.com/google/elephant-goldfish-model/blob/403d8881d62022490637d740657b33f01e321ea8/skills/egm-review/SKILL.md)。
4. [安装环境及支持边界](https://github.com/google/elephant-goldfish-model/blob/403d8881d62022490637d740657b33f01e321ea8/docs/harnesses.md)。
5. [测试与验证记录](https://github.com/google/elephant-goldfish-model/blob/403d8881d62022490637d740657b33f01e321ea8/TESTING.md)。
