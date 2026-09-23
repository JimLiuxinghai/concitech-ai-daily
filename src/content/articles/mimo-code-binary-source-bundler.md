---
title: "小米 MiMo Code 内置源码打包器：能力属实，上传证据为零"
description: "官方 v0.1.14 二进制包含开源仓库缺失的私有模块。collectCodebase 具备仓库扫描、源码读取和 Zstandard 压缩能力，静态调用证据与整库上传证据缺席。"
slug: "mimo-code-binary-source-bundler"
publishedAtCST: "2026-09-23T08:58:14+08:00"
language: zh
author: JimLiu
categories: [devtools, security]
cover: "/article-covers/mimo-code-binary-source-bundler.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-Z-DYQ-vHqQNtUW_R9-q-5ktLjFwusvJ2DeFCnrAHUpy"
draft: false
---

小米 MiMo Code 的官方二进制与同版本公开源码存在功能差异。

官方 v0.1.14 macOS arm64 发布包包含 `codebase-bundle`、`trajectory-bundle` 等私有模块。`collectCodebase` 函数具备 Git 仓库扫描、源码正文读取、清单生成和 Zstandard 压缩能力。

另一组证据清晰：静态调用点缺席，源码包对应的网络请求缺席，服务端接收记录缺席。

结论包含两句话：源码打包能力属实；“整库上传”缺少证据。

![MiMo Code源码打包能力的确认事实与证据缺口](/article-images/mimo-code-binary-source-bundler/evidence-boundary.webp)

## 官方发布包给出了什么

MiMo Code v0.1.14 的发布日期是 2026 年 9 月 2 日。官方 GitHub Release 提供 macOS、Linux 和 Windows 二进制。

本次核验对象是 `mimocode-darwin-arm64.zip`。文件 SHA-256 是 `3e14e3fe09513e870a30683db09cf4ef165eb7ce3524c6cf18a8b50bec7b1a2c`，该值与官方 Release 页面一致。

解压产物是一个 Bun 单文件可执行程序。静态字符串提取暴露了六个扩展模块：`codebase-bundle`、`codebase-upload-index`、`trajectory-bundle`、`trajectory-event`、`free-login` 和 `mimo-free`。

公开仓库的同版本源码缺少前四个模块。公开构建脚本记录了差异源头。

## 公开构建脚本指向仓库外代码

`packages/opencode/script/build.ts` 定义了一个扩展暂存目录 `src/ext`。脚本读取的扩展源目录是：

```text
../../mimoapi/packages/opencode/src/ext
```

这个路径位于 MiMo Code 仓库之外。该目录的存在触发私有扩展复制。构建程序生成 `_manifest.ts`，扩展进入 Bun 单文件二进制。进程退出钩子负责删除暂存目录。

这套构建方式属于 private overlay。公开仓库提供主体代码，内部仓库提供产品扩展，官方发布包合并两部分。

![MiMo Code公开构建脚本引用仓库外私有扩展](/article-images/mimo-code-binary-source-bundler/build-overlay.webp)

安全争议来自“开源”承诺与构建可复现性的差距。MiMo Code 的许可证是 MIT，小米官网称项目完成开源。公开源码的功能集合小于官方二进制。

许可证允许这种分层发布。透明度问题存在：用户审查公开仓库，用户运行官方二进制，二者的信任边界有差异。

## collectCodebase 收集什么

反编译后的函数逻辑完整。

`collectCodebase` 调用 `git ls-files` 获取 tracked 文件和 untracked 文件，后者服从 `exclude-standard`。过滤规则排除 `.git`、`node_modules`、构建目录、媒体文件、压缩包、密钥文件、`.env` 文件和名称含 `credentials`、`secret` 的路径。

函数读取 UTF-8 文本，记录路径、权限位、字节数、SHA-256、语言和 Git 状态。文件正文进入 `content` 字段。仓库 URL、commit、分支和 dirty 状态进入 repository 字段。JSON 结果接受 Zstandard 压缩。

代码设置四项预算：2000 个文件、5 MB 源码总量、2 秒扫描时间、6 MB 压缩包上限。单个大文件、二进制文件和符号链接触发跳过。

“整库打包”属于社交媒体概括。技术范围受预算和过滤器约束。源码正文进入压缩包这一事实保持成立。

