import React, { useState, useEffect } from "react";
import AddCustomerOrderTransactionV2 from "./AddCustomerOrderTransactionV2";
import ShopService from "../Shop/ShopService";
import CustomerTypeService from "../OtherService/CustomerTypeService";
import UserService from "../User/UserService.service";
import CustomerService from "../Customer/CustomerService";

const CustomerOrderTransaction = () => {

    useEffect(() => {
        // fetchShopList();
        fetchShopActive();
        fetchUserList();
        fetchCustomerTypeList();
    }, []);

    const [shopList, setShopList] = useState([]);

    const [customerList, setCustomerList] = useState([]);

    const [customerTypeList, setCustomerTypeList] = useState([]);


    const fetchShopList = () => {
        ShopService.fetchOnlineOrderList()
            .then(response => {
                setShopList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const fetchShopActive = () => {
        ShopService.fetchShopActive()
            .then(response => {
                setShopList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCustomerTypeList = () => {
        CustomerTypeService.getAll()
            .then(response => {
                setCustomerTypeList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }



    const fetchUserList = () => {
        CustomerService.fetchCustomerEnabled()
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
                customerTypeList={customerTypeList}
                customerList={customerList}
            />
        </div>
    )
}

export default CustomerOrderTransaction
