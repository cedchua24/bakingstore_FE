import React, { useState } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import WarehouseService from "./WarehouseService";

const AddWarehouse = (props) => {

    const [warehouse, setWarehouse] = useState({
        id: 0,
        warehouse_name: '',
        status: 1,
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);

    const onChangeWarehouse = (e) => {
        setWarehouse({ warehouse_name: e.target.value });
    }

    const saveWarehouse = () => {
        WarehouseService.sanctum().then(response => {
            WarehouseService.create(warehouse)
                .then(response => {
                    props.onSaveWarehouseData(response.data);
                    setMessage(true);
                    setWarehouse({
                        warehouse_name: ''
                    });
                })
                .catch(e => {
                    console.log(e);
                });
        });
    }

    return (
        <div>
            {message &&
                <Alert variant="success" dismissible>
                    <Alert.Heading>Successfully Added!</Alert.Heading>
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
                    <Form.Control type="text" value={warehouse.warehouse_name} name="warehouse_name" placeholder="Enter warehouse" onChange={onChangeWarehouse} />
                    <Form.Text className="text-muted"  >
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" onClick={saveWarehouse}>
                    Submit
                </Button>
            </Form>
            <br></br>

        </div>
    )
}

export default AddWarehouse
