---
title: "开源测试框架e2e：Agent操作、断言验收、缓存回放"
description: "TesterArmy开源e2e测试框架。测试用例混合自然语言目标与确定性断言，Web和移动端共享核心API。验证合格的Agent动作支持缓存回放；模型判断步骤产生调用成本。"
slug: "e2e-agent-test-verified-replay"
publishedAtCST: "2026-10-03T08:38:00+08:00"
language: zh
author: JimLiu
categories: [devtools, products]
cover: "/article-covers/e2e-agent-test-verified-replay.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-bSLgk7uXhfGhQ3nC6aHrrb1PvgDgJwrSyFwb-tYRP5h"
draft: false
---

软件测试遇到一组矛盾。固定脚本有清晰的执行路径。界面变化容易破坏脚本。Agent理解自然语言目标。模型调用、运行时间和结果稳定性成为新问题。

开源项目[e2e](https://github.com/tester-army/e2e)的答案是混写。测试作者给Agent一个目标，Agent负责界面操作；断言负责核对结果。验证合格的操作步骤获得回放缓存。界面变化触发Agent接手。

项目由TesterArmy开发，采用Apache-2.0许可证。仓库说明把它定位为Web与移动应用的端到端测试框架。项目处于迈向1.0的开发阶段；官方提示API与配置存在变动风险。

![e2e测试框架的核心流程](/article-images/e2e-agent-test-verified-replay/cover.webp)

## 一条测试，两种控制方式

[官方README](https://github.com/tester-army/e2e#readme)给出一段账单测试：

```ts
import { test, expect } from 'e2e';

test('a member upgrades to Pro', async ({ app, agent, screen }) => {
  await app.open('/settings/billing');
  await agent.act('upgrade the workspace to the Pro plan');
  await agent.assert('the invoice preview shows a prorated amount');
  await expect(screen.getByRole('status')).toContainText('Pro');
});
```

`agent.act`表达目标，避免测试作者手写每次点击。`agent.assert`请模型判断页面语义；`expect`检查明确的界面值。最后一行要求状态区域包含“Pro”，这项检查具有确定性。

测试作者保留关键结果的定义权。Agent寻找操作路径；断言决定这条路径是否达成任务。项目[写测试文档](https://e2e.tester.army/docs/writing-tests)建议每个`agent.act`承载一个目标。已知控件与精确数值适合交给定位器和`expect`。

![自然语言操作与确定性断言的分工](/article-images/e2e-agent-test-verified-replay/flow.webp)

## 缓存有前提：后续检查合格

项目的特点是[已验证动作的回放](https://e2e.tester.army/docs/cache)。一次`agent.act`完成操作，后续定位器断言或`agent.assert`确认结果，运行器记录动作。后续测试的运行器尝试复用记录；匹配成功的步骤省去模型调用。

回放包含起始页面、控件定位和结果状态的检查。控件消失、匹配产生歧义或结果状态改变，Agent接管剩余步骤。测试作者可以用`--no-cache`排除缓存因素。

缓存有两条重要边界。`agent.assert`、`agent.waitFor`和`agent.extract`需要模型判断；缺少有效后续验证的`agent.act`没有可用缓存记录。缓存节省部分动作探索成本。其他步骤产生额外模型费用。

缓存条目与测试、目标环境、指令和参数绑定。动态邮箱或时间戳容易造成缓存失效；项目提供`unique()`处理这类输入。`e2e init`把本地缓存目录加入`.gitignore`。CI缺少开发机的回放记录。

![已验证动作的缓存与失效边界](/article-images/e2e-agent-test-verified-replay/cache.webp)

## Web和手机共享接口，底层引擎不同

Web引擎`@e2e-dev/web`使用Playwright，覆盖Chromium、Firefox和WebKit。移动引擎`@e2e-dev/mobile`使用`agent-device`驱动iOS模拟器与Android模拟器。两者共享`agent`、`screen`和`expect`等测试接口。[移动端文档](https://e2e.tester.army/docs/mobile)给出连接实体手机和托管设备的方式。

“共用API”不保证单条测试覆盖所有平台。应用入口、设备环境、控件标签和权限行为存在差异。项目支持多个目标环境和测试平台选择。

确定性测试没有模型配置要求。Agent步骤支持订阅、API密钥或本地模型。[快速入门](https://e2e.tester.army/docs/quickstart)提供`npx e2e init`命令；文档要求Node.js 22.12或更新版本。移动测试需要Xcode模拟器运行时或Android SDK模拟器。

## 适合哪类团队

界面变化频繁、测试覆盖落后的团队，可以挑选一条真实业务流程试验这套写法。目标交给Agent，付款状态、权限结果和关键文本交给确定性断言。运行报告应记录模型调用、缓存命中和接管原因。

稳定Playwright用例有保留价值。e2e支持纯定位器测试和少数复杂步骤的Agent操作。这个选择权比“全自动测试”口号更有价值。

模型存在页面误判风险。回放记录存在操作路径过时风险。缓存文件包含动作和普通输入值。团队需要审查共享的缓存记录与测试数据。[项目安全说明](https://e2e.tester.army/docs/security)列出密钥处理与报告脱敏的边界。

e2e提出一条务实的分工：Agent解决路径搜索，断言承担验收，缓存降低重复探索成本。实际收益取决于测试流程、界面稳定性和验证质量，项目文档没有给出适用于所有团队的节省比例。

## 参考资料

- [原推文](https://x.com/vikingmute/status/2106028732884656198)
- [tester-army/e2e GitHub原仓库](https://github.com/tester-army/e2e)
- [e2e写测试文档](https://e2e.tester.army/docs/writing-tests)
- [e2e缓存机制文档](https://e2e.tester.army/docs/cache)
- [e2e移动端文档](https://e2e.tester.army/docs/mobile)
- [e2e快速入门](https://e2e.tester.army/docs/quickstart)
- [e2e安全说明](https://e2e.tester.army/docs/security)
