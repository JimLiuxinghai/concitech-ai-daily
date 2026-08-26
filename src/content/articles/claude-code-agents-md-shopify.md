---
title: "Shopify CEO 考虑禁用 Claude Code：一份 AGENTS.md，为何成了大公司难题？"
description: "Tobi Lütke 因 Claude Code 不原生读取 AGENTS.md，公开表示考虑在 Shopify 禁用它。争议表面是文件名，背后却是多模型团队的指令漂移、开放标准与模型专用优化之间的冲突。"
slug: "claude-code-agents-md-shopify"
publishedAtCST: "2026-08-26T11:06:42+08:00"
language: zh
author: JimLiu
categories: [devtools, products]
cover: "/article-covers/claude-code-agents-md-shopify.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-WytpTA2CjW7w8Gt4f0oEQNtiHnWpoWA9lXWxXT2_mb4"
draft: false
---

一个 Markdown 文件，差点把 Claude Code 挡在 Shopify 门外。

8 月 25 日，Shopify 联合创始人兼 CEO Tobi Lütke 在 X 上写道，他正在考虑禁止公司使用 Claude Code，直到它愿意读取 `AGENTS.md` 和 `.agents/skills` 等社区约定。

他给出的理由很具体：团队成员使用不同 Coding Agent 时，如果有些工具读取 `AGENTS.md`，Claude Code 却只读取 `CLAUDE.md`，项目指令就可能出现“split brain”——同一个仓库里，两套工具活在两套事实中。

注意他的原话是“正在考虑”，不是 Shopify 已经封禁 Claude Code。中文转述把它写成既成事实，会让一场值得讨论的工程争议变成普通的公司八卦。

![相关 X 讨论截图](/article-images/claude-code-agents-md-shopify/source-thread.webp)

Anthropic 的 Claude Code 负责人 Thariq Shihipar 随后回应，团队正在研究如何让 Claude Code 更容易被开发者修改，包括支持 `AGENTS.md` 或其他系统提示改动。他同时强调，不同模型并非可以随意互换，系统提示的变化可能影响性能，因此不同模型会使用不同的系统提示。

评论区里，Grok 又把事情推向了另一个极端：根据所谓泄露源码，它判断只要改掉硬编码的文件名，几乎一句代码就能解决。

这两种说法看起来针锋相对，其实谈的不是同一层问题。

## 先说结论：读取文件很容易，承诺兼容并不只是一行代码

如果任务只是“让程序找到 `AGENTS.md` 并把内容塞进上下文”，机械改动很可能不大。Claude Code 现在已经支持从 `CLAUDE.md` 里用 `@AGENTS.md` 导入文件，说明模型当然能读懂其中的 Markdown 内容。

但原生支持一种社区约定，产品还要回答后面的问题：

- `AGENTS.md` 和 `CLAUDE.md` 同时存在时，谁优先？
- 根目录和子目录都有规则时，如何继承，冲突时听谁的？
- 两份文件引用了相同内容，是否会重复占用上下文？
- 老仓库升级后，行为能不能保持稳定？
- 外部导入、符号链接和仓库内的恶意指令，信任边界放在哪里？

所以，“改一行代码”也许描述了文件发现层；Anthropic 所说的模型适配和性能风险，则落在评测与产品承诺层。前者不能证明后者不存在，后者也不能成为长期拒绝互操作的万能理由。

![“一行代码”与完整产品支持的差别](/article-images/claude-code-agents-md-shopify/02-one-line-vs-product.webp)

至于基于“泄露源码”得出的判断，最多只能当线索，不能当证据。没有完整版本、测试和上下文，外部模型无法知道那段代码是不是当前实现，也无法验证改动是否会破坏目录优先级、缓存或已有用户配置。

## Tobi 真正在意的，是团队成本

个人开发者看到的只是多放一个文件。大型工程组织看到的是规则漂移。

假设 Shopify 把支付系统的测试命令从 `npm test` 改成 `pnpm test`。使用 Codex、Cursor 或其他兼容工具的人更新了 `AGENTS.md`，Claude Code 用户维护的 `CLAUDE.md` 却漏掉了这次修改。两边都觉得自己遵循了仓库规范，结果一个跑新命令，一个跑旧命令。

更麻烦的是安全规则。比如“不得把生产数据复制到本地”“修改结算逻辑必须运行指定回归测试”，如果只存在于某个供应商专用文件里，换一个 Agent 就可能悄悄失效。

![重复维护如何造成“分裂脑”](/article-images/claude-code-agents-md-shopify/01-split-brain.webp)

这就是 Tobi 所说的 split brain。它不是模型智力问题，而是配置管理问题。一个团队采用的 Agent 越多，重复维护造成的概率性故障越多。

