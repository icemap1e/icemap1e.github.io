// 使用防抖函数优化搜索建议
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 使用节流函数优化滚动事件
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 优化状态栏功能
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
    if (currentMessage && h1.textContent !== currentMessage.message) {
        h1.textContent = currentMessage.message;
    }
}

// 优化日期时间更新
function updateDateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    const weekdayElement = document.getElementById('current-weekday');
    
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const dateString = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekdayString = weekdays[now.getDay()];

    // 只在值改变时更新DOM
    if (timeElement.textContent !== timeString) {
        timeElement.textContent = timeString;
    }
    if (dateElement.textContent !== dateString) {
        dateElement.textContent = dateString;
    }
    if (weekdayElement.textContent !== weekdayString) {
        weekdayElement.textContent = weekdayString;
    }

    updateWelcomeMessage();
}

// 优化工作倒计时
function updateWorkCountdown() {
    const now = new Date();
    const startTime = new Date();
    startTime.setHours(8, 0, 0, 0);
    const lunchStart = new Date();
    lunchStart.setHours(11, 30, 0, 0);
    const lunchEnd = new Date();
    lunchEnd.setHours(13, 30, 0, 0);
    const endTime = new Date();
    endTime.setHours(17, 0, 0, 0);

    const countdownText = document.getElementById('work-countdown');
    const progressText = document.getElementById('work-progress-text');
    const workProgress = document.querySelector('.work-progress');

    // 检查必要的元素是否存在
    if (!countdownText || !progressText || !workProgress) {
        console.warn('工作倒计时相关元素未找到，跳过更新');
        return;
    }

    let status = '';
    let timeLeft = 0;
    let progress = 0;
    let currentState = '';

    // 计算总工作时间（不包括午休）
    const totalWorkMinutes = 7 * 60; // 7小时工作制（8小时减去1小时午休）

    if (now < startTime) {
        // 工作前
        status = '距离上班还有';
        timeLeft = Math.floor((startTime - now) / 1000);
        progress = 0;
        currentState = '等待上班';
    } else if (now >= endTime) {
        // 工作后
        status = '今日工作已结束';
        timeLeft = 0;
        progress = 100;
        currentState = '工作结束';
    } else if (now >= lunchStart && now < lunchEnd) {
        // 午休时间
        status = '午休中，距离工作还有';
        timeLeft = Math.floor((lunchEnd - now) / 1000);
        const lunchProgress = Math.min(100, Math.max(0, ((now - lunchStart) / (lunchEnd - lunchStart)) * 100));
        progress = Math.floor(lunchProgress);
        currentState = '午休中';
    } else {
        // 工作时间
        if (now < lunchStart) {
            // 上午工作时间
            status = '距离午休还有';
            timeLeft = Math.floor((lunchStart - now) / 1000);
            const morningProgress = Math.min(100, Math.max(0, ((now - startTime) / (lunchStart - startTime)) * 100));
            progress = Math.floor(morningProgress);
            currentState = '上午工作';
        } else {
            // 下午工作时间
            status = '距离下班还有';
            timeLeft = Math.floor((endTime - now) / 1000);
            const afternoonProgress = Math.min(100, Math.max(0, ((now - lunchEnd) / (endTime - lunchEnd)) * 100));
            progress = Math.floor(afternoonProgress);
            currentState = '下午工作';
        }
    }

    try {
        // 更新时间显示
        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            countdownText.textContent = `${status} ${hours}小时${minutes}分`;
        } else {
            countdownText.textContent = status;
        }

        // 更新进度显示
        progressText.textContent = `${currentState} ${progress}%`;
        
        // 更新状态和进度条
        workProgress.setAttribute('data-state', currentState);
        document.documentElement.style.setProperty('--work-progress', `${progress}%`);
    } catch (error) {
        console.error('更新工作倒计时时出错:', error);
    }
}

