---
title: "Anthropic 开源电商 Agent 蓝图：不碰支付，却想占住交易前的“智能层”"
description: "Anthropic 把一年企业电商 Agent 经验做成了可 Fork 的开源仓库。两类 Agent、四套行业示例和一组安全护栏背后，是一条明确边界：Claude 负责理解与决策，目录、支付、供应链和客户关系仍由商家掌握。"
slug: "claude-commerce-agents"
publishedAtCST: "2026-09-03T12:31:24+08:00"
language: zh
author: JimLiu
categories: [products, business, devtools]
cover: "/article-covers/claude-commerce-agents.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-VbQGRhoizHWFOtNWmERu7A2exawui8cDum18Rd66qU3"
draft: false
---

电商平台做 AI，通常会给原有页面加一个聊天框。AI 公司做电商，又很容易走向另一个方向：让用户离开商家网站，在一个超级助手里搜索、比较和下单。

Anthropic 这次选了第三条路。

9 月 2 日，它开源了 Claude Commerce Agents。仓库里有面向消费者的 Shopping Agent、面向商家员工的 Merchant Agent，还有零售、旅游、电信和娱乐四套可运行的示例。商家可以 Fork 代码，再把 Agent 接到自己的商品目录、库存和订单系统。

这套蓝图的野心并不小，只是位置选得很克制：Claude 负责理解意图、调用工具和组织结果，支付与履约继续留在商家一侧。

## 一个仓库，两个 Agent

Shopping Agent 被嵌入商家的 App 或网站。顾客可以用一句自然语言描述需求，让它搜索商品、比较方案、组合多件商品、操作购物车，或者查询订单与退换货政策。

它返回的也不只是聊天文字。商品卡片、对比表和购物车都能直接出现在对话里。官方零售示例中，用户说要给喜欢积木和拼图的九岁孩子选一件 45 美元以内的礼物，Agent 找到候选商品，并把选中的积木加入右侧购物车。

![Claude Commerce Agents 的 Shopping Agent 零售示例（来源：Anthropic）](/article-images/claude-commerce-agents/official-shopping.webp)

Merchant Agent 服务商家内部人员。它可以回答销量问题，发现缺货或滞销商品，提出价格与促销建议，并起草营销活动。涉及修改库存、商品信息、价格或 Campaign 时，模型先生成一条 staged change，只有经过真实的审批界面确认后才能执行。

两类 Agent 共用一套基础组件，但可以运行在三种环境中：直接调用 Messages API、使用 Claude Agent SDK，或部署到仍处于 Beta 的 Claude Managed Agents。四个行业示例则负责说明相同结构如何适配不同业务。旅游示例有行程单和日期库存，娱乐示例有座位图与临时锁座，电信示例会处理套餐和受监管费用。

仓库还附带一个 Claude Code 插件。安装后可以输入：

```text
/scaffold-commerce-agent a shopping assistant for our store
```

插件会询问技术栈和现有系统，再生成项目骨架。后续命令可以增加业务流程、编写 Eval，或审查已有 Agent。它减少的是起步阶段的重复劳动，并不会替团队完成业务接入。

## 主架构只有一个模型

Anthropic 在工程文章中把架构写得很直白：一个模型放进标准 Agent Loop，常用规则留在 System Prompt，低频流程放进 Skills，Tools 负责调用企业已经运行多年的系统。

前面没有意图分类器，后面也没有一组按领域拆分的 Agent。Claude 自己判断该加载哪个 Skill、调用什么 Tool，再根据结果继续执行。

![Claude Commerce Agents 的核心架构（来源：Anthropic）](/article-images/claude-commerce-agents/official-architecture.webp)

这种设计在电商里有现实理由。一次需求经常横跨多个领域：顾客先按预算找商品，接着比较规格、确认库存，最后操作购物车。如果先让路由器判断“这属于搜索还是售后”，再把上下文交给不同 Agent，意图很容易在边界处被切碎，延迟和调试成本也跟着上升。

不过，“单模型”并非没有例外。Merchant Agent 在较复杂的数据分析中可以调用受限的 analysis delegate；Agent SDK 版本会把它作为只读分析子任务处理。这个委派不负责通用路由，也不能扩大可写入的对象范围。准确说，Anthropic 反对的是按组织架构复制一群领域 Agent，而非禁止所有任务委派。

Tools 的边界同样明确。商品搜索结果应该由商家的搜索与排序系统先排好，Claude 再判断哪些结果适合当前顾客。库存、价格、履约资格等业务逻辑也应留在上游系统里，不能临时塞进一个越来越臃肿的 Tool。

## 连 UI 也被做成了 Tool

电商 Agent 很难只靠文字工作。商品轮播、行程单、座位图和经营图表都有固定结构，还需要和屏幕上的真实状态保持一致。

一种常见做法是让模型输出自定义标签，再由前端解析。页面简单时还能运行，组件变多后就开始出问题：标签可能不完整，定义会不断挤占上下文，历史消息也要依赖自建解析器才能恢复。

Anthropic 的方案是把 UI 组件注册成 Tool。模型调用 `present_products`、`present_itinerary` 或 `present_plan_comparison`，参数经过服务端校验和补全，再作为事件交给客户端渲染。

