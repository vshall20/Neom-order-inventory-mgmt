const PocketBase = require('pocketbase/cjs')

const pb = new PocketBase('http://127.0.0.1:8090');

const orderStatuses = [
    { order_type_name: "Purchase Order", status_name: "Draft", order_index: 1 },
    { order_type_name: "Purchase Order", status_name: "Submitted", order_index: 2 },
    { order_type_name: "Purchase Order", status_name: "Approved", order_index: 3 },
    { order_type_name: "Purchase Order", status_name: "Rejected", order_index: 4 },
    { order_type_name: "Purchase Order", status_name: "Completed", order_index: 5 },
    { order_type_name: "Sales Order", status_name: "Draft", order_index: 1 },
    { order_type_name: "Sales Order", status_name: "Submitted", order_index: 2 },
    { order_type_name: "Sales Order", status_name: "Approved", order_index: 3 },
    { order_type_name: "Sales Order", status_name: "Rejected", order_index: 4 },
    { order_type_name: "Sales Order", status_name: "Completed", order_index: 5 },
];

async function addOrderStatuses() {
    try {
        for (const status of orderStatuses) {
            await pb.collection('order_statuses').create(status);
            console.log(`Added status: ${status.order_type_name} - ${status.status_name}`);
        }
        console.log('All order statuses have been added successfully.');
    } catch (error) {
        console.error('Error adding order statuses:', error);
    }
}

addOrderStatuses();
