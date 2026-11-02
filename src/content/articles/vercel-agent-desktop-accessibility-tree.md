---
title: Vercel开源agent-desktop！AI操控桌面应用，入口是一棵无障碍树
description: >-
  Vercel Labs 的 agent-desktop 提供 macOS、Windows、Linux
  桌面应用操控接口。无障碍树提供控件信息，快照引用定位目标，动作结果与后续观察构成验证链。文章解释工作机制、性能边界与使用方式。
slug: vercel-agent-desktop-accessibility-tree
publishedAtCST: '2026-11-02T10:00:11+08:00'
language: zh
author: JimLiu
wechatMediaId: 'qwac_8j4kaaga6WV5YUa-cQgzVqcSkUUUWQfSpGosj8sv-Xu2Zd2dHtXZfssSL1Y'
categories:
  - devtools
  - products
cover: /article-covers/vercel-agent-desktop-accessibility-tree.webp
draft: false
---

AI 操作电脑，截图是一种观察材料。另一种材料来自操作系统：**无障碍树**。

按钮的名称、输入框的类型、复选框的状态，构成一份界面结构。这些信息赋予操作对象具体身份。

Vercel Labs 开源的 **agent-desktop**，提供了这样的桌面入口：原生 Rust CLI 和 C 库读取应用的无障碍树，输出 JSON 快照及元素引用，执行点击、输入和选择等动作。[项目仓库](https://github.com/vercel-labs/agent-desktop)

项目支持 **macOS、Windows、Linux**，许可证为 Apache 2.0。它的定位是工具，目标理解、行动选择和结果判断属于调用它的 Agent。

**一个新的分工出现了：操作系统提供控件结构，工具提供动作接口，Agent 负责判断。**

## 一、这棵树，装着什么

无障碍树是一种界面结构表示。它描述窗口、菜单、按钮、输入框及它们的层级关系，信息来源是操作系统的无障碍接口。

它是一份控件目录：某个节点是按钮，名称是“保存”；另一个节点是输入框，拥有文本值及输入能力。Agent 读取的是这些语义信息。[项目概念说明](https://github.com/vercel-labs/agent-desktop/blob/9eb9b296192fcb70bda25e918cd6dd66abfa3d0d/CONCEPTS.md)

截图记录像素，无障碍树记录控件属性。二者拥有不同的信息边界：图片保留颜色、位置和视觉内容，结构数据提供角色、名称和操作能力。

![两种界面观察材料：截图提供视觉信息，无障碍树提供控件角色、名称、状态及引用](/article-images/vercel-agent-desktop-accessibility-tree/pixels-and-tree.webp)

一个自定义画布、游戏画面或缺少无障碍信息的控件，存在结构数据缺口。工具的观察能力取决于应用暴露的信息。项目保留截图命令，核心语义操作流程使用无障碍接口。[项目 FAQ](https://github.com/vercel-labs/agent-desktop/blob/9eb9b296192fcb70bda25e918cd6dd66abfa3d0d/docs/faq.md)

这解释了两个问题：结构化操作拥有明确目标，视觉观察拥有另一类信息。两种路线的准确率排序，需要具体任务与实测。

## 二、三个动作，形成一次操作循环

项目的核心流程是：**观察、行动、验证。**

一次快照返回应用窗口的结构和元素引用。下面是一份协议简化示意，名称与引用属于演示值：

```json
{
  "snapshot_id": "s8f3k2p9",
  "complete": true,
  "tree": {
    "role": "button",
    "name": "保存",
    "ref_id": "@s8f3k2p9:e8",
    "available_actions": ["Click"]
  }
}
```

`button` 表达控件角色，`name` 表达名称，`ref_id` 表达本次快照中的引用身份。`available_actions` 给出操作能力。

项目 README 的 Finder 示例展示了三个命令：

```bash
agent-desktop snapshot --app Finder -i
agent-desktop click @s8f3k2p9:e8
agent-desktop snapshot --app Finder -i
```

第一行读取交互元素，第二行执行目标动作，第三行读取界面状态。示例中的引用是占位演示，实际操作的有效引用来源是工具返回的快照。[README 快速入门](https://github.com/vercel-labs/agent-desktop/blob/9eb9b296192fcb70bda25e918cd6dd66abfa3d0d/README.md)

**快照提供证据，引用定位对象，后续观察检验结果。**

一个“保存”按钮的点击，涉及两层结果：控件接收动作，应用完成保存。页面提示、文件状态或其他业务证据，决定任务完成的判断。

## 三、“稳定引用”的有效范围

引用 `@s8f3k2p9:e8` 包含快照 ID 和元素编号。它的含义是某次观察中的具体对象，永久控件编号属于另一种概念。

项目的概念文档明确了边界：引用的确定性属于单次快照，界面变化存在破坏匹配关系的风险。单独的 `@e8` 缺少快照身份，命令拒绝该格式。[引用与身份定义](https://github.com/vercel-labs/agent-desktop/blob/9eb9b296192fcb70bda25e918cd6dd66abfa3d0d/CONCEPTS.md)

`STALE_REF` 表示旧引用的目标匹配失效，恢复材料是新快照。`AMBIGUOUS_TARGET` 表示目标存在歧义，Agent 需要缩小窗口或元素范围。

动作结果与错误信息包含 `disposition`，字段说明动作交付证据及重试属性。这项设计处理的是另一个工程问题：命令报错与动作送达状态，属于两项信息。

重复输入带来重复内容的风险。`not_delivered` 是协议定义的安全重试状态，其他交付状态需要观察证据。`delivery_uncertain` 与 `delivered_unverified` 表达的是交付或验证的不确定性。[JSON 输出协议](https://github.com/vercel-labs/agent-desktop/blob/9eb9b296192fcb70bda25e918cd6dd66abfa3d0d/docs/json-output.md)

![观察、执行、验证循环：快照生成引用，动作返回交付证据，新观察检查界面与业务结果](/article-images/vercel-agent-desktop-accessibility-tree/observe-act-verify.webp)

快照完整性有一组字段表达。协议允许 `ok: true` 与 `complete: false` 的组合：命令完成了部分观察，整棵树存在缺口。`ok: true` 属于命令层信息，完整观察与业务成功拥有不同的证据标准。

## 四、Token 与速度，需要哪份账本

结构化数据的吸引力来自输入组织方式。

Agent 需要一个按钮，整张桌面截图包含大量任务范围之外的信息。结构查询、交互元素筛选和子树读取，提供了缩小观察范围的入口。

项目提供 **`--skeleton`、`--root` 和 `--compact`**。它们服务于浅层概览、局部深入与紧凑输出，目标是控制一次观察的信息量。[Agent 使用协议](https://github.com/vercel-labs/agent-desktop/blob/9eb9b296192fcb70bda25e918cd6dd66abfa3d0d/skills/agent-desktop/SKILL.md)

JSON 本身缺少“低 Token 成本”的保证。密集应用的控件树、长文本标签和展开层级，影响输出体积。截图分辨率、模型计费方式和任务步骤数，影响视觉路线的成本。

一次任务的总耗时包含界面读取、模型推理、动作执行与结果验证。原生工具的启动耗时，与整项任务的完成时延属于不同口径。

**本文缺少同任务、同模型、同验收标准的对照实验。节省 Token、缩短完成时间与准确率变化，属于待验证效果。**

一份有用的对照结果，需要列出任务成功率、端到端耗时、模型用量和失败恢复情况。单个命令的速度，缺少代替整条工作流成绩的含义。

## 五、三大系统，存在不同能力边界

项目提供 npm 安装入口：

```bash
npm install -g agent-desktop
agent-desktop version
```

这段命令用于安装与版本查询，本文的研究过程包含文档和源码查阅，桌面操控效果缺少本文独立实测。[安装说明](https://github.com/vercel-labs/agent-desktop/blob/9eb9b296192fcb70bda25e918cd6dd66abfa3d0d/docs/install.md)

| 平台 | 主要前提与差异 |
| --- | --- |
| macOS | 无障碍权限是结构读取与操作的前提；截图涉及屏幕录制权限 |
| Windows | 终端与目标应用的权限级别影响输入操作能力 |
| Linux | 图形会话及 AT-SPI 构成前提，X11 与 Wayland 的鼠标、窗口能力存在差异 |

项目的默认引用动作使用语义接口，前台激活、鼠标移动和物理输入属于另一类操作；`--headed` 打开相应能力，具体要求取决于平台。接口能力缺口与界面变化需要不同的恢复方式。

agent-desktop 的对象是桌面应用。项目文档推荐的网页自动化工具是 agent-browser。二者延续了“观察结构、引用定位、行动验证”的思路，数据来源和运行环境存在区别。

快照、窗口标题、剪贴板读数与调试图像，属于项目隐私说明列出的桌面数据。调用方决定哪些材料进入模型请求，数据流设计属于接入工作的一部分。[隐私与数据处理说明](https://github.com/vercel-labs/agent-desktop/blob/9eb9b296192fcb70bda25e918cd6dd66abfa3d0d/docs/faq.md)

**agent-desktop 的变化是桌面操作接口的结构化：控件拥有身份，动作拥有交付信息，结果需要验证。效果的答案，属于具体应用和真实任务。**

## 参考资料

1. [项目官网](https://agent-browser.dev/desktop)；[GitHub：vercel-labs/agent-desktop](https://github.com/vercel-labs/agent-desktop)。
2. [快照、引用与身份概念](https://github.com/vercel-labs/agent-desktop/blob/9eb9b296192fcb70bda25e918cd6dd66abfa3d0d/CONCEPTS.md)。
3. [动作交付、错误与 JSON 协议](https://github.com/vercel-labs/agent-desktop/blob/9eb9b296192fcb70bda25e918cd6dd66abfa3d0d/docs/json-output.md)。
4. [安装与平台权限](https://github.com/vercel-labs/agent-desktop/blob/9eb9b296192fcb70bda25e918cd6dd66abfa3d0d/docs/install.md)。
5. [项目 FAQ](https://github.com/vercel-labs/agent-desktop/blob/9eb9b296192fcb70bda25e918cd6dd66abfa3d0d/docs/faq.md)。

核验日期：2026 年 11 月 2 日。仓库版本：`9eb9b29`。图表为本文原创，JSON 示例为简化示意。
