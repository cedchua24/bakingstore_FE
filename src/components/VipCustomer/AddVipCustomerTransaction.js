import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import VipCustomerService from "./VipCustomerService";
import VipCustomerTransactionService from "./VipCustomerTransactionService";
import CustomerService from "../Customer/CustomerService";

const AddVipCustomerTransaction = (props) => {

    useEffect(() => {
        fetchVipCustomerTemplateList();
        searchCustomerList('');
    }, []);

    const [vipCustomerTransaction, setVipCustomerTransaction] = useState({
        id: 0,
        vip_customer_id: '',
        customer_id: '',
        created_at: '',
        updated_at: ''
    });
    const [vipCustomerTemplateList, setVipCustomerTemplateList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [selectedVipCustomerTemplate, setSelectedVipCustomerTemplate] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const fetchVipCustomerTemplateList = () => {
        VipCustomerService.getAll()
            .then(response => {
                setVipCustomerTemplateList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const searchCustomerList = (search) => {
        CustomerService.searchVipCustomerList({
            search: search,
            limit: 50
        })
            .then(response => {
                setCustomerList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const validate = () => {
        const errors = {};
        if (!vipCustomerTransaction.vip_customer_id) {
            errors.vip_customer_id = "VIP Customer Template is Required!";
        }
        if (!vipCustomerTransaction.customer_id) {
            errors.customer_id = "Customer is Required!";
        }
        return errors;
    }

    const getCustomerName = (customer) => {
        if (!customer) {
            return '';
        }
        return customer.customer_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim();
    }

    const getVipCustomerColors = (customer) => {
        if (!customer || !Array.isArray(customer.vip_customers)) {
            return [];
        }
        return customer.vip_customers
            .map(vipCustomer => vipCustomer.vip_color)
            .filter(vipColor => vipColor);
    }

    const renderVipColorDots = (customer) => {
        const vipColors = getVipCustomerColors(customer);
        if (vipColors.length === 0) {
            return null;
        }

        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {vipColors.map((vipColor, index) => (
                    <span
                        key={index}
                        title="Already VIP"
                        style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '999px',
                            backgroundColor: vipColor,
                            border: '1px solid #ced4da',
                            display: 'inline-block',
                            flex: '0 0 auto'
                        }}
                    ></span>
                ))}
            </span>
        );
    }

    const saveVipCustomerTransaction = () => {
        const errors = validate();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);

        VipCustomerTransactionService.sanctum().then(response => {
            VipCustomerTransactionService.create(vipCustomerTransaction)
                .then(response => {
                    if (props.onSaveVipCustomerTransactionData) {
                        props.onSaveVipCustomerTransactionData(response.data);
                    }
                    setVipCustomerTransaction({
                        id: 0,
                        vip_customer_id: '',
                        customer_id: '',
                        created_at: '',
                        updated_at: ''
                    });
                    setSelectedVipCustomerTemplate(null);
                    setSelectedCustomer(null);
                    setValidator({
                        severity: 'success',
                        message: 'Successfully Added!',
                        isShow: true,
                    });
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                })
                .catch(e => {
                    console.log(e);
                    setValidator({
                        severity: 'error',
                        message: 'Unable to save VIP Customer',
                        isShow: true,
                    });
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                });
        });
    }

    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>

            <Form>
                {formErrors.vip_customer_id && <p style={{ color: "red" }}>{formErrors.vip_customer_id}</p>}
                <Form.Group className="mb-3" style={{ maxWidth: '560px' }} controlId="formVipCustomerTemplate">
                    <Form.Label>VIP Customer Template *</Form.Label>
                    <Autocomplete
                        options={vipCustomerTemplateList}
                        value={selectedVipCustomerTemplate}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => option.vip_name || ''}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <span
                                        style={{
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '4px',
                                            backgroundColor: option.vip_color || '#6c757d',
                                            border: '1px solid #ced4da',
                                            display: 'inline-block'
                                        }}
                                    ></span>
                                    <span>{option.vip_name}</span>
                                </span>
                            </li>
                        )}
                        onChange={(event, value) => {
                            setSelectedVipCustomerTemplate(value);
                            setVipCustomerTransaction({
                                ...vipCustomerTransaction,
                                vip_customer_id: value ? value.id : ''
                            });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select VIP Customer Template"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            {selectedVipCustomerTemplate &&
                                                <span
                                                    style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        borderRadius: '4px',
                                                        backgroundColor: selectedVipCustomerTemplate.vip_color || '#6c757d',
                                                        border: '1px solid #ced4da',
                                                        display: 'inline-block',
                                                        marginRight: '8px'
                                                    }}
                                                ></span>
                                            }
                                            {params.InputProps.startAdornment}
                                        </>
                                    )
                                }}
                            />
                        )}
                    />
                </Form.Group>

                {formErrors.customer_id && <p style={{ color: "red" }}>{formErrors.customer_id}</p>}
                <Form.Group className="mb-3" style={{ maxWidth: '560px' }} controlId="formCustomer">
                    <Form.Label>Customer *</Form.Label>
                    <Autocomplete
                        options={customerList}
                        value={selectedCustomer}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => getCustomerName(option)}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: '100%' }}>
                                    <span>{getCustomerName(option)}</span>
                                    {getVipCustomerColors(option).length > 0 &&
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                            {renderVipColorDots(option)}
                                            <span style={{ color: '#6c757d', fontSize: '11px', fontWeight: '700' }}>VIP</span>
                                        </span>
                                    }
                                </span>
                            </li>
                        )}
                        onInputChange={(event, value) => {
                            searchCustomerList(value);
                        }}
                        onChange={(event, value) => {
                            setSelectedCustomer(value);
                            setVipCustomerTransaction({
                                ...vipCustomerTransaction,
                                customer_id: value ? value.id : ''
                            });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search Customer"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            {selectedCustomer &&
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginRight: '10px' }}>
                                                    {renderVipColorDots(selectedCustomer)}
                                                    {getVipCustomerColors(selectedCustomer).length > 0 &&
                                                        <span style={{ color: '#495057', fontSize: '11px', fontWeight: '700' }}>VIP</span>
                                                    }
                                                </span>
                                            }
                                            {params.InputProps.startAdornment}
                                        </>
                                    )
                                }}
                            />
                        )}
                    />
                </Form.Group>

                <Button variant="primary"
                    disabled={isAddDisabled}
                    onClick={saveVipCustomerTransaction}>
                    Submit
                </Button>
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }
            </Form>
            <br></br>
        </div>
    )
}

export default AddVipCustomerTransaction
