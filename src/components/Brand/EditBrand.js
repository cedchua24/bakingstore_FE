import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import BrandServiceService from "./BrandService.service";
const EditBrand = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchBrand(id);
    }, []);

    const [brand, setBrand] = useState({
        id: 0,
        brand_name: '',
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);

    const onChangeBrand = (e) => {
        setBrand({ ...brand, brand_name: e.target.value });
    }

    const saveBrand = () => {
        BrandServiceService.update(brand.id, brand)
            .then(response => {
                setBrand(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchBrand = (id) => {
        BrandServiceService.get(id)
            .then(response => {
                setBrand(response.data);
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
                    <Form.Label>Brand</Form.Label>
                    <Form.Control type="text" name="brand_name" value={brand.brand_name} placeholder="Enter Brand" onChange={onChangeBrand} />
                    <Form.Text className="text-muted"  >
                        ..
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" onClick={saveBrand}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditBrand
