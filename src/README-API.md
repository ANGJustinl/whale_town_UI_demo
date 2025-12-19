# API 集成说明

## 当前状态

此应用当前使用 **模拟数据（Mock Data）** 来演示功能。所有的 API 调用都在 `/api/auth.ts` 文件中实现。

## 测试账号

**密码登录：**
- 用户名：`demo`
- 密码：`demo123`

**验证码登录：**
- 用户名：任意
- 验证码：`123456`

## 如何连接真实后端

### 1. 配置 API 地址

复制 `.env.example` 为 `.env` 并配置你的后端 API 地址：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### 2. 修改 API 调用

在 `/api/auth.ts` 文件中，每个函数都包含了真实 API 调用的代码（已注释）。取消注释这些代码，并注释掉 Mock 实现。

### 3. 后端 API 接口规范

#### 3.1 密码登录

**端点：** `POST /api/auth/login`

**请求体：**
```json
{
  "username": "string",
  "password": "string",
  "remember": boolean,
  "autoLogin": boolean
}
```

**成功响应：** (200)
```json
{
  "token": "string",
  "user": {
    "username": "string",
    "email": "string"
  }
}
```

**失败响应：** (401)
```json
{
  "message": "错误信息"
}
```

#### 3.2 发送验证码

**端点：** `POST /api/auth/send-code`

**请求体：**
```json
{
  "username": "string"
}
```

**成功响应：** (200)
```json
{
  "message": "验证码已发送"
}
```

#### 3.3 验证码登录

**端点：** `POST /api/auth/login-code`

**请求体：**
```json
{
  "username": "string",
  "code": "string"
}
```

**成功响应：** (200)
```json
{
  "token": "string",
  "user": {
    "username": "string",
    "email": "string"
  }
}
```

#### 3.4 登出

**端点：** `POST /api/auth/logout`

**请求头：**
```
Authorization: Bearer {token}
```

**成功响应：** (200)
```json
{
  "message": "登出成功"
}
```

#### 3.5 获取当前用户

**端点：** `GET /api/auth/me`

**请求头：**
```
Authorization: Bearer {token}
```

**成功响应：** (200)
```json
{
  "username": "string",
  "email": "string"
}
```

## CORS 配置

确保你的后端 API 配置了正确的 CORS 设置，允许前端域名访问。

### Node.js/Express 示例：

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Vite 开发服务器地址
  credentials: true
}));
```

## 安全建议

1. **使用 HTTPS**：生产环境必须使用 HTTPS
2. **Token 安全**：使用 HttpOnly Cookie 存储 token 更安全
3. **验证码限流**：后端应对验证码发送进行限流
4. **密码加密**：传输时应考虑对敏感数据进行加密
5. **CSRF 保护**：实现 CSRF token 保护机制

## 开发建议

- 在开发环境使用代理避免 CORS 问题
- 使用 TypeScript 定义完整的类型
- 实现统一的错误处理机制
- 添加请求重试和超时处理
