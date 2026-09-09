---
title: "一万名 AI Agent 写出 166 页证明，数学研究换了一种组织方式"
description: "OpenAI 公布纳维斯托克斯千禧难题候选证明。约一万个并发 Agent 工作 88 小时，166 页论文与 Lean 形式化证明进入数学界审查。"
slug: "openai-navier-stokes-agent-proof"
publishedAtCST: "2026-09-09T09:49:43+08:00"
language: zh
author: JimLiu
categories: [research, models]
cover: "/article-covers/openai-navier-stokes-agent-proof.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-cUVzRwq3zloIyFghCGQqttNnO-FiLR9tnDrTZRH4QAN"
draft: false
---

9 月 8 日的 OpenAI 公告有点吓人。

一个内部模型组织约一万个并发 Agent，工作约 88 小时，写出一份 166 页的数学证明。GPT-6 Astra 完成 Lean 形式化和验证，耗时 17 小时。

目标是纳维斯托克斯存在性与光滑性问题。

七个千禧年大奖难题之一。

奖金一百万美元。

OpenAI 宣布候选证明解决这个问题。公司披露驱动 Agent 的内部模型强于 GPT-6 Astra，模型训练处于进行状态。

这消息像一颗深水炸弹。

数学界的共识处于形成期。OpenAI 交出来的东西值得拆开看。证明与模型是表层，研究机构是主角。

一万名 Agent 组成的研究机构。

![OpenAI 多 Agent 数学研究封面](/article-images/openai-navier-stokes-agent-proof/cover.webp)

纳维斯托克斯方程描述流体运动。水形成旋涡。空气产生湍流。血液穿过血管。飞机机翼切开气流。工程师用这组方程理解它们。

方程诞生于十九世纪。难题却留到今天。

三维不可压缩流体拥有一个光滑起点。黏性抹平速度差。问题追问一件事，有限时间奇点存在吗？

这种时刻叫奇点。

现实流体排斥无穷速度。数学模型的奇点代表连续介质描述的失效。粒子尺度接管解释工作。

1934 年的 Jean Leray 证明确认有限能量弱解存在。弱解允许某些非光滑行为。光滑起点的全时间光滑性，答案空缺了约九十年。

Clay 数学研究所列出四个可接受命题。A 和 B 证明光滑解的全时间存在。C 和 D 构造有限时间崩溃。任一命题的证明解决官方问题。

OpenAI 选择 C 和 D。

它构造了一场崩溃。

![候选证明的奇点构造](/article-images/openai-navier-stokes-agent-proof/proof-object.webp)

*图一　候选证明构造的收缩涡旋与结论边界*

论文中的流体拥有静止起点。一股光滑外力驱动流体。一个涡旋发生轴心收缩，轴向长度拉长，旋转速度增加。涡旋核心变成细长结构，像一根被拉长的意大利面。

漂亮之处是能量。

速度冲向无穷，核心体积缩小。总动能保持有限。外力保持光滑。奇点来自流体方程内部的非线性运动。构造条件排除无穷外力。

这个细节决定证明是否命中 Clay 的命题 C 和 D。

论文给出的数学对象带有外力。无外力版本属于另一组问题。奇点二字引发所有水流爆炸的误读。论文结论是一个符合官方条件的反例构造。

这够狠了。

问题是，一万个 Agent 怎么写出它？

8 月 28 日开启时间线。OpenAI 启动一个新内部模型的训练。9 月 1 日，公司听到两个千禧难题获得解决的传闻。测试集包含所有开放千禧难题和几道高影响力问题。

不同 Agent 组领取不同问题表述。纳维斯托克斯的 A、B、C、D 四个方向各有探索队伍。Agent 读取互联网缓存，运行代码，参与组内通信。

一次小题测试带来突破。近百名 Agent 的约 50 小时协作产生无外力欧拉方程的正则性反例。欧拉方程是去掉黏性项的流体方程。这个结果成为纳维斯托克斯项目的关键积木。

纳维斯托克斯项目获得资源。

其他千禧难题的 Agent 转入纳维斯托克斯项目。新训练版本加入队伍。Codex 汇总各组中间结果。高价值思路返回探索组。一个组拿到正确方向。

