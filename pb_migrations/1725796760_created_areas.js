/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "cei8j1mgjvbrj0u",
    "created": "2024-09-08 11:59:20.217Z",
    "updated": "2024-09-08 11:59:20.217Z",
    "name": "areas",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "994c1xyg",
        "name": "name",
        "type": "text",
        "required": true,
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
  const collection = dao.findCollectionByNameOrId("cei8j1mgjvbrj0u");

  return dao.deleteCollection(collection);
})
