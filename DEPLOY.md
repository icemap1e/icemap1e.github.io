# 部署指南

本文档介绍如何将个人导航主页部署到不同的平台。

## 📋 部署前准备

1. **获取源码**
   ```bash
   git clone https://github.com/your-username/personal-navigation-hub.git
   cd personal-navigation-hub
   ```

2. **自定义配置（可选）**
   - 复制 `config.example.js` 为 `config.js`
   - 根据需要修改配置文件
   - 配置AI API密钥（如果需要AI功能）

## 🌐 部署平台

### 1. GitHub Pages（推荐）

**自动部署：**
1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择源分支为 `main`
4. GitHub Actions会自动构建和部署

**手动部署：**
1. 推送代码到GitHub
2. 进入仓库Settings > Pages
3. Source选择"Deploy from a branch"
4. Branch选择`main`和`/(root)`
5. 访问 `https://your-username.github.io/repository-name`

### 2. Netlify

1. 登录 [Netlify](https://netlify.com)
2. 拖拽项目文件夹到部署区域
3. 或连接GitHub仓库进行自动部署
4. 获得自动分配的域名或使用自定义域名

### 3. Vercel

1. 登录 [Vercel](https://vercel.com)
2. 导入GitHub仓库
3. 确认配置（默认即可）
4. 部署完成，获得自动域名

### 4. Surge.sh

1. 安装Surge：
   ```bash
   npm install -g surge
   ```

2. 在项目目录中运行：
   ```bash
   surge
   ```

3. 设置自定义域名（可选）

### 5. Firebase Hosting

1. 安装Firebase CLI：
   ```bash
   npm install -g firebase-tools
   ```

2. 初始化项目：
   ```bash
   firebase init hosting
   ```

3. 部署：
   ```bash
   firebase deploy
   ```

### 6. 传统服务器部署

1. 将所有文件上传到服务器
2. 配置Web服务器（Nginx/Apache）
3. 确保服务器支持HTTPS

**Nginx配置示例：**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/project;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## ⚙️ 配置说明

### AI功能配置

要启用AI功能，您需要：

1. **获取API密钥**
   - OpenAI: https://platform.openai.com/api-keys
   - 或其他兼容的API服务

2. **配置密钥**
   - 在页面设置中输入API密钥
   - 或在 `config.js` 中预设

### 自定义书签

编辑 `script.js` 中的 `bookmarks` 数组：

```javascript
const bookmarks = [
    {
        name: "网站名称",
        url: "https://example.com",
        icon: "fas fa-icon-name",
        color: "#颜色代码"
    }
];
```

### 主题定制

修改 `styles.css` 中的CSS变量：

```css
:root {
    --google-blue: #4285f4;
    --google-red: #ea4335;
    /* 更多变量... */
}
```

## 🔒 安全注意事项

1. **不要将API密钥提交到代码仓库**
2. **使用环境变量存储敏感信息**
3. **定期更新依赖和配置**
4. **使用HTTPS协议**

## 🚀 性能优化

1. **启用Gzip压缩**
2. **设置适当的缓存头**
3. **使用CDN加速**
4. **压缩图片资源**

## 📱 测试部署

部署后，测试以下功能：

- [ ] 页面正常加载
- [ ] 搜索功能正常
- [ ] 主题切换正常
- [ ] AI助手正常（如果配置了）
- [ ] 响应式设计正常
- [ ] 所有链接正常

## 🔧 故障排除

### 常见问题

1. **页面无法加载**
   - 检查文件路径
   - 确认服务器配置

2. **AI功能异常**
   - 检查API密钥是否正确
   - 确认网络连接正常

3. **样式显示异常**
   - 检查CSS文件是否正确加载
   - 清除浏览器缓存

4. **搜索功能异常**
   - 检查搜索引擎URL配置
   - 确认JavaScript无错误

### 获取帮助

如果遇到问题，可以：

1. 查看浏览器控制台错误信息
2. 检查服务器日志
3. 提交GitHub Issue
4. 联系项目维护者

---

**提示：** 首次部署建议使用GitHub Pages，它是免费且最简单的选择。