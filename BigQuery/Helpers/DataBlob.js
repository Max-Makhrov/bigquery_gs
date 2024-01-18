function convertData2BqBlob_(rows) {
  const getRidOfNulls_ = (elt) => elt === null ? '' : elt;

  let csvRows = rows.map(values =>
      // We use JSON.stringify() to add "quotes to strings",
      // but leave numbers and booleans without quotes.
      // If a string itself contains quotes ("), JSON escapes them with
      // a backslash as \" but the CSV format expects them to be
      // escaped as "", so we replace all the \" with "".
      values.map(value => JSON.stringify(getRidOfNulls_(value)).replace(/\\"/g, '""'))
  );
  let csvData = csvRows.map(values => values.join(',')).join('\n');
  // console.log(csvData)
  let blob = Utilities.newBlob(csvData, 'application/octet-stream');
  return blob;
}
