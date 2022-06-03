---
title: Lawrefbook
date: 2022-06-01 11:11:11
categories: Android
tags: 中国法律
description: 一个可以离线查看的法律快查应用
cover: https://res.cloudinary.com/incoder/image/upload/v1654225417/incoderapp/lawrefbook/lawrefbook-banner.png
archive_img: https://res.cloudinary.com/incoder/image/upload/v1654225417/incoderapp/lawrefbook/lawrefbook-banner.png
top_img: https://res.cloudinary.com/incoder/image/upload/v1654225417/incoderapp/lawrefbook/lawrefbook-banner.png
---

简单来概括《中国法律》应用是一款可以离线查看的法律快查应用

| 兼容 | JDK | 编译 |
|:-----------:|:-----------:|:-----------:|
|[![](https://img.shields.io/badge/Compatibleby-SDK%2024%20~%2031-06?logo=Android&labelColor=02303A)](https://developer.android.google.cn/reference)|[![](https://img.shields.io/badge/Use%20up%20by-JDK%201.8+-important?logo=java&labelColor=02303A)](https://www.oracle.com/cn/java/technologies/javase/javase-jdk8-downloads.html)|[![](https://img.shields.io/badge/Build%20up%20by-Gradle%207.3.3%20bin-06A0CE?logo=Gradle&labelColor=02303A)](https://docs.gradle.org/7.3.3/release-notes.html)|

## 背景

五月迷上了网易云一个名为《[法外狂徒张三](http://music.163.com/radio/?id=966568618&userid=34509906)》的电台，众所周知 “法外狂徒张三” 是罗老师口中常常为了讲解法律而虚拟的人物，最早看过几个罗老师的视频，印象很深，把枯燥无味的法律教条，以故事结合时事让我这个没有任何法律学习基础的非专业人士，也能听得入神，不得不被罗老师的幽默风趣的文学和对法律的严谨折服。引导了我偶尔也会去看看法律的文字了，翻着翻着，这不巧了嘛，在 Github 上看到了一个整理了相关法律的数据项目，已经有了 iOS 版本的应用，也有了 Web 网站，就差一个 Android 应用了。那就让我这个曾经的 Android 开发选手来为之添砖加瓦，于是有了现在的这个项目

项目遵循极简的项目依赖，简约的页面设计，实用的功能，就这样，一鼓作气在业余时间完成了项目开发。当然这里面还有很多的优化完善空间，但依然按捺不住想写一篇文章记录这个项目

## 功能

1. 聚合 [国家法律法规数据库](https://flk.npc.gov.cn)，[最高人民法院](https://www.court.gov.cn) 网站数据
2. 离线使用
3. 全文，片段法条收藏
4. 文本分享
5. 层级目录
6. 高亮检索

## 页面预览

| 主页 | 内容页 | 个人页 |
|:-----------:|:-----------:|:-----------:|
|![](https://res.cloudinary.com/incoder/image/upload/v1654225895/incoderapp/lawrefbook/feed.jpg)|![](https://res.cloudinary.com/incoder/image/upload/v1654225910/incoderapp/lawrefbook/article.jpg)|![](https://res.cloudinary.com/incoder/image/upload/v1654225840/incoderapp/lawrefbook/about.jpg)|
| 历史 | 目录 | 收藏 |
|![](https://res.cloudinary.com/incoder/image/upload/v1654225919/incoderapp/lawrefbook/history.jpg)|![](https://res.cloudinary.com/incoder/image/upload/v1654225900/incoderapp/lawrefbook/catalog.jpg)|![](https://res.cloudinary.com/incoder/image/upload/v1654225863/incoderapp/lawrefbook/favorite.jpg)|
| 搜索文章 | 搜索内容 | 等等 |
|![](https://res.cloudinary.com/incoder/image/upload/v1654225818/incoderapp/lawrefbook/title-search.jpg)|![](https://res.cloudinary.com/incoder/image/upload/v1654225819/incoderapp/lawrefbook/article-search.jpg)|……|

## 下载

1. [Coolapk](https://www.coolapk.com/apk/app.incoder.lawrefbook)
2. [Google Play](https://play.google.com/store/apps/details?id=app.incoder.lawrefbook)

## 开发寄语

1. 当前版本为离线应用；
2. 应用遵循 Material Design 风格；
3. 应用上架酷安，Google Play 应用市场；
4. 应用完全开源，如有需要请遵循开源协议自行提取

> 应用还有很多需要优化的点，我会继续努力 💪

## 隐私协议

项目未集成第三方内库，所以没有任何的隐私问题，且项目完全开源

## 致谢

本项目特别感谢 [@RanKKI](https://github.com/LawRefBook/Laws) 提供开源数据，并使用了 [LawRefBook](https://github.com/RanKKI/LawRefBook) 项目 icon，以及部分功能参考