---
title: 谷歌开源AI前端技能包！覆盖250项Web特性，代码改造有了浏览器兼容依据
description: >-
  Modern Web Guidance为Coding
  Agent提供Web平台指南、兼容性信息与旧代码扫描工具。1.0版本支持本地检索和确定性扫描，候选结果附带保留与丢弃条件。本文结合官方文档、仓库和CLI检查，介绍接入方式、改造案例与评测口径。
slug: google-modern-web-guidance-agent-skills
publishedAtCST: '2026-11-13T10:12:57+08:00'
language: zh
author: JimLiu
categories:
  - devtools
cover: /article-covers/google-modern-web-guidance-agent-skills.webp
draft: false
wechatMediaId: qwac_8j4kaaga6WV5YUa-VNnbLbMsTOIdoGdYpHXyew9TiR-KD8rzEzy9y5803F4
---

**浏览器拥有现成能力，AI生成的代码保留着一套重复实现。**

文本框的自动增高、弹层控制、折叠动画、表单验证，这些需求都有平台层面的解决方案。训练数据与项目旧代码中的历史写法，构成了Coding Agent的另一种参考来源。

GoogleChrome仓库中的**Modern Web Guidance**，面向这类问题。它为编码智能体提供专家编写的Web指南、浏览器兼容信息和旧模式扫描工具。[1][2]

README声明的覆盖范围是**250项现代Web特性**。250的统计对象是平台特性，内容包括CSS布局、表单、性能、无障碍、原生界面组件等领域。

仓库介绍列出的参与方包括Google Chrome、Microsoft Edge、Mozilla Firefox、MDN团队和Web开发社区。代码采用Apache-2.0许可证，指南内容采用CC BY 4.0许可证。[1]

项目地址：[GoogleChrome/modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance)

## 技能入口、检索工具、实现指南

这套项目包含三个层次。

**技能入口**告诉Agent何时查阅Web平台知识；**CLI**负责搜索与检索；**指南**提供实现模式、平台限制、兼容状态和回退策略。[1]

一个弹窗任务的典型过程是：Agent提炼能力需求，搜索相关指南，读取内容，编写代码，核对实现与指南。

搜索语句强调具体的界面或平台能力，例如`auto size textarea`。React、Vue与业务模块名称，属于另一层上下文。框架代码需要适配浏览器能力，而指南的主体使用HTML、CSS与JavaScript。[1]

仓库提供两个技能包：`modern-web-guidance`覆盖Web平台，`chrome-extensions`覆盖扩展开发。发行仓库负责技能分发，`modern-web-guidance-src`保存CLI、指南生产与评测代码。[1]

检索核心采用本地语义搜索与BM25组合。npm包的获取和更新需要网络；本地检索与匿名遥测属于不同机制。README披露的遥测内容包括Agent名称、指南ID和CLI搜索查询。`DISABLE_TELEMETRY=1`提供遥测关闭开关。[1]

## 1.0的重点：扫描结果附带“保留理由”

Modern Web Guidance 1.0提供`legacy-scan`。扫描对象包含HTML、CSS、JavaScript/TypeScript、框架组件和依赖清单。静态检测使用AST、DOM与CSS解析器，检测阶段采用确定性规则。[3]

扫描器的输出包含文件位置、问题说明、指南ID和两个关键字段：

- `keepWhen`：候选问题成立的条件。
- `dropWhen`：误报、兼容分支或其他合理用途的排除条件。

例如，一段`scrollHeight`读取对应文本框增高逻辑，存在改造空间。同样的读取操作涉及虚拟滚动或滚动进度，业务含义不同。`CSS.supports()`保护下的兼容代码，具有保留依据。[3]

**检测命中提供的是候选线索，代码上下文决定改造范围。**

官方工作流包含四步：扫描、情境验证、报告计划、指南检索与重构验证。工具的扫描接口负责发现问题，跨HTML、CSS与JavaScript的修改由Agent完成。官方说明给出的设计选择是：`legacy-scan`缺少`--fix`接口。[3]

![Modern Web Guidance的检索与代码现代化工作流](/article-images/google-modern-web-guidance-agent-skills/workflow.webp)

*图：指南检索与旧模式改造流程；依据官方文档与仓库说明制作。[1][3]*

扫描覆盖率具有边界：官方文档给出的范围是指南目录的约20%，对象是具有确定性旧模式规则的子集。其余能力依赖任务驱动的搜索和检索。[3]

## CLI检查：一个HTML样例，三项候选问题

本次CLI检查的版本是**1.0.0**，输入是一个HTML样例。样例包含`scrollHeight`增高逻辑、缺少IME保护的Enter提交，以及`:invalid`错误样式。

扫描报告返回3项候选结果，指南ID是：

1. `form-fields-automatically-fit-contents`
2. `ime-safe-enter-submit`
3. `validate-input-after-interaction`

报告包含行号、对应代码片段、`keepWhen`与`dropWhen`。检查范围是命令可用性与报告结构，大型项目的准确率需要独立测试。

![CLI样例中的三项候选发现与验证条件](/article-images/google-modern-web-guidance-agent-skills/scan-check.webp)

