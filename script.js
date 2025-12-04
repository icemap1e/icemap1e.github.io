// 时间更新功能
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');

    // 更新时间
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;

    // 更新日期
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekDay = weekDays[now.getDay()];

    dateElement.textContent = `${year}年${month}月${day}日 ${weekDay}`;

    // 每分钟更新倒计时
    if (seconds === '00') {
        updateCountdown(now, getCurrentTimeSlot(now));
    }
}

// 获取当前时间段 - 与updateGreeting保持一致
function getCurrentTimeSlot(now) {
    const hour = now.getHours();
    const minute = now.getMinutes();
    const totalMinutes = hour * 60 + minute;
    const dayOfWeek = now.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // 工作日
        // 8:00 = 480分钟, 11:20 = 680分钟, 13:30 = 810分钟, 17:00 = 1020分钟
        if (totalMinutes >= 420 && totalMinutes < 480) {
            return 'prework';         // 7:00-7:59 准备上班
        } else if (totalMinutes >= 480 && totalMinutes < 680) {
            return 'work';            // 8:00-11:20 上午工作
        } else if (totalMinutes >= 680 && totalMinutes < 720) {
            return 'prelunch';       // 11:20-11:59 准备午休
        } else if (totalMinutes >= 720 && totalMinutes < 810) {
            return 'lunch';           // 12:00-13:30 午休时间
        } else if (totalMinutes >= 810 && totalMinutes < 1020) {
            return 'afternoon';       // 13:30-17:00 下午工作
        } else if (totalMinutes >= 1020 && totalMinutes < 1140) {
            return 'afterwork';       // 17:00-18:59 下班时间
        } else if (totalMinutes >= 1140 && totalMinutes < 1320) {
            return 'evening';         // 19:00-21:59 晚上
        } else if (totalMinutes >= 1320 || totalMinutes < 360) {
            return 'night';           // 22:00-5:59 深夜
        } else {
            return 'morning';         // 6:00-6:59 清晨
        }
    } else { // 周末
        if (hour >= 6 && hour < 10) {
            return 'morning';
        } else if (hour >= 10 && hour < 12) {
            return 'late_morning';
        } else if (hour >= 12 && hour < 14) {
            return 'lunch';
        } else if (hour >= 14 && hour < 17) {
            return 'afternoon';
        } else if (hour >= 17 && hour < 19) {
            return 'evening';
        } else if (hour >= 19 && hour < 22) {
            return 'late_evening';
        } else {
            return 'night';
        }
    }
}

// 问候语内容库
const greetingData = {
    // 工作日时间段
    prework: {
        greetings: ['准备上班', '该出门了', '新的一天', '加油'],
        quotes: [
            '整理心情，准备迎接新挑战',
            '路上注意安全，准时到达',
            '一杯咖啡，唤醒活力',
            '美好的工作日开始啦',
            '精神饱满地投入工作',
            '为梦想而努力',
            '今天也要出色完成任务',
            '祝你工作顺利'
        ],
        poems: [
            '一日之计在于晨',
            '业精于勤荒于嬉',
            '千里之行，始于足下'
        ]
    },
    work: {
        greetings: ['工作顺利', '加油工作', '专注当下', '奋斗中'],
        quotes: [
            '保持专注，效率更高',
            '每一个任务都很重要',
            '你的努力不会白费',
            '今天的目标，今天完成',
            '工作是为了更好的生活',
            '专注是最好的状态',
            '做最好的自己',
            '继续努力，胜利在望'
        ],
        poems: [
            '博学之，审问之，慎思之，明辨之',
            '路漫漫其修远兮，吾将上下而求索',
            '纸上得来终觉浅，绝知此事要躬行'
        ]
    },
    prelunch: {
        greetings: ['准备午休', '上午辛苦了', '快下班了', '坚持一下'],
        quotes: [
            '上午的工作告一段落',
            '做好收尾工作，准备休息',
            '回顾上午的成果',
            '午餐时间快到了',
            '为下午的工作做准备',
            '上午的努力值得肯定',
            '休息是为了更好的工作',
            '马上就到午休时间了'
        ],
        poems: [
            '半亩方塘一鉴开，天光云影共徘徊',
            '山重水复疑无路，柳暗花明又一村',
            '千淘万漉虽辛苦，吹尽狂沙始到金'
        ]
    },
    lunch: {
        greetings: ['午休时间', '好好休息', '午餐愉快', '放松一下'],
        quotes: [
            '午餐时间到，好好吃饭',
            '享受午后的宁静时光',
            '休息是为了更好的工作',
            '放下工作，享受美食',
            '给身心一个放松的机会',
            '午休片刻，精神百倍',
            '美食可以治愈一切',
            '愿你的午餐很美味'
        ],
        poems: [
            '锄禾日当午，汗滴禾下土',
            '谁知盘中餐，粒粒皆辛苦',
            '一粥一饭，当思来处不易'
        ]
    },
    afternoon: {
        greetings: ['下午好', '继续加油', '下午工作', '奋斗中'],
        quotes: [
            '午休结束，重新出发',
            '精神饱满地投入下午',
            '下午的工作同样重要',
            '为晚上的工作做铺垫',
            '保持上午的状态',
            '每一分钟都很有价值',
            '下午的努力决定一天的收获',
            '继续加油，目标在望'
        ],
        poems: [
            '老骥伏枥，志在千里',
            '烈士暮年，壮心不已',
            '长风破浪会有时，直挂云帆济沧海'
        ]
    },
    afterwork: {
        greetings: ['下班快乐', '辛苦了', '今天辛苦', '回家路上'],
        quotes: [
            '今天的工作辛苦了',
            '整理工作，准备回家',
            '回顾今天的收获',
            '为今天的努力点赞',
            '工作是为了更好的生活',
            '下班啦，好好休息',
            '路上的风景很美',
            '愿你平安到家'
        ],
        poems: [
            '采菊东篱下，悠然见南山',
            '少无适俗韵，性本爱丘山',
            '结庐在人境，而无车马喧'
        ]
    },

    // 休息日时间段
    late_morning: {
        greetings: ['美好周末', '周末愉快', '悠闲时光', '享受当下'],
        quotes: [
            '周末的时光最珍贵',
            '享受这宁静的上午',
            '放下工作，拥抱生活',
            '周末是给自己的奖励',
            '愿你的周末充满阳光',
            '享受慢节奏的生活',
            '美好的一天从现在开始',
            '周末愉快'
        ],
        poems: [
            '春有百花秋有月，夏有凉风冬有雪',
            '若无闲事挂心头，便是人间好时节'
        ]
    },
    dinner: {
        greetings: ['晚餐时间', '晚餐愉快', '好好吃饭', '享受晚餐'],
        quotes: [
            '晚餐时间到了',
            '享受美食，犒劳自己',
            '与家人共享晚餐时光',
            '晚餐要吃好，身体才健康',
            '放下一天的忙碌',
            '美食可以治愈疲惫',
            '愿你的晚餐很丰盛',
            '晚餐愉快'
        ],
        poems: [
            '绿蚁新醅酒，红泥小火炉',
            '晚来天欲雪，能饮一杯无'
        ]
    },

    // 通用时间段
    morning: {
        greetings: ['早上好', '早安', '清晨好', '新的一天'],
        quotes: [
            '开启美好的一天',
            '愿你拥有充实的一天',
            '早起的鸟儿有虫吃',
            '新的开始，新的希望',
            '阳光正好，微风不燥',
            '一日之计在于晨',
            '愿你被世界温柔以待'
        ],
        poems: [
            '一年之计在于春，一日之计在于晨',
            '少壮不努力，老大徒伤悲'
        ]
    },
    evening: {
        greetings: ['晚上好', '傍晚好', '晚上好'],
        quotes: [
            '享受宁静的夜晚',
            '愿你有个好梦',
            '星空下的思考最深刻',
            '夜晚是最好的沉淀时间',
            '静心思考，明天更好',
            '晚安，世界'
        ],
        poems: [
            '海上生明月，天涯共此时',
            '床前明月光，疑是地上霜'
        ]
    },
    night: {
        greetings: ['晚安', '夜深了', '休息时间', '早点休息'],
        quotes: [
            '夜深了，注意休息',
            '身体是革命的本钱',
            '早睡早起，身心健康',
            '今晚好梦',
            '星星在为你守护',
            '夜晚的宁静最治愈',
            '休息是为了更好的明天'
        ],
        poems: [
            '春眠不觉晓，处处闻啼鸟',
            '夜来风雨声，花落知多少'
        ]
    }
};

