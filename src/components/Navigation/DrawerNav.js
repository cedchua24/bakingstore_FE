
import { useState, useEffect } from "react";
import * as React from 'react';
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
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import UserService from '../User/UserService.service'

import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Collapse from '@mui/material/Collapse';
import ListSubheader from '@mui/material/ListSubheader';
import Menu from '@mui/material/Menu';

import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';


import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CategoryIcon from '@mui/icons-material/Category';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import StoreIcon from '@mui/icons-material/Store';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import PageviewIcon from '@mui/icons-material/Pageview';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import TodayIcon from '@mui/icons-material/Today';
import PersonIcon from '@mui/icons-material/Person';
import DiscountIcon from '@mui/icons-material/Discount';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import moment from "moment";

import { pink } from '@mui/material/colors';

const drawerWidth = 300;



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

    const navigate = useNavigate();
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

    const [open66, setOpen66] = React.useState(false);
    const handleClick66 = () => {
        setOpen66(!open66);
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

    const [open18, setOpen18] = React.useState(false);
    const handleClick18 = () => {
        setOpen18(!open18);
    };

    const [open19, setOpen19] = React.useState(false);
    const handleClick19 = () => {
        setOpen19(!open19);
    };

    const [open20, setOpen20] = React.useState(false);
    const handleClick20 = () => {
        setOpen20(!open20);
    };

    const [open21, setOpen21] = React.useState(false);
    const handleClick21 = () => {
        setOpen21(!open21);
    };



    const [categoryList, setCategoryList] = useState({
        "nameCategory": "Category",
        "iconCategory": <CategoryIcon color="primary" />,
        "data": [
            {
                "name": "Add Category",
                "url": "/addCategory",
                "icon": <AddIcon />
            },
            {
                "name": "Category List",
                "url": "/categoryList",
                "icon": <ListIcon />
            }
        ]
    });

    const [brandList, setBrandList] = useState([
        {
            "name": "Add Brand",
            "url": "/brand",
            "icon": <AddIcon />
        },
        {
            "name": "Brand List",
            "url": "/brandListV2",
            "icon": <ListIcon />
        },

    ]);

    const [supplierList, setSupplierList] = useState([
        {
            "name": "Add Supplier",
            "url": "/supplier",
            "icon": <AddIcon />
        },
        {
            "name": "Add Product Supplier",
            "url": "/productSupplier",
            "icon": <AddIcon />
        },
        {
            "name": "Supplier List",
            "url": "/supplierListV2",
            "icon": <ListIcon />
        },

        {
            "name": "Product Supplier List",
            "url": "/productSupplierList",
            "icon": <ListIcon />
        }
    ]);

    const [customerList, setCustomerList] = useState([
        {
            "name": "Add Customer",
            "url": "/customers",
            "icon": <AddIcon />
        },
        {
            "name": "Customer List",
            "url": "/customerListV2",
            "icon": <ListIcon />
        },
        {
            "name": "Customer Ads",
            "url": "/customerAds",
            "icon": <ListIcon />
        },
        {
            "name": "Customer List Transaction",
            "url": "/customerListTransaction",
            "icon": <ListIcon />
        },
        {
            "name": "Customer History",
            "url": "/customerHistory",
            "icon": <ListIcon />
        }

    ]);

    const [productList, setProductList] = useState([
        {
            "name": "Add Product",
            "url": "/addProduct",
            "icon": <AddIcon />
        },
        {
            "name": "Product List",
            "url": "/productList",
            "icon": <ListIcon />
        },
        {
            "name": "Product Note List",
            "url": "/productNoteList",
            "icon": <ListIcon />
        },
        {
            "name": "Product List Expiration",
            "url": "/productExpirationList",
            "icon": <ListIcon />
        }
        ,
        {
            "name": "Product List Disabled",
            "url": "/productListDisabled",
            "icon": <ListIcon />
        }


    ]);

    const [warehouseList, setWareHouseList] = useState([
        {
            "name": "Add Warehouse",
            "url": "/warehouse",
            "icon": <AddIcon />
        },
        {
            "name": "Warehouse",
            "url": "/warehouseListV2",
            "icon": <ListIcon />
        },

    ]);

    const [shopList, setShopList] = useState([
        {
            "name": "Add Shop",
            "url": "/shop",
            "icon": <AddIcon />
        },
        {
            "name": "Shop List",
            "url": "/shopListV2",
            "icon": <ListIcon />
        }
    ]);

    const [paymentType, setPaymentType] = useState([
        {
            "name": "Add Payment Type Customer",
            "url": "/paymentType",
            "icon": <AddIcon />
        },
        {
            "name": "Add Payment Type Supplier",
            "url": "/poPaymentType",
            "icon": <AddIcon />
        }
    ]);

    const [paymentTypeList, setPaymentTypeList] = useState([
        {
            "name": "Payment Type List",
            "url": "/paymentTermTransaction",
            "icon": <ListIcon />
        },
        {
            "name": "Online Payment List",
            "url": "/viewPaymentTermTransaction/2",
            "icon": <ListIcon />
        }
    ]);

    const [creditCard, setCreditCard] = useState([
        {
            "name": "Credit Card Payment List",
            "url": "/creditCardPaymentList",
            "icon": <ListIcon />
        },
        {
            "name": "Upcoming Credit Card Due List",
            "url": "/viewCreditCardDueList",
            "icon": <ListIcon />
        },
        {
            "name": "Paid Credit Card List",
            "url": "/viewPaidCreditCardDueList",
            "icon": <ListIcon />
        }
    ]);

    const [cheque, setCheque] = useState([
        {
            "name": "Cheque Bank List",
            "url": "/chequePaymentList",
            "icon": <ListIcon />
        },
        {
            "name": "Upcoming Cheque Payment Due List",
            "url": "/viewChequeDueList",
            "icon": <ListIcon />
        },
        {
            "name": "Paid Cheque Payment Due List",
            "url": "/viewPaidChequeDueList",
            "icon": <ListIcon />
        }
    ]);

    const [loan, setLoan] = useState([
        {
            "name": "Add Loan",
            "url": "/addInstallment",
            "icon": <AddIcon />
        },
        {
            "name": "Loan List",
            "url": "/loanList",
            "icon": <ListIcon />
        },

        {
            "name": "Upcoming Loan Due Date",
            "url": "/upcomingLoanList",
            "icon": <ListIcon />
        }
    ]);

    const [stock, setStock] = useState([
        {
            "name": "Stock List",
            "url": "/addStock",
            "icon": <ListIcon />
        },
        {
            "name": "Stock Per Supplier",
            "url": "/stockSupplier",
            "icon": <ListIcon />
        },
        {
            "name": "Modifed Stock Daily",
            "url": "/modifiedStock",
            "icon": <ListIcon />
        },
        {
            "name": "Stock Warning ",
            "url": "/stockWarning",
            "icon": <ListIcon />
        },
        {
            "name": "Stock Warning Per Supplier",
            "url": "/stockSupplierWarning",
            "icon": <ListIcon />
        },
        // {
        //     "name": "No Stock Warning",
        //     "url": "/noStockWarning",
        //     "icon": <ListIcon />
        // },
        {
            "name": "Customer to Notify Stock",
            "url": "/outOfStockReturn",
            "icon": <ListIcon />
        },

        {
            "name": "Out of Stock",
            "url": "/noStock",
            "icon": <ListIcon />
        }
    ]);

    const [purchaseOrder, setPurchaseOrder] = useState([
        {
            "name": "Add Purchase Order Stock",
            "url": "/orderSupplierTransaction",
            "icon": <AddIcon />
        },
        {
            "name": "Purchase Order List",
            "url": "/supplierTransactionList",
            "icon": <ListIcon />
        }

    ]);

    const [shopOrder, setShopOrder] = useState([
        {
            "name": "Shop Branch Order List",
            "url": "/shopOrderTransaction/shorOrderTransactionList",
            "icon": <ListIcon />
        },
        {
            "name": "Add Branch Shop Order",
            "url": "/shopOrderTransaction",
            "icon": <ListIcon />
        }
    ]);

    const [expense, setExpense] = useState([
        {
            "name": "Add Expense",
            "url": "/expenses",
            "icon": <AddIcon />
        },
        {
            "name": "Add Expense Type",
            "url": "/expensesType",
            "icon": <ListIcon />
        },

    ]);


    const [markup, setMarkUp] = useState([
        {
            "name": "Add Mark-Up Price",
            "url": "/markUpPrice",
            "icon": <AddIcon />
        }
        ,
        {
            "name": "Mark-Up Price List",
            "url": "/markUpPriceListV2",
            "icon": <ListIcon />
        },
        {
            "name": "Mark-Up New Price",
            "url": "/markUpNewPrice",
            "icon": <ListIcon />
        }
    ]);

    const [spoilage, setSpoilage] = useState([
        {
            "name": "Add Spoilage",
            "url": "/productSpoilageList",
            "icon": <AddIcon />
        }
        ,
        {
            "name": "Spoilage List",
            "url": "/spoilageList",
            "icon": <ListIcon />
        }
    ]);

    const [rts, setRts] = useState([
        {
            "name": "Add RTS/BO",
            "url": "/rts/addRTS",
            "icon": <AddIcon />
        }
        ,
        {
            "name": "RTS/BO List",
            "url": "/rts/rTSList",
            "icon": <ListIcon />
        }
    ]);



    const [transactionReportList, setTransactionReportList] = useState([
        {
            "name": "Transaction Daily",
            "url": "/shopOrderTransaction/customerOrderTransactionList/" + moment().format("YYYY-MM-DD"),
            "icon": <TodayIcon />
        },
        {
            "name": "Transaction List",
            "url": "/reports/reportsList",
            "icon": <ListIcon />
        },
        {
            "name": "Sales List",
            "url": "/reports/reportSales",
            "icon": <ListIcon />
        },
        {
            "name": "Pending Payment List",
            "url": "/shopOrderTransaction/pendingTransactionList",
            "icon": <ListIcon />
        },
        {
            "name": "Pending Pick Up List",
            "url": "/shopOrderTransaction/pendingPickUp",
            "icon": <ListIcon />
        }
    ]);

    const [purchaseOrderReportList, setPurchaseOrderReportList] = useState([
        {
            "name": "PO Daily",
            "url": "/reports/reportPurchaseOrder",
            "icon": <ListIcon />
        },
        {
            "name": "PO All List",
            "url": "/reports/reportPurchaseOrderList",
            "icon": <ListIcon />
        },
        {
            "name": "PO Pending Payment List",
            "url": "/reports/ReportPurchaseOrderPendingList",
            "icon": <ListIcon />
        }

    ]);

    const [discountReportList, setDiscountReportList] = useState([
        {
            "name": "Discount List",
            "url": "/reports/reportDiscount",
            "icon": <ListIcon />
        },
        {
            "name": "Discount/Sale Loss List",
            "url": "/reports/reportDiscountLoss",
            "icon": <ListIcon />
        },
    ]);

    const [deliveryList, setDeliveryList] = useState([
        {
            "name": "Delivery List",
            "url": "/reports/reportDelivery",
            "icon": <ListIcon />
        },
        {
            "name": "Pending Delivery",
            "url": "/reports/reportPendingDelivery",
            "icon": <ListIcon />
        },
    ]);

    const [expenseReportList, setExpenseReportList] = useState([
        {
            "name": "Expenses List",
            "url": "/reports/reportExpenses",
            "icon": <ListIcon />
        },
    ]);

    const [productReportList, setProductReportList] = useState([
        {
            "name": "Product Sold Record List",
            "url": "/reports/reportProductSorted",
            "icon": <ListIcon />
        },
        {
            "name": "Product Capital Record List",
            "url": "/reports/productValueReport",
            "icon": <ListIcon />
        },
    ]);

    const [categoryReportList, setCategoryReportList] = useState([
        {
            "name": "Category Sales List",
            "url": "/reports/reportCategorySales",
            "icon": <ListIcon />
        }
    ]);



    const [stockReportList, setStockReportList] = useState([
        {
            "name": "Modified Stock List",
            "url": "/reports/reportModifiedStock",
            "icon": <ListIcon />
        }
    ]);

    const [spoilageReportList, setSpoilageReportList] = useState([
        {
            "name": "Spoilage List",
            "url": "/reports/reportSpoilage",
            "icon": <ListIcon />
        }
    ]);

    const [customerReportList, setCustomerReportList] = useState([
        {
            "name": "Customer Record List",
            "url": "/reports/reportCustomerSorted",
            "icon": <ListIcon />
        },
    ]);

    const [shopBranchOrderReportList, setShopBranchOrderReportList] = useState([
        {
            "name": "Shop Branch Order Reports",
            "url": "/reports/shopBranchReportList",
            "icon": <ListIcon />
        },
    ]);

    const [settingList, setSettingsList] = useState([
        {
            "name": "Credit Card Due",
            "url": "/settings/creditCardDueSettings",
            "icon": <AddIcon />
        },
    ]);


    const [report, setReport] = useState([

        {
            "name": "Shop Branch Order Reports",
            "url": "/reports/shopBranchReportList",
            "icon": ""
        },


    ]);




    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleChange = (event) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logoutSubmit = (e) => {
        e.preventDefault();
        UserService.sanctum().then(response => {
            UserService.logout().then(response => {
                if (response.data.status === 200) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('name');
                    localStorage.removeItem('auth_user_id');
                    localStorage.removeItem('role_as');

                    navigate('/login');
                    window.location.reload();

                } else if (response.data.status === 401) {
                    swal("warning", response.data.message, "warning")
                }
            });
        });

    }

    //Report
    const [openReport, setOpenReport] = React.useState(false);
    const handleClickReport = () => {
        setOpenReport(!openReport);
    };

    // Purchase Order Report
    const [openPurchaseOrderReport, setOpenPurchaseOrderReport] = React.useState(false);
    const handleClickPurchaseOrderReport = () => {
        setOpenPurchaseOrderReport(!openPurchaseOrderReport);
    };


    // Transaction Report
    const [openTransactionReport, setOpenTransactionReport] = React.useState(false);
    const handleClickTransactionReport = () => {
        setOpenTransactionReport(!openTransactionReport);
    };

    // Delivery Report
    const [openDeliveryReport, setOpenDeliveryReport] = React.useState(false);
    const handleClickDeliveryReport = () => {
        setOpenDeliveryReport(!openDeliveryReport);
    };

    // Discount Report
    const [openDiscountReport, setOpenDiscountReport] = React.useState(false);
    const handleClickDiscountReport = () => {
        setOpenDiscountReport(!openDiscountReport);
    };

    // Expense Report
    const [openExpenseReport, setOpenExpenseReport] = React.useState(false);
    const handleClickExpenseReport = () => {
        setOpenExpenseReport(!openExpenseReport);
    };

    // Product Report
    const [openProductReport, setOpenProductReport] = React.useState(false);
    const handleClickProductReport = () => {
        setOpenProductReport(!openProductReport);
    };

    const [openCategoryReport, setOpenCategoryReport] = React.useState(false);
    const handleClickCategoryReport = () => {
        setOpenCategoryReport(!openCategoryReport);
    };

    // Stock Report
    const [openStockReport, setOpenStockReport] = React.useState(false);
    const handleClickStockReport = () => {
        setOpenStockReport(!openStockReport);
    };

    // Spoilage Report
    const [openSpoilageReport, setOpenSpoilageReport] = React.useState(false);
    const handleClickSpoilageReport = () => {
        setOpenSpoilageReport(!openSpoilageReport);
    };

    const [openCustomerReport, setOpenCustomerReport] = React.useState(false);
    const handleClickCustomerReport = () => {
        setOpenCustomerReport(!openCustomerReport);
    };

    // ShopBranchOrder Report
    const [openShopBranchOrderReport, setOpenShopBranchOrderReport] = React.useState(false);
    const handleClickShopBranchOrderReport = () => {
        setOpenShopBranchOrderReport(!openShopBranchOrderReport);
    };

    // Settings
    const [settings, setSettings] = React.useState(false);
    const handleSettings = () => {
        setSettings(!settings);
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
                        MDR Caloocan
                    </Typography>

                    <Nav >
                        <NavDropdown title="Customer" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/customers">Add Customer</NavDropdown.Item>
                            <NavDropdown.Item href="/customerListV2">Customer List</NavDropdown.Item>
                            <NavDropdown.Item href="/customerAds">Customer Ads</NavDropdown.Item>
                            <NavDropdown.Item href="/customerListTransaction">Customer List Transaction</NavDropdown.Item>


                        </NavDropdown>
                    </Nav>

                    <Nav >
                        <NavDropdown title="Customer Reminder" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/customerHistory">Customer Need to Follow up </NavDropdown.Item>
                            <NavDropdown.Item href="/customerConvo">Customer Done Following up</NavDropdown.Item>
                            <NavDropdown.Item href="/customerReOrder">List of Customer Successfully Reordered</NavDropdown.Item>
                            <NavDropdown.Item href="/customerBacklog">Customer Backlog List</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                    <Nav >
                        <NavDropdown title="Customer Order" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/customerOrderTransaction">Add Customer Order</NavDropdown.Item>
                            <NavDropdown.Item href={`/shopOrderTransaction/customerOrderTransactionList/${moment().format("YYYY-MM-DD")}`}>  Customer Order List </NavDropdown.Item>
                            <NavDropdown.Item href="/shopOrderTransaction/quantitySortedList">Top Product Today</NavDropdown.Item>
                            <NavDropdown.Item href="/shopOrderTransaction/customerSortedList">Top Customer Today</NavDropdown.Item>
                            <NavDropdown.Item href="/shopOrderTransaction/pendingDelivery">For Delivery</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                    <Nav >
                        <NavDropdown title="Daily Store Session" id="basic-nav-dropdown">
                            <NavDropdown.Item href={`/dashboard/startOfDay/${moment().format("YYYY-MM-DD")}`}>  Start of Day </NavDropdown.Item>
                            <NavDropdown.Item href={`/dashboard/productSoldToday/${moment().format("YYYY-MM-DD")}`}> End of Day </NavDropdown.Item>
                            <NavDropdown.Item href={`/dashboard/productSoldTodayCheckList/${moment().format("YYYY-MM-DD")}`}> Product Sold Checklist </NavDropdown.Item>

                        </NavDropdown>
                    </Nav>



                    <Typography variant="h6" noWrap component="div" sx={{ color: "LightGray", marginLeft: 100 }}>
                        {localStorage.getItem('name')}
                    </Typography>
                    <div >
                        <IconButton
                            sx={{ textAlign: 'center' }}
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={logoutSubmit}>Logout</MenuItem>
                        </Menu>
                    </div>



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

                <div>
                    <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >
                        <ListItemButton onClick={handleClick2}>
                            <ListItemIcon>
                                {categoryList.iconCategory}
                            </ListItemIcon>
                            <ListItemText primary={categoryList.nameCategory} />
                            {open2 ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={open2} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {categoryList.data.map((nav, index) => (
                                    <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                        <ListItemButton sx={{ pl: 6 }}>
                                            <ListItemIcon>
                                                {nav.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </List>

                </div>

                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick3}>
                        <ListItemIcon>
                            <BrandingWatermarkIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Brand" />
                        {open3 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open3} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {brandList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                            <StoreIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Supplier" />
                        {open4 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open4} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {supplierList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>


                {/* <List
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
                </List> */}

                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    <ListItemButton onClick={handleClick6}>
                        <ListItemIcon>
                            <LocalCafeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Product" />
                        {open6 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open6} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {productList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                    <ListItemButton onClick={handleClick66}>
                        <ListItemIcon>
                            <WarehouseIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Warehouse" />
                        {open66 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open66} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {warehouseList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                            <StorefrontIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Shop" />
                        {open7 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open7} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {shopList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                            <AccountBalanceIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Bank" />
                        {open8 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open8} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {paymentType.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                            <PaymentIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Online Payment" />
                        {open9 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open9} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {paymentTypeList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                            <CreditCardIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Credit Card" />
                        {open10 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open10} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {creditCard.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                            <ReceiptIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Cheque" />
                        {open11 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open11} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {cheque.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                            <CreditScoreIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Loan" />
                        {open12 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open12} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {loan.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                            <InventoryIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Stock" />
                        {open13 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open13} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {stock.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                    <ListItemButton onClick={handleClick18}>
                        <ListItemIcon>
                            <PriceCheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Mark Up" />
                        {open18 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open18} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {markup.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                            <ShoppingCartIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Purchase Order" />
                        {open14 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open14} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {purchaseOrder.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                            <StorefrontIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Shop Branch Order" />
                        {open15 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open15} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {shopOrder.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                    <ListItemButton onClick={handleClick19}>
                        <ListItemIcon>
                            <CardTravelIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Expense" />
                        {open19 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open19} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {expense.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                    <ListItemButton onClick={handleClick20}>
                        <ListItemIcon>
                            <RemoveModeratorIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Spoilage" />
                        {open20 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open20} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {spoilage.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                    <ListItemButton onClick={handleClick21}>
                        <ListItemIcon>
                            <AssignmentReturnIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="RTS/BO" />
                        {open21 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open21} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {rts.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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
                    <ListItemButton onClick={handleSettings}>
                        <ListItemIcon>
                            <SettingsIcon sx={{ color: pink[500] }} />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                        {settings ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={settings} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {settingList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
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


                    <ListItemButton onClick={handleClickReport}>
                        <ListItemIcon>
                            <LeaderboardIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText primary="Reports" />
                        {openReport ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openReport} timeout="auto" unmountOnExit>

                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickTransactionReport}>
                            <ListItemIcon>
                                <PointOfSaleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Transaction Report" />
                            {openTransactionReport ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>


                        <Collapse in={openTransactionReport} timeout="auto" unmountOnExit>
                            {transactionReportList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Collapse>

                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickDeliveryReport}>
                            <ListItemIcon>
                                <LocalShippingIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Delivery Report" />
                            {openDeliveryReport ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>


                        <Collapse in={openDeliveryReport} timeout="auto" unmountOnExit>
                            {deliveryList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Collapse>

                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickPurchaseOrderReport}>
                            <ListItemIcon>
                                <ShoppingCartIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Purchase Order Report" />
                            {openPurchaseOrderReport ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={openPurchaseOrderReport} timeout="auto" unmountOnExit>
                            {purchaseOrderReportList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Collapse>

                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickDiscountReport}>
                            <ListItemIcon>
                                <DiscountIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Discount Report" />
                            {openDiscountReport ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={openDiscountReport} timeout="auto" unmountOnExit>
                            {discountReportList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Collapse>

                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickExpenseReport}>
                            <ListItemIcon>
                                <CardTravelIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Expense Report" />
                            {openExpenseReport ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={openExpenseReport} timeout="auto" unmountOnExit>
                            {expenseReportList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Collapse>

                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickProductReport}>
                            <ListItemIcon>
                                <LocalCafeIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Product Report" />
                            {openProductReport ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={openProductReport} timeout="auto" unmountOnExit>
                            {productReportList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Collapse>

                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickCategoryReport}>
                            <ListItemIcon>
                                <CategoryIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Category Report" />
                            {openCategoryReport ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={openCategoryReport} timeout="auto" unmountOnExit>
                            {categoryReportList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Collapse>

                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickStockReport}>
                            <ListItemIcon>
                                <InventoryIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Stock Report" />
                            {openStockReport ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={openStockReport} timeout="auto" unmountOnExit>
                            {stockReportList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Collapse>

                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickSpoilageReport}>
                            <ListItemIcon>
                                <RemoveModeratorIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Spoilage Report" />
                            {openSpoilageReport ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={openSpoilageReport} timeout="auto" unmountOnExit>
                            {spoilageReportList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Collapse>


                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickCustomerReport}>
                            <ListItemIcon>
                                <PersonIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Customer Report" />
                            {openCustomerReport ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={openCustomerReport} timeout="auto" unmountOnExit>
                            {customerReportList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Collapse>

                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickShopBranchOrderReport}>
                            <ListItemIcon>
                                <StorefrontIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Shop Branch Order Report" />
                            {openShopBranchOrderReport ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={openShopBranchOrderReport} timeout="auto" unmountOnExit>
                            {shopBranchOrderReportList.map((nav, index) => (
                                <ListItem key={nav.name} component={Link} href={nav.url} disablePadding>
                                    <ListItemButton sx={{ pl: 6 }}>
                                        <ListItemIcon>
                                            {nav.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={nav.name} sx={{ color: "black" }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Collapse>
                    </Collapse>
                </List>

            </Drawer>

        </Box >
    );
}
