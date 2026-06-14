import React, { useState, useEffect } from "react";
import VipCustomerService from "./VipCustomerService";
import VipCustomerList from "./VipCustomerList";
import AddVipCustomer from "./AddVipCustomer";

const VipCustomer = () => {

    useEffect(() => {
        fetchVipCustomerList();
    }, []);

    const [vipCustomerList, setVipCustomerList] = useState([]);

    const saveVipCustomerDataHandler = (vipCustomer) => {
        setVipCustomerList([...vipCustomerList, vipCustomer]);
    }

    const fetchVipCustomerList = () => {
        VipCustomerService.getAll()
            .then(response => {
                setVipCustomerList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteVipCustomer = (id, e) => {
        const index = vipCustomerList.findIndex(vipCustomer => vipCustomer.id === id);
        const newVipCustomerList = [...vipCustomerList];
        newVipCustomerList.splice(index, 1);

        VipCustomerService.delete(id)
            .then(response => {
                setVipCustomerList(newVipCustomerList);
            })
            .catch(e => {
                console.log('error', e);
            });
    }

    return (
        <div>
            <AddVipCustomer
                onSaveVipCustomerData={saveVipCustomerDataHandler}
            />
            <VipCustomerList
                vipCustomerList={vipCustomerList}
                deleteVipCustomer={deleteVipCustomer}
            />
        </div>
    )
}

export default VipCustomer
