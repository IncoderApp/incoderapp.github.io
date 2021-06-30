---
title: Github Action 自动部署网站
date: 2021-06-29 09:00:00
categories: Build
tags: Github Action
description: 自动化部署
cover: https://res.cloudinary.com/incoder/image/upload/v1624941543/incoderapp/github-action.png
archive_img: https://res.cloudinary.com/incoder/image/upload/v1624941543/incoderapp/github-action.png
top_img: https://res.cloudinary.com/incoder/image/upload/v1624941543/incoderapp/github-action.png
---

简单来说 [Github Action](https://github.com/features/actions) 是 [GitHub](https://github.com) 提供的一项支持自动化构建项目，发布项目等一些列自动化的 CI 工具，在一定程度上让我们的开发工作，发布工作更加优雅和安全（只需要配置好相关的执行脚本），让我们更加专注于你所作事情的本身内容

## 背景

和之前构建个人博客一样，将源码和生成的静态网站文件都放在同一个 Github 仓库中，master(或 main) 分支存放编译后的产物，hexo 存放项目的源代码，不同的是这次是直接依赖于 [Github Action](https://github.com/features/actions) 来进行构建和发布，网站使用 [Yarn](https://www.yarnpkg.cn) 进行包管理

## 步骤


### 添加构建脚本

在项目源码分支的根目录，添加 {% label .github blue %}，{% label workflows blue %} 文件夹，并添加 {% label file-name.yml pink %} 文件（我这里命名为 action.yml），结构如下

```text
incoderapp.github.io/
    ├── .github/workflows/             # action 相关文件夹
    │   └── action.yml                 # 执行任务配置文件
    ├── scaffolds/
    ├── source/
    ├── themes/
    ├── _config.butterfly.yml
    ├── _config.yml
    ├── .gitignore
    ├── LICENSE
    ├── package.json
    ├── README.md
    └── yarn.lock
```

action.yml 文件的配置命令如下所示

```yml
name: CI
on:
  push:
    branches:
      - hexo
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout branch
        uses: actions/checkout@v2

      - name: Install dependencies
        if: steps.cache.outputs.cache-hit != 'true'
        run: yarn

      - name: Hexo clean
        uses: heowc/action-hexo@main
        with:
          args: clean

      - name: Hexo generate
        uses: heowc/action-hexo@main
        with:
          args: generate

      - name: Deploy to master
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.CI_TOKEN }}
          external_repository: IncoderApp/incoderapp.github.io
          publish_branch: master
          publish_dir: ./public
```

### 添加相关配置

我们需要在项目的 Settings 标签中添加一个 Secrets，用于部署访问仓库的 Token，关于生成项目的 Token

- <kbd>Github</kbd>-><kbd>头像（右上角）</kbd>-><kbd>Settings</kbd>-><kbd>Developer Settings</kbd>-><kbd>Personal access tokens</kbd>
- 勾选 <kbd>repo</kbd>
- 复制生成的 tocken（生成的token只有一次可见机会，请妥善保存），添加到项目的 Settings 标签中 Secrets 选项，并命名为 {% label CI_TOKEN pink %}

### 编译及测试

当我们有 push 动作到 hexo 分支，Github Action 会自动进行安装我们的构建任务执行，我们需要关注项目 Action 标签页，如果有错误，在 Action 标签页中查看相关的错误并解决，当然为了我们方便直观的查看项目的构建情况，我们可以按照官方给定的特殊写法，通过徽章的形式，方便的查看项目的构建结果，比如我这里就按照官方写法 <img src="https://github.com/IncoderApp/incoderapp.github.io/actions/workflows/action.yml/badge.svg?branch=hexo"></img>

## 参考

- [Github Action 官方文档](https://docs.github.com/cn/actions)
- [Github-Actions-自动化部署总结](https://lovobin.github.io/2021/03/11/55808)
- [添加工作流程状态徽章](https://docs.github.com/cn/actions/managing-workflow-runs/adding-a-workflow-status-badge)