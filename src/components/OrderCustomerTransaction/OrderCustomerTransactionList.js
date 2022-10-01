import React from 'react'

import OrderCustomerTransactionTable from './OrderCustomerTransactionTable';


const OrderCustomerTransactionList = (props) => {

    const orderCustomerList = props.orderCustomerList;

    const deleteOrderCustomerHandler = (id) => {
        props.deleteOrderCustomer(id);

    }

    const updateOrderCustomerListHandler = (orderCustomerList) => {
        props.updateOrderCustomerList(orderCustomerList);

    }

    return (
        <div>
            <OrderCustomerTransactionTable
                orderCustomerList={orderCustomerList}
                deleteOrderCustomer={deleteOrderCustomerHandler}
                updateOrderCustomerList={updateOrderCustomerListHandler}
            />
        </div>
    )
}

export default OrderCustomerTransactionList
