export const getStockModifierName = (record) => {
    return String(record?.user_name ?? '').trim() || 'Not recorded';
};
