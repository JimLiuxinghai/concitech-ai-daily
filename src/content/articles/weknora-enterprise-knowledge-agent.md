---
title: "微信团队开源 WeKnora：企业知识库有了 Agent、Skill 与长期记忆"
description: "微信团队发布 WeKnora 0.8.0。这个开源框架集成 RAG 问答、ReAct Agent、Wiki 生成、Skill 沙箱、长期记忆与企业权限，支持私有部署。"
slug: "weknora-enterprise-knowledge-agent"
publishedAtCST: "2026-09-16T07:29:53+08:00"
language: zh
author: JimLiu
categories: [products, devtools]
cover: "/article-covers/weknora-enterprise-knowledge-agent.webp"
wechatMediaId: "qwac_8j4kaaga6WV5YUa-ZviDs8Xx5KLvzCf1hdpc_aDDQnIjSAD6GGEvrE2wg7R"
draft: false
---
微信官方账号发布了一段两分多钟的视频。

主角名叫 WeKnora。开发团队来自腾讯微信团队。代码采用开源方式发布，产品定位是企业知识框架。

知识库的常见产品形态是上传 PDF、提问、返回答案。WeKnora 覆盖十余个模块。系统组件包括文档解析、混合检索、ReAct Agent、MCP、Skill 沙箱、Wiki 生成、长期记忆和企业权限。

GitHub API 的 9 月 16 日快照显示，项目获得超过 2.4 万颗 Star。v0.8.0 发布于 9 月 3 日。这一版加入长期记忆、租户级 Skill 目录和会话级沙箱。

WeKnora 的产品信号明确：企业知识系统的输出形态包括答案、行动与文件。

![WeKnora 0.8.0 架构图，来源：腾讯 WeKnora 项目](/article-images/weknora-enterprise-knowledge-agent/architecture.webp)

## 三种工作模式

WeKnora 提供三条知识路径。

第一条是 RAG 快速问答。系统解析文档，切分内容，生成向量，建立图谱与索引。检索层组合 BM25、向量检索、GraphRAG 与 Rerank。回答携带来源引用。

第二条是 ReAct Agent。用户任务进入循环，Agent 调用知识检索、MCP 工具、网络搜索和 Skill。任务产物包括 Word、PDF 等文件。界面提供预览与下载。

第三条是 Wiki 模式。原始文档提供输入。Agent 提炼 Markdown 页面，建立页面链接和知识图谱。人工编辑、行级差异、版本历史与回滚属于内置能力。

这三条路径对应三类需求：事实查询、任务执行、知识整理。传统企业知识库采用单一聊天框容纳三类需求。WeKnora 给每类需求配置不同处理链。

## 文档获得编辑层

RAG 系统有一个隐蔽问题：文档切块成为黑箱。

解析器切错标题，表格行被拆散，页眉污染正文。检索质量下降。管理员看到错误答案。错误分块缺少可见性。

WeKnora 提供分块编辑、版本快照、差异比较和索引重建。知识维护人员拥有检索块修改权，系统保留旧版本。文件夹树保留上传目录结构。文档标签、元数据和批量重解析进入同一管理界面。

这个设计把 RAG 质量问题变成可检查的内容问题。知识库管理员获得一个编辑层。不可见流水线失去唯一地位。

数据接入覆盖飞书知识库、飞书云盘、GitLab、腾讯 IMA、Notion、语雀、钉钉文档与 RSS。文档类型包含 PDF、Word、Excel、PPT、图片、网页、XMind 等。外部数据源支持数据同步。

产品说明列出二十多家模型供应商，提供 LiteLLM 与 Ollama 接口。向量数据库和对象存储有多种选项。现有模型合同与存储设施拥有保留空间。

## Skill 让知识产生文件

v0.8.0 的核心变化是 Skill 沙箱。

空间管理员拥有 Skill 安装权。来源包括 ClawHub、SkillHub、Git 仓库或 ZIP 包。Agent 读取 Skill 说明，执行脚本，处理知识库内容，生成文件。Word、PPT、PDF 与数据分析任务拥有统一入口。

![WeKnora Skill 沙箱生成 Word 文件，来源：腾讯 WeKnora 项目](/article-images/weknora-enterprise-knowledge-agent/skill-sandbox-chat.webp)

执行环境支持 Docker、E2B 与 Cube。会话保留沙箱状态。网络策略归属租户配置。项目移除了 Local 宿主机进程后端。Docker 后端的启用条件包含管理员操作。

