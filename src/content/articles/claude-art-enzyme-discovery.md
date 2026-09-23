---
title: "Claude 发现新酶系统 ART：950 个 Agent、19 亿蛋白簇、21.5 小时"
description: "Anthropic 生命科学团队报告 ART 酶系统。Claude Agent 处理 19.4 亿蛋白簇，发现逆转录酶、串联重复阵列与伙伴蛋白组合。实验确认阵列 RNA 表达，生物功能处于未知状态。"
slug: "claude-art-enzyme-discovery"
publishedAtCST: "2026-09-24T03:24:55+08:00"
language: zh
author: JimLiu
categories: [research, models]
cover: "/article-covers/claude-art-enzyme-discovery.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-XXk89kF7PebtI0ONZAZzXTf1O2uqXL4zl-iURxCfRaL"
draft: false
---

Anthropic 成立了生命科学研究组与湿实验室。团队公布的首批成果叫 ART，全称是 array-associated reverse transcriptases，中文可译为“阵列相关逆转录酶”。

Claude Agent 发现了这个系统。研究规模包含 19.4 亿个蛋白簇、949 个 Agent 会话、2.156 亿 Token 和 21.5 小时墙钟时间。

名字有冲击力。证据边界决定结论。

Claude 发现的是一组序列异常和一个新系统候选。实验团队确认了家族结构与 RNA 表达。RT 酶活性、RNA 底物、伙伴蛋白互作与生物功能处于未知状态。

“Claude 发明新 CRISPR”超出论文证据。“Claude 找到一个带有类 CRISPR 重复阵列的新型逆转录酶系统”符合证据。

![Claude Agent筛选逆转录酶候选的研究漏斗](/article-images/claude-art-enzyme-discovery/discovery-funnel.webp)

## 19 亿蛋白簇的搜索任务

逆转录酶负责 RNA 到 DNA 的复制。经典逆转录酶支撑 cDNA 合成、基因工程和多种分子生物学工具。细菌与噬菌体拥有大量功能未知的逆转录酶。

Claude 的研究任务是寻找新型逆转录酶系统，筛选线索是未知伙伴基因。

研究任务包含多个阶段。Worker Agent 制定计划并执行分析。Supervisor Agent 审查计划与结果。Curator Agent维护共享记录。Editor Agent整理候选报告。

论文记录了完整搜索漏斗：

| 阶段 | 数量 |
| --- | ---: |
| 蛋白簇 | 19.4 亿 |
| 逆转录酶簇 | 198,290 |
| 邻近蛋白家族 | 3,564 |
| 深度调查候选 | 17 |
| Agent 任务 | 119 |
| Agent 会话 | 949 |
| 研究报告 | 19 |

这轮任务消耗 77 个 Agent 小时。墙钟时间是 21.5 小时。任务运行期的人类干预量为零。

“人类干预量为零”描述 21.5 小时计算流程。整个研究项目包含科学家贡献：任务书撰写、harness 搭建、研究对象选择、报告审阅、实验设计与湿实验。

## 目标之外的异常

原任务主候选名单缺少 ART。旁支任务产生 ART 线索。

一个 Worker Agent 研究噬菌体逆转录酶与邻近基因。原伙伴基因假设遭到该 Agent 否定。逆转录酶异常进入 Supervisor Agent 创建的追踪任务。

追踪任务读取逆转录酶邻近 DNA。序列包含 14 个重复核心。每个核心长度是 16 个核苷酸。独特间隔序列的长度范围是 100 至 200 个核苷酸。

Agent 判定该模式是串联重复阵列，并检索文献与已知系统。这个谱系进入报告与人类审查流程。团队命名它为 ART。

这段路径展示了 Agent 科学的价值：预设管线负责规模，语言模型负责异常判断。传统管线搜索既定特征。ART 的决定性特征位于任务目标之外。

## ART 的三块结构

ART 系统包含重复阵列、逆转录酶和伙伴蛋白。

团队发现 95 个 ART 逆转录酶簇。28 个簇带有可检测重复阵列。阵列长度范围是 0.3 至 4.1 kb，包含 3 至 21 个重复单元。重复序列长度范围是 15 至 49 个核苷酸，间隔序列长度范围是 120 至 220 个核苷酸。

