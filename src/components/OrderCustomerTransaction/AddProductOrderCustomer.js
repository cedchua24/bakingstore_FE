import React, { useState } from "react";
// import { Alert } from 'react-bootstrap';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


import OrderCustomerTransactionList from "./OrderCustomerTransactionList";

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid';


const AddProductOrderCustomer = (props) => {

  const products = props.products;

  const [value, setValue] = useState(products[0])
  const [orderCustomerList, setOrderCustomerList] = useState([]);

  const [orderCustomerDTO, setOrderCustomerDTO] = useState({
    grandTotal: 0,
    orderCustomerList: []
  });

  const [orderCustomer, setOrderCustomer] = useState({
    id: 0,
    order_customer_transaction_id: 0,
    mark_up_id: 0,
    product_name: '',
    price: 0,
    quantity: 0,
    total_price: 0,
    discount: 0
  });


  const [validator, setValidator] = useState({
    severity: '',
    message: '',
    isShow: false
  });

  const deleteOrderCustomerHandler = (id) => {
    const index = orderCustomerList.findIndex(orderCustomer => orderCustomer.id === id);
    const newOrderCustomer = [...orderCustomerList];
    newOrderCustomer.splice(index, 1);

    setOrderCustomerList(newOrderCustomer);
  }

  const updateOrderCustomerListHandler = (orderCustomerModal) => {
    const index = orderCustomerList.findIndex(obj => {
      return obj.id === orderCustomerModal.id;
    });

    const newOrderCustomerList = [...orderCustomerList];
    newOrderCustomerList[index] = orderCustomerModal;
    setOrderCustomerList(newOrderCustomerList);
  }

  const onChangeInput = (e) => {
    console.log(e.target.value);
    setOrderCustomer({
      ...orderCustomer,
      [e.target.name]: e.target.value,
    });
  }

  const onChangeQuantity = (e) => {
    setOrderCustomer({
      ...orderCustomer,
      id: uuidv4(),
      quantity: e.target.value,
      total_price: Number(orderCustomer.price) * Number(e.target.value)
    });
  }

  const handleInputChange = (e, value) => {
    e.persist();
    console.log(value)
    setOrderCustomer({
      ...orderCustomer,
      id: uuidv4(),
      price: value.new_price,
      product_name: value.product_name,
      mark_up_id: value.id,
      total_price: Number(value.new_price) * Number(orderCustomer.quantity)
    });
  }

  function subtotal(items) {
    return items.map(({ total_price }) => total_price).reduce((sum, i) => sum + i, 0);
  }

  function inputValidation() {
    if (orderCustomer.product_name === '') {
      setValidator({
        severity: 'warning',
        message: 'Please choose Product',
        isShow: true,
      });
    } else
      if (orderCustomer.quantity === 0) {
        setValidator({
          severity: 'warning',
          message: 'Please insert Quantity',
          isShow: true,
        });
      } else {
        setValidator({
          severity: '',
          message: '',
          isShow: false,
        });
        const index = orderCustomerList.filter(obj => {
          return obj.product_name === orderCustomer.product_name;
        });
        if (index.length === 0) {
          setValidator({
            severity: 'success',
            message: 'Successfuly Added!',
            isShow: true,
          });
          setOrderCustomerList([...orderCustomerList, orderCustomer]);
          let arr = orderCustomerList.concat(orderCustomer);
          setOrderCustomerDTO({ orderCustomerList: arr, grandTotal: subtotal(arr) });
          // setOrderCustomer({
          //   id: 0,
          //   order_customer_transaction_id: 0,
          //   mark_up_id: 0,
          //   product_name: '',
          //   price: 0,
          //   quantity: 0,
          //   total_price: 0,
          //   discount: 0
          // });
          setValue(products[1]);

        } else {
          setValidator({
            severity: 'error',
            message: 'Product already exists!',
            isShow: true,
          });
        }
      }

  }


  const saveProductOrderCustomer = (event) => {
    setValue(products[0]);
    event.preventDefault();
    inputValidation();

  }




  return (
    <div>
      <Stack sx={{ width: '100%' }} spacing={2}>
        {validator.isShow &&
          <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
        }
      </Stack>

      <Box
        sx={{
          '& .MuiTextField-root': { m: 1 },
        }}
        noValidate
        autoComplete="off"
      // onSubmit={saveOrderSupplier}
      >
        <br></br>
        <form onSubmit={saveProductOrderCustomer} >
          <FormControl variant="standard"  >
            <Autocomplete
              // {...defaultProps}
              //assign the width as your requirement
              sx={{
                width: 400
              }}
              options={products}
              value={value}
              className="mb-3"
              id="disable-close-on-select"
              onChange={handleInputChange}
              getOptionLabel={(products) => products.product_name + ' - ' + (products.weight) + 'kg' + ' (₱' + (products.new_price) + ')'}
              renderInput={(params) => (
                <TextField {...params} label='Choose Product' variant="standard" />
              )}
            />
          </FormControl>

          <br></br>

          <FormControl variant="standard" >
            <InputLabel htmlFor="standard-adornment-amount">Price</InputLabel>
            <Input
              className="mb-3"
              id="filled-required"
              label="Price"
              variant="filled"
              name='price'
              value={orderCustomer.price}
              onChange={onChangeInput}
              startAdornment={<InputAdornment position="start">₱</InputAdornment>}
              disabled={orderCustomer.product_id === 0 ? true : false}
            />
          </FormControl>
          <br></br>
          <FormControl variant="standard">
            <InputLabel htmlFor="standard-adornment-amount">Quantity</InputLabel>
            <Input
              type='number'
              className="mb-3"
              id="filled-required"
              label="Price"
              variant="filled"
              name='quantity'
              value={orderCustomer.quantity}
              onChange={onChangeQuantity}
              disabled={orderCustomer.product_id === 0 ? true : false}
            />
          </FormControl>
          <br></br>
          <FormControl variant="standard" >
            <InputLabel htmlFor="standard-adornment-amount">Total Price</InputLabel>
            <Input
              className="mb-3"
              id="filled-required"
              label="Total Price"
              variant="filled"
              name='total_price'
              value={orderCustomer.total_price}
              onChange={onChangeInput}
              startAdornment={<InputAdornment position="start">₱</InputAdornment>}
              disabled
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
      </Box>
      <br></br>
      <OrderCustomerTransactionList
        orderCustomerDTO={orderCustomerDTO}
        orderCustomerList={orderCustomerList}
        deleteOrderCustomer={deleteOrderCustomerHandler}
        updateOrderCustomerList={updateOrderCustomerListHandler}
      />
    </div >
  )
}

export default AddProductOrderCustomer
