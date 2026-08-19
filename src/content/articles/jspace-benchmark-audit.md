---
title: "DeepSeek V4 Pro 加个 Skill 就超越 Fable 5？爆火的 J-Space 跑分翻车了"
description: "J-Space 声称一个 Skill 能让 DeepSeek V4 在多项 Agent Benchmark 上超过闭源模型。但社区复现得到反向结果，报告中的 Terminal-Bench 单次跑分甚至无法按官方任务数算出来。"
slug: "jspace-benchmark-audit"
publishedAtCST: "2026-08-19T07:49:10+08:00"
language: zh
author: JimLiu
categories: [research, devtools]
cover: "/article-covers/jspace-benchmark-audit.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-Xp1DoD0FBcsYc1XrwH-HMnUhzB7Aq0gkQkMWWDyYT9x"
draft: false
---
今天，一个叫 J-Space Cognition Suite 的项目在 X 上引发热议。

过去两天，它凭一组非常夸张的 DeepSeek V4 测试结果迅速出圈，也被海内外多个 AI 账号转发。

项目作者声称，只要加载这套 Skill：

- V4 Flash + J-Space，可以追平 GLM-5.3；
- V4 Pro + J-Space，可以在多个 Agent Benchmark 上超过 Fable 5；
- 得分/时间提升 2.53 倍；
- 得分/Token 提升 2.21 倍。

如果这些数字成立，J-Space 等于用一套不修改模型权重的提示词与状态管理协议，让 DeepSeek 获得了接近模型代际升级的提升。

问题是，社区开始复现之后，结果完全不是这么回事。

而且现在的问题已经不只是“别人没跑出同样成绩”。报告中最关键的一组数字，连它自称的计算口径都对不上。

先说我的判断：

**作者没有承认造假，现有公开材料也无法证明其主观故意。但就评测报告本身而言，这组跑分已经被扒出无法解释的硬伤，不能再被当成真实、可靠的 Benchmark 结果传播。**

## 最关键的问题：增强分数从哪里来？

报告列了 9 个 Benchmark、两个 DeepSeek 模型，共 18 组加载 J-Space 后的成绩。18 组全部上涨。