// 更新问候语
function updateGreeting(now) {
    const hour = now.getHours();
    const dayOfWeek = now.getDay(); // 0=周日, 1=周一, ..., 6=周六
    const greetingText = document.getElementById('greeting-text');
    const greetingSubtitle = document.getElementById('greeting-subtitle');

    let timeSlot;

    // 根据工作日和休息日调整时间段
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

    if (isWeekday) {
        // 工作日时间表 - 根据用户工作时间精确调整
        const minute = now.getMinutes();
        const totalMinutes = hour * 60 + minute;

        // 8:00 = 480分钟, 11:20 = 680分钟, 13:30 = 810分钟, 17:00 = 1020分钟
        if (totalMinutes >= 420 && totalMinutes < 480) {
            timeSlot = 'prework';         // 7:00-7:59 准备上班
        } else if (totalMinutes >= 480 && totalMinutes < 680) {
            timeSlot = 'work';            // 8:00-11:20 上午工作
        } else if (totalMinutes >= 680 && totalMinutes < 720) {
            timeSlot = 'prelunch';       // 11:20-11:59 准备午休
        } else if (totalMinutes >= 720 && totalMinutes < 810) {
            timeSlot = 'lunch';           // 12:00-13:30 午休时间
        } else if (totalMinutes >= 810 && totalMinutes < 1020) {
            timeSlot = 'afternoon';       // 13:30-17:00 下午工作
        } else if (totalMinutes >= 1020 && totalMinutes < 1140) {
            timeSlot = 'afterwork';       // 17:00-18:59 下班时间
        } else if (totalMinutes >= 1140 && totalMinutes < 1320) {
            timeSlot = 'evening';         // 19:00-21:59 晚上
        } else if (totalMinutes >= 1320 || totalMinutes < 360) {
            timeSlot = 'night';           // 22:00-5:59 深夜
        } else {
            timeSlot = 'morning';         // 6:00-6:59 清晨
        }
    } else {
        // 休息日时间表
        if (hour >= 6 && hour < 10) {
            timeSlot = 'morning';
        } else if (hour >= 10 && hour < 12) {
            timeSlot = 'late_morning';
        } else if (hour >= 12 && hour < 14) {
            timeSlot = 'lunch';
        } else if (hour >= 14 && hour < 17) {
            timeSlot = 'afternoon';
        } else if (hour >= 17 && hour < 19) {
            timeSlot = 'evening';
        } else if (hour >= 19 && hour < 22) {
            timeSlot = 'dinner';
        } else {
            timeSlot = 'night';
        }
    }

    const data = greetingData[timeSlot];

    // 设置主问候语
    const greeting = data.greetings[Math.floor(Math.random() * data.greetings.length)];
    greetingText.textContent = greeting + '！';

    // 根据日期决定显示名言还是诗词
    const dayOfMonth = now.getDate();
    let subtitle;

    if (dayOfMonth % 3 === 0) {
        // 每3天显示诗词
        const randomPoem = data.poems[Math.floor(Math.random() * data.poems.length)];
        subtitle = randomPoem;
    } else {
        // 其他时候显示励志名言
        const randomQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
        subtitle = randomQuote;
    }

    greetingSubtitle.textContent = subtitle;

    // 更新倒计时
    updateCountdown(now, timeSlot);
}

// 更新倒计时
function updateCountdown(now, timeSlot) {
    const countdownElement = document.getElementById('countdown-text');
    if (!countdownElement) return;

    const currentTime = now.getHours() * 60 + now.getMinutes();
    const dayOfWeek = now.getDay();

    let targetTime, targetEvent;

    // 根据是否工作日和时间段设置倒计时目标
    const isWorkday = dayOfWeek >= 1 && dayOfWeek <= 5;

    if (isWorkday) {
        // 工作日倒计时 - 根据用户实际工作时间
        switch (timeSlot) {
            case 'prework':
            case 'morning':
                targetTime = 8 * 60; // 8:00 上班
                targetEvent = '上班';
                break;
            case 'work':
                targetTime = 11 * 60 + 20; // 11:20 午休开始
                targetEvent = '午休';
                break;
            case 'prelunch':
                targetTime = 11 * 60 + 20; // 11:20 午休开始
                targetEvent = '午休';
                break;
            case 'lunch':
                targetTime = 13 * 60 + 30; // 13:30 下午上班
                targetEvent = '下午上班';
                break;
            case 'afternoon':
                targetTime = 17 * 60; // 17:00 下班
                targetEvent = '下班';
                break;
            case 'afterwork':
            case 'evening':
            case 'night':
                // 设置到明天上班
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                targetTime = 8 * 60; // 明天8:00
                targetEvent = '明天上班';
                break;
            default:
                targetTime = 17 * 60;
                targetEvent = '下班';
        }
    } else {
        // 周末倒计时
        switch (timeSlot) {
            case 'prework':
            case 'morning':
                targetTime = 12 * 60;
                targetEvent = '午餐时间';
                break;
            case 'noon':
                targetTime = 18 * 60;
                targetEvent = '晚餐时间';
                break;
            case 'afternoon':
            case 'evening':
                targetTime = 22 * 60;
                targetEvent = '休息时间';
                break;
            case 'night':
                // 设置到明天早上
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                targetTime = 8 * 60;
                targetEvent = '明天早上';
                break;
            default:
                targetTime = 12 * 60;
                targetEvent = '午餐时间';
        }
    }

    // 计算剩余时间
    let remainingMinutes;
    if (targetEvent.includes('明天')) {
        // 跨天的计算
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(Math.floor(targetTime / 60), targetTime % 60, 0, 0);
        remainingMinutes = Math.floor((tomorrow - now) / (1000 * 60));
    } else {
        // 当天的计算
        remainingMinutes = targetTime - currentTime;
        if (remainingMinutes < 0) {
            remainingMinutes += 24 * 60; // 加一天
        }
    }

    // 格式化倒计时显示
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    let countdownText;

    if (hours > 0) {
        countdownText = `距离${targetEvent}还有 ${hours}小时${minutes}分钟`;
    } else {
        countdownText = `距离${targetEvent}还有 ${minutes}分钟`;
    }

    // 如果少于30分钟，添加紧急样式
    if (remainingMinutes < 30) {
        countdownElement.className = 'countdown-urgent';
    } else {
        countdownElement.className = '';
    }

    countdownElement.textContent = countdownText;
}

// 天气功能（使用和风天气API）
async function getWeather(city = '北京') {
    const apiKey = '30cc8c4f0a6e4d79b4bbdecb03300253';

    // 首先获取城市的位置ID
    try {
        const locationResponse = await fetch(`https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(city)}&key=${apiKey}`);
        const locationData = await locationResponse.json();

        if (locationData.code !== '200' || !locationData.location || locationData.location.length === 0) {
            throw new Error('未找到城市信息');
        }

        const locationId = locationData.location[0].id;

        // 并发获取多个天气数据
        const [weatherResponse, airQualityResponse] = await Promise.all([
            fetch(`https://devapi.qweather.com/v7/weather/now?location=${locationId}&key=${apiKey}`),
            fetch(`https://devapi.qweather.com/v7/air/now?location=${locationId}&key=${apiKey}`)
        ]);

        const weatherData = await weatherResponse.json();
        const airQualityData = await airQualityResponse.json();

        if (weatherData.code !== '200') {
            throw new Error('天气数据获取失败');
        }

        // 解析风向
        const windDirection = getWindDirection(weatherData.now.windDir);
        const windScale = weatherData.now.windScale || '1';

        updateWeatherDisplay({
            temperature: parseInt(weatherData.now.temp),
            location: city,
            description: weatherData.now.text,
            feelsLike: parseInt(weatherData.now.feelsLike),
            humidity: parseInt(weatherData.now.humidity),
            windDirection: windDirection,
            windScale: windScale,
            aqi: airQualityData.code === '200' ? parseInt(airQualityData.now.aqi) : null,
            icon: getWeatherIcon(weatherData.now.icon)
        });

    } catch (error) {
        console.error('获取天气失败:', error);
        // 使用默认天气数据
        const defaultWeather = {
            temperature: 25,
            location: city,
            description: '晴朗',
            feelsLike: 26,
            humidity: 65,
            windDirection: '东南风',
            windScale: '3',
            aqi: null,
            icon: 'fa-cloud-sun'
        };
        updateWeatherDisplay(defaultWeather);
    }
}


// 更新天气显示
function updateWeatherDisplay(data) {
    document.getElementById('temperature').textContent = `${data.temperature}°C`;
    document.getElementById('location').textContent = data.location;
    document.getElementById('weather-desc').textContent = data.description;
    document.getElementById('feels-like').textContent = `体感 ${data.feelsLike}°C`;
    document.getElementById('humidity').textContent = `湿度 ${data.humidity}%`;
    document.getElementById('wind').textContent = `${data.windDirection} ${data.windScale}级`;
    document.querySelector('#weather-info i').className = `fas ${data.icon}`;

    // 处理空气质量显示
    const aqiContainer = document.getElementById('aqi-container');
    const aqiElement = document.getElementById('aqi');

    if (data.aqi !== null) {
        aqiElement.textContent = `AQI ${data.aqi}`;
        aqiContainer.style.display = 'inline';

        // 根据AQI值设置颜色
        if (data.aqi <= 50) {
            aqiElement.style.color = '#4CAF50'; // 优 - 绿色
        } else if (data.aqi <= 100) {
            aqiElement.style.color = '#FFC107'; // 良 - 黄色
        } else if (data.aqi <= 150) {
            aqiElement.style.color = '#FF9800'; // 轻度污染 - 橙色
        } else if (data.aqi <= 200) {
            aqiElement.style.color = '#F44336'; // 中度污染 - 红色
        } else {
            aqiElement.style.color = '#9C27B0'; // 重度及以上 - 紫色
        }
    } else {
        aqiContainer.style.display = 'none';
    }
}

