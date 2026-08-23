import axios from "axios";
import { normalizeShopColor } from "./shopBranding";

export const ACTIVE_SHOP_COLOR_KEY = "active_shop_color";
export const DEFAULT_SHOP_COLOR = "#35221c";

export const getEnvironmentColor = (payload) => normalizeShopColor(
    payload?.active_shop_color,
    normalizeShopColor(payload?.default_color, DEFAULT_SHOP_COLOR)
);

export const fetchLocalEnvironmentColor = async () => {
    const response = await axios.get("/api/environment/database");
    const payload = response.data?.data || response.data;

    const color = getEnvironmentColor(payload);
    if (color) {
        localStorage.setItem(ACTIVE_SHOP_COLOR_KEY, color);
    }

    return color;
};
