---
title: "Gemini 4 Argon发布：百万Token输出，首批资格给了网络安全防御者"
description: "谷歌发布Gemini 4 Argon。模型拥有100万Token输出上限，首批权限属于Fairwind计划的网络安全防御者。本文核对官方价格、基准测试、内部案例与安全发布方案。"
slug: "gemini-4-argon-cyber-first"
publishedAtCST: "2026-10-01T09:00:00+08:00"
language: zh
author: JimLiu
categories: [models, security, business]
cover: "/article-covers/gemini-4-argon-cyber-first.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-Yase52p7lJqv8Ind_w7ie5X5_RBS9Xcbm33OPeF4O0M"
draft: false
---

谷歌发布Gemini 4 Argon。普通用户缺席首批体验名单，付费API客户排在后面。第一批权限属于Fairwind计划的网络安全防御者。

这项安排解释了Argon的产品定位。谷歌的新旗舰承担长流程工作；首发名单承担高风险能力的观察任务。谷歌把代码迁移、漏洞发现和百万Token输出放进同一产品方案。

![Gemini 4 Argon发布次序与产品定位](/article-images/gemini-4-argon-cyber-first/rollout.webp)

## 百万Token：输出上限与输入窗口的区别

谷歌宣布Argon的单次任务输出上限为100万Token。上一代上限为6.4万Token，规格提升约15.6倍。

这个数字指模型的输出容量，与输入上下文窗口、推荐回答长度属于不同概念。谷歌认为，这种空间适合深度推理与多步骤任务。公告缺少百万Token任务的延迟、成功率和成本实测。

容量增加改变了工程约束。长任务获得容纳空间，验证工作增加。生成代码对应测试，漏洞报告对应复核，跨文件改动对应审查。输出预算增加，终点检查与过程监控的负担增加。

谷歌的内部案例呈现了这条路线。量子计算团队报告一个算法优化案例：量子比特数与门操作数的乘积下降40%，比较对象是一项已发表方案。数据中心Agent方案涉及内存配置；谷歌称部署完成后的内存释放量超过300 TiB，总节省空间的估计区间为500 TiB至1 PiB。这些数字来自谷歌公告，外部复现材料缺席。

代码迁移案例具有清晰的工程边界。Argon智能体参与C/C++至Rust迁移，项目范围覆盖基础库与Fuchsia的Zircon内核。谷歌称，libgav1视频解码库的一个Rust版本替换了3.2万行手写SIMD代码。新版Rust解码器的速度是此前Rust移植版的2.7倍，输出画面相同。“2.7倍”的比较对象是Rust移植版；原C++实现的速度关系缺席公告。大规模迁移包含自动测试、人工审查和仿真测试。

![百万Token输出上限与工程验证关系](/article-images/gemini-4-argon-cyber-first/output-budget.webp)

## 跑分表的优势与短板

谷歌公开了19项比较结果。Argon取得13项第一、1项并列第一；其余5项由其他模型领先。这张表涉及GPT-6 Astra、Claude Fable 5.1和Claude Opus 5.5。

企业工作场景构成Argon的优势区。Zapier AutomationBench测量业务流程执行，Argon得分51.3%，对照模型的最高分为42.5%。Vals Index的Argon得分为68.9%，Claude Opus 5.5为67.0%。长材料关系追踪测试GraphWalks的25.6万至100万Token区间，Argon得分84.2%，GPT-6 Astra为71.8%。

软件工程结果呈现分化。DeepSWE v1.1的Argon得分为77.9%，GPT-6 Astra为74.1%；FrontierSWE v2的Argon得分为55.0%，Astra为65.5%；Terminal-Bench 4.0的Argon得分为57.4%，Opus 5.5为66.4%。网络安全修复测试CWE-bench v1的Argon与Astra均为68.0%。

![谷歌官方基准表的领先项与落后项](/article-images/gemini-4-argon-cyber-first/benchmark-snapshot.webp)

这些结果来自谷歌汇总表，测试环境多样。谷歌的方法说明指出：Argon部分成绩出自自测，竞品成绩取自厂商报告或公开榜单；各项测试的推理设置与工具配置存在差异。DeepSWE的Argon成绩采用mini-swe-agent，其他模型成绩来自不同发布渠道。OSWorld 2.0采用离线子集与部分得分。表格展示能力线索；采购决策依赖自身任务与同一测试环境。

## 网络安全首发：能力与权限绑在一起

Argon的第一批用户是受信任的网络安全防御团队。谷歌说，这批用户及内部团队获得无网络安全限制的版本，用途是漏洞发现、验证和修复。普通API用户的权限范围缺席公告。

谷歌披露了一个医疗软件案例：Wiz的公益安全项目Scan for Good使用Argon，发现一项涉及敏感个人信息的严重漏洞。公告缺少软件名称、漏洞编号与公开技术报告。案例属于谷歌与合作伙伴的陈述，漏洞影响范围与修复状态缺少独立核验材料。

这条发布路径伴随四类防护：有害请求识别、间接提示词注入防护、模型推理与行为监控、沙箱隔离。谷歌提到美国政府的模型发布前自愿访问流程。防御团队的能力开放与普通用户的安全约束，属于两套不同的权限设计。

Argon的网络安全成绩涉及不同任务。CWE-bench v1衡量漏洞修复，68%是公开对比表中的并列第一。谷歌提到的漏洞发现提升，来自内部测试与Wiz内部测试；公开表格缺少同类独立复现。

## 价格与开放日期的两种状态

谷歌公布的首发API价格为每百万输入Token 2美元、每百万输出Token 10美元。缓存输入享受95%的输入价格折扣。公告脚注写明：优惠期结束后的价格为输入4美元、输出20美元。优惠截止日缺席公告。

百万Token输出上限与每百万输出Token价格构成一种算术关系：满额输出的标价是10美元，优惠期结束后是20美元；实际账单包含输入与其他费用。单项任务的输出量、重试次数、工具成本和耗时，缺少通用数字。

首批开放名单包含Fairwind计划的网络安全防御者。谷歌给出的后续顺序是付费API客户、Google AI Ultra订阅者，以及更广泛的用户。各阶段日期缺席公告。价格属于产品方案，普通开发者的购买入口缺席公告。

决定Argon口碑的，是百万Token长任务的完成质量、网络安全权限体系的可靠性，以及公开API任务的成本与速度。谷歌交出了规格和一批案例。开发者缺少可复现的使用数据。

## 参考资料

- [Google：Gemini 4 Argon官方公告](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/)
- [Google DeepMind：Gemini 4 Argon成绩表](https://deepmind.google/models/gemini/)
- [Google DeepMind：Argon基准测试方法](https://deepmind.google/models/evals-methodology/gemini-4-argon)
- [Sundar Pichai原帖](https://x.com/sundarpichai/status/2105387952478277979)
- [dotey推文](https://x.com/dotey/status/2105396970772942935)
