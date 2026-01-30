import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';

import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import ProductSoldDailyService from "../OtherService/ProductSoldDailyService";
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import LinearProgress from '@mui/material/LinearProgress';
import moment from "moment";

const ProductSoldToday = () => {


    useEffect(() => {
        fetchsortedQuantityList();
    }, []);

    const [status, setStatus] = useState(0);

    const [date, setDate] = useState({
        today: moment().format("YYYY-MM-DD")
    });

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });


    const [sortedQuantity, setSortedQuantity] = useState({
        data: [],
        code: '',
        message: '',
        id: 0
    });

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const onChangeInput = (e) => {
        console.log("status", e.target.value);
        setStatus(e.target.value);
    }


    const validate = (values) => {
        const errors = {};
        if (status == 0) {
            errors.status = "Status Type is Required!";
        }

        return errors;
    }



    const submitSortedQuantityList = () => {
        console.log('status: ', status);
        console.log("count: ", Object.keys(validate(status)).length);
        console.log("validate: ", validate(status));
        setFormErrors(validate(status));
        if (Object.keys(validate(status)).length > 0) {
            console.log("Has Validation: ");

        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            ShopOrderTransactionService.fetchProductSoldToday(date)
                .then(response => {
                    setValidator({
                        severity: 'success',
                        message: 'Product Sold Submitted!',
                        isShow: true,
                    });
                    console.log("response.data", response.data)
                    // setsortedQuantityList(response.data);
                    setSortedQuantity(response.data);
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                    console.log("sortedQuantity", sortedQuantity)
                })
                .catch(e => {
                    console.log("error", e)
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);

                });
        }
    }

    const fetchsortedQuantityList = () => {
        ShopOrderTransactionService.fetchProductSoldToday(date)
            .then(response => {
                console.log("response.data", response.data)
                // setsortedQuantityList(response.data);
                setSortedQuantity(response.data);

            })
            .catch(e => {
                console.log("error", e)

            });

    }

    const submitEndofDay = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        ProductSoldDailyService.sanctum().then(response => {
            ProductSoldDailyService.create(date)
                .then(response => {
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                    setValidator({
                        severity: 'success',
                        message: 'Product Sold Submitted!',
                        isShow: true,
                    });
                })
                .catch(e => {
                    console.log(e);
                });
        });
    }

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
        textAlign: "center",
    }));
    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');



    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>

            <legend align="center" style={{ fontWeight: 'bold' }} > Product Sold Today   </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Discrepancy (PC) </th>
                        {/* <th>Stock (PC)</th> */}
                        <th>Sold Stock (WS/BOX)</th>
                        <th >Sold (PC)</th>
                        {/* <th style={{ fontWeight: 'bold', color: 'red' }}>Current Stock</th> */}
                    </tr>
                </thead>
                {sortedQuantity.data.length == 0 ?
                    (<tr style={{ color: "red" }}>{"No Data Available"}</tr>)
                    :
                    (
                        <tbody>
                            {/* <Form> */}
                            {
                                sortedQuantity.data.map((data, index) => (
                                    <tr key={data.mark_up_product_id} >
                                        <td>{data.id}</td>
                                        <td>{data.product_name}</td>
                                        <td>{data.discrepancy > 0 ? <p style={{ color: "red" }}>{data.discrepancy}</p> : <><p>{data.discrepancy}</p> </>}</td>
                                        {/* <td>{(data.total_quantity % data.quantity)}</td> */}
                                        <td>{Math.floor(data.total_quantity / data.quantity)}</td>
                                        <td>{data.total_quantity}</td>
                                        {/* <td>{data.stock_all}</td> */}

                                    </tr>
                                )
                                )
                            }
                            <br></br>

                            {/* </Form> */}
                        </tbody>)}
            </table>

            <div style={{ display: 'flex', justifyContent: 'center' }}>

                <br></br>
                <br></br>

                <Button
                    align="center"
                    variant="contained"
                    type="submit"
                    disabled={isAddDisabled}
                    onClick={submitEndofDay}
                >
                    End of Day
                </Button>
                <br></br>
                <br></br>

            </div >
            <br></br>
            {submitLoadingAdd &&
                <LinearProgress color="warning" />
            }
            <br></br>


        </div >
    )
}

export default ProductSoldToday