9 月 5 日成为候选证明的产生日期。

![多 Agent 证明时间线](/article-images/openai-navier-stokes-agent-proof/agent-timeline.webp)

*图二　模型训练、约 88 小时 Agent 协作与 17 小时 Lean 验证*

数字有点离谱。

全部问题产生 490 万条 Agent 消息和约 3000 亿输出 Token。纳维斯托克斯项目占 270 万条消息和约 1300 亿输出 Token。参与解题的并发 Agent 规模约一万个。

这幅画面属于一座数学矿场。

一部分 Agent 试方向。一部分 Agent 查文献。一部分 Agent 写推导。一部分 Agent 找漏洞。Codex 做知识汇流。模型升级像研究机构换了一批脑子。Lean 负责机器检查的证明对象。

传统数学研究包含学者讨论、学生计算、同行审稿和软件验算。区别落在规模和同步速度。一万条研究路径铺开，失败路径遭到淘汰，中间成果获得重组。

算力压缩一所研究院的组织时间。

这个判断让我兴奋，让我警惕。

并发数量制造覆盖率。正确性来自另一套机制。一万个 Agent 共享同一个盲点，1300 亿 Token 堆成一座宏伟错误，这两种风险存在。形式化验证检查形式系统中的推导。数学家审查定义、定理表述和形式化边界。

OpenAI 的措辞和媒体标题之间需要一条缝。

OpenAI 说它分享一个 solution。严谨报道采用「候选证明」这个名字。

原因来自千禧难题的制度。

Clay 的规则包含三道门。合格出版物是第一道门。两年等待期是第二道门。全球数学界普遍接受是第三道门。Clay 负责终局裁定。

OpenAI 的论文当前身份是一份公开手稿。Lean 仓库处于开放状态。接力棒交给同行评审、独立复核和时间检验。OpenAI 表示无意申领奖金。

![Clay 正式认可流程](/article-images/openai-navier-stokes-agent-proof/acceptance-gate.webp)

*图三　公开候选证明与 Clay 正式认可之间的四道门*

这份克制增强新闻可信度。

这几道门让模型表演变成科学事件。

数学不同于多数生成任务。文章依靠风格过关，代码依靠测试过关，证明要求每一步成立。一个错误符号推倒 166 页。漫长确认期说明这类问题的价值。

另一个问题占据我的注意力。

哪件事占据首位？一个模型知道了新数学，还是一万名 Agent 学会了组织研究？

我的答案是后者。

单模型能力决定每个研究节点的质量。Agent 系统决定研究节点的规模、分工和信息流。模型像研究员，编排系统像研究所。两者相乘，得到 88 小时和 166 页。

科学史记录类似变化。望远镜扩展观察距离，粒子加速器扩展实验能量，超级计算机扩展模拟规模。多 Agent 系统扩展研究分支数量。

一名学者的毕生路线数量有限。一万个 Agent 铺开一片搜索面。

搜索面扩大，稀缺对象迁移。

问题选择、验证标准、资源分配、结果解释和责任归属成为瓶颈。人类研究者卸下每一步推导，接手研究机构设计、验收门槛定义和知识库收录判断。

新闻的震撼来自这一层。

166 页证明的命运有两种，接受或某页错误。数学界负责裁决。

一万名 Agent 组成研究机构，这件事成为事实。

## 参考资料

1. OpenAI，On the Navier–Stokes Millennium Prize Problem

https://openai.com/index/navier-stokes-solution/

2. OpenAI，Finite Time Blowup for Navier–Stokes

https://cdn.openai.com/pdf/32d9f210-8b73-45e0-91bc-82a30aef8a9a/navier-stokes.pdf

3. OpenAI，NavierStokesAndEuler Lean 证明仓库

https://github.com/openai/NavierStokesAndEuler

4. Clay Mathematics Institute，Navier-Stokes Equation

https://www.claymath.org/millennium/Navier-Stokes-Equation/

5. Clay Mathematics Institute，Rules for the Millennium Prize Problems

https://www.claymath.org/millennium-problems/rules/
