# 个人智能导航主页

一个优雅、现代化的个人导航页面，集成AI助手功能，提供智能化的网页浏览体验。

## ✨ 特性

- 🎨 **现代化设计** - 简洁优雅的界面，支持浅色/深色主题切换
- 🔍 **智能搜索** - 集成多个搜索引擎，支持AI增强搜索
- 🤖 **AI助手集成** - 内置对话功能，提供智能问答服务
- 📊 **认知中枢** - 智能分析用户状态，提供个性化建议
- 🔖 **快速书签** - 常用网站快速访问
- 📱 **响应式设计** - 完美适配各种屏幕尺寸
- ⚡ **一屏适配** - 优化布局，确保在大部分屏幕上无需滚动

## 🚀 快速开始

### 本地运行

1. 克隆项目到本地：
```bash
git clone https://github.com/your-username/personal-navigation-hub.git
cd personal-navigation-hub
```

2. 直接在浏览器中打开 `index.html` 文件：
```bash
# 使用任何现代浏览器打开
open index.html
```

或者使用本地服务器：
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

3. 访问 `http://localhost:8000` 查看效果

### 配置

- **书签管理**：直接在 `script.js` 中修改 `bookmarks` 数组
- **API密钥**：在设置中配置您的AI API密钥（可选）
- **个性化**：修改问候语、天气等设置

## 🎯 功能特性

### 核心功能
- **多引擎搜索**：支持Google、百度、必应等主流搜索引擎
- **AI对话助手**：智能问答，支持多轮对话历史记录
- **实时状态显示**：时间、天气、系统状态
- **主题切换**：浅色/深色模式无缝切换

### AI功能
- **智能搜索**：AI增强的搜索结果
- **状态分析**：智能认知分析
- **个性化建议**：基于用户行为的智能推荐
- **多轮对话**：支持上下文对话的AI助手

### 界面特性
- **极简设计**：专注内容，去除干扰元素
- **流畅动画**：细腻的过渡效果
- **专业配色**：精心设计的色彩方案
- **无障碍访问**：良好的键盘导航支持

## 🔧 技术栈

- **前端框架**：原生 JavaScript (ES6+)
- **样式**：CSS3 + CSS Variables
- **图标**：Font Awesome
- **字体**：Segoe UI + 系统字体
- **布局**：CSS Grid + Flexbox
- **API**：OpenAI Compatible API

## 📱 浏览器兼容性

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 📁 项目结构

```
personal-navigation-hub/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 核心JavaScript
├── README.md           # 项目文档
├── LICENSE             # 许可证
└── assets/             # 资源文件
    └── icons/          # 图标资源
```

## 🎨 自定义

### 添加书签
在 `script.js` 中找到 `bookmarks` 数组，按以下格式添加：
```javascript
{
    name: "网站名称",
    url: "https://example.com",
    icon: "fas fa-icon-name",
    color: "#颜色代码"
}
```

### 修改配色
在 `styles.css` 中修改CSS变量：
```css
:root {
    --google-blue: #4285f4;
    --google-red: #ea4335;
    /* 更多颜色变量... */
}
```

### 配置AI功能
1. 点击页面右上角的设置按钮
2. 在AI设置中输入您的API密钥
3. 保存配置即可使用AI功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Font Awesome](https://fontawesome.com/) - 图标库
- [Google Fonts](https://fonts.google.com/) - 字体资源
- [OpenAI](https://openai.com/) - AI服务支持

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 📧 Email: your-email@example.com
- 🐙 GitHub: [@your-username](https://github.com/your-username)
- 🐦 Twitter: [@your-twitter](https://twitter.com/your-twitter)

---

⭐ 如果这个项目对您有帮助，请给它一个星标！