const amount = (value) => Number(value || 0);

export const mergeDailyReceivedPayments = (legacyRows = [], centralReport = {}, options = {}) => {
    const { preserveSales = false, preserveCount = false, includeCentralOnly = true } = options;
    const rows = new Map((legacyRows || []).map((row) => [String(row.date).slice(0, 10), { ...row }]));

    (centralReport.data || []).forEach((central) => {
        const date = String(central.date).slice(0, 10);
        if (!rows.has(date) && !includeCentralOnly) return;
        const legacy = rows.get(date) || { date, total_cash: 0, total_online: 0, total_sales: 0, total_count: 0 };
        rows.set(date, {
            ...legacy,
            total_cash: amount(legacy.total_cash) + amount(central.total_cash),
            total_online: amount(legacy.total_online) + amount(central.total_online),
            total_sales: preserveSales
                ? amount(legacy.total_sales)
                : amount(legacy.total_sales) + amount(central.total_sales),
            total_count: preserveCount
                ? amount(legacy.total_count)
                : amount(legacy.total_count) + amount(central.total_count),
            central_accounts: central.accounts || [],
            central_refunds: amount(central.refunds),
        });
    });

    return [...rows.values()].sort((first, second) => String(second.date).localeCompare(String(first.date)));
};

export const centralMonthlyTotals = (centralReport = {}) => (centralReport.data || []).reduce((months, day) => {
    const month = String(day.date).slice(0, 7);
    if (!months[month]) months[month] = { cash: 0, online: 0, sales: 0, refunds: 0, accounts: [] };
    months[month].cash += amount(day.total_cash);
    months[month].online += amount(day.total_online);
    months[month].sales += amount(day.total_sales);
    months[month].refunds += amount(day.refunds);
    months[month].accounts.push(...(day.accounts || []));
    return months;
}, {});

export const yearRange = (year) => ({
    dateFrom: `${year}-01-01`,
    dateTo: `${year}-12-31`,
});

export const comparisonRange = (month) => {
    const [year, monthNumber] = String(month).split('-').map(Number);
    const currentStart = new Date(Date.UTC(year, monthNumber - 1, 1));
    const rangeStart = new Date(Date.UTC(year, monthNumber - 4, 1));
    const rangeEnd = new Date(Date.UTC(year, monthNumber, 0));
    const format = (date) => date.toISOString().slice(0, 10);
    return { dateFrom: format(rangeStart), dateTo: format(rangeEnd), currentMonth: format(currentStart).slice(0, 7) };
};

export const centralAccountBreakdown = (centralReport = {}) => {
    const accounts = new Map();
    (centralReport.data || []).flatMap((day) => day.accounts || []).forEach((account) => {
        const key = `${account.financial_account_id}-${account.payment_method_id}`;
        const current = accounts.get(key) || { ...account, amount: 0 };
        current.amount = amount(current.amount) + amount(account.amount);
        accounts.set(key, current);
    });
    return [...accounts.values()].filter((account) => Math.abs(account.amount) > 0.00001);
};

