# BigQuery gs
For ease of work in `Apps Script`.

## Install

 1. Install BigQuery service
 2. Install library [`1EUrnmqZI7rmnI5ztn-qEV8hPoxw3H69PypFOZspFFyTCHUtfYIn9qLuy`](https://script.google.com/u/0/home/projects/1EUrnmqZI7rmnI5ztn-qEV8hPoxw3H69PypFOZspFFyTCHUtfYIn9qLuy/edit)

## Usage

Add `BigQuery` service.

Using library with identifier `BQ`:

```js
/**
 * Creates new table in BigQuery based on your csv file
 * table will take the name of csv
 * data types will be detected automatically
 * data in csv will be cleaned if it has extra blank row in the end
 */
function test_LoadScvFromDrive() {
  const csvId = "1Vy2m_FEnbMxwuvy4PNKWvX0ruE0rwPDO";

  const file = DriveApp.getFileById(csvId);
  const csvContent = file.getBlob().getDataAsString();
  const data = Utilities.parseCsv(csvContent);

  const tableName = BQ.normalizeValue(file.getName());

  const methods = BQ.getUpdateMethods();
  const loadSets = new BQ.TableLoadConstructor()
    .setProject("maxmakhrov") // CHANGE
    .setDataset("test_tables") // CHANGE
    .setTable(tableName)
    .setData(data)
    .setMethod(methods.rewrite)
    .get();

  BQ.loadDataToBigQuery(loadSets);
}


/**
 * Rewrites data in BigQuery
 * Creates new table if needed
 * Use `methods.rewrite` to rewrite data
 * Use `methods.append` to add data to the table
 */
function test_updateMethods() {
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
    .setProject("maxmakhrov") // CHANGE
    .setDataset("test_tables") // CHANGE
    .setTable("test")           // CHANGE
    .setData(data)
    .buildSchema(tableTypes)
    .setMethod(methods.rewrite)
    .get();

  BQ.loadDataToBigQuery(loadSets);
}


/**
 * Creates and executs SQL with parameters
 * Usuful if your query string is too big and you've reached the limit
 */
function test_parametrizedQuery() {
  // "max" or age > 30
  const sqlQuery = `SELECT * 
        FROM \`maxmakhrov.test_tables.test\` where 
        name = ?
        OR age > ? 
        AND age in UNNEST(?)`;
  const types = BQ.getDataTypes();
  /** @type BiqQueryNewQueryOptions */
  const options = {
    returnObject: true,
    // https://cloud.google.com/bigquery/docs/reference/rest/v2/QueryParameter
    queryParameters: [
      BQ.getBigQueryQueryParameter("max", types.STRING),
      BQ.getBigQueryQueryParameter(30, types.INTEGER),
      BQ.getBigQueryQueryArrayParameter([34, 33], types.INTEGER),
    ]
  }
  const projectId = "maxmakhrov";
  const result = BQ.getBigQueryResults(sqlQuery, projectId, options);
  console.log(result);
}


/**
 * Merges table with new data in delete-load way
 *  1. Deletes same ids from BQ
 *  2. Loads new data
 */
function test_getBQSameIdsData() {
  const data = [
    ["name", "age"],
    ["XXX", 34],
    ["YYY", 33],
    ["FOO", 13],
  ];

  const bqloader = new BQ.TableLoadConstructor()
    .setProject("maxmakhrov") // CHANGE
    .setDataset("test_tables") // CHANGE
    .setTable("test")           // CHANGE
    .setData(data);
  
  bqloader.deleteAppend(1); // CHANGE `1` to id field index
}
```
