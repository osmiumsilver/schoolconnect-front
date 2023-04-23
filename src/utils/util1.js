export function getCurrentDate() {
    const myDate = new Date()
    let year = myDate.getFullYear()
    let month = myDate.getMonth() + 1
    let day = myDate.getDate()
    if (month < 10) month = `0${month}`
    if (day < 10) day = `0${day}`
    return [year, month, day].join('-')
}

export function fmoney(s, n) {
    /*
     * 参数说明：
     * s：要格式化的数字
     * n：保留几位小数
     * */
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    let t = "";
    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}

// 验证手机号码是否有效
export function isMobile(phone) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(phone)) {
        return false;
    } else {
        return true;
    }
}

export function isBlank(data) {
    if (data == null || data == undefined || data == '') {
        return true
    }
    return false
}

export function getCurrentTime() {
    const myDate = new Date()
    let min = myDate.getMinutes()
    if (parseInt(min) < 10) {
        min = `0${min}`
    }

    let hour = myDate.getHours()
    if (parseInt(hour) < 10) {
        hour = `0${hour}`
    }

    let second = myDate.getSeconds()
    if (parseInt(second) < 10) {
        second = `0${second}`
    }
    return [hour, min, second].join(':')
}

export function getDateDiff(dateTime) {
    let dateTimeStamp = new Date(dateTime).getTime();
    let result = '';
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let halfamonth = day * 15;
    let month = day * 30;
    let year = day * 365;
    let now = new Date().getTime();
    let diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return;
    }
    let monthEnd = diffValue / month;
    let weekEnd = diffValue / (7 * day);
    let dayEnd = diffValue / day;
    let hourEnd = diffValue / hour;
    let minEnd = diffValue / minute;
    let yearEnd = diffValue / year;
    if (yearEnd >= 1) {
        result = dateTime;
    } else if (monthEnd >= 1) {
        result = "" + parseInt(monthEnd) + "月前";
    } else if (weekEnd >= 1) {
        result = "" + parseInt(weekEnd) + "周前";
    } else if (dayEnd >= 1) {
        result = "" + parseInt(dayEnd) + "天前";
    } else if (hourEnd >= 1) {
        result = "" + parseInt(hourEnd) + "小时前";
    } else if (minEnd >= 1) {
        result = "" + parseInt(minEnd) + "分钟前";
    } else {
        result = "刚刚";
    }
    return result;
}

export function cpVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    var len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (var i = 0; i < len; i++) {
        var num1 = parseInt(v1[i])
        var num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }
    return 0
}

export function timePicker (time, mode) {
    const timeFormat = uni.$u.timeFormat
    switch (mode) {
        case 'datetime':
            return timeFormat(time, 'yyyy-mm-dd hh:MM')
        case 'date':
            return timeFormat(time, 'yyyy-mm-dd')
        case 'year-month':
            return timeFormat(time, 'yyyy-mm')
        case 'time':
            return toast(time)
        default:
            return ''
    }
}
export function formatTime(unixEpoch){
    const d = new Date(unixEpoch);

    return d.getFullYear() + "-" + ("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)

}
