---
title: "Node.js、PHP 安全告急：两大运行时的 RCE 漏洞与修复清单"
description: "Node.js 与 PHP 发布安全更新，风险涉及远程代码执行、证书校验与请求状态管理。本文核对修复版本、PHP 的影响条件和缓解措施边界，介绍运行时、容器镜像与服务进程的检查清单。"
slug: "nodejs-php-october-2026-security-updates"
publishedAtCST: "2026-10-22T11:42:52+08:00"
language: zh
author: JimLiu
categories: [security, devtools]
cover: "/article-covers/nodejs-php-october-2026-security-updates.webp"
draft: false
---

2026 年 10 月 21 日的安全发布名单，出现了 Node.js 和 PHP 两个名字。

Node.js 的三个维护分支发布补丁，漏洞包含 Brotli 解码器的远程代码执行风险。PHP 发布四个修复版本，两项漏洞的等级是 Critical，CVSS v4.0 评分为 9.2。

这两起事件的修复对象，是解释器、运行时和它们内置的组件。应用代码的提交记录，缺少服务器安全状态的全部信息。

核对日期：2026 年 10 月 22 日。以下版本指本次安全发布的修复版本；发行版的回补包需要供应商公告证明。

## 一、修复清单：Node.js 三条分支，PHP 四条分支

| 运行时分支 | 本次修复版本 |
| --- | --- |
| Node.js 22.x | 22.23.4 |
| Node.js 24.x | 24.22.1 |
| Node.js 26.x | 26.12.1 |
| PHP 8.2 | 8.2.35 |
| PHP 8.3 | 8.3.36 |
| PHP 8.4 | 8.4.27 |
| PHP 8.5 | 8.5.12 |