`AGENTS.md` 的价值也在这里。它把自己定义为“给 Agent 的 README”：用普通 Markdown 保存构建步骤、测试命令、目录结构和代码规范。官方站点显示，它已经出现在 6 万多个开源项目中，并被多种 Coding Agent 和编辑器支持；格式目前由 Linux Foundation 旗下 Agentic AI Foundation 维护。

它并没有复杂 schema，也不要求固定字段。正因为足够简单，才有机会成为跨工具的最小公分母。

## 但 Anthropic 的顾虑也不是“打官腔”三个字就能抹掉

Claude Code 官方文档明确提醒，`CLAUDE.md` 会在会话开始时进入上下文，文件越长，越消耗 Token；互相冲突的规则还可能让模型随机选择其一。官方建议把单个文件控制在 200 行以内，并用按路径加载的规则或 Skill 减少常驻内容。

Thariq 最近介绍 Claude 5 的上下文工程时还披露，Anthropic 为新模型删掉了 Claude Code 系统提示的 80% 以上，在内部代码评测上没有可测量的损失。背后的经验恰恰是：更强的模型不一定需要更多规则；重复和冲突的上下文会拖累表现。

从这个角度看，贸然把 `AGENTS.md`、`CLAUDE.md`、嵌套规则和两套 Skills 一股脑加载，确实可能制造新的问题。

可这说明的是“兼容要有明确语义”，不是“开放格式不值得支持”。更合理的路径是把 `AGENTS.md` 当通用事实源，把 Claude 特有要求留在一个很薄的适配层里。

## 今天最稳的办法：不要复制两份，做一个薄适配层

Claude Code 当前官方文档已经给出了可用方案：在仓库根目录创建 `CLAUDE.md`，第一行导入 `AGENTS.md`。

```markdown
@AGENTS.md

## Claude Code

Use plan mode for changes under `src/billing/`.
```

如果没有任何 Claude 专用补充，也可以把 `CLAUDE.md` 做成指向 `AGENTS.md` 的符号链接。Windows 对符号链接权限更敏感，优先使用 `@AGENTS.md` 导入更省事。

![推荐的仓库兼容结构](/article-images/claude-code-agents-md-shopify/03-adapter-recipe.webp)

落到团队实践，可以遵循四条规则：

1. **把项目事实放进 `AGENTS.md`。** 构建、测试、安全约束和代码规范不要绑定某个模型品牌。

2. **让 `CLAUDE.md` 保持很薄。** 导入通用规则，只补充 Claude Code 独有的工作方式。

3. **不要手工复制两份正文。** 复制看起来最省事，长期一定会漂移；使用导入、符号链接或生成脚本。

4. **Skills 也要区分格式与发现路径。** `SKILL.md` 是开放格式，但 Claude Code 当前项目级发现路径是 `.claude/skills/`，不能仅凭目录名称相近就假设 `.agents/skills/` 会被自动读取。共享 Skill 可以保留一个源目录，再按各工具文档建立适配或链接，并用真实任务回测。

## 这场争议会成为供应商的一道分水岭

Coding Agent 正从“一个人挑一个最好用的工具”，变成“一个团队同时使用多个 Agent”。有人用 Claude Code 写核心逻辑，有人用 Codex 跑长任务，有人留在 IDE 里使用 Cursor 或 Copilot。此时，项目上下文不能跟着工具品牌分叉。

模型厂商当然可以保留专用优化。系统提示、工具描述、缓存策略和评测方法，本来就不会完全相同。但仓库里的构建命令、安全边界和协作规范，不该被迫复制成多个供应商版本。

开放标准真正要解决的，不是让所有 Agent 变得一样，而是让它们至少从同一份项目事实出发。

Tobi 的公开施压有表演成分，Grok 的“一行代码”也过于轻巧。可两者共同戳中了一个真实问题：当 Agent 进入企业研发主流程，互操作不再是加分项，而是采购和治理的基本门槛。

下一场 Coding Agent 竞争，未必只看谁的模型跑分最高。

还要看谁愿意好好读同一份说明书。

## 参考资料

1. [马天翼：相关 X 讨论](https://x.com/fkysly/status/2092423457946648597)
2. [Tobi Lütke：关于 Claude Code 与 AGENTS.md 的原帖](https://x.com/tobi/status/2092256517521092797)
3. [Claude Code 官方文档：AGENTS.md 兼容方式](https://code.claude.com/docs/en/memory#agents-md)
4. [AGENTS.md 官方站点](https://agents.md/)
5. [Agent Skills 开放格式说明](https://agentskills.io/home)
6. [Claude Code GitHub：AGENTS.md 功能请求 #6235](https://github.com/anthropics/claude-code/issues/6235)
7. [Claude Code GitHub：AGENTS.md 与 .agents/skills 请求 #31005](https://github.com/anthropics/claude-code/issues/31005)
8. [Anthropic：Claude 5 的上下文工程新规则](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models)