// 根据和风天气图标代码返回FontAwesome图标
function getWeatherIcon(weatherCode) {
    const iconMap = {
        // 晴
        '100': 'fa-sun',
        // 多云
        '101': 'fa-cloud-sun',
        '102': 'fa-cloud-sun',
        '103': 'fa-cloud',
        // 阴
        '104': 'fa-cloud',
        // 小雨
        '300': 'fa-cloud-rain',
        '301': 'fa-cloud-rain',
        // 中雨
        '305': 'fa-cloud-showers-heavy',
        '306': 'fa-cloud-showers-heavy',
        '307': 'fa-cloud-showers-heavy',
        '308': 'fa-cloud-showers-heavy',
        '309': 'fa-cloud-showers-heavy',
        '310': 'fa-cloud-showers-heavy',
        '311': 'fa-cloud-showers-heavy',
        '312': 'fa-cloud-showers-heavy',
        '313': 'fa-cloud-showers-heavy',
        // 雷阵雨
        '404': 'fa-bolt',
        '405': 'fa-bolt',
        '406': 'fa-bolt',
        '407': 'fa-bolt',
        '408': 'fa-bolt',
        '409': 'fa-bolt',
        '410': 'fa-bolt',
        // 雪
        '399': 'fa-snowflake',
        '400': 'fa-snowflake',
        '401': 'fa-snowflake',
        '402': 'fa-snowflake',
        '403': 'fa-snowflake',
        // 雾
        '501': 'fa-smog',
        '502': 'fa-smog',
        '503': 'fa-smog',
        '504': 'fa-smog',
        '507': 'fa-smog',
        '508': 'fa-smog',
        '509': 'fa-smog',
        '510': 'fa-smog',
        '511': 'fa-smog',
        '512': 'fa-smog',
        '513': 'fa-smog'
    };
    return iconMap[weatherCode] || 'fa-cloud-sun';
}

// 根据风向角度转换方向文字
function getWindDirection(windDir) {
    const directionMap = {
        'N': '北风',
        'NE': '东北风',
        'E': '东风',
        'SE': '东南风',
        'S': '南风',
        'SW': '西南风',
        'W': '西风',
        'NW': '西北风'
    };

    // 如果是角度，转换为方向
    if (typeof windDir === 'number' || !isNaN(parseInt(windDir))) {
        const degrees = parseInt(windDir);
        if (degrees >= 337.5 || degrees < 22.5) return '北风';
        if (degrees >= 22.5 && degrees < 67.5) return '东北风';
        if (degrees >= 67.5 && degrees < 112.5) return '东风';
        if (degrees >= 112.5 && degrees < 157.5) return '东南风';
        if (degrees >= 157.5 && degrees < 202.5) return '南风';
        if (degrees >= 202.5 && degrees < 247.5) return '西南风';
        if (degrees >= 247.5 && degrees < 292.5) return '西风';
        if (degrees >= 292.5 && degrees < 337.5) return '西北风';
    }

    // 如果已经是方向文字
    return directionMap[windDir] || windDir;
}

// 搜索引擎配置
const searchEngines = {
    google: 'https://www.google.com/search?q=',
    baidu: 'https://www.baidu.com/s?wd=',
    bing: 'https://www.bing.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    ai: 'ai-search'
};

// 搜索功能
let currentEngine = 'google'; // 当前选中的搜索引擎

// 搜索占位符配置
const searchPlaceholders = {
    google: 'Google 搜索或输入网址...',
    baidu: '百度一下，你就知道...',
    bing: '必应搜索，发现更多...',
    duckduckgo: 'DuckDuckGo - 注重隐私的搜索...',
    ai: '问我任何问题，AI智能回答...'
};

// 更新搜索框占位符
function updateSearchPlaceholder(engine) {
    const searchInput = document.getElementById('search-input');
    searchInput.placeholder = searchPlaceholders[engine] || '搜索网页...';
}

// 搜索引擎切换功能
function setupSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const engineBtns = document.querySelectorAll('.engine-btn');

    // 初始化默认占位符
    updateSearchPlaceholder(currentEngine);

    // 搜索引擎按钮点击事件
    engineBtns.forEach(btn => {
        // 添加鼠标悬停效果
        btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('active')) {
                btn.style.background = 'var(--bg-primary)';
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('active')) {
                btn.style.background = 'transparent';
            }
        });

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 移除所有激活状态
            engineBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'transparent';
            });
            // 添加当前激活状态
            btn.classList.add('active');
            btn.style.background = 'var(--google-blue)';

            // 更新当前引擎
            currentEngine = btn.dataset.engine;

            // 更新搜索框占位符
            updateSearchPlaceholder(currentEngine);

            // 聚焦搜索框
            searchInput.focus();
        });

        // 添加键盘支持
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });

        // 确保按钮可以通过 Tab 键聚焦
        btn.setAttribute('tabindex', '0');
    });

    // 搜索表单提交
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const query = searchInput.value.trim();
        if (!query) return;

        if (currentEngine === 'ai') {
            // 打开AI助手面板并处理查询
            openAIModal();
            // 清空搜索框
            searchInput.value = '';
            setTimeout(() => {
                sendAIMessage(query);
            }, 300); // 等待动画完成后发送
        } else {
            // 普通搜索引擎
            const searchUrl = searchEngines[currentEngine] + encodeURIComponent(query);
            window.open(searchUrl, '_blank');
            // 清空搜索框并保持焦点
            searchInput.value = '';
            searchInput.focus();
        }
    });

    // 监听输入框的回车键（确保在所有情况下都能工作）
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchForm.dispatchEvent(new Event('submit'));
        }
    });
}

// 书签功能
function setupBookmarks() {
    const bookmarkCards = document.querySelectorAll('.bookmark-card');

    bookmarkCards.forEach(card => {
        card.addEventListener('click', () => {
            const url = card.dataset.url;
            window.open(url, '_blank');
        });
    });
}

// 设置面板功能
// 设置弹窗功能
function setupSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const settingsClose = document.getElementById('settings-close');
    const settingsBackdrop = document.getElementById('settings-backdrop');
    const cancelSettings = document.getElementById('cancel-settings');
    const saveSettings = document.getElementById('save-settings');

    // 打开设置弹窗
    settingsBtn.addEventListener('click', () => {
        openSettingsModal();
    });

    // 多种关闭方式
    settingsClose.addEventListener('click', () => {
        closeSettingsModal();
    });

    settingsBackdrop.addEventListener('click', () => {
        closeSettingsModal();
    });

    cancelSettings.addEventListener('click', () => {
        closeSettingsModal();
    });

    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsModal.classList.contains('open')) {
            closeSettingsModal();
        }
    });

    // 保存设置
    saveSettings.addEventListener('click', () => {
        saveAllSettings();
        closeSettingsModal();
    });

    // 城市设置
    const cityInput = document.getElementById('city-input');
    cityInput.addEventListener('change', (e) => {
        // 实时更新天气预览
        const city = e.target.value.trim();
        if (city && city.length > 0) {
            // 可以添加天气预览功能
            console.log('城市预览:', city);
        }
    });

    // AI API密钥设置
    const aiApiKeyInput = document.getElementById('ai-api-key');
    const togglePasswordBtn = document.querySelector('.toggle-password');

    togglePasswordBtn.addEventListener('click', () => {
        const targetId = togglePasswordBtn.dataset.target;
        const targetInput = document.getElementById(targetId);

        if (targetInput.type === 'password') {
            targetInput.type = 'text';
            togglePasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            targetInput.type = 'password';
            togglePasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });

    // 书签管理功能已移除

    // 数据管理按钮
    document.getElementById('clear-settings').addEventListener('click', () => {
        if (confirm('确定要清除所有设置吗？此操作不可撤销。')) {
            clearAllSettings();
        }
    });


    document.getElementById('reset-all').addEventListener('click', () => {
        if (confirm('确定要重置所有数据吗？这将清除所有设置，此操作不可撤销。')) {
            resetAllData();
        }
    });

    // 加载已保存的设置
    loadSavedSettings();
}

// 打开设置弹窗
function openSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// 关闭设置弹窗
function closeSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.classList.remove('open');
    document.body.style.overflow = '';
}

