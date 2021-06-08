'use strict';

//parsing a html table to array structure
function getArrayFromTable(q) {
  let arrTable = [];

  let regexpYears = /class="time-series-table-heading">(.*?)<\/td>/g;
  let matchYears;
  let arrYears = [];

  while ((matchYears = regexpYears.exec(q))) {
    arrYears.push(matchYears[1]);
  }

  let regexpBody = /<tbody>(.*?)<\/tbody>/s;
  let body = regexpBody.exec(q);

  let regexpTableString = /<tr>(.*?)<\/tr>/gs;
  let matchString;

  while ((matchString = regexpTableString.exec(body[1]))) {
    let currentString = matchString[1];

    let country =
      /<td class="fixed-header time-series-table-country">(.*?)<\/td>/s.exec(
        currentString
      );
    let regexpValue = /<td class="time-series-table-value">(.*?)<\/td>/g;
    let matchValue;

    let i = 0;
    while ((matchValue = regexpValue.exec(currentString))) {
      if (arrTable[country[1]] == undefined) arrTable[country[1]] = [];
      arrTable[country[1]].push([arrYears[i], matchValue[1]]);
      i++;
    }
  }
  
  return arrTable;
}

