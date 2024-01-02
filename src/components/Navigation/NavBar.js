import { Button, Form, Alert } from 'react-bootstrap';
import React from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


const NavBar = () => {

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
            <>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/userRegistration">Register</Nav.Link>
                        <Nav.Link href="/login">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </>
        );


    }
    else {
        AuthButtons = (
            <>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Category" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/addCategory">Add Category</NavDropdown.Item>
                            <NavDropdown.Item href="/categoryList">Category List</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="Brand" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/brand">Add Brand</NavDropdown.Item>
                            <NavDropdown.Item href="/brandListV2">Brand List</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="Supplier" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/supplier">Add Supplier</NavDropdown.Item>
                            <NavDropdown.Item href="/supplierListV2">Supplier List</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="Customer" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/customers">Add Customer</NavDropdown.Item>
                            <NavDropdown.Item href="/customerListV2">Customer List</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="Product" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/addProduct">Add Product</NavDropdown.Item>
                            <NavDropdown.Item href="/productList">Product List</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="Warehouse" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/warehouse">Add Warehouse</NavDropdown.Item>
                            <NavDropdown.Item href="/warehouseListV2">Warehouse List</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="Shop" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/shop">Add Shop</NavDropdown.Item>
                            <NavDropdown.Item href="/shopListV2">Shop List</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="MarkUpPrice" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/markUpPrice">Add MarkUpPrice</NavDropdown.Item>
                            <NavDropdown.Item href="/markUpPriceListV2">MarkUpPrice List</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="Stock" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/addStock">Add Stock</NavDropdown.Item>
                            <NavDropdown.Item href="/addStock">Stock List</NavDropdown.Item>
                            <NavDropdown.Item href="/stockWarning">Stock Warning</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="Purchase Order" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/orderSupplierTransaction">Add Purchase Order Stock</NavDropdown.Item>
                            <NavDropdown.Item href="/supplierTransactionList">Purchase Order List</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="Shop Order" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/shopOrderTransaction">Add Shop Order Stock</NavDropdown.Item>
                            <NavDropdown.Item href="/shopOrderTransaction/shorOrderTransactionList">Shop Order List</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="Customer Order" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/customerOrderTransaction">Add Customer Order</NavDropdown.Item>
                            <NavDropdown.Item href="/shopOrderTransaction/customerOrderTransactionList">Customer Order List</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="Expenses" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/expenses">Add Expenses</NavDropdown.Item>
                            <NavDropdown.Item href="/expensesType">Add Expenses Type</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="Reports" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/reports/reportsList">Online Order Reports</NavDropdown.Item>
                            <NavDropdown.Item href="/reports/shopBranchReportList">Shop Order Reports</NavDropdown.Item>
                            <NavDropdown.Item href="/reports/reportExpenses">Expenses Reports</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                <ul className='navbar-nav'>
                    {/* <li className="nav-item">
                    <Link to={"/orderCustomerTransaction"} className="nav-link">
                        Order Customer
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/orderCustomerList"} className="nav-link">
                        Order Customer List
                    </Link>
                </li> */}
                    <li className="nav-item">
                        <button className="nav-link btn btn-danger btn-sm text-white" type='button' onClick={logoutSubmit} >Logout</button>
                    </li>
                </ul >

            </>
        );
    }

    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="navbar-nav mr-auto">
                    <Navbar.Brand href="/"> &nbsp; MDR POS</Navbar.Brand>
                    {AuthButtons}

                </div>
            </nav>

            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                </Container>
            </Navbar>

        </div>
    )
}

export default NavBar
