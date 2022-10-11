import React, { useState } from "react";
import { Alert } from 'react-bootstrap';
import MarkUpPriceServiceService from "../MarkUpPrice/MarkUpPriceService.service";
import OrderCustomerServiceService from "./OrderCustomerService.service";

import OrderCustomerTransactionList from "./OrderCustomerTransactionList";

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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

  const [message, setMessage] = useState(false);

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
    setOrderCustomer({ ...orderCustomer, [e.target.name]: e.target.value });
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
      price: value.price,
      product_name: value.product_name,
      mark_up_id: value.id
    });
  }

  function subtotal(items) {
    return items.map(({ total_price }) => total_price).reduce((sum, i) => sum + i, 0);
  }

  const saveProductOrderCustomer = (event) => {
    setValue(products[0]);
    event.preventDefault();
    setOrderCustomerList([...orderCustomerList, orderCustomer]);
    let arr = orderCustomerList.concat(orderCustomer);
    setOrderCustomerDTO({ orderCustomerList: arr, grandTotal: subtotal(arr) });
    setOrderCustomer({
      id: 0,
      order_customer_transaction_id: 0,
      mark_up_id: 0,
      product_name: '',
      price: 0,
      quantity: 0,
      total_price: 0,
      discount: 0
    });
    setValue(products[0]);

  }

  return (
    <div>
      {message &&
        <Alert variant="success" dismissible>
          <Alert.Heading>Successfully Added!</Alert.Heading>
          <p>
            Change this and that and try again. Duis mollis, est non commodo
            luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
            Cras mattis consectetur purus sit amet fermentum.
          </p>
        </Alert>
      }
      <Box
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      // onSubmit={saveOrderSupplier}
      >
        <br></br>
        <form onSubmit={saveProductOrderCustomer} >
          <FormControl variant="standard" >
            <Autocomplete
              // {...defaultProps}
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
