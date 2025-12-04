/**
 * 个人导航主页配置文件
 * 复制此文件为 config.js 并修改配置
 */

// 网站配置
const siteConfig = {
    title: "个人导航主页",
    description: "智能化个人导航页面",
    author: "Your Name"
};

// 搜索引擎配置
const searchEngines = [
    {
        name: "Google",
        url: "https://www.google.com/search?q=",
        icon: "fab fa-google",
        id: "google"
    },
    {
        name: "百度",
        url: "https://www.baidu.com/s?wd=",
        icon: "fas fa-paw",
        id: "baidu"
    },
    {
        name: "必应",
        url: "https://www.bing.com/search?q=",
        icon: "fab fa-microsoft",
        id: "bing"
    },
    {
        name: "DuckDuckGo",
        url: "https://duckduckgo.com/?q=",
        icon: "fas fa-mask",
        id: "duckduckgo"
    }
];

// 书签配置
const bookmarks = [
    {
        name: "GitHub",
        url: "https://github.com",
        icon: "fab fa-github",
        color: "#333333"
    },
    {
        name: "Stack Overflow",
        url: "https://stackoverflow.com",
        icon: "fab fa-stack-overflow",
        color: "#f48023"
    },
    {
        name: "MDN",
        url: "https://developer.mozilla.org",
        icon: "fas fa-book",
        color: "#0066cc"
    },
    {
        name: "YouTube",
        url: "https://youtube.com",
        icon: "fab fa-youtube",
        color: "#ff0000"
    },
    {
        name: "Twitter",
        url: "https://twitter.com",
        icon: "fab fa-twitter",
        color: "#1da1f2"
    },
    {
        name: "Reddit",
        url: "https://reddit.com",
        icon: "fab fa-reddit",
        color: "#ff4500"
    },
    {
        name: "LinkedIn",
        url: "https://linkedin.com",
        icon: "fab fa-linkedin",
        color: "#0077b5"
    },
    {
        name: "Notion",
        url: "https://notion.so",
        icon: "fas fa-sticky-note",
        color: "#000000"
    }
];

// AI 配置
const aiConfig = {
    apiUrl: "https://api.openai.com/v1/chat/completions",
    model: "gpt-3.5-turbo",
    maxTokens: 1000,
    temperature: 0.7,
    systemPrompt: "你是一个有用的AI助手。"
};

// 主题配置
const themeConfig = {
    default: "light", // light, dark, or auto
    customColors: {
        // 自定义颜色（可选）
        primary: "#4285f4",
        secondary: "#34a853",
        accent: "#ea4335"
    }
};

// 功能开关
const features = {
    weather: true,
    aiAssistant: true,
    cognitiveHub: true,
    animations: true,
    autoSave: true
};

// 导出配置（在应用中引入）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        siteConfig,
        searchEngines,
        bookmarks,
        aiConfig,
        themeConfig,
        features
    };
}