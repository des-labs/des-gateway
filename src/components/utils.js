
export const validateEmailAddress = function(emailStr) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(emailStr).toLowerCase());
}

export const convertToLocalTime = function(datetimeString) {

  let inputDateTime = Date.parse(datetimeString);
  let timeOffsetSecondsUTC = (new Date()).getTimezoneOffset()*60*1000;
  let displayTime = new Date(inputDateTime-timeOffsetSecondsUTC);
  let convertedDateTime = 
    displayTime.getFullYear() + "/" + (((displayTime.getMonth()+1) < 10)?"0":"") + (displayTime.getMonth()+1) + "/" + ((displayTime.getDate() < 10)?"0":"") + displayTime.getDate()
    + ' ' +
    ((displayTime.getHours() < 10)?"0":"") + displayTime.getHours() +":"+ ((displayTime.getMinutes() < 10)?"0":"") + displayTime.getMinutes() +":"+ ((displayTime.getSeconds() < 10)?"0":"") + displayTime.getSeconds();
  return convertedDateTime;
}