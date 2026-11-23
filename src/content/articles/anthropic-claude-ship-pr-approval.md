---
title: Anthropic 发布 Claude Ship！AI 审代码、修 CI，谁有权批准合并？
description: Claude Ship 把代码审查、PR 修复和审批策略放进 GitHub 工作流。本地 /ship 命令、组织代理和分支保护各管哪一段？
slug: anthropic-claude-ship-pr-approval
publishedAtCST: '2026-11-24T07:25:18+08:00'
language: zh
author: JimLiu
categories:
  - devtools
  - products
cover: /article-covers/anthropic-claude-ship-pr-approval.webp
draft: false
---

一条 PR 改了三行代码。测试挂了，开发者切回分支排查。审查意见来了，开发者改完又推一版。检查变绿，PR 还在等签字。几分钟的修改，要占用好几轮注意力。

Anthropic 发布了 **Claude Ship**。这套 GitHub 工具负责审查改动、处理失败的检查、核对合并所需的审批。团队可以授权 Claude 批准部分变更，也可以要求指定的人签字。**审批策略由团队定义，合并条件由 GitHub 分支规则执行。**

## 一条 PR 要过三道关

**Code Review 找问题。** 它结合代码库上下文检查改动，在对应的代码行留下带严重程度的意见。团队可以为仓库选择 Quick、Standard 或 Deep 三种审查强度。代码审查找的是这次改动可能带来的问题，测试负责验证已定义的行为。

**PR Steward 处理问题。** 测试失败、分支冲突、人类或机器人提出修改意见，Steward 都可以接手。它在云端工作，把修复推到 PR 分支，并在评论里记录改了什么、怎么撤销。设计争议可以留给团队讨论。Steward 负责准备变更，审批与合并由其他环节处理。

**Claude Approvals 计算还缺谁的签字。** 团队把规则写进仓库的 `.claude/approvals.yml`。审批检查读取默认分支上的规则。规则可以按文件路径区分文档、测试或核心代码，也可以结合审查结果。规则允许的变更可获得 Claude 的批准。

![Claude Ship 的三个环节及 GitHub 分支规则的职责](/article-images/anthropic-claude-ship-pr-approval/01-pr-workflow.webp)

## 「Claude 批准」离合并还有多远？

假设一个仓库把文档和计费逻辑交给不同的人负责。团队可以允许 Claude 批准纯文档修订，涉及计费逻辑的 PR 则要求两位具备权限的人签字。一个 PR 同时改了文档和计费逻辑，适用的更严格规则仍需满足。

默认分支上的规则还有个作用。有人提交 PR 修改审批文件，这条 PR 的审批依据仍是默认分支上的旧规则。新规则的生效点是变更进入默认分支。

**GitHub 的分支保护是实际的合并门槛。** 团队可以把 Claude Approvals 设为必过检查。CI、CODEOWNERS 以及 GitHub 要求的其他审批按各自的规则运行。仓库开启自动合并或合并队列、审批策略允许全程无人工签字、其他门槛也已满足，PR 就可能在无人操作的情况下合并。

审批意见针对的是一定范围内的改动。Steward 推送修复后，新的改动可能让原有审批失效。评审者要看的版本，应当和最终接受的版本一致。

## 一个 `/ship` 命令，还是整个仓库启用？

开发者可以在 Claude Code 的本地会话里运行 **`/ship`**。它可以用开发者的 GitHub 身份提交和推送改动、创建 PR、审查代码，并继续处理反馈与失败检查。文档描述的本地流程由开发者完成合并。工作区里准备提交的文件，值得在运行前看一眼。

组织管理员可以在仓库层面开启 Claude Ship。功能由组织管理，成员无需对每条 PR 输入命令。PR Steward 使用 Claude 的 GitHub 应用身份，组织承担使用费用。团队可以先选一个仓库，用观察模式查看规则会要求哪些签字，再决定是否把它设为 GitHub 的必过检查。

![本地 /ship 和组织版 Claude Ship 的作用范围、身份与计费差异](/article-images/anthropic-claude-ship-pr-approval/02-two-entry-points.webp)

Claude Ship 面向 **Claude Team 和 Enterprise** 的 GitHub 仓库。Code Review 已正式开放，PR Steward 和 Claude Approvals 属于公开测试。组织代理按 token 用量计费。观察模式下，策略触发的模型分类和代码审查也会产生费用。`/ship` 计入开发者的 Claude Code 用量。

已有自动 Code Review 的团队可以留意一处配置变化。审批文件开始覆盖某些改动后，这些 PR 的自动审查可能停止。Anthropic 文档说明，匹配规则需要列出 `claude/code_review` 才能保留这部分自动审查，观察模式也适用。

## Anthropic 自己用出了什么结果？

Anthropic 披露，Claude Code 团队从 6 月到 9 月合并的 PR 数量超过原来的两倍，被撤回的比例下降超过 40%。代码审查是这套工程流程的一环。公告给的是团队前后两段数据，单个工具贡献了多少，公告没有拆分。

一个内部案例涉及 Analytics API 的文档。旧说明让客户误以为管理员密钥可以查询 Pro 和 Team 的使用量。产品经理根据反馈发起修订，Code Review 未发现阻塞性问题，文档负责人签字，审批检查通过，修订在当晚合并。

这类变更适合看出 Claude Ship 的价值。一条 PR 的排队时间，常来自修复、复核和交接。AI 可以承担多轮检查和修复。团队要回答的是，哪些改动能接受机器审批，哪些改动需要具体的人负责。**这项决定可以写进仓库，成为每条 PR 都能看到的规则。**

## 参考资料

- [Anthropic 发布公告](https://claude.com/resources/articles/introducing-claude-ship)
- [Claude Ship 产品文档](https://code.claude.com/docs/en/claude-ship) · [PR Steward 文档](https://code.claude.com/docs/en/pr-steward)
- [本地 /ship 命令文档](https://code.claude.com/docs/en/ship-command)
- [Claude Approvals 文档](https://code.claude.com/docs/en/approvals) · [审批策略说明](https://code.claude.com/docs/en/approvals-policy)
- [Claude Approvals 与 GitHub 分支规则](https://code.claude.com/docs/en/approvals-github-rules)
