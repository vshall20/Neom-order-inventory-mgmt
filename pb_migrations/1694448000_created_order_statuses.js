migrate((db) => {
  const collection = new Collection({
    "id": "order_statuses",
    "name": "order_statuses",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "order_type_name",
        "name": "order_type_name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "status_name",
        "name": "status_name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "order_index",
        "name": "order_index",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX idx_unique_order_type_status ON order_statuses (order_type_name, status_name)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  return Dao(db).deleteCollection("order_statuses");
})
