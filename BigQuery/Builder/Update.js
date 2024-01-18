/**
 * @typedef {Object} BQUpdateSchema
 * @prop {String} projectId
 * @prop {String} datasetId
 * @prop {String} tableId
 * @prop {Array<String>} field_names
 * @prop {Array<String>} [data_types] `getCommonDataTypesMap_`
 *                       NB not BigQuery data types, but more common
 *                          data type names, to compate things
 *                       NB Not required, but makes result better
 * @prop {String} where_conditions `id = 500`, `name = 'Jhon' and sum > 500`
 */

/**
 * @param {BQUpdateSchema} schema
 * @param {Object} previousObject
 * @param {Object} currentObject
 * 
 * @returns {String}
 */
function getBigQueryUpdateQuery_(schema, previousObject, currentObject) {
  const types = schema.data_types || [];
  let typesObject = getFieldDataTypesObject_(schema.field_names, types);
  const differences = getFlatObjectsDifferences_(previousObject, currentObject, typesObject);
  if (differences.length === 0) {
    return '';
  }

  const start = `UPDATE \`${schema.projectId}.${schema.datasetId}.${schema.tableId}\` set `;

  let setStatements = [], statement;
  let field, dataType, value, schemaIndex;
  for (let i = 0; i < differences.length; i++) {
    field = differences[i].key;
    schemaIndex = schema.field_names.indexOf(field);
    if (schemaIndex === -1) {
      throw `no field ${field} in schema`;
    }
    dataType = types[schemaIndex];
    value = differences[i].current;
    statement = getUpdateFieldValue_(field, value, dataType);
    setStatements.push(statement);
  }

  const middle = setStatements.join(', ') + ' ';
  const end = 'WHERE ' + schema.where_conditions;
  let query = start + middle + end;

  query = query.replace(/\n/g, '\\n');
  
  return query;

}


