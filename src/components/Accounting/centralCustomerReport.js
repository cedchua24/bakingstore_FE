export const accountingDateRange = (dateFrom = "", dateTo = "") => ({
    dateFrom: dateFrom || "2000-01-01",
    dateTo: dateTo || "2100-12-31",
});

export const monthDateRange = (month) => {
    const [year, monthNumber] = String(month || "").split("-").map(Number);
    if (!year || !monthNumber) return accountingDateRange();
    const lastDay = new Date(year, monthNumber, 0).getDate();
    return {
        dateFrom: `${year}-${String(monthNumber).padStart(2, "0")}-01`,
        dateTo: `${year}-${String(monthNumber).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
    };
};

export const rollingMonthDateRange = (month, monthsBack = 3) => {
    const [year, monthNumber] = String(month || "").split("-").map(Number);
    if (!year || !monthNumber) return accountingDateRange();
    const start = new Date(year, monthNumber - 1 - monthsBack, 1);
    const end = monthDateRange(month).dateTo;
    return {
        dateFrom: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-01`,
        dateTo: end,
    };
};

export const centralCustomerTotal = (report, customerId) => (report?.data || []).reduce(
    (total, day) => total + (day.customers || [])
        .filter(customer => String(customer.external_customer_id) === String(customerId))
        .reduce((sum, customer) => sum + Number(customer.total_sales || 0), 0),
    0
);

export const centralOrderTotal = (report, orderId) => (report?.data || []).reduce(
    (total, day) => total + (day.orders || [])
        .filter(order => String(order.external_order_id) === String(orderId))
        .reduce((sum, order) => sum + Number(order.total_sales || 0), 0),
    0
);

export const centralCustomersById = (report) => {
    const totals = {};
    (report?.data || []).forEach(day => (day.customers || []).forEach(customer => {
        const key = String(customer.external_customer_id);
        totals[key] = Number(totals[key] || 0) + Number(customer.total_sales || 0);
    }));
    return totals;
};

export const centralCustomerMonthTotals = (report) => {
    const totals = {};
    (report?.data || []).forEach(day => {
        const month = String(day.date || "").slice(0, 7);
        (day.customers || []).forEach(customer => {
            const key = `${customer.external_customer_id}:${month}`;
            totals[key] = Number(totals[key] || 0) + Number(customer.total_sales || 0);
        });
    });
    return totals;
};

export const mergeCentralVipHistory = (legacyReport, centralReport) => {
    if (!legacyReport) return legacyReport;
    const central = centralCustomerMonthTotals(centralReport);
    const currentMonth = legacyReport.report_month?.month;
    const data = (legacyReport.data || []).map(customer => {
        const customerId = String(customer.customer_id);
        const currentCentral = Number(central[`${customerId}:${currentMonth}`] || 0);
        const previousMonths = (customer.previous_months || []).map(item => ({
            ...item,
            paid_amount: Number(item.paid_amount || 0) + Number(central[`${customerId}:${item.month}`] || 0),
        }));
        const currentPaid = Number(customer.current_paid || 0) + currentCentral;
        const previousAverage = previousMonths.length
            ? previousMonths.reduce((sum, item) => sum + Number(item.paid_amount || 0), 0) / previousMonths.length
            : 0;
        const lastMonthPaid = Number(previousMonths[0]?.paid_amount || 0);
        return {
            ...customer,
            current_paid: currentPaid,
            paid_amount: currentPaid,
            previous_months: previousMonths,
            upcoming: previousMonths,
            last_month_paid: lastMonthPaid,
            three_month_average_paid: previousAverage,
            average_monthly_paid: Number(customer.average_monthly_paid || 0) + previousMonths.reduce(
                (sum, item) => sum + Number(central[`${customerId}:${item.month}`] || 0), 0
            ) / Math.max(previousMonths.length, 1),
            paid_vs_last_month: currentPaid - lastMonthPaid,
            paid_vs_three_month_average: currentPaid - previousAverage,
        };
    });
    const previousMonths = (legacyReport.previous_months || []).map(item => ({
        ...item,
        paid_amount: data.reduce((sum, customer) => sum + Number(
            customer.previous_months?.find(month => month.month === item.month)?.paid_amount || 0
        ), 0),
    }));
    const currentMonthPaid = data.reduce((sum, customer) => sum + Number(customer.current_paid || 0), 0);
    const centralPreviousAverage = previousMonths.length
        ? previousMonths.reduce((sum, item) => sum + data.reduce((customerSum, customer) => (
            customerSum + Number(central[`${customer.customer_id}:${item.month}`] || 0)
        ), 0), 0) / previousMonths.length
        : 0;
    const averageMonthlySales = Number(legacyReport.average_monthly_sales || 0) + centralPreviousAverage;
    return {
        ...legacyReport,
        data,
        current_month_paid: currentMonthPaid,
        previous_months: previousMonths,
        average_monthly_sales: averageMonthlySales,
        amount_needed: Math.max(averageMonthlySales - currentMonthPaid, 0),
    };
};
