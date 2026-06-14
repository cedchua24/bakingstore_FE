import React, { useState, useEffect } from "react";
import VipCustomerTransactionService from "./VipCustomerTransactionService";
import VipCustomerService from "./VipCustomerService";
import VipCustomerTransactionList from "./VipCustomerTransactionList";
import { Button, Form } from 'react-bootstrap';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

const VipCustomerTransactionListV2 = () => {

    useEffect(() => {
        fetchVipCustomerTransactionList();
        fetchVipCustomerTemplateList();
    }, []);

    const [vipCustomerTransactionList, setVipCustomerTransactionList] = useState([]);
    const [vipCustomerTemplateList, setVipCustomerTemplateList] = useState([]);
    const [vipCustomerId, setVipCustomerId] = useState('');
    const [submitLoadingFetch, setSubmitLoadingFetch] = useState(false);
    const [isFetchDisabled, setIsFetchDisabled] = useState(false);
    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const fetchVipCustomerTransactionList = () => {
        setSubmitLoadingFetch(true);
        setIsFetchDisabled(true);
        VipCustomerTransactionService.getAll()
            .then(response => {
                setVipCustomerTransactionList(response.data);
                setValidator({
                    severity: 'success',
                    message: 'Successfully fetched VIP Customer List',
                    isShow: true,
                });
                setSubmitLoadingFetch(false);
                setIsFetchDisabled(false);
            })
            .catch(e => {
                setSubmitLoadingFetch(false);
                setIsFetchDisabled(false);
                setValidator({
                    severity: 'error',
                    message: 'Unable to fetch VIP Customer List',
                    isShow: true,
                });
                console.log("error", e)
            });
    }

    const fetchVipCustomerTemplateList = () => {
        VipCustomerService.getAll()
            .then(response => {
                setVipCustomerTemplateList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const onChangeVipCustomer = (e) => {
        setVipCustomerId(e.target.value);
    }

    const searchVipCustomerTransaction = () => {
        if (vipCustomerId === '') {
            fetchVipCustomerTransactionList();
            return;
        }

        setSubmitLoadingFetch(true);
        setIsFetchDisabled(true);
        VipCustomerTransactionService.fetchVipTransactionByVipId(vipCustomerId)
            .then(response => {
                setVipCustomerTransactionList(response.data);
                setValidator({
                    severity: 'success',
                    message: 'Successfully fetched VIP Customer List',
                    isShow: true,
                });
                setSubmitLoadingFetch(false);
                setIsFetchDisabled(false);
            })
            .catch(e => {
                setSubmitLoadingFetch(false);
                setIsFetchDisabled(false);
                setValidator({
                    severity: 'error',
                    message: 'Unable to fetch VIP Customer List',
                    isShow: true,
                });
                console.log("error", e)
            });
    }

    const deleteVipCustomerTransaction = (id, e) => {
        const index = vipCustomerTransactionList.findIndex(vipCustomerTransaction => vipCustomerTransaction.id === id);
        const newVipCustomerTransactionList = [...vipCustomerTransactionList];
        newVipCustomerTransactionList.splice(index, 1);

        VipCustomerTransactionService.delete(id)
            .then(response => {
                setVipCustomerTransactionList(newVipCustomerTransactionList);
            })
            .catch(e => {
                console.log('error', e);
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
                <Form.Group className="mb-3" controlId="formVipCustomerTemplateSearch">
                    <Form.Label>VIP Customer Template</Form.Label>
                    <Form.Select value={vipCustomerId} name="vip_customer_id" onChange={onChangeVipCustomer}>
                        <option value="">All VIP Customer</option>
                        {vipCustomerTemplateList.map((vipCustomerTemplate) => (
                            <option key={vipCustomerTemplate.id} value={vipCustomerTemplate.id}>{vipCustomerTemplate.vip_name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Button variant="primary" disabled={isFetchDisabled} onClick={searchVipCustomerTransaction}>
                    Search
                </Button>
                <br></br>
                <br></br>
                {submitLoadingFetch &&
                    <LinearProgress color="warning" />
                }
            </Form>
            <br></br>

            <VipCustomerTransactionList
                vipCustomerTransactionList={vipCustomerTransactionList}
                deleteVipCustomerTransaction={deleteVipCustomerTransaction}
            />
        </div>
    )
}

export default VipCustomerTransactionListV2
