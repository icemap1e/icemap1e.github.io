// 搜索引擎配置
const searchEngines = {
    baidu: {
        url: 'https://www.baidu.com/s?wd=',
        pingUrl: 'https://www.baidu.com/favicon.ico',
        name: '百度'
    },
    google: {
        url: 'https://www.google.com/search?q=',
        pingUrl: 'https://www.google.com/favicon.ico',
        name: 'Google'
    },
    bing: {
        url: 'https://www.bing.com/search?q=',
        pingUrl: 'https://www.bing.com/favicon.ico',
        name: 'Bing'
    },
    yandex: {
        url: 'https://yandex.com/search/?text=',
        pingUrl: 'https://yandex.com/favicon.ico',
        name: 'Yandex'
    },
    yahoo: {
        url: 'https://search.yahoo.com/search?p=',
        pingUrl: 'https://search.yahoo.com/favicon.ico',
        name: 'Yahoo'
    },
    sogou: {
        url: 'https://www.sogou.com/web?query=',
        pingUrl: 'https://www.sogou.com/favicon.ico',
        name: '搜狗'
    },
    search360: {
        url: 'https://www.so.com/s?q=',
        pingUrl: 'https://www.so.com/favicon.ico',
        name: '360'
    },
    github: {
        url: 'https://github.com/search?q=',
        pingUrl: 'https://github.com/favicon.ico',
        name: 'Github'
    }
};

let currentEngine = 'baidu';

// 节日倒计时配置
const festivals = [
    { name: '春节', month: 1, day: 10, year: 2024 },  // 2024年2月10日
    { name: '元宵节', month: 1, day: 24, year: 2024 }, // 2024年2月24日
    { name: '清明节', month: 3, day: 4, year: 2024 },  // 2024年4月4日
    { name: '劳动节', month: 4, day: 1, year: 2024 },  // 2024年5月1日
    { name: '端午节', month: 5, day: 10, year: 2024 }, // 2024年6月10日
    { name: '中秋节', month: 8, day: 17, year: 2024 }, // 2024年9月17日
    { name: '国庆节', month: 9, day: 1, year: 2024 },  // 2024年10月1日
];

// 备忘录功能
class MemoManager {
    constructor() {
        this.memos = JSON.parse(localStorage.getItem('memos')) || [];
        this.initElements();
        this.bindEvents();
        this.autoSaveTimeout = null;
        this.updatePreview(); // 初始化时更新预览
    }

    initElements() {
        // 按钮和窗口元素
        this.memoContainer = document.querySelector('.memo-container');
        this.memoEditWindow = document.querySelector('.memo-edit-window');
        this.modalOverlay = document.querySelector('.modal-overlay');
        this.editTextArea = document.querySelector('.memo-edit-text');
        this.closeEditBtn = document.querySelector('.close-edit');
        this.previewContent = document.querySelector('.memo-preview-content');
    }

    bindEvents() {
        // 点击整个容器打开备忘录窗口
        this.memoContainer.addEventListener('click', () => this.showEditWindow());

        // 关闭编辑窗口
        this.closeEditBtn.addEventListener('click', () => this.hideEditWindow());

        // 点击遮罩层关闭窗口
        this.modalOverlay.addEventListener('click', () => this.hideEditWindow());

        // 处理输入变化，实现自动保存
        this.editTextArea.addEventListener('input', (e) => {
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = setTimeout(() => {
                const content = this.editTextArea.innerHTML.trim();
                if (content) {
                    // 更新或创建备忘录
                    if (this.memos.length > 0) {
                        this.memos[0] = {
                            ...this.memos[0],
                            content: content,
                            updatedAt: new Date().toISOString()
                        };
                    } else {
                        this.memos.push({
                            id: Date.now().toString(),
                            content: content,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        });
                    }
                    this.saveToLocalStorage();
                    this.updatePreview(); // 保存时更新预览
                }
            }, 500);

            // 确保内容始终在 p 标签内
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const currentNode = range.startContainer;

            // 如果当前节点不在 p 标签内，创建新的 p 标签
            if (!currentNode.parentElement.matches('p')) {
                const p = document.createElement('p');
                // 如果是文本节点，将其包装在 p 标签中
                if (currentNode.nodeType === Node.TEXT_NODE) {
                    const textContent = currentNode.textContent;
                    currentNode.textContent = '';
                    p.textContent = textContent;
                    this.editTextArea.insertBefore(p, currentNode);
                    currentNode.remove();
                } else {
                    // 如果是其他类型的节点，创建新的空 p 标签
                    this.editTextArea.appendChild(p);
                }
            }

            this.updateNumbers();
        });

        // 处理回车键
        this.editTextArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const currentP = range.startContainer.parentElement.closest('p');
                
                if (!currentP) return;

                // 创建新段落
                const newP = document.createElement('p');
                newP.innerHTML = '<br>';  // 添加一个换行符，防止空段落折叠

                // 如果在段落中间按回车，需要处理分割内容
                if (range.startOffset < currentP.textContent.length) {
                    const textAfterCursor = currentP.textContent.substring(range.startOffset);
                    currentP.textContent = currentP.textContent.substring(0, range.startOffset);
                    newP.textContent = textAfterCursor;
                }

                // 插入新段落
                if (currentP.nextSibling) {
                    this.editTextArea.insertBefore(newP, currentP.nextSibling);
                } else {
                    this.editTextArea.appendChild(newP);
                }

                // 设置光标位置到新段落的开始
                range.setStart(newP, 0);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);

