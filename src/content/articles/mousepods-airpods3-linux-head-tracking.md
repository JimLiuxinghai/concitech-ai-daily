---
title: Claude Code助攻AirPods 3变鼠标！Linux项目开源，突破口是蓝牙MTU
description: >-
  MousePods作者借助Claude Code梳理AirPods
  3头部追踪协议，项目公开RemoteHID文档、源码与抓包。蓝牙接收MTU从672字节改为2582字节，运动传感器公告出现。约210Hz属于项目方测量，硬件兼容性与游戏体验具有验证边界。
slug: mousepods-airpods3-linux-head-tracking
publishedAtCST: '2026-11-07T06:29:16+08:00'
language: zh
author: JimLiu
categories:
  - devtools
  - products
cover: /article-covers/mousepods-airpods3-linux-head-tracking.webp
draft: false
wechatMediaId: "qwac_8j4kaaga6WV5YUa-co1a1ZeSp7azGc0k8FRCSur66_8qELU8edV9S8uSnRH"
---

一副AirPods 3，成了Linux电脑的鼠标输入设备。

开源项目MousePods读取耳机运动数据，计算头部姿态与转动，控制层映射这些动作为光标移动。项目提供了源码、协议文档、抓包文件与本地控制界面。

作者Matteo Gaudioso（starman-tech）介绍，Claude Code承担代码编写、资料检索与协议探索，他负责耳机操作、硬件测试和方案判断。作者给出的研发耗时是一下午；README回顾了约300次失败尝试。[原始帖子](https://www.reddit.com/r/ClaudeAI/comments/1xodizg/used_claude_code_to_figure_out_how_airpods_3_send/)

这件事的技术价值，包含两项发现：**AirPods 3采用另一条运动数据协议；Linux连接的接收MTU影响传感器公告。**

项目地址：[github.com/starman-tech/mousepods](https://github.com/starman-tech/mousepods)

## 耳机已有传感器，缺口是数据通道

AirPods 3的空间音频功能包含动态头部追踪。苹果的产品规格介绍了这项功能，以及运动检测加速度传感器。[Apple产品规格](https://support.apple.com/en-nz/111863)

MousePods的目标，是连接这些运动数据与Linux输入系统。

项目文档记录，AirPods Pro 2等设备采用SensorDataWX。相同启动方式缺少AirPods 3的有效回复，传感器硬件的存在与协议兼容性形成了落差。

作者的线索来自iOS的`RemoteHID.framework`伪代码，以及相关开源分析。AirPods 3的通道是RemoteHID，运动传感器表现为虚拟HID设备，通信承载于AACP协议的RTBuddy `0x800`通道。

HID是键盘、鼠标等输入设备采用的一类描述方式。这里的HID设备是耳机中的传感器服务，主机读取设备描述、请求数据报告。[项目协议文档](https://github.com/starman-tech/mousepods/blob/115e4de10d656c663eb7b8b30d533916131f2692/docs/REMOTEHID-PROTOCOL.md)

协议识别解决了“怎样对话”，另一个问题是“主机看到了哪些设备”。

## 672与2582：一个接收参数，改变设备可见性

MTU指最大传输单元。这个案例的关键参数，是L2CAP连接的接收MTU，即主机接收数据单元的尺寸上限。

项目报告，测试环境的默认接收MTU为672字节。这个设置对应的设备公告包含3项服务，运动传感器缺席。2582字节设置对应的公告增加了`devmotion6`、`gyro`、`accel`等服务。

原因涉及公告长度：运动融合服务`devmotion6`的一条公告占833字节，超过672字节。2582字节的接收空间容纳了这条公告。[发现记录](https://github.com/starman-tech/mousepods/blob/115e4de10d656c663eb7b8b30d533916131f2692/docs/DISCOVERIES.md#6-the-mtu-hides-the-sensors)

本文的静态解码对象是仓库中的两份十六进制抓包文件，结果如下：

| 接收MTU | 文件中的设备公告 | 运动融合服务devmotion6 |
| --- | --- | --- |
| 672字节 | 3条 | 缺席 |
| 2582字节 | 8条 | 出现，公告833字节 |

这项核对确认了文件内容与文档描述的对应关系。耳机的真实行为与其他环境的兼容性，需要硬件复测。

**软件报告“设备缺席”，原因包含通信条件。硬件功能与主机可见性，是两个问题。**

![蓝牙接收MTU与RemoteHID运动数据链路](/article-images/mousepods-airpods3-linux-head-tracking/remotehid-pipeline.webp)

*图1：MousePods文档与公开抓包的中文重绘图。原始发现：Matteo Gaudioso（starman-tech），CC BY 4.0；本文增加中文解释与流程归纳。*

## 读到数据之后，怎样变成鼠标？

MousePods的通信顺序是主机发送`HostConnect`，耳机返回`DeviceConnect`公告，主机发送`SetReport`配置报告间隔，耳机输出`InputReport`。

程序解码运动数据块，提取旋转速度、重力与姿态信息。运动计算层处理坐标轴、校准和陀螺仪偏置，控制层生成鼠标事件，`/dev/uinput`负责虚拟输入设备。

这条链路支持Wayland与X11。项目的运行前提包括Linux、BlueZ、完成配对与连接的AirPods，以及用户的`/dev/uinput`写权限。

项目提供3种控制模式。鼠标模式的输入是转动，输出是光标运动；指向模式采用角点校准；耳机的桌面位移，构成滑动模式的输入。模式的验证程度存在差别。

![MousePods仓库提供的运动界面截图](/article-images/mousepods-airpods3-linux-head-tracking/project-app.webp)

*图2：项目提供的界面截图，展示姿态、光标与角速度。来源：MousePods by Matteo Gaudioso（starman-tech），CC BY 4.0；本文调整显示尺寸。界面标签属于软件状态，项目说明定义硬件支持范围。*

## 约210Hz，是传感器数据率

项目文档报告了约210Hz的最高测得数据率。这个数字描述传感器数据，鼠标端到端延迟、光标渲染频率与游戏体验属于其他指标。

高数据率存在代价。作者记录的一组共享蓝牙链路测试，数据率为约180Hz，23秒包含12次超过50毫秒的间隔。程序采用100Hz的默认请求设置，意图降低链路中断。

数据率与稳定性构成取舍，峰值数据率与持续使用体验，属于不同的评价对象。

README的验证表包含这些限制：

- AirPods 3与AirPods Pro 2的运动流具有项目方硬件验证，其他型号需要对应测试。
- 鼠标模式具有硬件试用记录，指向模式的角点校准验证来自模拟。
- 桌面滑动模式属于实验功能，滚动、漂移与传感器休眠影响结果。
- 模拟器方向提供opentrack与虚拟摇杆输出；数据格式和角度计算具有测试，游戏内体验缺少项目方实测。
- AirPods 3的充电盒内传感器处于关闭状态，“充电盒变鼠标”缺少硬件支持。

模拟器输出提供旋转方向，属于3个旋转自由度；身体前后左右的平移需要另一类测量。[支持状态](https://github.com/starman-tech/mousepods/tree/115e4de10d656c663eb7b8b30d533916131f2692#status-what-is-real-what-is-not)

## Claude Code的作用，是缩短线索与实验的距离

原帖的故事包含一个分工：AI检索开源项目、分析框架代码、生成协议实现，人操作真实耳机、观察结果、选择后续实验。

公开材料让这个故事具有检查入口。仓库保存了成功配置、失败尝试与原始抓包，源码中的接收MTU、协议封装和报告启动逻辑，对应文档中的解释。

这份记录保留了一项待解问题：Apple PnP DeviceID与重新配对发生于首次成功之前，这些条件的独立作用需要隔离实验。MTU的作用具有对照抓包，完整的最小成功条件需要后续确认。

我的判断是，这类项目的AI价值体现在搜索范围与试验组织。成功的标志是模型给出的解释获得数据支持，公开代码与记录提供复核条件。

本文核对了源码、文档与两份公告抓包，缺少AirPods硬件实测。项目的鼠标精度、持续使用体验与更多型号兼容性，属于待验证结果。

MousePods的代码采用Apache-2.0，文档与抓包采用CC BY 4.0。本文介绍的是社区项目，Apple官方产品支持属于另一种性质。[MousePods仓库与许可](https://github.com/starman-tech/mousepods)

## 参考资料

- [原始Reddit帖子与作者回复](https://www.reddit.com/r/ClaudeAI/comments/1xodizg/used_claude_code_to_figure_out_how_airpods_3_send/)
- [MousePods by Matteo Gaudioso（starman-tech）](https://github.com/starman-tech/mousepods) · [本文核对的版本115e4de](https://github.com/starman-tech/mousepods/tree/115e4de10d656c663eb7b8b30d533916131f2692)
- [协议与发现](https://github.com/starman-tech/mousepods/blob/115e4de10d656c663eb7b8b30d533916131f2692/docs/DISCOVERIES.md) · [RemoteHID格式](https://github.com/starman-tech/mousepods/blob/115e4de10d656c663eb7b8b30d533916131f2692/docs/REMOTEHID-PROTOCOL.md)
- [MTU 672抓包](https://github.com/starman-tech/mousepods/blob/115e4de10d656c663eb7b8b30d533916131f2692/captures/airpods3_announces_mtu672.hex) · [MTU 2582抓包](https://github.com/starman-tech/mousepods/blob/115e4de10d656c663eb7b8b30d533916131f2692/captures/airpods3_announces_mtu2582.hex) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- [Apple：AirPods 3产品规格](https://support.apple.com/en-nz/111863)
