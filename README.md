# @skcb/lib-bb

> SurfingKeys Config Builder (`skcb`) 第三方扩展库：二次元与垂直社区站点快捷工具集（F95zone, South Plus, 2DFan, VNDB, 禁忌书屋）。

[![Test Status](https://img.shields.io/badge/tests-passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

## 📖 简介

`@skcb/lib-bb` 是针对 SurfingKeys 配置构建器 (`skcb`) 的官方第三方功能模组库，提供垂直 ACG、Galgame/视觉小说及社区站点的搜索引擎与站内深度导航按键。

### ✨ 核心特性

- **统一搜索前缀**：所有站点搜索引擎统一以 `\` 作为别名前缀（如 `\fz`, `\sp`）。配合 `skcb` 默认搜索引导键 `a`，在浏览器中键入 `a\fz` 即可唤起对应搜索，键入 `ca\fz` 直接从系统剪贴板搜索。
- **南+全量镜像支持**：内置支持主站 `south-plus.net` 及 11 个常用镜像域名（`south-plus.org`、`white-plus.net`、`north-plus.net`、`level-plus.net`、`soul-plus.net`、`snow-plus.net`、`spring-plus.net`、`summer-plus.net`、`blue-plus.net`、`imoutolove.me`、`east-plus.net`），在任何镜像下均可自动激活板块导航按键。
- **安全防污染**：站内导航使用 site leader 引导（默认 `<Space>`），不占用页面原生打字与浏览按键；页面跳转基于当前 origin 相对路径，杜绝跨域跳转。
- **双语元数据**：所有 Feature 与 Contribution 均提供完整的中英双语描述，原生支持 `skcb` 与 `skcb-ui` 的多语言配置展示。

---

## 🎯 首批支持站点与快捷键对照表

### 1. 搜索引擎 (Search Engines)

在全局任何网页均可使用以下快捷键呼出 Omnibar 搜索：

| 站点 | 搜索别名 (Alias) | Omnibar 快捷键 | 剪贴板搜索快捷键 | 检索目标与 URL 规范 |
| :--- | :---: | :---: | :---: | :--- |
| **F95zone** | `\fz` | `a\fz` | `ca\fz` | `https://f95zone.to/search/?q=` |
| **南+ (South Plus)** | `\sp` | `a\sp` | `ca\sp` | `https://south-plus.net/search.php?step=2&keyword=` |
| **2DFan** | `\2df` | `a\2df` | `ca\2df` | `https://www.2dfan.com/subjects/search?keyword=` |
| **VNDB** | `\vn` | `a\vn` | `ca\vn` | `https://vndb.org/v?sq=` |
| **禁忌书屋 (Cool18)** | `\sw` | `a\sw` | `ca\sw` | `https://www.cool18.com/bbs4/index.php?app=forum&act=threadsearch&keywords=` |

> **提示**：快捷键开头的 `a` 和 `c` 由当前 profile 的 `leaders.search` 决定（`skcb` 预设默认为 `a`）。

---

### 2. 站内导航 (Site Navigation)

当浏览器处于对应站点页面时，可通过 `<Space>` 引导键（即 site leader）触发快捷跳转：

#### 🎮 F95zone (`f95zone.to`)
- 模组 ID：`bb/actions.f95zone`
- 激活域名：`f95zone.to`

| 快捷键 | 功能描述 | 目标页面 |
| :---: | :--- | :--- |
| `<Space>h` | 社区首页 (Home) | `https://f95zone.to/` |
| `<Space>t` | 热门游戏 (Trending Games) | `https://f95zone.to/trending/` |
| `<Space>u` | 最新更新 (Latest Updates) | `https://f95zone.to/sam/latest_alpha/` |

#### 🍵 南+ (South Plus)
- 模组 ID：`bb/actions.south-plus`
- 激活域名：`south-plus.net` 及全部 11 个别名镜像（`*.plus.net`, `imoutolove.me` 等）

| 快捷键 | 功能描述 | 目标板块 / FID |
| :---: | :--- | :--- |
| `<Space>h` | 论坛首页 (Home) | `/index.php` |
| `<Space>c` | 茶馆综合讨论区 | `/thread.php?fid-9.html` (fid 9) |
| `<Space>a` | AI交流 (beta) | `/thread.php?fid-208.html` (fid 208) |
| `<Space>b` | 汉化本发布区 | `/thread.php?fid-36.html` (fid 36) |
| `<Space>x` | 原创小说区 | `/thread.php?fid-195.html` (fid 195) |

---

## 🚀 安装与在 skcb 中使用

### 1. 引入扩展库

在你的 SurfingKeys 配置项目根目录的 `surfingkeys.workspace.json` 中添加 `@skcb/lib-bb`：

```json
{
  "schemaVersion": 2,
  "libraries": [
    "@skcb/lib-b0o",
    "@skcb/lib-ent",
    "@skcb/lib-tech",
    "@skcb/lib-bb"
  ],
  "profilesDir": "profiles",
  "outDir": "dist"
}
```

> **本地开发或克隆调试**：也可以填写本地相对路径，如 `"../skbc-lib-bb"`。

### 2. 在 Profile 中启用功能模组

在 `profiles/personal.json`（或你的目标配置文件）的 `selectAdd` 数组中声明需要的 Feature：

```json
{
  "schemaVersion": 1,
  "id": "personal",
  "extends": "common",
  "selectAdd": [
    "bb/search-engines.f95zone",
    "bb/actions.f95zone",
    "bb/search-engines.south-plus",
    "bb/actions.south-plus",
    "bb/search-engines.2dfan",
    "bb/search-engines.vndb",
    "bb/search-engines.cool18"
  ]
}
```

### 3. 构建配置

运行 `skcb` 编译：

```bash
pnpm exec skcb build
```

生成的 `surfingkeys.js` 将自动包含上述全部站点别名与按键映射。

---

## 🛠️ 本地开发与测试

```bash
# 1. 安装依赖
pnpm install

# 2. 编译 TypeScript 与生成运行时代码及 manifest
pnpm run build

# 3. 类型检查
pnpm run typecheck

# 4. 运行全套自动化测试 (含 Schema 校验与 @skcb/core 集成测试)
pnpm test
```

---

## 📄 License

MIT