                this.updateNumbers();
            }
        });

        // 处理删除键
        this.editTextArea.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.shiftKey) {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const currentP = range.startContainer.parentElement.closest('p');
                
                if (!currentP) return;
                
                // 如果光标在段落开始处并且不是第一个段落
                if (range.startOffset === 0 && currentP.previousSibling) {
                    e.preventDefault();
                    const prevP = currentP.previousSibling;
                    const prevLength = prevP.textContent.length;
                    
                    // 将当前段落的内容追加到上一个段落
                    prevP.textContent += currentP.textContent;
                    currentP.remove();
                    
                    // 设置光标位置
                    const newRange = document.createRange();
                    newRange.setStart(prevP.firstChild || prevP, prevLength);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                    
                    this.updateNumbers();
                }
            }
        });

        // 处理粘贴事件
        this.editTextArea.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            const lines = text.split('\n');
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const currentP = range.startContainer.parentElement.closest('p');
            
            if (!currentP) return;
            
            // 处理第一行
            const firstLine = lines[0];
            const textBeforeCursor = currentP.textContent.substring(0, range.startOffset);
            const textAfterCursor = currentP.textContent.substring(range.startOffset);
            currentP.textContent = textBeforeCursor + firstLine;
            
            // 处理剩余行
            for (let i = 1; i < lines.length; i++) {
                const newP = document.createElement('p');
                newP.textContent = lines[i];
                if (currentP.nextSibling) {
                    this.editTextArea.insertBefore(newP, currentP.nextSibling);
                } else {
                    this.editTextArea.appendChild(newP);
                }
            }
            
            // 处理最后一行
            if (lines.length > 1) {
                const lastP = this.editTextArea.lastChild;
                lastP.textContent += textAfterCursor;
            } else {
                currentP.textContent += textAfterCursor;
            }
            
            this.updateNumbers();
        });

        // 处理初始点击事件
        this.editTextArea.addEventListener('click', () => {
            const firstP = this.editTextArea.querySelector('p');
            if (firstP && !firstP.textContent.trim()) {
                firstP.textContent = '';
            }
        });
    }

    showEditWindow() {
        // 获取现有内容
        const content = this.memos[0]?.content || '<p></p>';
        this.editTextArea.innerHTML = content;
        this.updateNumbers();
        this.memoEditWindow.style.display = 'flex';
        this.modalOverlay.style.display = 'block';
        this.editTextArea.focus();

        // 设置光标位置到第一个段落的开始
        const firstP = this.editTextArea.querySelector('p');
        if (firstP) {
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(firstP, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    hideEditWindow() {
        // 直接隐藏窗口，不需要额外的保存操作
        this.memoEditWindow.style.display = 'none';
        this.modalOverlay.style.display = 'none';
    }

    updateNumbers() {
        const paragraphs = Array.from(this.editTextArea.children);
        paragraphs.forEach((p, index) => {
            if (p.tagName.toLowerCase() === 'p') {
                p.setAttribute('data-number', (index + 1).toString());
            }
        });
    }

    saveToLocalStorage() {
        localStorage.setItem('memos', JSON.stringify(this.memos));
    }

    updatePreview() {
        if (this.memos.length > 0) {
            // 将内容按段落分割并添加到预览区域
            const content = this.memos[0].content;
            const paragraphs = content.split('</p>');
            const formattedContent = paragraphs
                .map((p, index) => {
                    // 提取纯文本内容
                    const text = p.replace(/<[^>]+>/g, '').trim();
                    return text ? `<p data-number="${index + 1}">${text}</p>` : '';
                })
                .filter(p => p) // 移除空段落
                .join('');
            
            this.previewContent.innerHTML = formattedContent;
        } else {
            this.previewContent.innerHTML = '';
        }
    }
}

// 初始化备忘录管理器
const memoManager = new MemoManager();

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initClock();
    initSearch();
    initWeather();
    initBookmarks();
    initPingTest();
    initWorkStatus();
    updateSearchPlaceholder(); // 初始化占位文字
    
    // 初始化时间显示
    updateTime();
    // 每秒更新一次时间
    setInterval(updateTime, 1000);
    
    // 初始化天气显示
    updateWeather();
    // 每30分钟更新一次天气
    setInterval(updateWeather, 30 * 60 * 1000);
    
    // 初始化工作状态显示
    updateWorkStatus();
    // 每分钟更新一次工作状态
    setInterval(updateWorkStatus, 60 * 1000);
    
    // 初始化书签显示
    loadBookmarks();
    
    // 初始化搜索引擎
    initSearchEngines();
    
    // 自动聚焦搜索框
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.focus();
    }
});

