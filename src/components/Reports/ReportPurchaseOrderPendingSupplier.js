import React from 'react';
import OrderSupplierTransactionService from '../OrderSupplierTransaction/OrderSupplierTransactionService';
import PurchaseOrderReport from './ReportPurchaseOrderList';

const fetchPendingSupplier = (filters) =>
    OrderSupplierTransactionService.fetchPendingPOSupplier(filters);

const ReportPurchaseOrderPendingSupplier = () => (
    <PurchaseOrderReport
        fetchReport={fetchPendingSupplier}
        title="Supplier orders in progress"
        description="Track purchase orders that have been sent and are still being processed by suppliers."
        emptyMessage="No supplier orders are currently in progress"
        allowDelete={false}
    />
);

export default ReportPurchaseOrderPendingSupplier;
