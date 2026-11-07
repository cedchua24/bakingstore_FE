import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ShopService from "../Shop/ShopService";
import useActiveShopColor from "../Shop/useActiveShopColor";
import "./UserLoginNav.css";

const UserLoginNav = () => {
    const location = useLocation();
    const [shopName, setShopName] = useState("MDR Baking Supplies");
    const shopColor = useActiveShopColor();

    useEffect(() => {
        ShopService.fetchShopActive()
            .then((response) => {
                const payload = response.data?.data || response.data;
                const activeShop = Array.isArray(payload) ? payload[0] : payload;

                if (activeShop?.shop_name) {
                    setShopName(activeShop.shop_name);
                }

            })
            .catch((error) => {
                console.error("Unable to load the active shop name.", error);
            });
    }, []);

<<<<<<< Updated upstream
    const isLoginPage = location.pathname === "/" || location.pathname === "/login";
=======
    const isLoginPage = location.pathname === "/staff-login";
    const isCelebrationPage = location.pathname === "/" || location.pathname === "/login";
>>>>>>> Stashed changes

    return (
        <header className="public-nav" style={{ "--shop-color": shopColor }}>
            <div className="public-nav-inner">
                <Link className="public-nav-brand" to="/login" aria-label={`${shopName} login`}>
                    <span className="public-nav-logo" aria-hidden="true">M</span>
                    <span className="public-nav-brand-copy">
                        <strong>{shopName}</strong>
                        <small>Operations Management System</small>
                    </span>
                </Link>

                <nav className="public-nav-actions" aria-label="Account navigation">
                    <Link
<<<<<<< Updated upstream
=======
                        className={`public-nav-link${isCelebrationPage ? " active" : ""}`}
                        to="/login"
                        aria-current={isCelebrationPage ? "page" : undefined}
                    >
                        Raison
                    </Link>
                    <Link
>>>>>>> Stashed changes
                        className={`public-nav-link${isLoginPage ? " active" : ""}`}
                        to="/login"
                        aria-current={isLoginPage ? "page" : undefined}
                    >
                        Sign in
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default UserLoginNav;
