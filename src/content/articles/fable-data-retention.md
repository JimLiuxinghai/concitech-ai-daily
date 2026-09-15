---
title: "英伟达、Palantir 限制 Claude Fable：一条 30 天数据条款卡住企业 AI"
description: "The Information 披露英伟达、Palantir 与 Booz Allen 限制 Claude Fable 的敏感业务用途。争议焦点从模型能力转向输入与输出的 30 天保留政策。企业采购要求永久性零数据保留承诺。"
slug: "fable-data-retention"
publishedAtCST: "2026-09-15T08:17:45+08:00"
language: zh
author: JimLiu
categories: [business, security]
cover: "/article-covers/fable-data-retention.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-RLtYvYI2LSnRGBabnJCwrF0IW0dSCGaigm1o7tDxc2F"
draft: false
---
Claude Fable 5.1 是 Anthropic 的旗舰模型。

三家企业软件与芯片巨头给它划了一条红线。

The Information 的 9 月 14 日报道披露：英伟达、Palantir 和 Booz Allen Hamilton 限制 Fable 的敏感业务用途。专有信息准入的前提是一份永久性零数据保留承诺。

这条新闻暴露了企业 AI 的新瓶颈。

模型能力决定试用兴趣。数据控制权决定生产准入。

## 三家公司三种限制

The Information 的报道给出三种处理方式。

英伟达把 Fable 用途限定于开源软件等低敏感项目。核心业务采用自有 Nemotron 模型。供应链监控属于报道列出的自有模型用途。

Booz Allen Hamilton 禁止 Fable 接触客户专有的网络安全软件。该公司服务国防与政府客户，代码与安全研究具有高敏感属性。

Palantir 的客户软件套件缺少 Fable。条件是 Anthropic 提供具有约束力的零数据保留条款。Palantir 建议客户与模型供应商谈判数据边界。

限制措施针对一项风险转移：企业交出机密数据，模型厂商保留政策解释权。

三家公司限制措施属于 The Information 报道内容。公开公司声明缺少全部细节。本文依据报道内容，并标记报道来源。

![安全监控与商业机密的冲突](/article-images/fable-data-retention/tension.webp)

## 30 天条款

Anthropic 官方文档确认 Fable 的默认政策。

Fable 5 与 Fable 5.1 属于 Covered Models。提示词和模型输出保留 30 天。保留目的属于安全监控。政策覆盖 Anthropic API、Claude Enterprise 的相关工作区和第三方云平台。

Anthropic 给出的安全理由具有现实基础。

Anthropic 的风险模型包含跨请求、跨账号和跨会话攻击。单次请求审查看到一个切片。30 天窗口提供关联分析空间。安全系统识别批量越狱、凭证盗用和多步骤网络攻击。

训练用途与安全监控属于两件事。

Anthropic 表示，企业数据的默认训练用途为零，企业明确授权构成例外。30 天保留服务于滥用检测。这项承诺减少一种风险。保留本身的风险存在。

源代码、产品路线图、客户记录、漏洞细节和供应链数据具有商业价值。数据副本形成攻击面。人员审查形成访问面。合同变更形成政策风险。

企业安全团队关心五个问题：

1. 数据存储位置
2. 密钥所有权
3. 人员访问权
4. 删除承诺的合同效力
5. 供应商的单方撤销权

这五个问题超出“企业数据无训练用途”的承诺范围。

## EFS 的答案

Anthropic 推出 Enterprise Frontier Safeguards，简称 EFS。

客户控制的云基础设施保存 EFS 监控数据。人工审查默认归客户团队。风险识别系统读取跨会话模式。Anthropic 得到安全信号，客户保留底层内容控制权。

这套架构试图兼顾安全监控与数据主权。

Anthropic 表示，EFS 由一百多家企业客户参与设计。覆盖行业包括金融、医疗、制造、电信、法律、零售和公共部门。支持范围包括 Claude Code、Claude Enterprise、Anthropic API、Amazon Bedrock、Google Agent Platform 和 Microsoft Foundry。

