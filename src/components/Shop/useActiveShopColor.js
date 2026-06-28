import { useEffect, useState } from "react";
import ShopService from "./ShopService";
import { normalizeShopColor } from "./shopBranding";

const ACTIVE_SHOP_COLOR_KEY = "active_shop_color";

const useActiveShopColor = () => {
    const [shopColor, setShopColor] = useState(
        () => normalizeShopColor(localStorage.getItem(ACTIVE_SHOP_COLOR_KEY))
    );

    useEffect(() => {
        ShopService.fetchShopActive()
            .then((response) => {
                const payload = response.data?.data || response.data;
                const activeShop = Array.isArray(payload) ? payload[0] : payload;
                const color = normalizeShopColor(activeShop?.color);

                if (color) {
                    localStorage.setItem(ACTIVE_SHOP_COLOR_KEY, color);
                    setShopColor(color);
                }
            })
            .catch((error) => {
                console.error("Unable to load the active shop color.", error);
            });
    }, []);

    return shopColor;
};

export default useActiveShopColor;
