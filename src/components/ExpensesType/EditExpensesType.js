import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import ExpensesTypeService from "./ExpensesTypeService";
import ExpensesCategoryService from "./ExpensesCategoryService";

import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const EditExpensesType = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchExpensesType(id);
        fetchCategoryList();
    }, []);

    const [expensesType, setExpensesType] = useState({
        id: 0,
        expensesType_name: '',
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);
    const [expensesCategory, setExpensesCategory] = useState([]);

    const onChangeExpensesType = (e) => {
        setExpensesType({ ...expensesType, [e.target.name]: e.target.value });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        setExpensesType({
            ...expensesType,
            expenses_category_id: value.id,
        });
    }


    const saveExpensesType = () => {
        ExpensesTypeService.update(expensesType.id, expensesType)
            .then(response => {
                setExpensesType(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchCategoryList = (id) => {
        ExpensesCategoryService.getAll()
            .then(response => {
                setExpensesCategory(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchExpensesType = (id) => {
        ExpensesTypeService.get(id)
            .then(response => {
                setExpensesType(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

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
                    <Form.Label>Expenses Name *</Form.Label>
                    <Form.Control type="text" value={expensesType.expenses_name} name="expenses_name" placeholder="Enter Expenses Name" onChange={onChangeExpensesType} />

                </Form.Group>
                <FormControl variant="standard" >
                    <Autocomplete
                        // {...defaultProps}
                        options={expensesCategory}
                        className="mb-3"
                        id="disable-close-on-select"
                        onChange={handleInputChange}
                        getOptionLabel={(expensesCategory) => expensesCategory.expenses_category_name}
                        renderInput={(params) => (
                            <TextField {...params} label="Choose Category" variant="standard" />
                        )}
                    />
                </FormControl>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Details</Form.Label>
                    <Form.Control type="text" value={expensesType.details} name="details" placeholder="Enter Details" onChange={onChangeExpensesType} />

                </Form.Group>

                <Button variant="primary" onClick={saveExpensesType}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditExpensesType
