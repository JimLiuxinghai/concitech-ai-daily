---
title: "Plan Mode走向终点：AI编程告别长篇计划书"
description: "Nuanced创始人Ayman Nadeem复盘Plan Mode产品失败。模型能力、阅读负担、瀑布流程和并行Agent暴露同一问题：静态规格书让位于可检查的行动循环。"
slug: "plan-mode-action-loop"
publishedAtCST: "2026-09-27T17:30:00+08:00"
language: zh
author: JimLiu
categories: [devtools, products]
cover: "/article-covers/plan-mode-action-loop.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-QI8h7iSyZJV_41PcotxuaT0Sw5mRcOo46JWnB4ZGOBP"
draft: false
---

一款AI编程产品的核心卖点是Plan Mode。产品作者写下这套模式的墓志铭。

作者Ayman Nadeem拥有GitHub高级工程师履历，创业项目名为Nuanced。产品结构包含一份持久计划：需求对话、歧义澄清、规格书生成、人工审阅、方案批准、代码实现。

产品试验走向失败。作者给出的判断是：规划过程拥有价值，计划文档失去中心地位。

这篇文章登上Hacker News首页。页面记录553分和477条评论。争论焦点是人类理解AI行动的界面形态。

![Plan Mode与行动循环的界面更替](/article-images/plan-mode-action-loop/cover.webp)

## 一场产品失败

Nuanced的流程结构是：

> 对话 → 消歧 → 规格书 → 审阅 → 修订 → 批准 → 实现 → 代码审查

用户拥有一份持久计划。Agent获得一套精确指令。产品目标是连接意图、决策、代码和结果。

体验暴露四个问题。

问题一：规划过程与计划文档属于两种东西。问题讨论和关键选择构成用户目标，长篇规格书缺少吸引力。

问题二：模型能力提升压缩精确指令的需求量。代码库探索、上下文理解和合理假设扩大工作范围。

问题三：AI规格书带来阅读负担。信息量增长，清晰度停滞。Nuanced加入Spec Tour功能，结果是一层文本加上另一层文本。

问题四：线性流程违背软件开发的探索属性。编译器反馈、测试失败、接口行为和真实数据构成新证据。冻结规格书丧失变化吸收能力。

![Plan Mode承担的两份工作](/article-images/plan-mode-action-loop/two-jobs.webp)

## 两份工作的命运

Plan Mode承担两份工作。

一份工作面向Agent：规格书提供精确指令。另一份工作面向人类：计划帮助开发者建立系统心智模型。

模型进步削弱第一份工作的价值。第二份工作的价值上升。Agent代码产量增长，人类理解负担增长。并行Agent数量增长，决策来源、假设边界和行为影响构成新的工程问题。

Nuanced优化了计划产物。理解过程构成用户核心需求。这是产品失败留下的核心教训。

## 瀑布流程与行动循环

作者提出一条替代路径：

> 理解 → 行动 → 检查 → 澄清 → 调整 → 行动

每次行动是一场小实验。工具输出提供证据。测试结果触发修正。重大分叉触发提问。规划存在于循环内部，规划文档退出流程中心。

这套结构接近软件开发的真实形态。需求变化、仓库隐藏约束和执行反馈构成新信息。行动循环容纳这些变化。瀑布计划设定一条顺序：思考终止，行动启动。

![瀑布流程与行动循环](/article-images/plan-mode-action-loop/workflow.webp)

## 墓碑的适用范围

行业证据给出一条清晰边界。

OpenAI《How OpenAI uses Codex》的建议包含一项：大型改动始于实施计划。Anthropic的Claude Code命令行保留`--permission-mode plan`。Hacker News评论区列出三类高价值场景：架构改造、专有服务、昂贵计算。

这些场景拥有共同特征：错误成本高、回滚成本高、外部约束多。计划文档承担成本确认、责任分界和权限闸门。治理价值高于提示价值。

Plan Mode之死指向固定规格书的默认地位。大型重构、数据库迁移、安全操作和昂贵实验保留审批节点。低风险功能、界面原型和普通缺陷修复适合行动循环。

| 任务类型 | 合适机制 | 人类关注点 |
| --- | --- | --- |
| 界面原型 | 行动循环 | 结果与手感 |
| 普通缺陷 | 行动循环 | 复现与测试 |
| 架构改造 | 计划闸门 | 边界与兼容性 |
| 数据迁移 | 计划闸门 | 回滚与完整性 |
| 昂贵计算 | 计划闸门 | 成本与终止条件 |

## Agent界面的新任务

长篇计划书退出中心位置，四类对象进入界面中心：

- 当前意图：任务目标与验收条件。
- 关键假设：Agent的自主选择。
- 运行证据：测试、日志、截图与差异。
- 控制节点：暂停、回滚、批准与接管。

行动循环减少无效阅读。人类注意力归属高代价分叉，Agent执行权归属低风险实现。每段推理的阅读属于无效任务。界面负责暴露关键决策。

推文提出另一项判断：部分Skills面临模型淘汰。原文主题是Plan Mode；Skills属于推文作者的外推。技能文件包含三种角色：能力补充、流程约束、组织契约。模型升级压缩能力补充型技能的空间。安全边界、团队规范和领域规则属于制度层，模型能力与制度约束是两个维度。

## 计划书的终点，规划的迁移

AI编程工具的竞争目标发生变化。代码产量是一项指标。决策可见性、风险边界、验证证据和复盘能力成为产品能力。

Plan Mode的墓碑刻着一条产品教训：思考与文档属于两件事；控制与审批属于两种机制；理解来自可检查的行动链。

规划保留生命力。规划位置迁入行动循环。

---

## 参考资料

1. Ayman Nadeem, [Plan mode is dead](https://www.aymannadeem.com/artificial/intelligence,/developer/tools/2026/09/24/plan-mode-is-dead.html)
2. Hacker News, [Plan mode is dead讨论页](https://news.ycombinator.com/item?id=49840054)
3. OpenAI, [How OpenAI uses Codex](https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf)
4. Anthropic, [Claude Code CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-usage)
5. Viking, [相关推文](https://x.com/vikingmute/status/2103839213787730416)
