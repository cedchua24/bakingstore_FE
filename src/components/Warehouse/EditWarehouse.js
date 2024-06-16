import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import WarehouseService from "./WarehouseService";

const EditWarehouse = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchWarehouse(id);
    }, []);

    const [warehouse, setWarehouse] = useState({
        id: 0,
        warehouse_name: '',
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);

    const onChangeWarehouse = (e) => {
        setWarehouse({ ...warehouse, warehouse_name: e.target.value });
    }

    const saveWarehouse = () => {
        WarehouseService.update(warehouse.id, warehouse)
            .then(response => {
                setWarehouse(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchWarehouse = (id) => {
        WarehouseService.get(id)
            .then(response => {
                setWarehouse(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    return (
        <div>
            {message &&
                <Alert variant="success" dismissible>
                    <Alert.Heading>Successfully Updated!</Alert.Heading>
                    <p>
                        Change this and that and try again. Duis mollis, est non commodo
                        luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                        Cras mattis consectetur purus sit amet fermentum.
                    </p>
                </Alert>
            }
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Warehouse</Form.Label>
                    <Form.Control type="text" name="warehouse_name" value={warehouse.warehouse_name} placeholder="Enter Warehouse" onChange={onChangeWarehouse} />
                    <Form.Text className="text-muted"  >
                        ..
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" onClick={saveWarehouse}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditWarehouse
