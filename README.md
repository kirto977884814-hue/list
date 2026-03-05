# 直播观看对比系统

一个用于对比会员名单和观看直播名单的Web应用，自动导出未观看直播的会员信息。

## 功能特点

- 导入会员名单（Excel格式，包含"用户ID"和"用户昵称"列）
- 导入观看直播名单（Excel格式，包含"用户ID"列）
- 自动对比并展示未观看直播的会员
- 实时统计信息（总会员数、观看数、未观看数）
- 简洁易用的Web界面

## 技术栈

### 后端
- Node.js + Express
- SQLite数据库
- xlsx (Excel处理)
- multer (文件上传)

### 前端
- React + Vite
- Ant Design UI组件库
- Axios (HTTP客户端)

## 项目结构

```
live-view-checker/
├── backend/                # 后端服务
│   ├── server.js          # Express服务器
│   ├── database.js        # SQLite数据库配置
│   ├── routes/            # API路由
│   ├── services/          # 业务逻辑服务
│   └── uploads/           # 临时文件上传目录
└── frontend/              # 前端应用
    └── src/
        ├── components/    # React组件
        ├── pages/         # 页面组件
        └── services/      # API服务
```

## 快速开始

### 1. 安装依赖

**后端**
```bash
cd backend
npm install
```

**前端**
```bash
cd frontend
npm install
```

### 2. 启动服务

**启动后端（终端1）**
```bash
cd backend
npm start
```
后端将运行在 http://localhost:3001

**启动前端（终端2）**
```bash
cd frontend
npm run dev
```
前端将运行在 http://localhost:5173

### 3. 使用应用

1. 打开浏览器访问 http://localhost:5173
2. 首先导入会员名单Excel文件
3. 然后导入观看直播名单Excel文件
4. 查看自动生成的对比结果

## Excel文件格式要求

### 会员名单（members.xlsx）

必须包含以下两列：

- 用户ID
- 用户昵称

示例：

```
用户ID    用户昵称
1001      张三
1002      李四
1003      王五
```

### 观看直播名单（view_records.xlsx）

必须包含以下列：

- 用户ID

示例：

```
用户ID
1001
1003
```

## API接口

### 会员管理

- `POST /api/members/import` - 导入会员名单
- `GET /api/members/stats` - 获取会员统计
- `GET /api/members` - 获取所有会员

### 观看记录

- `POST /api/view-records/import` - 导入观看名单
- `GET /api/view-records/:id/result` - 获取未观看会员
- `GET /api/view-records` - 获取观看记录列表

## 部署

### 前端部署到GitHub Pages

1. 修改 `frontend/.env` 文件，设置后端API地址
2. 构建前端项目：

```bash
cd frontend
npm run build
```

3. 将 `dist` 目录部署到GitHub Pages

### 后端部署

推荐使用免费的云平台部署：

- Render (https://render.com)
- Railway (https://railway.app)
- Fly.io (https://fly.io)

## 注意事项

- 会员名单每次导入会覆盖之前的数据
- 观看记录会保存历史记录
- 数据库文件 `database.db` 位于 `backend` 目录

## 许可证

MIT
