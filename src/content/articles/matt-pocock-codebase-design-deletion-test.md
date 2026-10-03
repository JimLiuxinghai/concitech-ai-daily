---
title: "AI重构大模块：删掉这个模块会怎样？"
description: "Matt Pocock的codebase-design是一份代码设计词典。七个术语和四条原则帮助开发者识别空壳抽象，审查接口、测试位置与模块职责。仓库另有代码库巡检技能。"
slug: "matt-pocock-codebase-design-deletion-test"
publishedAtCST: "2026-10-04T07:05:00+08:00"
language: zh
author: JimLiu
categories: [devtools]
cover: "/article-covers/matt-pocock-codebase-design-deletion-test.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-V1e0uV9fA19hMdN2njJrgJAtglvCMyJZcFh1TQtNyca"
draft: false
---

AI写代码的速度提高，代码库里的抽象数量增加。一个文件叫`PaymentService`，另一个叫`PaymentManager`。两者各有接口，方法负责参数转发。删除哪一层？开发者与AI缺少共同的判断依据。

Matt Pocock的[原推文](https://x.com/mattpocockuk/status/2105563604384915639)提出一个任务：寻找浅模块，做“删除测试”，列出删除候选。[Viking的转述](https://x.com/vikingmute/status/2106394573346144544)强调一份名为`/codebase-design`的词典：它定义module、interface、depth、seam、adapter、leverage与locality，帮助AI讨论大模块重构。

对应的[GitHub仓库是`mattpocock/skills`](https://github.com/mattpocock/skills)。仓库原文给`codebase-design`的定位是设计参考。它缺少扫描或改写代码的执行流程。寻找重构候选属于另一项技能`improve-codebase-architecture`的职责。两个名字接近，工作不同。

![删除测试与代码库设计词典](/article-images/matt-pocock-codebase-design-deletion-test/cover.webp)

## 七个词，解决“接口”这个词的误会

[仓库的`codebase-design`原文](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/SKILL.md)给module下了宽口径定义：函数、类、包、跨层级代码均可构成模块。模块由interface与implementation组成。interface超出TypeScript的`interface`关键字和函数签名。调用者需要知道的约束、调用顺序、错误模式、配置与性能特征，构成接口的内容。

depth是接口的“杠杆率”：调用者学会一小块接口，获得多少行为。大接口配薄实现，产生浅模块；小接口承载大量行为，构成深模块。leverage是调用者得到的收益。locality是维护者得到的收益：改动、错误和验证工作集中一处。

seam指行为替换的位置，adapter是符合该位置接口的具体实现。仓库选择seam，避开含义多重的“boundary”；它选择module，避开含义含混的“service”。这些词的价值来自讨论对象的精确性。

统一词汇带来具体收益。团队提出“这个service需要拆分”，讨论对象含糊；团队提出“这个模块的接口暴露了三个内部依赖”，问题获得具体形状。

![浅模块与深模块的接口差异](/article-images/matt-pocock-codebase-design-deletion-test/depth.webp)

## 删除测试：空壳抽象还是有效封装

设想一个订单计价场景。`PriceService`公开三个方法：取折扣、取税额、做货币换算。每个方法调用另一个同名方法，参数和异常留给上层处理。三个调用方需要知道折扣、税额与汇率的执行顺序。这个模块的接口复制了内部依赖。

删除`PriceService`，转发层消失，调用方的知识负担维持原状。这是浅模块的信号。

另一个设计公开`quote(order)`。模块内部处理折扣顺序、税额计算、汇率与舍入规则，返回金额明细。结算页、发票任务与测试面对同一个接口。删除这个模块，这些规则散落到多个调用方。它通过了删除测试。

删除测试的判断点是复杂度的去向：模块消失，复杂度消失，还是复杂度扩散到调用方？

![删除测试的两种结果](/article-images/matt-pocock-codebase-design-deletion-test/deletion.webp)

## 四条原则，各自检查一个盲点

第一，深度属于接口。代码行数与模块深度是不同指标。深模块的实现由多个小函数组成。调用者面对的是外部接口。

第二，删除测试检查模块的存在价值。转发层消失，工作量下降；有效封装消失，调用方复制规则。

第三，接口是测试入口。测试断言内部状态或私有步骤，重构便会牵动大量测试。仓库建议测试面向模块接口与可观察结果。

第四，一个adapter对应假设中的seam；两个有正当理由的adapter支撑真实seam。生产环境的远程实现和测试中的内存实现构成一组。缺乏变化需求的额外接口增加转发层。

这四条原则是设计检查表，缺少自动裁决能力。真实系统有兼容性、部署与团队协作约束。[仓库的补充文件](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DEEPENING.md)把依赖分为纯内存、可用本地替身、团队自有远程系统和第三方系统。不同依赖需要不同测试方案。

## 项目定位与使用方式

`codebase-design`提供词汇与审查问题，缺少“扫描全库—提交补丁”的执行流程。[`improve-codebase-architecture`的说明](https://github.com/mattpocock/skills/blob/main/docs/engineering/improve-codebase-architecture.md)给它的定位是代码库巡检：生成候选报告，用户挑选问题，重构属于后续工作。原推文的“找浅模块”任务适合这个巡检流程，`codebase-design`负责定义判断标准。

仓库README提供安装入口：`npx skills@latest add mattpocock/skills`。安装器允许选择技能。了解方法的读者可读[项目主页](https://github.com/mattpocock/skills)和[`codebase-design`原文](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/SKILL.md)。阅读资料保持项目原状。

AI重构的难题是模块职责。调用方需要知道多少？“删除测试”给这个问题一把尺。那层代码的消失产生两种结果：复杂度消失，或者复杂度扩散。结果揭示模块的存在价值。

## 参考资料

- [Viking推文](https://x.com/vikingmute/status/2106394573346144544)
- [Matt Pocock原推文](https://x.com/mattpocockuk/status/2105563604384915639)
- [GitHub项目：mattpocock/skills](https://github.com/mattpocock/skills)
- [`codebase-design`技能原文](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/SKILL.md)
- [`improve-codebase-architecture`项目说明](https://github.com/mattpocock/skills/blob/main/docs/engineering/improve-codebase-architecture.md)
- [深模块依赖与测试说明](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DEEPENING.md)
