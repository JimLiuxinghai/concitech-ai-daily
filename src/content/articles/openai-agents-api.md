---
title: 'OpenAI 发布 Agents API，Agent 创业的护城河塌了一层'
description: 'Codex harness 获得 Agents API 托管服务形态。OpenAI 承担会话、编排、上下文压缩和恢复，开发者提供业务工具与运行环境。Agent 基础设施获得云服务形态，产品价值转向数据、流程、评测与客户关系。'
slug: 'openai-agents-api'
publishedAtCST: '2026-09-12T06:20:48+08:00'
language: zh
author: JimLiu
categories: [devtools, products]
cover: '/article-covers/openai-agents-api.webp'
wechatMediaId: 'qwac_8j4kaaga6WV5YUa-dcRx9XC2dUuPqQNd2g2Wzia18r3CDWHJ-e_WI5mx1pv'
draft: false
---


OpenAI 发布 Agents API。

一次调用包含四样东西，任务、模型、工具、运行环境。

系统接管会话、Agent Loop、上下文压缩、故障恢复与子 Agent 编排。Linux sandbox 提供代码执行、文件操作和产物保存。MCP、自定义函数和 Web Search 提供外部能力。

这听着像一份功能清单。

它瞄准的东西叫 Agent 地基。

OpenAI 的发布日期是 2026 年 9 月 10 日。产品状态是 public beta。所有开发者拥有访问资格。Agents API 本体缺少附加费用，账单包含模型、OpenAI 工具与托管容器。

原推文给了一个判断，OpenAI 抢走了一层基础设施。

这个判断带着杀气。方向准确。

Agents SDK 交付代码包。Agents API 交付托管责任。

两个名字差一个词，商业含义差了一整层。

![Agents API 管理 Codex harness 与 sandbox，图片来源，OpenAI 官方文档](/article-images/openai-agents-api/overview.webp)

Agent 产品包含一段隐蔽的中间层。

模型负责推理。产品负责接收需求。两者之间塞着一台隐形机器。

这台机器维护会话，挑选工具，处理失败，压缩上下文，保存中间产物，恢复长任务，管理子 Agent。模型的一次漂亮回答缺少这台机器的保障。生产任务耗时数小时。任务状态跨越多个上下文窗口。工具调用包含审计与重试需求。

这台机器叫 harness。

很多 Agent 创业公司的早期代码量集中于这块。团队设计消息结构、工具协议、任务队列、容器生命周期和状态存储。模型升级带来接口变化。工具数量增长带来上下文膨胀。任务时长增长带来恢复问题。

产品经理想做一个报销 Agent。工程团队收到的工作清单像一套分布式系统。

荒诞感来自这里。

Agents API 改写这张工作清单。OpenAI 管理 session、orchestration、context compaction 和 recovery。应用提交任务、模型、工具和环境。事件流与 webhook 返回过程状态。同一个 session 接受续写、转向和恢复。

一句 API 调用遮住了一堆脏活。

这件事的分量超过一次 SDK 更新。

数据库行业走过相似路线。早期创业公司维护服务器、复制、备份和故障切换。云数据库承接这些工作，服务形态成型。公司保留数据模型、查询逻辑和业务权限。基础设施团队失去一部分工作，应用团队获得一部分速度。

Agents API 使用同一套逻辑。

上下文管理获得云服务形态。子 Agent 编排获得云服务形态。sandbox 生命周期获得云服务形态。harness 版本升级获得云服务形态。

Agent 创业公司的护城河少了一层。

这句话引出另一个误会。基础设施商品化与公司消失属于两个命题。

Stripe 提供支付基础设施，电商公司保留生意。AWS 提供计算基础设施，SaaS 公司保留产品。Agents API 提供 Agent 基础设施，行业知识、私有数据、业务流程、评测体系和客户关系留给应用公司。

护城河的位置发生移动。

公司的收费产品是 context compaction 或 tool loop。此类公司承受压力。掌握医院病例流程、制造业质量数据或保险理赔规则的公司获得底层减负。

这块带着现实的痛感。

技术组件的价值缩水。业务结果的价值放大。

![OpenAI 托管 Agents API，sandbox 支持 OpenAI 或第三方环境，图片来源，OpenAI 官方文档](/article-images/openai-agents-api/hosted.webp)

OpenAI 保留了运行环境的选择权。

开发者拥有三类方案。第一类是 none。OpenAI 托管 sandbox 构成第二类。自有基础设施或合作伙伴 sandbox 构成第三类。

这个设计缓解了一个典型矛盾。

