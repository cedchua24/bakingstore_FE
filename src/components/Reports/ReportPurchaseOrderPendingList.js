import React from 'react';
import OrderSupplierTransactionService from '../OrderSupplierTransaction/OrderSupplierTransactionService';
import PurchaseOrderReport from './ReportPurchaseOrderList';

const fetchPendingPayment = (filters) =>
    OrderSupplierTransactionService.fetchPendingOrderSupplier(filters);

const ReportPurchaseOrderPendingList = () => (
    <PurchaseOrderReport
        fetchReport={fetchPendingPayment}
        title="Purchase orders pending payment"
        description="Review received purchase orders that still have an outstanding payment balance."
        emptyMessage="No purchase orders have pending payments"
        allowDateEdit={false}
        allowDelete={false}
    />
);

export default ReportPurchaseOrderPendingList;