// 保存所有设置
function saveAllSettings() {
    // 保存城市
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();
    if (city) {
        localStorage.setItem('weather-city', city);
        getWeather(city);
    }

    // 保存AI API地址
    const aiApiUrlInput = document.getElementById('ai-api-url');
    if (aiApiUrlInput) {
        const apiUrl = aiApiUrlInput.value.trim();
        if (apiUrl) {
            localStorage.setItem('ai-api-url', apiUrl);
        } else {
            localStorage.setItem('ai-api-url', 'https://api.openai.com/v1/chat/completions');
        }
    }

    // 保存AI API密钥
    const aiApiKeyInput = document.getElementById('ai-api-key');
    const apiKey = aiApiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem('ai-api-key', apiKey);
    } else {
        localStorage.removeItem('ai-api-key');
    }

    // 保存AI模型
    const aiModelSelect = document.getElementById('ai-model');
    if (aiModelSelect) {
        localStorage.setItem('ai-model', aiModelSelect.value);
    }

    // 保存主题设置
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        const theme = themeSelect.value;
        if (theme !== 'auto') {
            document.documentElement.setAttribute('data-theme', theme);
        } else {
            // 跟随系统主题
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            document.documentElement.setAttribute('data-theme', prefersDark.matches ? 'dark' : 'light');
        }
        localStorage.setItem('theme', theme);
    }

    // 保存默认搜索引擎
    const defaultEngineSelect = document.getElementById('default-search-engine');
    if (defaultEngineSelect) {
        localStorage.setItem('default-search-engine', defaultEngineSelect.value);
    }

    // 保存温度单位
    const weatherUnitRadios = document.getElementsByName('weather-unit');
    for (const radio of weatherUnitRadios) {
        if (radio.checked) {
            localStorage.setItem('weather-unit', radio.value);
            break;
        }
    }

    // 显示保存成功提示
    showToast('设置已保存', 'success');
}

// 书签管理功能已移除

// 清除所有设置
function clearAllSettings() {
    localStorage.removeItem('weather-city');
    localStorage.removeItem('ai-api-key');
    localStorage.removeItem('ai-model');
    localStorage.removeItem('theme');
    localStorage.removeItem('default-search-engine');
    localStorage.removeItem('weather-unit');
    showToast('设置已清除', 'success');
}

// 清除书签功能已移除

// 重置所有数据
function resetAllData() {
    localStorage.clear();
    showToast('所有数据已重置', 'success');
}

// 显示提示信息
function showToast(message, type = 'info') {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--google-green)' : 'var(--google-blue)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(toast);

    // 显示动画
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);

    // 自动隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 加载已保存的设置
function loadSavedSettings() {
    // 加载城市设置
    const cityInput = document.getElementById('city-input');
    const savedCity = localStorage.getItem('weather-city');
    if (savedCity && cityInput) {
        cityInput.value = savedCity;
    }

    // 加载AI API地址
    const aiApiUrlInput = document.getElementById('ai-api-url');
    const savedAiApiUrl = localStorage.getItem('ai-api-url');
    if (savedAiApiUrl && aiApiUrlInput) {
        aiApiUrlInput.value = savedAiApiUrl;
    } else if (aiApiUrlInput) {
        aiApiUrlInput.value = 'https://api.openai.com/v1/chat/completions';
    }

    // 加载AI API密钥
    const aiApiKeyInput = document.getElementById('ai-api-key');
    const savedAiApiKey = localStorage.getItem('ai-api-key');
    if (savedAiApiKey && aiApiKeyInput) {
        aiApiKeyInput.value = savedAiApiKey;
    }

    // 加载AI模型
    const aiModelSelect = document.getElementById('ai-model');
    const savedAiModel = localStorage.getItem('ai-model');
    if (savedAiModel && aiModelSelect) {
        aiModelSelect.value = savedAiModel;
    }

    // 加载主题设置
    const themeSelect = document.getElementById('theme-select');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themeSelect) {
        themeSelect.value = savedTheme;
    }

    // 加载默认搜索引擎
    const defaultEngineSelect = document.getElementById('default-search-engine');
    const savedDefaultEngine = localStorage.getItem('default-search-engine');
    if (savedDefaultEngine && defaultEngineSelect) {
        defaultEngineSelect.value = savedDefaultEngine;
    }

    // 加载温度单位
    const savedWeatherUnit = localStorage.getItem('weather-unit');
    if (savedWeatherUnit) {
        const weatherUnitRadios = document.getElementsByName('weather-unit');
        for (const radio of weatherUnitRadios) {
            if (radio.value === savedWeatherUnit) {
                radio.checked = true;
                break;
            }
        }
    }
}

// AI助手功能
let isAiProcessing = false;

function setupAI() {
    const aiBtn = document.getElementById('ai-assistant-btn');
    const aiModal = document.getElementById('ai-modal');
    const aiBackdrop = document.getElementById('ai-backdrop');
    const closeAiBtn = document.getElementById('close-ai');
    const aiInput = document.getElementById('ai-input');
    const aiSendBtn = document.getElementById('ai-send');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const searchToggle = document.getElementById('ai-search-toggle');
    const searchBar = document.getElementById('ai-search-bar');
    const searchClear = document.getElementById('search-clear');
    const searchInput = document.getElementById('conversation-search');
    const newChatBtn = document.getElementById('new-chat');
    const charCount = document.getElementById('char-count');

    // 初始化对话列表
    initializeConversations();

    // 打开AI助手面板
    aiBtn.addEventListener('click', () => {
        openAIModal();
    });

    // 关闭AI助手面板
    closeAiBtn.addEventListener('click', () => {
        closeAIModal();
    });

    // 点击背景关闭
    aiBackdrop.addEventListener('click', () => {
        closeAIModal();
    });

    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && aiModal.classList.contains('open')) {
            closeAIModal();
        }
    });

    // 侧边栏切换
    sidebarToggle.addEventListener('click', () => {
        const sidebar = document.querySelector('.ai-sidebar');
        sidebar.classList.toggle('open');
    });

    // 搜索功能
    searchToggle.addEventListener('click', () => {
        searchBar.style.display = searchBar.style.display === 'none' ? 'flex' : 'none';
        if (searchBar.style.display === 'flex') {
            searchInput.focus();
        }
    });

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchBar.style.display = 'none';
        filterConversations('');
    });

    searchInput.addEventListener('input', (e) => {
        filterConversations(e.target.value);
    });

    // 新建对话
    newChatBtn.addEventListener('click', () => {
        createNewConversation();
    });

    // 发送AI消息
    aiSendBtn.addEventListener('click', () => {
        const message = aiInput.value.trim();
        if (message) {
            sendAIMessage(message);
            aiInput.value = '';
            updateCharCount();
        }
    });

    // 回车发送消息，Shift+Enter换行
    aiInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = aiInput.value.trim();
            if (message) {
                sendAIMessage(message);
                aiInput.value = '';
                updateCharCount();
            }
        }
    });

    // 自动调整输入框高度
    aiInput.addEventListener('input', () => {
        autoResizeTextarea();
        updateCharCount();
    });

    // 字符计数更新
    function updateCharCount() {
        const currentLength = aiInput.value.length;
        charCount.textContent = `${currentLength} / 2000`;

        if (currentLength > 1800) {
            charCount.style.color = 'var(--google-red)';
        } else if (currentLength > 1500) {
            charCount.style.color = 'var(--google-yellow)';
        } else {
            charCount.style.color = 'var(--text-secondary)';
        }
    }

    // 自动调整文本域高度
    function autoResizeTextarea() {
        aiInput.style.height = 'auto';
        aiInput.style.height = Math.min(aiInput.scrollHeight, 120) + 'px';
    }

    // 初始化字符计数
    updateCharCount();
}

// 对话管理
let conversations = [];
let currentConversationId = null;

// 初始化对话列表
function initializeConversations() {
    // 从localStorage加载对话
    const savedConversations = localStorage.getItem('ai-conversations');
    if (savedConversations) {
        conversations = JSON.parse(savedConversations);
    } else {
        // 创建默认对话
        createNewConversation();
    }

    renderConversations();

    // 加载当前对话
    const savedCurrentId = localStorage.getItem('ai-current-conversation');
    if (savedCurrentId && conversations.find(c => c.id === savedCurrentId)) {
        switchConversation(savedCurrentId);
    } else {
        switchConversation(conversations[0].id);
    }
}

// 创建新对话
function createNewConversation() {
    const newConversation = {
        id: Date.now().toString(),
        title: '新对话',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    conversations.unshift(newConversation);
    saveConversations();
    renderConversations();
    switchConversation(newConversation.id);

    // 清空欢迎卡片
    const messagesContainer = document.getElementById('ai-messages');
    messagesContainer.innerHTML = '';
}

// 切换对话
function switchConversation(conversationId) {
    currentConversationId = conversationId;
    const conversation = conversations.find(c => c.id === conversationId);

    if (conversation) {
        // 更新当前对话标题
        document.getElementById('current-chat-title').textContent = conversation.title;

        // 重新渲染消息
        renderMessages(conversation.messages);

        // 更新侧边栏选中状态
        updateConversationSelection(conversationId);

        // 保存当前对话ID
        localStorage.setItem('ai-current-conversation', conversationId);
    }
}

// 渲染对话列表
function renderConversations() {
    const container = document.getElementById('conversations-list');
    container.innerHTML = '';

    conversations.forEach(conversation => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        item.dataset.id = conversation.id;

        if (conversation.id === currentConversationId) {
            item.classList.add('active');
        }

        // 获取最后一条消息作为预览
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const preview = lastMessage ?
            (lastMessage.content.length > 50 ?
                lastMessage.content.substring(0, 50) + '...' :
                lastMessage.content) :
            '暂无消息';

        const time = formatTime(conversation.updatedAt);

        item.innerHTML = `
            <div class="conversation-content">
                <div class="title">${conversation.title}</div>
                <div class="preview">${preview}</div>
                <div class="time">${time}</div>
            </div>
            <button class="delete-conversation" data-id="${conversation.id}" title="删除对话">
                <i class="fas fa-trash"></i>
            </button>
        `;

        item.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-conversation')) {
                switchConversation(conversation.id);
            }
        });

        // 添加删除按钮事件监听
        const deleteBtn = item.querySelector('.delete-conversation');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteConversation(conversation.id);
        });

        container.appendChild(item);
    });
}

