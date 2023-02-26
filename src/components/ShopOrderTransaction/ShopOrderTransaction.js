import React, { useState, useEffect } from "react";
import AddShopOrderTransaction from "./AddShopOrderTransaction";
import ShopService from "../Shop/ShopService";
import UserService from "../User/UserService.service";

const ShopOrderTransaction = () => {

    useEffect(() => {
        fetchShopList();
        fetchUserList();
    }, []);

    const [shopList, setShopList] = useState([]);

    const [userList, setUserList] = useState([]);


    const fetchShopList = () => {
        ShopService.getAll()
            .then(response => {
                setShopList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const fetchUserList = () => {
        UserService.getAll()
            .then(response => {
                setUserList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    return (
        <div>
            <AddShopOrderTransaction
                shopList={shopList}
                userList={userList}
            />
        </div>
    )
}

export default ShopOrderTransaction
