import ShopOrderTransactionService from '../ShopOrderTransaction/ShopOrderTransactionService';
import CentralCustomerPaymentService from './CentralCustomerPaymentService';
import accountingApi, { ACCOUNTING_TOKEN_KEY, fetchAllAccountingPages } from './accountingApi';
import { mergeDailyReceivedPayments } from './centralSalesReport';

const amount = (value) => Number(value || 0);

export const emptyCollectionSummary = () => ({
    total: 0,
    legacyTotal: 0,
    centralTotal: 0,
    centralConnected: Boolean(localStorage.getItem(ACCOUNTING_TOKEN_KEY)),
    rows: [],
    centralReport: { data: [] },
});

export const loadCombinedCustomerCollections = async (dateFrom, dateTo) => {
    const legacyResponse = await ShopOrderTransactionService.fetchSalesListV2({ dateFrom, dateTo });
    const legacyRows = Array.isArray(legacyResponse.data?.data) ? legacyResponse.data.data : [];
    let centralReport = { data: [], total_sales: 0 };
    const centralConnected = Boolean(localStorage.getItem(ACCOUNTING_TOKEN_KEY));

    if (centralConnected) {
        try {
            centralReport = await CentralCustomerPaymentService.paymentReport(dateFrom, dateTo);
        } catch (error) {
            console.log('Unable to load Central Accounting product-report collections', error);
        }
    }

    const rows = mergeDailyReceivedPayments(legacyRows, centralReport, {
        preserveSales: true,
        preserveCount: true,
    });
    const legacyTotal = legacyRows.reduce(
        (total, row) => total + amount(row.total_cash) + amount(row.total_online),
        0
    );
    const centralTotal = amount(centralReport.total_sales);

    return {
        total: legacyTotal + centralTotal,
        legacyTotal,
        centralTotal,
        centralConnected,
        rows,
        centralReport,
    };
};

export const loadCentralLiquidBalance = async () => {
    if (!localStorage.getItem(ACCOUNTING_TOKEN_KEY)) return null;

    const accounts = (await fetchAllAccountingPages('/financial-accounts', { active: 1 }))
        .filter((account) => ['cash', 'bank_account', 'checking_account', 'e_wallet'].includes(account.kind));
    const balances = await Promise.all(accounts.map(async (account) => {
        const response = await accountingApi.get(`/financial-accounts/${account.id}/balance`);
        return { ...response.data, account };
    }));

    return {
        total: balances.reduce((sum, balance) => sum + amount(balance.balance), 0),
        accounts: balances,
    };
};