// 更新对话选中状态
function updateConversationSelection(conversationId) {
    document.querySelectorAll('.conversation-item').forEach(item => {
        if (item.dataset.id === conversationId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 过滤对话
function filterConversations(searchText) {
    const items = document.querySelectorAll('.conversation-item');
    const searchLower = searchText.toLowerCase();

    items.forEach(item => {
        const title = item.querySelector('.title').textContent.toLowerCase();
        const preview = item.querySelector('.preview').textContent.toLowerCase();

        if (title.includes(searchLower) || preview.includes(searchLower)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// 更新对话标题
function updateConversationTitle(conversationId, firstMessage) {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation && conversation.title === '新对话') {
        // 使用前20个字符作为标题
        conversation.title = firstMessage.length > 20 ?
            firstMessage.substring(0, 20) + '...' :
            firstMessage;
        saveConversations();
        renderConversations();
        updateConversationSelection(conversationId);
    }
}

// 删除对话
function deleteConversation(conversationId) {
    if (conversations.length <= 1) {
        alert('至少需要保留一个对话');
        return;
    }

    if (confirm('确定要删除这个对话吗？')) {
        // 从数组中移除对话
        conversations = conversations.filter(c => c.id !== conversationId);

        // 如果删除的是当前对话，切换到第一个对话
        if (currentConversationId === conversationId) {
            currentConversationId = conversations[0].id;
            loadConversation(currentConversationId);
        }

        // 保存并重新渲染
        saveConversations();
        renderConversations();
        updateConversationSelection(currentConversationId);
    }
}

// 保存对话到localStorage
function saveConversations() {
    localStorage.setItem('ai-conversations', JSON.stringify(conversations));
}

// 格式化时间
function formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 1) {
        return '刚刚';
    } else if (diffMinutes < 60) {
        return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
        return `${diffHours}小时前`;
    } else if (diffDays < 7) {
        return `${diffDays}天前`;
    } else {
        return date.toLocaleDateString('zh-CN');
    }
}

// 打开AI弹窗
function openAIModal() {
    const aiModal = document.getElementById('ai-modal');
    aiModal.classList.add('open');
    document.getElementById('ai-input').focus();
    document.body.style.overflow = 'hidden';
}

// 关闭AI弹窗
function closeAIModal() {
    const aiModal = document.getElementById('ai-modal');
    aiModal.classList.remove('open');
    document.body.style.overflow = '';
}

// 渲染消息列表
function renderMessages(messages) {
    const messagesContainer = document.getElementById('ai-messages');

    if (messages.length === 0) {
        // 显示欢迎卡片
        messagesContainer.innerHTML = `
            <div class="ai-welcome-card">
                <div class="welcome-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="welcome-content">
                    <h4>AI智能助手</h4>
                    <p>你好！我是你的AI助手，可以帮你：</p>
                    <div class="welcome-features">
                        <div class="feature-item">
                            <i class="fas fa-lightbulb"></i>
                            <span>知识问答</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-search"></i>
                            <span>搜索建议</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-pen"></i>
                            <span>写作辅助</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-code"></i>
                            <span>技术支持</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-language"></i>
                            <span>翻译服务</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-chart-bar"></i>
                            <span>数据分析</span>
                        </div>
                    </div>
                    <div class="welcome-tips">
                        <small>💡 提示：使用搜索框获取实时信息，点击下方开始对话</small>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    messagesContainer.innerHTML = '';
    messages.forEach(message => {
        addMessageToDOM(message);
    });

    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 添加消息到DOM
function addMessageToDOM(message) {
    const messagesContainer = document.getElementById('ai-messages');

    // 如果第一条消息，清空欢迎卡片
    if (messagesContainer.querySelector('.ai-welcome-card')) {
        messagesContainer.innerHTML = '';
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${message.role}`;

    const avatar = document.createElement('div');
    avatar.className = 'ai-message-avatar';

    if (message.role === 'ai') {
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
    } else {
        // 用户头像 - 可以设置为自定义图片
        avatar.innerHTML = '<i class="fas fa-user"></i>';
    }

    const content = document.createElement('div');
    content.className = 'ai-message-content';

    // 支持Markdown渲染
    if (message.role === 'ai') {
        content.innerHTML = renderMarkdown(message.content);
    } else {
        content.textContent = message.content;
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    messagesContainer.appendChild(messageDiv);

    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 渲染Markdown（简化版本）
function renderMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^\s*(\d+\.)\s+/gm, '<li>$1')
        .replace(/^\s*[-•]\s+/gm, '<li>•')
        .replace(/\n/g, '<br>')
        .replace(/^(.+)$/gm, function(match) {
            return match.match(/^<[^>]+>$/) ? match : `<p>${match}</p>`;
        });
}

// 发送AI消息
async function sendAIMessage(message) {
    if (isAiProcessing) return;

    // 获取当前对话
    const conversation = conversations.find(c => c.id === currentConversationId);
    if (!conversation) return;

    // 添加用户消息
    const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
    };

    conversation.messages.push(userMessage);
    addMessageToDOM(userMessage);

    // 更新对话标题（如果是第一条消息）
    if (conversation.messages.length === 1) {
        updateConversationTitle(currentConversationId, message);
    }

    // 更新对话时间
    conversation.updatedAt = new Date().toISOString();
    saveConversations();
    renderConversations();

    isAiProcessing = true;

    // 显示处理状态
    showAIProcessing();

    try {
        const response = await callAIAPI(message);
        removeAIProcessing();

        // 添加AI响应
        const aiMessage = {
            role: 'ai',
            content: response,
            timestamp: new Date().toISOString()
        };

        conversation.messages.push(aiMessage);
        addMessageToDOM(aiMessage);

        // 更新对话
        conversation.updatedAt = new Date().toISOString();
        saveConversations();
        renderConversations();

    } catch (error) {
        console.error('AI API调用失败:', error);
        removeAIProcessing();

        // 显示错误信息并提供模拟响应
        const errorMessage = getAIErrorMessage(error);

        const errorAIMessage = {
            role: 'ai',
            content: errorMessage,
            timestamp: new Date().toISOString()
        };

        conversation.messages.push(errorAIMessage);
        addMessageToDOM(errorAIMessage);

        // 延迟后提供模拟响应
        setTimeout(() => {
            const fallbackResponse = generateAIResponse(message);

            const fallbackAIMessage = {
                role: 'ai',
                content: `\n\n💡 **备用建议**:\n${fallbackResponse}`,
                timestamp: new Date().toISOString()
            };

            conversation.messages.push(fallbackAIMessage);
            addMessageToDOM(fallbackAIMessage);

            conversation.updatedAt = new Date().toISOString();
            saveConversations();
            renderConversations();
        }, 500);
    }

    isAiProcessing = false;
}

// 获取AI API地址
function getAiApiUrl() {
    return localStorage.getItem('ai-api-url') || 'https://api.openai.com/v1/chat/completions';
}

// 调用真实AI API
async function callAIAPI(message) {
    // 使用用户设置的API密钥
    const apiKey = localStorage.getItem('ai-api-key');

    if (!apiKey) {
        throw new Error('请先在设置中配置AI API密钥');
    }
    const apiUrl = getAiApiUrl();

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4.1',
            messages: [
                {
                    role: 'system',
                    content: `你是一个智能助手，集成在个人导航页中。你的特点：
- 回答要简洁明了，适合导航页的使用场景
- 专注于帮助用户解决问题和提供建议
- 如果遇到技术问题，优先提供实际可行的解决方案
- 保持友好专业的语调
- 回答长度控制在200字以内，重要信息可以适当延长

当用户询问实时信息（新闻、股价、天气等）时：
1. 明确告知用户你无法访问实时数据
2. 提供具体、可操作的建议和链接
3. 推荐可靠的搜索工具和方法
4. 如果是常识性问题，可以基于知识库回答`
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// 让AI处理搜索查询
async function callAIForSearchResult(query) {
    try {
        const apiKey = localStorage.getItem('ai-api-key');

        if (!apiKey) {
            throw new Error('请先在设置中配置AI API密钥');
        }
        const apiUrl = getAiApiUrl();

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4.1',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个智能搜索助手。用户通过搜索框向你提问。请：1. 基于你的知识库提供相关信息；2. 如果是实时性问题（新闻、股价等），明确说明你的知识限制；3. 提供实用的搜索建议和可靠信息源；4. 推荐合适的搜索关键词和方法。保持回答简洁有用。'
                    },
                    {
                        role: 'user',
                        content: `请帮我搜索关于"${query}"的最新信息。`
                    }
                ],
                max_tokens: 600,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`搜索API请求失败: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content.trim();

        return `🔍 **搜索: ${query}**\n\n${aiResponse}\n\n*注意：由于搜索服务限制，以上信息基于AI的知识库。对于实时数据，建议您直接访问相关官方网站获取最新信息。*`;

    } catch (error) {
        return `🔍 **搜索: ${query}**\n\n抱歉，搜索功能暂时不可用。建议您：\n1. 直接在搜索引擎中查找相关信息\n2. 稍后重试\n3. 咨询其他可靠信息源\n\n错误原因：${error.message}`;
    }
}

// 获取AI错误信息
function getAIErrorMessage(error) {
    const userApiKey = localStorage.getItem('ai-api-key');

    if (error.message.includes('401')) {
        return `🚫 **API认证失败**

很抱歉，API密钥无效或已过期。
${userApiKey ? '请检查您输入的API密钥是否正确。' : '请联系管理员获取有效的API密钥。'}

您可以：
1. 在设置中更新API密钥
2. 清空API密钥使用默认服务
3. 稍后重试`;
    } else if (error.message.includes('429')) {
        return `⏰ **请求过于频繁**

API调用频率超限，请稍等片刻再试。

建议：
- 等待1-2分钟后重试
- 减少连续提问次数
- 使用备用建议功能`;
    } else if (error.message.includes('500') || error.message.includes('503')) {
        return `🔧 **服务暂时不可用**

AI服务正在维护或遇到技术问题。

建议：
- 稍后重试
- 使用下面的备用建议
- 检查网络连接`;
    } else {
        return `❌ **连接失败**

无法连接到AI服务：${error.message}

建议：
- 检查网络连接
- 稍后重试
- 使用下面的备用建议`;
    }
}

// 简单Markdown解析
function parseMarkdown(text) {
    console.log('开始解析:', text);

    let html = text;

    // 处理粗体 **text** - 使用全局替换
    html = html.replace(/\*\*(.*?)\*\*/g, function(match, content) {
        console.log('发现粗体:', match, '->', content);
        return '<strong style="color: var(--google-blue); font-weight: 600;">' + content + '</strong>';
    });

    // 处理斜体 *text* - 避免匹配已经处理的粗体
    html = html.replace(/\*([^*]+)\*/g, function(match, content) {
        console.log('发现斜体:', match, '->', content);
        return '<em style="font-style: italic; color: var(--text-secondary);">' + content + '</em>';
    });

    // 处理代码 `code`
    html = html.replace(/`(.*?)`/g, '<code style="background: rgba(66, 133, 244, 0.1); padding: 2px 6px; border-radius: 4px; font-family: monospace; color: var(--google-blue);">$1</code>');

    // 处理链接 [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--google-blue); text-decoration: none;">$1</a>');

    // 处理换行
    html = html.replace(/\n/g, '<br>');

    console.log('解析结果:', html);
    return html;
}

// 添加AI消息到界面
function addAIMessage(type, content) {
    const messagesContainer = document.getElementById('ai-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'ai-avatar';
    avatar.innerHTML = type === 'user' ?
        '<img src="头像.jpg" alt="用户头像" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">' :
        '<i class="fas fa-robot"></i>';

    const textDiv = document.createElement('div');
    textDiv.className = 'ai-text';

    // 解析Markdown并设置内容
    const parsedContent = parseMarkdown(content);
    textDiv.innerHTML = parsedContent;

    // 调试信息（开发时可看到解析结果）
    if (type === 'ai') {
        console.log('原始内容:', content);
        console.log('解析结果:', parsedContent);
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(textDiv);
    messagesContainer.appendChild(messageDiv);

    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 显示AI处理状态
function showAIProcessing() {
    const messagesContainer = document.getElementById('ai-messages');
    const processingDiv = document.createElement('div');
    processingDiv.className = 'ai-message ai-processing';
    processingDiv.id = 'ai-processing';

    processingDiv.innerHTML = `
        <div class="ai-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="ai-text">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    messagesContainer.appendChild(processingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 移除AI处理状态
function removeAIProcessing() {
    const processingDiv = document.getElementById('ai-processing');
    if (processingDiv) {
        processingDiv.remove();
    }
}

// 生成AI响应（模拟）
function generateAIResponse(message) {
    const responses = {
        '天气': `根据当前的天气数据显示，现在温度适宜，空气质量良好。建议你根据实际活动安排选择合适的着装。出行时可以考虑紫外线防护。`,
        '写': `我可以帮你写作！请告诉我更具体的要求，比如：
- 文章类型（报告、邮件、博客等）
- 主题内容
- 字数要求
- 语气风格

这样我就能为你提供更精准的帮助了。`,
        '量子计算': `量子计算是一种基于量子力学原理的计算方式。它利用量子比特（qubit）的叠加态和纠缠特性，能够实现传统计算机难以完成的复杂计算。

主要特点：
- 量子叠加：一个量子比特可以同时处于0和1的叠加态
- 量子纠缠：多个量子比特之间存在特殊的关联
- 并行计算：能够同时处理多个计算路径

应用领域包括密码学、药物研发、金融建模等。`,
        '推荐': `基于当前趋势，我推荐以下几本书：

📚 **技术类**
- 《AI时代：人工智能的应用与未来》
- 《代码大全》- Steve McConnell

📖 **管理类**
- 《原则》- 瑞·达利欧
- 《高效能人士的七个习惯》

🎨 **思维类**
- 《思考，快与慢》- 丹尼尔·卡尼曼
- 《系统之美》

你对哪个领域比较感兴趣？我可以给出更具体的推荐。`,
        '默认': `我理解你的问题。基于我的知识，我可以为你提供以下帮助：

💡 **信息查询**: 回答各种知识性问题
📝 **内容创作**: 协助写作、编辑、翻译
🔍 **问题分析**: 帮你分析和解决问题
🛠️ **技术支持**: 提供编程和技术建议
📊 **数据处理**: 帮助整理和分析信息

你的问题很棒！如果你能提供更多背景信息，我能给出更精准和有用的回答。有什么具体方面需要深入探讨吗？`
    };

    // 根据关键词匹配响应
    for (const keyword in responses) {
        if (message.includes(keyword)) {
            return responses[keyword];
        }
    }

    return responses['默认'];
}

// 书签相关功能已移除

// 深色模式功能
function setupDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    // 检查本地存储的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }

    // 主题切换
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // 更新图标
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });

    // 监听系统主题变化
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                html.setAttribute('data-theme', newTheme);
                themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });

        // 初始检查系统主题
        if (!localStorage.getItem('theme')) {
            const systemTheme = mediaQuery.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', systemTheme);
            themeIcon.className = systemTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// 键盘快捷键
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('search-input').focus();
        }

        // ESC 关闭设置面板
        if (e.key === 'Escape') {
            const settingsPanel = document.getElementById('settings-panel');
            if (settingsPanel.classList.contains('open')) {
                settingsPanel.classList.remove('open');
            }
        }

        // Ctrl/Cmd + D 切换深色模式
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            document.getElementById('theme-toggle').click();
        }
    });
}

