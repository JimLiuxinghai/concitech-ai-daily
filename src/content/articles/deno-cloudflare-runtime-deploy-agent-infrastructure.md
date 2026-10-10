---
title: "Deno 团队加入 Cloudflare：一年维护期，六个月迁移窗口"
description: "Deno 团队加入 Cloudflare。运行时维护期一年，Deploy 运营期六个月；JSR 与 rusty_v8 保留。文章介绍产品安排、celld 与 workerd 的整合计划，以及有状态 Agent 的基础设施需求。"
slug: "deno-cloudflare-runtime-deploy-agent-infrastructure"
publishedAtCST: "2026-10-10T10:01:00+08:00"
language: zh
author: JimLiu
categories: [devtools, business]
cover: "/article-covers/deno-cloudflare-runtime-deploy-agent-infrastructure.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-XYhyV1817aAnj_I_6y4_y52Z70Bs45rw3FxR0251arC"
draft: false
---

Deno 团队加入 Cloudflare，独立运行时与托管平台迎来结束开发和关停的安排。

2026 年 10 月 9 日的 Deno 官方公告给出两项期限：**Deno 运行时维护期为一年，Deno Deploy 运营期为六个月。**

Node.js 与 Deno 的创建者 Ryan Dahl，选择了新的开发方向：Cloudflare Workers 的编程模型与有状态应用基础设施。

