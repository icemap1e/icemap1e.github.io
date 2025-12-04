#!/bin/bash

echo "🔐 部署个人导航主页 - SSH认证版本"
echo "=================================="
echo ""

# 检查SSH密钥
echo "🔑 检查SSH密钥..."
if [ -f ~/.ssh/id_ed25519 ]; then
    echo "✅ 找到SSH密钥: ~/.ssh/id_ed25519"
else
    echo "❌ 未找到SSH密钥文件"
    exit 1
fi

# 尝试添加SSH密钥到agent
echo ""
echo "🔐 添加SSH密钥到agent..."
echo "请输入SSH密钥密码 (yueyang):"

if ssh-add ~/.ssh/id_ed25519; then
    echo "✅ SSH密钥添加成功"
else
    echo "❌ SSH密钥添加失败"
    exit 1
fi

# 测试SSH连接
echo ""
echo "🌐 测试GitHub SSH连接..."
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ GitHub SSH认证成功"
else
    echo "❌ GitHub SSH认证失败"
    echo "💡 请确保:"
    echo "   1. SSH公钥已添加到GitHub账户"
    echo "   2. SSH密钥密码正确"
    exit 1
fi

# 确保远程仓库使用SSH
echo ""
echo "📡 配置远程仓库..."
git remote set-url origin git@github.com:icemap1e/icemap1e.github.io.git
echo "✅ 远程仓库已设置为SSH"

# 推送代码
echo ""
echo "🚀 推送代码到GitHub..."
echo "目标仓库: icemap1e.github.io"
echo "分支: main"
echo ""

if git push -u origin main; then
    echo ""
    echo "🎉 发布成功!"
    echo ""
    echo "🌐 您的新导航页面将在几分钟内部署到:"
    echo "   https://icemap1e.github.io"
    echo ""
    echo "📱 设置为浏览器主页:"
    echo "   • Chrome: https://icemap1e.github.io"
    echo "   • Safari: https://icemap1e.github.io"
    echo "   • Firefox: https://icemap1e.github.io"
    echo ""
    echo "⚙️  首次使用记得配置AI API密钥"
else
    echo ""
    echo "❌ 推送失败"
    echo "💡 请检查网络连接和权限"
fi