## 能力存在与行为发生是两件事

静态审计回答“程序包含什么”。网络抓包和服务端记录回答“程序发送过什么”。

官方二进制的 `collectCodebase` 名称出现位置是模块导出表。函数主体返回 bundle，网络发送逻辑缺席。内置调用点缺席。

“死代码”判断符合静态证据。函数可达性决定安全属性。插件、动态入口、服务端配置和后续版本构成潜在连接点。连接证据缺席。

“整库上传”指控的证据条件包含三类：调用链、外发请求和接收记录。三类证据的公开数量是零。

![MiMo Code公开遥测路径与源码打包路径的证据强度](/article-images/mimo-code-binary-source-bundler/data-paths.webp)

## 遥测外发属于确认事实

MiMo Code 的公开源码包含产品遥测。目标地址是 `https://tracking.miui.com/track/v4/o`。环境变量 `MIMOCODE_ENABLE_ANALYSIS` 的默认值是 `true`，`false` 或 `0` 关闭遥测。

公开遥测事件包括 `model_call`、`tool_call`、`agent_request` 和 `try_best_detected`。字段包括模型名称、供应商、Token 数量、工具名称、输入输出字节数、任务阶段和校验状态。公开遥测结构排除源码正文字段。

官方二进制包含私有 `trajectory-event` 模块。静态代码显示了仓库 URL、commit、分支、系统提示词、消息、工具步骤和代码 diff 等数据结构。该模块使用同一个分析开关。实际网络载荷的确认条件是动态抓包。

小米隐私政策允许 Xiaomi MiMo Code 收集用户提供的文本、图片、视频、音频和 IP 信息，并列出使用统计、会话事件、请求时长和错误数量。政策文本采用宽泛类别。源码快照、仓库 URL、commit 和分支缺少专门条目。

矛盾位于数据类别的颗粒度。隐私政策与字段级说明属于两种材料。字段级说明是必要补充。

## 小米欠缺三份材料

第一份是源码与二进制差异清单。Release 说明的必要内容包括每个私有模块的名称、用途、默认状态和数据字段。

第二份是遥测数据字典。表格字段包括事件名、字段、采样率、保留期、接收域名和关闭方式。

第三份是可复现构建说明。供应链证明包括官方源码提交、私有扩展版本、依赖锁文件、构建参数和产物哈希。

三份材料解决核心问题：程序内容与发送内容获得披露。

## 企业用户的处置清单

企业环境的处置选项有四项：

- 源码构建版与功能差异评估
- 官方包哈希固定与升级安全评审
- 环境变量：`MIMOCODE_ENABLE_ANALYSIS=false`
- `tracking.miui.com` 等非模型域名的网络出口限制

模型调用所需上下文与产品分析遥测属于两条数据链。前者服务推理，后者服务产品分析。两条数据链各有权限、目的和保留期说明责任。

“MiMo Code 偷代码”属于过度结论。准确结论是：官方二进制包含公开仓库缺失的源码打包能力，发布透明度低于开源产品的信任承诺。

## 参考资料

1. [MiMo Code v0.1.14 官方发布包与 SHA-256](https://github.com/XiaomiMiMo/MiMo-Code/releases/tag/v0.1.14)
2. [MiMo Code v0.1.14 构建脚本的 private overlay](https://github.com/XiaomiMiMo/MiMo-Code/blob/v0.1.14/packages/opencode/script/build.ts#L184-L218)
3. [MiMo Code 默认遥测开关](https://github.com/XiaomiMiMo/MiMo-Code/blob/v0.1.14/packages/opencode/src/flag/flag.ts#L106-L108)
4. [MiMo Code 遥测事件字段](https://github.com/XiaomiMiMo/MiMo-Code/blob/v0.1.14/packages/opencode/src/metrics/subscriber.ts)
5. [MiMo Code 遥测接收端点](https://github.com/XiaomiMiMo/MiMo-Code/blob/v0.1.14/packages/opencode/src/metrics/client.ts)
6. [小米 MiMo Code 官方介绍](https://mimo.mi.com/docs/zh-CN/news/latest/mimocode)
7. [Xiaomi MiMo 隐私政策](https://privacy.mi.com/XiaomiMiMoPlatform/zh_CN/)
