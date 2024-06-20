import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import ProductSupplierService from "./ProductSupplierService";
import ProductService from "../Product/ProductService.service";
import SupplierService from "../Supplier/SupplierService.service";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import LinearProgress from '@mui/material/LinearProgress';

const AddProductSupplier = (props) => {

    useEffect(() => {
        fetchProduct();
        fetchSupplier();
    }, []);

    const [productSupplier, setProductSupplier] = useState({
        id: 0,
        supplier_id: 0,
        product_id: 0,
        product_name: '',
        supplier_name: '',
        status: 1,
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);


    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });



    const handleInputProductChange = (e, value) => {
        e.persist();
        console.log(value)
        setProductSupplier({
            ...productSupplier,
            product_id: value.id,
            product_name: value.product_name

        });
    }

    const handleInputSupplierChange = (e, value) => {
        e.persist();
        console.log(value)
        setProductSupplier({
            ...productSupplier,
            supplier_id: value.id,
            supplier_name: value.supplier_name
        });
    }

    const fetchProduct = () => {
        ProductService.getAll()
            .then(response => {
                console.log(response.data);
                setProducts(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchSupplier = () => {
        SupplierService.getAll()
            .then(response => {
                console.log(response.data);
                setSuppliers(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const validate = (values) => {
        const errors = {};
        if (productSupplier.supplier_id == 0) {
            errors.supplier_id = "Supplier is Required!";
        }
        if (productSupplier.product_id == 0) {
            errors.product_id = "Product is Required!";
        }
        return errors;
    }

    const messagePrompt = ($severity, $message, $isShow) => {
        setValidator({
            severity: $severity,
            message: $message,
            isShow: $isShow,
        });
    }

    const saveProductSupplier = (event) => {
        event.preventDefault();
        console.log(productSupplier);
        console.log("validate: ", validate(productSupplier));
        setFormErrors(validate(productSupplier));
        if (Object.keys(validate(productSupplier)).length > 0) {
            console.log("Has Validation: ");
        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            ProductSupplierService.sanctum().then(response => {
                ProductSupplierService.create(productSupplier)
                    .then(response => {
                        if (response.data.code == 200) {
                            console.log("response: ", response.data);
                            props.onSaveProductSupplierData(productSupplier);
                            setMessage(true);
                            setProductSupplier({
                                shop_name: ''
                            });
                            messagePrompt('success', response.data.message, true);
                        } else {
                            messagePrompt('warning', response.data.message, true);
                        }
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                    })
                    .catch(e => {
                        messagePrompt('error', response.data.message, true);
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        console.log(e);
                    });
            });
        }
    }

    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>
            <Box
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            // onSubmit={saveOrderSupplier}
            >

                <form onSubmit={saveProductSupplier} >
                    {formErrors.supplier_id && <p style={{ color: "red" }}>{formErrors.supplier_id}</p>}
                    <FormControl variant="standard" >
                        <Autocomplete
                            // {...defaultProps}
                            options={suppliers}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputSupplierChange}
                            getOptionLabel={(suppliers) => suppliers.supplier_name}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Supplier" variant="standard" />
                            )}
                        />
                    </FormControl>

                    <br></br>
                    {formErrors.product_id && <p style={{ color: "red" }}>{formErrors.product_id}</p>}
                    <FormControl variant="standard" >
                        <Autocomplete
                            // {...defaultProps}
                            options={products}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputProductChange}
                            getOptionLabel={(products) => products.product_name}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Product" variant="standard" />
                            )}
                        />
                    </FormControl>

                    <br></br>

                    <div>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={isAddDisabled}
                        >
                            Submit
                        </Button>
                    </div>
                    <br></br>
                    {submitLoadingAdd &&
                        <LinearProgress color="warning" />
                    }
                    <br></br>
                </form>
                <br></br>
            </Box>
        </div>
    )
}

export default AddProductSupplier