// 主题切换
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('themeIcon');
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('themeIcon');
    themeIcon.className = theme === 'light' ? 'ri-moon-line' : 'ri-sun-line';
}

// 农历日期计算
class Lunar {
    constructor(date) {
        this.date = date;
    }

    static lunarInfo = [
        0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,//1900-1909
        0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,//1910-1919
        0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,//1920-1929
        0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,//1930-1939
        0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,//1940-1949
        0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,//1950-1959
        0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,//1960-1969
        0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,//1970-1979
        0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,//1980-1989
        0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,//1990-1999
        0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,//2000-2009
        0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,//2010-2019
        0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,//2020-2029
        0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,//2030-2039
        0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,//2040-2049
        0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,//2050-2059
        0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,//2060-2069
        0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,//2070-2079
        0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,//2080-2089
        0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,//2090-2099
    ];

    static Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    static Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    static Animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
    static lunarMonth = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
    static lunarDay = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
        '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

    getLunarDate() {
        let offset = Math.floor((this.date.getTime() - new Date(1900, 0, 31).getTime()) / 86400000);
        let year = 1900;
        let temp = 0;
        
        // 计算年份
        for(let i = 0; i < 2101 - 1900 && offset > 0; i++) {
            temp = this.getLunarYearDays(1900 + i);
            offset -= temp;
            year++;
        }
        if(offset < 0) {
            offset += temp;
            year--;
        }

        // 计算月份
        let isLeap = false;
        let month = 1;
        let monthDays;
        let leapMonth = this.getLeapMonth(year); // 闰哪个月

        for(month = 1; month < 13 && offset > 0; month++) {
            // 闰月
            if(leapMonth > 0 && month === (leapMonth + 1) && !isLeap) {
                --month;
                isLeap = true;
                monthDays = this.getLeapMonthDays(year);
            } else {
                monthDays = this.getMonthDays(year, month);
            }

            // 解除闰月
            if(isLeap && month === (leapMonth + 1)) {
                isLeap = false;
            }

            offset -= monthDays;
        }

        if(offset === 0 && leapMonth > 0 && month === leapMonth + 1) {
            if(isLeap) {
                isLeap = false;
            } else {
                isLeap = true;
                --month;
            }
        }

        if(offset < 0) {
            offset += monthDays;
            --month;
        }

        return {
            year: year,
            month: month,
            day: offset + 1,
            isLeap: isLeap
        };
    }

