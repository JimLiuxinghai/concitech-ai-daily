---
title: "GLM、Kimi进入Codex：OpenAI把企业预算交给开放模型？"
description: "OpenAI与Baseten合作，计划把开放模型接入Codex和Responses API。GLM-5.3 Flash、Kimi K3进入讨论焦点。企业合同、模型选择权与Agent入口成为这条消息的核心。"
slug: "openai-codex-baseten-open-models"
publishedAtCST: "2026-10-01T09:15:00+08:00"
language: zh
author: JimLiu
categories: [devtools, models, business]
cover: "/article-covers/openai-codex-baseten-open-models.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-UgNsDU30TD7-lY4MX3iOn9wsMAdg3LCgYpAM6sWLR9O"
draft: false
---

OpenAI的编程产品Codex，准备接入由Baseten提供的开放模型。GLM-5.3 Flash和Kimi K3出现在合作消息里。

消息来自Baseten与OpenAI的合作公告，也来自一条受到开发者关注的[推文](https://x.com/philipkiely/status/2105000178709360963)。推文作者Philip Kiely给出两个要点：企业团队获得Codex里的开放模型选择权；相关费用可计入OpenAI企业合同承诺。

第一点改变模型入口。第二点改变采购路径。两点合在一起，构成这次合作的新闻价值。

![OpenAI、Baseten与开放模型的合作关系](/article-images/openai-codex-baseten-open-models/cover.webp)

## 一条消息，三家角色

OpenAI提供Codex、Responses API、企业客户关系和Marketplace。Baseten提供开放模型推理服务。模型提供方贡献模型能力。企业客户负责模型选择、预算与治理。

[Baseten公告](https://www.baseten.co/blog/baseten-openai-partnership/)确认两条产品路径：Codex原生接入开放模型；Responses API提供开放模型调用。公告把Baseten列为OpenAI B2B Marketplace首批开放模型推理合作伙伴之一。

这不是Codex接入一个陌生的接口地址。合作涉及模型入口、服务供应商和企业采购合同。开发团队得到模型选择权，采购团队保留现有合同框架。

![Codex与Responses API的两条模型接入路径](/article-images/openai-codex-baseten-open-models/two-paths.webp)

推文点名GLM-5.3 Flash和Kimi K3。Baseten的模型目录收录这两个型号。具体账户的模型清单、价格、配额和开放时间，仍需以企业合同与产品界面为准。

## “计入OpenAI承诺”不等于所有人免费使用

企业采购AI服务常有年度消费承诺。团队选用其他供应商，可能面对新合同、新预算和新审批。OpenAI Marketplace试图合并其中一部分采购流程。

[OpenAI的DevDay官方说明](https://openai.com/index/devday-2026-recap/)给出了边界：**符合条件的企业客户，可以把现有OpenAI合同承诺中的一部分，用于获批合作伙伴软件。**首批合作伙伴共32家，Baseten承担开放模型服务。企业客户可以提交意向申请。

“一部分”“符合条件”“获批合作伙伴”是三个关键词。个人订阅、全部企业额度、任意第三方模型，都不在公告的明确承诺范围内。Baseten公告也附有申请入口。公告没有公布统一价格、可抵扣比例和普遍开放日期。

这项合作的价值不只是一张模型菜单。它让企业已有预算覆盖更多模型服务。采购阻力降低，模型评估才有机会进入真实生产流程。

## 讨论区把焦点放在“入口”

原帖的直接回复无法完整核验。公开可见的转引讨论提供三种观察角度。

[Gergely Orosz的转引](https://x.com/gergelyorosz/status/2105033276091961650)强调Codex CLI的开放源码属性，以及第三方模型选择。他把这看成OpenAI对竞争对手的产品策略优势。这是个人判断，不是市场份额结论。Codex CLI代码仓库采用Apache 2.0许可证；整个Codex商业产品不能由此等同于开源产品。

[Frank Downing的评论](https://x.com/downingark/status/2105020906460381276)把合作看成Agent工作流入口之争。他认为OpenAI愿意让外部模型进入自己的产品界面，原因是平台分发价值可能超过单次模型调用收入。这个推断有商业逻辑，实际收入效果还没有公开数据。

[Apoorv Agrawal的评论](https://x.com/apoorv03/status/2105011332995313986)指向企业预算：模型供应商的竞争，可能转化为年度AI支出的归属之争。这个观点对应Marketplace的合同安排，但不能推出企业预算已经被OpenAI统一控制。

三种观点关注同一件事：模型本身不再是唯一入口。开发者选择模型，企业选择合同，平台连接两端。

## 为什么先从编程Agent开始

编程任务包含需求理解、代码生成、工具调用、测试、修复和审查。每一步的成本、速度、可靠性要求不同。单一模型承担全部任务，未必拥有最佳成本结构。

代码库检索与简单修改，可以考虑低成本模型。复杂架构问题、关键审查和疑难调试，需要更高能力模型。模型路由属于工程决策，评估指标包含质量、延迟、成本与安全。

Baseten公告强调多模型路由，也给出自己的基础设施数据：90多个集群、20多个云环境、200多个算力供应商。数据出自Baseten自身披露，不能替代企业自己的稳定性测试。公告还提出美国基础设施、提示词零数据保留和区域固定能力。合规结论仍取决于合同与实际部署配置。

![企业编程Agent的模型选择与采购链路](/article-images/openai-codex-baseten-open-models/enterprise-loop.webp)

Baseten此前提供过模型切换工具，第三方模型进入编程工具并非新技术。新合作的区别，是OpenAI官方产品入口和企业采购承诺进入同一条链路。

## 一条清晰的边界

这次合作不意味着OpenAI放弃自家模型，也不意味着GLM、Kimi已经向所有Codex用户开放。它证明另一件事：OpenAI愿意让合作伙伴的开放模型进入自己的编程与API产品，并尝试用企业合同承接这部分消费。

未来的竞争问题因此变得具体：谁掌握Agent工作台，谁负责模型供给，谁获得企业预算，谁承担生产环境的可靠性责任。

开发者看到模型选择权。企业看到采购路径。模型厂商看到分发入口。Baseten得到推理订单。OpenAI保留Codex与Marketplace的位置。

这条新闻的重点，正是这五方关系的重排。

资料来源：[原推文](https://x.com/philipkiely/status/2105000178709360963)｜[Baseten合作公告](https://www.baseten.co/blog/baseten-openai-partnership/)｜[OpenAI DevDay官方说明](https://openai.com/index/devday-2026-recap/)｜[Codex CLI许可证](https://github.com/openai/codex/blob/main/docs/license.md)