OpenAI 的目标包含 harness 托管。企业目标包含代码、数据、网络和计算资源控制。self-hosted environment 留住计算控制权。OpenAI 的 harness 保留会话和编排职责。应用服务负责环境生命周期与连接器。

云端大脑，私有机房里的手脚。

OpenAI 公布的合作伙伴名单包含 Cloudflare、Vercel、E2B、Modal、Oracle、DigitalOcean、Daytona、Blaxel 和 Runloop。不同环境提供 VPC、存储、CPU、GPU、内存与冷启动方案。

生态位发生重排。

模型公司拿走 harness。sandbox 公司保留算力与隔离。应用公司保留业务与界面。中间商寻找新位置。

![自托管 sandbox 的会话与执行流程，图片来源，OpenAI 官方文档](/article-images/openai-agents-api/self-hosted.webp)

官方页面放了几组客户数据。

Ciridae 称评测分数起点是 0.71，终点是 0.85，子 Agent 流程延迟指标改善四倍。SafetyKit 称单个案件成本下降 60%。Hypha 称失败响应下降 86%。

这些数字属于客户陈述。统一测试设置与独立复核处于缺席状态。它们说明需求。通用性能结论需要统一测试与独立复核。

public beta 这个标签有分量。

OpenAI 的公开计划包含反馈收集与产品迭代。接口和行为存在变化空间。生产团队处理版本变化、限额、成本与可观测性。托管减少运维责任。供应商依赖增加。

数据边界带着一根刺。

官方文档注明 Agents API 的数据驻留区域限美国。Zero Data Retention 状态是缺席。self-hosted sandbox 保留同一限制。Agents API 保存会话状态。开发者拥有删除 session 与已发布产物的接口。

托管 sandbox 的网络默认值是 enabled。生产配置包含网络权限审查。restricted 模式接受域名白名单，disabled 模式阻断外连。

医疗、金融、政府和涉密业务盯着这些条款。

速度是一张表。合规是另一张表。

一个问题浮出水面，OpenAI 的整套 Agent 栈控制程度是多少？

答案缺少简单形态。

Agents API 依托开源 Codex harness。开发者拥有源码查看入口。自托管计算保留基础设施选择。MCP 和函数工具保留外部系统接口。

托管服务形成另一种吸力。session 语义、事件模型、子 Agent 编排和恢复机制形成依赖。依赖增长带来迁移成本增长。开源代码提供透明度。托管状态与生产运维决定粘性。

OpenAI 销售的核心是免维护。

这类产品改变创业公司的资源分配。十个人的团队分出三个人维护 Agent Runtime。Agents API 释放这三个人。客户流程、评测数据和产品体验获得投入。

另一面成立。Harness 创业公司面对平台挤压。通用编排、通用记忆、通用 sandbox 接口和通用多 Agent 管理失去稀缺性。模型厂商与云厂商具备捆绑优势。

剩下的路指向垂直深度。

报销 Agent 需要企业财务规则。客服 Agent 需要商品知识与客诉政策。SRE Agent 需要服务拓扑、事故历史和权限边界。研究 Agent 需要资料质量、引用规范和验证流程。

通用 API 容纳这些东西的能力有限。

它们构成产品。

我的判断是，Agents API 制造两类赢家。第一类赢家拥有业务数据与分发。第二类赢家拥有平台缺口，安全、评测、治理、跨模型兼容与特殊计算环境。

中间那批公司承受最大压力。它们售卖一套薄 harness，价值主张来自技术组装。组装工作获得 OpenAI 云服务形态。

Agent 行业经历过模型层竞争、工具层竞争和工作流竞争。Agents API 给了一个清晰信号，通用运行时属于平台层。

创业公司需要回答一个新问题。

云厂商拿走 Agent 地基。你的公司剩下什么？

一个 prompt 和几段 glue code 构成一种答案。这种答案对应见底的护城河。

客户依赖的数据、流程和结果构成另一种答案。Agents API 是它的加速器。

同一条 API，两种命运。

欢迎点赞与转发。

感谢阅读。期待下一篇相见。

> / 作者，JimLiu
>
> / 投稿或爆料，请联系邮箱，wzglyay@virxact.com

## 参考资料

- [OpenAI 官方发布文章](https://openai.com/index/introducing-the-agents-api/)
- [OpenAI Agents API 概览](https://developers.openai.com/api/docs/guides/agents-api/overview)
- [OpenAI Agents API 架构](https://developers.openai.com/api/docs/guides/agents-api/architecture)
- [OpenAI 托管 sandbox 文档](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted)
- [原始 X 推文](https://x.com/maxforai/status/2098334720677282098)
