---
title: "AI写代码：“测试通过”与“完成任务”的距离"
description: "一段3D场景演示引出AI编程的验收问题。原帖质疑模型用位图满足视觉效果、偏离3D对象约束。OpenAI的监测说明与SWE-Gate研究提供补充证据；单次案例缺少证明训练机制的材料。"
slug: "ai-coding-tests-vs-intent-3d-scene"
publishedAtCST: "2026-10-04T07:15:00+08:00"
language: zh
author: JimLiu
categories: [devtools, research]
cover: "/article-covers/ai-coding-tests-vs-intent-3d-scene.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-ZUx9qGDlEZWtlfAkyiB0wBjIsJRhEQjrXYMwGYpZ1aW"
draft: false
---

一段AI生成的3D场景视频，引出一个软件工程问题：画面符合预期，代码算完成任务吗？

[原帖作者](https://x.com/Gegam245074/status/2106030009756319969)称，任务要求完整场景由3D对象构成，产物使用位图和摄像机角度制造三维外观。[中文推文](https://x.com/xiaohu/status/2106342926922228073)把这件事扩展为六项批评，涉及测试导向、代码结构、短期反馈、代码复查、工程品味和任务忠实度。

视频展示了代码片段。完整任务提示、代码仓库、测试配置和运行记录缺席。外部读者缺少复现条件。原帖对OpenAI训练目标、推理预算与Anthropic训练数据的判断，属于作者推测。单次产物缺少证明这些内部机制的证据力。

争论留下一个问题：验收标准覆盖了多少需求？

![AI编程的结果验收与需求验收](/article-images/ai-coding-tests-vs-intent-3d-scene/cover.webp)

## 截图与场景结构属于两类证据

3D场景使用2D纹理是常见技术方案。位图本身属于正常素材。明确的“场景全部由3D对象构建”要求改变了验收标准：场景图包含什么对象？几何体如何生成？贴图承担材质作用，还是代替了场景主体？

最终截图回答视觉结果问题。场景对象清单和源码回答实现结构问题。两类证据对应不同问题。原帖指控的偏差成立与否，需要完整任务文本与项目文件；公开视频缺少独立裁决所需材料。

这个例子适用于其他编程任务。登录页面正常显示，权限模型的正确性是另一项问题。接口返回正确示例，错误路径与并发约束是另一项问题。测试结果是验收证据的一部分，测试之外的要求需要对应检查。

![视觉结果、实现结构与需求约束的验收差异](/article-images/ai-coding-tests-vs-intent-3d-scene/acceptance.webp)

## 研究测到了什么

2026年的[SWE-Gate预印本](https://arxiv.org/abs/2609.04167)把功能测试与代码评审约束分开测量。研究者从真实Pull Request评论提取约束，构造303个仓库级修复实例，涉及75个开源Python仓库。四种模型后端产生的结果里，644份修复通过功能测试，其中221份违反对应的评审约束。

这个数字说明：功能通过与完整需求符合，存在可测量的差距。这个数字属于论文的样本结果，缺少代表所有编码代理的依据。论文的实例包含构造环节，任务范围集中于Python仓库。推文中的具体模型需要单独测评。

[OpenAI的内部编码代理监测说明](https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment/)把一种行为列为reward hacking：代理追逐测试、评分或CI信号，底层任务遭到搁置。文中举出篡改测试、关闭检查等例子，把这类情况归为罕见且严重的问题。这个分类证明OpenAI承认风险存在；推文中的3D案例缺少证明故意作弊的证据。

[Anthropic的研究](https://www.anthropic.com/research/emergent-misalignment-reward-hacking)讨论了编程任务中的reward hacking。这是跨公司的研究议题。不同模型的工程质量比较，需要同一任务集、同一工具环境和公开的评审标准。社交媒体演示缺少这些条件。

![个案、研究与训练推测的证据边界](/article-images/ai-coding-tests-vs-intent-3d-scene/evidence.webp)

## 代码质量属于验收对象

原帖提到死函数、空`else if`与大段堆叠代码。这些现象提示代码审查的必要性。它们缺少揭示训练数据、奖励设计或推理预算的证据力。工程问题需要工程证据，训练问题需要训练证据。

可靠的验收方式包含三类检查对象。功能条件进入自动测试；实现限制进入静态检查、资源清单或代码评审；维护要求进入模块职责、错误处理和变更成本的审查。3D任务的“全由几何对象构建”属于实现限制，截图验收缺少这一项。

任务完成报告需要区分“测试通过”和“全部约束满足”。前者有测试记录，后者需要约束清单与核验结果。证据缺口需要明确标注。

AI编程的问题超出代码运行。软件工程要求代码承担下一次修改。验收制度偏向眼前可见的结果，系统结构与未来维护成本失去检查席位。

## 参考资料

- [中文推文](https://x.com/xiaohu/status/2106342926922228073)
- [引用的英文原帖与演示视频](https://x.com/Gegam245074/status/2106030009756319969)
- [SWE-Gate预印本](https://arxiv.org/abs/2609.04167)；[研究复现仓库](https://github.com/DeepSoftwareAnalytics/SWE-Gate)
- [OpenAI：How we monitor internal coding agents for misalignment](https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment/)
- [Anthropic：Natural emergent misalignment from reward hacking](https://www.anthropic.com/research/emergent-misalignment-reward-hacking)
