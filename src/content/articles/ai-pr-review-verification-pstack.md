---
title: "2500个PR与一套验证系统：AI代码质量谁来负责？"
description: "Lauren Tan自述：月度PR合并量为2500个。访谈与pstack仓库呈现一套质量控制方法：真实场景验证、代码结构约束、人工抽查。这个数字缺少独立审计材料，公开插件与内部生产流程存在边界。"
slug: "ai-pr-review-verification-pstack"
publishedAtCST: "2026-10-05T06:18:00+08:00"
language: zh
author: JimLiu
categories: [devtools]
cover: "/article-covers/ai-pr-review-verification-pstack.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-fwI_qIUp3xVZBiX_YMtWRnp5mxF8Ov2Z5rvZpJQPu_o"
draft: false
---

Lauren Tan 的[原帖](https://x.com/poteto/status/2106134336705843554)给出一个数字：一个月，2500 个 PR。她与 Matt Pocock 的[访谈](https://www.youtube.com/watch?v=MN9dGgmLyso)讨论了这套工作方式。[中文推文](https://x.com/dotey/status/2106635352609865925)梳理了其中的细节：AI 执行检查与合并，工程师承担抽查与规则修订。

2500 个 PR 是 Lauren 的自述。公开资料缺少对应的 PR 清单、缺陷率与独立审计。访谈摘要提到，许多改动属于维护工作，而非新功能。这个数字缺少团队生产率的通用解释力。

它提出一个问题：代码产量超出人类逐项阅读能力，质量责任归属何处？

![AI代码变更的质量关口](/article-images/ai-pr-review-verification-pstack/flow.webp)

## 第一重关口：程序要有验收证据

传统测试回答特定断言的结果。产品验收需要另一组证据：应用启动记录、核心路径操作记录、页面与状态的需求对照。

Lauren 公开的 [pstack](https://github.com/cursor/plugins/tree/main/pstack)包含一项“创建验证技能”的工具。其[说明](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md)要求项目提供启动方式、用户路径、操作手段与结果证据。网页项目使用浏览器操作记录；命令行工具保留终端记录；服务接口保留响应与状态变化。编译结果属于验收证据的一类。

中文推文记录了一个窗口卡顿案例。Lauren 承担性能工具与 AI 之间的信息传递工作：人读数值，AI 修改代码，人复测结果。验证工具接管可重复的操作，模型承担判断与修复。这个分工降低人的传话成本，留下每次修改的检查线索。

![验证系统的检查对象](/article-images/ai-pr-review-verification-pstack/gates.webp)

## 第二重关口：代码库限制错误写法

中文推文援引 Lauren 的访谈：Grok Bot 早期代码集中于少数巨型文件。功能扩张加重了结构问题。她的处理方式是功能目录、统一实现路径与自动检查。

pstack 的[结构化约束原则](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-encode-lessons-in-structure/SKILL.md)给出一条规则：类型设计、静态检查、标准组件与运行时校验承接重复性纠错。文字提醒依赖模型记忆；工具约束提供可执行的边界。工程师修订规则，机器执行规则。

这套方法的代价是前期工程投入。验证脚本需要维护，规则需要覆盖真实错误。插件安装与项目专属设施是两项工作。公开的 pstack 展示方法，缺少证明外部团队拥有同等生产流程的证据。

## 抽查与责任

中文推文提到，Lauren 的夜间流程包含 AI 检查与合并，早晨流程包含抽查、撤回与规则修订。这个叙述属于当事人的工作经验；公开仓库缺少对每次生产合并的独立验证。

抽查适合发现重复性偏差：多项改动出现同一种绕路写法，工程师修改规则和工具。抽查与不可逆变更审批是两类关口。数据删除、资金转移、隐私泄露与医疗决策具有不同的风险边界。自动验证覆盖的需求范围，决定自动合并的适用范围。

团队的起点是一条用户路径的验证脚本：应用启动、一次真实操作、一份结果证据。下一项是常见错误的机器检查。人的审查范围由风险等级与证据缺口决定。

2500 个 PR 是结果。验证能力、代码边界与责任分配构成这套工作方式的基础。

## 参考资料

- [Lauren Tan 的原帖](https://x.com/poteto/status/2106134336705843554)；[Matt Pocock 与 Lauren Tan 的访谈](https://www.youtube.com/watch?v=MN9dGgmLyso)
- [中文推文与访谈摘要](https://x.com/dotey/status/2106635352609865925)
- [pstack 官方仓库](https://github.com/cursor/plugins/tree/main/pstack)；[Cursor 插件页](https://cursor.com/marketplace/cursor/pstack)
- [pstack：创建验证技能](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md)；[结构化约束原则](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-encode-lessons-in-structure/SKILL.md)
