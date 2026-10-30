import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Form, Nav, Spinner, Table } from "react-bootstrap";
import accountingApi, { ACCOUNTING_TOKEN_KEY, fetchAllAccountingPages } from "./accountingApi";
import "./AccountingPortal.css";

const today = () => new Date().toISOString().slice(0, 10);
const money = (value, currency = "PHP") => new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(Number(value || 0));
const errorText = (error) => error.response?.data?.message || Object.values(error.response?.data?.errors || {})?.flat()?.[0] || "Unable to complete the request.";
const AccountingPortal = () => {
    const [token, setToken] = useState(() => localStorage.getItem(ACCOUNTING_TOKEN_KEY));
    const [login, setLogin] = useState({ email: "", password: "" });
    const [tab, setTab] = useState("accounts");
    const [accounts, setAccounts] = useState([]);
    const [chartAccounts, setChartAccounts] = useState([]);
    const [obligations, setObligations] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [adjustments, setAdjustments] = useState([]);
    const [selected, setSelected] = useState(null);
    const [balance, setBalance] = useState(null);
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [transfer, setTransfer] = useState({ source_financial_account_id: "", destination_financial_account_id: "", transfer_date: today(), currency: "PHP", amount: "", reference: "", memo: "", post: true });
    const [adjustment, setAdjustment] = useState({ financial_account_id: "", payment_obligation_id: "", adjustment_account_id: "", adjustment_date: today(), currency: "PHP", actual_balance: "", reference: "", reason: "", post: true });

    useEffect(() => {
        const expired = () => setToken(null);
        window.addEventListener("accounting-session-expired", expired);
        return () => window.removeEventListener("accounting-session-expired", expired);
    }, []);

    const load = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [accountRows, chartRows, obligationRows, transferRows, adjustmentRows] = await Promise.all([
                fetchAllAccountingPages("/financial-accounts", { active: 1 }),
                fetchAllAccountingPages("/chart-accounts"),
                fetchAllAccountingPages("/payment-obligations", { type: "credit_card_statement" }),
                fetchAllAccountingPages("/account-transfers"),
                fetchAllAccountingPages("/account-adjustments"),
            ]);
            setAccounts(accountRows);
            setChartAccounts(chartRows);
            setObligations(obligationRows);
            setTransfers(transferRows);
            setAdjustments(adjustmentRows);
        } catch (error) {
            setMessage({ type: "danger", text: errorText(error) });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { load(); }, [load]);

    const signIn = async (event) => {
        event.preventDefault(); setSaving(true); setMessage({ type: "", text: "" });
        try {
            const response = await accountingApi.post("/login", { ...login, device_name: "bakingstore-frontend" });
            localStorage.setItem(ACCOUNTING_TOKEN_KEY, response.data.token);
            setToken(response.data.token);
        } catch (error) { setMessage({ type: "danger", text: errorText(error) }); }
        finally { setSaving(false); }
    };

    const signOut = async () => {
        try { await accountingApi.post("/logout"); } catch (_) {}
        localStorage.removeItem(ACCOUNTING_TOKEN_KEY); setToken(null); setAccounts([]);
    };

    const viewAccount = async (account) => {
        setSelected(account); setBalance(null); setMovements([]);
        try {
            const [balanceResponse, movementResponse] = await Promise.all([
                accountingApi.get(`/financial-accounts/${account.id}/balance`),
                accountingApi.get(`/financial-accounts/${account.id}/movements`),
            ]);
            setBalance(balanceResponse.data);
            setMovements(movementResponse.data?.data || []);
        } catch (error) { setMessage({ type: "danger", text: errorText(error) }); }
    };

    const submitTransfer = async (event) => {
        event.preventDefault(); setSaving(true);
        try {
            await accountingApi.post("/account-transfers", { ...transfer, amount: Number(transfer.amount) });
            setMessage({ type: "success", text: "Account transfer posted successfully." });
            setTransfer((value) => ({ ...value, amount: "", reference: "", memo: "" }));
            await load();
        } catch (error) { setMessage({ type: "danger", text: errorText(error) }); }
        finally { setSaving(false); }
    };

    const submitAdjustment = async (event) => {
        event.preventDefault(); setSaving(true);
        try {
            const payload = { ...adjustment, actual_balance: Number(adjustment.actual_balance) };
            if (!payload.payment_obligation_id) delete payload.payment_obligation_id;
            await accountingApi.post("/account-adjustments", payload);
            setMessage({ type: "success", text: "Balance adjustment posted successfully." });
            setAdjustment((value) => ({ ...value, actual_balance: "", reference: "", reason: "" }));
            await load();
        } catch (error) { setMessage({ type: "danger", text: errorText(error) }); }
        finally { setSaving(false); }
    };

    const transferAccounts = useMemo(() => accounts.filter((account) => account.applications?.some((item) => item.application === "account_transfer")), [accounts]);
    const adjustableAccounts = useMemo(() => accounts.filter((account) => account.applications?.some((item) => item.application === "balance_adjustment")), [accounts]);
    const selectedAdjustmentAccount = accounts.find((account) => Number(account.id) === Number(adjustment.financial_account_id));
    const statementOptions = obligations.filter((item) => Number(item.financial_account_id) === Number(adjustment.financial_account_id) && item.status !== "voided");

    if (!token) return <main className="accounting-portal"><section className="accounting-card accounting-login"><span className="accounting-kicker">CENTRAL ACCOUNTING</span><h1>Connect accounting</h1><p>Sign in using your Central Accounting API account.</p>{message.text && <Alert variant={message.type}>{message.text}</Alert>}<Form onSubmit={signIn}><Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" required value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} /></Form.Group><Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control type="password" required value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} /></Form.Group><Button type="submit" disabled={saving}>{saving ? "Connecting…" : "Connect"}</Button></Form></section></main>;

    return <main className="accounting-portal">
        <header className="accounting-hero"><div><span className="accounting-kicker">CENTRAL ACCOUNTING</span><h1>Financial accounts</h1><p className="text-muted mb-0">Central balances, movements, transfers, and reconciliation.</p></div><div className="accounting-actions"><Button variant="outline-secondary" onClick={load}>Refresh</Button><Button variant="outline-danger" onClick={signOut}>Disconnect</Button></div></header>
        {message.text && <Alert dismissible onClose={() => setMessage({ type: "", text: "" })} variant={message.type}>{message.text}</Alert>}
        <Nav variant="tabs" activeKey={tab} onSelect={setTab} className="mb-3"><Nav.Item><Nav.Link eventKey="accounts">Accounts</Nav.Link></Nav.Item><Nav.Item><Nav.Link eventKey="transfer">Transfer</Nav.Link></Nav.Item><Nav.Item><Nav.Link eventKey="adjustment">Adjustment</Nav.Link></Nav.Item><Nav.Item><Nav.Link eventKey="history">Transactions</Nav.Link></Nav.Item></Nav>
        {loading && <div className="accounting-card text-center"><Spinner animation="border" /><p className="mt-2 mb-0">Loading accounting data…</p></div>}
        {!loading && tab === "accounts" && <AccountsTab accounts={accounts} selected={selected} balance={balance} movements={movements} onSelect={viewAccount} />}
        {!loading && tab === "transfer" && <TransferTab accounts={transferAccounts} value={transfer} onChange={setTransfer} onSubmit={submitTransfer} saving={saving} />}
        {!loading && tab === "adjustment" && <AdjustmentTab accounts={adjustableAccounts} chartAccounts={chartAccounts} statements={statementOptions} selectedAccount={selectedAdjustmentAccount} value={adjustment} onChange={setAdjustment} onSubmit={submitAdjustment} saving={saving} />}
        {!loading && tab === "history" && <HistoryTab transfers={transfers} adjustments={adjustments} />}
    </main>;
};

