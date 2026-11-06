---
title: 谷歌发布Omni 1.2 Flash！15秒视频、降价30%，AI改片进入多轮对话
description: >-
  Google发布Gemini Omni 1.2
  Flash，视频生成与编辑上限扩展至15秒，720p报价下降约30%。更新包含参考一致性与对话编辑；1080p、4K属于升采样输出。API的token计费、任务时长限制与产品权限，决定使用成本和适用范围。
slug: gemini-omni-1-2-flash-video-editing
publishedAtCST: '2026-11-07T06:15:04+08:00'
language: zh
author: JimLiu
categories:
  - models
  - products
cover: /article-covers/gemini-omni-1-2-flash-video-editing.webp
draft: false
wechatMediaId: "qwac_8j4kaaga6WV5YUa-aRe4EDrGIEwbSTQyUD6OaBHM--OaqFrkGMWAQLzenrQ"
---

AI视频的竞争，指向成片之后的修改。

Google的11月5日公告发布了Gemini Omni 1.2 Flash。更新的主轴是15秒视频、多轮对话编辑与参考一致性。官方给出的720p视频近似报价为每秒0.07美元，相比1.1版本的降幅是约30%。

Gemini API与Google Cloud的状态是正式可用。消费者产品的开放范围，取决于产品与订阅资格。[Google发布公告](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/)

这次更新的产品目标，是连接生成、修改和交付。

一条产品广告的工作包含商品呈现、镜头运动、背景、配音与画幅。成片的一个错误，对应一项修改要求。多轮编辑提供了一个延续已有作品的入口，参考材料承担人物、商品与风格的约束。

![Google发布的Gemini Omni 1.2 Flash官方宣传图](/article-images/gemini-omni-1-2-flash-video-editing/official-overview.webp)

*图1：Google官方发布图，包含生成内容示例。该图属于宣传材料。来源：Google。*

## 15秒生成上限，适用任务有区别

Gemini API文档给出的常规生成与编辑范围是3—15秒，时长采用整数秒，默认值为10秒。

视频任务的限制存在区别。**首尾帧插值的范围是3—10秒。**这个模式接收起始图与结束图，生成连接两张图的过渡；15秒上限适用于其他符合条件的生成与编辑任务。

视频延长的单轮追加时长为3—10秒，总长度上限为30秒。模型的参考范围是输入视频的最后10秒。

