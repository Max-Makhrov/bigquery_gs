function getUpdateMethods_() {
  return {
    rewrite: 'WRITE_TRUNCATE',
    append: 'WRITE_APPEND'
  };
}

/**
 * @typedef {Object} BQLoadJobSets
 * @prop {String} update_method `getUpdateMethods_`
 * @prop {String} projectId
 * @prop {String} datasetId
 * @prop {String} tableId
 * @prop {Array<Array>} rows - first row is a header
 * @prop {BigQuerySchema} [schema]
 */

/**
 * Run to load data fast with 2 options: rewrite or append data
 * 
 * @param {BQLoadJobSets} sets  sets.rows - 2d array, first row is a header
 * 
 * @returns {String} result
 */
function loadBigQueryData_(sets) {
  createDatasetIfDoesntExist_(sets)
  sets.rows[0] = normalizeHeaders_(sets.rows[0]);
  sets.blob = convertData2BqBlob_(sets.rows)
  var loadJob = getBQLoadJob_(sets);
  // /** @type BigQueryQueryResults */
  let jobResults = BigQuery.Jobs.insert(loadJob, sets.projectId, sets.blob);
  const jobId = jobResults.jobReference.jobId;
  const seachOptions = {
    location: jobResults.jobReference.location,
  };
  console.log(jobId);
  let sleepTimeMs = 100;

  while (jobResults.status.state !== 'DONE') {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    jobResults = BigQuery.Jobs.get(sets.projectId, jobId, seachOptions);
  }

  const errorMessage = getBigQueryJobErrorMessage_(jobResults);
  if (errorMessage) throw new Error(errorMessage);

  var result = 'Load job started. ' + sets.projectId + '.' + sets.datasetId + '.' + sets.tableId;
  console.log(result);
  return result;
}