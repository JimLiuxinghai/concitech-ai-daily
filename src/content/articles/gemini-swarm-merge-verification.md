---
title: Gemini 编程小队的验收盲区！两条分支全绿，合并候选失败
description: 一个本地 Git 实验复现了多 Agent 写代码的验收盲区。两条分支通过同一项测试，合并候选的测试失败。文章给出跨模块约束、候选提交复测和证据交付的方法。
slug: gemini-swarm-merge-verification
publishedAtCST: '2026-11-28T07:17:33+08:00'
language: zh
author: JimLiu
categories:
  - devtools
cover: /article-covers/gemini-swarm-merge-verification.webp
draft: false
---

两条分支改动两个不同的文件。两条分支通过同一项测试，Git 合并成功，合并候选的测试失败。

我的本地实验包含 Git 工作副本和一个 Python 测试。两份缓存配置构成实验对象。实验结果描述的是合并行为与配置约束。

0xMovez 的原文给 Gemini 4 Neon、Hydrogen 和验证者分配了计划、执行和复查职责。上一篇介绍了组队和只读审计。多名成员的代码构成合并候选。**验证者的结论绑定哪个提交？** [0xMovez 的八步教程](https://x.com/0xMovez/status/2125577359269019791) · [上一篇组队实战](https://ai.concitech.org/articles/gemini-neon-hydrogen-swarm-workflow/)

## 一条约束，两个互相影响的改动

示例的缓存有两个配置项。刷新任务的间隔是 30 秒，缓存的有效期是 120 秒。基线分支有一项配置约束。刷新间隔小于缓存有效期。

A 分支负责减少刷新次数。它的刷新间隔是 75 秒，缓存有效期保持 120 秒，测试通过。B 分支负责缩短旧数据的保留时间。它的缓存有效期是 60 秒，刷新间隔保持 30 秒，测试通过。

两个工作副本的起点是同一个提交。A 修改 `refresh_config.py`，B 修改 `cache_config.py`。Git 接受了两次合并。候选版本的刷新间隔变成 75 秒，有效期变成 60 秒。同一项测试返回 `AssertionError: 75 not less than 60`。修复候选把刷新间隔改成 45 秒，测试恢复通过。

![刷新间隔、缓存有效期与约束测试结果的五组对照](/article-images/gemini-swarm-merge-verification/01-cache-contract.webp)

实验的核心是一行断言。它比较测试对象的两个参数。

```python
self.assertLess(REFRESH_INTERVAL_SECONDS, CACHE_TTL_SECONDS)
```

这个测试检查配置关系。生产系统的缓存余量取决于刷新耗时和调度延迟。45 秒的配置给这个例子留出 15 秒的名义余量。

## Git 管理文件，验收清单记录跨模块约束

Antigravity 的文档说明，Swarm 成员的默认配置是共享工作区。协调者有分配独立仓库副本的选项。隔离副本解决同一工作区的并发编辑问题。**缓存例子的两份配置共享一条业务约束。** A 的测试使用旧的有效期，B 的测试使用旧的刷新间隔。两份报告各自准确，合并版本需要自己的证据。 [Antigravity Swarm 文档](https://antigravity.google/docs/swarm) · [Git worktree 文档](https://git-scm.com/docs/git-worktree)

任务单需要记录文件归属、模块依赖和共享约束。缓存例子的约束就是「刷新间隔小于缓存有效期」。类似的问题包括写入格式与读取格式、客户端等待时间与服务端处理预算、价格计算与结算取整。验收者需要为这些约束准备可执行的测试。

Flavio Copes 的 Antigravity 实测展示了验证者对报告的复查。验证者发现链接审计报告中的两处问题，成员提交了修正版。写入任务的验收对象包括合并后的代码与配置。 [Flavio Copes 的复查实测](https://flaviocopes.com/antigravity-swarm/)

## 验收报告的第一行是候选提交

下面是写入任务的 `/swarm` 提示词。文件路径和测试命令来自缓存示例。

```text
A 和 B 使用从同一基线出发的独立工作副本。
A 负责 refresh_config.py，B 负责 cache_config.py。
任务约束为刷新间隔小于缓存有效期。保留 test_contract.py。

协调者收集两个分支的提交和各自的测试结果。
协调者从目标分支创建临时合并候选，记录候选提交哈希。
验证者在该候选上运行 python3 -m unittest -v test_contract。
报告包含基线、分支提交、候选提交、检查命令和退出码。
验证失败的候选退回实现者。修复后的候选重新验收。
```

![独立分支检查、构建合并候选和候选验收的流程图](/article-images/gemini-swarm-merge-verification/02-merge-gate.webp)

验证者的结论绑定一个候选提交。候选提交的变化带来新的测试对象。报告里的候选哈希和退出码提供了追溯依据。验证者的模型选择影响审查的视角。候选版本的测试输出属于验收证据。

GitHub Merge Queue 提供了自动验收入口。队列的检查对象包括 PR、目标分支最新版本和前序排队改动的组合。GitHub Actions 的 `merge_group` 事件触发这项检查。队列的验收范围取决于测试覆盖的行为。 [GitHub 合并队列文档](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)

我关心的问题是，**团队准备合入的那个提交通过了哪些跨模块检查？** 这项检查的记录属于最终版本的交付证据。
