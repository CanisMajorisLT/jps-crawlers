

// given mongodb model
// parses all of its records
// and aggregates them by records id
// where aggregation means that given N number of records with same ID, they are
// joined into one record, that displays all main fields
// as well as update times
// changes [if any] over time
// also extracts fields for indexing and searching [look up lunr.js, Elasticlunr.js]