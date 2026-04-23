import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import ExpensesTypeV2Service from "./ExpensesTypeV2Service";
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const ViewExpenseTypeCategoryList = () => {

    const { id, id2 } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchExpenseType(id);
    }, []);

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [expenseTypeList, setExpenseTypeList] = useState({
        data: [],
        code: "",
        name: "",
        message: ""
    });

    const [expenseType, setExpenseType] = useState({
        id: 0,
        expense_type: '',
        status: 0,
        updated_at: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const onChangeExpenseType = (e) => {
        setExpenseType({ ...expenseType, [e.target.name]: e.target.value });
    }

    const fetchExpenseType = () => {
        ExpensesTypeV2Service.fetchExpenseTypeCategoryById(id, id2)
            .then(response => {
                setExpenseTypeList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const validate = (values) => {
        const errors = {};
        if (expenseType.expense_type == 0) {
            errors.expense_type = "Expense Type is Required!";
        }
        return errors;
    }


    const saveExpenseType = () => {

        console.log('expenseType', expenseType);

        console.log("count: ", Object.keys(validate(expenseType)).length);
        console.log("validate: ", validate(expenseType));
        setFormErrors(validate(expenseType));
        if (Object.keys(validate(expenseType)).length > 0) {
            console.log("Has Validation: ");

        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            console.log(expenseType);
            ExpensesTypeV2Service.sanctum().then(response => {
                ExpensesTypeV2Service.create(expenseType)
                    .then(response => {
                        fetchExpenseType();
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        setValidator({
                            severity: 'success',
                            message: response.data.message,
                            isShow: true,
                        });
                    })
                    .catch(e => {
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        console.log(e);
                        setValidator({
                            severity: 'error',
                            message: "expenseType Already Exists",
                            isShow: true,
                        });
                    });
            });
        }
    }

    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }


    return (
        <div>
            {/* <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>
            <Form>
                {formErrors.expense_type && <p style={{ color: "red" }}>{formErrors.expense_type}</p>}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Expense Type *</Form.Label>
                    <Form.Control type="text" value={expenseType.expense_type} name="expense_type" placeholder="Enter Expense Type" onChange={onChangeExpenseType} />

                </Form.Group>
                <Button variant="primary"
                    disabled={isAddDisabled}
                    onClick={saveExpenseType}>
                    Submit
                </Button>
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }
            </Form> */}
            <br></br>

            <legend align="center" style={{ fontWeight: 'bold' }} > {expenseTypeList.name}</legend>
            <p align="center" >{expenseTypeList.expense_category_name}</p>
            {/* <p align="center" >{expenseTypeList.name}</p> */}
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        {/* <th>Type</th>
                        <th>Category</th> */}
                        <th>Expense Name</th>
                        <th>Hidden</th>
                        {/* <th></th> */}
                    </tr>
                </thead>
                <tbody>

                    {
                        expenseTypeList.data.map((expenseType, index) => (
                            <tr key={expenseType.id} >
                                <td>{expenseType.id}</td>
                                {/* <td>{expenseType.expense_type}</td>
                                <td>{expenseType.expense_category_name}</td> */}
                                <td>{expenseType.expense_name}</td>
                                <td>{expenseType.is_hidden === 1 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                {/* <td>

                                    <Link variant="primary" to={"/customers/" + expenseType.id}   >
                                        <Button variant="primary" >
                                            View
                                        </Button>
                                    </Link>
                                </td> */}
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>

        </div>
    )
}

export default ViewExpenseTypeCategoryList