// 书签滚动功能
function setupBookmarkScrolling() {
    const bookmarksScroll = document.querySelector('.bookmarks-scroll');

    if (!bookmarksScroll) return;

    // 支持触摸滑动
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    bookmarksScroll.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - bookmarksScroll.offsetLeft;
        scrollLeft = bookmarksScroll.scrollLeft;
        bookmarksScroll.style.cursor = 'grabbing';
    });

    bookmarksScroll.addEventListener('mouseleave', () => {
        isDown = false;
        bookmarksScroll.style.cursor = 'grab';
    });

    bookmarksScroll.addEventListener('mouseup', () => {
        isDown = false;
        bookmarksScroll.style.cursor = 'grab';
    });

    bookmarksScroll.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - bookmarksScroll.offsetLeft;
        const walk = (x - startX) * 1.5;
        bookmarksScroll.scrollLeft = scrollLeft - walk;
    });

    // 触摸支持
    bookmarksScroll.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - bookmarksScroll.offsetLeft;
        scrollLeft = bookmarksScroll.scrollLeft;
    });

    bookmarksScroll.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].pageX - bookmarksScroll.offsetLeft;
        const walk = (x - startX) * 1.5;
        bookmarksScroll.scrollLeft = scrollLeft - walk;
    });

    bookmarksScroll.addEventListener('touchend', () => {
        startX = 0;
    });
}

