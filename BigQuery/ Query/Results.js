/**
 * @typedef {Object} BigQueryReturnRow
 * @prop {Array<BigQueryReturnRowValue} f
 */
/**
 * @typedef {Object} BigQueryReturnRowValue
 * @prop {*} v
 */

/**
 * @param {Array<BigQueryReturnRow>} rows
 * @param {Array<TableFieldSchema>} fields
 * @param {BiqQueryNewQueryOptions} [options]
 * 
 * @returns {Array}
 */
function parseBigQueryResults_(rows, fields, options = {}) {
  if (options.returnObject) {
    if (!rows || !rows.length) {
      return {};
    }
    let res = [], row = {}; 
    let rowValues;
    for (let i = 0; i < rows.length; i++) {
      rowValues = rows[i].f;
      row = {}
      for (let ii = 0; ii < rowValues.length; ii++) {
        row[fields[ii].name] = rowValues[ii].v;
      }
      res.push(row);
    }
    return res;
  }
  if (!rows) {
    return [[]];
  }

  let data = null;
  let headers;
  if (!options.skipHeaders) {
    headers = fields.map(function(field) {
      return field.name;
    });
    data = [headers];
  }

  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].f;
    data[i + 1] = new Array(cols.length);
    for (let j = 0; j < cols.length; j++) {
      data[i + 1][j] = cols[j].v;
    }
  }
  return data;
}