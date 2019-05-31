function getDateTimeString() {
  const date = new Date();
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date
      .getDate()
      .toString()
      .padStart(2, "0") +
    ":" +
    date
      .getHours()
      .toString()
      .padStart(2, "0") +
    ":" +
    date
      .getMinutes()
      .toString()
      .padStart(2, "0") +
    ":" +
    date
      .getSeconds()
      .toString()
      .padStart(2, "0")
  );
}

function parseString(inStr) {
  outStr = inStr.replace(/>/g, '"');
  outStr = outStr.replace(/</g, '"');
  return outStr;
}

function convToDD(deg, min) {
  return deg + min / 60;
}

module.exports.getDateTimeString = getDateTimeString;
module.exports.parseString = parseString;
module.exports.convToDD = convToDD;
