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

const PendingProduct = () => {


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
        <div>

            <div>
                <Form>
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date From:</Form.Label>
                        <Form.Control type="date" name="dateFrom" onChange={onChangeInput} />
                    </Form.Group>

                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date To:</Form.Label>
                        <Form.Control type="date" name="dateTo" onChange={onChangeInput} />
                    </Form.Group>

                    <Form.Select
                        className="mb-3"
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
                    <br></br>
                    <br></br>
                    {submitLoadingAdd &&
                        <LinearProgress color="warning" />
                    }
                    <br></br>
                    <br></br>

                </Form >
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Total Count:</Form.Label>
                    <Form.Control type="text" value={shopOrderTransaction.data.length} disabled />
                </Form.Group>
            </div>

            <legend align="center" style={{ fontWeight: 'bold' }} > Pending/Floated Product </legend>
            {
                submitLoading ?
                    (<LinearProgress />)
                    :
                    (<>
                        <table class="table table-bordered">
                            <thead class="table-dark">
                                <tr class="table-secondary">
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
                                            <td>{data.id}</td>
                                            <td>{data.product_name}</td>

                                            <td style={{ fontWeight: 'bold', }}>{data.total_quantity < data.quantity ? data.total_quantity + " Pc" : Math.floor(data.total_quantity / data.quantity) + " " + data.packaging + " / " + data.total_quantity + " Pc"}</td>

                                            <td>
                                                <Link variant="primary" to={"../shopOrderTransaction/viewPendingProduct/" + data.id + "/" + customerOrderDate.status + "/" + customerOrderDate.dateFrom + "/" + customerOrderDate.dateTo}   >
                                                    <Button variant="primary" >
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
                    </>)
            }


        </div >
    )
}

export default PendingProduct