这条新闻包含两件事。现有用户需要评估迁移，团队的后续工作指向 celld 与 workerd 的整合。后者是一项建设计划，完整成果缺少交付确认。[Deno 官方公告](https://deno.com/blog/cloudflare)

## 四项产品，四种安排

“Deno 团队加入 Cloudflare”缺少对每项产品去向的完整说明。官方公告列出了不同安排。

| 项目 | 官方安排 | 用户关注点 |
| --- | --- | --- |
| Deno 运行时 | 一年维护期；月度更新包含 bug 修复与安全更新；后续安排是团队停止开发 | 运行环境、支持来源与替代方案 |
| Deno Deploy | 六个月运营期；后续安排是服务关停；付费客户的 Workers 迁移获得支持 | 应用、数据、域名与部署链路 |
| JSR | 运营保留，基础设施迁入 Cloudflare | 包发布、依赖来源与访问稳定性 |
| rusty_v8 | 团队保留支持，整合目标是 workerd | Rust 与 V8 的绑定接口 |

Deno 代码保持开源，官方欢迎社区承接开发。社区维护是一个开放选项，稳定的维护团队、发布节奏与支持承诺需要具体项目确认。

![Deno 四项产品的安排：运行时一年维护期，Deploy 六个月运营期，JSR 保留运营，rusty_v8 保留支持](/article-images/deno-cloudflare-runtime-deploy-agent-infrastructure/product-transition.webp)

*图：Deno 官方公告的原创整理。期限使用公告原述，具体截止日期需要服务通知确认。*

运行时维护结束与程序停机具有不同含义。现有程序依赖二进制、操作系统、第三方包与外部服务；维护结束改变的是修复来源和支持安排。一个“运行成功”的结果，缺少对后续安全更新的保障。

Deploy 的服务关停涉及另一类问题。代码之外，应用具有数据、密钥、定时任务、域名和持续集成配置。平台替换需要这些组成部分的迁移验证。

## celld 与 workerd，整合目标是什么

workerd 是 Cloudflare 的开源 JavaScript / Wasm 服务端运行时，代码来源与 Cloudflare Workers 的运行时相同。仓库介绍的用途包括自托管 Workers 应用、本地开发测试与可编程 HTTP 代理。[workerd 原始仓库](https://github.com/cloudflare/workerd)

开源运行时与完整云平台之间存在距离。代码执行属于运行时职责；对象放置、请求路由、存储恢复和容量管理属于分布式系统问题。

Cloudflare 的联合公告承认，workerd 的 Durable Objects 实现存在单实例限制，适合本地测试，缺少多实例扩展能力。

celld 是 Deno 团队的开源项目。公告称，celld 使用 Rust 单文件程序，其外部服务依赖是对象存储。项目针对 Workers 与 Durable Objects 的自托管和扩展问题。

计划中的工作负责人是 Ryan Dahl 与 Bert Belder。整合目标是 celld 的代码与思路并入 workerd，自托管 Workers 成为官方支持的使用方式。[Cloudflare 联合公告](https://blog.cloudflare.com/deno-joins-cloudflare/)

这个计划改变了团队的工程重心。独立 JavaScript 运行时的开发转向分布式应用的部署模型，兼容性、安全与运维的验收记录决定计划的完成程度。

“代码保持开源”描述代码的获取条件，“自托管获得生产支持”描述部署能力与支持范围。前者缺少对后者的替代能力。

## Durable Objects 的重点是状态

Durable Objects 的对象组合了计算与持久化存储。对象具有唯一标识，请求寻找具体对象，对象负责协调相关客户端。[Durable Objects 官方文档](https://developers.cloudflare.com/durable-objects/)

SQLite 存储保存数据，WebSocket 支持实时连接。一个聊天室对应一个对象，是理解这种模型的例子：频道消息与频道连接具有共同的管理单元。

普通的代码执行任务需要输入、计算与输出。有状态应用具有另一个要求：下一次请求需要知道上一次发生了什么。

购物流程需要订单状态，协作编辑需要文档状态，Agent 需要任务状态。状态包含任务进度、工具结果、用户确认和失败记录，模型的一次回复缺少对这些内容的替代能力。

![有状态 Agent 的基础设施示意：事件输入、任务对象、持久化数据与执行工具](/article-images/deno-cloudflare-runtime-deploy-agent-infrastructure/stateful-agent.webp)

*图：原创概念示意，非 celld 与 workerd 整合后的产品架构。对象负责状态协调，模型与工具负责具体任务。*

一个 Agent 执行分析任务，外部工具产生结果，用户提出修改。任务状态需要连接这些事件，状态存储需要保留过程记录。

这是一种应用架构需求。Durable Objects 提供状态协调的原语，模型推理、权限检查、人工审批与业务验收属于另外的应用职责。

“长期状态”缺少“长期占用计算资源”的必然含义。持久化数据与执行进程具有不同生命周期，应用需要定义恢复逻辑、请求处理与重复事件的规则。

## 开发者需要迁移什么

迁移判断需要区分自托管 Deno 程序与 Deno Deploy 应用。

自托管程序的检查对象包括 Deno 专属 API、npm 依赖、文件系统、子进程、权限配置与可执行文件打包。Node.js、Workers 与其他运行环境具有不同能力边界，一个相同的 JavaScript 文件缺少对行为兼容的保证。

Deploy 应用的检查对象包括运行代码、数据库与对象存储、环境变量、密钥、域名、定时任务、监控和回滚方案。数据导出成功是一个步骤，目标系统的数据完整性与业务读写测试是另一个步骤。

一个迁移测试集需要覆盖正常请求、错误处理、长连接、任务恢复和数据校验。测试结果需要记录源环境与目标环境的差异。

官方承诺的迁移支持对象是付费客户，迁移目标是 Cloudflare Workers。该承诺缺少对每个项目的兼容性、迁移工期和具体成本的统一保证；项目确认需要服务方与客户的沟通。

自托管方案存在安全责任。workerd 的 README 提醒，它自身缺少恶意代码隔离所需的完整纵深防御；不可信代码需要虚拟机等安全沙箱的补充保护。

Agent 的工具执行与不可信代码运行具有不同风险。拥有一个开源运行时，缺少对隔离、认证、审计和资源限额的保障。

## 这次转向的含义

Deno 的开发经历覆盖了运行时、托管平台和分布式应用抽象。此次加入 Cloudflare，团队选择了共同平台的建设方向。

现有用户面对的是维护与迁移安排；新项目面对的是自托管路线图。路线图提供方向，项目验收需要稳定版本、兼容性文档和故障恢复测试。

这条新闻的重点是三项边界：运行时与托管服务不同，开源与长期维护不同，状态原语与完整 Agent 系统不同。

开发者的下一项工作是项目清单：哪些代码依赖 Deno，哪些数据依赖 Deploy，哪个团队负责维护与迁移。清单决定实际工作量，公告的期限决定安排窗口。

## 参考资料

1. [Deno：Deno is joining Cloudflare](https://deno.com/blog/cloudflare)
2. [Cloudflare：Deno is joining Cloudflare](https://blog.cloudflare.com/deno-joins-cloudflare/)
3. [Cloudflare：Durable Objects 官方文档](https://developers.cloudflare.com/durable-objects/)
4. [GitHub：cloudflare/workerd 原始仓库](https://github.com/cloudflare/workerd)