但我检查了[报告仓库](https://github.com/Tiger3807861189/DeepSeek-V4-J-Space-Capability-Realization-Report)。截至本文写作时，仓库里只有三个文件：README、LICENSE 和 CITATION.cff。

没有评测脚本，没有任务清单，没有原始输出，没有 DSH 轨迹，没有评分器结果，没有 Token 账单，也没有能把某个分数对应到某次运行的 manifest。

提交历史也很清楚：第一版提交的是完整报告，后续提交主要在增加许可证、引用格式和 Zenodo DOI，没有补充评测产物。

报告自己写明：DeepSeek 原始成绩和其他模型成绩来自厂商公开结果，只有“+ J-Space”列是套件的单次实测。

我逐项对照后发现，V4-Flash 的基础分数确实与[DeepSeek 官方模型卡](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731)一致。也就是说，读者真正需要核验的恰恰是增强后的 18 个数字，而这部分没有留下公开证据。

一张表可以写出任何数字。让数字成为实验结果的，是它背后的任务输入、运行轨迹、评分输出和可复现流程。

这里缺的正是这些。

## “单次实测”解释不了这份整齐

报告承认所有结果都是单次运行，没有多随机种子、均值、方差或置信区间。

单次跑分不是原罪。新模型刚发布时，社区常用单次实验快速摸底。但单次结果至少也应保留逐任务明细，否则我们无法判断提升来自 Skill、随机采样、任务子集变化、评分器差异，还是运行失败后的筛选。

更值得注意的是，这 18 组增强结果没有一次下降。它们跨越知识问答、终端操作、仓库开发、安全任务、工具调用和自动化工作流，却呈现一致而显著的正增益。

这当然不是造假的数学证明。但当结果越整齐、结论越惊人，举证责任就越高。现在的证据强度恰好反过来：主张很强，记录为零。

## 87.1%，单次运行到底怎么得到？

这是目前最直接的矛盾。

[Terminal-Bench 2.1 官方页面](https://www.tbench.ai/news/terminal-bench-2-1)明确写明，这个版本包含 89 个任务。Terminal-Bench 的原始计分是二元通过/失败，单次运行的总成绩只能是“通过任务数 ÷ 89”。

那么，报告给出的 V4 Flash + J-Space 成绩 `87.1%` 对应多少道题通过？

答案是 `77.519` 道。

但任务通过数不可能出现半道题。77 道通过是 `86.5%`，78 道通过是 `87.6%`，中间没有 `87.1%`。

同一张表里的 V4 Pro + J-Space 为 `90.1%`，也存在相同问题：80 道通过是 `89.9%`，81 道通过是 `91.0%`。

多次重复后取平均，当然可以产生更多小数。但报告又明确写着“所有结果按单次运行记录”，并称各 Benchmark 使用自身原生分数。

因此至少有一项陈述不成立：它不是单次运行，使用的不是公开的 89 题与原生计分，或者表里的数字并非由所述流程计算得出。

如果作者采用了未公开的任务子集、部分分、重采样或多轮平均，只需公布逐题结果和计算公式就能解释。到目前为止，这些材料仍然没有出现。

还有时间问题。DeepSeek V4-Pro-0813 在 8 月 13 日正式上线，这份覆盖九类基准、两个模型的报告在 8 月 16 日提交。社区有人据任务量估算，若串行执行需要很长时间。

我不认为“不到三天”本身足以定罪。高并发、多个账号和足够预算都能大幅压缩墙上时间。真正的问题是，报告没有公开并发配置、开始结束时间、API 用量和成本，因此外界连这套解释也无法核实。

## 作者自己的回应，让效率结论更难成立

在 J-Space 仓库的[一个公开 Issue](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6/issues/1)里，有用户要求提供 2.53 倍速度和 2.21 倍 Token 效率背后的原始耗时与 Token 数据。

作者回复称，这个数据“确实是夸张的”，不是所有情况都能稳定达到，同时又给出了 1.6 到 3 倍的区间。

问题在于，报告正文仍然展示精确到两位小数的 2.53 倍和 2.21 倍，并称其采用“固定统一系数缩放”。但它没有公开缩放系数、原始分子分母和任务级数据。

当原始测量不可见时，“统一缩放不影响相对比值”没有办法替代实验记录。尤其报告自己列出的证伪条件之一，就是加载 J-Space 后得分/时间与得分/Token 同时下降。

偏偏社区测试已经观察到了这个方向。

## 社区实测，方向与宣传相反

一位测试者在[Terminal Bench 2.1 复现 Issue](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6/issues/6)中称，他用 87 个任务比较 DSH Minimal 与 Minimal + J-Space，加载 Skill 后成绩略降，Token 和成本上升。该 Issue 尚未公开完整轨迹，因此它也不能被视为最终结论，但至少构成了直接反例。

8 月 18 日，又有开发者使用 `8×NVIDIA H20 96G` 自部署 DeepSeek V4 Flash-0731，运行完整 89 题。他在[复现报告](https://github.com/Tiger3807861189/DeepSeek-V4-J-Space-Capability-Realization-Report/issues/13)中给出的结果是 69/89，也就是 77.5%，远低于项目声称的 87.1%。对错误任务至少重跑三次后，仍未达到报告成绩。

这份复现同样还没有公开全部底层日志，不能独立证明原报告是如何产生的。但两位测试者使用不同资源和测试方式，都没有观察到宣传中的大幅增益，其中一位得到的还是性能下降、Token 与成本上升。

另一组[独立 A/B 测试](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6/issues/10)规模较小，每组只有 3 次，作者也明确承认不具统计显著性。结果是：两组任务完成度没有可测差异，J-Space 组的盲评均分略低；在长程中断恢复任务中，J-Space 组输入 Token 约为对照组的 3.15 倍，耗时增加约 36%。

这些测试不足以证明 J-Space 在所有任务上都无效，却足以推翻“公开证据支持大幅提升”这种说法。至少在现有材料里，2.21 倍 Token 效率没有得到独立支持，反方向结果倒是已经出现。

## 更深的一层：这个 Skill 真的在操作 J-Space 吗？

Anthropic 所说的 J-space，是通过 Jacobian lens 从模型内部神经激活中识别出的一组表征。研究人员要读取残差流、构造探针，并直接替换或抑制特定激活，才能验证这些表征是否具有因果作用。[Anthropic 的原始研究](https://www.anthropic.com/research/global-workspace)写得很明确：J-space 不是模型写出来的思维链，而是模型没有说出口的内部活动。

社区这个 J-Space Skill 做的是另一件事：把一套提示词、任务路由、账本、checkpoint 和自检协议加载进上下文。它可以影响模型行为，这一点完全可能；好的提示词和状态管理也确实有工程价值。

但它读不到模型激活，也没有部署 J-lens，更没有在推理管线中实施神经表征干预。

一位实际制作过 J-lens 工具的开发者也在[项目 Issue](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6/issues/22)中指出：加载 examples 可以塑造行为，但不等于介入 J-space。

所以更准确的称呼应该是“受 J-space 研究启发的提示词与状态管理协议”，而不是一套已经证明能够调用或强化模型内部 J-space 的技术。两者之间隔着一条完整的实验链路。

## 质疑 Issue 消失后，真正需要的证据仍未出现

GitHub 上还出现了另一个争议。至少两轮质疑 Issue 此后无法访问，社区发布的补档保留了原 Issue 截图；当前两个仓库里也有多名用户公开追问“为什么删 Issue”。仅凭公开页面，我无法确认具体由谁执行了删除，Issue 消失本身也不是跑分造假的证明。

不过，对于一个缺少原始产物的评测项目，最有效的回应本应非常简单：公开日志、任务结果和复现命令。

截至 8 月 19 日，作者曾回应效率数字“确实是夸张的”，也对 J-Space 概念来源等争论留言，但没有对社区要求的完整评测配置、逐题结果、DSH 轨迹、原始耗时和 Token 数据作出实质性补充。

争论任务量是否可能、解释概念、申请 DOI，都不能替代这一步。

## 我的最终判断

如果问“作者是否承认造假”，答案是没有。

如果问“社区为什么把它称为假的”，答案也很具体：**无法复现、没有原始记录、效率宣传被作者自己称为夸张，而且单次 Terminal-Bench 分数无法从官方任务数和计分口径中产生。**

这已经不是普通的“随机波动”，而是评测报告的证据链断了。

主观造假需要证明故意，作者是否故意编造，外界目前无法确认。但一份报告是否失实，不需要等作者亲口承认。就现有公开证据而言，增强跑分与效率数字不应作为事实引用。

这也意味着，我之前对这张跑分表保留的乐观判断需要收回。J-Space 可以继续作为一种提示词工程方案被测试，但“DeepSeek 加一个 Skill 就超越闭源模型”的结论，目前没有站得住的证据。

要恢复可信度，其实不复杂：公布准确的 benchmark 版本与任务清单、每次运行的时间戳和模型参数、完整或可审计的轨迹、评分器输出与 Token 用量，再让第三方按同一流程复现。

在那之前，这不是一份被验证的能力报告。

它只是一组尚未被证明的数字。

---

**参考资料**

- [DeepSeek V4 × J-Space 能力释放报告](https://github.com/Tiger3807861189/DeepSeek-V4-J-Space-Capability-Realization-Report)
- [DeepSeek V4 Flash 官方模型卡](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731)
- [Terminal-Bench 2.1 官方说明](https://www.tbench.ai/news/terminal-bench-2-1)
- [Anthropic：A global workspace in language models](https://www.anthropic.com/research/global-workspace)
- [完整 89 题社区复现](https://github.com/Tiger3807861189/DeepSeek-V4-J-Space-Capability-Realization-Report/issues/13)
- [J-Space 社区独立 A/B 测试](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6/issues/10)
- [J-Space 与神经激活干预的概念澄清](https://github.com/Tiger3807861189/J-Space-Cognition-Suite-V3.6/issues/22)
