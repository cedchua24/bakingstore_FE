import { Button, Form, Alert } from 'react-bootstrap';
import React from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';


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
            <ul className='navbar-nav'>
                <li className="nav-item">
                    <Link to={"/userRegistration"} className="nav-link">
                        Register
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to={"/login"} className="nav-link">
                        Login
                    </Link>
                </li>
            </ul>
        );
    }
    else {
        AuthButtons = (
            <ul className='navbar-nav'>
                <li className="nav-item">
                    <Link to={"/addCategory"} className="nav-link">
                        Category
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/addBrand"} className="nav-link">
                        Brand
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/supplier"} className="nav-link">
                        Supplier
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/addProduct"} className="nav-link">
                        Product
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/productList"} className="nav-link">
                        Product List
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/warehouse"} className="nav-link">
                        Warehouse
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/shop"} className="nav-link">
                        Shop
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/markUpPrice"} className="nav-link">
                        MarkUpPrice
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/addStock"} className="nav-link">
                        Stock
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/orderSupplierTransaction"} className="nav-link">
                        Purchase Order
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/supplierTransactionList"} className="nav-link">
                        PO Transaction
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/shopOrderTransaction"} className="nav-link">
                        Shop Order
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/shopOrderTransaction/shorOrderTransactionList"} className="nav-link">
                        Shop Order Transaction
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/customerOrderTransaction"} className="nav-link">
                        Customer Order
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={"/shopOrderTransaction/customerOrderTransactionList"} className="nav-link">
                        Customer Order Transaction
                    </Link>
                </li>
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
            </ul>
        );
    }

    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to={"/"} className="nav-link">
                            Home
                        </Link>
                    </li>
                    {AuthButtons}

                </div>
            </nav>

        </div>
    )
}

export default NavBar
