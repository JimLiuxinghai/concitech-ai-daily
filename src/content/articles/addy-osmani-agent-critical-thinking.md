---
title: Addy Osmani警告“认知投降”！AI写完代码，谁是发布责任人？
description: >-
  Addy
  Osmani讨论Agent工作流中的判断责任。任务外包、判断让渡与认知投降，代表不同的工作方式。代码运行、测试通过和提交者理解修改，属于不同的验收问题。文章结合原始研究与退款接口示例，介绍证据审查、设计记录和发布责任。
slug: addy-osmani-agent-critical-thinking
publishedAtCST: '2026-11-05T07:41:25+08:00'
language: zh
author: JimLiu
categories:
  - devtools
  - research
cover: /article-covers/addy-osmani-agent-critical-thinking.webp
draft: false
wechatMediaId: "qwac_8j4kaaga6WV5YUa-RaKGPbRGBG9aLtbwtyuGKGP7rh6tmQq_dooZel5xWc4"
---

Agent提交修改，测试通过，摘要写着“任务完成”。

发布者面对的考题是什么？

这次修改改变了哪些行为？设计理由是什么？检查覆盖了哪些风险？故障排查的入口是什么？

这些问题的答案，决定一份交付物是否进入团队的知识体系。

Addy Osmani的11月3日长文《Critical thinking when agents do the work》讨论了这个问题。他使用“认知投降”描述一种工作状态：AI的答案成为人的结论，独立判断与核查缺席。[原文](https://x.com/addyosmani/status/2117512471930167377)

**任务交付与判断责任，属于两份不同的工作。**

## 执行外包，判断责任留给谁？

Addy区分了三种状态。

**任务外包**：AI承担执行，人保留结果审查与解释责任。开发者接受实现帮助，业务目标与验收标准具有明确归属。

**判断让渡**：AI的回答成为后续工作的前提，验证该前提的环节缺席。下一份设计、下一段代码，继承这个前提。

**认知投降**：一份答案获得认可，提交者缺少解释与核查的意愿。完成感代替了对结果的判断。

这组区分关心的是人与结果的关系。手写代码、人工逐行阅读与AI协作，需要有效的判断标准。

![任务外包、判断让渡与认知投降的工作方式对照](/article-images/addy-osmani-agent-critical-thinking/delegation-and-judgment.webp)

*图1：本文对Addy工作方式框架的归纳，分类关注判断责任与证据。*

Addy此前的文章使用“理解债”描述代码规模与人的理解之间的差距，使用“意图债”讨论目标、约束与设计理由的记录缺口。代码保存实现，设计记录保存选择的理由。[意图债原文](https://addyosmani.com/blog/intent-debt/)

一段重试逻辑体现调用规则，限流要求、事故教训或供应商约束，需要对应的记录。AI给出的合理解释属于待核验推断，历史决策需要历史证据。

## 两项研究，提供哪些线索？

Anthropic的2026年1月研究招募了52名软件工程师，多数属于初级工程师。任务涉及陌生的Python异步库Trio，研究采用随机对照设计。

即时测验的AI辅助组平均得分为50%，手写代码组为67%，差距是17个百分点。任务耗时的组间差异缺少统计显著性。[研究原文](https://www.anthropic.com/research/AI-assistance-coding-skills)

这项实验测量的是陌生库学习后的即时表现。长期技能变化、资深工程师的大型项目表现，属于另外的研究问题。使用形态是侧栏AI助手，全流程Agent工作的影响需要对应研究。

研究者的交互分析发现，概念提问、请求解释等使用方式伴随较好的理解表现。这部分分析属于行为关联，缺少证明某个提问套路保证学习效果的因果证据。

微软研究院等机构的CHI 2025论文调查了319名知识工作者，收集936个使用实例。受访者对AI的信心与较少的批判性思考投入存在关联；研究采用自报数据。[论文介绍](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/)

两项研究的问题与方法不同。“所有AI使用导致能力退化”的判断超出了这些证据。它们提出的实践问题是：**任务产出与人的理解，需要对应的评价依据。**

## 一次退款接口修改，测试绿灯说明什么？

下面是一段假设的工程场景。

团队维护退款接口，业务要求包括金额正确、重复请求保持幂等、权限匹配、订单与资金状态一致。

Agent修改实现，增加一条测试：发起退款，接口返回成功，订单状态变为“已退款”。测试通过。

这条测试覆盖正常路径的部分行为。重复回调、超时重试、其他租户的订单、下游失败等情况，需要对应的检查。

这里存在一种风险：实现和测试继承同一个错误假设，绿色结果反映两者的吻合。业务要求需要独立的验收依据。

这里的独立指依据的独立：需求、接口契约、真实故障记录、数据约束。第二个模型的赞同，代表另一份审查意见；业务证据决定意见的分量。

![退款接口假设场景的检查计划：重复请求、失败恢复、权限边界和调用兼容性](/article-images/addy-osmani-agent-critical-thinking/verification-evidence.webp)

*图2：本文假设场景与建议检查项，图中文字属于验收计划。*

有用的验收记录，需要对应被测行为、运行环境、实际命令与输出。截图证明可见状态，日志提供执行线索，自动化断言覆盖明确条件。每种材料具有自己的证据范围。

## PR的审查对象：代码与决定的来历

一次修改包含多项选择：默认值、兼容范围、异常处理、范围取舍。

这些选择构成审查对象。下面四项适合进入PR说明，属于本文的工程建议：

1. **目标与边界**：解决的业务问题、受影响用户、范围之外的事项。
2. **设计理由**：方案依据、关键假设、兼容要求与相关历史记录。
3. **验证证据**：检查对象、执行记录、通过条件与证据局限。
4. **故障处理**：观察信号、排查入口与回滚条件。

这份记录服务于接手者。提交者需要解释关键路径，接手者需要找到依据与定位线索。庞大系统的全部细节超出单个人的记忆容量，局部理解的恢复能力成为重要资产。

AI承担调用链梳理与领域解释的辅助工作，代码、文档和运行证据承担校验。目标是建立这次改动的可解释性，审查力度需要匹配变更风险。

## 并发产出增加，审查容量需要匹配

Addy称这类协调成本为“编排税”：Agent生成结果与人的审查承受能力之间出现缺口。会话数量增加，人的注意力与判断时间保持有限。[编排税原文](https://addyosmani.com/blog/orchestration-tax/)

这给团队提供一个容量指标：等待审查的工作数量、积压时长与风险。

等待队列增长，提示生产速度与验收速度失配。拆分变更、减少交叉依赖、完善证据、安排审核时间，属于容量治理的选择。单一的PR产量缺少代表通过验收的工作量的资格。

判断责任原则适用于报告、调研与方案。一个摘要的关键数字需要来源，一项产品建议需要需求依据，一项代码修改需要行为证据。

**AI承担执行，团队安排验证，发布者承担判断责任。**

代码合并代表一次操作。设计理由、验证证据与风险判断，构成签字的依据。

## 参考资料

- [Addy Osmani：Critical thinking when agents do the work，2026-11-03](https://x.com/addyosmani/status/2117512471930167377)
- [Addy Osmani：The Intent Debt](https://addyosmani.com/blog/intent-debt/)
- [Addy Osmani：The Orchestration Tax](https://addyosmani.com/blog/orchestration-tax/)
- [Anthropic：How AI assistance impacts the formation of coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills)
- [微软研究院等：The Impact of Generative AI on Critical Thinking，CHI 2025](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/)
