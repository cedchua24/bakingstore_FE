import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const PoPaymentTypeList = (props) => {

    const paymentTypeList = props.paymentTypeList;
    const deletePaymentType = props.deletePaymentType;

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');



    return (
        <div className="po-payment-list">
            <div className="po-payment-section-heading po-payment-list-heading">
                <span>CONFIGURED ACCOUNTS</span>
                <h2>Payment account list</h2>
                <p>Supplier and customer availability is shown under Usage.</p>
            </div>
            <div className="po-payment-table-wrap">
            <table className="table po-payment-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Bank</th>
                        <th>Account</th>
                        <th>Number</th>
                        <th>Usage</th>
                        <th>Due Date</th>
                        <th>Credit Limit</th>
                        <th>Statement Date</th>
                        <th>Balance Due</th>
                        <th>Enabled</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        paymentTypeList.map((paymentType, index) => (
                            <tr key={paymentType.id}  >
                                <td >{paymentType.id}</td>
                                <td>{paymentType.payment_term}</td>
                                <td>{paymentType.bank_name}</td>
                                <td>
                                    <strong>{paymentType.account_name || '-'}</strong>
                                    {paymentType.account_description && <small>{paymentType.account_description}</small>}
                                </td>
                                <td>{String(paymentType.account_number ?? '').trim() === '0' ? '-' : paymentType.account_number}</td>
                                <td>
                                    <div className="po-payment-usage-badges">
                                        {Number(paymentType.is_supplier) === 1 && <span className="is-supplier">Supplier</span>}
                                        {Number(paymentType.is_customer) === 1 && <span className="is-customer">Customer</span>}
                                        {Number(paymentType.is_supplier) !== 1 && Number(paymentType.is_customer) !== 1 && <span className="is-unused">Not assigned</span>}
                                    </div>
                                </td>
                                {paymentType.payment_term_id == 4 ?
                                    <>
                                        <td>{paymentType.due_date}</td>
                                        <td>{numberFormat(paymentType.credit_limit)}</td>
                                        <td>{paymentType.statement_date}</td>
                                        <td>{numberFormat(paymentType.total_balance_due)}</td>
                                    </>
                                    : <>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </>}

                                <td className="po-payment-enabled">{paymentType.status === 0 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                <td>
                                  <div className="po-payment-actions">
                                    <Link variant="primary" to={"/poEditPaymentType/" + paymentType.id}   >
                                        <Button size="sm" variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                    <Link variant="primary" to={"/balanceHistory/" + paymentType.id}   >
                                        <Button size="sm" variant="outline-primary" >
                                            History
                                        </Button>
                                    </Link>
                                    <Link className="po-payment-customer-link" to={`/poPaymentType/${paymentType.id}/customerPayments`}>
                                        <Button size="sm" variant="outline-success">
                                            Customer payments
                                        </Button>
                                    </Link>
                                    <Link className="po-payment-customer-link" to={`/poPaymentType/${paymentType.id}/supplierPayments`}>
                                        <Button size="sm" variant="outline-warning">
                                            Supplier payments
                                        </Button>
                                    </Link>
                                    <Button size="sm" variant="outline-danger" onClick={(e) => deletePaymentType(paymentType.id, e)} disabled>
                                        Delete
                                    </Button>
                                  </div>
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default PoPaymentTypeList
