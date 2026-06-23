export const getTransactionVipCustomers = (transaction) => {
    if (!transaction) {
        return [];
    }

    if (Array.isArray(transaction.vip_customers)) {
        return transaction.vip_customers.filter(vipCustomer => vipCustomer && vipCustomer.vip_name);
    }

    if (transaction.vip_name) {
        return [{
            vip_customer_transaction_id: transaction.vip_customer_transaction_id,
            vip_customer_id: transaction.vip_customer_id,
            vip_name: transaction.vip_name,
            vip_color: transaction.vip_color
        }];
    }

    return [];
}

export const getPrimaryTransactionVipCustomer = (transaction) => {
    const vipCustomers = getTransactionVipCustomers(transaction);
    return vipCustomers.length > 0 ? vipCustomers[0] : null;
}

export const getTransactionVipCustomerNames = (transaction) => {
    return getTransactionVipCustomers(transaction)
        .map(vipCustomer => vipCustomer.vip_name)
        .join(", ");
}
