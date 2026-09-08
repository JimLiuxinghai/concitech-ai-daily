---
title: "Claude 解开千禧难题？陶哲轩的澄清指向数学黑箱"
description: "一则社交媒体预测称 Claude 解开纳维–斯托克斯问题。公开证据为空白。陶哲轩的澄清内容：相关进展超出他的已知信息；原帖主题是封闭 AI 系统交出答案所造成的数学价值损失。"
slug: "claude-navier-stokes-rumor"
publishedAtCST: "2026-09-08T21:16:47+08:00"
language: zh
author: "JimLiu"
categories: [research]
cover: "/article-covers/claude-navier-stokes-rumor.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-TY9ubCXQ69lGUIeMKblIoBdXaPS6xY8HuUJJ0jymmx2"
draft: false
---
一条传闻闯进 AI 圈：Anthropic 解开了纳维–斯托克斯问题，Claude 给出答案，专家评审接手。

这项说法的吸引力来自两个名字。一个是六项开放千禧难题之一。一个是数学能力暴涨的 Claude。

结论：公开证据为空白。

Anthropic 的 Science 页面缺少对应公告。Clay 数学研究所页面给出的状态是 “Unsolved”。陶哲轩给出的澄清包含两项信息：相关重大进展超出他的已知信息；原讨论属于假设情景。

传闻是故事入口。核心问题属于另一层：正确证明与数学知识之间的关系。

## 传闻的证据等级：预测

Andrew Curran 的 X 帖子给出一项预测：Anthropic 解开了一项千禧难题；Claude 解开了纳维–斯托克斯问题；专家评审承担审阅；公告期限设在 Anthropic IPO 之前。

论文、预印本、评审人名单、Anthropic 公告：空缺。

来源性质：个人预测。

Hesamation 的帖子引用该预测，附有陶哲轩的长帖截图。这组材料形成一种联想：陶哲轩讨论纳维–斯托克斯与 AI，传闻指向 Anthropic，二者存在联系。

时间线给出反向顺序。陶哲轩六段帖的日期是 9 月 3 日。Andrew Curran 预测帖的日期是 9 月 5 日。陶哲轩澄清帖与预测帖同日。

澄清内容清楚：原帖描述一个假设场景。该问题的重大新进展超出陶哲轩的已知信息。

![陶哲轩关于纳维–斯托克斯与 AI 的讨论](/article-images/claude-navier-stokes-rumor/tao-thread.webp)

*陶哲轩六段讨论的首段。来源：Mathstodon、X 帖子截图。*

Anthropic 的公开 Science 页面列出两项近期数学成果：黎曼猜想相关下界进展，费马大定理的 Lean 形式化。纳维–斯托克斯项目缺席这份公开记录。

Clay 数学研究所官方页面的状态标签是 “Unsolved”。公开状态、公司公告、论文证据形成同一结论：传闻处于待证状态。

![传闻证据链](/article-images/claude-navier-stokes-rumor/evidence-chain.webp)

*传闻证据链。红色卡片代表空缺或待证信息。*

## 热点的燃料：Claude 数学能力

传闻的迷惑性来源是 Claude 数学能力的真实进展。

Anthropic 的黎曼猜想项目给一个内部研究模型布置任务。任务目标是黎曼猜想。猜想本体维持开放状态。一项相关结果出现：黎曼零点的临界线占比下界获得提升。数值变化：41.6% → 67.2%。

项目消耗 3100 万输出 Token。约 60 个 Claude 子代理参与第二轮探索，执行 2400 条 Shell 命令。模型生成 650 个首轮想法，首轮成功数为零。Anthropic 数学家审查了成果。外部专家审阅了论文。Lean 形式化提供机器检查。

这里的价值包含答案与过程。Anthropic 公布了论文、形式化证明、专家说明、方法解释和详细轨迹。

费马大定理项目扩大了想象空间。Anthropic 公告日期是 9 月 4 日。项目周期是 11 天。Claude 完成一份端到端 Lean 形式化。代码规模：1300 万行。输出 Token：60 亿。

任务性质是已有证明的形式化。Wiles 的定理结论拥有数学共同体认可。Claude 的贡献是形式化规模、自动协作和机器验证。

两项成果提高了“AI 能做研究数学”的可信度。两项成果的对象与纳维–斯托克斯不同。能力趋势与具体传闻属于两条证据链。

## 纳维–斯托克斯问题问什么

