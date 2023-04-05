---
title: Lawrefbook
date: 2022-06-01 11:11:11
categories: Android
tags: 中国法律
description: 一个可以离线查看的法律快查应用
cover: https://res.cloudinary.com/incoder/image/upload/v1654225417/incoderapp/lawrefbook/lawrefbook-banner.png
copyright_url: https://incoder.app/2022/06/01/lawrefbook/
archive_img: https://res.cloudinary.com/incoder/image/upload/v1654225417/incoderapp/lawrefbook/lawrefbook-banner.png
top_img: https://res.cloudinary.com/incoder/image/upload/v1654225417/incoderapp/lawrefbook/lawrefbook-banner.png
---

简单来概括《中国法律》应用是一款可以离线查看的法律快查应用

| 兼容 | JDK | 编译 |
|:-----------:|:-----------:|:-----------:|
|[![](https://img.shields.io/badge/Compatibleby-SDK%2024%20~%2031-06?logo=Android&labelColor=02303A)](https://developer.android.google.cn/reference)|[![](https://img.shields.io/badge/Use%20up%20by-JDK%201.8+-important?logo=openjdk&labelColor=02303A)](https://www.oracle.com/cn/java/technologies/javase/javase-jdk8-downloads.html)|[![](https://img.shields.io/badge/Build%20up%20by-Gradle%207.3.3%20bin-06A0CE?logo=Gradle&labelColor=02303A)](https://docs.gradle.org/7.3.3/release-notes.html)|

{% note info %}
开发环境说明，[Android Studio 4.2 及以上版本，JDK 必须是 JDK11](https://developer.android.google.cn/studio/releases/past-releases?hl=zh-cn#4-2-0) ，因此该项目的 JDK 版本取决于你的运行环境，低版本 Android Studio，要求 JDK8+ 及以上即可
{% endnote %}

## 背景

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=530 height=320 src="//music.163.com/outchain/player?type=4&id=966568618&auto=0&height=320"></iframe>

五月迷上了网易云一个名为《[法外狂徒张三](http://music.163.com/radio/?id=966568618&userid=34509906)》的电台，众所周知 “法外狂徒张三” 是罗老师口中常常为了讲解法律而虚拟的人物，最早看过几个罗老师的视频，印象很深，把枯燥无味的法律教条，以故事结合时事让我这个没有任何法律学习基础的非专业人士，也能听得入神，不得不被罗老师的幽默风趣的文学和对法律的严谨折服。引导了我偶尔也会去看看法律的文字了，翻着翻着，这不巧了嘛，在 Github 上看到了一个整理了相关法律的数据项目，已经有了 iOS 版本的[中国法律快查手册](https://apps.apple.com/app/id1612953870)，也有了 [Web 网站](https://lawrefbook.github.io)，就差一个 Android 应用了。那就让我这个曾经的 Android 开发选手来为之添砖加瓦，于是有了现在的这个项目

项目遵循极简的项目依赖，简约的页面设计，实用的功能，就这样，一鼓作气在业余时间完成了项目开发。当然这里面还有很多的优化完善空间，但依然按捺不住想写一篇文章记录这个项目

## 页面预览

| 主页 | 内容页 | 个人页 |
|:-----------:|:-----------:|:-----------:|
|![](https://res.cloudinary.com/incoder/image/upload/v1654225895/incoderapp/lawrefbook/feed.jpg)|![](https://res.cloudinary.com/incoder/image/upload/v1654225910/incoderapp/lawrefbook/article.jpg)|![](https://res.cloudinary.com/incoder/image/upload/v1654225840/incoderapp/lawrefbook/about.jpg)|
| 历史 | 目录 | 收藏 |
|![](https://res.cloudinary.com/incoder/image/upload/v1654225919/incoderapp/lawrefbook/history.jpg)|![](https://res.cloudinary.com/incoder/image/upload/v1654225900/incoderapp/lawrefbook/catalog.jpg)|![](https://res.cloudinary.com/incoder/image/upload/v1654225863/incoderapp/lawrefbook/favorite.jpg)|
| 搜索文章 | 搜索内容 | 等等 |
|![](https://res.cloudinary.com/incoder/image/upload/v1654225818/incoderapp/lawrefbook/title-search.jpg)|![](https://res.cloudinary.com/incoder/image/upload/v1654225819/incoderapp/lawrefbook/article-search.jpg)|……|

## 应用下载

1. [Google Play](https://play.google.com/store/apps/details?id=app.incoder.lawrefbook)
2. F-Droid
3. [Github Release](https://github.com/IncoderApp/LawRefBook/releases)

## 开发寄语

1. 离线使用；
2. 遵循 Material Design 风格；
3. 上架 F-Droid，Google Play 应用市场；
4. 完全开源，如有需要请遵循开源协议自行提取

> 应用还有很多需要优化的点，我会继续努力 💪

## 更新日志

### 1.0.0（20220601）

1. 使用 [Laws](https://github.com/LawRefBook/Laws) 项目作为数据源，聚合 [国家法律法规数据库](https://flk.npc.gov.cn)，[最高人民法院](https://www.court.gov.cn) 网站数据
2. 离线使用
3. 全文，片段法条收藏
4. 文本分享
5. 层级目录
6. 高亮检索

### 1.1.0（20230406）

1. [x] 数据 [9f3c74b6](https://github.com/LawRefBook/Laws/tree/9f3c74b6714e8c3e6514d3b5e56c45d6b2c4065d) 按照法条解析
2. [x] 目录可定位
3. [x] 内容标题剧中显示
4. [x] 分享内容生成图片（限制数量：3条法条）
5. [ ] 应用上架 F-Droid

### 1.2.0

1. [ ] 平板支持
2. [ ] 自定义可展示分类
3. [ ] 目录与内容互相联动
4. [ ] 手动导入数据源选项

> [重构数据源数据结构](https://github.com/IncoderApp/Laws)，解析源数据生成离线 SQLite3 可手动导入数据

### 1.2.1

1. [ ] 黑夜模式
2. [ ] 可自定义主题
3. [ ] 文字大小调整
4. [ ] 行间距调整
5. [ ] 法条间距调整
6. [ ] 超长文章标题滚动显示

## 隐私协议

项目未集成第三方内库，所以没有任何的隐私问题，且项目完全开源

## 致谢

本项目特别感谢 [@RanKKI](https://github.com/LawRefBook/Laws) 提供开源数据，并使用了 [LawRefBook](https://github.com/RanKKI/LawRefBook) 项目 icon，以及部分功能参考
