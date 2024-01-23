import React, { useState, useEffect } from "react";
import PaymentTypeService from "./PaymentTypeService";
import PaymentTypeList from "./PaymentTypeList";
import AddPaymentType from "./AddPaymentType";

const PaymentType = () => {

    useEffect(() => {
        fetchPaymentTypeList();
    }, []);

    const [paymentTypeList, setPaymentTypeList] = useState([]);

    const savePaymentTypeDataHandler = (paymentType) => {
        setPaymentTypeList([...paymentTypeList, paymentType]);
    }


    const fetchPaymentTypeList = () => {
        PaymentTypeService.getAll()
            .then(response => {
                setPaymentTypeList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deletePaymentType = (id, e) => {

        const index = paymentTypeList.findIndex(paymentType => paymentType.id === id);
        const newPaymentType = [...paymentTypeList];
        newPaymentType.splice(index, 1);

        PaymentTypeService.delete(id)
            .then(response => {
                setPaymentTypeList(newPaymentType);
            })
            .catch(e => {
                console.log('error', e);
            });
    }



    return (
        <div>

            <AddPaymentType
                onSavePaymentTypeData={savePaymentTypeDataHandler}
            />

            <PaymentTypeList
                paymentTypeList={paymentTypeList}
                deletePaymentType={deletePaymentType}
            />
        </div>
    )
}

export default PaymentType