    getLunarYearDays(year) {
        let sum = 348;
        for(let i = 0x8000; i > 0x8; i >>= 1) {
            sum += (Lunar.lunarInfo[year - 1900] & i) ? 1 : 0;
        }
        return sum + this.getLeapMonthDays(year);
    }

    getLeapMonth(year) {
        return Lunar.lunarInfo[year - 1900] & 0xf;
    }

    getLeapMonthDays(year) {
        if(this.getLeapMonth(year)) {
            return (Lunar.lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
        }
        return 0;
    }

    getMonthDays(year, month) {
        return (Lunar.lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
    }

    toString() {
        const date = this.getLunarDate();
        let monthStr = Lunar.lunarMonth[date.month - 1];
        if(date.isLeap) {
            monthStr = '闰' + monthStr;
        }
        return `农历${monthStr}月${Lunar.lunarDay[date.day - 1]}`;
    }
}

// 计算春节倒计时
function getSpringFestivalCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let springFestival = new Date(currentYear, 1, 10); // 2024年春节是2月10日

    // 如果今年的春节已经过了，计算明年的
    if (now > springFestival) {
        springFestival = new Date(currentYear + 1, 1, 10);
    }

    const timeDiff = springFestival - now;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return days;
}

// 计算年度进度
function getYearProgress() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const progress = ((now - startOfYear) / (endOfYear - startOfYear)) * 100;
    return progress.toFixed(1);
}

// 计算节日倒计时
function getUpcomingFestivals() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // 计算每个节日的倒计时
    const festivalCountdowns = festivals.map(festival => {
        let festivalDate = new Date(currentYear, festival.month, festival.day);
        
        // 如果节日已经过去，使用明年的日期
        if (festivalDate < now) {
            festivalDate = new Date(currentYear + 1, festival.month, festival.day);
        }
        
        const timeDiff = festivalDate - now;
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        return {
            name: festival.name,
            days: days,
            date: festivalDate
        };
    });
    
    // 按照日期从近到远排序
    return festivalCountdowns.sort((a, b) => a.days - b.days);
}

// 更新节日倒计时显示
function updateFestivalCountdowns() {
    const upcomingFestivals = getUpcomingFestivals();
    const countdownElem = document.querySelector('.countdown');
    
    // 获取最近的三个节日
    const nearestFestivals = upcomingFestivals.slice(0, 3);
    
    // 生成显示文本
    const countdownText = nearestFestivals
        .map(festival => `${festival.name}还有${festival.days}天`)
        .join(' | ');
    
    countdownElem.textContent = countdownText;
}

