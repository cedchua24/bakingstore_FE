import React, { useEffect, useState } from "react";
import { Form } from 'react-bootstrap';
import { Link } from "react-router-dom";

import ProductServiceService from "./ProductService.service";
import BrandServiceService from "../Brand/BrandService.service";
import CategoryServiceService from "../Category/CategoryService.service";

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

import './AddProduct.css';

const initialProduct = {
  category_id: 0,
  brand_id: 0,
  product_name: "",
  price: 0,
  stock: 0,
  weight: 0,
  variation: '',
  quantity: 0,
  stock_warning: 0,
  stock_warning_type: '',
  packaging: ''
};

const AddProduct = () => {
  const [product, setProduct] = useState(initialProduct);
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ severity: '', message: '', visible: false });

  useEffect(() => {
    BrandServiceService.getAll()
      .then(response => setBrandList(response.data))
      .catch(error => console.log("error", error));

    CategoryServiceService.getAll()
      .then(response => setCategoryList(response.data))
      .catch(error => console.log("error", error));
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setProduct(current => ({ ...current, [name]: value }));
    setFormErrors(current => ({ ...current, [name]: undefined }));
  };

  const validate = (values) => {
    const errors = {};

    if (!values.product_name.trim()) errors.product_name = "Product name is required.";
    if (Number(values.category_id) === 0) errors.category_id = "Category is required.";
    if (Number(values.brand_id) === 0) errors.brand_id = "Brand is required.";
    if (Number(values.price) <= 0) errors.price = "Enter a price greater than zero.";
    if (!values.packaging) errors.packaging = "Packaging is required.";
    if (!values.variation) errors.variation = "Variation is required.";
    if (Number(values.weight) <= 0) errors.weight = "Enter a valid weight or unit value.";
    if (Number(values.quantity) <= 0) errors.quantity = "Enter a quantity greater than zero.";
    if (!values.stock_warning_type) errors.stock_warning_type = "Stock warning type is required.";
    if (Number(values.stock_warning) <= 0) errors.stock_warning = "Enter a warning level greater than zero.";

    return errors;
  };

  const saveProduct = (event) => {
    event.preventDefault();
    const errors = validate(product);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setAlert({
        severity: 'error',
        message: 'Please correct the highlighted fields before saving.',
        visible: true
      });
      window.scrollTo(0, 0);
      return;
    }

    setSubmitting(true);
    setAlert({ severity: '', message: '', visible: false });

    ProductServiceService.sanctum()
      .then(() => ProductServiceService.create(product))
      .then(response => {
        if (response.data.code === 200) {
          setAlert({
            severity: 'success',
            message: 'Product added successfully.',
            visible: true
          });
          setProduct(initialProduct);
          setFormErrors({});
        } else {
          setAlert({
            severity: 'error',
            message: response.data.message || 'Unable to add the product.',
            visible: true
          });
        }
        window.scrollTo(0, 0);
      })
      .catch(error => {
        console.log(error);
        setAlert({
          severity: 'error',
          message: 'Unable to add the product. Please try again.',
          visible: true
        });
        window.scrollTo(0, 0);
      })
      .finally(() => setSubmitting(false));
  };

  const variationLabel = product.variation.toLowerCase() === 'kg'
    ? 'Total weight'
    : product.variation.toLowerCase() === 'session'
      ? 'Session value'
      : 'Total units';

  const quantityLabel = product.packaging
    ? `Quantity per ${product.packaging}`
    : 'Quantity per package';

  return (
    <div className="add-product-page">
      <header className="add-product-header">
        <div>
          <Link to="/productList" className="add-product-back">
            <ArrowBackRoundedIcon /> Back to products
          </Link>
          <span className="add-product-eyebrow">Inventory catalogue</span>
          <h1>Add New Product</h1>
          <p>Create a product and configure how its packaging and low-stock warning should work.</p>
        </div>
        <div className="add-product-header__icon">
          <Inventory2OutlinedIcon />
        </div>
      </header>

      {alert.visible && (
        <Alert severity={alert.severity} className="add-product-alert">
          {alert.message}
        </Alert>
      )}

      <Form onSubmit={saveProduct} noValidate>
        <div className="add-product-layout">
          <main className="add-product-form">
            <section className="add-product-card">
              <div className="add-product-card__header">
                <span><CategoryOutlinedIcon /></span>
                <div>
                  <h2>Product details</h2>
                  <p>The identifying and pricing information customers will see.</p>
                </div>
              </div>
              <div className="add-product-fields">
                <Form.Group className="add-product-field add-product-field--wide">
                  <Form.Label>Product name <em>*</em></Form.Label>
                  <Form.Control
                    type="text"
                    name="product_name"
                    value={product.product_name}
                    onChange={updateField}
                    isInvalid={Boolean(formErrors.product_name)}
                    placeholder="e.g. All-Purpose Flour"
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.product_name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="add-product-field">
                  <Form.Label>Category <em>*</em></Form.Label>
                  <Form.Select
                    name="category_id"
                    value={product.category_id}
                    onChange={updateField}
                    isInvalid={Boolean(formErrors.category_id)}
                  >
                    <option value={0}>Select category</option>
                    {categoryList.map(category => (
                      <option value={category.id} key={category.id}>{category.category_name}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{formErrors.category_id}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="add-product-field">
                  <Form.Label>Brand <em>*</em></Form.Label>
                  <Form.Select
                    name="brand_id"
                    value={product.brand_id}
                    onChange={updateField}
                    isInvalid={Boolean(formErrors.brand_id)}
                  >
                    <option value={0}>Select brand</option>
                    {brandList.map(brand => (
                      <option value={brand.id} key={brand.id}>{brand.brand_name}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{formErrors.brand_id}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="add-product-field">
                  <Form.Label>Selling price <em>*</em></Form.Label>
                  <div className="add-product-money">
                    <span>₱</span>
                    <Form.Control
                      type="number"
                      min="0"
                      step="0.01"
                      name="price"
                      value={product.price}
                      onChange={updateField}
                      isInvalid={Boolean(formErrors.price)}
                    />
                  </div>
                  {formErrors.price && <div className="add-product-error">{formErrors.price}</div>}
                </Form.Group>
              </div>
            </section>

            <section className="add-product-card">
              <div className="add-product-card__header">
                <span><SellOutlinedIcon /></span>
                <div>
                  <h2>Packaging setup</h2>
                  <p>Define the wholesale package and the units contained inside it.</p>
                </div>
              </div>
              <div className="add-product-fields">
                <Form.Group className="add-product-field">
                  <Form.Label>Packaging <em>*</em></Form.Label>
                  <Form.Select
                    name="packaging"
                    value={product.packaging}
                    onChange={updateField}
                    isInvalid={Boolean(formErrors.packaging)}
                  >
                    <option value="">Select packaging</option>
                    <optgroup label="Product packaging">
                      <option value="Sack">Sack</option>
                      <option value="Box">Box</option>
                      <option value="Plastic">Plastic</option>
                      <option value="Galloon">Gallon</option>
                      <option value="Pack">Pack</option>
                    </optgroup>
                    <optgroup label="Training / services">
                      <option value="Service">Session</option>
                    </optgroup>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{formErrors.packaging}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="add-product-field">
                  <Form.Label>Unit variation <em>*</em></Form.Label>
                  <Form.Select
                    name="variation"
                    value={product.variation}
                    onChange={updateField}
                    isInvalid={Boolean(formErrors.variation)}
                  >
                    <option value="">Select variation</option>
                    <optgroup label="Product units">
                      <option value="kg">kg</option>
                      <option value="pcs">pcs</option>
                      <option value="pack">pack</option>
                    </optgroup>
                    <optgroup label="Training / services">
                      <option value="Session">Session</option>
                    </optgroup>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{formErrors.variation}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="add-product-field">
                  <Form.Label>{variationLabel} <em>*</em></Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="any"
                    name="weight"
                    value={product.weight}
                    onChange={updateField}
                    isInvalid={Boolean(formErrors.weight)}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.weight}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="add-product-field">
                  <Form.Label>{quantityLabel} <em>*</em></Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    name="quantity"
                    value={product.quantity}
                    onChange={updateField}
                    isInvalid={Boolean(formErrors.quantity)}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.quantity}</Form.Control.Feedback>
                </Form.Group>
              </div>
            </section>

            <section className="add-product-card">
              <div className="add-product-card__header">
                <span className="add-product-card__icon--warning"><WarningAmberRoundedIcon /></span>
                <div>
                  <h2>Stock warning</h2>
                  <p>Choose which inventory level triggers the low-stock warning.</p>
                </div>
              </div>
              <div className="add-product-fields">
                <Form.Group className="add-product-field">
                  <Form.Label>Warning type <em>*</em></Form.Label>
                  <Form.Select
                    name="stock_warning_type"
                    value={product.stock_warning_type}
                    onChange={updateField}
                    isInvalid={Boolean(formErrors.stock_warning_type)}
                  >
                    <option value="">Select warning type</option>
                    <option value="WHOLESALE">Wholesale packages</option>
                    <option value="RETAIL">Retail pieces</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{formErrors.stock_warning_type}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="add-product-field">
                  <Form.Label>Warning level <em>*</em></Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    name="stock_warning"
                    value={product.stock_warning}
                    onChange={updateField}
                    isInvalid={Boolean(formErrors.stock_warning)}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.stock_warning}</Form.Control.Feedback>
                </Form.Group>
              </div>
            </section>
          </main>

          <aside className="add-product-aside">
            <div className="add-product-preview">
              <span className="add-product-preview__label">Product preview</span>
              <div className="add-product-preview__avatar">
                {product.product_name ? product.product_name.charAt(0).toUpperCase() : 'P'}
              </div>
              <h3>{product.product_name || 'New product'}</h3>
              <p>{product.packaging || 'Packaging'} · {product.quantity || 0} {product.variation || 'units'}</p>
              <strong>{new Intl.NumberFormat('en-PH', {
                style: 'currency',
                currency: 'PHP'
              }).format(Number(product.price || 0))}</strong>
              <div className="add-product-preview__warning">
                <WarningAmberRoundedIcon />
                Warn at {product.stock_warning || 0} {product.stock_warning_type === 'RETAIL' ? 'pieces' : 'packages'}
              </div>
            </div>

            <div className="add-product-tips">
              <h3><CheckCircleOutlineRoundedIcon /> Before saving</h3>
              <ul>
                <li>Confirm the package contains the correct quantity.</li>
                <li>Choose Retail when warning by individual pieces.</li>
                <li>Choose Wholesale when warning by full packages.</li>
              </ul>
            </div>
          </aside>
        </div>

        <footer className="add-product-footer">
          <Link to="/productList">Cancel</Link>
          <Button
            variant="contained"
            type="submit"
            disabled={submitting}
            className="add-product-submit"
          >
            {submitting ? 'Saving product...' : 'Save product'}
          </Button>
          {submitting && <LinearProgress className="add-product-progress" />}
        </footer>
      </Form>
    </div>
  );
};

export default AddProduct;
