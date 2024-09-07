import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Dropdown, FloatingLabel } from 'react-bootstrap';
import ProductServiceService from "./ProductService.service";
import BrandServiceService from "../Brand/BrandService.service";
import CategoryServiceService from "../Category/CategoryService.service";
import Checkbox from '@mui/material/Checkbox';

const EditProduct = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchProduct(id);
        fetchBrandList();
        fetchCategoryList();
    }, []);

    const [product, setProduct] = useState({
        id: 0,
        category_id: 0,
        category_name: '',
        brand_id: 0,
        brand_name: '',
        product_name: "",
        price: 0,
        sale_price: 0,
        stock: 0,
        weight: 0,
        quantity: 0,
        stock_warning: 0,
        disabled: 0
    });

    const [brandList, setBrandList] = useState([]);
    const [categeryList, setCategoryList] = useState([]);

    const [message, setMessage] = useState(false);

    const onChangePaymentTypedisabled = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setProduct({ ...product, disabled: 1 });
            } else {
                setProduct({ ...product, disabled: 0 });
            }
        } else {
            setProduct({ ...product, disabled: e.target.value });
        }
    }

    const onChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    }

    const updateProduct = () => {
        console.log(product);
        ProductServiceService.update(product.id, product)
            .then(response => {
                // setProduct(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchProduct = (id) => {
        ProductServiceService.get(id)
            .then(response => {
                setProduct(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchBrandList = () => {
        BrandServiceService.getAll()
            .then(response => {
                setBrandList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCategoryList = () => {
        CategoryServiceService.getAll()
            .then(response => {
                setCategoryList(response.data);
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

                <FloatingLabel
                    controlId="floatingInput"
                    label="Product"
                    className="w-25 mb-3"
                >
                    <Form.Control type="text" value={product.product_name} name="product_name" onChange={onChange} />
                </FloatingLabel>

                <div class="form-floating">
                    <Form.Select aria-label="Default select example" name="category_id" id="floatingCategory" defaultValue={product.category_id} className="w-25 mb-3" onChange={onChange} >
                        {
                            categeryList.map((category, index) => (
                                category.id === product.category_id ? <option selected key={category.id} value={category.id}>{category.category_name}</option> :
                                    <option key={category.id} value={category.id}>{category.category_name}</option>
                            ))
                        }
                    </Form.Select>
                    <label for="floatingCategory">Category</label>
                </div>

                <div class="form-floating">
                    <Form.Select aria-label="Default select example" name="brand_id" id="floatingBrand" className="w-25 mb-3" defaultValue={product.brand_id} onChange={onChange}  >
                        {
                            brandList.map((brand, index) => (
                                brand.id === product.brand_id ? <option selected key={brand.id} value={brand.id}>{brand.brand_name}</option> :
                                    <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
                            ))
                        }
                    </Form.Select>
                    <label for="floatingBrand">Brand</label>
                </div>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Price"
                    className="w-25 mb-3"
                >
                    <Form.Control type="number" name="price" value={product.price} onChange={onChange} />
                </FloatingLabel>
                {product.weight != 1 &&
                    <FloatingLabel
                        controlId="floatingInput"
                        label={"Price per " + product.variation}
                        className="w-25 mb-3"
                        disabled
                    >
                        <Form.Control type="number" value={product.price / product.quantity} onChange={onChange} disabled />
                    </FloatingLabel>
                }
                {/* <FloatingLabel
                    controlId="floatingInput"
                    label="Stock"
                    className="w-25 mb-3"
                >
                    <Form.Control type="number" value={product.stock} onChange={onChangeStock} />
                </FloatingLabel> */}

                <FloatingLabel
                    controlId="floatingInput"
                    label="Weight"
                    className="w-25 mb-3"
                >
                    <Form.Control type="number" name="weight" value={product.weight} onChange={onChange} />
                </FloatingLabel>

                <FloatingLabel
                    controlId="floatingInput"
                    label="Quantity"
                    className="w-25 mb-3"
                >
                    <Form.Control type="number" name="quantity" value={product.quantity} onChange={onChange} />
                </FloatingLabel>

                <FloatingLabel
                    controlId="floatingInput"
                    label="Stock Warning"
                    className="w-25 mb-3"
                >
                    <Form.Control type="number" name="stock_warning" value={product.stock_warning} onChange={onChange} />
                </FloatingLabel>

                <FloatingLabel
                    controlId="floatingInput"
                    label="Sale Price Wholesale"
                    className="w-25 mb-3"
                >
                    <Form.Control type="number" name="sale_price" value={product.sale_price} onChange={onChange} />
                </FloatingLabel>
                {product.sale_price != 0 &&
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Sale Price Retail"
                        className="w-25 mb-3"
                    >
                        <Form.Control type="number" name="sale_price" value={Math.floor(product.sale_price / product.quantity)} disabled />
                    </FloatingLabel>
                }

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Disabled ? </Form.Label>

                    <Checkbox
                        checked={product.disabled === 0 ? false : true}
                        onChange={onChangePaymentTypedisabled}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Form.Group>


                <Button variant="primary" className="mb-3" onClick={updateProduct}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditProduct
