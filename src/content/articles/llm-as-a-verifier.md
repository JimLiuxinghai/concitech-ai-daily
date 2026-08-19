---
title: "DeepSeek V4 连跑5次，竟超过Fable 5？Agent的算力该换地方了"
description: "DeepSeek V4 Flash 连跑5次，再由自己选优，Terminal-Bench 2.1 成绩达到88%。但这是否意味着它真的超过了Fable 5？"
slug: "llm-as-a-verifier"
publishedAtCST: "2026-08-19T10:53:13+08:00"
language: zh
author: JimLiu
categories: [research, devtools]
cover: "/article-covers/llm-as-a-verifier.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-Rcb7D89O8owwGDkpfDKNaCVWk_sLfFzqt0sWSFsFqBx"
draft: false
---
同一个 DeepSeek V4 Flash，一边做题，一边检查自己的答案。

结果还真有用。

在 Terminal-Bench 2.1 上，随机取一条 DeepSeek V4 Flash 的 Agent 轨迹，成功率是 78.7%。每道题生成 5 条轨迹，再由同一个模型担任 verifier，从中选出一条，成功率达到 **88.0% ± 0.6%**。

这个数字确实超过了 [Terminal-Bench 2.1 官方验证榜单](https://www.tbench.ai/leaderboard/terminal-bench/2.1?verified=true)上的 Fable 5：Fable 5 配合 Claude Code 的成绩是 83.8% ± 1.2%，DeepSeek 这套方案高出 4.2 个百分点。

但超过它的是“DeepSeek V4 Flash + 5 次完整执行 + verifier 选优”这套系统，不是 DeepSeek V4 Flash 的单次模型能力。Fable 5 使用 Claude Code，两边的 Harness 也不同。88% 目前是项目仓库报告的复现实验结果，还没有作为一条官方验证记录出现在 Terminal-Bench 榜单上。

先把最容易误读的地方说清楚：这不是把 DeepSeek V4 Flash 的单次能力从 78.7% 升级到了 88%。它做的是 Best-of-5，先完整执行 5 次，再选一个最可能正确的结果。作为参照，如果有一个永远不会选错的“上帝裁判”，这 5 条轨迹的成功率上限是 96.6%。

所以这个实验真正问的是：

**当正确答案已经藏在多次尝试里，模型能不能把它找出来？**

来自 Stanford、UC Berkeley 和 NVIDIA Research 的 [LLM-as-a-Verifier](https://github.com/llm-as-a-verifier/llm-as-a-verifier)，就在研究这件事。

## 模型已经会做了，只是不知道哪次做对了

我们习惯把 Agent 失败归结为模型不够强，于是继续加长思考、升级模型、堆工具、改提示词。

论文给出了另一种解释：不少难题并非模型完全不会。让它多运行几次，正确轨迹往往已经出现，只是系统缺少一个靠谱的选择器。

[论文](https://arxiv.org/abs/2607.05391)把 Terminal-Bench V2 榜单里的轨迹汇总后发现，随着候选数量增加，Oracle Pass@K 最终可以到 98.9%。这里的 Oracle 不是可部署方案，它提前知道每条轨迹的真实成败。这个数字只用来说明，生成端留下的潜在空间很大。

问题从“怎样生成正确答案”，变成了“怎样识别正确答案”。

这两种能力并不相同。一个程序员可能会写出有 Bug 的代码，但把两个版本并排放在面前，他往往能看出哪个更可靠。模型也有类似现象：第一次未必做对，面对几条完整轨迹时，却可能识别出谁找到了真正的根因、谁跑过有效测试、谁只是在终端里忙了很久。

## 普通 LLM Judge，把犹豫丢掉了

常见的 LLM Judge 会读完答案，输出一个 1 到 5 分。

麻烦在于，最终那个整数只保留了概率最高的 token。模型心里可能是“5 分有 45%，4 分有 40%，3 分有 15%”，输出却只剩一个 5。另一条明显更好的答案也可能拿到 5 分，于是打平。

在论文分析的 Terminal-Bench 任务 `query-optimize` 中，一条轨迹确实验证了 SQL 优化前后的结果一致，另一条没有在原数据库上完成等价性验证。普通 1 到 5 分 Judge 重复评估 100 次，有 88 次把两者打成平手。

LLM-as-a-Verifier 不只看模型最终选了哪个分数，而是读取整组评分 token 的概率分布，再求一个期望值。还是上面的例子，分数不再是 5，而会变成一个连续值。相近的判断终于能拉开一点距离。

在同一个案例里，只把 5 档评分改成概率期望，正确轨迹在 100 次评估中胜出 69 次；把评分粒度扩大到 20 档后，胜出 77 次，而且不再出现平局。

它仍然会错。剩下的 23 次错误很重要，因为这说明 verifier 不是“真相机器”。它只是比一个粗糙的整数 Judge 多保留了一些信号。

## 它把验证算力花在三个地方

项目把验证拆成了几组可以调节的参数。

第一是评分粒度。评分 token 从 1 档扩到 20 档，模型对两个候选的细微偏好更容易显现。在 Terminal-Bench 的配对实验中，识别准确率从 73.1% 提升到 77.5%。

第二是重复评估。同一对候选换顺序、多评几次，再把结果平均。重复次数从 1 增加到 16 时，准确率从 74.7% 提升到约 77.4%。代价也很直接：更多调用、更多 Token、更长等待。

第三是拆分验收标准。检查代码时，不笼统地问“做得好不好”，而是分别看根因是否找对、修改是否合理、验证是否充分。单项标准的准确率在 75.2% 到 76.4% 之间，组合后达到 78.3%。

候选一多，两两比较会迅速变贵。项目因此设计了 Probabilistic Pivot Tournament：先让候选在一个环上相互比较，选出少量强候选作为 pivot，再让其他候选重点和它们比赛。比较复杂度由 O(N²) 降到 O(Nk)，其中 k 是 pivot 数量。

这套设计很像招聘。没必要让 100 位候选人彼此面试，只需要先筛出几位基准候选，再围绕他们做深入比较。

## 结果不只来自代码任务

论文报告了几组不同领域的结果：

| 场景 | 候选的平均/随机成功率 | Verifier 选择后 | Oracle 上限 |
|---|---:|---:|---:|
| Terminal-Bench V2 | 83.1% | 86.5% | 92.1% |
| SWE-Bench Verified | 76.1% | 78.2% | 84.4% |
| MedAgentBench | 70.2% | 73.3% | 75.0% |

在机器人轨迹偏好判断 RoboRewardBench 上，它报告了 87.4% 的准确率，高于论文所比较的几个专用奖励模型。这里使用的是视觉语言模型来读取机器人执行视频，并没有为这个任务额外训练 verifier。

这些数字不能简单横向相加。各项实验使用的候选模型、Agent Harness、候选数量和评价指标并不完全相同，“SOTA”也只是论文发布时的对照结果。比较稳妥的结论是：同一种概率化验证方法，在代码、医疗和机器人轨迹上都获得了正向结果。

## 同一个模型，为什么能审出自己的错？

8 月更新的 0.2.0 版本做了一个更有意思的实验。

89 道 Terminal-Bench 2.1 任务，每题由 DeepSeek V4 Flash 生成 5 条 mini-swe-agent 轨迹，然后仍由 DeepSeek V4 Flash 负责比较。Best-of-3 从 79.4% 提升到 86.5%，Best-of-5 从 78.7% 提升到 88.0%。仓库公开了 445 条原始轨迹和运行脚本，可以逐题检查，也可以重新支付 API 成本复算 verifier 分数。

这说明生成错误和识别错误并不总是重合。同一模型在开放式生成时要连续做很多决定，早期一步走偏，后面会越走越远；验证时，它面对的是已经完成的两条轨迹，问题缩小成了“哪个更符合验收条件”。后者有时更容易。

但“自己审自己”也会共享盲区。如果五次都没做对，verifier 无论如何也选不出正确答案；如果模型误解了题目，它也可能坚定地偏爱同一种错误。Best-of-5 的 Oracle 是 96.6%，实际选择结果是 88.0%，中间仍有 8.6 个百分点没有拿到。

## 真正该怎么算这笔 Token 账

Best-of-5 的生成量接近单次执行的 5 倍，后面还要加上多轮两两验证。并行请求可以缩短墙上时间，却不会让 Token 消失。

项目 0.2.0 专门优化了前缀缓存。Terminal-Bench 2.1 的 verifier 提示词包含很长的候选轨迹，调整公共前缀后，缓存命中率从 5.2% 提升到 78.4%，未缓存输入 Token 约减少 3.4 倍。注意，这是 verifier 输入端的优化，不代表整套 Best-of-5 只增加一点成本。

因此，最合适的用法不是给每一句对话都套一个 verifier，而是按风险分配预算：

1. 普通问答、简单改文案、可立即撤销的操作，继续单次执行。
2. 大型代码修改、线上故障修复、医疗流程模拟等高代价任务，生成 3 条候选，再做验证。
3. 只有当候选分数接近、测试结果冲突或 verifier 不确定时，才追加到 5 条或提高重复次数。
4. 能用编译器、单元测试、数据库约束验证的部分，先用确定性工具；LLM verifier 只补语义判断的空白。

我更看好“动态验证预算”，而不是默认 Best-of-5。先跑一次。如果测试全过、改动范围清楚，就直接结束；只有证据不足时才分叉更多轨迹。这样才能把额外 Token 花在真正困难的那一小部分任务上。

## 现在能不能直接用？

项目已经提供 `select`、`compare`、`track` 等接口，还有一个名为 [TurboAgent](https://github.com/llm-as-a-verifier/TurboAgent) 的代理：它位于 Claude Code、Codex 等客户端和模型 API 之间，并发生成多个回复，再用 verifier 选出结果。

不过当前版本仍标记为 Beta。

截至 8 月 19 日，仓库有两个未关闭问题指出，自托管 DeepSeek V4 Flash 的部分 vLLM reasoning parser 配置会让分数静默退化成 0.5。其中一份报告称，357 个缓存分数里有 78 个受到影响。问题提交者说明，论文使用的 DeepSeek 托管 API 和 Gemini 路径不受这项具体缺陷影响。

仓库里的 Best-of-5 复现脚本也有一处值得核对：文件说明写的是 `pivots=2`，实际常量是 `PIVOTS=1`。这不等于论文结论有问题，但足以提醒使用者，跑完脚本不能只看最后一行成功率，还要检查分数分布、原始轨迹、调用参数和失败日志。

## 我认为最值得带走的东西

过去一年，Agent 系统把大量精力花在生成端：更强模型、更长上下文、更多工具、更复杂的循环。

LLM-as-a-Verifier 提醒我们，系统里还缺一个认真验收的人。

它没有声称一份 skill.md 能让模型凭空跨代，也没有把 Best-of-N 包装成模型单次能力。正确答案来自多次昂贵的尝试，提升来自更好的选择。这笔计算账摊开后未必便宜，却比神秘的“能力增强”更容易审计。

如果模型已经有较高概率做对，继续把全部算力压在一次越来越长的推理上，未必划算。让几条思路独立走完，再把验证做细，可能更稳。

Agent 接下来的竞争，也许不会只看谁更会写代码，还要看谁更会验收代码。

但在那之前，请先让 verifier 通过它自己的验收。

---

**参考资料**

- [LLM-as-a-Verifier GitHub 仓库](https://github.com/llm-as-a-verifier/llm-as-a-verifier)
- [LLM-as-a-Verifier 论文](https://arxiv.org/abs/2607.05391)
- [Terminal-Bench 2.1 官方验证榜单](https://www.tbench.ai/leaderboard/terminal-bench/2.1?verified=true)
- [自托管 vLLM 分数退化问题 #5](https://github.com/llm-as-a-verifier/llm-as-a-verifier/issues/5)
- [Constrained-prefill 分数提取问题 #10](https://github.com/llm-as-a-verifier/llm-as-a-verifier/issues/10)
