import React, { useState, useEffect } from "react";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

const MobileTest = () => {

    useEffect(() => {

    }, []);

    const [paymentTypeList, setPaymentTypeList] = useState([]);





    return (
        <div>
            <h1>test</h1>
            <BrowserView>
                <h1>This is rendered only in browser</h1>
            </BrowserView>
            <MobileView>
                <h1>This is rendered only on mobile</h1>
            </MobileView>
        </div>
    )

}
export default MobileTest
