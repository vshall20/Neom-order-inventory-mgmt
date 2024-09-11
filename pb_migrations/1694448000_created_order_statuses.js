migrate((db) => {
  const collection = new Collection({
    name: 'order_statuses',
    type: 'base',
    schema: [
      {
        name: 'order_type_name',
        type: 'text',
        required: true,
      },
      {
        name: 'status_name',
        type: 'text',
        required: true,
      },
      {
        name: 'order_index',
        type: 'number',
        required: true,
      },
    ],
    indexes: [
      {
        name: 'unique_order_type_status',
        type: 'unique',
        fields: 'order_type_name,status_name',
      },
    ],
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  return Dao(db).deleteCollection('order_statuses');
})