“15秒生成”“首尾帧过渡”“延长至30秒”属于三类任务，项目选型需要对应的参数检查。[Gemini API视频文档](https://aistudio.google.com/docs/omni#limitations)

15秒的价值，体现在完整表达的空间。一段商品展示包含开场、细节与收尾；时长增加，提供了叙事余量。人物身份、包装文字与镜头衔接的一致性，决定这段余量的成片价值。

Google公告的演示涉及服装试穿、海报动画与连续镜头。官方的效果判断强调参考保持，复杂物理、高速运动与快速脚本变化属于改进方向。演示材料展示能力方向，项目效果需要实际样片检验。

## 一句修改要求，接续同一条视频

对话编辑的变化，是保留作品上下文。

Gemini API采用`previous_interaction_id`关联前一轮结果。编辑请求产生新的视频结果，目标是保留修改要求之外的元素。背景、灯光与主体替换，构成典型编辑对象。

一个商品广告的假设流程是：首版展示商品与人物；修改要求指定新的背景；画幅版本适配不同投放位置。这是假设流程，本文缺少模型实测数据。

我的判断是，多轮编辑的产品价值取决于“修改范围的稳定性”。背景替换造成脸部变化、包装改字或动作漂移，意味着成片需要额外返工。

开发者的验收对象，需要包含目标变化与保留内容。修改目标是背景，人物、商品、运动和声音的稳定性构成另一组检查项。

接口支持存在边界。模型卡描述了音频输入与带声音视频输出，Gemini API当前限制页列出的缺失支持，包括音频文件、音频参考与声音编辑。**产品演示中的音频能力，与某个接口的输入权限，需要对应区分。**[API限制](https://aistudio.google.com/docs/omni#limitations) · [模型卡](https://deepmind.google/models/model-cards/gemini-omni-1-2-flash/)

## 4K的细节：输出分辨率与原生生成

API的分辨率选项包括360p、720p、1080p与4K，默认值为720p。

文档对1080p与4K的标注是upscaled，即升采样输出。这里的4K描述升采样后的输出规格，原生4K生成属于另一种能力。[分辨率说明](https://aistudio.google.com/docs/omni#output-resolution)

Google介绍的工作方式是360p或720p草案、对话修改，以及精选结果的升采样。

这个流程的经济性来自筛选顺序：创意方案的淘汰，发生于低分辨率草案阶段；高分辨率处理面向入选作品。实际节省金额取决于重试、编辑轮次与输入材料，缺少统一降本比例。

![草案、对话编辑、升采样与人工验收的工作流程](/article-images/gemini-omni-1-2-flash-video-editing/editing-workflow.webp)

*图2：依据官方文档整理的制作流程与任务边界；本文原创示意。*

## 每秒0.07美元，账单怎么算？

Gemini API采用token计费。标准视频输出价格为每百万token 12美元；720p视频的换算基数是每秒5792个token。

官方的每秒0.07美元属于近似价。15秒720p输出的费用近似值为1.04美元，公式为`5792 × 15 × 12 ÷ 1000000`。

同一张定价表提供了不同分辨率的基数。下面是15秒视频输出的算术示例：

| 输出规格 | 每秒视频token | 15秒输出费用 |
| --- | ---: | ---: |
| 360p | 1931 | 约0.35美元 |
| 720p | 5792 | 约1.04美元 |
| 1080p，升采样 | 8688 | 约1.56美元 |
| 4K，升采样 | 17376 | 约3.13美元 |

这些数字是视频输出的费用估算。输入、其他输出、额外编辑与重试具有对应消耗，整条成片的账单需要请求记录。定价页列出的输入价格为每百万token 1.50美元，Gemini API的该模型属于付费层。[官方定价](https://aistudio.google.com/docs/pricing#gemini-omni-1.2-flash)

官方的约30%降价，描述模型报价变化。一项广告项目的总成本，包含出错概率、修改工作量与人工验收。单次调用价格与合格成片成本，是两个指标。

## 哪些入口，哪些权限？

不同产品的开放安排需要区分。

- **Gemini API**：付费层提供模型调用，模型ID为`gemini-omni-1.2-flash`。
- **Google Cloud**：模型页列出正式可用状态与Provisioned Throughput支持，后者用于预留吞吐能力。Cloud配置与Gemini API权限属于不同产品口径。
- **Google Vids**：Workspace更新列出个人Google账号及多个Workspace版本，3—15秒时长进入视频制作界面，使用量限制取决于账号与许可。
- **Gemini应用**：帮助页要求个人账号具有Google AI计划；15秒视频对应AI Ultra，其他适用用户的时长上限为10秒。

[Cloud模型页](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/omni-1-2-flash) · [Vids更新](https://workspaceupdates.googleblog.com/2026/11/gemini-omni-12-flash-now-in-vids-with-15second-generations-and-improved-quality.html) · [Gemini帮助](https://support.google.com/gemini/answer/16126339?hl=en)

模型卡说明，视频包含SynthID标记，人物语音修改能力受到限制。来源标记提供内容识别线索，作品事实、授权与交付质量属于独立检查事项。

## 我的关注点：修改后的保留能力

这次更新给出了一个明确方向：视频模型的任务延伸到版本迭代。

价格下降扩大试作空间，时长增长增加表达空间，多轮编辑提供修改入口。商业制作的考题，是修改后的保留能力。商品身份、人物外观、声音与角色的匹配，以及画面文字的准确性，构成验收对象。

Omni 1.2 Flash提供了生成与改片工具。合格成片的数量、返工时间和每条成片的总成本，是生产价值的成绩单。

## 参考资料

- [Google：Gemini Omni 1.2 Flash发布公告](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/)
- Gemini API：[视频生成与编辑](https://aistudio.google.com/docs/omni) · [定价](https://aistudio.google.com/docs/pricing#gemini-omni-1.2-flash)
- [Google DeepMind：模型卡](https://deepmind.google/models/model-cards/gemini-omni-1-2-flash/) · [Cloud模型规格](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/omni-1-2-flash)
- [Google Workspace：Vids更新](https://workspaceupdates.googleblog.com/2026/11/gemini-omni-12-flash-now-in-vids-with-15second-generations-and-improved-quality.html)
- [Gemini应用：视频生成帮助](https://support.google.com/gemini/answer/16126339?hl=en)
