import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Dropdown, FloatingLabel } from 'react-bootstrap';
import ProductServiceService from "./ProductService.service";
import BrandServiceService from "../Brand/BrandService.service";
import CategoryServiceService from "../Category/CategoryService.service";

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
        stock: 0,
        weight: 0,
        quantity: 0
    });

    const [brandList, setBrandList] = useState([]);
    const [categeryList, setCategoryList] = useState([]);

    const [message, setMessage] = useState(false);

    const onChangeProduct = (e) => {
        setProduct({ ...product, product_name: e.target.value });
    }

    const onChangeCategory = (e) => {
        setProduct({ ...product, category_id: e.target.value });
    }

    const onChangeBrand = (e) => {
        setProduct({ ...product, brand_id: e.target.value });
    }

    const onChangePrice = (e) => {
        setProduct({ ...product, price: e.target.value });
    }

    const onChangeStock = (e) => {
        setProduct({ ...product, stock: e.target.value });
    }

    const onChangeWeight = (e) => {
        setProduct({ ...product, weight: e.target.value });
    }

    const onChangeQuantity = (e) => {
        setProduct({ ...product, quantity: e.target.value });
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
                    <Form.Control type="text" value={product.product_name} name="product_name" onChange={onChangeProduct} />
                </FloatingLabel>

                <div class="form-floating">
                    <Form.Select aria-label="Default select example" id="floatingCategory" defaultValue={product.category_id} className="w-25 mb-3" onChange={onChangeCategory} >
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
                    <Form.Select aria-label="Default select example" id="floatingBrand" className="w-25 mb-3" defaultValue={product.brand_id} onChange={onChangeBrand}  >
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
                    <Form.Control type="number" value={product.price} onChange={onChangePrice} />
                </FloatingLabel>

                <FloatingLabel
                    controlId="floatingInput"
                    label="Stock"
                    className="w-25 mb-3"
                >
                    <Form.Control type="number" value={product.stock} onChange={onChangeStock} />
                </FloatingLabel>

                <FloatingLabel
                    controlId="floatingInput"
                    label="Weight"
                    className="w-25 mb-3"
                >
                    <Form.Control type="number" value={product.weight} onChange={onChangeWeight} />
                </FloatingLabel>

                <FloatingLabel
                    controlId="floatingInput"
                    label="Quantity"
                    className="w-25 mb-3"
                >
                    <Form.Control type="number" value={product.quantity} onChange={onChangeQuantity} />
                </FloatingLabel>


                <Button variant="primary" className="mb-3" onClick={updateProduct}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditProduct
