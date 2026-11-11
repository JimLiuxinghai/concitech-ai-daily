---
title: Obscura挑战Chrome！3.2万星Rust浏览器自建渲染，Playwright接上CDP
description: >-
  Obscura的独立浏览器引擎使用Rust，JavaScript执行交给V8。项目提供原生渲染、CDP与MCP入口，支持Playwright接入。本文拆解模块分工、渲染链路、并发模型与构建选项，说明PDF、网页兼容和性能数据的适用范围。
slug: obscura-rust-browser-cdp-rendering
publishedAtCST: '2026-11-11T20:17:22+08:00'
language: zh
author: JimLiu
categories:
  - devtools
  - products
cover: /article-covers/obscura-rust-browser-cdp-rendering.webp
draft: false
wechatMediaId: qwac_8j4kaaga6WV5YUa-UdJz4XLdMr0fckMHf-5l6Xt7f6x8aISd_kpuKzysHp3
---

**Playwright发送浏览器命令，接收命令的引擎换成Obscura。**

这个项目的目标，是网页采集与AI Agent自动化。它拥有Rust实现的独立浏览器引擎。V8承担JavaScript执行，引擎提供Chrome DevTools Protocol（CDP）接口。2026年11月11日的仓库快照记录了32,499颗Star，许可证是Apache-2.0。[1]

原生渲染的里程碑是2026年8月8日的v0.2.0；最新稳定版是10月31日的v0.2.6。本文的源码快照是`e300716`，主分支文档与安装版本存在差异。[2]

**技术看点是浏览器职责的重组：网络、DOM、JavaScript、布局与绘制，构成一套面向自动化的执行系统。**

