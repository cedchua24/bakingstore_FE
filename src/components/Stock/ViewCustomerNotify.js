import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import OutOfStockUpdateService from "../OtherService/OutOfStockUpdateService";
import { Form } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography'
import { Button } from 'react-bootstrap';
import Modal from '@mui/material/Modal';
import UpdateIcon from '@mui/icons-material/Update';
import IconButton from '@mui/material/IconButton';


const ViewCustomerNotify = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchCustomertoNotify(id);
    }, []);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        '& .MuiTextField-root': { m: 1, width: '25ch' },
    };

    const [customerNotify, setCustomerNotify] = useState({
        id: 0,
        customer_id: 0,
        product_id: 0,
        status: 0,
        created_at: '',
        updated_at: ''
    });

    const [openCustomerNotify, setOpenCustomerNotify] = React.useState(false);
    const handleCloseNotify = () => setOpenCustomerNotify(false);


    const handleOpenCustomerNotify = (id, e) => {
        console.log('e', id);
        fetchNotifyCustomer(id);
        setOpenCustomerNotify(true);
    }

    const fetchNotifyCustomer = async ($id) => {
        await OutOfStockUpdateService.get($id)
            .then(response => {
                setCustomerNotify(response.data);

            })
            .catch(e => {
                console.log("error", e)
            });
    }




    const [customerNotifyList, setCustomerNotifyList] = useState({
        data: [],
        code: 0
    });

    const fetchCustomertoNotify = (id) => {
        OutOfStockUpdateService.fetchCustomerToNotify(id)
            .then(response => {
                setCustomerNotifyList(response.data);

            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const onChangeNotify = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setCustomerNotify({ ...customerNotify, status: 1 });
            } else {
                setCustomerNotify({ ...customerNotify, status: 0 });
            }
        } else {
            setCustomerNotify({ ...customerNotify, status: e.target.value });
        }
    }

    const updateDate = () => {
        OutOfStockUpdateService.update(customerNotify.id, customerNotify)
            .then(response => {
                fetchCustomertoNotify(id);
                setOpenCustomerNotify(false);
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
        <div>
            <legend align="center" style={{ fontWeight: 'bold' }} > Customer to Notify </legend>
            <h6 align="center" > {customerNotifyList.data.length == 0 ? '' : customerNotifyList.data[0].product_name} </h6>

            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        customerNotifyList.data.map((item, index) => (
                            <tr key={item.id} >
                                <td>{item.id}</td>
                                <td>{item.first_name + " " + item.lastname}</td>
                                <td>{item.created_at}</td>
                                <td>{item.status == 1 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                <td>
                                    <IconButton>
                                        <UpdateIcon color="primary" onClick={(e) => handleOpenCustomerNotify(item.id, e)} />
                                    </IconButton></td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>

            <Modal
                keepMounted
                open={openCustomerNotify}
                onClose={handleCloseNotify}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Notify Customer
                    </Typography>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Done Updating Customer ? </Form.Label>

                        <Checkbox
                            checked={customerNotify.status == 0 ? false : true}
                            onChange={onChangeNotify}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Form.Group>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button variant="primary" onClick={updateDate}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div >


    )
}

export default ViewCustomerNotify
