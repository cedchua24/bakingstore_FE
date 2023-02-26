import React, { useState, useEffect } from "react";
import OrderCustomerTransactionService from "./OrderCustomerTransaction.service";
import MarkUpPriceService from "../MarkUpPrice/MarkUpPriceService.service";
import AddProductOrderCustomer from "./AddProductOrderCustomer";

const OrderCustomerTransaction = () => {

  useEffect(() => {
    fetcOrderCustomerList();
    fetchProductList();
  }, []);

  const [orderCustomerList, setOrderCustomerList] = useState([]);

  const [products, setProducts] = useState([]);

  const saveOrderCustomerDataHandler = (orderCustomer) => {
    // this.fetchMarkUpPriceList();
    //
    setOrderCustomerList([...orderCustomerList, orderCustomer]);
  }


  const fetcOrderCustomerList = () => {
    OrderCustomerTransactionService.getAll()
      .then(response => {
        setOrderCustomerList(response.data);
      })
      .catch(e => {
        console.log("error", e)
      });
  }

  const fetchProductList = () => {
    MarkUpPriceService.getAll()
      .then(response => {
        setProducts(response.data);
      })
      .catch(e => {
        console.log("error", e)
      });
  }

  const deleteOrderCustomer = (id, e) => {

    const index = orderCustomerList.findIndex(orderCustomer => orderCustomer.id === id);
    const newOrderCustomer = [...orderCustomerList];
    newOrderCustomer.splice(index, 1);

    OrderCustomerTransactionService.delete(id)
      .then(response => {
        setOrderCustomerList(newOrderCustomer);
      })
      .catch(e => {
        console.log('error', e);
      });
  }



  return (
    <div>
      <AddProductOrderCustomer
        onSaveOrderCustomerData={saveOrderCustomerDataHandler}
        products={products}
      />
      {/* <OrderCustomerTransactionList
        orderCustomerList={orderCustomerList}
        deleteOrderCustomer={deleteOrderCustomer}
      /> */}
    </div>
  )
}

export default OrderCustomerTransaction
