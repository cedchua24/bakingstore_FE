
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

const NewNavBar = (props) => {

    var AuthButtons = '';
    if (!localStorage.getItem('auth_token')) {
        AuthButtons = (
            // <>
            //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
            //     <Navbar.Collapse id="basic-navbar-nav">
            //         <Nav className="me-auto">
            //             <Nav.Link href="/userRegistration">Register</Nav.Link>
            //             <Nav.Link href="/login">Login</Nav.Link>
            //         </Nav>
            //     </Navbar.Collapse>
            // </>
            <UserLoginNav />
        );


    }
    else {
        AuthButtons = (
            <DrawerNav />
        );
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
