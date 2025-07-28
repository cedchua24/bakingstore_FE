
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

    const navigate = useNavigate();

    const logoutSubmit = (e) => {
        e.preventDefault();
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`api/logout/`).then(response => {
                if (response.data.status === 200) {
                    localStorage.removeItem('auth_token', response.data.token);
                    localStorage.removeItem('auth_name', response.data.email);
                    // swal("Success", response.data.message, "success");
                    // window.location.reload();
                    navigate('/login');
                    window.location.reload();

                } else if (response.data.status === 401) {
                    swal("warning", response.data.message, "warning")
                }
            });
        });


    }

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
