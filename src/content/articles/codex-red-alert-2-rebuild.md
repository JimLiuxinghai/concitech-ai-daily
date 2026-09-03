---
title: "Codex 连干 26 天重写《红警 2》？62 万行代码还不能验收"
description: "一段 92 秒演示显示《尤里的复仇》在 macOS 窗口中运行。作者称 Codex 连续工作 26 天、生成约 62.4 万行 C++。但源码、构建日志、成本和独立复现仍未公开：它是强演示，还不是可验收工程。"
slug: "codex-red-alert-2-rebuild"
publishedAtCST: "2026-09-03T16:28:22+08:00"
language: zh
author: JimLiu
categories: [devtools, products]
cover: "/article-covers/codex-red-alert-2-rebuild.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-WPaD8QIDFnw6tI04rxQyKAUeUQO0ZlxsZNGeNV2OMoN"
draft: false
---

一段约 92 秒的视频，最近把 Coding Agent 的尺度又往前推了一截。

画面中，《红色警戒 2：尤里的复仇》出现在 macOS 桌面上。菜单能点，遭遇战能进，单位可以移动，过场动画也能播放。项目作者 David Kalmanson 称，他给 Codex（GPT-5.6 Sol）下了一项任务：分析原版 Windows EXE，把游戏重写成可在 iOS 和 macOS 原生编译运行的 C++。

按照他的说法，Codex 连续工作了 26 天，全天不间断，最终写出约 62.4 万行代码。它会调用工具分析二进制，启动多个 Sub-agent，反复编译、运行、观察错误再修复。网络对战被主动跳过，当前仍有少量视觉问题。

听起来很夸张。演示也确实比“十分钟做个网页”强得多。

但现在还不能说 Codex 已经完成了《红警 2》的可验证重建。源码、提交历史、构建说明、测试记录和运行账单都没有公开。我们看到的是一个很强的 Demo，不是一项已经通过独立验收的工程成果。

![《尤里的复仇》出现在 macOS 窗口中（来源：David Kalmanson 演示视频）](/article-images/codex-red-alert-2-rebuild/demo-menu.webp)

## 视频能证明的，比推文少一些

这段视频至少证明了一件事：作者手里有一个能够在 macOS 桌面中启动并运行部分游戏内容的版本。窗口使用 macOS 的标题栏和控制按钮，视频随后进入菜单、遭遇战和过场动画。

它不能单独证明四件事。

第一，画面无法证明底层一定是 62.4 万行重新生成的 C++，也无法排除兼容层、原始二进制包装或已有社区代码的参与。第二，视频没有展示 iOS 设备。第三，它无法还原 26 天里人类做了多少干预。第四，代码量、Token、费用和失败次数都只能采信作者披露。

作者在 Reddit 的同主题帖子中补充说，Codex 使用多个 Sub-agent 理解 EXE、写代码、玩游戏并调试；他还表示源码以后会发布，只是目前没有准备好。面对质疑，他给出的仍是承诺和一张 IDE 截图，而不是可下载仓库。

这不是说项目有假。只是工程判断不能把“作者说了”与“外部复现了”写在同一栏。

![演示中的遭遇战画面，单位与地图已能运行（来源：David Kalmanson 演示视频）](/article-images/codex-red-alert-2-rebuild/demo-gameplay.webp)

## 真正新鲜的是 26 天循环，而不是 62 万行

62.4 万行代码很容易成为标题，也最容易误导。

代码行数不等于完成度。自动生成器可以迅速堆出大量重复代码，反编译器也能产生规模惊人的伪代码。一个游戏引擎是否可用，要看行为一致性、内存与性能、存档兼容、输入音频、渲染边界、网络协议，以及后续是否有人能维护。

这个案例更有价值的部分，是作者描述的工作循环：分析 EXE，写 C++，编译，启动游戏，观察错误，再回去修改。循环持续 26 天，而不是跑十分钟后交出一个静态代码包。

![作者所述的长周期 Agent 工作循环](/article-images/codex-red-alert-2-rebuild/agent-loop.webp)

逆向旧游戏尤其适合暴露 Coding Agent 的长短板。目标行为就在原始 EXE 里，模型可以不断对照；编译器、崩溃日志和实际画面又能提供反馈。问题也同样明显：视觉上“差不多”不代表函数行为一致，能跑一张地图不代表完整战役可通关，更不代表随机输入不会崩溃。

项目若最终站得住，价值会来自一段足够长、能自我纠错且没有彻底跑偏的执行过程。62 万行只是这个过程的副产品。

## 同系列的 OpenTS，给出了另一种验收标准

巧的是，就在这条推文出现前几天，社区发布了 OpenTS。它重建的是同属第二代 C&C 引擎家族的《泰伯利亚之日》，不是《红警 2》。两者不能直接比较完成度，但 OpenTS 很适合说明什么叫“可以被外部检查”。

