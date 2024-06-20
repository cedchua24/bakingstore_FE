import React, { useState, useEffect } from "react";
import ProductSupplierService from "./ProductSupplierService";
import ProductSupplierList from "./ProductSupplierList";
import SupplierService from "../Supplier/SupplierService.service";

import { Form } from 'react-bootstrap';


import FormControl from '@mui/material/FormControl';


import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


import LinearProgress from '@mui/material/LinearProgress';


const ProductSupplierListV2 = () => {

    useEffect(() => {
        fetchProductSupplierList();
        fetchSupplier();
    }, []);

    const [productSupplierList, setProductSupplierList] = useState([]);

    const [supplierId, setSupplierId] = useState(0);
    const [suppliers, setSuppliers] = useState([]);
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const onChangeInput = (e, value) => {
        console.log(value)
        setSupplierId(value.id)
    }

    const fetchBySupplierId = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        ProductSupplierService.fetchProductSupplierById(supplierId)
            .then(response => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
                setProductSupplierList(response.data);
            })
            .catch(e => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
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

    const fetchProductSupplierList = () => {
        ProductSupplierService.getAll()
            .then(response => {
                setProductSupplierList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteProductSupplier = (id, e) => {

        const index = productSupplierList.findIndex(productSupplier => productSupplier.id === id);
        const newProductSupplier = [...productSupplierList];
        newProductSupplier.splice(index, 1);

        ProductSupplierService.delete(id)
            .then(response => {
                setProductSupplierList(newProductSupplier);
            })
            .catch(e => {
                console.log('error', e);
            });
    }



    return (
        <div>
            <Form>

                <Box
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                // onSubmit={saveOrderSupplier}
                >
                    <FormControl variant="standard" >
                        <Autocomplete
                            // {...defaultProps}
                            options={suppliers}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={onChangeInput}
                            getOptionLabel={(suppliers) => suppliers.supplier_name}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Supplier" variant="standard" />
                            )}
                        />
                    </FormControl>
                </Box>
                <br></br>
                <Button
                    variant="contained"
                    disabled={isAddDisabled}
                    onClick={fetchBySupplierId}
                >
                    Search
                </Button>
            </Form>
            <br></br>
            {submitLoadingAdd &&
                <LinearProgress color="warning" />
            }
            <br></br>
            {productSupplierList.length == 0 ?
                (<h1 style={{ color: "red" }}>{"No Data Available"}</h1>)
                :
                (<ProductSupplierList
                    productSupplierList={productSupplierList}
                    deleteProductSupplier={deleteProductSupplier}
                />)
            }

        </div>
    )
}

export default ProductSupplierListV2
