# FusionX 管理后台 `(@fusionx/admin)`

以 Vue3 和 TypeScript 为核心技术，正确、简单、流畅的前端开发框架。

## 前提

- Node.js。经测试的版本包括 v16.16.0，v18.18.2 等。更高版本应当可以正确运行；
- pnpm。通过`npm install -g pnpm`安装。

> 建议前端开发者安装 [nvm-windows](https://github.com/coreybutler/nvm-windows)，以更方便地在多个安装的 node 版本间进行切换。

## 使用

```bash
git clone http://113.128.222.8:82/fusionx-team/fusion-admin.git

cd fusion-admin

# 安装依赖。任何一次拉取后若`package.json`文件存在变动都需要执行
pnpm install
# 在开发环境下运行
pnpm run dev
```

@fusionx/admin 前端服务默认运行在 1127 端口，@fusionx/uc 前端服务默认运行在 1128 端口。

指定运行的端口时：

```bash
# 运行在 8888 端口
pnpm run dev --port 8888
```

## 推荐开发环境

> 如果仅需要运行前端服务，你并不需要安装开发环境。

- 安装 [VSCode](https://code.visualstudio.com/)；
- 安装以下 VSCode 的插件：
  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  - [UnoCSS](https://marketplace.visualstudio.com/items?itemName=antfu.unocss)
  - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## 注意事项

- 发起 commit 前，系统将自动检查**已暂存、将要提交**的代码中存在的错误（通过 ESLint），并对这些文件进行统一格式化（通过 Prettier）。该流程将使提交过程变慢，属于正常现象；如果存在不可自动修复的问题，提交将被放弃，需要手动修复该错误后才能提交；
- 在 clone 后使用 FusionX 框架前，请记得更改 git 源的地址，避免提交到本仓库而非业务项目仓库；

## :warning: 重要：迁移至实验性分支`refactor-2507`

Gyrc 项目对低代码模块提出了实际上的根本性重构需求，因此建立实验性分支`refactor-2507`，并同时对项目中的部分代码进行重构和优化。

实验性分支修改的内容如下：

### 导入

你将不再需要手动导入一些模块，便可直接在代码中使用。你依然会获得完整的类型检查、参数提示和智能补全。

- 无需通过`import`语句引入`vue`、`vue-router`、`pinia`、`@vueuse/core`等包的模块。
- 无需通过`import`语句引入位于`/src/hooks`文件夹中的导出模块。
- 无需通过`import`语句引入位于`/src/components/_internal`文件夹中的 vue 组件。

### 请求封装

- 现在登录过期的情况下，响应将返回状态码为 401 的异常，而非之前的 200。
- 你可以通过`useRequest`函数来发起请求，该函数会自动处理登录过期的情况。主分支中令牌过期时重发请求但不刷新数据的 BUG 已经在实验性分支上得到修复。

### 页面（/views）代码

具体的修改内容应当参阅代码，例如`/src/views/information/list`和`/src/views/application/list`等页面。

- 移除了页面文件夹中`use-actions.ts`文件。原本存在于该文件中的方法应当视情况被移动到`use-table.ts`或`index.vue`中。例如，`onDelete`方法应当移动到`use-table.ts`中。
- 所有组件名应当由`A`开头替换为`T`，例如`ATable`替换为`TTable`、`AButton`替换为`TButton`。
- 组件的`props`属性存在变化，例如`AButton`的`type="primary"`替换为`TButton`的`theme="primary"`。具体的组件文档请参看[腾讯 TDesign 文档](https://tdesign.tencent.com/vue-next/overview)。
- 通过调用方式生成消息提示和对话框时，无需从任何地方引入，直接调用`const message = useMessage()`或`const dialog = useDialog()`即可。
- 表格组件`TTable`的自定义渲染插槽用法发生变化，在`columns`中指定的`colKey`可直接作为具名插槽。

### 低代码模块

低代码模块的 Schema 发生变化，虽然这种变化时细微的，但依然存在破坏性变更。因此你需要重新创建应用并进行设计，不要试图载入旧应用。