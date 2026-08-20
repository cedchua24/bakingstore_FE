const hasDisplayValue = (value) => {
    const normalizedValue = String(value ?? '').trim();
    return normalizedValue !== '' && normalizedValue !== '0';
};

export const getPaymentLabelParts = (payment = {}) => {
    const paymentAccount = payment.payment_type_po || payment.payment_account || {};
    const bank = payment.bank || paymentAccount.bank || {};
    const bankName = payment.bank_name || bank.bank_name || bank.name;
    const accountName = payment.account_name || paymentAccount.account_name || payment.payment_type;
    const accountNumber = payment.account_number || paymentAccount.account_number;
    const seenParts = new Set();
    const accountParts = [bankName, accountName, accountNumber]
        .filter(hasDisplayValue)
        .filter((value) => {
            const normalizedValue = String(value).trim().toLowerCase();
            if (seenParts.has(normalizedValue)) {
                return false;
            }
            seenParts.add(normalizedValue);
            return true;
        });

    if (accountParts.length) {
        return accountParts;
    }

    return [payment.payment_type].filter(hasDisplayValue);
};

export const formatPaymentLabel = (payment = {}) => {
    return getPaymentLabelParts(payment).join(' · ');
};