纳维–斯托克斯方程描述水与空气等流体。数值方法是工程师的常用工具。千禧难题问的是三维不可压缩方程的数学性质。

两条候选结局：

- 任意合格光滑初始数据对应全局光滑解；
- 某组合格初始数据产生有限时间奇点。

前者对应存在性与光滑性证明。后者对应爆破解构。任一方向满足 Clay 的正式问题要求。

这项难题与天气预报分属不同任务。计算流体力学拥有成熟工具。正则性答案造成的工程模拟改写幅度有限。数学价值来自研究过程产生的方法：弱解理论、正则性判据、不等式、偏微分方程工具和流体结构理解。

## 陶哲轩担心的是研究过程失踪

陶哲轩给出一条候选研究路线：

1. 近自相似爆破解构；
2. 数值近似解与可计算残差；
3. 重标度坐标中的稳定性；
4. 残差与稳定阈值验证。

![候选研究路线](/article-images/claude-navier-stokes-rumor/research-loop.webp)

*候选研究路线。图中内容来源：陶哲轩公开帖。*

各步骤包含失败。一个解构违反能量守恒。另一个解构败于数值实验。第三个解构暴露新的稳定性障碍。这些失败产生定理、工具和直觉。

陶哲轩担心一种封闭模式：大规模 AI 系统承担全部迭代，公司保留搜索轨迹，公众获得最终解构和形式证明。

数学获得一个答案。数学损失一张路线图。

Lean 承担答案正确性检查。解法来源、失败分支、概念动机和复用方法依赖公开记录与人类消化。形式正确性与研究传统属于不同成果。

这个担忧的对象是封闭流程。陶哲轩描述的理想路线包含机器学习模拟、区间算术、形式化、LLM 提案和人类数学家。分歧位于研究过程的开放程度。

## “解开”的三道门

一家公司宣布结果，与 Clay 承认结果之间存在很长距离。

第一道门是公开证明。审查入口覆盖命题、假设、推理链、代码和计算材料。

第二道门是合格出版物。Clay 规则排除作者提交的候选解答。符合规则的出版渠道承担候选解答的发表。

第三道门是时间与共同体。Clay 规则要求论文发表满两年，并获得全球数学共同体的普遍接受。

![千禧难题的验证门槛](/article-images/claude-navier-stokes-rumor/verification-gates.webp)

*Clay 奖项规则与数学验证层次。*

形式化证明加强第一道门。全部审查包含其他内容。形式系统检查给定命题的推理。命题定义与 Clay 原题的对应关系属于另一项检查。可复现材料覆盖数值残差、区间界、外部库和硬件计算。

“专家评审”四个字的承载范围有限。专家身份、审阅范围、公开材料与独立复现构成有效信息。

## 我的判断：数学黑箱构成核心新闻

事实清单很简单：传闻证据空白，陶哲轩澄清明确，Clay 状态为 “Unsolved”。

AI 数学能力的进步真实。Anthropic 的黎曼相关成果和费马大定理形式化说明，长周期多代理研究触碰专业数学工作的边界。

这两句话并存。二者混淆产生一条错误新闻。

可信公告包含四类材料：公开论文、可运行形式化、完整问题对应说明、独立专家审查。研究轨迹的开放程度决定成果的教学价值。

千禧难题兼具终点问题与方法矿山的双重身份。AI 挖出终点。矿道面临封闭风险。

## 参考资料

1. [Hesamation 的 X 帖子](https://x.com/hesamation/status/2096200386327511289)
2. [Andrew Curran 的预测帖](https://x.com/AndrewCurran_/status/2096062392442724805)
3. [陶哲轩：纳维–斯托克斯与 AI 的六段讨论](https://mathstodon.xyz/@tao/117207849921390904)
4. [陶哲轩的传闻澄清](https://mathstodon.xyz/@tao/117219101339291693)
5. [Anthropic：Claude 的黎曼猜想相关成果](https://www.anthropic.com/research/riemann-zeta)
6. [Anthropic：费马大定理形式化](https://www.anthropic.com/research/formalizing-fermats-last-theorem)
7. [Clay 数学研究所：纳维–斯托克斯问题](https://www.claymath.org/millennium/navier-stokes-equation/)
8. [Clay 数学研究所：千禧难题奖项规则](https://www.claymath.org/millennium-problems/rules/)
9. [陶哲轩：Mathematics in the age of AI](https://arxiv.org/abs/2608.16753)
