---
title: "Claude Code推出Mods，DeepSeek把整个Agent拆成插件"
description: "Claude Code Mods开放事件、工具调用与界面扩展；DeepSeek Harness采用Cordis架构，把模型、工具、会话和Agent循环纳入插件体系。两条路线指向Agent底座的设计权，伴随权限和兼容性问题。"
slug: "claude-mods-deepseek-harness-plugin-architecture"
publishedAtCST: "2026-10-02T07:40:00+08:00"
language: zh
author: JimLiu
categories: [devtools, products]
cover: "/article-covers/claude-mods-deepseek-harness-plugin-architecture.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-ZaadJE1vQYZhXQqMQNGr8R08yJwBoJokjO-jxHuHe90"
draft: false
---

Agent编程工具的竞争，出现一个新问题：开发者能改动工具的哪一层？

Anthropic发布Claude Code Mods。Mod支持事件拦截、工具调用改写、界面绘制和部分内置功能替换。DeepSeek Harness选择另一种结构：模型、工具、会话、沙箱、Agent循环和界面属于插件体系。

[一条推文](https://x.com/tianyi/status/2105790798461882377)把两者放在一起。它来自DeepSeek Harness相关开发者，带有产品立场；架构差异需要两家的官方资料支撑。两条路线的分界线是扩展权：产品允许开发者改动功能，运行时接受开发者重组。

![Claude Code Mods与DeepSeek Harness的插件化路线](/article-images/claude-mods-deepseek-harness-plugin-architecture/cover.webp)

## Claude Code Mods：事件成为扩展点

[Anthropic公告](https://claude.com/blog/claude-code-mods)给Mods的定义是小型TypeScript函数。Mod随Claude Code插件安装，支持命令行和桌面应用。它监听工具调用、权限请求、提示词提交和界面绘制等事件。

一个Mod可以改变送往模型的提示词，阻止或重写工具调用，处理权限请求，遮盖工具输出中的秘密信息。界面扩展包括按钮、输入框和侧边面板。多个Mod接入同一事件，加载顺序决定调用顺序。

[官方入门教程](https://claude.dev/blog/getting-started-with-claude-code-mods/)给出三个例子。Token Weather显示上下文用量；Blast Radius展示高风险命令的影响范围；Replay Theater展示代码修改过程。这些例子覆盖观察、拦截和界面三个方向。

Anthropic把内置的`/diff`功能做成Mod。开发者拥有关闭权和替换权。公告提出更多内置功能的迁移计划。迁移计划属于未来方向，与全部内置能力开放存在区别。

![Claude Code Mod的事件链](/article-images/claude-mods-deepseek-harness-plugin-architecture/mod-event-chain.webp)

Mods强化现成产品的可定制性。Claude Code承担基础工作流和产品体验，事件与界面接口承载局部行为修改。

## DeepSeek Harness：插件组成运行时

[DeepSeek Harness官方仓库](https://github.com/deepseek-ai/deepseek-harness)使用“Everything is a Plugin”描述架构。它是开源Agent运行时，许可证是MIT。项目处于预览阶段；仓库提醒开发者注意兼容性破坏。

[架构文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)列出Cordis内核与插件树。模型适配器、工具注册表、会话日志和Agent循环构成可替换组件。配置层负责挂载插件、组合服务和覆盖默认组件。

这项设计改变了扩展范围。模型供应商可以接入适配器；工具系统可以接入新能力；会话记录可以接入其他存储方式；Agent循环可以换成另一套驱动逻辑。开发者面对的是一套组合式运行时，而非单一产品的附加功能。

DeepSeek官网展示[Creator Mode](https://deepseek.com/en/harness/)：用户描述目标，Agent查看运行时接口，编写插件并安装。官方[持久化插件指南](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/practice/dynamic-cordis.md)说明插件配置归属当前profile，安装结果具有重启后的延续性。实际激活状态取决于插件管理器的结果；配置保存与插件激活是两种状态。

![DeepSeek Harness的插件层级](/article-images/claude-mods-deepseek-harness-plugin-architecture/harness-layers.webp)

“全部插件化”存在边界。Cordis定义服务、事件和生命周期，开发者需要遵守这些接口。插件可替换性依赖具体扩展点、组件依赖和运行时版本。兼容性结论需要测试支撑。

## 两条路线的取舍

Claude Code的起点是成熟编程产品。团队获得默认工作流、交互界面和企业管理能力；Mods提供定制空间。插件作者承担代码质量与安全责任。

DeepSeek Harness的起点是开放运行时。团队获得模型、工具、存储和循环的组合权；代价是更多架构选择、依赖管理与升级工作。项目的预览状态增加兼容性风险。

两者的共同方向是Agent harness。模型负责推理，harness负责上下文、工具、权限、会话和任务循环。插件化让这些决策进入开发者视野。竞争焦点覆盖模型编码能力与Agent工作方式定义权。

## 扩展权与权限问题

开放接口伴随安全隔离需求。[Anthropic公告](https://claude.com/blog/claude-code-mods)指出：Mods拥有Claude Code相同的本机访问权限，缺少沙箱隔离。来源审查与安装信任属于使用前提。Team和Enterprise环境有`sec-default`限制部分危险覆盖行为。管理员配置决定企业策略。

DeepSeek Harness的[安全说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/SAFETY.md)把项目定位为实验性预览软件。项目缺少安全审计和生产级安全保障。第三方插件、模型生成代码、命令执行和凭据访问构成损失风险。隔离环境、最小权限与备份属于必要措施。

控制权包含价值与风险。核心循环、权限系统和文件访问的扩展权放大错误插件的影响范围。

## 开发者该看什么

Claude Code用户的检查清单包含Mods事件列表、加载顺序和企业策略。DeepSeek Harness开发者的检查清单包含Cordis服务接口、profile配置、插件依赖和兼容性变更。两条路线的技术问题不同，判断标准相同：真实工作流收益、故障定位路径与权限边界。

这条推文提出的“Plugin Engineering”指向一项实质问题。Agent开发从提示词与工具配置，走向运行时结构的设计。Anthropic把现成产品开放给Mod作者。DeepSeek把运行时部件交给插件图。选择权伴随系统责任。

## 参考资料

- [原推文](https://x.com/tianyi/status/2105790798461882377)
- [Anthropic：Claude Code Mods公告](https://claude.com/blog/claude-code-mods)
- [Claude Code Mods入门教程](https://claude.dev/blog/getting-started-with-claude-code-mods/)
- [DeepSeek Harness官方仓库](https://github.com/deepseek-ai/deepseek-harness)
- [DeepSeek Harness架构文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)
- [DeepSeek Harness Creator Mode与插件指南](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/practice/dynamic-cordis.md)
- [DeepSeek Harness安全说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/SAFETY.md)
