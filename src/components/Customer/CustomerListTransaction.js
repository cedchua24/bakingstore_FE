import React, { useState, useEffect } from "react";
import CustomerService from "./CustomerService";
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Form, Alert } from 'react-bootstrap';

const CustomerListTransaction = () => {

    useEffect(() => {
        fetchCustomerList();
    }, []);

    const [customerList, setCustomerList] = useState([]);

    const saveCustomerDataHandler = (customer) => {
        setCustomerList([...customerList, customer]);
    }


    const fetchCustomerList = () => {
        CustomerService.fetchCustomerTransactionList()
            .then(response => {
                setCustomerList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }





    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th></th>
                        <th></th>

                        {/* <th></th> */}
                    </tr>
                </thead>
                <tbody>

                    {
                        customerList.map((customer, index) => (
                            <tr key={customer.id} >
                                <td>{customer.id}</td>
                                <td>{customer.first_name}</td>
                                <td>{customer.last_name}</td>
                                <td>{customer.contact_number}</td>
                                <td>{customer.email}</td>
                                <td>{customer.address}</td>
                                <td>{customer.disabled === 0 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                <td>

                                    <Link variant="primary" to={"/customers/customerTransactionList/" + customer.id}   >
                                        <Button variant="primary" >
                                            View Transaction
                                        </Button>
                                    </Link>
                                </td>
                                <td>

                                    <Link variant="primary" to={"/customers/customerProductList/" + customer.id}   >
                                        <Button variant="primary" >
                                            View Products
                                        </Button>
                                    </Link>
                                </td>
                                {/* <td>
                                    <Button variant="danger" onClick={(e) => deleteCustomermr(customer.id, e)} >
                                        Delete
                                    </Button>
                                </td> */}
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default CustomerListTransaction
