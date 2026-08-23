import axios from "axios";
import { normalizeShopColor } from "./shopBranding";

export const ACTIVE_SHOP_COLOR_KEY = "active_shop_color";

export const fetchLocalEnvironmentColor = async () => {
    const response = await axios.get("/api/environment/database");
    const payload = response.data?.data || response.data;

    if (payload?.is_local !== true) return null;

    const color = normalizeShopColor(payload.active_shop_color);
    if (color) {
        localStorage.setItem(ACTIVE_SHOP_COLOR_KEY, color);
    }

    return color;
};
