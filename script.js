// 状态栏功能
function updateWelcomeMessage() {
    const now = new Date();
    const hour = now.getHours();
    const welcomeMessages = [
        { start: 5, end: 11, message: '早安，新的一天开始啦！' },
        { start: 11, end: 14, message: '中午好，记得休息一下哦~' },
        { start: 14, end: 18, message: '下午好，继续加油！' },
        { start: 18, end: 22, message: '晚上好，今天辛苦了！' },
        { start: 22, end: 5, message: '夜深了，早点休息吧~' }
    ];

    const currentMessage = welcomeMessages.find(msg => 
        (hour >= msg.start && hour < msg.end) || 
        (msg.start > msg.end && (hour >= msg.start || hour < msg.end))
    );

    const h1 = document.querySelector('h1');
    if (currentMessage) {
        h1.textContent = currentMessage.message;
    }
}

function updateDateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    const weekdayElement = document.getElementById('current-weekday');
    
    // 更新时间
    timeElement.textContent = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    // 更新日期
    dateElement.textContent = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    // 更新星期
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    weekdayElement.textContent = weekdays[now.getDay()];

    // 更新欢迎语
    updateWelcomeMessage();
}

function updateWorkCountdown() {
    const now = new Date();
    const endTime = new Date();
    endTime.setHours(18, 0, 0, 0); // 设置下班时间为 18:00

    if (now > endTime) {
        document.querySelector('.progress-text').innerHTML = '<span>今日工作已结束</span><span>100%</span>';
        document.querySelector('.progress-fill').style.width = '100%';
        return;
    }

    const totalMinutes = 8 * 60; // 8小时工作制
    const elapsedMinutes = (now.getHours() - 9) * 60 + now.getMinutes(); // 从9点开始计算
    const remainingMinutes = Math.max(0, totalMinutes - elapsedMinutes);
    
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    
    const progress = Math.min(100, Math.max(0, (elapsedMinutes / totalMinutes) * 100));
    
    document.querySelector('.progress-text').innerHTML = `
        <span>距离下班还有 ${hours}小时${minutes}分钟</span>
        <span>${Math.round(progress)}%</span>
    `;
    document.querySelector('.progress-fill').style.width = `${progress}%`;
}

async function updateWeather() {
    try {
        let latitude, longitude;
        
        // 尝试从 localStorage 获取保存的位置信息
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            try {
                const location = JSON.parse(savedLocation);
                // 验证位置信息的有效性
                if (location && 
                    typeof location.latitude === 'number' && 
                    typeof location.longitude === 'number' &&
                    !isNaN(location.latitude) && 
                    !isNaN(location.longitude) &&
                    location.latitude >= -90 && 
                    location.latitude <= 90 &&
                    location.longitude >= -180 && 
                    location.longitude <= 180) {
                    
                    latitude = location.latitude;
                    longitude = location.longitude;
                    console.log('使用保存的位置信息:', { latitude, longitude });
                } else {
                    throw new Error('保存的位置信息无效');
                }
            } catch (e) {
                console.error('解析保存的位置信息失败:', e);
                localStorage.removeItem('userLocation');
                throw new Error('位置信息无效，需要重新获取');
            }
        }

        // 如果没有有效的保存位置，则请求新的位置
        if (latitude === undefined || longitude === undefined) {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            
            // 验证新获取的位置信息
            if (typeof latitude !== 'number' || typeof longitude !== 'number' ||
                isNaN(latitude) || isNaN(longitude) ||
                latitude < -90 || latitude > 90 ||
                longitude < -180 || longitude > 180) {
                throw new Error('获取的位置信息无效');
            }
            
            // 保存位置信息到 localStorage
            localStorage.setItem('userLocation', JSON.stringify({
                latitude,
                longitude,
                timestamp: Date.now()
            }));
            console.log('保存新的位置信息:', { latitude, longitude });
        }

        // 使用和风天气 API 获取天气
        const weatherResponse = await fetch(
            `https://devapi.qweather.com/v7/weather/now?location=${longitude},${latitude}&key=a2aa5892214140fb82303f5da47caa3c`
        );
        
        if (!weatherResponse.ok) {
            throw new Error(`天气数据请求失败: ${weatherResponse.status}`);
        }
        
        const weatherData = await weatherResponse.json();
        console.log('天气数据:', weatherData);
        
        if (weatherData.code === '200') {
            const weather = weatherData.now;
            const weatherElement = document.getElementById('weather');
            weatherElement.innerHTML = `
                <i class="fas fa-thermometer-half"></i>
                <span>${weather.temp}°C</span>
                <span>${weather.text}</span>
            `;
        } else {
            throw new Error(`天气数据获取失败: ${weatherData.code}`);
        }

    } catch (error) {
        console.error('获取天气信息失败:', error);
        const weatherElement = document.getElementById('weather');
        
        // 根据错误类型显示不同的错误信息
        if (error.code === 1) {
            weatherElement.innerHTML = `
                <i class="fas fa-map-marker-alt"></i>
                <span>请允许获取位置</span>
            `;
            localStorage.removeItem('userLocation');
        } else if (error.code === 2) {
            weatherElement.innerHTML = `
                <i class="fas fa-map-marker-alt"></i>
                <span>位置不可用</span>
            `;
            localStorage.removeItem('userLocation');
        } else if (error.code === 3) {
            weatherElement.innerHTML = `
                <i class="fas fa-clock"></i>
                <span>获取位置超时</span>
            `;
        } else if (error.message.includes('位置信息无效')) {
            weatherElement.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>位置信息无效</span>
            `;
            localStorage.removeItem('userLocation');
        } else {
            weatherElement.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span>天气获取失败</span>
            `;
        }
        
        weatherElement.style.color = 'var(--error)';
        
        // 30秒后重试
        setTimeout(updateWeather, 30000);
    }
}