// 时钟功能
function initClock() {
    function updateClock() {
        const now = new Date();
        const timeElem = document.querySelector('.time');
        const dateElem = document.querySelector('.date');
        const lunarElem = document.querySelector('.lunar-date');
        const progressElem = document.querySelector('.year-progress');
        
        // 更新时间
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeElem.textContent = `${hours}:${minutes}`;
        
        // 更新日期
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const weekday = weekdays[now.getDay()];
        dateElem.textContent = `${month}月${date}日 ${weekday}`;

        // 更新农历
        const lunar = new Lunar(now);
        lunarElem.textContent = lunar.toString();

        // 更新节日倒计时
        updateFestivalCountdowns();

        // 更新年度进度
        const yearProgress = getYearProgress();
        progressElem.textContent = `${now.getFullYear()}年已过 ${yearProgress}%`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

// 网络测速功能
function initPingTest() {
    const bookmarkItems = document.querySelectorAll('.bookmark-item');
    
    bookmarkItems.forEach(item => {
        const url = item.dataset.url;
        if (url) {
            measurePing(url, item);
        }
    });
}

function measurePing(url, item) {
    // 先移除已存在的延时指示器
    const existingIndicator = item.querySelector('.ping-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }

    // 创建新的延时指示器
    const indicator = document.createElement('div');
    indicator.className = 'ping-indicator ping-updating';
    indicator.textContent = '测速中';
    item.appendChild(indicator);

    const startTime = performance.now();

    // 首先尝试HEAD请求
    fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors'
    })
    .then(() => {
        const endTime = performance.now();
        const pingTime = Math.round(endTime - startTime);
        updatePingStatus(indicator, pingTime);
    })
    .catch(() => {
        // 如果HEAD请求失败，尝试GET请求
        fetch(url, { 
            mode: 'no-cors' 
        })
        .then(() => {
            const endTime = performance.now();
            const pingTime = Math.round(endTime - startTime);
            updatePingStatus(indicator, pingTime);
        })
        .catch(() => {
            indicator.className = 'ping-indicator ping-slow';
            indicator.textContent = '超时';
        });
    });
}

function updatePingStatus(indicator, pingTime) {
    indicator.textContent = pingTime + 'ms';
    indicator.classList.remove('ping-updating');
    
    if (pingTime < 500) {
        indicator.classList.add('ping-fast');
    } else if (pingTime < 1000) {
        indicator.classList.add('ping-medium');
    } else {
        indicator.classList.add('ping-slow');
    }
}

// 更新搜索框占位文字
function updateSearchPlaceholder() {
    const searchInput = document.getElementById('searchInput');
    searchInput.placeholder = `请输入内容，使用${searchEngines[currentEngine].name}搜索...`;
}

// 搜索功能
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const engineOptions = document.querySelectorAll('.engine-option');
    const suggestionBox = document.getElementById('suggestionBox');
    let suggestionTimeout;
    let currentSuggestionIndex = -1;
    let suggestions = [];

    // 设置默认搜索引擎
    engineOptions[0].classList.add('active');
    currentEngine = 'baidu'; // 设置默认搜索引擎
    updateSearchPlaceholder(); // 初始化占位文字

    // 自动聚焦搜索框
    searchInput.focus();

    // 搜索引擎切换
    engineOptions.forEach(option => {
        option.addEventListener('click', () => {
            engineOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            currentEngine = option.dataset.engine;
            updateSearchPlaceholder(); // 更新占位文字
            searchInput.focus(); // 切换搜索引擎后重新聚焦
        });
    });

    // 搜索联想词
    searchInput.addEventListener('input', () => {
        clearTimeout(suggestionTimeout);
        const query = searchInput.value.trim();
        currentSuggestionIndex = -1;
        
        if (query.length > 0) {
            suggestionTimeout = setTimeout(() => {
                fetchSuggestions(query);
            }, 300);
        } else {
            suggestionBox.innerHTML = '';
            suggestionBox.classList.remove('active');
            suggestions = [];
        }
    });

    // 键盘上下键选择
    searchInput.addEventListener('keydown', (e) => {
        if (!suggestionBox.classList.contains('active')) return;
        
        const items = suggestionBox.querySelectorAll('.suggestion-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentSuggestionIndex = (currentSuggestionIndex + 1) % items.length;
            updateSelectedSuggestion(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentSuggestionIndex = (currentSuggestionIndex - 1 + items.length) % items.length;
            updateSelectedSuggestion(items);
        } else if (e.key === 'Enter' && currentSuggestionIndex !== -1) {
            e.preventDefault();
            const selectedItem = items[currentSuggestionIndex];
            if (selectedItem) {
                searchInput.value = selectedItem.textContent;
                suggestionBox.classList.remove('active');
                performSearch();
            }
        }
    });

    function updateSelectedSuggestion(items) {
        items.forEach((item, index) => {
            if (index === currentSuggestionIndex) {
                item.classList.add('selected');
                searchInput.value = item.textContent;
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // 处理建议词点击
    suggestionBox.addEventListener('click', (e) => {
        const item = e.target.closest('.suggestion-item');
        if (item) {
            searchInput.value = item.textContent;
            suggestionBox.classList.remove('active');
            performSearch();
        }
    });

    // 关闭建议框
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-input-wrapper')) {
            suggestionBox.classList.remove('active');
        }
    });

    async function fetchSuggestions(query) {
        try {
            const script = document.createElement('script');
            const callbackName = 'jsonp_' + Date.now();
            
            window[callbackName] = function(data) {
                if (data.s && data.s.length > 0) {
                    suggestions = data.s;
                    suggestionBox.innerHTML = suggestions
                        .map(item => `<div class="suggestion-item">${item}</div>`)
                        .join('');
                    suggestionBox.classList.add('active');
                } else {
                    suggestionBox.innerHTML = '';
                    suggestionBox.classList.remove('active');
                    suggestions = [];
                }
                delete window[callbackName];
                document.body.removeChild(script);
            };
            
            script.src = `https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&cb=${callbackName}`;
            document.body.appendChild(script);
        } catch (error) {
            console.error('获取搜索建议失败:', error);
        }
    }

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            const searchUrl = searchEngines[currentEngine].url + encodeURIComponent(query);
            window.location.href = searchUrl;
        }
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && currentSuggestionIndex === -1) {
            performSearch();
        }
    });
}

