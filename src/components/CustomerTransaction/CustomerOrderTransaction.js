import React, { useState, useEffect } from "react";
import AddCustomerOrderTransactionV2 from "./AddCustomerOrderTransactionV2";
import ShopService from "../Shop/ShopService";
import CustomerTypeService from "../OtherService/CustomerTypeService";
import DailySessionService from "../OtherService/DailySessionService";
import SalesRepService from "../OtherService/SalesRepService";
import moment from "moment";

const CustomerOrderTransaction = () => {


    useEffect(() => {
        fetchSalesRep();
        fetchShopActive();
        fetchCustomerTypeList();
        fetchDailySession();
    }, []);

    const [shopList, setShopList] = useState([]);
    const [salesRepList, setSalesRepList] = useState([]);

    const [customerTypeList, setCustomerTypeList] = useState([]);
    const [dailySessionUpdate, setDailySessionUpdate] = useState('');

    const fetchDailySession = () => {
        DailySessionService.fetchDailySession(moment().format("YYYY-MM-DD"))
            .then(response => {
                setDailySessionUpdate(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    };


    const fetchSalesRep = () => {
        SalesRepService.fetchRequests()
            .then(response => {
                setSalesRepList(response.data);
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

    return (
        <div>
            <AddCustomerOrderTransactionV2
                shopList={shopList}
                salesRepList={salesRepList}
                customerTypeList={customerTypeList}
                dailySessionUpdate={dailySessionUpdate}
            />
        </div>
    )
}

export default CustomerOrderTransaction
