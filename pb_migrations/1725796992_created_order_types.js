/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "i1gwyx93358ebam",
    "created": "2024-09-08 12:03:12.631Z",
    "updated": "2024-09-08 12:03:12.631Z",
    "name": "order_types",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "cdp6xwif",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("i1gwyx93358ebam");

  return dao.deleteCollection(collection);
})
