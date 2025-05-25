import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import SupplierServiceService from "../Supplier/SupplierService.service";
import ProductServiceService from "../Product/ProductService.service";

const SupplierProductList = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchProduct(id);
        fetchSupplierProduct(id);

    }, []);

    const [product, setProduct] = useState({
        id: 0,
        product_name: '',
        price: ''
    });
    const [productSupplier, setProductSupplier] = useState([]);
    const [message, setMessage] = useState(false);



    const fetchProduct = (id) => {
        ProductServiceService.get(id)
            .then(response => {
                setProduct(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchSupplierProduct = (id) => {
        SupplierServiceService.fetchSupplierProduct(id)
            .then(response => {
                setProductSupplier(response.data);
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
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control type="text" value={product.product_name} name="product_name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>SRP</Form.Label>
                    <Form.Control type="text" value={product.price} name="srp" />
                </Form.Group>

            </Form>
            <div>
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr class="table-secondary">
                            <th>ID</th>
                            <th>Supplier Name</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            productSupplier.map((supplier, index) => (
                                <tr key={supplier.id} >
                                    <td>{supplier.id}</td>
                                    <td>{supplier.supplier_name}</td>
                                    <td>{supplier.price}</td>
                                </tr>
                            )
                            )
                        }
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default SupplierProductList