// 初始化问候语（只在页面加载时运行一次）
function initGreeting() {
    const now = new Date();
    updateGreeting(now);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化深色模式
    setupDarkMode();

    // 处理欢迎消息的Markdown
    const welcomeText = document.querySelector('.ai-welcome .ai-text');
    if (welcomeText) {
        const originalContent = welcomeText.textContent;
        welcomeText.innerHTML = parseMarkdown(originalContent);
    }

    // 初始化问候语（只运行一次）
    initGreeting();

    // 启动时间更新
    updateTime();
    setInterval(updateTime, 1000);

    // 获取天气
    getWeather('北京');
    setInterval(() => {
        const savedCity = localStorage.getItem('weather-city') || '北京';
        getWeather(savedCity);
    }, 600000); // 每10分钟更新一次天气

    // 设置搜索功能
    setupSearch();

    // 初始化搜索引擎按钮状态和占位符
    const activeEngineBtn = document.querySelector('.engine-btn.active');
    if (activeEngineBtn) {
        activeEngineBtn.style.background = 'var(--google-blue)';
        // 设置默认占位符
        const searchPlaceholders = {
            google: 'Google 搜索或输入网址...',
            baidu: '百度一下，你就知道...',
            bing: '必应搜索，发现更多...',
            duckduckgo: 'DuckDuckGo - 注重隐私的搜索...',
            ai: '问我任何问题，AI智能回答...'
        };

        const currentEngineType = activeEngineBtn.dataset.engine;
        const searchInput = document.getElementById('search-input');
        searchInput.placeholder = searchPlaceholders[currentEngineType] || '搜索网页...';

        // 保存当前引擎类型
        currentEngine = currentEngineType;
    }

    // 设置搜索框默认焦点（稍微延迟以确保页面完全加载）
    setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        searchInput.focus();
    }, 100);

    // 设置书签功能
    setupBookmarks();

    // 设置书签滚动功能
    setupBookmarkScrolling();

    // 设置面板功能
    setupSettings();

    // 设置AI助手功能
    setupAI();

    // 书签管理功能已移除

    // 设置键盘快捷键
    setupKeyboardShortcuts();

    // 初始化AI中枢面板
    initializeAIHub();
});


// AI中枢面板功能
let aiHubManager;

class AIHubManager {
    constructor() {
        this.isGenerating = false;

        // 使用模式提示词
        this.usagePatterns = [
            '近两天偏向娱乐内容，模型推断注意力切换频率上升',
            '近期频繁浏览技术社区，系统分析深度思考需求增强',
            '文档工具使用频繁，推断当前处于知识整理阶段',
            '娱乐类访问增多，推断注意力需要重组',
            '开发工具使用稳定，推断项目开发处于关键阶段',
            '学习资源访问减少，模型推断可能处于内化期',
            '搜索查询指向明确，推断目标导向型行为模式',
            '信息浏览分散，推断需要注意力优化调整'
        ];
    }

