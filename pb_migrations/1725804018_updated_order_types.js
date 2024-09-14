/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i1gwyx93358ebam")

  collection.listRule = "@request.auth.id != \"\" && created > \"2022-01-01 00:00:00\""
  collection.viewRule = "@request.auth.id != \"\" && created > \"2022-01-01 00:00:00\""
  collection.createRule = "@request.auth.id != \"\" && created > \"2022-01-01 00:00:00\""
  collection.updateRule = "@request.auth.id != \"\" && created > \"2022-01-01 00:00:00\""
  collection.deleteRule = "@request.auth.id != \"\" && created > \"2022-01-01 00:00:00\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i1gwyx93358ebam")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
