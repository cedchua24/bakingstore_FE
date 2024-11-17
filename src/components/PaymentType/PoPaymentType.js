import React, { useState, useEffect } from "react";
import PaymentTypePoService from "../OtherService/PaymentTypePoService";
import PaymentTermService from "../OtherService/PaymentTermService";
import BankService from "../OtherService/BankService";
import PoPaymentTypeList from "./PoPaymentTypeList";
import AddPoPaymentType from "./AddPoPaymentType";

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
        PaymentTermService.fetchNotCashList()
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
        <div>

            <AddPoPaymentType
                paymenTermList={paymenTermList}
                bankList={bankList}
                onSavePaymentTypeData={savePaymentTypeDataHandler}
            />

            <PoPaymentTypeList
                paymentTypeList={paymentTypeList}
                deletePaymentType={deletePaymentType}
            />
        </div>
    )
}

export default PoPaymentType
