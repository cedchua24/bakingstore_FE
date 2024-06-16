import React, { useState } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import BrandServiceService from "./BrandService.service";

const AddBrand = (props) => {

    const [brand, setBrand] = useState({
        id: 0,
        brand_name: '',
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);

    const onChangeBrand = (e) => {
        setBrand({ brand_name: e.target.value });
    }

    const saveBrand = () => {
        BrandServiceService.sanctum().then(response => {
            BrandServiceService.create(brand)
                .then(response => {
                    props.onSaveBrandData(response.data);
                    setMessage(true);
                    setBrand({
                        brand_name: ''
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
                    <Form.Label>Brand</Form.Label>
                    <Form.Control type="text" value={brand.brand_name} name="brand_name" placeholder="Enter Brand" onChange={onChangeBrand} />
                    <Form.Text className="text-muted"  >
                        ..
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" onClick={saveBrand}>
                    Submit
                </Button>
            </Form>
            <br></br>

        </div>
    )
}

export default AddBrand