项目地址：[github.com/h4ckf0r0day/obscura](https://github.com/h4ckf0r0day/obscura)

## V8执行JavaScript，Rust承担浏览器环境

JavaScript引擎与浏览器引擎具有不同职责。

V8负责JavaScript执行；网页脚本需要的`document`、`window`、网络请求和DOM操作，属于浏览器环境。Obscura的`obscura-js`模块依赖`deno_core`，后者提供V8嵌入能力。`bootstrap.js`提供浏览器全局对象，Rust ops负责DOM修改、请求等操作。[3]

这套结构包含十个crate。阅读源码的入口包括以下五组模块：

| 职责 | 模块 | 核心工作 |
| --- | --- | --- |
| 外部入口 | `obscura-cli`、`obscura-cdp`、`obscura-mcp` | 命令行、CDP命令、Agent工具 |
| 页面生命周期 | `obscura-browser` | 导航、页面状态、资源准备、捕获 |
| 网络与文档 | `obscura-net`、`obscura-dom` | HTTP、Cookie、HTML解析与DOM树 |
| JavaScript环境 | `obscura-js` | V8运行时、Web API与Rust桥接 |
| 渲染 | `obscura-render` | CSS层叠、布局、文字与CPU绘制 |

一个`Page.navigate`命令的路径，是CDP WebSocket入口、命令分发、页面导航处理。导航过程包含网络获取、HTML解析与脚本执行，生命周期事件返回客户端。[3]

CDP兼容要求包含两部分：命令的协议形式，以及命令对应的网页行为。页面跳转、事件顺序、DOM句柄和异步回调，决定了上层脚本的兼容程度。

![Obscura的外部入口、页面运行时与渲染链路](/article-images/obscura-rust-browser-cdp-rendering/engine-architecture.webp)

*图：Obscura模块与执行链路；依据仓库架构文档及源码制作。[3]*

## 原生渲染的核心：DOM、测量与画面共用几何

`obscura-render`的任务包含CSS计算、布局、文字塑形与光栅绘制。Taffy提供Flex和Grid基础，项目补充块级、行内、表格、定位、滚动等浏览器行为。绘制依赖包含`tiny-skia`，文字链路包含`cosmic-text`。[3]

一个关键设计是**保留式布局**：布局结果具有缓存，DOM、样式、视口、滚动、字体和资源变化触发布局失效。

JavaScript几何API与截图使用同一套几何数据。`getBoundingClientRect()`返回的元素位置、命中检测使用的位置、画面中的位置，拥有共同的数据来源。

这个设计关系到Agent的点击正确性。元素快照告诉Agent“按钮的位置”，截图展示“按钮的画面”；两者的一致性，构成交互正确性的基础。

原生渲染提供视口截图、整页截图、页面帧推送与PDF导出。两项具体边界是：**PDF采用栅格页面，文字选择与搜索功能缺席；页面帧推送采用活动驱动模型，固定帧率桌面录像属于另一类能力。**[2][4]

## Playwright接入：连接方式决定协议

Linux x86_64的固定版本安装示例：

```bash
curl -fLO https://github.com/h4ckf0r0day/obscura/releases/download/v0.2.6/obscura-x86_64-linux.tar.gz
tar xzf obscura-x86_64-linux.tar.gz
./obscura serve --port 9222
```

发布包包含`obscura`和`obscura-worker`，两个可执行文件需要共用一个目录。并行采集命令依赖worker。发布物提供Linux、macOS与Windows的对应构建。Linux发布构建要求glibc 2.35+。[1]

服务的默认监听地址是`127.0.0.1`。非回环绑定要求`OBSCURA_CDP_TOKEN`，令牌长度下限是32字节。[4]

Node.js客户端安装：

```bash
npm install playwright-core
```

以下脚本保存为`demo.mjs`：

```javascript
import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'ws://127.0.0.1:9222'
);
const context = await browser.newContext();

try {
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('https://example.com', {
    waitUntil: 'load',
    timeout: 15000,
  });
  await page.waitForSelector('h1');

  console.log(await page.title());
  console.log(await page.locator('h1').textContent());
  await page.screenshot({ path: 'page.png', fullPage: true });
  await page.pdf({ path: 'page.pdf', format: 'A4' });
} finally {
  await context.close();
  await browser.close();
}
```

关键方法是`connectOverCDP()`。Playwright的`connect()`使用Playwright自有协议，Obscura的入口使用CDP。代码中的`chromium`是Playwright客户端入口的名称，执行网页任务的服务进程是Obscura。[4]

上例属于官方接入方式的改写示例。本文的核查范围是文档与源码；运行结果和兼容性需要目标版本的实际验证。

MCP入口是`obscura mcp`。工具包含页面导航、快照、填写、点击、JavaScript求值和截图。`browser_snapshot`返回元素引用、控制状态与正文，Agent拥有了结构化页面信息。[4]

## 并发细节：连接数量影响JavaScript吞吐

Obscura的每个页面运行时拥有一个V8 isolate。CDP连接拥有自己的操作系统线程，连接内的V8工作采用`v8_lock`串行化机制。这个锁属于连接，进程中的不同连接拥有各自的执行通道。[3]

**同一CDP连接的多个页面，具有JavaScript执行的串行约束。多个独立CDP连接，具备并行执行条件。**

`Promise.all()`代表客户端任务调度；引擎线程模型决定实际执行的并发性。页面数量、连接数量、worker数量，是三个不同的容量参数。

`obscura serve --workers 4`启动四个worker进程。连接的归属保持固定，worker回收参数包括连接次数、进程RSS与存活时间。替换worker接收新连接，旧worker完成现有会话；排空超时决定剩余会话的终止时点。[4]

JavaScript执行预算的默认值是30秒。V8终止看门狗负责同步脚本的中止；Tokio的异步超时缺少同步V8代码的抢占能力。长任务的资源治理，需要执行预算与进程回收机制。[3][4]

## 四种构建，性能数字需要明确口径

发布包的渲染与stealth是两个构建维度：

| 包名后缀 | 渲染 | Stealth传输 |
| --- | --- | --- |
| 无后缀 | 开启 | 关闭 |
| `-stealth` | 开启 | 开启 |
| `-no-render` | 关闭 | 关闭 |
| `-no-render-stealth` | 关闭 | 开启 |

普通网络路径使用`reqwest`；stealth网络路径使用`wreq/BoringSSL`。这条路径处理Chrome风格的TLS握手特征，以及网络请求与JavaScript表面的指纹一致性。[1][3]

README列出的3,520对应**拦截列表中的域名数**，名单覆盖跟踪、广告与指纹脚本。反爬系统的通过率，需要具体站点与测试条件的证据。

![Obscura构建选项与兼容性关注项](/article-images/obscura-rust-browser-cdp-rendering/builds-and-boundaries.webp)

*图：四类发布构建及接口边界；依据README、Playwright文档与发布说明制作。[1][2][4]*

README给出30MB内存、约70MiB二进制体积和85ms页面加载等比较数字。这些数字属于项目方标称值。实际负载的测量需要区分渲染构建、页面复杂度和并发配置。[1]

测量口径值得区分：`Runtime.getHeapUsage`返回V8堆数据，进程RSS包含Rust DOM、渲染器等额外分配。V8堆大小与整个浏览器进程内存，属于不同指标。[4]

性能评估的任务集应覆盖实际页面、登录状态与操作步骤，记录成功率、P95延迟、进程RSS和CPU开销。版本、字体、视口、缓存与并发配置，构成比较条件。

## 兼容成本，是独立引擎的工程考题

v0.2.6的发布说明列出了请求拦截、异步CDP响应、iframe导航与JavaScript启动优化。文档保留的兼容缺口包括Service Worker、原生媒体、部分Web API和长尾CSS。[2]

主分支架构文档指出，iframe内容的合成绘制属于独立兼容缺口。子文档中的脚本求值能力，与子文档的截图还原度，需要各自的验证。[3]

这些细节决定实际选型。结构化内容采集需要DOM和脚本结果；截图Agent需要几何、字体与绘制的一致性；复杂业务回归需要完整操作链的行为兼容。

Cloudflare的工程文章提供了一段项目背景：Kitesurf的初始灵感来自Obscura，团队做过Workers移植原型。原型移植经历有官方记录，生产能力与性能指标具有各自的项目口径。[5]

Obscura值得研究的地方，是一套开放的浏览器实现：CDP保留工具入口，Rust模块承担页面行为，V8提供JavaScript执行，原生渲染补齐视觉输出。

工程团队的采纳依据是目标任务的正确性与资源成本。Star数量说明关注度，兼容性结果决定迁移范围。

## 参考资料

1. [Obscura仓库与README](https://github.com/h4ckf0r0day/obscura)
2. [v0.2.0原生渲染发布说明](https://github.com/h4ckf0r0day/obscura/releases/tag/v0.2.0)；[v0.2.6发布说明](https://github.com/h4ckf0r0day/obscura/releases/tag/v0.2.6)
3. [架构文档，源码快照e300716](https://github.com/h4ckf0r0day/obscura/blob/e3007167016b169bb58d8b5124ca9662a0b37f2d/docs/Architecture-overview.md)；[工作区依赖](https://github.com/h4ckf0r0day/obscura/blob/e3007167016b169bb58d8b5124ca9662a0b37f2d/Cargo.toml)
4. [Playwright接入文档](https://github.com/h4ckf0r0day/obscura/blob/e3007167016b169bb58d8b5124ca9662a0b37f2d/docs/Use-with-Playwright.md)；[MCP工具文档](https://github.com/h4ckf0r0day/obscura/blob/e3007167016b169bb58d8b5124ca9662a0b37f2d/docs/Use-the-MCP-server.md)；[生产部署文档](https://github.com/h4ckf0r0day/obscura/blob/e3007167016b169bb58d8b5124ca9662a0b37f2d/docs/Run-in-production-at-scale.md)
5. [Cloudflare：Kitesurf的工程设计与Obscura原型](https://blog.cloudflare.com/kitesurf/)
