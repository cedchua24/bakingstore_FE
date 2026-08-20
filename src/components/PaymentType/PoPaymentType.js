import React, { useState, useEffect } from "react";
import PaymentTypePoService from "../OtherService/PaymentTypePoService";
import PaymentTermService from "../OtherService/PaymentTermService";
import BankService from "../OtherService/BankService";
import PoPaymentTypeList from "./PoPaymentTypeList";
import AddPoPaymentType from "./AddPoPaymentType";
import "./PoPaymentType.css";

const PoPaymentType = () => {

    useEffect(() => {
        fetchPaymentTypeList();
        fetchPaymentTermList();
        fetchBankList();
    }, []);

    const [paymentTypeList, setPaymentTypeList] = useState([]);
    const [paymenTermList, setPaymenTermList] = useState([]);
    const [bankList, setBankList] = useState([]);

    const savePaymentTypeDataHandler = (paymentType) => {
        setPaymentTypeList([...paymentTypeList, paymentType]);
    }


    const fetchPaymentTypeList = () => {
        PaymentTypePoService.getAll()
            .then(response => {
                setPaymentTypeList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchBankList = () => {
        BankService.getAll()
            .then(response => {
                setBankList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchPaymentTermList = () => {
        PaymentTermService.getAll()
            .then(response => {
                setPaymenTermList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deletePaymentType = (id, e) => {

        const index = paymentTypeList.findIndex(paymentType => paymentType.id === id);
        const newPaymentType = [...paymentTypeList];
        newPaymentType.splice(index, 1);

        PaymentTypePoService.delete(id)
            .then(response => {
                setPaymentTypeList(newPaymentType);
            })
            .catch(e => {
                console.log('error', e);
            });
    }



    return (
        <div className="po-payment-page">
            <header className="po-payment-page-header">
                <div>
                    <span>PAYMENT SETTINGS</span>
                    <h1>Payment Accounts</h1>
                    <p>Manage accounts available for supplier and customer payments.</p>
                </div>
                <div className="po-payment-record-count">{paymentTypeList.length} accounts</div>
            </header>

            <section className="po-payment-card po-payment-add-card">
                <div className="po-payment-section-heading">
                    <span>NEW ACCOUNT</span>
                    <h2>Add a payment account</h2>
                    <p>Enter the account details and select where it can be used.</p>
                </div>
                <AddPoPaymentType
                    paymenTermList={paymenTermList}
                    bankList={bankList}
                    onSavePaymentTypeData={savePaymentTypeDataHandler}
                />
            </section>

            <section className="po-payment-card">
                <PoPaymentTypeList
                    paymentTypeList={paymentTypeList}
                    deletePaymentType={deletePaymentType}
                />
            </section>
        </div>
    )
}

export default PoPaymentType