// 天气功能
function initWeather() {
    const WEATHER_API_KEY = 'a2aa5892214140fb82303f5da47caa3c'; // 需要替换为实际的API密钥
    const weatherInfo = document.querySelector('.weather-info');
    
    // 检查本地存储中是否有位置信息
    const savedLocation = localStorage.getItem('weatherLocation');
    const locationTimestamp = localStorage.getItem('weatherLocationTimestamp');
    const now = Date.now();
    
    if (savedLocation && locationTimestamp && (now - parseInt(locationTimestamp)) < 24 * 60 * 60 * 1000) {
        const location = JSON.parse(savedLocation);
        updateWeatherInfo(location.longitude, location.latitude);
    } else {
        requestLocation();
    }

    function requestLocation() {
        if (!navigator.geolocation) {
            showWeatherError('您的浏览器不支持地理位置功能');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { longitude, latitude } = position.coords;
                localStorage.setItem('weatherLocation', JSON.stringify({ longitude, latitude }));
                localStorage.setItem('weatherLocationTimestamp', Date.now().toString());
                updateWeatherInfo(longitude, latitude);
            },
            (error) => {
                showWeatherError('无法获取位置信息');
            }
        );
    }

    async function updateWeatherInfo(longitude, latitude) {
        try {
            const response = await fetch(`https://devapi.qweather.com/v7/weather/now?location=${longitude},${latitude}&key=${WEATHER_API_KEY}`);
            const data = await response.json();

            if (data.code === '200') {
                const tempSpan = weatherInfo.querySelector('.weather-temperature');
                const locationSpan = weatherInfo.querySelector('.weather-location');
                const detailsSpan = weatherInfo.querySelector('.weather-details');
                
                tempSpan.textContent = `${data.now.temp}°`;
                locationSpan.textContent = data.now.text;
                detailsSpan.textContent = `湿度${data.now.humidity}% ${data.now.windDir}${data.now.windScale}级`;
            } else {
                showWeatherError('获取天气信息失败');
            }
        } catch (error) {
            showWeatherError('获取天气信息失败');
        }
    }

    function showWeatherError(message) {
        const tempSpan = weatherInfo.querySelector('.weather-temperature');
        const locationSpan = weatherInfo.querySelector('.weather-location');
        const detailsSpan = weatherInfo.querySelector('.weather-details');
        
        tempSpan.textContent = '--°';
        locationSpan.textContent = message;
        detailsSpan.textContent = '';
    }

    // 每30分钟更新一次天气
    setInterval(() => {
        const location = JSON.parse(localStorage.getItem('weatherLocation'));
        if (location) {
            updateWeatherInfo(location.longitude, location.latitude);
        }
    }, 30 * 60 * 1000);
}

// 书签功能
function initBookmarks() {
    loadBookmarks();
}

function loadBookmarks() {
    const bookmarksGrid = document.querySelector('.bookmarks-grid');
    bookmarksGrid.innerHTML = '';

    bookmarkConfig.bookmarks.forEach((bookmark, index) => {
        // 从 URL 中提取域名
        const domain = bookmark.url.replace(/^(https?:\/\/)/, '').split('/')[0];
        
        const bookmarkItem = document.createElement('div');
        bookmarkItem.className = 'bookmark-item';
        bookmarkItem.dataset.url = bookmark.url;  // 添加 URL 数据属性
        bookmarkItem.innerHTML = `
            <img src="https://www.google.com/s2/favicons?domain=${domain}&sz=64" class="bookmark-icon" alt="${bookmark.title} icon" 
                 onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🌐</text></svg>';">
            <span class="bookmark-title">${bookmark.title}</span>
        `;

        bookmarkItem.addEventListener('click', () => {
            window.open(bookmark.url, '_blank');
        });

        bookmarksGrid.appendChild(bookmarkItem);

        // 添加延迟以避免同时发送太多请求
        setTimeout(() => {
            initPingTest();
        }, Math.random() * 2000); // 随机延迟 0-2 秒
    });
}

