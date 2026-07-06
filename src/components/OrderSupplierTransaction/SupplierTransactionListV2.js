import React from 'react';
import PurchaseOrderReport from '../Reports/ReportPurchaseOrderList';
import OrderSupplierTransactionService from './OrderSupplierTransactionService';

const fetchSupplierTransactions = () =>
    OrderSupplierTransactionService.fetchOrderSupplierByDateV2(0);

const cancelSupplierTransaction = (id) =>
    OrderSupplierTransactionService.setToCancelTransaction(id).then((response) => {
        if (Number(response.data?.code) !== 200) {
            throw new Error(response.data?.message || 'Unable to cancel purchase order.');
        }
        return response;
    });

const canCancelTransaction = (order) => order.status === 'COMPLETED';

const SupplierTransactionListV2 = () => (
    <PurchaseOrderReport
        fetchReport={fetchSupplierTransactions}
        title="Purchase orders"
        description="Manage supplier orders, payment progress, delivery activity, and order actions."
        emptyMessage="No purchase orders found"
        showFilters={false}
        deleteOrderRequest={cancelSupplierTransaction}
        canDeleteOrder={canCancelTransaction}
        deleteActionLabel="Cancel"
        deleteDialogTitle="Cancel purchase order?"
        deleteDialogText="This will mark the completed purchase order as cancelled:"
    />
);

export default SupplierTransactionListV2;
