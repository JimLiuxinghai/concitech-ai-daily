---
title: "Meta Muse的野心：愿望执行器需要数字生活钥匙"
description: "Alexandr Wang称Muse是一位人生总经理。产品连接邮件、日历、浏览器和支付系统，专属虚拟机与Sentinel承担权限控制。愿望执行能力带来一笔清晰交易：代理权增量对应数据访问增量。"
slug: "meta-muse-digital-life-keys"
publishedAtCST: "2026-09-28T05:05:00+08:00"
language: zh
author: JimLiu
categories: [products, business, security]
cover: "/article-covers/meta-muse-digital-life-keys.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-ekUlVHNYi5Vym_WmksMJK6_4XUrwe0IPm1AfA1gYc6i"
draft: false
---

Alexandr Wang撰写一篇Muse短文。全文省略参数、跑分和模型架构。主题是人的愿望。

大量愿望死于两个障碍：模糊的起点，一通拖延的电话。陪伴家人、改善饮食、开一家面包店、做一个App，这些目标缺少执行链。

Wang给出的角色是一位“人生总经理”。工作清单包含计划、邮件、电话、资金和进度。人类保留愿望，Muse接管麻烦。

Meta的产品文档补上技术代价。Muse需要邮件、日历、浏览器、社交账号、支付权限和长期记忆。愿望执行器需要数字生活钥匙。

![Meta Muse与数字生活钥匙](/article-images/meta-muse-digital-life-keys/cover.webp)

## 一篇愿望宣言

原文标题是《Why We’re Building Muse》，发布日期是2026年9月25日。作者Alexandr Wang的职务是Meta首席AI官，履历包含Scale AI创始人。

文章描述一种普遍困境。人有欲望，现实有表格、守门人、日程和琐事。大量目标缺少表达机会，执行机会稀缺。Wang称每个落空的愿望是一场“人类潜能的安静悲剧”。

Muse的设定接近第二颗心智。它理解半句话，补全目标，建立计划，发送邮件，拨打电话，寻找资金，追踪任务。产品使命是帮助用户建造想要的世界。

这份宣言省略产品细节。Meta的三份官方材料提供完整轮廓。Muse是一名长任务个人Agent。它的运行环境是一台专属云电脑。

## 聊天框背后的云电脑

Muse的发布日期是2026年9月8日。美国市场承担首发范围。入口包含iOS、Android、Web、WhatsApp和Mac。AI眼镜进入产品路线图。免费层带有使用限额，订阅层扩展用量。

聊天承担入口角色。每名用户拥有一台Muse Secure VM。虚拟机包含Linux环境、文件系统、终端和Chromium浏览器。Agent编写代码，创建工具，运行定时任务，调度子Agent，操作网站和连接器。

连接器覆盖邮件、日历、Instagram、Facebook及第三方服务。任务形态包括填写表格、预订行程、生成文档、购买商品、追踪目标和监控事件。App关闭状态保留后台任务。

官方设计文档给出一个家庭案例。Muse读取学校邮件和学区网站，提取日期，更新家庭日历，准备购物车，并发现一项体育选拔报名。这个案例来自产品团队成员，证据性质属于公司自述。

![Muse从愿望到行动的产品结构](/article-images/meta-muse-digital-life-keys/action-stack.webp)

## Sentinel掌握行动闸门

个人Agent面临一个安全难题。系统拥有三类能力：私人数据读取、外部内容接触和网络行动。恶意网页中的Prompt Injection构成数据泄露和错误操作诱因。

Meta给Muse设计了两层安全域。核心Agent和工作文件位于Runtime Cell。凭据、连接器执行器、状态数据库和权限服务位于隔离域。真实密码与Token进入专用存储，核心Agent接收替代令牌。

Sentinel是权限中心。所有连接器动作和网络出口归它管辖。Muse提交动作、范围和目的；Sentinel执行允许、拒绝或人工审批。授权类型包含单次、会话、任务、限时和永久五种。

邮件发送、商品购买和数据外传触发结构化审批卡。用户获得接受与拒绝按钮。审批状态属于系统能力，聊天承诺缺少约束力。活动日志记录执行历史与行动计划。

浏览器采用独立Broker。浏览器Agent读取Accessibility Tree。CDP控制归属Broker，页面脚本执行权限缺席。用户接管浏览器触发Agent暂停。

![Muse的Sentinel权限与安全结构](/article-images/meta-muse-digital-life-keys/security.webp)

## 安全承诺的边界

Meta声明广告系统与Muse对话、VM数据保持隔离。模型训练数据包含经过身份信息清洗的推理轨迹。用户拥有训练退出开关。

广告影响存在另一条路径。Muse访问商户网站，这次访问属于用户活动。Meta列出的风险路径包含商户访问记录与Instagram广告关联。Facebook Marketplace操作与广告推荐关联属于另一条路径。

Meta拥有发布版VM数据访问权，适用事项包含服务支持、安全和运营。Muse Confidential VM承担密码学隔离目标，项目处于小规模测试和外部审计阶段。产品路线图标注发布时间：2026年末。

Prompt Injection保持开放问题。Meta的漏洞奖励上限是30万美元，单用户Prompt Injection漏洞奖励上限是13万美元。奖励计划提高漏洞发现概率，零风险结论缺少依据。

审批机制有人类弱点。高频审批产生点击惯性。Meta设计团队称其为Banner Blindness。撤销成本高的动作承担高阻力，普通浏览承担低阻力。边界调校决定体验和事故率。

## Muse售卖代理权

聊天机器人售卖答案。Muse售卖代理权。两类产品拥有不同评价指标。

答案型产品关注正确率、速度和表达。代理型产品关注任务完成率、权限精度、恢复能力和审计记录。一个错误答案消耗时间，一次错误付款、邮件或账号操作产生现实成本。

Meta拥有一组分发资产：WhatsApp、Instagram、Facebook、Messenger、Marketplace和AI眼镜。Muse获得现成的沟通入口、社交关系、商业场景和设备触点。这些资源构成Meta与独立Agent公司的差异。

优势与风险来自同一处。Muse的效用依赖账户权限、长期记忆和行动通道。这三项资源构成攻击面。个人Agent的竞争包含模型能力、身份系统、支付保护、权限设计和事故处理。

## 愿望之后是责任

人的欲望占据Wang短文的中心。这个切口接近日常需求，超级模型属于另一种叙事。多数用户的目标是取消订阅、安排旅行、处理邮件、完成拖延的事情。

愿望本身带有歧义。一句“我想健康一点”包含四种解释：饮食、睡眠、运动、医疗。目标理解出现偏差，执行能力放大偏差。提问、暂停和人工责任构成Muse的必要机制。

Meta给出一套具体工程答案：专属VM、隔离凭据、Sentinel、审批卡和活动日志。工程答案减少风险，产品承诺的检验证据是实际使用记录。

Muse的愿景是八十亿人的行动力。产品成败取决于两个结果：愿望获得多少执行，数字生活付出多少风险。

---

## 参考资料

1. Alexandr Wang, [Why We’re Building Muse](https://x.com/i/article/1884367148363177984)
2. Meta, [Introducing Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)
3. Meta, [Muse产品页](https://ai.meta.com/muse/)
4. Mona Sarantakos, Christine Awad, [How We Designed Muse](https://introducing.muse.ai/)
5. Tarek Sheasha, [How We Built Safety Into Muse](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse)
6. 宝玉, [相关推文](https://x.com/dotey/status/2104026234434810001)
