import { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ProductSoldDailyService from "../OtherService/ProductSoldDailyService";
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';
import LinearProgress from '@mui/material/LinearProgress';
import moment from "moment";

const ProductSoldTodayCheckList = () => {
    const { id } = useParams();

    useEffect(() => {
        fetchSortedQuantityList(id);
    }, []);


    const [date, setDate] = useState({
        today: moment().format("YYYY-MM-DD")
    });
    const [sortedQuantity, setSortedQuantity] = useState({ data: [] });
    const [updatedProducts, setUpdatedProducts] = useState([]);
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });


    const fetchSortedQuantityList = (id) => {
        ProductSoldDailyService.fetchProductSoldListByDate(id)
            .then(response => {
                setSortedQuantity(response.data);
            })
            .catch(e => {
                console.log("error", e);
            });
    };

    const onChangeInput = (e) => {
        console.log("status", e.target.value);
        setDate({
            ...date,
            today: e.target.value,
        });
    }


    const fetchByDate = () => {

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        ProductSoldDailyService.fetchProductSoldListByDate(date.today)
            .then(response => {
                setSortedQuantity(response.data);
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
            })
            .catch(e => {
                console.log("error", e)
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
            });
    }

    const handleStockChange = (index, value) => {
        const newData = [...sortedQuantity.data];
        newData[index].stock_input = value;
        setSortedQuantity({ ...sortedQuantity, data: newData });

        const updated = newData.map(item => ({
            id: item.id,
            stock_input: item.stock_input
        }));
        setUpdatedProducts(updated);
    };

    const submitEndofDay = () => {
        if (updatedProducts.length === 0) {
            setValidator({
                severity: 'warning',
                message: 'No changes to submit!',
                isShow: true,
            });
            return;
        }

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);

        ProductSoldDailyService.updateMultiple(updatedProducts)
            .then(response => {
                setValidator({
                    severity: 'success',
                    message: 'All products updated successfully!',
                    isShow: true,
                });
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
                fetchSortedQuantityList(moment().format("YYYY-MM-DD"));
            })
            .catch(e => {
                console.error("Update error:", e);
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
            });
    };

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
    }));

    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>
            <Form>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date Below:</Form.Label>
                    <Form.Control type="date" name="dateFrom" onChange={onChangeInput} />
                </Form.Group>


                <Button variant="primary"
                    disabled={isAddDisabled}
                    onClick={fetchByDate}>
                    Search
                </Button>
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }
                <br></br>
            </Form >
            <br></br>
            <legend align="center" style={{ fontWeight: 'bold' }}>Product Sold Checklist</legend>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr className="table-secondary">
                        <th>ID</th>
                        <th>Code</th>
                        <th>Product Name</th>
                        {/* <th>Stock (PC)</th> */}
                        <th>Sold (WS/BOX)</th>
                        <th style={{ fontWeight: 'bold', color: 'red' }}>Sold (PC)</th>
                        <th style={{ fontWeight: 'bold', color: 'red' }}>Current Stock(PC)</th>
                        <th>Excel Stock (PC)</th>
                        <th>Tally Count </th>
                    </tr>
                </thead>
                {sortedQuantity.data.length === 0 ? (
                    <tr style={{ color: "red" }}>No Data Available</tr>
                ) : (
                    <tbody>
                        {sortedQuantity.data.map((data, index) => (
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.product_code}</td>
                                <td>{data.product_name}</td>
                                {/* <td>{data.stock}</td> */}
                                <td>{Math.floor(data.total_stock / data.quantity)}</td>
                                <td>{data.total_stock}</td>
                                <td>{data.current_stock}</td>
                                <td>

                                    <Input
                                        type='number'
                                        name="stock_input"
                                        value={data.stock_input}
                                        onChange={(e) => handleStockChange(index, e.target.value)}
                                    />

                                </td>
                                <td>{data.stock_input == 0 ? "" : data.total_stock + data.current_stock - data.stock_input == 0 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="primary"
                    align="center"
                    disabled={isAddDisabled}
                    onClick={submitEndofDay}
                >
                    Submit
                </Button>

            </div>
            <br></br>
            {submitLoadingAdd && <LinearProgress color="warning" />}
        </div>
    );
};

export default ProductSoldTodayCheckList;