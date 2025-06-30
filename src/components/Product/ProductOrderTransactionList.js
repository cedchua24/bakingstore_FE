import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import SupplierServiceService from "../Supplier/SupplierService.service";
import ProductServiceService from "./ProductService.service";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";

const ProductOrderTransactionList = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchProduct(id);
        fetchSupplierProduct(id);
        fetchShopOrderTransactionList(id);

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
    const [productSupplier, setProductSupplier] = useState([]);
    const [message, setMessage] = useState(false);



    const fetchProduct = (id) => {
        ProductServiceService.get(id)
            .then(response => {
                setProduct(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchSupplierProduct = (id) => {
        SupplierServiceService.fetchSupplierProduct(id)
            .then(response => {
                setProductSupplier(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchShopOrderTransactionList = (id) => {
        ShopOrderTransactionService.fetctProductOrderTransaction(id)
            .then(response => {
                console.log("fetchOnlineShopOrderTransactionList :", response.data)
                setShopOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    return (
        <div>
            {message &&
                <Alert variant="success" dismissible>
                    <Alert.Heading>Successfully Updated!</Alert.Heading>
                    <p>
                        Change this and that and try again. Duis mollis, est non commodo
                        luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                        Cras mattis consectetur purus sit amet fermentum.
                    </p>
                </Alert>
            }
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
                                                    <p style={{ fontWeight: 'bold', color: 'red', }}>CANCELLED</p>}</td>
                                            <td style={{ color: "red" }}>{shopOrderTransaction.shop_order_quantity}</td>
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
