
import React, { useState, useEffect } from "react";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Link from '@mui/material/Link';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Collapse from '@mui/material/Collapse';
import ListSubheader from '@mui/material/ListSubheader';

const drawerWidth = 240;



const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,

                    }),
                    marginLeft: 0,

                },
            },
        ],
    }),
);

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

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const [open2, setOpen2] = React.useState(false);
    const handleClick2 = () => {
        setOpen2(!open2);
    };

    const [open3, setOpen3] = React.useState(false);
    const handleClick3 = () => {
        setOpen3(!open3);
    };

    const [open4, setOpen4] = React.useState(false);
    const handleClick4 = () => {
        setOpen4(!open4);
    };

    const [open5, setOpen5] = React.useState(false);
    const handleClick5 = () => {
        setOpen5(!open5);
    };

    const [open6, setOpen6] = React.useState(false);
    const handleClick6 = () => {
        setOpen6(!open6);
    };

    const [open7, setOpen7] = React.useState(false);
    const handleClick7 = () => {
        setOpen7(!open7);
    };

    const [open8, setOpen8] = React.useState(false);
    const handleClick8 = () => {
        setOpen8(!open8);
    };

    const [open9, setOpen9] = React.useState(false);
    const handleClick9 = () => {
        setOpen9(!open9);
    };

    const [open10, setOpen10] = React.useState(false);
    const handleClick10 = () => {
        setOpen10(!open10);
    };

    const [open11, setOpen11] = React.useState(false);
    const handleClick11 = () => {
        setOpen11(!open11);
    };

    const [open12, setOpen12] = React.useState(false);
    const handleClick12 = () => {
        setOpen12(!open12);
    };

    const [open13, setOpen13] = React.useState(false);
    const handleClick13 = () => {
        setOpen13(!open13);
    };

    const [open14, setOpen14] = React.useState(false);
    const handleClick14 = () => {
        setOpen14(!open14);
    };

    const [open15, setOpen15] = React.useState(false);
    const handleClick15 = () => {
        setOpen15(!open15);
    };

    const [open16, setOpen16] = React.useState(false);
    const handleClick16 = () => {
        setOpen16(!open16);
    };

    const [open17, setOpen17] = React.useState(false);
    const handleClick17 = () => {
        setOpen17(!open17);
    };






    const [navList, setNavList] = useState([
        {
            "name": "Prod`1`cts",
            "url": "/addProduct"
        },
        {
            "name": "Brand",
            "url": "/addBrand"
        },

    ]);

    const [categoryList, setCategoryList] = useState([
        {
            "name": "Category List",
            "url": "/categoryList",
            "icon": ""
        },
        {
            "name": "Add Category",
            "url": "/addCategory",
            "icon": ""
        }
    ]);

    const [brandList, setBrandList] = useState([
        {
            "name": "Brand List",
            "url": "/brandListV2",
            "icon": ""
        },
        {
            "name": "Add Brand",
            "url": "/brand",
            "icon": ""
        }
    ]);

    const [supplierList, setSupplierList] = useState([
        {
            "name": "Supplier",
            "url": "/supplierListV2",
            "icon": ""
        },
        {
            "name": "Add Supplier",
            "url": "/supplier",
            "icon": ""
        },
        {
            "name": "Add Product Supplier",
            "url": "/productSupplier",
            "icon": ""
        },
        {
            "name": "Product Supplier List",
            "url": "/productSupplierList",
            "icon": ""
        }
    ]);

    const [customerList, setCustomerList] = useState([
        {
            "name": "Customer",
            "url": "/customerListV2",
            "icon": ""
        },
        {
            "name": "Add Customer",
            "url": "/customers",
            "icon": ""
        },
        {
            "name": "Customer List Transaction",
            "url": "/customerListTransaction",
            "icon": ""
        },
        {
            "name": "Customer History",
            "url": "/customerHistory",
            "icon": ""
        }
    ]);

    const [productList, setProductList] = useState([
        {
            "name": "Product",
            "url": "/productList",
            "icon": ""
        },
        {
            "name": "Add Product",
            "url": "/addProduct",
            "icon": ""
        },
        {
            "name": "Product List V2",
            "url": "/productListV2",
            "icon": ""
        }
    ]);

    const [warehouseList, setWareHouseList] = useState([
        {
            "name": "Warehouse",
            "url": "/warehouseListV2",
            "icon": ""
        },
        {
            "name": "Add Warehouse",
            "url": "/warehouse",
            "icon": ""
        }
    ]);

    const [shopList, setShopList] = useState([
        {
            "name": "Shop",
            "url": "/shopListV2",
            "icon": ""
        },
        {
            "name": "Add Shop",
            "url": "/shop",
            "icon": ""
        }
    ]);

    const [paymentType, setPaymentType] = useState([
        {
            "name": "Add Payment Type Customer",
            "url": "/paymentType",
            "icon": ""
        },
        {
            "name": "Add Payment Type Supplier",
            "url": "/poPaymentType",
            "icon": ""
        }
    ]);

    const [paymentTypeList, setPaymentTypeList] = useState([
        {
            "name": "Payment Type List",
            "url": "/paymentTermTransaction",
            "icon": ""
        },
        {
            "name": "Online Payment List",
            "url": "/viewPaymentTermTransaction/2",
            "icon": ""
        }
    ]);

    const [creditCard, setCreditCard] = useState([
        {
            "name": "Credit Card Payment List",
            "url": "/creditCardPaymentList",
            "icon": ""
        },
        {
            "name": "Upcoming Credit Card Due List",
            "url": "/viewCreditCardDueList",
            "icon": ""
        },
        {
            "name": "Paid Credit Card List",
            "url": "/viewPaidCreditCardDueList",
            "icon": ""
        }
    ]);

    const [cheque, setCheque] = useState([
        {
            "name": "Cheque Bank List",
            "url": "/chequePaymentList",
            "icon": ""
        },
        {
            "name": "Upcoming Cheque Payment Due List",
            "url": "/viewChequeDueList",
            "icon": ""
        },
        {
            "name": "Paid Cheque Payment Due List",
            "url": "/viewPaidChequeDueList",
            "icon": ""
        }
    ]);

    const [loan, setLoan] = useState([
        {
            "name": "Loan List",
            "url": "/loanList",
            "icon": ""
        },
        {
            "name": "Add Loan",
            "url": "/addInstallment",
            "icon": ""
        },
        {
            "name": "Upcoming Loan Due Date",
            "url": "/upcomingLoanList",
            "icon": ""
        }
    ]);

    const [stock, setStock] = useState([
        {
            "name": "Stock List",
            "url": "/addStock",
            "icon": ""
        },
        {
            "name": "Stock Warning",
            "url": "/stockWarning",
            "icon": ""
        }
    ]);

    const [purchaseOrder, setPurchaseOrder] = useState([
        {
            "name": "Purchase Order List",
            "url": "/supplierTransactionList",
            "icon": ""
        },
        {
            "name": "Add Purchase Order Stock",
            "url": "/orderSupplierTransaction",
            "icon": ""
        }
    ]);

    const [shopOrder, setShopOrder] = useState([
        {
            "name": "Shop Order List",
            "url": "/shopOrderTransaction/shorOrderTransactionList",
            "icon": ""
        },
        {
            "name": "Add Shop Order Stock",
            "url": "/shopOrderTransaction",
            "icon": ""
        }
    ]);

    const [customerOrder, setCustomerOrder] = useState([
        {
            "name": "Expenses",
            "url": "/expenses",
            "icon": ""
        },
        {
            "name": "Expenses Type",
            "url": "/expensesType",
            "icon": ""
        },

    ]);

    const [report, setReport] = useState([
        {
            "name": "Transaction Report List",
            "url": "/shopOrderTransaction/transactionReportList",
            "icon": ""
        },
        {
            "name": "Pending Transaction List",
            "url": "/shopOrderTransaction/pendingTransactionList",
            "icon": ""
        },
        {
            "name": "Cancel Transaction List",
            "url": "/shopOrderTransaction/cancelTransactionList",
            "icon": ""
        },
        {
            "name": "Customer Record List",
            "url": "/reports/reportCustomerSorted",
            "icon": ""
        },
        {
            "name": "Product Sold Record List",
            "url": "/reports/reportProductSorted",
            "icon": ""
        },
        {
            "name": "Product Capital Record List",
            "url": "/reports/productValueReport",
            "icon": ""
        },
        {
            "name": "Online Order Reports",
            "url": "/reports/reportsList",
            "icon": ""
        },
        {
            "name": "Purchase Order Reports",
            "url": "/reports/reportPurchaseOrder",
            "icon": ""
        },
        {
            "name": "Shop Order Reports",
            "url": "/reports/shopBranchReportList",
            "icon": ""
        },
        {
            "name": "Expenses Reports",
            "url": "/reports/reportExpenses",
            "icon": ""
        },

    ]);




    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }} >
            <CssBaseline />
            <AppBar position="fixed" open={open} sx={{ bgcolor: "maroon" }} >
                <Toolbar>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                mr: 2,
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h5" noWrap component="div" >
                        MDR Baking
                    </Typography>

                    <Nav >
                        <NavDropdown title="Customer" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/customers">Add Customer</NavDropdown.Item>
                            <NavDropdown.Item href="/customerListV2">Customer List</NavDropdown.Item>
                            <NavDropdown.Item href="/customerListTransaction">Customer List Transaction</NavDropdown.Item>
                            <NavDropdown.Item href="/customerHistory">Customer History</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                    <Nav >
                        <NavDropdown title="Customer Order" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/customerOrderTransaction">Add Customer Order</NavDropdown.Item>
                            <NavDropdown.Item href="/shopOrderTransaction/customerOrderTransactionList">Customer Order List</NavDropdown.Item>
                            <NavDropdown.Item href="/shopOrderTransaction/quantitySortedList">Sorted Product List</NavDropdown.Item>
                            <NavDropdown.Item href="/shopOrderTransaction/customerSortedList">Sorted Customer List</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                </Toolbar>
            </AppBar>
            <Drawer

                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader sx={{ bgcolor: "maroon" }}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />

                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                // subheader={
                //     <ListSubheader component="div" id="nested-list-subheader">
                //         Nested List Items
                //     </ListSubheader>
                // }
                >
                    <ListItemButton onClick={handleClick2}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Category" />
                        {open2 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open2} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {categoryList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick3}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Brand" />
                        {open3 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open3} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {brandList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>


                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick4}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Supplier" />
                        {open4 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open4} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {supplierList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>


                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick5}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Customer" />
                        {open5 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open5} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {customerList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick6}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Product" />
                        {open6 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open6} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {productList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick6}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Warehouse" />
                        {open6 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open6} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {warehouseList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 370, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick7}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Shop" />
                        {open7 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open7} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {shopList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 380, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick8}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Bank" />
                        {open8 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open8} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {paymentType.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 390, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick9}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Online Payment" />
                        {open9 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open9} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {paymentTypeList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 3100, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick10}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Credit Card" />
                        {open10 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open10} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {creditCard.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 3100, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick11}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cheque" />
                        {open11 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open11} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {cheque.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 3100, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick12}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Loan" />
                        {open12 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open12} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {loan.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 3100, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick13}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Stock" />
                        {open13 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open13} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {stock.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 3100, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick14}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Purchase Order" />
                        {open14 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open14} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {purchaseOrder.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 3100, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick15}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Shop Order" />
                        {open15 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open15} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {shopOrder.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 3100, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick16}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Customer Order" />
                        {open16 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open16} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {customerOrder.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

                <List
                    sx={{ width: '100%', maxWidth: 3100, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick17}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Report" />
                        {open17 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open17} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {report.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>





                {/* <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>


                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}

                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>

                        </ListItem>
                    ))}
                </List> */}
            </Drawer>

        </Box >
    );
}
