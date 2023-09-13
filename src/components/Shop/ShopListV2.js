import React, { useState, useEffect } from "react";
import ShopService from "./ShopService";
import ShopList from "./ShopList";
import AddShop from "./AddShop";

const ShopListV2 = () => {

    useEffect(() => {
        fetchShopList();
    }, []);

    const [shopList, setShopList] = useState([]);

    const saveShopDataHandler = (shop) => {
        // setShopList([...shopList, shop]);
        fetchShopList();
    }

    const fetchShopList = () => {
        ShopService.fetchShopList()
            .then(response => {
                setShopList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteShop = (id, e) => {
        const index = shopList.findIndex(shop => shop.id === id);
        const newshop = [...shopList];
        newshop.splice(index, 1);

        ShopService.delete(id)
            .then(response => {
                setShopList(newshop);
            })
            .catch(e => {
                console.log('error', e);
            });
    }


    return (
        <div>
            <ShopList
                shopList={shopList}
                deleteShop={deleteShop}
            />
        </div>
    )
}

export default ShopListV2
