import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import VipCustomerService from "./VipCustomerService";

const VipCustomerTransactionTemplateList = () => {

    useEffect(() => {
        fetchVipCustomerList();
    }, []);

    const [vipCustomerList, setVipCustomerList] = useState([]);

    const fetchVipCustomerList = () => {
        VipCustomerService.getAll()
            .then(response => {
                setVipCustomerList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
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
            <legend align="center" style={{ fontWeight: 'bold' }} > VIP Customer </legend>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr className="table-secondary">
                        <th>#</th>
                        <th>ID</th>
                        <th>VIP Customer Template</th>
                        <th>Details</th>
                        <th>Color</th>
                        <th>Status</th>
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
                                <td>
                                    <div className="d-flex flex-wrap gap-2">
                                        <Link to={"/vipTransaction/" + vipCustomer.id}>
                                            <Button variant="primary">
                                                Transaction View
                                            </Button>
                                        </Link>
                                        <Link to={"/vipTransactionDebt/" + vipCustomer.id}>
                                            <Button variant="warning">
                                                Pending Balances
                                            </Button>
                                        </Link>
                                        <Link to={"/vipTransactionHistory/" + vipCustomer.id}>
                                            <Button variant="success">
                                                Transaction History
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default VipCustomerTransactionTemplateList
