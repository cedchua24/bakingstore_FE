import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import ShopService from "./ShopService";

const EditShop = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchShop(id);
    }, []);

    const [shop, setShop] = useState({
        id: 0,
        shop_name: '',
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);

    const onChangeShop = (e) => {
        setShop({ ...shop, shop_name: e.target.value });
    }

    const saveShop = () => {
        ShopService.update(shop.id, shop)
            .then(response => {
                setShop(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchShop = (id) => {
        ShopService.get(id)
            .then(response => {
                setShop(response.data);
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
                    <Form.Label>shop</Form.Label>
                    <Form.Control type="text" name="shop_name" value={shop.shop_name} placeholder="Enter shop" onChange={onChangeShop} />
                    <Form.Text className="text-muted"  >
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" onClick={saveShop}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditShop
