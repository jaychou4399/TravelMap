# TravelMap · 我的旅行足迹

> 在地图上点亮你去过的城市，记录故事与照片，生成专属的旅行数据统计与年度回顾。

[![Tech Stack](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## 功能特性

### 🗺️ 双地图系统
- **中国地图**（ECharts）：省份着色、城市标记、状态筛选
- **世界地图**（Leaflet）：标记 / 热力 / 路线动画三种模式切换
- 完成率进度环（中国省份 + 世界国家）

### 🏙️ 城市档案
- 城市详情页：封面、评分、感受、旅行故事（Markdown）
- 旅行照片网格 + 大图查看（Lightbox）
- 上传本地照片并管理标签

### 📊 数据统计
- 核心指标：城市 / 省份 / 国家 / 天数 / 里程 / 照片 / 视频
- 城市列表按状态分组（特别喜欢 / 已去 / 想去）
- 旅程时间线

### 🎉 年度回顾
- 仪表盘式年度报告
- 月份出行热力图
- 最爱城市 + 精选照片
- 一键导出 PNG / PDF / 分享链接

### 🎯 其他
- 心愿清单（Bucket List）
- 成就系统
- 搜索城市
- 个人资料
- 深色 / 浅色主题
- PWA 支持（可安装到桌面）
- 本地数据持久化（Zustand + localStorage）

---

## 技术栈

| 分类 | 技术 |
|---|---|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS 3 |
| 路由 | React Router 7 |
| 状态管理 | Zustand 5 |
| 动画 | Framer Motion 12 |
| 地图 | ECharts 6（中国地图） + Leaflet 1.9（世界地图） |
| 导出 | html-to-image + jsPDF |
| Markdown | react-markdown + remark-gfm + rehype-raw |
| Lint | Oxlint |
| 部署 | Vercel（开箱即用） |

---

## 快速开始

### 环境要求
- Node.js >= 18
- npm 或 pnpm / yarn

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# → http://localhost:5173

# 构建生产版本
npm run build

# 本地预览构建结果
npm run preview
# → http://localhost:4173

# 代码检查
npm run lint
```

---

## 项目结构

```
src/
├── assets/              # 静态资源
├── components/          # 公共组件
│   ├── maps/           # 地图组件（ChinaMap / WorldMap）
│   ├── AnimatedNumber  # 数字滚动动画
│   ├── Icons           # SVG 图标库
│   ├── Layout          # 页面布局
│   ├── Lightbox        # 大图查看
│   ├── Navbar          # 导航栏
│   ├── PhotoUploadModal # 照片上传
│   └── StarRating      # 星级评分
├── data/               # 数据
│   ├── cities.ts       # 城市数据库
│   └── sampleData.ts   # 示例旅行数据
├── pages/              # 页面
│   ├── Home            # 首页
│   ├── MapPage         # 地图（中国+世界）
│   ├── CityDetail      # 城市详情
│   ├── Diary           # 旅行日记
│   ├── Timeline        # 时间轴
│   ├── Stats           # 数据统计
│   ├── Review          # 年度回顾
│   ├── Bucket          # 心愿清单
│   ├── Search          # 搜索
│   ├── Profile         # 个人资料
│   ├── Achievements    # 成就
│   ├── VideoPage       # 视频
│   └── NotFound        # 404
├── store/              # 状态管理（Zustand）
├── types/              # TypeScript 类型
├── utils/              # 工具函数
│   ├── distance.ts     # 距离计算
│   ├── image.ts        # 图片处理
│   └── share.ts        # 导出/分享
├── App.tsx             # 路由入口
├── main.tsx            # 应用入口
└── index.css           # 全局样式 + Tailwind
```

---

## 数据说明

### 数据存储
所有数据保存在浏览器 `localStorage`（Zustand persist），刷新页面不丢失。清空浏览器数据或切换浏览器会重置为示例数据。

### 示例数据
项目内置三座城市的示例旅行数据：
- **南昌**（江西）- 2026 年，75 张照片
- **长沙**（湖南）- 2025 年，10 张照片
- **萍乡**（武功山）- 2025 年，3 张照片

### 自定义城市数据
编辑 `src/data/cities.ts` 添加更多城市，在 `src/data/sampleData.ts` 中添加旅行记录。

---

## 部署

### Vercel（推荐）
项目已配置 `vercel.json`，支持 SPA 路由回退和静态资源缓存。点击下方按钮一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jaychou4399/TravelMap)

或手动部署：
```bash
npm run build
# 将 dist/ 目录上传到 Vercel / Netlify / Cloudflare Pages 等
```

### Nginx
```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /path/to/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

---

## 开发指南

### 添加新城市
1. 在 `src/data/cities.ts` 的 `cities` 数组中添加城市对象
2. 在 `src/data/sampleData.ts` 中添加对应的 `Trip` 和 `Photo`

### 自定义主题色
修改 `tailwind.config.js` 中的 `brand` 色值。

### 地图瓦片
世界地图默认使用 CartoDB 瓦片，如需替换可在 `src/components/maps/WorldMap.tsx` 中修改 URL。

---

## 许可证

MIT License
