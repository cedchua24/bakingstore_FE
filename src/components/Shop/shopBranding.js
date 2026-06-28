export const normalizeShopColor = (value, fallback = null) => {
    if (typeof value !== "string") return fallback;

    const color = value.trim();
    if (/^(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color)) {
        return `#${color}`;
    }
    if (/^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color)) {
        return color;
    }
    if (/^(rgba?|hsla?)\([^)]+\)$/i.test(color)) return color;

    return fallback;
};
