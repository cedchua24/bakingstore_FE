import React, { useState, useEffect } from "react";
import AddCustomerOrderTransactionV2 from "./AddCustomerOrderTransactionV2";
import ShopService from "../Shop/ShopService";
import UserService from "../User/UserService.service";
import CustomerService from "../Customer/CustomerService";

const CustomerOrderTransaction = () => {

    useEffect(() => {
        fetchShopList();
        fetchUserList();
    }, []);

    const [shopList, setShopList] = useState([]);

    const [customerList, setCustomerList] = useState([]);


    const fetchShopList = () => {
        ShopService.fetchOnlineOrderList()
            .then(response => {
                setShopList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const fetchUserList = () => {
        CustomerService.getAll()
            .then(response => {
                setCustomerList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    return (
        <div>
            <AddCustomerOrderTransactionV2
                shopList={shopList}
                customerList={customerList}
            />
        </div>
    )
}

export default CustomerOrderTransaction
