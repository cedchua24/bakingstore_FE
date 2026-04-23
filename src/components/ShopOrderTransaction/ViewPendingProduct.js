import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import ProductServiceService from "../Product/ProductService.service";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import LinearProgress from '@mui/material/LinearProgress';

const ViewPendingProduct = () => {


    const { id, status, dateFrom, dateTo } = useParams();

    const safeDateFrom = dateFrom && dateFrom !== "null" ? dateFrom : "";
    const safeDateTo = dateTo && dateTo !== "null" ? dateTo : "";
    const safeStatus = status && status !== "null" ? status : "";


    useEffect(() => {
        fetchProduct(id);
        submitSortedCustomerList();

    }, []);

    const [customerOrderDate, setCustomerOrderDate] = useState({
        id: id,
        dateFrom: safeDateFrom,
        dateTo: safeDateTo,
        status: safeStatus
    });


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
        code: '',
        message: '',
        id: 0
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
        ShopOrderTransactionService.fetctPendingProductOrderTransaction(customerOrderDate.id, customerOrderDate)
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
        <div>
            <Form>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date From:</Form.Label>
                    <Form.Control type="date" value={customerOrderDate.dateFrom} name="dateFrom" onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date To:</Form.Label>
                    <Form.Control type="date" value={customerOrderDate.dateTo} name="dateTo" onChange={onChangeInput} />
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
                    <LinearProgress color="warning" />
                }
                <br></br>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Payment Status:</Form.Label>
                    <Form.Control type="text" value={status == 1 ? "COMPLETED PAYMENT" : status == 2 ? "PENDING PAYMENT" : "ALL"} disabled />
                </Form.Group>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Total Count:</Form.Label>
                    <Form.Control type="text" value={totalSum(shopOrderTransaction.data)} disabled />
                </Form.Group>
            </Form>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control type="text" value={product.product_name} name="product_name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>SRP</Form.Label>
                    <Form.Control type="text" value={product.price} name="srp" />
                </Form.Group>

            </Form>
            <div>
                <legend align="center" style={{ fontWeight: 'bold' }} > Online Orders  </legend>
                <legend align="center" style={{ fontWeight: 'bold', color: 'orange' }} > Note! Quantity is compute by per piece! </legend>


                <table class="table table-bordered" >
                    <thead class="table-dark">
                        <tr class="table-secondary">
                            <th>ID</th>
                            <th>Shop Name</th>
                            <th>Customer Type</th>
                            <th>Customer</th>
                            <th>Total Quantity</th>
                            <th>Total Cash</th>
                            <th>Total Online</th>
                            <th>Bank</th>
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
                                            <td>{shopOrderTransaction.shop_name}</td>
                                            <td>{shopOrderTransaction.customer_type}</td>
                                            <td>{shopOrderTransaction.requestor_name}</td>
                                            <td>{shopOrderTransaction.shop_order_transaction_total_quantity != 0 ? shopOrderTransaction.shop_order_transaction_total_quantity : ""}</td>
                                            <td>{shopOrderTransaction.total_cash != 0 ? numberFormat(shopOrderTransaction.total_cash) : ""}</td>
                                            <td>{shopOrderTransaction.total_online != 0 ? numberFormat(shopOrderTransaction.total_online) : ""}</td>
                                            <td>{shopOrderTransaction.status == 1 ? (

                                                shopOrderTransaction.mode_of_payment.map((sot, index) => (
                                                    <>
                                                        <tr>
                                                            <td><p style={{ fontSize: 12 }}>{numberFormat(sot.amount)}</p></td>
                                                            <td><p style={{ fontSize: 12 }}>{sot.payment_type}</p></td>
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
                                                    <p style={{ fontWeight: 'bold', color: 'red', }}>CANCELLED</p>}
                                            </td>
                                            <td>{shopOrderTransaction.is_pickup === 1 ? <p style={{ fontWeight: 'bold', color: 'green', }}>COMPLETED</p>
                                                : <p style={{ fontWeight: 'bold', color: 'orange', }}>PENDING</p>}
                                            </td>

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

export default ViewPendingProduct
