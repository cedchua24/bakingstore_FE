import React from 'react'
import { Button } from 'react-bootstrap';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const VipCustomerTransactionList = (props) => {

    const vipCustomerTransactionList = props.vipCustomerTransactionList;
    const deleteVipCustomerTransaction = props.deleteVipCustomerTransaction;

    return (
        <div>
            <legend align="center" style={{ fontWeight: 'bold' }} > VIP Customer List </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>#</th>
                        <th>ID</th>
                        <th>VIP Customer Template</th>
                        <th>Customer</th>
                        <th>Details</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        vipCustomerTransactionList.map((vipCustomerTransaction, index) => (
                            <tr key={vipCustomerTransaction.id} >
                                <td>{index}</td>
                                <td>{vipCustomerTransaction.id}</td>
                                <td>{vipCustomerTransaction.vip_name}</td>
                                <td>{vipCustomerTransaction.customer_name}</td>
                                <td>{vipCustomerTransaction.details}</td>
                                <td>{Number(vipCustomerTransaction.status) === 0 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteVipCustomerTransaction(vipCustomerTransaction.id, e)} >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default VipCustomerTransactionList