const AccountsTab = ({ accounts, selected, balance, movements, onSelect }) => <div className="accounting-grid"><section className="accounting-card accounting-table-wrap"><Table hover responsive className="accounting-table"><thead><tr><th>Account</th><th>Kind</th><th>Access</th></tr></thead><tbody>{accounts.map((account) => <tr key={account.id} onClick={() => onSelect(account)}><td><strong>{account.name}</strong><small className="d-block text-muted">{account.institution?.name || "Internal"} {account.masked_account_number || ""}</small></td><td>{account.kind}</td><td>{account.is_company_wide ? "Company" : `${account.accessible_branches?.length || 0} branches`}</td></tr>)}</tbody></Table></section><section className="accounting-card">{!selected ? <p className="text-muted">Select an account to view its balance and movements.</p> : <><h3>{selected.name}</h3><div className="accounting-summary"><div className="accounting-stat"><small>Current balance</small><strong>{balance ? money(balance.balance, balance.currency) : "Loading…"}</strong></div><div className="accounting-stat"><small>Ledger side</small><strong>{balance?.normal_side || "—"}</strong></div></div><h5>Recent movements</h5><div className="accounting-table-wrap"><Table size="sm"><thead><tr><th>Date</th><th>Movement</th><th>Direction</th><th className="text-end">Amount</th></tr></thead><tbody>{movements.map((item) => <tr key={item.id}><td>{item.entry_date}</td><td>{item.movement_type}</td><td><Badge bg={item.direction.includes("IN") ? "success" : "secondary"}>{item.direction}</Badge></td><td className="text-end">{money(item.amount, selected.currency)}</td></tr>)}</tbody></Table></div></>}</section></div>;