// 添加清除位置信息的函数
function clearLocation() {
    localStorage.removeItem('userLocation');
    updateWeather(); // 重新获取天气
}

// 状态栏功能
function updateNetworkStatus() {
    const networkStatus = document.getElementById('network-status');
    const statusIcon = networkStatus.querySelector('i');
    const statusText = networkStatus.querySelector('span');

    function updateStatus() {
        if (navigator.onLine) {
            // 检测网络速度
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection) {
                const speed = connection.downlink;
                const type = connection.effectiveType;
                
                // 根据网络速度设置不同的图标和文本
                if (speed >= 10) {
                    statusIcon.className = 'fas fa-wifi';
                    statusText.textContent = `网络状态: ${type} (${speed.toFixed(1)}Mbps)`;
                    networkStatus.style.color = 'var(--success)';
                } else if (speed >= 5) {
                    statusIcon.className = 'fas fa-wifi';
                    statusText.textContent = `网络状态: ${type} (${speed.toFixed(1)}Mbps)`;
                    networkStatus.style.color = 'var(--warning)';
                } else {
                    statusIcon.className = 'fas fa-wifi';
                    statusText.textContent = `网络状态: ${type} (${speed.toFixed(1)}Mbps)`;
                    networkStatus.style.color = 'var(--error)';
                }
            } else {
                // 如果无法获取网络速度信息
                statusIcon.className = 'fas fa-wifi';
                statusText.textContent = '网络状态: 已连接';
                networkStatus.style.color = 'var(--success)';
            }
        } else {
            statusIcon.className = 'fas fa-wifi-slash';
            statusText.textContent = '网络状态: 未连接';
            networkStatus.style.color = 'var(--error)';
        }
    }

    // 初始更新
    updateStatus();

    // 监听网络状态变化
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // 监听网络速度变化
    if (navigator.connection) {
        navigator.connection.addEventListener('change', updateStatus);
    }
}

// 初始化状态栏
function initStatusBar() {
    // 立即更新一次
    updateDateTime();
    updateWorkCountdown();
    updateNetworkStatus();
    
    // 每秒更新时间
    setInterval(updateDateTime, 1000);
    
    // 每分钟更新工作倒计时
    setInterval(updateWorkCountdown, 60000);
    
    // 更新天气信息
    updateWeather();
    
    // 每30分钟更新一次天气
    setInterval(updateWeather, 1800000);
}

// 更新最后更新日期
function updateLastUpdateDate() {
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        lastUpdateElement.textContent = `${year}-${month}-${day}`;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initStatusBar();
    initShortcuts();
});

// 搜索功能
let currentEngine = 'google';
let searchTimeout;
const searchInput = document.getElementById('search');
const searchSuggestions = document.getElementById('search-suggestions');