// 优化天气更新
async function updateWeather() {
    try {
        let latitude, longitude;
        
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            try {
                const location = JSON.parse(savedLocation);
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
                } else {
                    throw new Error('保存的位置信息无效');
                }
            } catch (e) {
                console.error('解析保存的位置信息失败:', e);
                localStorage.removeItem('userLocation');
                throw new Error('位置信息无效，需要重新获取');
            }
        }

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
            
            if (typeof latitude !== 'number' || typeof longitude !== 'number' ||
                isNaN(latitude) || isNaN(longitude) ||
                latitude < -90 || latitude > 90 ||
                longitude < -180 || longitude > 180) {
                throw new Error('获取的位置信息无效');
            }
            
            localStorage.setItem('userLocation', JSON.stringify({
                latitude,
                longitude,
                timestamp: Date.now()
            }));
        }

        const weatherResponse = await fetch(
            `https://devapi.qweather.com/v7/weather/now?location=${longitude},${latitude}&key=a2aa5892214140fb82303f5da47caa3c`
        );
        
        if (!weatherResponse.ok) {
            throw new Error(`天气数据请求失败: ${weatherResponse.status}`);
        }
        
        const weatherData = await weatherResponse.json();
        
        if (weatherData.code === '200') {
            const weather = weatherData.now;
            const weatherElement = document.getElementById('weather');
            const newContent = `
                <i class="fas fa-thermometer-half"></i>
                <span>${weather.temp}°C</span>
                <span>${weather.text}</span>
            `;
            
            if (weatherElement.innerHTML !== newContent) {
                weatherElement.innerHTML = newContent;
            }
        } else {
            throw new Error(`天气数据获取失败: ${weatherData.code}`);
        }

    } catch (error) {
        console.error('获取天气信息失败:', error);
        const weatherElement = document.getElementById('weather');
        
        let errorContent = '';
        if (error.code === 1) {
            errorContent = `
                <i class="fas fa-map-marker-alt"></i>
                <span>请允许获取位置</span>
            `;
            localStorage.removeItem('userLocation');
        } else if (error.code === 2) {
            errorContent = `
                <i class="fas fa-map-marker-alt"></i>
                <span>位置不可用</span>
            `;
            localStorage.removeItem('userLocation');
        } else if (error.code === 3) {
            errorContent = `
                <i class="fas fa-clock"></i>
                <span>获取位置超时</span>
            `;
        } else if (error.message.includes('位置信息无效')) {
            errorContent = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>位置信息无效</span>
            `;
            localStorage.removeItem('userLocation');
        } else {
            errorContent = `
                <i class="fas fa-exclamation-circle"></i>
                <span>天气获取失败</span>
            `;
        }
        
        if (weatherElement.innerHTML !== errorContent) {
            weatherElement.innerHTML = errorContent;
            weatherElement.style.color = 'var(--error)';
        }
        
        setTimeout(updateWeather, 30000);
    }
}

// IP信息更新
async function updateIPInfo() {
    const ipInfo = document.getElementById('ip-info');
    if (!ipInfo) {
        console.warn('IP信息元素未找到，跳过更新');
        return;
    }

    const ipIcon = ipInfo.querySelector('i');
    const ipText = ipInfo.querySelector('span');

    try {
        // 尝试多个 IP 获取 API
        let ip = null;
        const ipApis = [
            // 主 API
            async () => {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            },
            // 备用 API 1
            async () => {
                const response = await fetch('https://api.ip.sb/ip');
                return await response.text();
            },
            // 备用 API 2
            async () => {
                const response = await fetch('https://ifconfig.me/ip');
                return await response.text();
            },
            // 备用 API 3
            async () => {
                const response = await fetch('https://icanhazip.com');
                return await response.text();
            }
        ];

        // 依次尝试每个 IP API
        for (const api of ipApis) {
            try {
                ip = await api();
                if (ip) break;
            } catch (error) {
                console.warn('IP获取API调用失败，尝试下一个:', error);
                continue;
            }
        }

        if (!ip) {
            throw new Error('无法获取IP地址');
        }

        // 尝试多个 IP 地理位置 API
        let geoData = null;
        const geoApis = [
            // 主 API
            async () => {
                const response = await fetch(`https://ip-api.com/json/${ip}`);
                const data = await response.json();
                if (data.status === 'success') {
                    return {
                        city: data.city,
                        country: data.country
                    };
                }
                throw new Error('API 1 failed');
            },
            // 备用 API 1
            async () => {
                const response = await fetch(`https://ipapi.co/${ip}/json/`);
                const data = await response.json();
                if (data.city && data.country_name) {
                    return {
                        city: data.city,
                        country: data.country_name
                    };
                }
                throw new Error('API 2 failed');
            },
            // 备用 API 2
            async () => {
                const response = await fetch(`https://ipinfo.io/${ip}/json`);
                const data = await response.json();
                if (data.city && data.country) {
                    return {
                        city: data.city,
                        country: data.country
                    };
                }
                throw new Error('API 3 failed');
            }
        ];

        // 依次尝试每个地理位置 API
        for (const api of geoApis) {
            try {
                geoData = await api();
                if (geoData) break;
            } catch (error) {
                console.warn('IP地理位置API调用失败，尝试下一个:', error);
                continue;
            }
        }

        if (geoData) {
            const newContent = `IP: ${ip} (${geoData.city}, ${geoData.country})`;
            if (ipText.textContent !== newContent) {
                ipText.textContent = newContent;
                ipInfo.style.color = 'var(--success)';
            }
        } else {
            // 如果所有地理位置 API 都失败，至少显示 IP
            const newContent = `IP: ${ip}`;
            if (ipText.textContent !== newContent) {
                ipText.textContent = newContent;
                ipInfo.style.color = 'var(--warning)';
            }
        }
    } catch (error) {
        console.error('获取IP信息失败:', error);
        const newContent = 'IP: 获取失败';
        if (ipText && ipText.textContent !== newContent) {
            ipText.textContent = newContent;
            ipInfo.style.color = 'var(--error)';
        }
    }
}

