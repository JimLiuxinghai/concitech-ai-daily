---
title: Cloudflare开源Kitesurf！浏览器底座变成Workers，HTML提取内存中位数29MiB
description: >-
  Kitesurf是一款面向Agent的实验性浏览器引擎，采用Workers、Rust与WebAssembly，提供CDP和页面输出接口。本文介绍组件分工、接入方式与部署条件，核对38页基准和WPT统计口径，解释内存、耗时和兼容性的取舍。
slug: kitesurf-workers-agent-browser
publishedAtCST: '2026-11-17T15:47:32+08:00'
language: zh
author: JimLiu
categories:
  - devtools
  - products
cover: /article-covers/kitesurf-workers-agent-browser.webp
draft: false
wechatMediaId: qwac_8j4kaaga6WV5YUa-YXmuyRGZ28wFM1ELEu0cllHs_ULszF7TNOIBzF81ezV
---

**Kitesurf的服务对象是Agent，浏览器的运行底座是Cloudflare Workers。**

Kitesurf是一款面向Agent的实验性浏览器引擎。它读取网页、执行页面JavaScript、处理布局，输出截图、PDF或HTML。CDP是一套浏览器控制协议，负责传递打开页面、执行脚本、获取输出等指令。公开Playground提供DevTools检查入口。[1][3]

这个项目的工程问题，是浏览器的运行单元怎样适配Agent任务：一次内容提取、一次截图和一段网页操作，具有不同的资源与状态需求。