// 模拟搜索建议数据
const mockSuggestions = {
    'goo': ['Google搜索', 'Google翻译', 'Google地图', 'Google Drive'],
    'git': ['GitHub', 'GitLab', 'Git命令', 'Git教程'],
    'you': ['YouTube', '优酷', '油管', 'YouTube Music'],
    'ba': ['百度', '百度翻译', '百度地图', '百度网盘'],
    'bi': ['Bing', 'Bing翻译', 'Bing地图'],
    'fa': ['Facebook', 'Facebook Messenger', 'Facebook Watch'],
    'tw': ['Twitter', 'Twitter搜索', 'Twitter趋势'],
    'in': ['Instagram', 'Instagram搜索', 'Instagram故事']
};

// 搜索引擎配置
const searchEngines = {
    google: {
        name: 'Google',
        url: 'https://www.google.com/search?q=',
        icon: 'fab fa-google'
    },
    bing: {
        name: 'Bing',
        url: 'https://www.bing.com/search?q=',
        icon: 'fab fa-microsoft'
    },
    baidu: {
        name: '百度',
        url: 'https://www.baidu.com/s?wd=',
        icon: 'fas fa-search'
    }
};

function showSuggestions(query) {
    if (!query) {
        searchSuggestions.classList.remove('active');
        return;
    }

    // 获取建议
    const suggestions = [];
    for (const [key, values] of Object.entries(mockSuggestions)) {
        if (key.startsWith(query.toLowerCase())) {
            suggestions.push(...values);
        }
    }

    // 显示建议
    if (suggestions.length > 0) {
        searchSuggestions.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">
                <i class="fas fa-search"></i>
                <span class="suggestion-text">${suggestion}</span>
                <span class="suggestion-engine">${searchEngines[currentEngine].name}</span>
            </div>
        `).join('');
        searchSuggestions.classList.add('active');
    } else {
        searchSuggestions.classList.remove('active');
    }
}

function selectSuggestion(suggestion) {
    searchInput.value = suggestion;
    searchSuggestions.classList.remove('active');
    search();
}

function search() {
    const query = searchInput.value.trim();
    
    if (!query) {
        searchInput.focus();
        return;
    }

    try {
        const engine = searchEngines[currentEngine];
        if (!engine) {
            throw new Error('搜索引擎配置错误');
        }

        const searchUrl = `${engine.url}${encodeURIComponent(query)}`;
        window.location.href = searchUrl;
        
        // 清空搜索框
        searchInput.value = '';
        searchSuggestions.classList.remove('active');
    } catch (error) {
        console.error('搜索失败:', error);
        // 可以添加错误提示UI
    }
}

// 监听输入事件
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        showSuggestions(e.target.value);
    }, 200); // 减少延迟时间，使响应更快
});

// 点击外部关闭建议
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.classList.remove('active');
    }
});

// 键盘导航
searchInput.addEventListener('keydown', (e) => {
    const suggestions = searchSuggestions.querySelectorAll('.suggestion-item');
    const activeSuggestion = searchSuggestions.querySelector('.suggestion-item.active');
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            if (!activeSuggestion) {
                suggestions[0]?.classList.add('active');
            } else {
                const nextSuggestion = activeSuggestion.nextElementSibling;
                if (nextSuggestion) {
                    activeSuggestion.classList.remove('active');
                    nextSuggestion.classList.add('active');
                }
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            if (activeSuggestion) {
                const prevSuggestion = activeSuggestion.previousElementSibling;
                activeSuggestion.classList.remove('active');
                if (prevSuggestion) {
                    prevSuggestion.classList.add('active');
                }
            }
            break;
        case 'Enter':
            if (activeSuggestion) {
                e.preventDefault();
                selectSuggestion(activeSuggestion.querySelector('.suggestion-text').textContent);
            } else {
                search();
            }
            break;
        case 'Escape':
            searchSuggestions.classList.remove('active');
            break;
    }
});

// 搜索引擎切换功能
function setSearchEngine(engine) {
    if (!searchEngines[engine]) {
        console.error('不支持的搜索引擎:', engine);
        return;
    }

    currentEngine = engine;
    
    // 更新按钮状态
    document.querySelectorAll('.engine-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.engine === engine) {
            btn.classList.add('active');
            // 添加切换动画
            btn.style.animation = 'none';
            btn.offsetHeight; // 触发重绘
            btn.style.animation = 'engineSwitch 0.3s ease';
        }
    });
    
    // 更新搜索框提示
    searchInput.placeholder = `使用${searchEngines[engine].name}搜索...`;
    
    // 如果当前有搜索建议，更新引擎显示
    const suggestions = searchSuggestions.querySelectorAll('.suggestion-engine');
    suggestions.forEach(suggestion => {
        suggestion.textContent = searchEngines[engine].name;
    });
}

// 添加搜索引擎切换动画
const style = document.createElement('style');
style.textContent = `
    @keyframes engineSwitch {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// 初始化搜索引擎
setSearchEngine('google');

// 添加网站数据
const websites = {
    '常用工具': [
        { name: 'Google', url: 'https://www.google.com', icon: 'fab fa-google' },
        { name: 'GitHub', url: 'https://www.github.com', icon: 'fab fa-github' },
        { name: 'YouTube', url: 'https://www.youtube.com', icon: 'fab fa-youtube' }
    ],
    '学习资源': [
        { name: 'Coursera', url: 'https://www.coursera.org', icon: 'fas fa-graduation-cap' },
        { name: 'Udemy', url: 'https://www.udemy.com', icon: 'fas fa-book' },
        { name: 'W3Schools', url: 'https://www.w3schools.com', icon: 'fas fa-code' }
    ],
    '社交媒体': [
        { name: 'Twitter', url: 'https://www.twitter.com', icon: 'fab fa-twitter' },
        { name: 'Facebook', url: 'https://www.facebook.com', icon: 'fab fa-facebook' },
        { name: 'Instagram', url: 'https://www.instagram.com', icon: 'fab fa-instagram' }
    ]
};

// 动态生成网站链接
function generateLinks() {
    const main = document.querySelector('main');
    main.innerHTML = ''; // 清空现有内容

    for (const [category, sites] of Object.entries(websites)) {
        const section = document.createElement('section');
        section.className = 'category';
        
        const h2 = document.createElement('h2');
        h2.textContent = category;
        
        const grid = document.createElement('div');
        grid.className = 'links-grid';
        
        sites.forEach(site => {
            const link = document.createElement('a');
            link.href = site.url;
            link.className = 'link-card';
            link.target = '_blank';
            
            const icon = document.createElement('i');
            icon.className = site.icon;
            
            const span = document.createElement('span');
            span.textContent = site.name;
            
            link.appendChild(icon);
            link.appendChild(span);
            grid.appendChild(link);
        });
        
        section.appendChild(h2);
        section.appendChild(grid);
        main.appendChild(section);
    }
}

// 主题切换功能
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // 从 localStorage 获取保存的主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeIcon, savedTheme);
    
    // 添加主题切换事件监听
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeIcon, newTheme);
    });
}