93 个完整逆转录酶序列保留催化基序 YxDD。ART 蛋白 N 端长度是 180 个残基，其他多类逆转录酶的典型值是 50 个或以下。ART 位点旁边存在三个无同源关系的伙伴蛋白家族。

![ART系统包含重复阵列、逆转录酶和伙伴蛋白](/article-images/claude-art-enzyme-discovery/art-anatomy.webp)

“类 CRISPR”标签描述阵列外观。CRISPR 身份与基因编辑能力缺少证据。

CRISPR 阵列含有重复序列与间隔序列。ART 阵列具备相似排列。两者的差异包括：ART 间隔序列长度达到 120 至 220 个核苷酸；典型 CRISPR 间隔序列长度是 30 个核苷酸左右；ART 位点周边缺少 Cas 基因。

论文定义 ART 为一种新型非编码重复元件。CRISPR 系统身份缺少证据。

## 实验确认了 RNA 表达

序列模式的实验支持来自金黄色葡萄球菌噬菌体 SA1 的公开感染时间序列 RNA 数据。

感染时间点 5、15、55 分钟的样本含有 ART 阵列 RNA。15 分钟时间点的阵列 RNA 峰值占噬菌体 RNA 的 8%。这些 RNA 呈现多个短片段，边界具有重复性。

团队构建了含 SA1 ART 系统的大肠杆菌质粒。小 RNA 测序记录到相似短 RNA。结果支持一个事实：ART 阵列产生多种独立非编码 RNA。

系统功能答案缺席。论文证据范围包括序列家族、RNA 表达与结构预测。酶活性测定、RT 产物、RNA 底物、伙伴蛋白互作、抗噬菌体作用处于空白状态。

![ART研究的确认事实与未知问题](/article-images/claude-art-enzyme-discovery/evidence-boundary.webp)

## 十次复跑，零次重复发现

复现测试提供了一项反面结果。

团队完成十次相同搜索。多数流程抽到 ART 位点。两个流程调查了 ART 谱系。阵列识别次数是零。

偶然性来自两处：任务树具有非确定性，Agent 原始 DNA 读取行为具有随机性。固定输入测试提供机制证据。

连续 DNA 读取量不足 200 个核苷酸的尝试占 39%。`≥200 nt` 组的阵列识别率优势是 16 至 32 个百分点。四个高能力模型的合并识别率区间是 29% 至 76%，分组变量是 DNA 读取量。Mythos 5 的峰值识别率是 96%。

工具数量与信息数量的增加伴随识别质量下降。文件与工具条件导致部分 Agent 回避原始序列。模型能力、上下文策略与 harness 行为是发现率的三个变量。

ART 的发现属于真实结果。发现过程的稳定性不足。

## AI 科学家的准确位置

Claude 承担了文献检索、序列搜索、候选筛选、异常识别和报告生成。人类科学家承担了问题定义、平台设计、候选审查、实验设计与湿实验。

Anthropic 的实验室使用 BSL-1 与 BSL-2 条件。团队声明实验对象排除可感染人类的病原体。湿实验执行者是人类科学家。

论文状态是预印本。同行评审结果缺席。作者单位栏是 Anthropic。模型、harness 与实验室属于同一机构。独立复现具有必要性。

ART 的生物学价值取决于功能实验。论文的即时价值来自另一处：AI 的任务范围包含论文摘要、数据库检索、既定管线执行、原始 DNA 阅读、异常识别与追踪任务提出。实验室获得候选。

这套闭环拥有充足假设。实验验证能力、复现率和研究判断是稀缺资源。

## 参考资料

1. [Anthropic：Claude discovers a novel enzyme system with CRISPR-like repeats](https://www.anthropic.com/news/claude-discovers-novel-enzyme-system)
2. [技术报告：Autonomous AI agents discover reverse transcriptases with tandem repeat arrays](https://www-cdn.anthropic.com/22573675ada52a8ca8a97a1a4b4326b2f208a071.pdf)
3. [NCBI BioProject PRJNA836150：噬菌体 SA1 感染 RNA 数据](https://www.ncbi.nlm.nih.gov/bioproject/PRJNA836150)
