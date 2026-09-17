---
title: "Claude Code 团队：七成工作告别终端，程序员的旧时代落幕了"
description: "Claude Code 团队成员的一场对谈，露出软件工程的下一种形态：目标替代任务，Agent 接管执行，人守住边界、语境与责任。"
slug: "claude-code-terminal-goodbye"
publishedAtCST: "2026-09-17T09:32:00+08:00"
language: zh
author: JimLiu
categories: [devtools, products, business]
cover: "/article-covers/claude-code-terminal-goodbye.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-Rsns19-AWX1GXNxCEnwaoaxt39tn3q_dAYFIgKE32gT"
draft: false
---

一场 22 分钟对谈，给出一个让人发怔的数字：Claude Code 团队的 70%—80% 工作，告别终端。

Slack 成了入口。工程师交给 Claude 的内容，从“任务”变成“目标”。终端与桌面端承担精修、检查和干预。

这句话的冲击，胜过一项模型跑分。

代码生成的准确率属于产品指标。工作入口的迁移属于职业结构的变化。创造 Claude Code 的人，使用 Claude Code 终端的比例降到两三成。这个画面像一封行业来信：AI 的进步越过“辅助编程”，抵达“接管流程”。

我的感受叫作恍惚。

键盘是软件工程师定义机器的工具。机器承担键盘背后的劳动。那块黑色终端陪伴几代开发者，主舞台的聚光灯发生偏转。

## 终端退居二线

Thariq、Sid 与 Robert 的对谈，主题是 Claude Code 的诞生和变化。三位成员谈到一种新工作习惯：Slack 里的 Claude Tag 接收目标，完成任务，提交结果。TUI 与桌面端服务于结果精修和 Claude 集群管理。

入口变化意味着交互单位变化。

终端时代的单位是命令。Copilot 时代的单位是代码片段。Agent 时代的单位是目标。

“改一个函数”属于任务。“提高这条链路的稳定性”属于目标。目标包含探索、拆解、实现、测试和复核。Agent 获得这组环节，人的手指离开具体步骤。

Anthropic 的 Claude Tag 介绍页给出另一个数字：这套 Slack Agent 打开 65% 的公司 PR。它的使用范围覆盖工程、销售支持、客户支持和数据科学。Slack 消息框由沟通工具变成工作调度台。

这场变化超出终端换皮。工作控制权发生迁移。

## 两个月的技术保质期

Sid 提到一个刺眼判断：底层技术的旧保质期单位是年，新保质期是两个月。

Sonnet 3.5 接到五件事，一个典型结果是三件完成、两件遗漏。团队加入 to-do list，漏项消失。一年后的模型失去这个问题，相关功能失去价值。

一句工程经验由此诞生：别爱上自己造的东西。

传统软件强调稳定抽象、长期复用和沉淀资产。Agent 产品面对另一种现实：模型能力构成地基，地基处于抬升状态。核心功能和冗余代码成为同一份代码的两个身份。

![Agent 工具的生命循环：失败模式、补丁、模型升级与工具退场](/article-images/claude-code-terminal-goodbye/tool-cycle.webp)

工具退场呈现选择性。

旧失败模式消失，旧补丁退场；任务尺度扩大，新失败模式出生，新工具登场。产品团队的路径包含删减与重写。工具价值有两个来源：当代模型的缺口与下一代任务的边界。

传统软件追逐用户需求。AI 产品面对用户需求与模型能力两条赛道。

## Harness 的宿命

Agent harness 包含提示、工具、权限、记忆、任务清单、检查机制与编排逻辑。它像一副外骨骼，弥补模型的薄弱处。

这副外骨骼的形态短暂。

AskUserQuestion 工具的故事具有代表性。团队投入大量心力，训练模型调用这个提问工具。工具作者的新方法是让 Claude 生成带 mockup 的 artifact。可见方案成为问题，交给人类判断。一个抽象问题，变成一个可操作对象。

模型进步带来的变化超出回答质量的线性上升。交互方式出现突变。

旧交互由文字输入与文字输出构成。新交互包含计划、界面、代码、测试和 PR 的审阅。AI 越过对话框，制造人类判断所需的对象。