这样做有两个好处。模型看到的是结构化接口，前端拿到的是通过验证的数据；同时，Tool Call 会保留在消息历史中。用户下次说“左边第三个”，Agent 仍知道上次画面上的排列顺序。

代价也很具体：工具参数需要缓冲和校验，流式显示的粒度会受到影响。官方建议逐步渲染参数，并提前执行已经完整生成的 Tool Call。Anthropic 称，这种 eager dispatch 曾把数秒的工具等待压到数百毫秒，但效果仍取决于后端接口本身。

## 最重要的设计，藏在它不做什么

Shopping Agent 可以搜索、比较和加购，却不能付款。

参考代码里的 Backend 根本没有“扣款”方法。Checkout Tool 只负责展示购物车，再把用户交给商家自己的结账页面；托管结账链接由后端返回并交给 Host 渲染，模型甚至不会看到这个 URL。

Merchant Agent 也不能凭一段对话直接修改生意。每个写操作先进入暂存区，系统生成变更 ID。价格调整、补货和 Campaign 发布必须经过 Host 标记批准，执行时还要按当前规则重新检查幅度、数量和权限。

![Claude Commerce Agents 的 Merchant Agent 零售工作台（来源：Anthropic）](/article-images/claude-commerce-agents/official-merchant.webp)

这条边界解释了 Anthropic 想做的生意。它没有再造商品目录、支付网络或供应链，而是让 Claude 站在这些系统上面，成为理解用户和编排操作的智能层。

对商家来说，这个方案有吸引力。顾客仍在自家 App 中完成交易，Checkout 与支付规则不必迁移，用户关系也不需要交给第三方购物入口。对 Anthropic 来说，只要越来越多商家用 Claude 驱动自己的 Agent，它就不必经营一个消费者商城，也能进入大量交易的决策环节。

## 安全不能只写在 Prompt 里

商品推荐答错了还能纠正，价格修改和退款一旦执行，代价就会变成真金白银。Anthropic 因此把多项限制写进代码。

购物车只能加入本次会话中由目录或订单工具返回过的商品 ID，数量和行数有上限。Merchant Agent 只能修改已经读取并进入 provenance 记录的对象。第三方文本会经过清理、加围栏和长度限制，降低商品描述或买家留言中的提示注入风险。

更危险的动作统一遵循 maker-checker：模型负责提议，人或企业政策负责批准。官方工程文章把原则说得很清楚，模型 Tool Call 不应直接移动资金，也不能直接改变业务状态。

这并不等于 Fork 后就能上线。仓库明确提醒，示例没有身份认证，MCP Server 默认只绑定本机。真实部署还要由企业补上认证授权、凭据管理、限流、欺诈规则、日志治理和个人记忆的保留政策。演示里的护栏参数也只是示例值。

## 35% 和 60%，先当作厂商案例看

Anthropic 在发布页称，使用 Claude Shopping Agent 的零售商中，购物车金额最高增加 35%，顾客完成购买的可能性最高提高 60%。

两个“最高”很重要。页面没有公开客户样本、基线、观察周期或实验设计，因此这些数字只能视为 Anthropic 汇总的客户案例，无法据此推断每家商店都能得到相同结果。

合作信息更容易核实。Shopify 已发布单独的开源参考实现，把这套蓝图接到 Catalog、UCP 和 Sign in with Shop；Priceline 表示最新版旅行助手 Penny 基于 Claude 构建。它们说明 Claude 已进入真实的电商与旅游产品，但不代表所有合作方都原样使用这次开源的仓库。

## 蓝图不是即插即用的电商系统

这个仓库采用 Apache 2.0 许可证，代码、Skill、Tool Contract、测试和四套 Demo 都可以查看。不过 README 同时写明：它是 reference implementation，不承诺维护，也不接受贡献。

这句话给预期划了一条线。企业拿到的是一套工程决策样板，不是装上 API Key 就能替换现有商城的 SaaS 产品。真正费时间的部分仍是把 Catalog、Cart、Order、Pricing 和 Analytics 接成可靠的 Backend，并把权限与审批嵌入现有流程。

Anthropic 开源的其实是一种分工：商家保留交易基础设施与客户关系，Claude 提供对话、推理和工具编排。它押注每个商家都会建设自己的 Agent，而其中相当一部分运行 Claude。通用 AI 商城并非唯一入口。

这条路线能否赢，要看商家是否愿意自己建设入口，也要看外部通用助手会不会抢先成为新的流量分配者。至少现在，Anthropic 已经把它想占的位置画得很清楚。

---

## 参考资料

1. Anthropic, [Building commerce agents with Claude](https://claude.com/blog/claude-for-commerce-agents)
2. Anthropic, [A guide to the anatomy of effective commerce agents](https://claude.com/blog/the-anatomy-of-effective-commerce-agents)
3. Anthropic, [Claude for commerce](https://www.claude.com/solutions/commerce)
4. Anthropic, [commerce-agents GitHub repository](https://github.com/anthropics/commerce-agents)
5. Shopify, [claude-for-commerce-examples GitHub repository](https://github.com/Shopify/claude-for-commerce-examples)
6. Max For AI, [原始推文](https://x.com/maxforai/status/2095254873101234583)
