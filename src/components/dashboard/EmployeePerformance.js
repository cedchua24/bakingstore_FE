import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Alert, Button, Form } from 'react-bootstrap';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import LinearProgress from '@mui/material/LinearProgress';
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import './EmployeePerformance.css';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0
}).format(Number(value) || 0);

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(Number(value) || 0);

const getEmployeeName = (employee) => (
    employee.preparer_name
    || employee.employee_name
    || employee.sales_rep_name
    || employee.checker_name
    || employee.dispatcher_name
    || 'Unknown employee'
);

const PerformanceCard = ({ title, subtitle, icon, accent, employees }) => (
    <section className={`employee-performance-card employee-performance-card--${accent}`}>
        <div className="employee-performance-card__header">
            <div className="employee-performance-card__title">
                <div className="employee-performance-card__icon">{icon}</div>
                <div>
                    <span>{subtitle}</span>
                    <h2>{title}</h2>
                </div>
            </div>
            <div className="employee-performance-card__count">{employees.length} ranked</div>
        </div>

        <div className="employee-performance-table-wrap">
            <table className="employee-performance-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Employee</th>
                        <th>Transactions</th>
                        <th>Quantity</th>
                        <th>Total amount</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="employee-performance-table__empty">
                                <AssessmentRoundedIcon />
                                <strong>No performance data</strong>
                                <span>No employee activity was found for this date range.</span>
                            </td>
                        </tr>
                    ) : employees.map((employee, index) => (
                        <tr key={employee.id || `${getEmployeeName(employee)}-${index}`}>
                            <td>
                                <span className={`employee-performance-rank employee-performance-rank--${index + 1}`}>
                                    {index === 0 && <WorkspacePremiumRoundedIcon />}
                                    {index + 1}
                                </span>
                            </td>
                            <td className="employee-performance-table__name">{getEmployeeName(employee)}</td>
                            <td><strong>{formatNumber(employee.total_transaction_count)}</strong></td>
                            <td>{formatNumber(employee.total_quantity)}</td>
                            <td className="employee-performance-table__amount">{formatCurrency(employee.total_amount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
);

const EmployeePerformance = () => {
    const { date } = useParams();
    const initialDateRange = { dateFrom: date, dateTo: date };

    const [dateRange, setDateRange] = useState(initialDateRange);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [requestError, setRequestError] = useState('');
    const [preparerList, setPreparerList] = useState([]);
    const [checkerList, setCheckerList] = useState([]);
    const [dispatcherList, setDispatcherList] = useState([]);
    const [salesRepList, setSalesRepList] = useState([]);

    useEffect(() => {
        fetchPerformance(initialDateRange);
    }, []);

    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setDateRange(current => ({ ...current, [name]: value }));
        setFormErrors(current => ({ ...current, [name]: '' }));
    };

    const validate = (values) => {
        const errors = {};
        if (!values.dateFrom) errors.dateFrom = 'Date From is required.';
        if (!values.dateTo) errors.dateTo = 'Date To is required.';
        if (values.dateFrom && values.dateTo && values.dateFrom > values.dateTo) {
            errors.dateTo = 'Date To must be on or after Date From.';
        }
        return errors;
    };

    const fetchPerformance = async (requestDateRange = dateRange) => {
        const errors = validate(requestDateRange);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setIsLoading(true);
        setRequestError('');

        try {
            const [preparerResponse, checkerResponse, dispatcherResponse, salesResponse] = await Promise.all([
                ShopOrderTransactionService.fetchEmployeePrepare(requestDateRange),
                ShopOrderTransactionService.fetchEmployeeChecker(requestDateRange),
                ShopOrderTransactionService.fetchEmployeeDispatcher(requestDateRange),
                ShopOrderTransactionService.fetchEmployeeSales(requestDateRange)
            ]);

            setPreparerList(Array.isArray(preparerResponse.data) ? preparerResponse.data : []);
            setCheckerList(Array.isArray(checkerResponse.data) ? checkerResponse.data : []);
            setDispatcherList(Array.isArray(dispatcherResponse.data) ? dispatcherResponse.data : []);
            setSalesRepList(Array.isArray(salesResponse.data) ? salesResponse.data : []);
        } catch (error) {
            console.error("Unable to load employee performance:", error);
            setRequestError(error.response?.data?.message || 'Unable to load employee performance. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const submitDateRange = (event) => {
        event.preventDefault();
        fetchPerformance();
    };

    const roleSummaries = [
        { label: 'Sales representatives', value: salesRepList.length, icon: <PointOfSaleRoundedIcon />, accent: 'sales' },
        { label: 'Preparers', value: preparerList.length, icon: <InventoryRoundedIcon />, accent: 'preparer' },
        { label: 'Checkers', value: checkerList.length, icon: <FactCheckRoundedIcon />, accent: 'checker' },
        { label: 'Dispatchers', value: dispatcherList.length, icon: <LocalShippingRoundedIcon />, accent: 'dispatcher' }
    ];

    return (
        <div className="employee-performance-page">
            <section className="employee-performance-hero">
                <div className="employee-performance-hero__icon"><AssessmentRoundedIcon /></div>
                <div className="employee-performance-hero__content">
                    <span>Team analytics</span>
                    <h1>Employee Performance</h1>
                    <p>Compare transaction volume, product quantity, and sales value across operational roles.</p>
                </div>
                <div className="employee-performance-hero__range">
                    <small>Reporting period</small>
                    <strong>{dateRange.dateFrom || '—'}</strong>
                    <span>to {dateRange.dateTo || '—'}</span>
                </div>
            </section>

            {requestError && (
                <Alert variant="danger" dismissible onClose={() => setRequestError('')} className="employee-performance-alert">
                    <strong>Performance data unavailable.</strong> {requestError}
                </Alert>
            )}

            <section className="employee-performance-filter">
                {isLoading && <LinearProgress color="warning" />}
                <div className="employee-performance-filter__header">
                    <div>
                        <span>Report filters</span>
                        <h2>Select a date range</h2>
                    </div>
                    <GroupsRoundedIcon />
                </div>
                <Form onSubmit={submitDateRange}>
                    <div className="employee-performance-filter__grid">
                        <Form.Group className="employee-performance-field" controlId="employeePerformanceDateFrom">
                            <Form.Label>Date from</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateFrom"
                                value={dateRange.dateFrom}
                                onChange={onChangeInput}
                                isInvalid={Boolean(formErrors.dateFrom)}
                            />
                            <Form.Control.Feedback type="invalid">{formErrors.dateFrom}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="employee-performance-field" controlId="employeePerformanceDateTo">
                            <Form.Label>Date to</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateTo"
                                value={dateRange.dateTo}
                                onChange={onChangeInput}
                                isInvalid={Boolean(formErrors.dateTo)}
                            />
                            <Form.Control.Feedback type="invalid">{formErrors.dateTo}</Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" disabled={isLoading} className="employee-performance-search">
                            <SearchRoundedIcon />
                            {isLoading ? 'Loading report...' : 'View performance'}
                        </Button>
                    </div>
                </Form>
            </section>

            <section className="employee-performance-summary">
                {roleSummaries.map(summary => (
                    <article key={summary.label} className={`employee-performance-summary__item employee-performance-summary__item--${summary.accent}`}>
                        <div>{summary.icon}</div>
                        <span>{summary.label}</span>
                        <strong>{summary.value}</strong>
                    </article>
                ))}
            </section>

            <div className="employee-performance-grid">
                <PerformanceCard
                    title="Top Sales Representatives"
                    subtitle="Revenue performance"
                    icon={<PointOfSaleRoundedIcon />}
                    accent="sales"
                    employees={salesRepList}
                />
                <PerformanceCard
                    title="Top Preparers"
                    subtitle="Order preparation"
                    icon={<InventoryRoundedIcon />}
                    accent="preparer"
                    employees={preparerList}
                />
                <PerformanceCard
                    title="Top Checkers"
                    subtitle="Order verification"
                    icon={<FactCheckRoundedIcon />}
                    accent="checker"
                    employees={checkerList}
                />
                <PerformanceCard
                    title="Top Dispatchers"
                    subtitle="Delivery operations"
                    icon={<LocalShippingRoundedIcon />}
                    accent="dispatcher"
                    employees={dispatcherList}
                />
            </div>
        </div>
    );
};

export default EmployeePerformance;