EFS 的分阶段发布计划指向 2026 年秋季。符合条件的企业客户获得过渡期 ZDR。过渡期覆盖 Fable 5 与 Fable 5.1。

承诺性质构成问题。

Anthropic 的帮助文档赋予公司或云服务商修改权与撤回权。安全滥用构成一项触发因素。企业客户追求永久性合同。厂商保留撤销权。两项条款存在冲突。

技术方案解决数据位置。合同条款解决权力位置。

![前沿模型的三条数据路径](/article-images/fable-data-retention/data-paths.webp)

## OpenAI 的另一条路

OpenAI 选择 Private Safety Processing。

这套方案处于早期客户测试阶段。目标是 ZDR 与跨会话安全检测共存。

客户控制的基础设施保存客户内容，OpenAI 提供的加密存储构成另一选项。加密密钥归客户。密钥副本归客户独占。风险识别系统读取关联模式，OpenAI 接收有限安全信号。底层提示词和回答保持封闭。

OpenAI 把方案描述为 ZDR 兼容设计。企业内容的默认训练用途为零，客户主动选择构成例外。

这条路线与 EFS 的方向接近：客户控制面保存内容，模型厂商获得风险信号。

两套方案处于落地过程。Anthropic 的 EFS 采用分阶段发布。OpenAI 的 Private Safety Processing 属于预览和测试。营销表述缺少架构文档、合同文本和审计报告的证明力。

## 企业采购的新门槛

旧版模型采购表格围绕能力、价格、延迟和上下文长度。

Fable 争议增加了一组硬指标：

- 内容保留周期
- 存储基础设施归属
- 密钥控制权
- 人员审查权限
- 合同撤销条款
- 安全信号范围

这些指标改变企业 AI 市场。

第一类变化属于模型路由。

企业把公开代码、通用研究和低敏感文档交给前沿模型。核心源代码、客户数据和安全任务进入私有模型、专用部署或 ZDR 模型。多模型分级成为企业架构。

第二类变化属于供应商竞争。

模型榜单提供排序。数据条款拥有一票否决权。法务与安全团队掌握采购入口。

第三类变化属于产品架构。

数据分类、策略路由、密钥托管、审计日志和删除证明构成企业控制面。模型 API 属于系统组件。控制平面成为采购中心。

## 一份采购检查表

企业客户索要书面答案。

ZDR 是否覆盖全部模型？Beta 功能是否排除？第三方云是否适用？安全分类器保留哪些派生信号？异常事件触发什么审查？人工访问由谁批准？合同终止后的删除证明由谁签发？

“零数据保留”是一套控制系统。它包含技术事实与法律义务。产品页面存在改版周期。合同附录决定责任。审计日志决定证明能力。

Fable 的这场风波给出了一个清楚结论：企业 AI 的竞争进入控制权阶段。

模型能力冠军与数据准入冠军属于两项竞赛。

敏感数据准入取决于保留期限、密钥、审查权和撤销权。

* * *

## 参考资料

1. [The Information：英伟达、Palantir 与 Booz Allen 限制 Fable 使用](https://x.com/theinformation/status/2099505985740058711)
2. [Reuters：三家公司限制前沿模型使用的报道摘要](https://ca.investing.com/news/stock-market-news/palantir-nvidia-curb-ai-model-use-over-data-fears-the-information-reports-4838431)
3. [Anthropic：Claude Fable 5.1 数据保留政策](https://www.anthropic.com/claude/fable)
4. [Anthropic：Enterprise Frontier Safeguards](https://www.anthropic.com/news/enterprise-frontier-safeguards)
5. [Anthropic：Covered Models 数据保留说明](https://privacy.claude.com/en/articles/15425996-data-retention-practices-for-covered-models)
6. [OpenAI：Private Safety Processing 与 ZDR](https://openai.com/index/offering-zero-data-retention-for-frontier-models/)
