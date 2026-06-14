import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import VipCustomerService from "./VipCustomerService";

const EditVipCustomer = () => {

    const { id } = useParams();

    const [vipCustomer, setVipCustomer] = useState({
        id: 0,
        vip_name: '',
        details: '',
        vip_color: '#000000',
        status: 0,
        created_at: '',
        updated_at: ''
    });
    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    useEffect(() => {
        fetchVipCustomer(id);
    }, [id]);

    const fetchVipCustomer = (id) => {
        VipCustomerService.get(id)
            .then(response => {
                setVipCustomer({
                    ...response.data,
                    vip_color: response.data.vip_color || '#000000'
                });
            })
            .catch(e => {
                console.log("error", e);
                setValidator({
                    severity: 'error',
                    message: 'Unable to fetch VIP Customer Template',
                    isShow: true,
                });
            });
    }

    const onChangeInput = (e) => {
        setVipCustomer({ ...vipCustomer, [e.target.name]: e.target.value });
    }

    const validate = () => {
        const errors = {};
        if (!vipCustomer.vip_name) {
            errors.vip_name = "VIP Customer Template Name is Required!";
        }
        return errors;
    }

    const updateVipCustomer = () => {
        const errors = validate();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);

        VipCustomerService.sanctum().then(response => {
            VipCustomerService.update(vipCustomer.id, vipCustomer)
                .then(response => {
                    setVipCustomer({
                        ...response.data,
                        vip_color: response.data.vip_color || '#000000'
                    });
                    setValidator({
                        severity: 'success',
                        message: response.data.message || 'Successfully Updated!',
                        isShow: true,
                    });
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                })
                .catch(e => {
                    console.log(e);
                    setValidator({
                        severity: 'error',
                        message: 'Unable to update VIP Customer Template',
                        isShow: true,
                    });
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                });
        });
    }

    return (
        <div>
            <legend align="center" style={{ fontWeight: 'bold' }} > Update VIP Customer Template </legend>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>

            <Form>
                {formErrors.vip_name && <p style={{ color: "red" }}>{formErrors.vip_name}</p>}
                <Form.Group className="mb-3" controlId="formVipName">
                    <Form.Label>VIP Customer Template Name *</Form.Label>
                    <Form.Control type="text" value={vipCustomer.vip_name} name="vip_name" placeholder="Enter VIP Customer Template Name" onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formVipDetails">
                    <Form.Label>Details</Form.Label>
                    <Form.Control as="textarea" rows={3} value={vipCustomer.details || ''} name="details" placeholder="Enter Details" onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formVipColor">
                    <Form.Label>VIP Color</Form.Label>
                    <Form.Control type="color" value={vipCustomer.vip_color || '#000000'} name="vip_color" onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formVipStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select value={vipCustomer.status} name="status" onChange={onChangeInput}>
                        <option value="0">Active</option>
                        <option value="1">Inactive</option>
                    </Form.Select>
                </Form.Group>

                <Button variant="primary"
                    disabled={isAddDisabled}
                    onClick={updateVipCustomer}>
                    Update
                </Button>
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }
            </Form>
        </div>
    )
}

export default EditVipCustomer
