import React, { useState, useEffect } from "react";
import AddCustomerOrderTransactionV2 from "./AddCustomerOrderTransactionV2";
import ShopService from "../Shop/ShopService";
import CustomerTypeService from "../OtherService/CustomerTypeService";
import DailySessionService from "../OtherService/DailySessionService";
import SalesRepService from "../OtherService/SalesRepService";
import CustomerService from "../Customer/CustomerService";
import moment from "moment";

const CustomerOrderTransaction = () => {


    useEffect(() => {
        fetchSalesRep();
        fetchShopActive();
        fetchUserList();
        fetchCustomerTypeList();
        fetchDailySession();
    }, []);

    const [shopList, setShopList] = useState([]);
    const [salesRepList, setSalesRepList] = useState([]);


    const [customerList, setCustomerList] = useState([]);

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
        SalesRepService.getAll()
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
                salesRepList={salesRepList}
                customerTypeList={customerTypeList}
                customerList={customerList}
                dailySessionUpdate={dailySessionUpdate}
            />
        </div>
    )
}

export default CustomerOrderTransaction