## 代码评审的价值重写

对谈里的另一个细节，带着一点残酷。

人类 reviewer 挑出三个小问题，这个动作带有一种社交功能：证明“我读过”。Claude 承担这类检查。人的注意力留给模型缺少的内容：API 为什么长成这样，服务边界为什么画在这里，用户承受什么风险，团队愿意背负什么代价。

![代码评审的责任分界：机器负责可验证项，人负责语境、价值与责任](/article-images/claude-code-terminal-goodbye/human-agent-split.webp)

代码评审的核心，由挑错转向解释。

这场变化抬高资深工程师的价值门槛。语法熟练度、框架记忆和样板代码的权重下降。系统判断、领域知识、风险意识和责任能力的权重上升。

Anthropic 的研究样本包含 40 万次 Claude Code 会话，结果呈现同一方向。调试任务占比由 33% 降至 19%；软件运行任务占比由 14% 升至 21%；写作与数据分析占比由 10% 升至 20%。研究估算的单次任务价值增长 27%。

人类负责“做什么”，Claude 负责“怎么做”。领域经验越深，一条指令承载的工作量越大。

专业能力获得保留，接口完成换代。

## 信任跃迁

Claude Tag 把界面和 transcript 分开。Slack 消息来自 Claude 的工具调用。完整思考轨迹处于隐藏状态。

团队成员的初始感受是焦虑。结果质量消解了部分焦虑。过程监看让位于结果验收。

Agent 普及的关键叫作信任。

自动驾驶接管方向盘。软件 Agent 接管工作链。接管意味着权限、身份、环境隔离、审计与责任。Anthropic 的安全文章披露过误删远程分支、泄露凭证、触碰生产数据库等风险。能力增长扩大收益与事故半径。

这份矛盾具有长期性：人追求微观管理的减少和责任控制的保留。

好的 Agent 系统省去内心独白直播，提供目标、边界、证据和结果。人类关注可验证的承诺。

## 一种职业的告别

对谈末尾的问题是五个字：怀念什么？

Sid 怀念性能优化。他说 Claude 的能力超过了自己。Robert 花过一整天复刻 Mac OS X 10.4 的 Aqua 按钮，复刻方案包含多层 radial gradient。他给出判断：手写这种东西的日子结束了。

这段话让人沉默。

技术进步的指标是效率、成本和产出。报表缺少开发者的感情。那些手工打磨 CSS 的下午，那些汇编、缓存和渲染管线给出答案的夜晚，构成了职业身份的一部分。AI 接走劳动与某些技艺带来的自豪。

每代工具结束一批手艺。编译器结束手写机器码，云服务结束大量机房操作，前端框架结束许多 DOM 手工劳动。Agent 的特殊之处，是它触碰了“解决问题”本身。

速度带来兴奋与伤感。

## 人的价值：问题、边界与责任

终端退场改变程序员这个词的内涵，职业本身获得保留。

下一代工程师的作品是一套 Agent 目标执行环境：清楚的约束、可验证的测试、稳定的权限、准确的领域模型、可追溯的决策记录。

写代码保留价值。理解代码保持重要性。价值中心发生移动：从亲手完成每一步，转向定义正确问题；从熟练操作工具，转向设计工作系统；从检查细节，转向承担判断。

AI 的发展速度，给人一种时间压缩感。演示视频与顶尖 AI 团队日常工作的距离是两年。功能打磨与删除名单的距离是数月。

终端之光获得保留。它的角色是精修室、控制室和事故现场。

主舞台属于目标、Agent 和工作流。

编程继续。

两幕并置：“亲手写完一切”这项职业信念落幕，“让智能系统完成复杂目标”这项新职业开场。

我们身兼观众与演员。

---

**参考资料**

- [Claude Code 团队对谈：What we miss about software engineering before AI](https://www.youtube.com/watch?v=S-sYlFiGFv8)
- [Anthropic：Agentic coding and persistent returns to expertise](https://www.anthropic.com/research/claude-code-expertise)
- [Anthropic：How Anthropic works with Claude Tag in Slack](https://www.anthropic.com/webinars/how-anthropic-works-with-claude-tag-in-slack)
- [Anthropic：How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude)