const TransferTab = ({ accounts, value, onChange, onSubmit, saving }) => <section className="accounting-card"><h3>Account transfer</h3><p className="text-muted">Move an amount between centralized accounts without selecting source payments.</p><Form onSubmit={onSubmit} className="accounting-form-grid"><AccountSelect label="From" value={value.source_financial_account_id} accounts={accounts} onChange={(id) => onChange({ ...value, source_financial_account_id: id })} /><AccountSelect label="To" value={value.destination_financial_account_id} accounts={accounts} onChange={(id) => onChange({ ...value, destination_financial_account_id: id })} /><Form.Group><Form.Label>Amount</Form.Label><Form.Control type="number" min="0.01" step="0.01" required value={value.amount} onChange={(e) => onChange({ ...value, amount: e.target.value })} /></Form.Group><Form.Group><Form.Label>Date</Form.Label><Form.Control type="date" required value={value.transfer_date} onChange={(e) => onChange({ ...value, transfer_date: e.target.value })} /></Form.Group><Form.Group><Form.Label>Reference</Form.Label><Form.Control value={value.reference} onChange={(e) => onChange({ ...value, reference: e.target.value })} /></Form.Group><Form.Group><Form.Label>Memo</Form.Label><Form.Control value={value.memo} onChange={(e) => onChange({ ...value, memo: e.target.value })} /></Form.Group><div className="full"><Button type="submit" disabled={saving}>{saving ? "Posting…" : "Post transfer"}</Button></div></Form></section>;

const AdjustmentTab = ({ accounts, chartAccounts, statements, selectedAccount, value, onChange, onSubmit, saving }) => <section className="accounting-card"><h3>Balance / SOA adjustment</h3><p className="text-muted">Enter the real bank balance or credit-card SOA total. The discrepancy remains auditable.</p><Form onSubmit={onSubmit} className="accounting-form-grid"><AccountSelect label="Financial account" value={value.financial_account_id} accounts={accounts} onChange={(id) => onChange({ ...value, financial_account_id: id, payment_obligation_id: "" })} />{selectedAccount?.kind === "credit_card" && <Form.Group><Form.Label>Credit-card statement</Form.Label><Form.Select required value={value.payment_obligation_id} onChange={(e) => onChange({ ...value, payment_obligation_id: e.target.value })}><option value="">Select SOA</option>{statements.map((o) => <option key={o.id} value={o.id}>{o.number} — {money(o.total_amount, o.currency)} due {o.due_date}</option>)}</Form.Select></Form.Group>}<Form.Group><Form.Label>Adjustment account</Form.Label><Form.Select required value={value.adjustment_account_id} onChange={(e) => onChange({ ...value, adjustment_account_id: e.target.value })}><option value="">Select chart account</option>{chartAccounts.filter((a) => a.is_active).map((a) => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}</Form.Select></Form.Group><Form.Group><Form.Label>{selectedAccount?.kind === "credit_card" ? "Actual SOA total" : "Actual account balance"}</Form.Label><Form.Control type="number" step="0.01" required value={value.actual_balance} onChange={(e) => onChange({ ...value, actual_balance: e.target.value })} /></Form.Group><Form.Group><Form.Label>Date</Form.Label><Form.Control type="date" required value={value.adjustment_date} onChange={(e) => onChange({ ...value, adjustment_date: e.target.value })} /></Form.Group><Form.Group><Form.Label>Reference</Form.Label><Form.Control value={value.reference} onChange={(e) => onChange({ ...value, reference: e.target.value })} /></Form.Group><Form.Group className="full"><Form.Label>Reason</Form.Label><Form.Control as="textarea" required value={value.reason} onChange={(e) => onChange({ ...value, reason: e.target.value })} /></Form.Group><div className="full"><Button type="submit" disabled={saving}>{saving ? "Posting…" : "Post adjustment"}</Button></div></Form></section>;

const AccountSelect = ({ label, value, accounts, onChange }) => <Form.Group><Form.Label>{label}</Form.Label><Form.Select required value={value} onChange={(e) => onChange(e.target.value)}><option value="">Select account</option>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</Form.Select></Form.Group>;
const HistoryTab = ({ transfers, adjustments }) => <div className="accounting-grid"><section className="accounting-card accounting-table-wrap"><h3>Transfers</h3><Table size="sm"><thead><tr><th>Date</th><th>Accounts</th><th>Status</th><th className="text-end">Amount</th></tr></thead><tbody>{transfers.map((item) => <tr key={item.id}><td>{item.transfer_date}</td><td>{item.source_account?.name} → {item.destination_account?.name}</td><td>{item.status}</td><td className="text-end">{money(item.amount, item.currency)}</td></tr>)}</tbody></Table></section><section className="accounting-card accounting-table-wrap"><h3>Adjustments</h3><Table size="sm"><thead><tr><th>Date</th><th>Account</th><th>Status</th><th className="text-end">Difference</th></tr></thead><tbody>{adjustments.map((item) => <tr key={item.id}><td>{item.adjustment_date}</td><td>{item.financial_account?.name}</td><td>{item.status}</td><td className={`text-end ${Number(item.adjustment_amount) < 0 ? "accounting-negative" : "accounting-positive"}`}>{money(item.adjustment_amount, item.currency)}</td></tr>)}</tbody></Table></section></div>;

export default AccountingPortal;
