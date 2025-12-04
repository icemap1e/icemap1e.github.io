#!/bin/bash

echo "🚀 发布个人导航主页到GitHub"
echo "================================"
echo ""

# 检查Git配置
echo "📋 检查Git配置..."
git config user.name > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Git用户名未配置"
    echo "请运行: git config --global user.name '您的用户名'"
    exit 1
fi

git config user.email > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Git邮箱未配置"
    echo "请运行: git config --global user.email '您的邮箱'"
    exit 1
fi

echo "✅ Git配置检查通过"
echo ""

# 检查远程仓库
echo "📡 检查远程仓库..."
git remote get-url origin > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ 远程仓库未配置"
    echo "请检查是否已正确连接到GitHub仓库"
    exit 1
fi

echo "✅ 远程仓库配置正确: $(git remote get-url origin)"
echo ""

# 提示用户确认
echo "🔍 准备发布到: $(git remote get-url origin)"
echo "📁 当前目录: $(pwd)"
read -p "确认继续发布? (y/N): " confirm

if [[ $confirm != [yY] ]]; then
    echo "❌ 发布已取消"
    exit 1
fi

echo ""
echo "🚀 开始推送代码..."
echo ""

# 尝试推送
if git push -u origin main; then
    echo ""
    echo "🎉 发布成功!"
    echo ""
    echo "📱 您的网站将在几分钟后部署到:"
    echo "   https://icemap1e.github.io"
    echo ""
    echo "🌐 浏览器主页设置:"
    echo "   Chrome: 设置 → 启动时 → '打开特定网页' → https://icemap1e.github.io"
    echo "   Safari: 偏好设置 → 常规 → 主页 → https://icemap1e.github.io"
    echo "   Firefox: 设置 → 主页 → 自定义网址 → https://icemap1e.github.io"
    echo ""
    echo "⚙️  首次使用记得在页面设置中配置AI API密钥"
else
    echo ""
    echo "❌ 推送失败，请检查GitHub认证"
    echo ""
    echo "💡 解决方案:"
    echo "   1. 确保已安装GitHub CLI: brew install gh"
    echo "   2. 运行: gh auth login"
    echo "   3. 或使用GitHub Desktop上传文件"
    echo ""
    echo "🔗 手动上传地址: https://github.com/icemap1e/icemap1e.github.io"
fi