# [incoder.app](https://incoder.app)

## 技术栈

- 基于 [Hexo](https://hexo.io) 框架，
- 使用 [AnZhiYu](https://github.com/anzhiyu-c/hexo-theme-anzhiyu) 主题，
- 借助于 [Github Pages](https://pages.github.com) 静态页面服务，
- 依赖于 [Github Action](https://github.com/features/actions) 服务进行自动化构建发布
- 托管在 [incoderapp.github.io](https://github.com/IncoderApp/incoderapp.github.io) 仓库

## 升级

项目使用 Yarn 进行包管理应用

```node
# 需要手动选择升级的依赖包，按空格键选择，a 键切换所有，i 键反选选择
yarn upgrade-interactive --latest
```
