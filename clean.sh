#!/bin/bash

# 清理脚本 - 移除不应发布到GitHub的文件

echo "🧹 开始清理项目文件..."

# 移除临时文件和截图
rm -f *.png
rm -f *.jpg
rm -f *.jpeg
rm -f *.DS_Store
rm -f .DS_Store

# 移除个人配置文件
rm -f config.js
rm -f user-settings.json
rm -f api-keys.json

# 移除临时目录
rm -rf .claude
rm -rf node_modules
rm -rf dist
rm -rf build

echo "✅ 清理完成！"
echo ""
echo "📁 当前项目结构："
ls -la

echo ""
echo "🚀 现在可以安全地推送到GitHub了！"