/**
 * @typedef {Object} BigQuerySchema
 * @prop {Array<BigQuerySchemaField>} fields
 */

/**
 * @typedef {Object} BigQuerySchemaField
 * @prop {String} name 
 * @prop {String} type 
 */

/**
 * @param {Array<String>} names
 * @param {Array<String>} types
 * @returns {BigQuerySchema}
 */
function getBigQueryFieldsSchema_(names, types) {
  /** @type BigQuerySchemaField */
  let fieldElement;
  let fields = [];
  for (let i = 0; i < names.length; i++) {
    fieldElement = {
      name: names[i],
      type: types[i]
    }
    fields.push(fieldElement);
  }
  return {
    fields
  }
}