这个改动重要。知识问答读取数据。Skill 写文件、运行命令、访问网络。两类能力拥有不同风险等级。沙箱、网络边界与环境变量隔离构成企业准入条件。

WeKnora 提供个人环境变量与空间环境变量。Skill 快照绑定沙箱。文件浏览、编辑、进度显示和产物收集属于运行时能力。

Agent 平台的竞争多出一层：模型决定推理质量，Skill 决定工作范围，沙箱决定风险边界。

## 长期记忆需要用户批准

跨会话记忆是 v0.8.0 的另一项更新。

系统提取五类记忆：个人资料、偏好、事实、任务和兴趣。提取结果形成候选项。用户确认决定记忆准入。Agent 使用 `search_memory` 检索相关记忆。

微信官方介绍强调了这套确认机制。这个细节比“拥有记忆”重要。企业知识助手接触岗位、客户、项目和习惯信息。无提示写入具有隐私与错误累积风险。

候选记忆加人工确认提供一道门。保存期限、删除机制、权限继承和审计日志决定门的强度。项目文档给出了记忆类型与确认流程。内部数据政策归属企业部署工作。

## Wiki 是知识治理层

Wiki 模式的价值包含知识图谱与治理能力。

原始资料形态包括会议纪要、制度文件、产品手册和工单。检索系统返回片段，主题结构处于缺失状态。Wiki 模式生成页面、链接与图谱。人类编辑者负责修订、合并和回滚。

![WeKnora Wiki 知识图谱，来源：腾讯 WeKnora 项目](/article-images/weknora-enterprise-knowledge-agent/wiki-graph.webp)

这个流程适合制度库、产品知识库、售后知识库和研发文档库。图谱帮助读者查看实体关系。版本历史帮助管理员处理错误总结。页面编辑帮助业务专家修正模型结论。

模型生成内容带有幻觉风险。Wiki 页面缺少天然可信度。治理规则包含引用、版本、审批人和更新时间。WeKnora 提供部分技术组件，组织定义发布责任。

## 企业能力超出私有部署

私有部署是数据边界的一部分。

WeKnora 提供 Owner、Admin、Contributor、Viewer 四级角色。知识库有资源归属。工作空间有审计日志。API Key 支持能力范围与知识库范围。凭据使用 AES-256-GCM 静态加密。数据源 URL 与重定向链包含 SSRF 防护。

IM 集成覆盖企业微信、飞书、Slack、Telegram、钉钉、Mattermost、微信和云之家。网站 Widget 提供域名白名单、限流与安全 Token 交换。官方 MCP Server 提供 29 个工具。

这些能力说明 WeKnora 追求平台位置。单一聊天应用不是它的全部范围。

平台代价清楚。完整部署涉及数据库、向量存储、对象存储、模型、解析器、任务队列和可观测系统。README 的 Docker Compose 路径适合试用。生产部署工作涵盖容量规划、备份、密钥管理、模型费用与升级策略。

项目主体采用 MIT License，第三方组件遵循各自许可证。企业法务仍需检查第三方通知。

## 谁适合部署

WeKnora 适合三类团队。

第一类团队拥有大量私有文档，云端托管方案缺少数据边界。第二类团队寻求 RAG、Agent 与文件产物的一体化入口。第三类团队拥有内部平台工程能力，承担模型、存储和权限系统的维护工作。

个人资料库与小型 FAQ 项目和这套体量缺少匹配。简单向量检索服务的运维成本低于完整平台。WeKnora 的优势来自完整控制面，代价来自完整控制面。

这次发布的看点超出 RAG。WeKnora 把知识入口、任务执行与知识治理接到一条产品链上。

四个问题决定企业知识库的下一轮竞争：答案的证据，Agent 的文件交付能力，记忆的用户控制权，工具的隔离边界。

WeKnora 给出一套开源答案。企业数据、真实任务与长期运维构成实际效果的检验条件。

* * *

## 参考资料

1. [微信官方账号：WeKnora 介绍](https://x.com/weixin_wechat/status/2099445303934112180)
2. [腾讯 WeKnora GitHub 仓库](https://github.com/Tencent/WeKnora)
3. [WeKnora v0.8.0 发布页](https://github.com/Tencent/WeKnora/releases/tag/v0.8.0)
4. [WeKnora 官方网站](https://weknora.weixin.qq.com)
