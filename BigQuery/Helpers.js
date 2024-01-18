
/** @type {BigQuerySchema} */
const schema = {
  fields: [
    {
      name: "Foo",
      type: "STRING"
    }
  ]
}


/**
 * @param {Array<String>} row
 * @param {Array<String>}
 */
function normalizeHeaders_(row) {
  // Normalize the headers (first row) to valid BigQuery column names.
  // https://cloud.google.com/bigquery/docs/schemas#column_names
  
  var result = row.map(normalizeValue_);
  return result;
}

/**
 * @param {String} value
 * @returns {String}
 */
function normalizeValue_(value) {
  const reservedNames = ['year', 'month', 'day'];
  let newValue = value.toLowerCase().replace(/[^\w]+/g, '_');
  if (newValue.match(/^\d/))
    newValue = '_' + newValue;
  if (reservedNames.includes(newValue.toLowerCase())) {
    newValue += '_field'; // Append "_field" to avoid reserved names
  }
  return newValue; 
}

/**
 * @typedef {Object} BQNewDatasetSets
 * @prop {String} projectId
 * @prop {String} datasetId
 */
/**
 * Creates a dataset if it doesn't exist, otherwise does nothing.
 * 
 * @param {BQNewDatasetSets} sets
 */
function createDatasetIfDoesntExist_(sets) {
  try {
    BigQuery.Datasets.get(sets.projectId, sets.datasetId);
  } catch (err) {
    let dataset = {
      datasetReference: {
        projectId: sets.projectId,
        datasetId: sets.datasetId,
      },
    };
    try {
      BigQuery.Datasets.insert(dataset, sets.projectId);
    } catch (err) {
      console.log('error trying to add dataset: ' + err);
      return;
    }
    
    Logger.log(`Created dataset: ${sets.projectId}:${sets.datasetId}`);
  }
}