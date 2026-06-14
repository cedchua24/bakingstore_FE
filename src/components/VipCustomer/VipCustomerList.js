import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const VipCustomerList = (props) => {

    const vipCustomerList = props.vipCustomerList;
    const deleteVipCustomer = props.deleteVipCustomer;

    const formatStatementDate = (date) => {
        if (!date) {
            return '';
        }
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const renderVipColor = (color) => {
        if (!color) {
            return '';
        }
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: color, border: '1px solid #ced4da', display: 'inline-block' }}></span>
                <span>{color}</span>
            </span>
        );
    }

    return (
        <div>
            <legend align="center" style={{ fontWeight: 'bold' }} > VIP Customer Template List </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>#</th>
                        <th>ID</th>
                        <th>VIP Customer Template Name</th>
                        <th>Details</th>
                        <th>Color</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        vipCustomerList.map((vipCustomer, index) => (
                            <tr key={vipCustomer.id} >
                                <td>{index}</td>
                                <td>{vipCustomer.id}</td>
                                <td>{vipCustomer.vip_name}</td>
                                <td>{vipCustomer.details}</td>
                                <td>{renderVipColor(vipCustomer.vip_color)}</td>
                                <td>{Number(vipCustomer.status) === 0 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                <td>{formatStatementDate(vipCustomer.created_at)}</td>
                                <td>
                                    <Link variant="primary" to={"/vipCustomer/" + vipCustomer.id} >
                                        <Button variant="warning" style={{ marginRight: '8px' }}>
                                            Update
                                        </Button>
                                    </Link>
                                    <Button variant="danger" onClick={(e) => deleteVipCustomer(vipCustomer.id, e)} disabled>
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

export default VipCustomerList