    // 获取当前环境信息
    getCurrentEnvironment() {
        const now = new Date();
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

        const weatherElement = document.getElementById('temperature');
        const locationElement = document.getElementById('location');
        const aqiElement = document.getElementById('aqi');
        const weatherDescElement = document.getElementById('weather-desc');

        const temperature = weatherElement ? weatherElement.textContent.replace('°C', '') : '25';
        const location = locationElement ? locationElement.textContent : '北京';
        const aqi = aqiElement && aqiElement.style.display !== 'none' ?
            aqiElement.textContent.replace('AQI ', '') : '良';
        const weather = weatherDescElement ? weatherDescElement.textContent : '晴朗';

        // 随机选择一个使用模式
        const usagePattern = this.usagePatterns[Math.floor(Math.random() * this.usagePatterns.length)];

        return {
            time: `${now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`,
            date: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`,
            weekday: weekdays[now.getDay()],
            city: location,
            weather: weather,
            temperature: `${temperature}°C`,
            aqi: aqi,
            usagePattern: usagePattern
        };
    }

    // 生成系统状态提示
    async generateSystemStatus() {
        const env = this.getCurrentEnvironment();

        const systemPrompt = `你是一套名为「认知中枢」的 AI 系统，具备系统状态监控、行为分析推断与自检能力。
你的输出用于一个浏览器首页展示，它要求你生成高度克制、技术感强、非常简短的系统状态提示。
风格要求：

简体中文

避免拟人

类似"OS 状态文本"

不要说明你无法访问数据

不要出现冗余解释`;

        const userPrompt = `根据以下信息，为浏览器首页生成一句系统状态提示（长度控制在 12–20 字之间）：

时间：${env.time}

更新行为：如 "模型快照已同步 / 环境参数已加载 / 推断模块运行中"

系统角色：智能分析中枢

要求：

语气专业、冷静、偏技术

不要多句

不要使用比喻

不要出现"我"

输出示例风格：

行为分析模块已激活

推断引擎处于稳定运行

参数同步完成，系统待命

环境变量已更新，推断准备就绪

只输出一句状态文本。`;

        try {
            const apiKey = localStorage.getItem('ai-api-key');

            if (!apiKey) {
                throw new Error('请先在设置中配置AI API密钥');
            }
            const apiUrl = getAiApiUrl();

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4.1',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: userPrompt
                        }
                    ],
                    max_tokens: 50,
                    temperature: 0.7
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.choices[0].message.content.trim();
            }
        } catch (error) {
            console.error('生成系统状态失败:', error);
        }

        // 备用状态提示
        const statusTemplates = [
            '推断引擎稳定运行',
            '系统参数已同步',
            '行为分析模块激活',
            '环境数据已加载',
            '推断模块待命',
            '模型状态正常',
            '系统自检完成',
            '缓存已同步更新'
        ];

        return statusTemplates[Math.floor(Math.random() * statusTemplates.length)];
    }

    // 构建AI提示词
    buildPrompt() {
        const env = this.getCurrentEnvironment();

        const systemPrompt = `你是一套运行在个人主页上的「用户认知状态分析中枢」。
你的任务是分析用户的认知状态、行为模式和心理特征，生成"个人认知分析报告"。
输出要求：

简体中文

语气：专业分析、客观观察、用户中心

内容性质：用户认知分析、行为模式解读、个性化建议

完全避免：系统技术术语、机器化表达、冰冷感

每条内容应像"认知科学报告"或"个人效能分析"

既要有专业性，又要有人文关怀`;

        const userPrompt = `请基于用户数据和环境信息，生成"个人认知性能分析报告"：

用户数据输入：
• 当前时间：${env.date} ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
• 环境条件：${env.city} | ${env.weather} | ${env.temperature} | 空气${env.aqi}
• 行为模式：${env.usagePattern}

⚠️ 重要：明日优化预览必须侧重认知风险预警，提供具体的注意事项和规避建议

模拟生物参数（用于增强分析真实性）：
• 心率变异性(HRV)：${Math.floor(Math.random() * 30 + 50)}ms
• 皮肤电导响应(GSR)：${Math.floor(Math.random() * 5 + 2)}μS
• 瞳孔直径变化：${Math.floor(Math.random() * 2 + 3)}mm
• 脑电波α波功率：${(Math.random() * 2 + 8).toFixed(1)}μV²
• 皮质醇水平：${(Math.random() * 10 + 5).toFixed(1)}nmol/L

🧠 认知性能分析要求

① 今日认知轨迹（专业数据分析）
生成 3 条精准认知数据，每条要求：
- 包含具体百分比、时间戳或量化指标
- 使用神经科学认知心理学专业术语
- 模拟真实的认知性能监测数据
- 16-28字，体现高科技感

数据维度示例：
• 工作记忆负载峰值 87%（14:23-16:47）达到认知最佳区间
• 执行功能切换效率下降至 62%（下午3点后出现认知瓶颈）
• 注意力网络连接强度维持 91%（上午保持高精度专注状态）
• 神经可塑性指数 79%（学习吸收效率达到临界值）

② 明日优化预览（预警提示型认知风险管理）
基于用户行为模式和环境数据，生成 3 条认知风险预警和注意事项，每条要求：
- 识别潜在的认知疲劳期或注意力低谷
- 提供具体的行为规避和风险防范建议
- 包含预警级别和应对时机
- 16-32字，体现前瞻性和警示性

预警提示策略示例：
• 15:00后认知效率下降<strong>35%</strong>，进入注意力低谷期
• 连续工作超过<strong>90分钟</strong>将导致执行功能严重衰减
• 午后为决策敏感期，<span class="avoid-text">避免</span>重要判断和复杂分析

🎯 输出格式（严格遵循）

🧠 今日认知轨迹
（轨迹数据1）
（轨迹数据2）
（轨迹数据3）

🔮 明日优化预览
（优化方案1）
（优化方案2）
（优化方案3）

不要输出其他任何内容。`;

        return { systemPrompt, userPrompt };
    }

    // 解析AI响应
    parseAIResponse(response) {
        try {
            // 查找认知轨迹部分
            const insightIndex = response.indexOf('🧠 今日认知轨迹');
            let insights = [];

            if (insightIndex !== -1) {
                // 查找下一个部分的位置（预览或其他）
                const nextIndex = response.indexOf('🔮', insightIndex + 1);
                const endIndex = nextIndex !== -1 ? nextIndex : response.length;

                const insightSection = response.substring(insightIndex, endIndex);
                // 移除标题，只保留内容
                const contentSection = insightSection.replace(/^🧠 今日认知轨迹\s*/gm, '');

                // 分割行并清理
                const lines = contentSection
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0 && !line.startsWith('🔮'));

                insights = lines
                    .map(line => line.replace(/^[-•*]\s*/m, '').trim())
                    .filter(line => line.length > 0)
                    .slice(0, 3);
            }

            // 查找明日预览部分
            const suggestionIndex = response.indexOf('🔮 明日优化预览');
            let suggestions = [];

            if (suggestionIndex !== -1) {
                // 查找下一个部分的位置
                const contentSection = response.substring(suggestionIndex);
                // 移除标题，只保留内容
                const cleanSection = contentSection.replace(/^🔮 明日优化预览\s*/gm, '');

                // 分割行并清理
                const lines = cleanSection
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0 && !line.startsWith('🧠'));

                suggestions = lines
                    .map(line => line.replace(/^[-•*]\s*/m, '').trim())
                    .filter(line => line.length > 0)
                    .slice(0, 3);
            }

            return { insights, suggestions };
        } catch (error) {
            console.error('解析AI响应失败:', error);
            console.log('原始响应:', response); // 添加调试信息
            return this.getFallbackContent();
        }
    }

    // 状态指示器已删除，移除相关逻辑
    updateStatusSummary(response) {
        // 不再更新状态指示器
    }

    // 显示加载完成的内容 - 移除复杂动画，与页面风格一致
    showLoadedContent() {
        // 内容直接显示，无需额外动画类
        // 状态指示器已经始终可见并更新
    }

    // 获取备用内容
    getFallbackContent() {
        const env = this.getCurrentEnvironment();

        return {
            insights: [
                `前额叶皮层激活强度 85%（09:45-11:20）达到深度工作状态`,
                `工作记忆容量利用率 78%（${env.timeOfDay}）保持高效信息处理`,
                '默认模式网络抑制指数 92% - 专注网络连接异常稳固',
                '多巴胺基线水平稳定 - 认知灵活性维持最佳区间'
            ],
            suggestions: [
                '10:00-12:15 安排分析任务，利用前额叶激活峰值提升产出 28%',
                '13:30 执行20分钟正念神经反馈，恢复执行功能至基准线',
                '20:15-21:00 规划创造活动，基于昼夜节律预测创造性能提升 35%',
                '16:45 强制认知重置，防止累积性疲劳影响决策质量'
            ]
        };
    }

    // 调用AI API生成内容
    async generateContent() {
        if (this.isGenerating) return;

        this.isGenerating = true;
        // 设置加载状态显示
        this.setLoadingState();

        try {
            const { systemPrompt, userPrompt } = this.buildPrompt();

            const apiKey = localStorage.getItem('ai-api-key');

            if (!apiKey) {
                throw new Error('请先在设置中配置AI API密钥');
            }
            const apiUrl = getAiApiUrl();

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4.1',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: userPrompt
                        }
                    ],
                    max_tokens: 800,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content.trim();
            const content = this.parseAIResponse(aiResponse);

            this.displayContent(content);

        } catch (error) {
            console.error('AI内容生成失败:', error);

            // 使用备用内容
            const fallbackContent = this.getFallbackContent();
            this.displayContent(fallbackContent);

            // 显示错误提示
            setTimeout(() => {
                this.showError();
            }, 1000);
        } finally {
            this.isGenerating = false;
        }
    }

    // 处理文本，为关键词添加颜色标记
    processText(text) {
        // 定义需要高亮的关键词
        const patterns = [
            {
                regex: /(\d+%|\d+ms|\d+μS|\d+mm|\d+\/\d+|\d+次|\d+分钟|\d+小时)/g,
                wrapper: 'strong' // 重要数据
            },
            {
                regex: /(下降|减少|降低|减弱|衰退|疲劳|衰减|损伤|障碍|受损|退化|枯竭)/g,
                wrapper: 'span',
                className: 'danger-text'
            },
            {
                regex: /(避免|防止|禁止|不要|切勿|限制|控制|暂停|推迟)/g,
                wrapper: 'span',
                className: 'avoid-text'
            },
            {
                regex: /(脆弱期|低谷期|敏感期|危险期|高风险|风险期|瓶颈期)/g,
                wrapper: 'span',
                className: 'risk-period'
            },
            {
                regex: /(超出|超过|突破|临界|极限|饱和)/g,
                wrapper: 'span',
                className: 'critical-text'
            }
        ];

        let processedText = text;

        patterns.forEach(({ regex, wrapper, className }) => {
            processedText = processedText.replace(regex, (match) => {
                if (className) {
                    return `<${wrapper} class="${className}">${match}</${wrapper}>`;
                }
                return `<${wrapper}>${match}</${wrapper}>`;
            });
        });

        return processedText;
    }

    // 显示内容
    displayContent(content) {
        const insightsContainer = document.getElementById('today-insights');
        const suggestionsContainer = document.getElementById('smart-suggestions');
        const aiHubCard = document.querySelector('.ai-hub-card');

        // 移除加载状态类以停止进度条动画
        if (aiHubCard) {
            aiHubCard.classList.remove('loading');
        }

        // 更新系统参数指标条为实际参数
        this.updateSystemMetrics();

        // 异步生成系统状态 - 更新状态栏的延迟信息
        this.generateSystemStatus().then(systemStatus => {
            const latencyElement = document.querySelector('.latency-status');
            if (latencyElement) {
                // 从系统状态字符串中提取延迟信息或使用默认值
                const latencyMatch = systemStatus.match(/延迟[：:](\w+)/);
                if (latencyMatch) {
                    latencyElement.textContent = latencyMatch[1];
                } else {
                    latencyElement.textContent = '低';
                }
            }
        }).catch(error => {
            console.error('生成系统状态失败:', error);
        });

        // 显示洞察 - 使用文本处理函数添加颜色标记，移除图标
        insightsContainer.innerHTML = content.insights.map((insight) => `
            <div class="insight-item">
                <div class="item-text">${this.processText(insight)}</div>
            </div>
        `).join('');

        // 显示建议 - 使用文本处理函数添加颜色标记，移除图标
        suggestionsContainer.innerHTML = content.suggestions.map((suggestion) => `
            <div class="suggestion-item">
                <div class="item-text">${this.processText(suggestion)}</div>
            </div>
        `).join('');

        // 更新最后更新时间
        this.updateLastUpdateTime();

        // 显示结果
        document.getElementById('ai-hub-error').style.display = 'none';

        // 触发统一的显示动画 - 状态指示器和内容同时显示
        this.showLoadedContent();
    }

    // 设置加载状态
    setLoadingState() {
        const metricsBar = document.getElementById('system-metrics-bar');
        const aiHubCard = document.querySelector('.ai-hub-card');

        if (metricsBar) {
            metricsBar.innerHTML = '<span class="loading-text">正在分析您的认知状态...</span>';
        }

        // 添加加载状态类以启动进度条动画
        if (aiHubCard) {
            aiHubCard.classList.add('loading');
        }

        // 显示加载占位符 - 专业数据分析，移除图标保持结构一致
        document.getElementById('today-insights').innerHTML = `
            <div class="insight-item loading-item">
                <div class="item-text">正在分析认知性能数据...</div>
            </div>
            <div class="insight-item loading-item">
                <div class="item-text">正在计算认知效率指标...</div>
            </div>
            <div class="insight-item loading-item">
                <div class="item-text">正在生成神经认知分析...</div>
            </div>
        `;

        document.getElementById('smart-suggestions').innerHTML = `
            <div class="suggestion-item loading-item">
                <div class="item-text">正在生成认知增强方案...</div>
            </div>
            <div class="suggestion-item loading-item">
                <div class="item-text">正在计算最优干预时机...</div>
            </div>
            <div class="suggestion-item loading-item">
                <div class="item-text">正在构建个性化策略...</div>
            </div>
        `;

        document.getElementById('ai-hub-error').style.display = 'none';
    }

    // 显示错误状态
    showError() {
        const aiHubCard = document.querySelector('.ai-hub-card');

        // 移除加载状态类以停止进度条动画
        if (aiHubCard) {
            aiHubCard.classList.remove('loading');
        }

        document.getElementById('ai-hub-loading').style.display = 'none';
        document.getElementById('ai-hub-insights').style.display = 'none';
        document.getElementById('ai-hub-error').style.display = 'flex';
    }

    // 更新系统参数指标条
    updateSystemMetrics() {
        const metricsBar = document.getElementById('system-metrics-bar');
        if (metricsBar) {
            metricsBar.innerHTML = `
                <span class="metric-item">行为噪声：<span class="metric-value">低</span></span>
                <span class="metric-item">输入密度：<span class="metric-value">中</span></span>
                <span class="metric-item">切换频率：<span class="metric-value">稳</span></span>
                <span class="metric-item">节奏漂移：<span class="metric-value">轻微</span></span>
            `;
        }
    }

    // 更新最后更新时间
    updateLastUpdateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('ai-hub-last-update').textContent = `${timeStr} 更新`;
    }

    
    // 刷新内容
    refresh() {
        if (!this.isGenerating) {
            this.generateContent();
        }
    }

    // 打开设置
    openSettings() {
        // 这里可以实现设置弹窗
        alert('AI中枢面板设置功能开发中...');
    }
}

// 初始化AI中枢面板
function initializeAIHub() {
    aiHubManager = new AIHubManager();

    // 每次都生成新内容，不使用缓存
    aiHubManager.generateContent();
}

// 全局刷新函数
function loadAIHubContent() {
    if (aiHubManager) {
        aiHubManager.refresh();
    }
}

// 监听网络状态 - 移除，改为简单的天气更新
window.addEventListener('online', () => {
    getWeather(localStorage.getItem('weather-city') || '北京');
});