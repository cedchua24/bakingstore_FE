
import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import DrawerNav from "./DrawerNav";
import UserLoginNav from "./UserLoginNav";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';
import { useLocation } from "react-router-dom";
import { hasValidAuthSession } from "../User/authSession";

const NewNavBar = (props) => {
    const location = useLocation();
    const isReceiptOrderPage = location.pathname.startsWith("/shopOrderTransaction/receiptOrder/");
    const isReceiptSupplierPage = location.pathname.startsWith("/printOrderSupplier/");
    const isReceipShopBranchPage = location.pathname.startsWith("/shopOrderTransaction/printShopBranch/");



    var AuthButtons = '';
    // Hide nav on receiptOrder page
    if (isReceiptOrderPage || isReceiptSupplierPage || isReceipShopBranchPage) {
        AuthButtons = null; // or empty fragment <></>
    } else {
        if (!hasValidAuthSession()) {
            AuthButtons = <UserLoginNav />;
        } else {
            AuthButtons = <DrawerNav />;
        }
    }


    return (
        <div>
            <Box sx={{ display: 'flex' }} >
                {AuthButtons}
            </Box >
        </div>
    )
}

export default NewNavBar
