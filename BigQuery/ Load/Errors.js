
/**
 * @param {BigQueryQueryResults} jobResults
 * 
 * @returns {String}
 */
function getBigQueryJobErrorMessage_(jobResults) {
  const errors = jobResults.status.errors;
  if (!errors) {
    // no errors ;)
    return null;
  }
  const errorCount = errors.length
  if (errorCount === 0) {
    // no errors ;)
    return null;
  }
  let errorMessages = [];
  let part = "";
  let error = null;
  let i = 0;
  let stopLooking = false;
  while (!stopLooking) {
    error = errors[i];
    part = error.reason + '. ' + error.message;
    errorMessages.push(part);
    i++;
    if ( (errorCount - 1) <= i) stopLooking = true;
    if (i > 4) stopLooking = true;
  }

  const message = errorMessages.join("\n")

  return message;
}