// 优化搜索功能
const searchInput = document.getElementById('search');
const searchSuggestions = document.getElementById('search-suggestions');

// 创建JSONP回调函数
window.baidu = {
    sug: function(data) {
        if (data && data.s) {
            displaySuggestions(data.s);
        }
    }
};

// 获取百度搜索建议
function getBaiduSuggestions(query) {
    return new Promise((resolve) => {
        // 移除之前的script标签
        const oldScript = document.querySelector('script[data-suggestion]');
        if (oldScript) {
            document.body.removeChild(oldScript);
        }

        const script = document.createElement('script');
        script.src = `https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&cb=window.baidu.sug`;
        script.setAttribute('data-suggestion', 'true');
        script.onload = () => {
            document.body.removeChild(script);
            resolve();
        };
        script.onerror = () => {
            document.body.removeChild(script);
            resolve();
        };
        document.body.appendChild(script);
    });
}

const showSuggestions = debounce(async (query) => {
    if (!query) {
        searchSuggestions.classList.remove('active');
        return;
    }

    try {
        await getBaiduSuggestions(query);
    } catch (error) {
        console.error('获取搜索建议失败:', error);
        searchSuggestions.classList.remove('active');
    }
}, 300);

// 显示搜索建议
function displaySuggestions(suggestions) {
    if (suggestions && suggestions.length > 0) {
        const newContent = suggestions.map(suggestion => `
            <div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">
                <i class="fas fa-search"></i>
                <span class="suggestion-text">${suggestion}</span>
                <span class="suggestion-engine">${searchEngines[currentEngine].name}</span>
            </div>
        `).join('');
        
        if (searchSuggestions.innerHTML !== newContent) {
            searchSuggestions.innerHTML = newContent;
            searchSuggestions.classList.add('active');
        }
    } else {
        searchSuggestions.classList.remove('active');
    }
}

// 监听输入事件
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query) {
        showSuggestions(query);
    } else {
        searchSuggestions.classList.remove('active');
    }
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

// 优化主题切换
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // 初始化主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeIcon, savedTheme);
    
    // 添加点击事件监听器
    themeToggle.onclick = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeIcon, newTheme);
    };
}

function updateThemeIcon(icon, theme) {
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initStatusBar();
    initShortcuts();
    
    // 使用 requestAnimationFrame 优化动画性能
    let lastTime = 0;
    function animate(currentTime) {
        if (currentTime - lastTime >= 1000) {
            updateDateTime();
            lastTime = currentTime;
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    
    // 使用 setInterval 更新其他状态
    setInterval(updateWorkCountdown, 60000);
    setInterval(updateWeather, 1800000);
});

// 添加清除位置信息的函数
function clearLocation() {
    localStorage.removeItem('userLocation');
    updateWeather(); // 重新获取天气
}

// 初始化状态栏
function initStatusBar() {
    // 立即更新一次
    updateDateTime();
    updateWorkCountdown();
    updateIPInfo();
    
    // 每秒更新时间
    setInterval(updateDateTime, 1000);
    
    // 每分钟更新工作倒计时
    setInterval(updateWorkCountdown, 60000);
    
    // 更新天气信息
    updateWeather();
    
    // 每30分钟更新一次天气
    setInterval(updateWeather, 1800000);
    
    // 每5分钟更新一次IP信息
    setInterval(updateIPInfo, 300000);
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
    initSearchEngine();
});

// 搜索功能
let currentEngine = 'google';
let searchTimeout;

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

// 初始化搜索引擎
function initSearchEngine() {
    const savedEngine = localStorage.getItem('searchEngine') || 'google';
    setSearchEngine(savedEngine);
}

// 搜索引擎切换功能
function setSearchEngine(engine) {
    if (!searchEngines[engine]) {
        console.error('不支持的搜索引擎:', engine);
        return;
    }

    currentEngine = engine;
    localStorage.setItem('searchEngine', engine);
    
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