import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ProductService from "../Product/ProductService.service";
import DeliveryCustomerService from "../OtherService/DeliveryCustomerService";
import { styled } from '@mui/material/styles';
import { Form } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal';
import LinearProgress from '@mui/material/LinearProgress';
import useActiveShopColor from "../Shop/useActiveShopColor";
import "./CustomerOrderTransactionList.css";

const PendingProduct = () => {
    const activeShopColor = useActiveShopColor();


    useEffect(() => {
        fetchShopOrderTransactionList();
    }, []);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const [customerOrderDate, setCustomerOrderDate] = useState({
        status: null,
        dateTo: null,
        dateFrom: null,
    });


    const [date, setDate] = useState('');

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        payment: [],
        code: '',
        message: '',
        total_price: 0,
        total_profit: 0
    });




    const fetchShopOrderTransactionList = () => {
        setSubmitLoading(true);
        ProductService.fetchPendingProduct()
            .then(response => {
                // setShopOrderTransactionList(response.data);
                setShopOrderTransaction(response.data);
                setSubmitLoading(false);
            })
            .catch(e => {
                console.log("error", e)

            });
    }

    const [submitLoading, setSubmitLoading] = useState(false);



    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
        textAlign: "center",
    }));

    const onChangeInput = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        if (name === "status") {
            if (value === "null" || value === "") {
                newValue = null;
            } else {
                newValue = Number(value);
            }
        }

        setCustomerOrderDate({
            ...customerOrderDate,
            [name]: newValue,
        });
    };

    const saveOrderTransaction = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        console.log('orderTransaction', customerOrderDate.date);
        ProductService.fetchPendingProduct(customerOrderDate)
            .then(response => {
                setShopOrderTransaction(response.data);
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
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
        <div className="customer-report-page" style={{ "--shop-color": activeShopColor }}>
            <section className="customer-report-hero">
                <div>
                    <p className="customer-report-eyebrow">Inventory report</p>
                    <h1>Pending Products</h1>
                    <p className="customer-report-date">Floated product summary</p>
                </div>

                <Form className="customer-report-filter customer-report-filter-wide">
                    <Form.Group controlId="pendingProductDateFrom">
                        <Form.Label>Date From:</Form.Label>
                        <Form.Control type="date" name="dateFrom" onChange={onChangeInput} />
                    </Form.Group>

                    <Form.Group controlId="pendingProductDateTo">
                        <Form.Label>Date To:</Form.Label>
                        <Form.Control type="date" name="dateTo" onChange={onChangeInput} />
                    </Form.Group>

                    <Form.Select
                        className="customer-report-form-select"
                        name="status"
                        onChange={onChangeInput}
                    >
                        <option value="null">All</option>
                        <option value="2">Pending Payment</option>
                        <option value="1">Completed Payment</option>
                    </Form.Select>

                    <Button variant="primary"
                        onClick={saveOrderTransaction}
                        disabled={isAddDisabled}>
                        Find
                    </Button>
                </Form >
            </section>

            <section className="customer-report-kpis customer-report-kpis-compact">
                <article className="customer-report-kpi">
                    <span>Total Count</span>
                    <strong>{shopOrderTransaction.data.length}</strong>
                </article>
                <article className="customer-report-kpi">
                    <span>Report Type</span>
                    <strong>Pending</strong>
                    <small>Floated products requiring review</small>
                </article>
            </section>

                    {submitLoadingAdd &&
                <div className="customer-report-progress">
                        <LinearProgress color="warning" />
                </div>
                    }

            <section className="customer-report-table-card">
                <div className="customer-report-table-header">
                    <div>
                        <p className="customer-report-eyebrow">Details</p>
                        <h2>Pending/Floated Product</h2>
                    </div>
                    <span>{shopOrderTransaction.data.length} records</span>
                </div>
            {
                submitLoading ?
                    (<LinearProgress />)
                    :
                    (<>
                            <div className="customer-report-table-wrap">
                        <table className="customer-report-table customer-report-table-simple">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Product Name</th>
                                    <th>Floated Quantity</th>
                                    <th>View</th>
                                    <th>Current Stock</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    shopOrderTransaction.data.map((data, index) => (
                                        <tr key={data.id} >
                                            <td className="customer-report-id">#{data.id}</td>
                                            <td><strong>{data.product_name}</strong></td>

                                            <td style={{ fontWeight: 'bold', }}>{data.total_quantity < data.quantity ? data.total_quantity + " Pc" : Math.floor(data.total_quantity / data.quantity) + " " + data.packaging + " / " + data.total_quantity + " Pc"}</td>

                                            <td>
                                                <Link variant="primary" to={"../shopOrderTransaction/viewPendingProduct/" + data.id + "/" + customerOrderDate.status + "/" + customerOrderDate.dateFrom + "/" + customerOrderDate.dateTo}   >
                                                    <Button size="sm" variant="outline-primary" >
                                                        View
                                                    </Button>
                                                </Link>
                                            </td>
                                            <td >{data.stock + " " + data.packaging}</td>
                                        </tr>
                                    )
                                    )
                                }
                            </tbody>
                        </table>
                            </div>
                    </>)
            }
            </section>


        </div >
    )
}

export default PendingProduct