[GitHub仓库：cloudflare/kitesurf](https://github.com/cloudflare/kitesurf)采用Apache 2.0许可证。代码、构建说明和测试入口构成公开资料，浏览器能力的状态是Experimental。[2]

## 底座是Workers，组件承担不同工作

Cloudflare技术公告的发布日期是2026年8月6日。它介绍了一套多组件架构：Engine负责CDP、HTTP接口和会话状态，PageScript处理页面DOM与脚本环境，PageRenderer生成像素输出，SandboxOutbound承担网络出口。[1]

Rust模块编译为WebAssembly，Workers提供运行与隔离环境。Workers RPC承担组件通信。RPC的作用，是组件之间的方法调用与结果传递。[1]

源码README包含相关基础项目：Blitz处理HTML、布局和绘制，Stylo处理CSS，Boa承担JavaScript执行，Parley参与文本排版，Krilla提供PDF输出。项目的技术栈包含多项开源工程。[2]

![Kitesurf的接口、页面执行、渲染与网络出口分工](/article-images/kitesurf-workers-agent-browser/component-roles.webp)

*图：官方组件职责的概念整理。资料来源：Cloudflare技术公告。[1]*

“无状态”的架构取向与页面会话，具有不同含义。公告中的Engine保存会话状态，PageScript包含DOM和`globalThis`，渲染器持有可丢弃的缓存。[1]

状态具有归属，渲染任务具有重建边界。这个设计方向，适合分析Agent的突发任务与资源占用。

## 29MiB来自哪一组测试

公开基准看板的本轮时间是2026年11月17日02:40 UTC。样本包含38个页面，每个页面、接口和后端采用2次预热、5次记录尝试；页面中位数构成汇总中位数。[4]

Kitesurf与Browser Run复用Chrome的比较结果如下：

| 指标 | Kitesurf | Browser Run：复用Chrome |
| --- | --- | --- |
| 截图内存 | 50 MiB | 393 MiB |
| HTML提取内存 | 29 MiB | 383 MiB |
| 截图Wall time | 1.80秒 | 1.66秒 |
| HTML提取Wall time | 1.58秒 | 1.38秒 |

该样本的结果是：Kitesurf的内存数值低于对照，Wall time数值高于对照。内存统计采用采样时的绝对占用，Chrome侧采用进程树PSS；复用实例的历史保留内存影响结果。[4]

Wall time采用后端报告的动作耗时，各后端的计时边界存在差异。看板中另一个名为Chrome cold start的比较项，其计时起点是CDP就绪，进程启动时间属于排除项。[4]

这些数字属于项目方的公开测试。部分页面存在Render failed记录，兼容性的验收需要目标页面与操作步骤。[4]

**资源占用、动作耗时与完整任务完成率，是不同指标。**我的判断是，浏览器选型需要这三份证据。

## WPT的98.3%，具有明确的分母

WPT（Web Platform Tests）是一套Web标准测试。WPT看板的最新一轮日期是2026年11月16日。运行子测试总数为1,543,968，通过数为1,517,208，通过率为98.3%。文件级通过率为77.3%，对应9,093／11,764个文件。[5]

跳过文件的总数为56,854。not enrolled类别包含56,823个文件，SKIP类别包含31个文件。[5]

![Kitesurf的WPT统计层次与计数范围](/article-images/kitesurf-workers-agent-browser/wpt-scope.webp)

*图：WPT看板的子测试、文件与跳过项口径。数据批次：2026年11月16日。[5]*

98.3%的分母，是进入该轮运行的子测试。文件级通过率、跳过项和不同目录的覆盖，提供另外几种观察角度。WPT检验Web标准符合性，真实网站的交互和视觉结果具有自己的验收任务。[5]

这个区分影响使用方式。一个文档页面、一个Canvas应用和一个登录工作流，需要不同的测试内容。

## 三条入口：演示、托管服务与源码

[Kitesurf Playground](https://kitesurf.dev/)提供免登录演示，支持页面检查、截图、PDF、HTML和控制台输出。官网展示的页面包含Wikipedia、Paper.js、TodoMVC和Doom等类型。[3]

公开CDP地址是：

```text
wss://kitesurf.dev/devtools/browser
```

官网的Agent演示采用`chrome-devtools-mcp`。演示连接参数如下：[3]

```bash
npx -y chrome-devtools-mcp@latest \
  --wsEndpoint=wss://kitesurf.dev/devtools/browser
```

本次核查的对象，是公开演示的Example Domain截图与HTML接口。两项返回状态是HTTP 200。截图包含多语言文本，HTML包含页面内容。这项检查的范围，是一个文档页面的两种输出。

Browser Run提供账号级CDP与Quick Actions入口，`browser=kitesurf`选择引擎。当前服务的官方标记是Beta。Beta服务免费，采用账号限额。[3]

源码路径具有不同的要求。README要求Bazelisk、Node.js 22或更新版本、pnpm 9.15.4；`pnpm run dev`构建项目，启动本地引擎。Cloudflare部署依赖Dynamic Workers及Workers Paid计划。[2]

## 使用边界，决定验收范围

官方文档推荐的场景，包含兼容站点的内容提取、截图、PDF和短任务。视频播放、WebGL、真实TLS指纹相关的机器人挑战、依赖持久状态的长登录会话，属于官方列出的能力边界；这些场景的建议引擎是默认Chromium。[3]

CDP实现覆盖协议子集。Puppeteer、Playwright与DevTools的连接能力，和某项客户端功能的完整适配，具有不同的验收范围。[1][2]

源码的部署说明包含鉴权要求：自部署引擎的访问入口需要Cloudflare Access或其他鉴权层。Engine的公开接口涉及浏览器控制、网络请求和账号资源消耗。[2]

我的理解是，Kitesurf提供了一种浏览器基础设施方向：任务的资源预算、协议接口与页面能力，构成选型依据。

一个项目的验收清单，需要包含目标页面、操作步骤、输出质量、状态要求和资源统计。浏览器引擎的价值，取决于这份具体清单的结果。

## 参考资料

1. [Cloudflare技术公告：Introducing Kitesurf](https://blog.cloudflare.com/kitesurf)
2. [GitHub仓库与README：cloudflare/kitesurf](https://github.com/cloudflare/kitesurf)
3. [Kitesurf官网](https://kitesurf.dev/)；[Browser Run官方Kitesurf文档](https://developers.cloudflare.com/browser-run/kitesurf/)
4. [Kitesurf公开性能看板](https://kitesurf.dev/benchmarks)
5. [Kitesurf WPT看板](https://kitesurf.dev/wpt)
