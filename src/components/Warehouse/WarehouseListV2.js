import React, { useState, useEffect } from "react";
import WarehouseService from "./WarehouseService";
import WarehouseList from "./WarehouseList";
import AddWarehouse from "./AddWarehouse";

const WarehouseListV2 = () => {

    useEffect(() => {
        fetchwarehouseList();
    }, []);

    const [warehouseList, setWarehouseList] = useState([]);

    const saveWarehouseDataHandler = (warehouse) => {
        setWarehouseList([...warehouseList, warehouse]);
    }

    const fetchwarehouseList = () => {
        WarehouseService.getAll()
            .then(response => {
                setWarehouseList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteWarehouse = (id, e) => {
        const index = warehouseList.findIndex(warehouse => warehouse.id === id);
        const newWarehouse = [...warehouseList];
        newWarehouse.splice(index, 1);

        WarehouseService.delete(id)
            .then(response => {
                setWarehouseList(newWarehouse);
            })
            .catch(e => {
                console.log('error', e);
            });
    }


    return (
        <div>

            <WarehouseList
                warehouseList={warehouseList}
                deleteWarehouse={deleteWarehouse}
            />
        </div>
    )
}

export default WarehouseListV2
