---
title: "OpenCode 确认安全事件：1.4% Console 用户受影响"
description: "OpenCode 官方披露安全事件，影响范围为 1.4% 的 Console 用户。本文核对公告与接入文档，区分本地工具、云端网关与凭证托管，解释蒸馏攻击的含义，并提供通知核验、日志排查和凭证处置建议。"
slug: "opencode-console-security"
publishedAtCST: "2026-10-18T07:04:55+08:00"
language: zh
author: JimLiu
categories: [security, devtools]
cover: "/article-covers/opencode-console-security.webp"
draft: false
wechatMediaId: "qwac_8j4kaaga6WV5YUa-TA87hQpx-y7NiXXScTnYdDFPvzMy4tPKZi2uckgjDd9"
---

OpenCode 官方确认了一起安全事件。

公告的北京时间是 2026 年 10 月 18 日 02:08。官方披露，事件关联一次大规模蒸馏攻击，影响 1.4% 的 OpenCode Console 用户；受影响人群是连接外部供应商的部分用户。[官方公告](https://x.com/opencode/status/2111519637049319818)

官方称，受影响用户收到邮件通知，处置工作涉及 Anthropic、OpenAI 和 Google。公告披露时的事件状态是处置进行中。

核查结论需要两层区分：官方披露属实；影响比例来自官方，技术细节需要事件复盘与额外证据。

“所有 OpenCode 用户的 API Key 泄露”“本地代码仓库被盗”，属于超出这份公告的结论。

## 一、1.4% 的分母，是 Console 用户

这项比例的分母是 OpenCode Console 用户，区别于全部 OpenCode 使用者。公告界定的人群是外部供应商连接用户中的一部分，绝对人数属于待确认事项。

官方的通知口径是：受影响用户收到邮件，其余用户属于官方当时判定的未受影响范围。这是厂商披露时点的判定，邮件送达与调查范围需要结合后续公告核对。

本文核查的原帖省略了入侵路径、具体访问字段、持续时间和完整修复细节。密钥、访问令牌、会话内容、账单信息和代码的访问情况，需要对应证据。

“安全事件”确认了异常发生，数据泄露的字段与损失规模需要取证。两个判断具有不同的信息门槛。

![OpenCode官方披露与待确认问题；本文依据原帖整理，状态对应公告时点](/article-images/opencode-console-security/facts.webp)

## 二、本地工具、云端网关、供应商账号，是三层关系

OpenCode 是开源编程 Agent。Console 是可选服务，提供工作区、模型接入、用量和预算等功能。使用 OpenCode 的方式包含 Console 接入和其他供应商接入。[Console 官方介绍](https://opencode.ai/v2/docs/console/)

Console 的 Providers 文档说明，管理员连接已有供应商账号，Console 保存凭证并提供网关转发，工作区成员使用模型，原始供应商密钥对成员保持隐藏。供应商负责 Token 计费，Console 记录请求与成本。[Providers 文档](https://opencode.ai/v2/docs/console/providers/)

这里存在一个区别：团队成员看见的访问入口，与后台保管的供应商凭证，是不同对象。

管理员提交外部供应商密钥，云端服务获得相应的调用能力。成员看见统一入口，供应商看见授权请求。这是一种功能设计，安全性需要凭证保护、访问控制和审计机制支撑。

另一种接入是本地客户端配置供应商，或使用自定义端点。接入文档提供了供应商配置与 Base URL 设置。[客户端接入文档](https://opencode.ai/docs/providers/)

本地保存的凭证、Console 保存的凭证，以及代理端点处理的凭证，具有不同的信任边界。具体请求经过哪些服务，取决于用户的实际配置。

本次公告指向 Console 的部分外部供应商连接用户，公开证据支持这个范围。本地客户端使用者的影响判断，需要接入方式与凭证位置的核对，本地系统安全需要对应的检查。

开源代码提供审查入口，云端运营涉及另外的账号、基础设施和密钥管理责任。代码许可与服务安全，是不同问题。

## 三、蒸馏攻击，究竟描述什么

蒸馏是一种模型训练方法，使用教师模型的输出来训练另一个模型。授权的蒸馏具有正常用途。

Anthropic 的反蒸馏说明使用“蒸馏攻击”描述未经授权、大规模提取模型能力的活动，讨论对象包含账号滥用与输出采集。[反蒸馏说明](https://www.anthropic.com/research/distillation-defenses)

OpenCode 的公告使用了这个词，具体攻击方式与参与方身份属于待确认事项。它的表述确认关联，完整因果链需要技术说明。

模型输出采集、凭证滥用和服务入侵，是不同概念。一次活动涉及哪些环节，需要请求日志、访问记录和取证材料。一个标签的解释需要这组证据。

Anthropic、OpenAI 和 Google 参与处置，是 OpenCode 的披露内容。这条信息区别于“三家模型厂商的核心系统遭入侵”。事件责任与系统边界需要具体事实。

## 四、用户的检查对象：通知、接入方式与调用记录

以下是一般防御建议，适用对象是受影响用户，以及发现疑似凭证暴露或异常调用的账号。它区别于本次事件的官方完整修复方案。

1. 核对通知。检查注册邮箱、垃圾邮件与官方公告，确认相关工作区及外部供应商连接。官方站点是核验入口，邮件中的陌生链接需要警惕。
2. 保留记录。导出供应商用量、费用、调用时间和项目记录，记录异常起止时间。账单激增是一项排查线索，正常账单缺少排除数据访问的充分性。
3. 处置凭证。受影响或疑似泄露的 API Key 需要供应商侧撤销与新凭证替换。替换涉及相关应用配置及验证，生产系统需要责任人协调。
4. 收紧范围。开发、测试和生产使用不同凭证；项目权限、可用模型和额度采用业务所需的范围，支持到期时间的系统设置有效期。

OWASP 的密钥管理建议包含最小权限、轮换、撤销、到期和审计。凭证的撤销与替换处理不同问题：新凭证负责恢复授权，旧凭证失效负责关闭原有访问能力。[OWASP 密钥管理建议](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

删除一条客户端配置、停止一个进程，区别于供应商侧撤销凭证。密码、API Key 与 OAuth 授权具有不同的处置入口，具体动作需要对应账号类型和官方指引。

![通知核验、记录保存、凭证处置与权限收紧；本文一般防御建议，非泄露范围判定](/article-images/opencode-console-security/actions.webp)

本文的检查范围是公开资料，个人邮箱、账户与调用日志属于用户自己的核查对象。本文省略“所有账号泄露”的推断，以及对任何读者账号的安全担保。

## 五、团队需要一份凭证去向清单

AI 编程工具接触模型接口、代码、终端和团队服务。接入便利增加了入口，安全管理需要清楚每个入口的权限。

一份实用清单包含：凭证所属供应商、保管位置、使用系统、负责人、权限范围和撤销入口。控制台里的显示名称，区别于凭证的实际授权范围。

工作区限额与供应商限制需要核对执行位置。网关的限制约束经过网关的调用，供应商侧凭证的权限决定其他调用路径的授权范围。这是一项一般架构原则，区别于本次攻击路径的结论。

本地执行安全是另一项检查。OpenCode 仓库的安全说明区分了权限提示与安全隔离，隔离需要容器或虚拟机等额外措施。这项说明涉及工具的威胁模型，区别于 Console 事件的原因。[仓库安全说明](https://github.com/anomalyco/opencode/security)

我的判断是，AI 工具的采用评估需要包含凭证托管责任。模型效果、使用体验和价格回答产品问题，凭证保护、审计与事件响应回答运行问题。

OpenCode 的官方披露确认了一起 Console 安全事件，披露的用户影响比例是 1.4%。技术原因、具体损失与修复效果，需要后续证据。用户的行动依据，是自己的接入方式、通知与日志，区别于传播中的泛化结论。

## 参考资料

1. [OpenCode：安全事件官方公告](https://x.com/opencode/status/2111519637049319818)
2. OpenCode 文档：[Console 介绍](https://opencode.ai/v2/docs/console/)；[外部供应商与凭证托管](https://opencode.ai/v2/docs/console/providers/)；[客户端供应商配置](https://opencode.ai/docs/providers/)
3. [Anthropic：Strengthening our defenses against distillation attacks](https://www.anthropic.com/research/distillation-defenses)
4. [OWASP：Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
5. [OpenCode 仓库安全说明](https://github.com/anomalyco/opencode/security)
