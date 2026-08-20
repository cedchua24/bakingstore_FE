import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import SupplierServiceService from "../Supplier/SupplierService.service";
import ProductServiceService from "./ProductService.service";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import { formatPaymentLabel } from "../ShopOrderTransaction/shopOrderPaymentHelpers";
import LinearProgress from '@mui/material/LinearProgress';
import moment from "moment";
import "./ProductOrderTransactionList.css";

const ProductOrderTransactionList = () => {


    const { id } = useParams();

    useEffect(() => {
        submitSortedCustomerList();
        fetchProduct(id);

    }, []);

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        payment: [],
        code: '',
        message: '',
        total_sales: 0
    });

    const [product, setProduct] = useState({
        id: 0,
        product_name: '',
        price: ''
    });


    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const [sortedCustomer, setSortedCustomer] = useState({
        data: [],
        dateFrom: moment().subtract(29, 'days').format("YYYY-MM-DD"),
        dateTo: moment().format("YYYY-MM-DD"),
        code: '',
        message: '',
        id: 0,
        status: '',
        is_pickup: ''
    });


    const onChangeInput = (e) => {
        console.log("status", e.target.value);
        console.log("status", e.target.name);
        setSortedCustomer({ ...sortedCustomer, [e.target.name]: e.target.value });

    }


    const fetchProduct = (id) => {
        ProductServiceService.get(id)
            .then(response => {
                setProduct(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }




    const submitSortedCustomerList = () => {

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        ShopOrderTransactionService.fetctProductOrderTransactionV2(id, sortedCustomer)
            .then(response => {
                console.log("response.data", response.data)
                setShopOrderTransaction(response.data);
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
            })
            .catch(e => {
                console.log("error", e)
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);

            });

    }
    const totalSum = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        // return numbers.reduce((acc, { total_order_quantity }) => acc + total_order_quantity, 0);
        var result;
        result = numbers.reduce((acc, { total_order_quantity }) => acc + total_order_quantity, 0);

        return result < product.quantity ? result + " Pc" : Math.floor(result / product.quantity) + " " + product.packaging + " / " + result + " Pc"

    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    return (
        <div className="product-order-page">
            <Form className="product-order-filters">
                <div className="product-order-filters__heading">
                    <span>Order filters</span>
                    <h1>Product order transactions</h1>
                    <p>Filter transactions by date, payment, and pickup status.</p>
                </div>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date From:</Form.Label>
                    <Form.Control type="date" name="dateFrom" value={sortedCustomer.dateFrom} onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date To:</Form.Label>
                    <Form.Control type="date" name="dateTo" value={sortedCustomer.dateTo} onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="w-25 mb-3 product-order-filter-field" controlId="paymentStatus">
                    <Form.Label>Payment Status:</Form.Label>
                    <Form.Select name="status" value={sortedCustomer.status} onChange={onChangeInput}>
                        <option value="">All Payment Status</option>
                        <option value="1">COMPLETED</option>
                        <option value="2">PENDING</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="w-25 mb-3 product-order-filter-field product-order-filter-field--pickup" controlId="pickupStatus">
                    <Form.Label>Pickup Status:</Form.Label>
                    <Form.Select name="is_pickup" value={sortedCustomer.is_pickup} onChange={onChangeInput}>
                        <option value="">All Pickup Status</option>
                        <option value="0">PENDING</option>
                        <option value="1">COMPLETED</option>
                    </Form.Select>
                </Form.Group>
                <Button variant="primary"
                    onClick={submitSortedCustomerList}
                    disabled={isAddDisabled}
                >
                    Find
                </Button>
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <div className="product-order-progress"><LinearProgress color="warning" /></div>
                }
                <br></br>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Total Count:</Form.Label>
                    <Form.Control type="text" value={totalSum(shopOrderTransaction.data)} disabled />
                </Form.Group>
            </Form>
            <Form className="product-order-summary">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control type="text" value={product.product_name} name="product_name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>SRP</Form.Label>
                    <Form.Control type="text" value={product.price} name="srp" />
                </Form.Group>

            </Form>
            <div className="product-order-results">
                <legend align="center" style={{ fontWeight: 'bold' }} > Online Orders  </legend>
                <legend align="center" style={{ fontWeight: 'bold', color: 'orange' }} > Note! Quantity is compute by per piece! </legend>


                <table className="table table-bordered product-order-table" >
                    <thead className="table-dark">
                        <tr className="table-secondary">
                            <th>ID</th>
                            <th>Customer Type</th>
                            <th>Customer</th>
                            <th>Account</th>
                            <th>Total Amount</th>
                            <th>Profit</th>
                            <th>Date</th>
                            <th>Payment Status</th>
                            <th>PickUp Status</th>
                            <th style={{ color: "red" }}>{product.product_name} Quantity</th>
                            <th></th>
                        </tr>
                    </thead>
                    {shopOrderTransaction.data.length == 0 ?
                        (<tr style={{ color: "red", }}>{"No Data Available"}</tr>)
                        :
                        (
                            <tbody>

                                {
                                    shopOrderTransaction.data.map((shopOrderTransaction, index) => (
                                        <tr key={shopOrderTransaction.id} style={{ border: "2px solid black" }}>
                                            <td >{shopOrderTransaction.id}</td>
                                            <td>{shopOrderTransaction.customer_type}</td>
                                            <td>{shopOrderTransaction.requestor_name}</td>
                                            <td>{shopOrderTransaction.status == 1 ? (

                                                shopOrderTransaction.mode_of_payment.map((sot, index) => (
                                                    <>
                                                        <tr>
                                                            <td><p style={{ fontSize: 12 }}>{numberFormat(sot.amount)}</p></td>
                                                            <td><p style={{ fontSize: 12 }}>{formatPaymentLabel(sot)}</p></td>
                                                        </tr>
                                                    </>
                                                )
                                                )
                                            ) : (<></>)
                                            }</td>

                                            <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.shop_order_transaction_total_price != 0 ? numberFormat(shopOrderTransaction.shop_order_transaction_total_price) : ""}</td>
                                            <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.profit != 0 ? numberFormat(shopOrderTransaction.profit) : ""}</td>

                                            <td>{shopOrderTransaction.date}</td>
                                            <td>{shopOrderTransaction.status === 1 ? <p style={{ fontWeight: 'bold', color: 'green', }}>COMPLETED</p>
                                                : shopOrderTransaction.status === 2 ? <p style={{ fontWeight: 'bold', color: 'orange', }}>PENDING</p> :
                                                    <p style={{ fontWeight: 'bold', color: 'red', }}>CANCELLED</p>}</td>
                                            <td>{shopOrderTransaction.is_pickup === 1 ? <p style={{ fontWeight: 'bold', color: 'green', }}>COMPLETED</p>
                                                : <p style={{ fontWeight: 'bold', color: 'orange', }}>PENDING</p>}
                                            </td>
                                            {/* <td style={{ color: "red" }}>{shopOrderTransaction.shop_order_quantity}</td> */}
                                            <td style={{ color: "red" }}>{shopOrderTransaction.business_type == 'WHOLESALE' ? shopOrderTransaction.shop_order_quantity * shopOrderTransaction.quantity : shopOrderTransaction.shop_order_quantity}</td>
                                            <td>
                                                <Link variant="primary" to={"../shopOrderTransaction/completedShopOrderTransaction/" + shopOrderTransaction.id}   >
                                                    <Button variant="primary" >
                                                        View Transaction
                                                    </Button>
                                                </Link>
                                            </td>



                                        </tr>
                                    )
                                    )
                                }
                            </tbody>)}
                </table>

            </div>

        </div>
    )
}

export default ProductOrderTransactionList
