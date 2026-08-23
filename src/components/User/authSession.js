const AUTH_KEYS = [
    "auth_token",
    "auth_user_id",
    "name",
    "role_as",
    "auth_expires_at",
    "auth_name",
    "auth_email",
];

const MAX_TIMEOUT = 2147483647;

export const getAuthUserIdFromCookie = () => {
    const cookie = document.cookie
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith("auth_user_id="));

    if (!cookie) return null;
    const value = decodeURIComponent(cookie.substring("auth_user_id=".length));
    return value !== "" ? value : null;
};

const getExpirationTime = (expiresAt) => {
    if (expiresAt === null || expiresAt === undefined || expiresAt === "") {
        return NaN;
    }

    if (/^\d+$/.test(String(expiresAt))) {
        const numericExpiration = Number(expiresAt);
        return numericExpiration < 1000000000000
            ? numericExpiration * 1000
            : numericExpiration;
    }

    const value = String(expiresAt).trim();
    const timezoneLessDate = value.match(
        /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?$/
    );

    if (timezoneLessDate) {
        const [, year, month, day, hour, minute, second, fraction = "0"] = timezoneLessDate;
        const milliseconds = Number(`0.${fraction}`) * 1000;
        const parts = [
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute),
            Number(second),
            milliseconds,
        ];

        const localTime = new Date(...parts).getTime();
        const utcTime = Date.UTC(...parts);
        const futureCandidates = [localTime, utcTime]
            .filter((candidate) => candidate > Date.now())
            .sort((left, right) => left - right);

        // Laravel may serialize a UTC or application-timezone value without
        // an offset. The nearest future interpretation is the one-hour expiry.
        return futureCandidates[0] ?? localTime;
    }

    return new Date(expiresAt).getTime();
};

export const saveAuthSession = (data) => {
    const expirationTime = getExpirationTime(data?.expires_at);

    if (!data?.token || !Number.isFinite(expirationTime) || expirationTime <= Date.now()) {
        clearAuthSession();
        return false;
    }

    // Store expiration first so another open tab never observes a new token
    // without its matching expiry and incorrectly treats it as a legacy session.
    localStorage.setItem("auth_expires_at", String(expirationTime));
    localStorage.setItem("auth_token", data.token);

    if (data.id !== undefined) {
        localStorage.setItem("auth_user_id", data.id);
        const maxAge = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `auth_user_id=${encodeURIComponent(data.id)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
    }
    if (data.name !== undefined) localStorage.setItem("name", data.name);
    if (data.role_as !== undefined) localStorage.setItem("role_as", data.role_as);

    return true;
};

export const clearAuthSession = () => {
    AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
    document.cookie = "auth_user_id=; Path=/; Max-Age=0; SameSite=Lax";
};

export const hasValidAuthSession = () => {
    const token = localStorage.getItem("auth_token");
    const expirationTime = getExpirationTime(localStorage.getItem("auth_expires_at"));

    return Boolean(token) &&
        Number.isFinite(expirationTime) &&
        expirationTime > Date.now();
};

export const scheduleSessionExpiration = (onExpire) => {
    let timeoutId;
    let hasExpired = false;

    const expire = () => {
        if (hasExpired) return;
        hasExpired = true;
        onExpire();
    };

    const schedule = () => {
        window.clearTimeout(timeoutId);

        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const expirationTime = getExpirationTime(localStorage.getItem("auth_expires_at"));
        const delay = expirationTime - Date.now();

        // Sessions created before expires_at was introduced must log in again.
        if (!Number.isFinite(delay) || delay <= 0) {
            expire();
            return;
        }

        timeoutId = window.setTimeout(schedule, Math.min(delay, MAX_TIMEOUT));
    };

    const checkWhenActive = () => {
        if (!document.hidden) schedule();
    };

    const syncAcrossTabs = (event) => {
        if (event.key === "auth_token" || event.key === "auth_expires_at") {
            const token = localStorage.getItem("auth_token");
            const expiresAt = localStorage.getItem("auth_expires_at");

            if (event.key === "auth_token" && !token) {
                expire();
            } else if (expiresAt) {
                schedule();
            }
        }
    };

    schedule();
    window.addEventListener("focus", schedule);
    window.addEventListener("storage", syncAcrossTabs);
    document.addEventListener("visibilitychange", checkWhenActive);

    return () => {
        window.clearTimeout(timeoutId);
        window.removeEventListener("focus", schedule);
        window.removeEventListener("storage", syncAcrossTabs);
        document.removeEventListener("visibilitychange", checkWhenActive);
    };
};
