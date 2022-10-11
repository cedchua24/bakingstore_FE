import React, { useState, useEffect } from "react";
import ProductServiceService from "./ProductService.service";
import BrandServiceService from "../Brand/BrandService.service";
import CategoryServiceService from "../Category/CategoryService.service";
import { Button, Form, Alert, FloatingLabel } from 'react-bootstrap';
import { Link } from "react-router-dom";


const AddProduct = () => {

  useEffect(() => {
    fetchProductList();
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

  const [productList, setProductList] = useState([]);

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
    console.log(product);
  }

  const onChangeWeight = (e) => {
    setProduct({ ...product, weight: e.target.value });
  }

  const onChangeQuantity = (e) => {
    setProduct({ ...product, quantity: e.target.value });
    console.log(product);
  }

  const saveProduct = (event) => {
    event.preventDefault();
    ProductServiceService.sanctum().then(response => {
      ProductServiceService.create(product)
        .then(response => {
          // setProductList([...productList, response.data]);;
          // setProduct({
          //   product_name: ''
          // });
          fetchProductList();
          console.log('save', response.data);
          setMessage(true);
        })
        .catch(e => {
          console.log(e);
        });
    });
  }

  const fetchProductList = () => {
    ProductServiceService.getAll()
      .then(response => {
        setProductList(response.data);
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

  const deleteProduct = (id, e) => {

    const index = productList.findIndex(brand => brand.id === id);
    const newProduct = [...productList];
    newProduct.splice(index, 1);

    ProductServiceService.delete(id)
      .then(response => {
        setProductList(newProduct);
      })
      .catch(e => {
        console.log('error', e);
      });
  }



  return (
    <div>
      <Form onSubmit={saveProduct}>
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
        {/* <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Product</Form.Label>
          <Form.Control type="text" value={product.product_name} name="product_name" placeholder="Enter product" onChange={onChangeProduct} />
        </Form.Group> */}

        <FloatingLabel
          controlId="floatingInput"
          label="Product"
          className="mb-3"

        >
          <Form.Control type="text" value={product.product_name} name="product_name" onChange={onChangeProduct} required />
        </FloatingLabel>


        <Form.Select aria-label="Default select example" className="mb-3" onChange={onChangeCategory} required>

          <option>Select Cateogory</option>
          {
            categeryList.map((category, index) => (
              <option value={category.id}>{category.category_name}</option>
            ))
          }
        </Form.Select>

        <Form.Select aria-label="Default select example" className="mb-3" onChange={onChangeBrand}  >
          <option>Select Brand</option>
          {
            brandList.map((brand, index) => (
              <option value={brand.id}>{brand.brand_name}</option>
            ))
          }
        </Form.Select>

        <FloatingLabel
          controlId="floatingInput"
          label="Price"
          className="mb-3"
        >
          <Form.Control type="number" value={product.price} name="price" onChange={onChangePrice} />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingInput"
          label="Stock"
          className="mb-3"
        >
          <Form.Control type="number" value={product.stock} name="stock" onChange={onChangeStock} />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingInput"
          label="Weight"
          className="mb-3"

        >
          <Form.Control type="text" value={product.weight} onChange={onChangeWeight} required />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingInput"
          label="Quantity"
          className="mb-3"

        >
          <Form.Control type="text" value={product.quantity} onChange={onChangeQuantity} required />
        </FloatingLabel>


        <Button variant="primary" type="submit" className="mb-3" >
          Submit
        </Button>
      </Form>

      <table class="table table-bordered">
        <thead class="table-dark">
          <tr class="table-secondary">
            <th>ID</th>
            <th>Product</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Quantity / Weight</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>

          {
            productList.map((product, index) => (
              <tr key={product.id} >
                <td>{product.id}</td>
                <td>{product.product_name}</td>
                <td>{product.brand_name}</td>
                <td>{product.category_name}</td>
                <td>₱ {product.price}.00</td>
                <td>{product.stock}</td>
                <td>{product.weight}x{product.quantity}kg</td>
                <td>
                  <Link variant="primary" to={"/editProduct/" + product.id}   >
                    <Button variant="primary" >
                      Update
                    </Button>
                  </Link>
                </td>
                <td>
                  <Button variant="danger" onClick={(e) => deleteProduct(product.id, e)} >
                    Delete
                  </Button>
                </td>
              </tr>
            )
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default AddProduct
