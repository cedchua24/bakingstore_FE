import { useEffect, useState } from "react";
import ShopService from "./ShopService";
import { normalizeShopColor } from "./shopBranding";
import { ACTIVE_SHOP_COLOR_KEY, fetchLocalEnvironmentColor } from "./databaseEnvironment";

const useActiveShopColor = () => {
    const [shopColor, setShopColor] = useState(
        () => normalizeShopColor(localStorage.getItem(ACTIVE_SHOP_COLOR_KEY))
    );

    useEffect(() => {
        const loadColor = async () => {
            if (localStorage.getItem("auth_token")) {
                try {
                    const environmentColor = await fetchLocalEnvironmentColor();
                    if (environmentColor) {
                        setShopColor(environmentColor);
                        return;
                    }
                } catch (error) {
                    console.error("Unable to load the database environment.", error);
                }
            }

            try {
                const response = await ShopService.fetchShopActive();
                const payload = response.data?.data || response.data;
                const activeShop = Array.isArray(payload) ? payload[0] : payload;
                const color = normalizeShopColor(activeShop?.color);

                if (color) {
                    localStorage.setItem(ACTIVE_SHOP_COLOR_KEY, color);
                    setShopColor(color);
                }
            } catch (error) {
                console.error("Unable to load the active shop color.", error);
            }
        };

        loadColor();
    }, []);

    return shopColor;
};

export default useActiveShopColor;
