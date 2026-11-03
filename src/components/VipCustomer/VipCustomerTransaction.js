import React, { useState, useEffect } from "react";
import VipCustomerTransactionService from "./VipCustomerTransactionService";
import VipCustomerTransactionList from "./VipCustomerTransactionList";
import AddVipCustomerTransaction from "./AddVipCustomerTransaction";

const VipCustomerTransaction = () => {

    const canManageVipCustomers = Number(localStorage.getItem('role_as')) === 2;

    useEffect(() => {
        fetchVipCustomerTransactionList();
    }, []);

    const [vipCustomerTransactionList, setVipCustomerTransactionList] = useState([]);

    const saveVipCustomerTransactionDataHandler = () => {
        fetchVipCustomerTransactionList();
    }

    const fetchVipCustomerTransactionList = () => {
        VipCustomerTransactionService.getAll()
            .then(response => {
                setVipCustomerTransactionList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteVipCustomerTransaction = (id, e) => {
        if (!canManageVipCustomers) {
            return;
        }

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
            <AddVipCustomerTransaction
                onSaveVipCustomerTransactionData={saveVipCustomerTransactionDataHandler}
            />
            <VipCustomerTransactionList
                vipCustomerTransactionList={vipCustomerTransactionList}
                deleteVipCustomerTransaction={deleteVipCustomerTransaction}
                canDelete={canManageVipCustomers}
            />
        </div>
    )
}

export default VipCustomerTransaction
