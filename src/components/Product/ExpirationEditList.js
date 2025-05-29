import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import OrderSupplierService from "../OrderSupplierTransaction/OrderSupplierServiceService";
import ProductServiceService from "./ProductService.service";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography'
import UpdateIcon from '@mui/icons-material/Update';

import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const ExpirationEditList = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchProduct(id);
        fetchSupplierProduct(id);

    }, []);

    const [product, setProduct] = useState({
        id: 0,
        product_name: '',
        price: ''
    });
    const [productSupplier, setProductSupplier] = useState([]);
    const [message, setMessage] = useState(false);
    const [submitLoadingUpdate, setSubmitLoadingUpdate] = useState(false);
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [orderSupplierModal, setOrderSupplierModal] = useState({
        id: 0,
        enable: 0,
        expiration: ''
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

    const onChangePaymentTypedisabled = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setOrderSupplierModal({ ...orderSupplierModal, enable: 1 });
            } else {
                setOrderSupplierModal({ ...orderSupplierModal, enable: 0 });
            }
        } else {
            setOrderSupplierModal({ ...orderSupplierModal, enable: e.target.value });
        }
    }


    const fetchProduct = (id) => {
        ProductServiceService.get(id)
            .then(response => {
                setProduct(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const handleOpen = (id, e) => {
        console.log('e', id);
        fetchOrderBySupplierId(id);
        setOpen(true);
    }

    const fetchOrderBySupplierId = async (id) => {
        await OrderSupplierService.fetchOrderBySupplierId(id)
            .then(response => {
                setOrderSupplierModal(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const updateOrderSupplier = () => {
        setSubmitLoadingUpdate(true);
        OrderSupplierService.setToActiveExpiration(orderSupplierModal)
            .then(response => {
                setSubmitLoadingUpdate(false);
                setOpen(false);
                fetchSupplierProduct(id);
                setValidator({
                    severity: 'success',
                    message: 'Updated Successfully',
                    isShow: true,
                });
            })
            .catch(e => {
                console.log(e);
            });
    }


    const fetchSupplierProduct = (id) => {
        ProductServiceService.fetchOrderSupplierExpirationList(id)
            .then(response => {
                setProductSupplier(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
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
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control type="text" value={product.product_name} name="product_name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>SRP</Form.Label>
                    <Form.Control type="text" value={product.price} name="srp" />
                </Form.Group>

            </Form>
            <div>
                <legend align="center" style={{ fontWeight: 'bold' }} > Product Expiration   </legend>
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr class="table-secondary">
                            <th>ID</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Active</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            productSupplier.map((supplier, index) => (
                                <tr key={supplier.id} >
                                    <td>{supplier.id}</td>
                                    <td>{formatStatementDate(supplier.expiration)}</td>
                                    <td>{supplier.price}</td>
                                    <td>{supplier.enable === 1 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                    <td> <UpdateIcon color="primary" onClick={(e) => handleOpen(supplier.id, e)} /></td>
                                </tr>
                            )
                            )
                        }
                    </tbody>
                </table>
            </div>

            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Update Product
                    </Typography>
                    {submitLoadingUpdate &&
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </div>
                    }
                    <TextField
                        disabled
                        id="filled-required"

                        variant="filled"
                        name='product_name'
                        value={orderSupplierModal.product_name}
                    />

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Price</InputLabel>
                        <Input
                            id="filled-required"
                            label="=Price"
                            variant="filled"
                            name='price'
                            value={orderSupplierModal.price}
                            disabled
                            startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                        />
                    </FormControl>


                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Expiration</Form.Label>
                            <Form.Control type="date" name="expiration" value={orderSupplierModal.expiration} disabled />
                        </Form.Group>
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Active ? </Form.Label>

                            <Checkbox
                                checked={orderSupplierModal.enable === 0 ? false : true}
                                onChange={onChangePaymentTypedisabled}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </Form.Group>
                    </FormControl>
                    <br></br>
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

        </div>
    )
}

export default ExpirationEditList
