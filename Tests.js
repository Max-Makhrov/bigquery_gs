function testLoadScvFromDrive() {
  const csvId = "1Vy2m_FEnbMxwuvy4PNKWvX0ruE0rwPDO";

  const file = DriveApp.getFileById(csvId);
  const csvContent = file.getBlob().getDataAsString();
  const data = Utilities.parseCsv(csvContent);

  const tableTypes = detectBqDataTypes(data);
  const tableName = normalizeValue_(file.getName());

  const methods = getUpdateMethods();
  const loadSets = new TableLoadConstructor()
    .setProject("maxmakhrov")
    .setDataset("test_tables")
    .setTable(tableName)
    .setData(data)
    .buildSchema(tableTypes)
    .setMethod(methods.rewrite)
    .get();

  loadDataToBigQuery(loadSets);

}


function test_updateMethods() {
  const data = [
    ["name", "age"],
    ["max", 34],
    ["liu", 33]
  ];
  const types = getDataTypes();
  const tableTypes = [
    types.STRING,
    types.INTEGER
  ];

  const methods = getUpdateMethods();
  const loadSets = new TableLoadConstructor()
    .setProject("maxmakhrov")
    .setDataset("test_tables")
    .setTable("test")
    .setData(data)
    .buildSchema(tableTypes)
    .setMethod(methods.rewrite)
    .get();

  
  loadDataToBigQuery(loadSets);

}
