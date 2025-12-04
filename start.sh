#!/bin/bash

# 快速启动脚本 - 启动本地开发服务器

echo "🚀 启动个人导航主页开发服务器..."
echo ""

# 检查端口是否被占用
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  端口8000已被占用，尝试使用端口8080..."
    PORT=8080
else
    PORT=8000
fi

# 尝试启动服务器
if command -v python3 &> /dev/null; then
    echo "🐍 使用Python3启动服务器 (端口: $PORT)"
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "🐍 使用Python启动服务器 (端口: $PORT)"
    python -m SimpleHTTPServer $PORT
elif command -v node &> /dev/null; then
    echo "📦 使用Node.js启动服务器 (端口: $PORT)"
    npx http-server -p $PORT -o
elif command -v php &> /dev/null; then
    echo "🐘 使用PHP启动服务器 (端口: $PORT)"
    php -S localhost:$PORT
else
    echo "❌ 未找到合适的Web服务器"
    echo ""
    echo "请手动安装以下工具之一："
    echo "  - Python (推荐): https://python.org"
    echo "  - Node.js: https://nodejs.org"
    echo "  - PHP: https://php.net"
    echo ""
    echo "或者直接在浏览器中打开 index.html 文件"
    exit 1
fi