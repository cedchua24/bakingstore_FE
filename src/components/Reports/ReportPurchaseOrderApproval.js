import React from 'react';
import OrderSupplierTransactionService from '../OrderSupplierTransaction/OrderSupplierTransactionService';
import PurchaseOrderReport from './ReportPurchaseOrderList';

const fetchPendingApproval = (filters) =>
    OrderSupplierTransactionService.fetchPendingApproval(filters);

const ReportPurchaseOrderApproval = () => (
    <PurchaseOrderReport
        fetchReport={fetchPendingApproval}
        title="Purchase orders pending approval"
        description="Review purchase orders that are waiting for an approval decision."
        emptyMessage="No purchase orders are waiting for approval"
        allowDelete={false}
    />
);

export default ReportPurchaseOrderApproval;
