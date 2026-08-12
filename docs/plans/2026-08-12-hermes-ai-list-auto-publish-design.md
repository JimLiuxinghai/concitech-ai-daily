# Hermes AI-List 自动发布设计

日期：2026-08-12

## 目标

将 `ai.concitech.org` 的每日发布交给 Hermes Agent 的 `ai-list` Profile。任务在日报双语文件完成后自动校验、构建、提交并推送，随后由 Cloudflare Pages 从 `main` 分支部署。

网站发布必须与微信公众号草稿上传解耦。微信失败不能阻止网站发布，网站失败也不能触发微信流程重跑。

## 架构

- Hermes Profile：`ai-list`
- Cron 名称：`ai-list-site-publish`
- 执行模式：`--no-agent`，只运行确定性脚本，不调用语言模型
- 脚本：`~/.hermes/scripts/ai-list/publish-ai-site.sh`
- 内容源：`/Users/yangyilin/docs/ai-list/YYYY-MM-DD-pt/`
- 网站仓库：`/Users/yangyilin/project/concitech-all/concitech-ai-daily`
- 时区口径：`America/Los_Angeles`
- 调度：北京时间每天 13:00、14:00、15:00，即 `0 13-15 * * *`

## 数据流

1. 脚本计算当前 PT 日期，不选择“最新目录”，也不回退到裸日期目录。
2. 要求目标目录中 `daily.md` 与 `daily.en.md` 同时存在且非空。
3. 获取进程锁，避免同一日期并发发布。
4. 检查网站仓库处于 `main`，没有已暂存或已修改的跟踪文件。
5. 执行 `git fetch` 和 `git pull --ff-only`，不使用 force push。
6. 调用网站仓库现有的 `npm run publish:daily -- --date=YYYY-MM-DD --source=/Users/yangyilin/docs/ai-list`。
7. 现有发布脚本负责导入双语正文、生成封面、验证内容、构建 Astro、提交指定内容文件并推送 `main`。
8. GitHub push 触发 Cloudflare Pages 部署。

## 幂等与重试

同一日期第一次成功后，后续运行由网站发布脚本返回 `already-current`，不会产生重复提交。13:00 时内容未准备好会正常退出，14:00 与 15:00 自动补偿。

任务不自行生成或修改日报，不读取微信公众号稿，也不调用模型。英文版由现有 `summarize-ai-list-daily` 技能生成并通过 `validate_daily_translation.py` 校验。

## 失败处理

- 双语文件缺失：报告 `waiting-for-bilingual-pair`，等待下一次调度。
- 仓库包含跟踪文件修改或暂存内容：停止，避免把无关修改混入自动提交。
- 无法 fast-forward：停止，不 rebase、不覆盖远端。
- 内容校验或 Astro 构建失败：保留原始错误并退出，不提交。
- Git push 失败：退出，由下一次调度重新检查远端和本地状态。

脚本输出必须包含 PT 日期、目标目录和最终状态，Hermes Cron 保存标准输出作为执行记录。

## 验证

1. 使用已经发布的双语日期手动运行脚本，验证返回 `already-current`。
2. 验证网站仓库 `HEAD` 与 `origin/main` 一致且工作树干净。
3. 使用 Hermes CLI 查看 Cron，确认任务启用、表达式正确、模式为 `no-agent`。
4. 检查 Cron 状态和最近执行记录，确保脚本可由 `ai-list` Profile 调用。
