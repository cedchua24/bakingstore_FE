import React, { useState, useEffect } from "react";
import ProductServiceService from "./ProductService.service";
import ProductTransactionService from "../OtherService/ProductTransactionService";
import BrandServiceService from "../Brand/BrandService.service";
import CategoryServiceService from "../Category/CategoryService.service";
import { Form, FloatingLabel } from 'react-bootstrap';
import { Link } from "react-router-dom";

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress';

import { styled } from '@mui/material/styles';


const AddProduct = () => {

  useEffect(() => {
    fetchProductList();
    fetchBrandList();
    fetchCategoryList();
  }, []);


  const [submitLoading, setSubmitLoading] = useState(false);
  const [validator, setValidator] = useState({
    severity: '',
    message: '',
    isShow: false
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    '& .MuiTextField-root': { m: 1, width: '25ch' },
  };

  const [open, setOpen] = React.useState(false);

  const handleOpen = (id, e) => {
    console.log('e', id);
    fetchShopOrder(id);
    setOpen(true);
  }

  const [orderSupplierModal, setOrderSupplierModal] = useState({
    id: 0,
    user_id: localStorage.getItem('auth_user_id'),
    product_name: '',
    shop_order_quantity: 0,
    stock: 0
  });

  const fetchShopOrder = async (id) => {
    await ProductServiceService.get(id)
      .then(response => {
        setOrderSupplierModal(response.data);
      })
      .catch(e => {
        console.log("error", e)
      });
  }

  const onChangeInputQuantityModal = (e) => {
    e.persist();
    setOrderSupplierModal({
      ...orderSupplierModal,
      user_id: localStorage.getItem('auth_user_id'),
      shop_order_quantity: e.target.value,
    });
  }

  const updateOrderSupplier = () => {
    setSubmitLoading(true);
    ProductTransactionService.create(orderSupplierModal)
      .then(response => {
        if (response.data.code == 200) {
          setSubmitLoading(false);
          setOpen(false);
          window.scrollTo(0, 0);
          setValidator({
            severity: 'success',
            message: 'Successfuly Added!',
            isShow: true,
          });
          fetchProductList();
        } else if (response.data.code == 400) {
          setSubmitLoading(false);
          setOpen(false);
          window.scrollTo(0, 0);
          setValidator({
            severity: 'error',
            message: response.data.message,
            isShow: true,
          });
        } else {
          setSubmitLoading(false);
          setOpen(false);
          setValidator({
            severity: 'error',
            message: "Unknown Error",
            isShow: true,
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  const handleClose = () => setOpen(false);

  const [product, setProduct] = useState({
    id: 0,
    category_id: 0,
    category_name: '',
    brand_id: 0,
    brand_name: '',
    product_name: "",
    price: 0,
    stock: 0,
    weight: 0,
    variation: 'kg',
    quantity: 0,
    packaging: ''
  })

  const [brandList, setBrandList] = useState([]);
  const [categeryList, setCategoryList] = useState([]);

  const [message, setMessage] = useState(false);

  const [variationLabel, setVariationLabel] = useState('Weight');

  const [productList, setProductList] = useState([]);

  const onChangeProduct = (e) => {
    setProduct({ ...product, product_name: e.target.value });
  }

  const onChangeCategory = (e) => {
    setProduct({ ...product, category_id: e.target.value });
  }

  const onChangeBrand = (e) => {
    setProduct({ ...product, brand_id: e.target.value });
  }

  const onChangePackaging = (e) => {
    setProduct({ ...product, packaging: e.target.value });
  }

  const onChangeVariation = (e) => {
    setProduct({ ...product, variation: e.target.value });
    if (e.target.value === "kg") {
      setVariationLabel("Weight");
    } else {
      setVariationLabel("Pcs");
    }

  }

  const onChangePrice = (e) => {
    setProduct({ ...product, price: e.target.value });
  }

  const onChangeStock = (e) => {
    setProduct({ ...product, stock: e.target.value });
    console.log(product);
  }

  const onChangeWeight = (e) => {
    setProduct({ ...product, weight: e.target.value });
  }

  const onChangeQuantity = (e) => {
    setProduct({ ...product, quantity: e.target.value });
    console.log(product);
  }

  const saveProduct = (event) => {
    event.preventDefault();
    ProductServiceService.sanctum().then(response => {
      ProductServiceService.create(product)
        .then(response => {
          if (response.data.code == 200) {
            setSubmitLoading(false);
            setOpen(false);
            window.scrollTo(0, 0);
            setValidator({
              severity: 'success',
              message: 'Successfuly Added!',
              isShow: true,
            });
            fetchProductList();
          } else if (response.data.code == 400) {
            setSubmitLoading(false);
            setOpen(false);
            window.scrollTo(0, 0);
            setValidator({
              severity: 'error',
              message: response.data.message,
              isShow: true,
            });
          } else {
            setSubmitLoading(false);
            setOpen(false);
            setValidator({
              severity: 'error',
              message: "Unknown Error",
              isShow: true,
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    });
  }

  const fetchProductList = () => {
    ProductServiceService.fetchProductByCategoryIdV2()
      .then(response => {
        setProductList(response.data);
      })
      .catch(e => {
        console.log("error", e)
      });
  }

  const fetchBrandList = () => {
    BrandServiceService.getAll()
      .then(response => {
        setBrandList(response.data);
      })
      .catch(e => {
        console.log("error", e)
      });
  }

  const fetchCategoryList = () => {
    CategoryServiceService.getAll()
      .then(response => {
        setCategoryList(response.data);
      })
      .catch(e => {
        console.log("error", e)
      });
  }

  const deleteProduct = (id, e) => {

    const index = productList.findIndex(brand => brand.id === id);
    const newProduct = [...productList];
    newProduct.splice(index, 1);

    ProductServiceService.delete(id)
      .then(response => {
        setProductList(newProduct);
      })
      .catch(e => {
        console.log('error', e);
      });
  }



  return (
    <div>
      <Form onSubmit={saveProduct}>
        <Stack sx={{ width: '100%' }} spacing={2}>
          {validator.isShow &&
            <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
          }
        </Stack>
        <br></br>
        {/* <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Product</Form.Label>
          <Form.Control type="text" value={product.product_name} name="product_name" placeholder="Enter product" onChange={onChangeProduct} />
        </Form.Group> */}

        <FloatingLabel
          controlId="floatingInput"
          label="Product"
          className="mb-3"

        >
          <Form.Control type="text" value={product.product_name} name="product_name" onChange={onChangeProduct} required />
        </FloatingLabel>


        <Form.Select aria-label="Default select example" className="mb-3" onChange={onChangeCategory} required>

          <option>Select Cateogory</option>
          {
            categeryList.map((category, index) => (
              <option value={category.id}>{category.category_name}</option>
            ))
          }
        </Form.Select>

        <Form.Select aria-label="Default select example" className="mb-3" onChange={onChangeBrand}  >
          <option>Select Brand</option>
          {
            brandList.map((brand, index) => (
              <option value={brand.id}>{brand.brand_name}</option>
            ))
          }
        </Form.Select>

        <FloatingLabel
          controlId="floatingInput"
          label="Price"
          className="mb-3"
        >
          <Form.Control type="number" value={product.price} name="price" onChange={onChangePrice} />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingInput"
          label="Stock"
          className="mb-3"
        >
          <Form.Control type="number" value={product.stock} name="stock" onChange={onChangeStock} />
        </FloatingLabel>

        <Form.Select aria-label="Default select example" className="mb-3" onChange={onChangeVariation}  >
          <option value="kg">kg</option>
          <option value="pcs">pcs</option>

        </Form.Select>

        <FloatingLabel
          controlId="floatingInput"
          label={variationLabel}
          className="mb-3"

        >
          <Form.Control type="text" value={product.weight} onChange={onChangeWeight} required />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingInput"
          label="Quantity"
          className="mb-3"
        >

          <Form.Control type="text" value={product.quantity} onChange={onChangeQuantity} required />
        </FloatingLabel>

        <Form.Select aria-label="Default select example" className="mb-3" onChange={onChangePackaging}  >
          <option>Select Packaging</option>

          <option value="Sack">Sack</option>
          <option value="Box">Box</option>
          <option value="Plastic">Plastic</option>
          <option value="Galloon">Galloon</option>

        </Form.Select>

        <Button
          variant="contained"
          type="submit"
        >
          Submit
        </Button>
        <br></br>
      </Form>
      <br></br>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Add Stocks
          </Typography>
          {submitLoading &&
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </div>
          }
          <TextField
            disabled
            id="filled-required"
            label="Product Name"
            variant="filled"
            name='product_name'
            value={orderSupplierModal.product_name}
          />

          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="standard-adornment-amount">Quantity</InputLabel>
            <Input
              type='number'
              id="filled-required"
              label="Quantity"
              variant="filled"
              name='shop_order_quantity'
              onChange={onChangeInputQuantityModal}
            />
          </FormControl>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              type="submit"
              onClick={updateOrderSupplier}
              size="large" >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <table class="table table-bordered">
        <thead class="table-dark">
          <tr class="table-secondary">
            <th>ID</th>
            <th>Product</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity / Weight</th>
            <th>Stock</th>
            <th>Packaging</th>
            <th>Stock / Per Piece</th>
            <th>Add Stock</th>
            <th>Transaction</th>
            <th>Action</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

          {
            productList.map((product, index) => (
              <tr key={product.id} >
                <td>{product.id}</td>
                <td>{product.product_name}</td>
                <td>{product.brand_name}</td>
                <td>{product.category_name}</td>
                <td>₱ {product.price}.00</td>
                {/* <td>{product.weight}x{product.quantity}kg</td> */}
                <td>{product.quantity === 1 ? <p >{product.weight}{product.variation}</p>
                  : <p >({product.weight / product.quantity}{product.variation}) x {product.quantity}</p>}
                </td>
                <td>{product.stock}</td>
                <td>{product.packaging}</td>
                <td>{product.stock_pc}</td>
                <td>
                  <Tooltip title="Update">
                    <IconButton>
                      <UpdateIcon color="primary" onClick={(e) => handleOpen(product.id, e)} />
                    </IconButton>
                  </Tooltip>
                </td>
                <td>
                  <Link variant="primary" to={"/productTransactionList/" + product.id}   >
                    <Button variant="contained" >
                      View
                    </Button>
                  </Link>
                </td>

                <td>
                  <Link variant="primary" to={"/editProduct/" + product.id}   >
                    <Button variant="contained" >
                      Update
                    </Button>
                  </Link>
                </td>
                <td>
                  <Button disabled variant="contained" color="error" onClick={(e) => deleteProduct(product.id, e)} >
                    Delete
                  </Button>
                </td>
              </tr>
            )
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default AddProduct
