/**
 * @typedef {Object} BiqQueryNewQueryOptions
 * @prop {Boolean} [useLegacySql] = false
 * @prop {Boolean} [skipHeaders] = false
 * @prop {Boolean} [returnObject] = false
 */

/**
 * @typedef {Object} BigQueryQueryResults
 * @prop {string} kind
 * @prop {TableSchema} schema
 * @prop {JobReference} jobReference
 * @prop {string} totalRows
 * @prop {string} pageToken
 * @prop {Array<Object>} rows
 * @prop {string} totalBytesProcessed
 * @prop {boolean} jobComplete
 * @prop {Array<ErrorProto>} errors
 * @prop {boolean} cacheHit
 * @prop {string} numDmlAffectedRows
 * @prop {SessionInfo} sessionInfo
 * @prop {DmlStats} dmlStats
 */

/**
 * @typedef {Object} TableSchema
 * @prop {Array<TableFieldSchema>} fields
 */

/**
 * @typedef {Object} TableFieldSchema
 * @prop {string} name
 * @prop {string} type
 * @prop {string} mode
 * @prop {Array<TableFieldSchema>} fields
 * @prop {string} description
 * @prop {{ names: Array<string> }} policyTags
 * @prop {string} maxLength
 * @prop {string} precision
 * @prop {string} scale
 * @prop {RoundingMode} roundingMode
 * @prop {string} collation
 * @prop {string} defaultValueExpression
 */

/**
 * @typedef {Object} RoundingMode
 * @prop {string} mode
 */

/**
 * @typedef {Object} JobReference
 * @prop {string} projectId
 * @prop {string} jobId
 * @prop {string} location
 */

/**
 * @typedef {Object} ErrorProto
 * @prop {string} reason
 * @prop {string} location
 * @prop {string} debugInfo
 * @prop {string} message
 */

/**
 * @typedef {Object} SessionInfo
 * @prop {string} sessionId
 */

/**
 * @typedef {Object} DmlStats
 * @prop {string} insertedRowCount
 * @prop {string} deletedRowCount
 * @prop {string} updatedRowCount
 */


/**
 * Run for `select/insert/deleteupdate` queries
 * 
 * @param {String} query
 * @param {String} projectId
 * @param {BiqQueryNewQueryOptions} [options]
 * 
 * @returns {Array<Array>}
 */
function getBigQueryResults_(query, projectId, options = {}) {
  const useLegacySql = options.useLegacySql || false;
  const request = {
    query,
    useLegacySql
  };
  /** @type BigQueryQueryResults */
  let queryResults = BigQuery.Jobs.query(request, projectId);
  const jobId = queryResults.jobReference.jobId;
  let sleepTimeMs = 100;
  let retiresLeft = 8;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    try {
      queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId, { 
        pageToken: queryResults.pageToken, 
        location: queryResults.jobReference.location 
        });
    } catch (err) {
      retiresLeft--;
      if (retiresLeft === 0) {
        throw err;
      }
    }
  }

  let rows = queryResults.rows;
  while (queryResults.pageToken) {
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId, {
      pageToken: queryResults.pageToken,
      location: queryResults.jobReference.location
    });
    rows = rows.concat(queryResults.rows);
  }

  const fields = queryResults.schema.fields;

  return parseBigQueryResults_(rows, fields, options);

}