版本来自 [Node.js 安全公告](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)与 [PHP 官方通告](https://www.php.net/archive/2026.php#2026-10-21-1)。表格的组织单位是产品分支，跨分支的数字大小缺少比较意义。

Node.js 20、25 的维护终止日期是 2026 年 4 月 30 日、6 月 1 日。本次发布缺少这两条分支的补丁，迁移目标需要受支持分支。[维护时间表](https://github.com/nodejs/Release/blob/main/schedule.json)

PHP 8.1 及旧版本的上游常规安全支持结束了。本次存在面向 7.4、8.0、8.1 的最小源代码回补，部分发行版和 LTS 厂商提供回补包；这些例外提供单项修复，旧版本的常规维护状态维持终止。旧系统需要供应商的漏洞修复记录，或受支持版本的迁移计划。

![Node.js 与 PHP 的本次安全修复版本；来源为两项目官方公告，本文整理](/article-images/nodejs-php-october-2026-security-updates/fixed-versions.webp)

## 二、Node.js：解压、证书核对和随机数缓存

Node.js 公告列出的高危漏洞包含 CVE-2026-111497：Brotli 解码器越界写入，风险包含远程代码执行。公告的公开描述缺少完整触发条件，“所有 Node.js 网站具有相同利用路径”缺少证据。

另外两类问题涉及网络输入：`dns.resolve` 的 NUL 字符截断，和 IP 地址表示相关的 TLS 证书主机名验证绕过。全角数字对应的问题影响 24.x、26.x，其他问题的分支范围需要公告条目核对。

启动快照与单文件可执行程序 SEA 的使用者，需要关注 CVE-2026-106074：`crypto.randomUUID()`、`randomInt()` 的熵缓存进入快照，多个进程得到相同的缓存值。该项等级为 Medium。[发布细节](https://nodejs.org/en/blog/release/v24.22.1/)

这些漏洞具有不同入口与风险等级，RCE 对应特定漏洞，风险判断需要条目级别的分析。

eMudhra 证书事件构成另一个修复背景。Node.js 的补丁加入公钥哈希封禁表，初始名单包含八个 eMudhra/emSign 中间证书公钥。旧版的 Mozilla 根证书信任库与浏览器的动态撤销机制存在差异，这项变化处理的是受损信任链。[补丁说明](https://github.com/nodejs/node/pull/66871)

补丁说明保留了一个限制：升级前的既有 TLS 恢复会话缺少完整证书验证，暴露窗口受会话超时影响。发布验收需要进程和连接状态的检查，安装包版本号缺少全部证明力。

## 三、PHP：请求生命周期中的两个漏洞

PHP 官方的风险范围包含处理 Web 请求的安装，列举 PHP-FPM、Apache mod_php、php-cgi、FrankenPHP 和 LiteSpeed。不同部署方式的利用条件存在差异，风险评估需要安装方式、扩展、应用路径和配置。

### CVE-2026-109618：内存不足处理破坏内部状态

PHP 的某些内存不足处理路径中断当前执行上下文，留下半初始化的请求数据。请求清理过程把这些数据当成有效状态，形成内存破坏风险。

Apache mod_php 的官方验证路径包含请求启动与清理，触发阶段早于应用代码执行。官方报告验证了默认输入及内存限制条件下的未认证 RCE，执行权限是 Web 工作进程账户。FPM 的启动失败处理与 mod_php 存在差异，应用执行阶段的风险需要条件分析。[OOM 漏洞说明](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w)

“未认证”描述攻击者的权限前提，含义是攻击者缺少登录凭据的情形。成功利用需要其他条件。构建方式、扩展和内存布局影响利用可靠性。

### CVE-2026-109619：请求结束了，旧状态残留了

一个工作进程负责处理多个请求。某些错误、会话或扩展状态引用了单次请求的内存，请求内存的释放与引用清理发生脱节，进程保留过期引用；后续请求的早期处理读取过期状态，形成释放后使用风险。

官方说明包含 mod_php 的官方验证利用，以及具备应用操作条件的 FPM 路径。“FPM 天然免疫”的说法缺少依据，mod_php 的验证结果需要保留部署条件。[状态残留漏洞说明](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)

两项问题的共同点是请求生命周期与内存状态，含义区别于业务 SQL 拼接、某个插件的权限判断或某个登录接口。

WordPress 官方给出的处理对象是 PHP 安装，本次问题缺少对应的 WordPress 核心更新计划。站长的检查入口是“工具 → 站点健康 → 信息 → 服务器”，托管服务的补丁状态需要主机商确认。[WordPress 公告](https://wordpress.org/news/2026/10/critical-php-security-release/)

![应用、运行时、镜像与工作进程的关系；本文工程示意](/article-images/nodejs-php-october-2026-security-updates/patch-boundaries.webp)

## 四、缓解措施的边界：WAF、配置和停服决策

PHP 官方明确区分补丁与缓解措施：包含修复的版本是完整解决方案，配置调整针对特定路径，缺少整个安装安全的保证。

通告中的临时建议包含请求大小及解析规模限制、会话上传进度配置调整等。各项措施具有适用前提，某项开关缺少两项漏洞完整修复的效力。关闭 PHP 内存上限一类建议涉及资源耗尽风险，配套隔离与可用性约束属于实施条件。

这类参数需要运维人员结合官方通告与业务需求审核，照抄一行配置的做法缺少安全依据。本文省略攻击载荷与利用操作，配置细节以官方通告为准。

英国 NCSC 的建议包含系统盘点、厂商补丁跟踪和暴露面处置。缺少补丁安装与临时缓解能力的系统，属于停服评估对象；存在失陷疑虑的系统，需要入侵调查与后门排查。[NCSC 通告](https://www.ncsc.gov.uk/news/critical-security-issue-affecting-php)

这是风险处置顺序的问题。WAF 规则提供拦截层，运行时补丁处理漏洞根因，入侵调查回答系统是否遭到控制。三者具有不同验收标准。

## 五、修复验收：安装包、镜像、进程和证据

PHP Foundation 的复盘提供了一个背景：OOM 问题的初始迹象来自 2024 年的审计修复工作；2026 年 8 月的研究报告明确了 RCE 影响。团队承认，兼容性、拒绝服务风险、第三方扩展和决策资源等因素造成了修复延误。

基金会提到 AI 辅助研究与报告验证，强调人工负责判断与补丁工作。漏洞发现、修复选择、打包分发和生产部署是不同环节，发现工具的能力缺少整条链路完成的证明效力。[基金会复盘](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/)

下面五项是本文的工程验收建议，含义区别于针对某台服务器的诊断结论：

1. **盘点运行环境。** 记录公网入口、运行时分支、部署方式、扩展、容器和主机商。应用仓库的依赖文件缺少完整运行环境的代表性。
2. **核对补丁证据。** 上游版本需要对应安全版本；发行版回补需要包版本、公告与 CVE 的对应记录，版本字符串的大小比较缺少回补识别能力。
3. **更新部署产物。** 运行时安装包、容器基础镜像和托管环境具有各自的更新入口。重建镜像与替换实例属于部署验收内容。
4. **确认服务状态。** 执行中的进程需要修复后的二进制；PHP 工作进程、Node.js 服务和相关连接需要重启或重建方案。CLI 的版本结果缺少 Web 进程版本的替代效力。
5. **保存验证记录。** 记录配置生效情况、实例版本、业务回归和异常监控。存在入侵证据的系统需要响应流程，补丁安装缺少入侵痕迹清除的含义。

常见的验收缺口是：宿主机完成升级，容器保留旧镜像；命令行显示新 PHP，Web 服务加载另一套安装；构建任务使用新 Node.js，生产进程使用旧二进制。这些是待排查的部署情形，含义区别于本文观察到的真实事故。

本次修复的交付物，是一份运行实例清单：每个实例的版本、补丁来源、重启或重建记录，以及回归结果。代码仓库的绿色检查，缺少这份清单的替代效力。

## 参考资料

- [Node.js 安全公告](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) · [证书封禁补丁](https://github.com/nodejs/node/pull/66871)
- [PHP 官方通告](https://www.php.net/archive/2026.php#2026-10-21-1) · [OOM 漏洞](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w) · [状态残留漏洞](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)
- [PHP Foundation 复盘](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/)
- [WordPress 安全说明](https://wordpress.org/news/2026/10/critical-php-security-release/)
- [英国 NCSC 通告](https://www.ncsc.gov.uk/news/critical-security-issue-affecting-php)
