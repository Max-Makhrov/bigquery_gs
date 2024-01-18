/**
 * @author Max Makhrov
 * 
 * Install
 *   1. Enable BigQuery API in advanced services
 *   2. See `Tests.gs` for code samples
 */

function getUpdateMethods() {
  return getUpdateMethods_();
}

function getDataTypes() {
  return getDatabaseMainTypes_();
}



/**
 * @constructor
 */
function TableLoadConstructor() {
  const self = this;
  const methods = getUpdateMethods();

  /**
   * @method
   * @param {String} projectId
   */
  self.setProject = function(projectId) {
    self.projectId = projectId;
    return self;
  }
  /**
   * @method
   * @param {String} datasetId
   */
  self.setDataset = function(datasetId) {
    self.datasetId = datasetId;
    return self;
  }
  /**
   * @method
   * @param {String} datasetId
   */
  self.setTable = function(tableName) {
    self.tableId = tableName;
    return self;
  }
  /**
   * @method
   * @param {Array<Array>} dataRows
   */
  self.setData = function(dataRows) {
    dataRows[0] = normalizeHeaders_(dataRows[0]);
    self.rows = dataRows;
    return self;
  }
  /**
   * @method
   * @param {BigQuerySchema} schema
   */
  self.setFieldsSchema = function(schema) {
    self.schema = schema;
    return self;
  }
  /**
   * @method
   * @param {String} method
   */
  self.setMethod = function(updateMethod) {
    self.update_method = updateMethod;
    return self;
  }
  self.buildSchema = function(types) {
    if (!self.rows) {
      throw new Error("Set data with headers first");
    }
    const headers = self.rows[0];
    const schema = getBigQueryFieldsSchema_(headers, types);
    self.setFieldsSchema(schema);
    return self;
  }

  self.get = function() {
    /** @type BQLoadJobSets */
    const tableSchema = {
      datasetId: self.datasetId,
      projectId: self.projectId,
      tableId: self.tableId,
      rows: self.rows,
      update_method: self.update_method,
      schema: self.schema
    }
    return tableSchema;
  }

}

/**
 * @param {BQLoadJobSets} sets
 */
function loadDataToBigQuery(sets) {
  return loadBigQueryData_(sets);
}

/**
 * @param {Array<Array>} data
 * @param {Object} [options]
 * 
 * @returns {Array<String>} types
 */
function detectBqDataTypes(data) {
  return detectBqDataTypes_(data);
}

/**
 * @param {String} value
 * @returns {String}
 */
function normalizeValue(value) {
  return normalizeValue_(value);
}