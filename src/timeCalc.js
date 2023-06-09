function calcWriteTime(time) {
  const DAYMS = 86400000;
  const ONEYEAR = 31536000000;
  let current = new Date();
  let diff = current.getTime() - time.getTime();

  let wMonth = time.getMonth() + 1;
  let wDate = time.getDate();
  let wHours = time.getHours();
  let wMinute = time.getMinutes();

  if (wMonth < 10) wMonth = "0" + (time.getMonth() + 1);
  if (wDate < 10) wDate = "0" + time.getDate();
  if (wHours < 10) wHours = "0" + time.getHours();
  if (wMinute < 10) wMinute = "0" + time.getMinutes();

  if (diff < DAYMS) {
    return `${wHours}:${wMinute} `;
  } else if (diff < ONEYEAR) {
    return `${wMonth}-${wDate}`;
  } else {
    return `${time.getFullYear()}-${wMonth}-${wDate}`;
  }
}

module.exports = calcWriteTime;