function updateThemeIcon(icon, theme) {
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// 快捷方式数据
const shortcuts = [
    { 
        name: '企业邮箱',
        url: 'https://mail.qiye.163.com/static/login/',
        icon: 'fas fa-envelope'
    },
    { 
        name: 'ChatGPT',
        url: 'https://chat.openai.com/',
        icon: 'fas fa-robot'
    },
    { 
        name: 'GitHub',
        url: 'https://github.com/',
        icon: 'fab fa-github'
    },
    { 
        name: 'V2EX',
        url: 'https://www.v2ex.com/',
        icon: 'fas fa-code'
    },
    { 
        name: '百度翻译',
        url: 'https://fanyi.baidu.com/',
        icon: 'fas fa-language'
    },
    { 
        name: '在线学习',
        url: 'https://momoyu.cc/',
        icon: 'fas fa-graduation-cap'
    },
    { 
        name: '知乎',
        url: 'https://www.zhihu.com/',
        icon: 'fas fa-question-circle'
    },
    { 
        name: '哔哩哔哩',
        url: 'https://www.bilibili.com/',
        icon: 'fab fa-bilibili'
    },
    { 
        name: 'YouTube',
        url: 'https://www.youtube.com/',
        icon: 'fab fa-youtube'
    }
];

// 初始化快捷方式
function initShortcuts() {
    const linksGrid = document.querySelector('.links-grid');
    linksGrid.innerHTML = ''; // 清空现有内容
    shortcuts.forEach(shortcut => {
        const linkCard = document.createElement('a');
        linkCard.href = shortcut.url;
        linkCard.className = 'link-card';
        linkCard.innerHTML = `
            <i class="${shortcut.icon}"></i>
            <span>${shortcut.name}</span>
        `;
        linksGrid.appendChild(linkCard);
    });
} 