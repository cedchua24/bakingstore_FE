import React, { useState, useEffect } from "react";
import CustomerService from "./CustomerService";
import CustomerList from "./CustomerList";
import AddCustomer from "./AddCustomer";

const CustomerListV2 = () => {

    useEffect(() => {
        fetchCustomerList();
    }, []);

    const [customerList, setCustomerList] = useState([]);

    const saveCustomerDataHandler = (customer) => {
        setCustomerList([...customerList, customer]);
    }


    const fetchCustomerList = () => {
        CustomerService.getAll()
            .then(response => {
                setCustomerList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteCustomer = (id, e) => {

        const index = customerList.findIndex(customer => customer.id === id);
        const newCustomer = [...customerList];
        newCustomer.splice(index, 1);

        CustomerService.delete(id)
            .then(response => {
                setCustomerList(newCustomer);
            })
            .catch(e => {
                console.log('error', e);
            });
    }



    return (
        <div>
            <CustomerList
                customerList={customerList}
                deleteCustomer={deleteCustomer}
            />
        </div>
    )
}

export default CustomerListV2
