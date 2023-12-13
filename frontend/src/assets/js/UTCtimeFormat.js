// UTC时间格式转为北京时间

const dateFormat = function (timestamp) {
  // 转为正常的时间格式 年-月-日 时:分:秒
  var Tpos = timestamp.indexOf("T");
  var Zpos = timestamp.indexOf("Z");
  var yearMonthDay = timestamp.substr(0, Tpos);
  var hourMinuteSecond = timestamp.substr(Tpos + 1, Zpos - Tpos - 1);
  var newDatetime = yearMonthDay + " " + hourMinuteSecond; // 2017-03-31 08:02:06
  // 增加8个小时，北京时间比utc时间多八个时区
  var timestamp1 = (new Date(Date.parse(newDatetime)).getTime() / 1000) + 8 * 60 * 60;
  // 时间戳转为时间
  var beijingDatetime = new Date(parseInt(timestamp1) * 1000)
    .toLocaleString()
    .replace(/年|月/g, "-")
    .replace(/日/g, " ");
  return beijingDatetime; // 2017-03-31 16:02:06
}
module.exports = dateFormat
