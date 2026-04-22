// 单词库 —— 你可以自己修改这里的单词
const 单词列表 = [
    { 单词: "apple", 释义: "苹果", 例句: "I eat an apple every day. 我每天吃一个苹果。" },
    { 单词: "book", 释义: "书", 例句: "This is an interesting book. 这是一本有趣的书。" },
    { 单词: "car", 释义: "汽车", 例句: "His car is red. 他的车是红色的。" },
    { 单词: "happy", 释义: "快乐的", 例句: "She looks very happy. 她看起来非常快乐。" },
    { 单词: "big", 释义: "大的", 例句: "This is a big house. 这是一所大房子。" }
];

let 当前第几个 = 0;      // 当前是第几个单词
let 是否显示单词面 = true;  // true=显示英文，false=显示中文+例句
let 今日已学几个 = 0;      // 今天学了多少个
let 连续学习天数 = 0;      // 连续打卡天数

// ---------- 从手机里读取之前的学习数据 ----------
function 读取数据() {
    const 已学存储 = localStorage.getItem('今日已学');
    const 天数存储 = localStorage.getItem('连续天数');
    const 上次日期 = localStorage.getItem('上次学习日期');
    const 今天日期 = new Date().toDateString();
    
    if (已学存储 && 上次日期 === 今天日期) {
        今日已学几个 = parseInt(已学存储);
    } else {
        今日已学几个 = 0;
        if (上次日期 && new Date(上次日期).getTime() === new Date(今天日期).getTime() - 86400000) {
            连续学习天数 = parseInt(天数存储) + 1;
        } else if (上次日期 !== 今天日期) {
            连续学习天数 = 0;
        }
        localStorage.setItem('今日已学', 今日已学几个);
        localStorage.setItem('上次学习日期', 今天日期);
        localStorage.setItem('连续天数', 连续学习天数);
    }
    if (天数存储) 连续学习天数 = parseInt(天数存储);
    更新界面进度();
}

// 保存今日进度
function 保存进度() {
    localStorage.setItem('今日已学', 今日已学几个);
    localStorage.setItem('连续天数', 连续学习天数);
    localStorage.setItem('上次学习日期', new Date().toDateString());
    更新界面进度();
}

// 更新界面上的进度文字
function 更新界面进度() {
    document.querySelector('.progress-circle').innerHTML = `📚 今日已学 ${今日已学几个} / ${单词列表.length} 个单词<br>🔥 连续学习 ${连续学习天数} 天`;
}

// 显示当前单词（英文面或中文面）
function 显示单词() {
    const 卡片 = document.getElementById('单词卡片');
    const 当前单词 = 单词列表[当前第几个];
    if (是否显示单词面) {
        卡片.innerHTML = `<div class="word-front">${当前单词.单词}</div>`;
    } else {
        卡片.innerHTML = `<div><strong>${当前单词.单词}</strong><br><span style="font-size: 18px;">${当前单词.释义}</span><br><span style="font-size: 14px; color: gray;">📖 ${当前单词.例句}</span></div>`;
    }
}

// 点击卡片：学习单词
function 学习单词() {
    if (!是否显示单词面) {
        // 如果当前显示的是中文面，再点一下回到英文面
        是否显示单词面 = true;
        显示单词();
        return;
    }
    // 显示中文面，并计入今日学习
    是否显示单词面 = false;
    显示单词();
    if (今日已学几个 <= 当前第几个) {
        今日已学几个++;
        保存进度();
    }
}

// 切换到上一个/下一个单词
function 下一个单词() { 
    当前第几个 = (当前第几个 + 1) % 单词列表.length; 
    是否显示单词面 = true; 
    显示单词(); 
}
function 上一个单词() { 
    当前第几个 = (当前第几个 - 1 + 单词列表.length) % 单词列表.length; 
    是否显示单词面 = true; 
    显示单词(); 
}

// ---------- 每日提醒功能 ----------
async function 请求提醒() {
    if (window.OneSignal?.User) {
        const 用户ID = await window.OneSignal.User.getOnesignalId();
        if (用户ID) {
            alert("✅ 已订阅学习提醒！接下来您会收到每日学习通知。");
        } else {
            alert("⚠️ 请先点击浏览器弹出的“允许通知”按钮。");
        }
    } else {
        alert("⏳ 通知服务加载中，请稍后再试。");
    }
}

// ---------- 绑定按钮 ----------
document.addEventListener('DOMContentLoaded', () => {
    读取数据();
    显示单词();
    document.getElementById('单词卡片').addEventListener('click', 学习单词);
    document.getElementById('下一个按钮').addEventListener('click', 下一个单词);
    document.getElementById('上一个按钮').addEventListener('click', 上一个单词);
    document.getElementById('打卡按钮').addEventListener('click', () => alert(`✅ 打卡成功！今天已学 ${今日已学几个} 个单词。继续加油！`));
    document.getElementById('提醒按钮').addEventListener('click', 请求提醒);
});