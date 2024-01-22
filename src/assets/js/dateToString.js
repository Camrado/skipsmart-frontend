function dateToString(date) {
  let day = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  let year = date.getFullYear();

  if (+day < 10) {
    day = `0${day}`;
  }
  if (+month < 10) {
    month = `0${month}`;
  }

  let stringDate = `${year}-${month}-${day}`;
  return stringDate;
}

module.exports = dateToString;
