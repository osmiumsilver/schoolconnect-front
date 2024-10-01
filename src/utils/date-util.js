// 时间格式转换 yyyy/mm/dd
function formatTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDateTime(date,split) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [year, month, day].map(formatNumber).join(split || '') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date, split) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day].map(formatNumber).join(split || '')
}

function simpleTime(date) {
    const hour = date.getHours();
    const minute = date.getMinutes();
    return [hour, minute].map(formatNumber).join(':')
}

// 两位数以内的数字自动补零
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 计算变化多少天后的日期
function DateAddDay(d, days) {
  const date = new Date(d);
  return new Date(date.setDate(date.getDate() + days));
}
// 获得本周周日的日期
function FirstDayInThisWeek(d) {
  const date = new Date(d);
  return DateAddDay(date, 0 - date.getDay());
}

// 判断类型
function Type(obj) {
    const typeStr = Object.prototype.toString.call(obj).split(" ")[1];
    return typeStr.substr(0, typeStr.length - 1).toLowerCase();
}

//增加日期
function dateAdd(date, number, unit) {
  switch (unit) {
    case "y": {
        date.setFullYear(date.getFullYear() + number);
        return date;
    }
    case "q": {
        date.setMonth(date.getMonth() + number * 3);
        return date;
    }
    case "m": {
        date.setMonth(date.getMonth() + number);
        return date;
    }
    case "w": {
        date.setDate(date.getDate() + number * 7);
        return date;
    }
    case "d": {
        date.setDate(date.getDate() + number);
        return date;
    }
    case "h": {
        date.setHours(date.getHours() + number);
        return date;
    }
    case "mi": {
        date.setMinutes(date.getMinutes() + number);
        return date;
    }
    case "s": {
        date.setSeconds(date.getSeconds() + number);
        return date;
    }
    default: {
        date.setDate(d.getDate() + number);
        return date;
    }
  }

}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  DateAddDay: DateAddDay,
  FirstDayInThisWeek: FirstDayInThisWeek,
  type: Type,
  addZero: formatNumber,
  simpleTime:simpleTime,
  formatDateTime:formatDateTime,
  dateAdd:dateAdd
}