*图：本文1.0.0 CLI检查结果的结构梳理；输入是自建HTML样例。*

这三项结果说明，改造对象包含代码体积、输入体验和交互语义。中文用户的Enter键承担候选字确认与聊天提交两项任务；处理逻辑需要区分输入法组合状态。

IME指南给出的核心判断包含`event.isComposing`与`event.keyCode === 229`。后者服务于部分Safari事件顺序问题，具有具体的兼容用途。[4]

Agent获得了需求、浏览器行为与已知陷阱之间的对应关系。

## 一个改造案例：文本框尺寸交给CSS

传统的文本框增高代码包含尺寸读取与样式写入。`field-sizing: content`提供了平台层面的实现方式。[4]

下面的示意保留固定尺寸的基础行为，现代浏览器获得内容驱动的高度：

```css
textarea {
  width: 100%;
  min-block-size: 6rem;
  max-block-size: 18rem;
  overflow: auto;
}

@supports (field-sizing: content) {
  textarea {
    field-sizing: content;
    height: auto;
  }
}
```

基础规则提供尺寸约束和滚动能力，支持该属性的浏览器采用内容驱动尺寸。指南建议的默认回退，是固定尺寸控件与内部滚动；跨浏览器自动增高的强需求，需要额外的回退设计。[4]

**自动增高的产品定位决定兼容方案。**体验增强允许固定尺寸回退；必需功能要求补齐支持范围。

## Baseline给出兼容依据，项目给出支持目标

Baseline描述Web特性跨主流浏览器的互操作状态。官方定义包括有限可用、新近可用、广泛可用；“广泛可用”要求互操作状态持续至少30个月。[2]

Modern Web Guidance的默认支持目标是Baseline Widely available。`AGENTS.md`或`CLAUDE.md`承载团队的浏览器政策，例如：

```text
This project's Baseline target is Baseline 2024.
```

这个目标决定Agent如何理解功能支持范围与回退要求。Origin Trial与近期单引擎等不稳定特性的指南，拥有独立的获取开关与`.mwgrc`配置。[1][2]

Baseline的意义，是给“能否采用这个API”提供数据依据。业务支持范围、目标设备与回归测试，构成团队的采用条件。

## 项目评测有提升，分母是浏览器断言

README的2026年11月8日快照给出了三组结果：[1]

| Agent与模型 | 任务数／断言数 | 无指导→有指导 |
| --- | --- | --- |
| Antigravity CLI／Gemini 4 Argon | 214／1673 | 58%→94%，增加36个百分点 |
| Codex CLI／GPT-6.1 Sol | 215／1795 | 54%→82%，增加28个百分点 |
| Claude Code／Opus 5.5 | 215／1801 | 57%→88%，增加31个百分点 |

项目采用配对任务，比较技能启用与关闭的实现。Playwright检查DOM、样式、源码模式和无障碍语义。公开评测页说明，通过率的分母是运行的检查项；评分前崩溃或超时的样本及对应配对属于剔除项。[5]

**这些数字代表项目评测中的最佳实践检查结果。**生产缺陷率、全部任务成功率和完整WCAG合规，具有不同的评估口径。

## 开发者的接入入口

CLI要求Node.js 22及以上版本。官方安装命令是：

```bash
npx modern-web-guidance@latest install
```

安装器提供交互向导。试用入口包括搜索、检索与目录扫描：

```bash
npx modern-web-guidance@1.0.0 search "auto size textarea"
npx modern-web-guidance@1.0.0 retrieve "form-fields-automatically-fit-contents"
npx modern-web-guidance@1.0.0 legacy-scan ./src --json
```

版本固定服务于结果复现，版本更新服务于指南更新。README提供`update`命令，团队需要维护技能版本与浏览器支持政策。[1]

我的判断是，这个项目的价值集中于一个具体环节：**Agent写代码的依据，增加了平台指南、兼容数据和验证条件。**代码量的减少属于结果，输入体验、语义正确性与浏览器行为的一致性，构成验收标准。

## 参考资料

1. [Modern Web Guidance仓库与README](https://github.com/GoogleChrome/modern-web-guidance)
2. [Google官方介绍](https://developer.chrome.com/docs/modern-web-guidance?hl=zh-cn)；[入门与Baseline说明](https://developer.chrome.com/docs/modern-web-guidance/get-started?hl=zh-cn)
3. [Google：代码库现代化工作流](https://developer.chrome.com/docs/modern-web-guidance/modernization-workflow?hl=zh-cn)；[分析器源码说明](https://github.com/GoogleChrome/modern-web-guidance-src/tree/main/src/analyzing)
4. [文本框尺寸指南](https://github.com/GoogleChrome/modern-web-guidance/blob/4dd968349e54ca45a05dd5c818fb035c9054b022/skills/modern-web-guidance/guides/forms/form-fields-automatically-fit-contents.md)；[IME输入指南](https://github.com/GoogleChrome/modern-web-guidance/blob/4dd968349e54ca45a05dd5c818fb035c9054b022/skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md)
5. [项目公开评测与计分口径](https://googlechrome.github.io/modern-web-guidance-src/)