OpenTS 公开了源码、构建文档和版本发布。项目团队称，他们结合 EA 已开放的相关游戏代码与多年逆向成果，对约 11150 个已知函数逐一匹配，达到约 98% 的指令级匹配率。这个 98% 是代码匹配，不是“游戏完成度”。仓库还明确列出已完成通关测试的战役、遭遇战、存档功能，以及测试相对有限的局域网联机。

这些材料让外部开发者可以提出具体问题：能不能在干净环境构建，哪类行为仍有偏差，某次提交改坏了什么。

Codex 项目目前还做不到这种讨论。它的视频更像产品演示，OpenTS 则已经进入工程协作。等源码发布后，外界才能按相同标准检查；单看 62 万行没有多少工程信息。

## 还要把知识产权问题单独拿出来

EA 已正式开放《命令与征服：泰伯利亚黎明》《红色警戒》初代、《命令与征服：叛逆者》以及《将军》和《绝命时刻》的完整源码。《红警 2》和《尤里的复仇》不在这份清单中。

这让本次重建多了一层现实约束。重新实现代码、调用玩家合法持有的游戏资源、直接分发原始美术与音乐，是不同问题。EA 的 C&C Modding Guidelines 对资产使用给出可撤销、有限、非商业的许可，同时明确禁止在 Mod 中包含游戏音乐，并要求项目不得冒充官方产品。

这些规则不能替项目作出法律结论。源码如果公开，开发者仍要说明逆向方法、第三方代码来源、游戏资产如何取得，以及仓库到底分发什么。Agent 写出来的代码也不会自动摆脱版权和许可证审查。

## 一次公开验收，至少该看到什么

![现有证据与缺失材料](/article-images/codex-red-alert-2-rebuild/evidence-gap.webp)

更长的视频增加不了多少证据。下一步应该是一个可审计仓库，至少包括：

1. 可追溯的提交历史，能看出代码如何在 26 天里增长，而不是一次性上传最终快照；
2. 从合法游戏副本提取必要资源的说明，以及不包含受限资产的最小源码包；
3. macOS 和 iOS 的干净构建流程，最好由独立开发者在另一台机器复现；
4. 战役、遭遇战、存档、音频、输入与性能测试，明确哪些通过、哪些没做；
5. Agent 运行记录，包括模型版本、工具、Token、费用、人工介入和失败恢复方式。

第五项尤其重要。连续运行 26 天听起来像“无人值守”，但它可能包含大量人工提示、环境修复和阶段性决策。不同程度的人类介入并不削弱项目价值，只会改变我们对 Agent 自主性的判断。

## Coding Agent 的 Demo，开始按“月”计时了

过去看 Coding Agent，大家习惯问它十分钟能写什么。这个案例换了一个问题：如果给模型工具、运行环境和足够长的时间，它能不能把反馈循环重复几千次，最后留下一个能工作的系统？

从演示看，答案至少不再是简单的“不行”。Codex 似乎跨过了大量编译、运行和修复回合，交出了一个肉眼可见的结果。

可它也把新的麻烦摆上桌面。任务越长，来源追踪、成本控制、测试覆盖和许可证审查越重要。人类不会逐行阅读 62 万行 Agent 代码，只能依靠可复现构建、自动测试和清晰的过程记录建立信任。

如果作者按承诺开放源码，并且第三方能在干净的 Mac 和 iOS 环境中完成构建，这会成为长周期 Coding Agent 很有分量的案例。在那之前，最准确的说法仍然是：有人展示了《尤里的复仇》在 macOS 上运行，并披露 Codex 为此连续工作 26 天。

够惊人了。但还没到验收单上签字的时候。

---

## 参考资料

1. sleepy.md, [原始中文推文](https://x.com/sleepy0x13/status/2095391300933804324)
2. David Kalmanson, [原始演示与项目说明](https://x.com/davidkal88/status/2095241374073512430)
3. Reddit, [Red Alert 2 rewritten from scratch by Codex](https://www.reddit.com/r/commandandconquer/comments/1w5o05o/red_alert2_rewritten_from_scratch_by_codex/)
4. Electronic Arts, [C&C Steam Workshop Support & Source Code](https://www.ea.com/games/command-and-conquer/command-and-conquer-remastered/news/steam-workshop-support)
5. Electronic Arts, [Command & Conquer Franchise Modding FAQ](https://www.ea.com/games/command-and-conquer/news/modding-faq)
6. OpenTS Developers, [OpenTS GitHub repository](https://github.com/OpenTS-Developers/OpenTS)
7. OpenTS Developers, [OpenTS release announcement](https://www.reddit.com/r/commandandconquer/comments/1vzsssz/today_were_releasing_opents_a_reverseengineered/)
