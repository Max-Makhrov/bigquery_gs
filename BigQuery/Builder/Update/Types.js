function getDatabaseMainTypes_() {
  return {
    STRING: "STRING",
    INTEGER: "INTEGER",
    FLOAT64: "FLOAT64",
    NUMERIC: "NUMERIC",
    DATE: "DATE",
    DATETIME: "DATETIME",
    BOOLEAN: "BOOLEAN"
  }
}


function getCommonDataTypesMap_() {
  const typesMap = {
    "date": "date",
    "datetime": "datetime",
    "number": "number",
    "string": "string",
    "boolean": "boolean"
  }
  return typesMap;
}

/**
 * @param {String} field
 * @param {String} value
 * @param {String} dataType - common datatype 
 *                           (for simplicity we do not use BQ types)
 * 
 * @returns {String}
 */
function getUpdateFieldValue_(field, value, dataType) {
  const allTypes = getCommonDataTypesMap_();
  let delimiter = "'";
  if (dataType === allTypes.boolean || dataType === allTypes.number || value === null) {
    delimiter = "";
  } else {
    value = value
      .replace(/''/g, '"')
      .replace(/'/g, "\\'")
      .replace(/\n$/g, '')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\n")
      ;
  }
  if ([allTypes.date, allTypes.datetime, allTypes.number, allTypes.boolean].indexOf(dataType) > -1 && value == "") {
    delimiter = "";
    value = null;
  }
  return `${field} = ${delimiter}${value}${delimiter}`;
}

/**
 * @param {Array<Array>} data
 * @param {Object} [options]
 * 
 * @returns {Array<String>} types
 */
function detectBqDataTypes_(data) {
  const columnTypes = [];
  const typeMapping = getDatabaseMainTypes_();
  const dataRows = data.slice(1);

  for (let i = 0; i < data[0].length; i++) {
    const values = dataRows.map(row => row[i]).filter(elt => elt !== "");

    if (values.length === 0) {
      columnTypes[i] = typeMapping.STRING;
    } else if (values.every(value => /^\d+$/.test(value))) {
      columnTypes[i] = typeMapping.INTEGER;
    } else if (values.every(value => /^\d+(\.\d{,9})?$/.test(value))) {
      columnTypes[i] = typeMapping.NUMERIC;
    } else if (values.every(value => /^\d+(\.\d+)?$/.test(value))) {
      columnTypes[i] = typeMapping.FLOAT64;
    } else if (values.every(checkDate_)) {
      columnTypes[i] = typeMapping.DATE;
    } else if (values.every(checkDateTime_)) {
      columnTypes[i] = typeMapping.DATETIME;
    } else if (values.every(value => value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
      columnTypes[i] = typeMapping.BOOLEAN;
    } else {
      columnTypes[i] = typeMapping.STRING;
    }
  }

  return columnTypes;
}

function checkDate_(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function checkDateTime_(value) {
  return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value);
}