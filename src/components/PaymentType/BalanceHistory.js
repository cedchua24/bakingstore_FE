import { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import BalanceTransactionService from "../OtherService/BalanceTransactionService";
import BalanceTypeService from "../OtherService/BalanceTypeService";
import { Form } from 'react-bootstrap';
import LinearProgress from '@mui/material/LinearProgress';
import moment from "moment";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';

const BalanceHistory = () => {

    const { id } = useParams();
    const [balanceTypeList, setBalanceTypeList] = useState([]);
    const [balanceHistoryList, setBalanceHistoryList] = useState({
        data: []
    });

    useEffect(() => {
        fetchBalanceHistory();
        fetchBalanceType();
    }, []);

    const [dateRequest, setDateRequest] = useState({
        data: [],
        id: id,
        code: '',
        balance_type_id: 0,
        dateTo: moment().format("YYYY-MM-DD"),
        dateFrom: moment().format("YYYY-MM-DD"),
        message: ''
    });

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const onChangeInput = (e) => {
        setDateRequest({ ...dateRequest, [e.target.name]: e.target.value });

    }

    const fetchBalanceHistory = () => {

        BalanceTransactionService.fetchBalanceTransactionById(dateRequest)
            .then(response => {
                console.log('fetchBalanceTransactionById', response.data)
                setBalanceHistoryList(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });
    }

    const fetchBalanceType = () => {
        BalanceTypeService.getAll()
            .then(response => {
                setBalanceTypeList(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });
    }

    const fetchBalanceHistorySubmit = () => {

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);


        BalanceTransactionService.fetchBalanceTransactionById(dateRequest)
            .then(response => {
                console.log('fetchBalanceTransactionById', response.data)
                setBalanceHistoryList(response.data);
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
            })
            .catch(e => {
                console.log("error", e)
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);

            });


    }



    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const totalSum = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return numberFormat(numbers.reduce((acc, { amount }) => acc + amount, 0));
    }
    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const getPaymentDisplay = (data) => {
        if (!data) return "";

        if (data.payment_type_po_id == 0) {
            return "";
        }

        if (data.payment_type_po_id == 1) {
            return data.bank_name;
        }

        return `${data.payment_term} - ${data.bank_name} ${data.account_name} ${data.account_description} ${data.account_number}`;
    };


    return (
        <div>
            <div style={{ float: 'right', marginRight: 300 }}>
                <Form.Group controlId="formBasicEmail" disabled>
                    <Form.Label>Total Amount: </Form.Label>
                    <Form.Control type="text" value={totalSum(balanceHistoryList.data)} />
                </Form.Group>
                <br></br>

            </div>

            <Form>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date From:</Form.Label>
                    <Form.Control type="date" name="dateFrom" value={moment().format("YYYY-MM-DD")} onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date To:</Form.Label>
                    <Form.Control type="date" name="dateTo" value={moment().format("YYYY-MM-DD")} onChange={onChangeInput} />
                </Form.Group>

                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Type"
                            name="balance_type_id"
                            onChange={onChangeInput}
                        >
                            {
                                balanceTypeList.map((data, index) => (
                                    <MenuItem value={data.id}>{data.balance_type_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Total Count:</Form.Label>
                    <Form.Control type="text" value={balanceHistoryList.data.length} disabled />
                </Form.Group>
                <br></br>
                <Button variant="primary"
                    onClick={fetchBalanceHistorySubmit}
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
                <br></br>


                <br></br>
            </Form>

            <legend align="center" style={{ fontWeight: 'bold' }} > Balance Transaction   </legend>
            <p align="center" >{getPaymentDisplay(balanceHistoryList.data[0])}</p>


            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Shop</th>
                        <th>Type</th>
                        <th>Transaction</th>
                        <th>Join ID</th>
                        <th>Running Balance</th>
                        <th>Expense Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                {balanceHistoryList.data.length == 0 ?
                    (<tr style={{ color: "red", }}>{"No Data Available"}</tr>)
                    :
                    (
                        <tbody>
                            {
                                balanceHistoryList.data.map((data, index) => (
                                    <tr key={data.id} >
                                        <td>{data.id}</td>
                                        <td>{data.shop_name}</td>
                                        <td>{data.balance_type_name}</td>
                                        <td>{data.transaction}</td>
                                        <td>{data.join_id}</td>
                                        <td>{numberFormat(data.total_balance)}</td>
                                        <td>{numberFormat(data.amount)}</td>
                                        <td>{formatStatementDate(data.created_at)}</td>
                                    </tr>
                                )
                                )
                            }
                        </tbody>)}
            </table>


        </div >
    )
}

export default BalanceHistory
