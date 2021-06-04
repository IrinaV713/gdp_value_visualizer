function getArrayFromTable(q) {
  let arr_table = [];

  var regexpYears = /class="time-series-table-heading">(.*?)<\/td>/g;
  var matchYears;
  var arr_years = [];

  while ((matchYears = regexpYears.exec(q))) {
    arr_years.push(matchYears[1]);
  }

  var regexpBody = /<tbody>(.*?)<\/tbody>/s;
  let body = regexpBody.exec(q);

  var regexpTableString = /<tr>(.*?)<\/tr>/gs;
  var matchString;

  let k = 0;
  while ((matchString = regexpTableString.exec(body[1]))) {
    let currentString = matchString[1];

    var country =
      /<td class="fixed-header time-series-table-country">(.*?)<\/td>/s.exec(
        currentString
      );
    var regexpValue = /<td class="time-series-table-value">(.*?)<\/td>/g;
    var matchValue;

    let i = 0;
    while ((matchValue = regexpValue.exec(currentString))) {
      if (arr_table[country[1]] == undefined) arr_table[country[1]] = [];
      arr_table[country[1]].push([arr_years[i], matchValue[1]]);
      i++;
    }
    k++;
  }
  arr_table["count"] = k;

  return arr_table;
}
