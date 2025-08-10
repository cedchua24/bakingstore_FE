
import React, { useState, useEffect } from "react";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';

const drawerWidth = 240;


const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,

    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                width: `calc(100% - ${drawerWidth}px)`,

                marginLeft: `${drawerWidth}px`,
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));


export default function PersistentDrawerLeft() {

    const navigate = useNavigate();

    const loginSubmit = (e) => {
        navigate('/');
        window.location.reload();
    }

    const registerSubmit = (e) => {
        navigate('/userRegistration');
        window.location.reload();

    }

    return (
        <Box sx={{ display: 'flex' }} >
            <CssBaseline />
            <AppBar position="fixed" sx={{ bgcolor: "maroon" }} >
                <Toolbar>


                    <Typography variant="h5" noWrap component="div">
                        MDR Baking
                    </Typography>
                    <List>

                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center', marginLeft: 10 }} onClick={loginSubmit}>
                                <ListItemText primary="Login" />
                            </ListItemButton>
                            {/* <ListItemButton sx={{ textAlign: 'center' }} onClick={registerSubmit}>
                                <ListItemText primary="Register" />
                            </ListItemButton> */}
                        </ListItem>

                    </List>

                    {/* <button className="nav-link btn btn-danger btn-sm text-white" type='button' onClick={loginSubmit} >Login</button>
                    <button className="nav-link btn btn-danger btn-sm text-white" type='button' o >Register</button>
                    <button className="nav-link btn btn-danger btn-sm text-white" type='button' onClick={logoutSubmit} >Logout</button> */}

                </Toolbar>
            </AppBar>

        </Box >
    );
}
