/**
 * @param {BQLoadJobSets} sets
 */
function getBQLoadJob_(sets) {
  let loadJob = {
    configuration: {
      load: {
        destinationTable: {
          projectId: sets.projectId,
          datasetId: sets.datasetId,
          tableId: sets.tableId
        },
        autodetect: true,  // Infer schema from contents.
        writeDisposition: sets.update_method,
        skipLeadingRows: 1,
      }
    }
  };
  if (sets.schema) {
    loadJob.configuration.load.autodetect = false;
    loadJob.configuration.load.schema = sets.schema;
  }
  return loadJob;
}