// 更新工作状态
function updateWorkStatus() {
    const now = new Date();
    const workStart = new Date(now);
    const workEnd = new Date(now);
    const lunchStart = new Date(now);
    const lunchEnd = new Date(now);
    
    workStart.setHours(8, 0, 0, 0);
    workEnd.setHours(17, 0, 0, 0);
    lunchStart.setHours(11, 30, 0, 0);
    lunchEnd.setHours(13, 0, 0, 0);

    const workStatus = document.querySelector('.work-status');
    const workSchedule = document.querySelector('.work-schedule');
    const statusText = document.querySelector('.status-text');
    const progressBar = document.querySelector('.progress');

    // 判断是否是工作日（周一到周五）
    const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;

    let status = '';
    let progress = 0;
    let timeLeft = '';

    if (!isWeekday) {
        // 周末
        status = 'resting';
        workSchedule.textContent = '休息时间';
        const nextWorkDay = new Date(now);
        nextWorkDay.setDate(now.getDate() + (8 - now.getDay()) % 7);
        nextWorkDay.setHours(8, 0, 0, 0);
        const hoursToWork = Math.floor((nextWorkDay - now) / (1000 * 60 * 60));
        const minutesToWork = Math.floor(((nextWorkDay - now) % (1000 * 60 * 60)) / (1000 * 60));
        timeLeft = `<span>距离上班</span>\n${hoursToWork}小时${minutesToWork}分钟`;
        progress = 0;
    } else if (now < workStart) {
        // 上班前
        status = 'resting';
        workSchedule.textContent = '休息时间';
        const minutesToWork = Math.round((workStart - now) / (1000 * 60));
        timeLeft = `<span>距离上班</span>\n${Math.floor(minutesToWork / 60)}小时${minutesToWork % 60}分钟`;
        progress = 0;
    } else if (now >= lunchStart && now < lunchEnd) {
        // 午休时间
        status = 'lunch-break';
        workSchedule.textContent = '午休时间';
        const minutesToEnd = Math.round((lunchEnd - now) / (1000 * 60));
        timeLeft = `<span>距离下午上班</span>\n${Math.floor(minutesToEnd / 60)}小时${minutesToEnd % 60}分钟`;
        progress = ((now - lunchStart) / (lunchEnd - lunchStart)) * 100;
    } else if (now >= workStart && now < workEnd) {
        // 工作时间
        status = 'working';
        workSchedule.textContent = '工作时间';
        if (now < lunchStart) {
            // 上午工作时间
            const totalMorningMinutes = (lunchStart - workStart) / (1000 * 60);
            const currentMorningMinutes = (now - workStart) / (1000 * 60);
            progress = (currentMorningMinutes / totalMorningMinutes) * 100;
        } else {
            // 下午工作时间
            const totalAfternoonMinutes = (workEnd - lunchEnd) / (1000 * 60);
            const currentAfternoonMinutes = (now - lunchEnd) / (1000 * 60);
            progress = (currentAfternoonMinutes / totalAfternoonMinutes) * 100;
        }
        const minutesToRest = Math.round((workEnd - now) / (1000 * 60));
        timeLeft = `<span>距离下班</span>\n${Math.floor(minutesToRest / 60)}小时${minutesToRest % 60}分钟`;
    } else {
        // 下班后
        status = 'resting';
        workSchedule.textContent = '休息时间';
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0);
        const hoursToWork = Math.floor((tomorrow - now) / (1000 * 60 * 60));
        const minutesToWork = Math.floor(((tomorrow - now) % (1000 * 60 * 60)) / (1000 * 60));
        timeLeft = `<span>距离上班</span>\n${hoursToWork}小时${minutesToWork}分钟`;
        progress = 100;
    }

    // 更新状态样式
    workStatus.className = `work-status ${status}`;
    progressBar.style.width = `${progress}%`;
    statusText.innerHTML = timeLeft;
}

// 每分钟更新一次工作状态
setInterval(updateWorkStatus, 60000);
updateWorkStatus(); // 初始更新 