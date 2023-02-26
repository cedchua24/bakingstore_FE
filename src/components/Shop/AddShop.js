import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import ShopService from "./ShopService";
import ShopTypeService from "../OtherService/ShopTypeService";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';

const AddShop = (props) => {

    useEffect(() => {
        fetchShopType();
    }, []);

    const [shop, setShop] = useState({
        id: 0,
        shop_name: '',
        shop_type_id: 0,
        status: 1,
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);
    const [shopTypes, setShopTypes] = useState([]);

    const onChangeShop = (e) => {
        setShop({ ...shop, shop_name: e.target.value });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        console.log(value)
        setShop({
            ...shop,
            shop_type_id: value.id,
        });
    }

    const fetchShopType = () => {
        ShopTypeService.getAll()
            .then(response => {
                console.log(response.data);
                setShopTypes(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const saveshop = (event) => {
        event.preventDefault();
        console.log(shop);
        ShopService.sanctum().then(response => {
            ShopService.create(shop)
                .then(response => {
                    props.onSaveShopData(response.data);
                    setMessage(true);
                    setShop({
                        shop_name: ''
                    });
                })
                .catch(e => {
                    console.log(e);
                });
        });
    }

    return (
        <div>

            <Box
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            // onSubmit={saveOrderSupplier}
            >

                <form onSubmit={saveshop} >
                    <FormControl variant="standard" >
                        <InputLabel htmlFor="standard-adornment-amount">Shop Name</InputLabel>
                        <Input
                            className="mb-3"
                            id="filled-required"
                            label="Shop"
                            variant="filled"
                            name='shop_name'
                            value={shop.shop_name}
                            onChange={onChangeShop}
                        />
                    </FormControl>
                    <br></br>

                    <FormControl variant="standard" >
                        <Autocomplete
                            // {...defaultProps}
                            options={shopTypes}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputChange}
                            getOptionLabel={(shopTypes) => shopTypes.shop_type_description}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Shop Type" variant="standard" />
                            )}
                        />
                    </FormControl>

                    <br></br>

                    <div>
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            Add
                        </Button>
                    </div>
                    <br></br>
                </form>
                <br></br>
            </Box>
        </div>
    )
}

export default AddShop
