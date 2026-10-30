const numericValue = value => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
};

export const formatDecimal = value => numericValue(value).toFixed(2);

export const formatCurrency = value => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}).format(numericValue(value));
