/**
 * install library first
**/

function test_LoadCsvFromDrive() {
  const csvId = "1Vy2m_FEnbMxwuvy4PNKWvX0ruE0rwPDO";

  const file = DriveApp.getFileById(csvId);
  const csvContent = file.getBlob().getDataAsString();
  const data = Utilities.parseCsv(csvContent);

  const tableTypes = BQ.detectBqDataTypes(data);
  const tableName = BQ.normalizeValue(file.getName());

  const methods = BQ.getUpdateMethods();
  const loadSets = new BQ.TableLoadConstructor()
    .setProject("maxmakhrov") // CHANGE to cloud project id
    .setDataset("test_tables")
    .setTable(tableName)
    .setData(data)
    .buildSchema(tableTypes)
    .setMethod(methods.rewrite)
    .get();

  BQ.loadDataToBigQuery(loadSets);

}


function test_loadTableToBigQuery() {
  const data = [
    ["name", "age"],
    ["max", 34],
    ["liu", 33]
  ];
  const types = BQ.getDataTypes();
  const tableTypes = [
    types.STRING,
    types.INTEGER
  ];

  const methods = BQ.getUpdateMethods();
  const loadSets = new BQ.TableLoadConstructor()
    .setProject("maxmakhrov") // CHANGE to cloud project id
    .setDataset("test_tables")
    .setTable("test")
    .setData(data)
    .buildSchema(tableTypes)
    .setMethod(methods.rewrite)
    .get();

  
  BQ.loadDataToBigQuery(loadSets);

}
