import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

import ProductServiceService from "./ProductService.service";
import BrandServiceService from "../Brand/BrandService.service";
import CategoryServiceService from "../Category/CategoryService.service";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

import "./AddProduct.css";

const initialProduct = {
  id: 0,
  category_id: 0,
  category_name: "",
  brand_id: 0,
  brand_name: "",
  product_name: "",
  price: 0,
  sale_price: 0,
  stock: 0,
  stock_pc: 0,
  weight: 0,
  quantity: 0,
  variation: "",
  packaging: "",
  stock_warning: 0,
  stock_warning_type: "",
  note: "",
  disabled: 0,
};

const EditProduct = () => {
  const { id } = useParams();
  const isAdmin = Number(localStorage.getItem("role_as")) === 2;
  const [product, setProduct] = useState(initialProduct);
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ severity: "", message: "", visible: false });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      ProductServiceService.get(id),
      BrandServiceService.getAll(),
      CategoryServiceService.getAll(),
    ])
      .then(([productResponse, brandResponse, categoryResponse]) => {
        setProduct({ ...initialProduct, ...productResponse.data });
        setBrandList(brandResponse.data);
        setCategoryList(categoryResponse.data);
      })
      .catch((error) => {
        console.log("error", error);
        setAlert({
          severity: "error",
          message: "Unable to load the product. Please try again.",
          visible: true,
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    if (name === "price" && !isAdmin) return;

    setProduct((current) => ({
      ...current,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const updateProduct = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setAlert({ severity: "", message: "", visible: false });

    ProductServiceService.update(product.id, product)
      .then((response) => {
        const updatedProduct = response.data && response.data.id
          ? response.data
          : product;
        setProduct((current) => ({ ...current, ...updatedProduct }));
        setAlert({
          severity: "success",
          message: "Product updated successfully.",
          visible: true,
        });
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.log(error);
        setAlert({
          severity: "error",
          message: "Unable to update the product. Please try again.",
          visible: true,
        });
        window.scrollTo(0, 0);
      })
      .finally(() => setSubmitting(false));
  };

  const packageQuantity = Number(product.quantity || 0);
  const retailPrice = packageQuantity > 0
    ? Number(product.price || 0) / packageQuantity
    : 0;
  const retailSalePrice = packageQuantity > 0
    ? Number(product.sale_price || 0) / packageQuantity
    : 0;
  const quantityLabel = product.packaging
    ? `Quantity per ${product.packaging}`
    : "Quantity per package";
  const variationLabel = String(product.variation || "").toLowerCase() === "kg"
    ? "Total weight"
    : String(product.variation || "").toLowerCase() === "session"
      ? "Session value"
      : "Total units";
  const currency = (value) => new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(value || 0));

  return (
    <div className="add-product-page">
      <header className="add-product-header">
        <div>
          <Link to="/productList" className="add-product-back">
            <ArrowBackRoundedIcon /> Back to products
          </Link>
          <span className="add-product-eyebrow">Inventory catalogue</span>
          <h1>Edit Product</h1>
          <p>Update product information, packaging, pricing, and inventory warning settings.</p>
        </div>
        <div className="add-product-header__icon">
          <EditOutlinedIcon />
        </div>
      </header>

      {loading && <LinearProgress className="add-product-alert" color="warning" />}

      {alert.visible && (
        <Alert severity={alert.severity} className="add-product-alert">
          {alert.message}
        </Alert>
      )}

      {!loading && (
        <Form onSubmit={updateProduct}>
          <div className="add-product-layout">
            <main className="add-product-form">
              <section className="add-product-card">
                <div className="add-product-card__header">
                  <span><CategoryOutlinedIcon /></span>
                  <div>
                    <h2>Product details</h2>
                    <p>Manage the product identity, category, brand, and selling prices.</p>
                  </div>
                </div>
                <div className="add-product-fields">
                  <Form.Group className="add-product-field add-product-field--wide">
                    <Form.Label>Product name</Form.Label>
                    <Form.Control
                      type="text"
                      name="product_name"
                      value={product.product_name || ""}
                      onChange={updateField}
                    />
                  </Form.Group>

                  <Form.Group className="add-product-field">
                    <Form.Label>Category</Form.Label>
                    <Form.Select name="category_id" value={product.category_id} onChange={updateField}>
                      <option value={0}>Select category</option>
                      {categoryList.map((category) => (
                        <option key={category.id} value={category.id}>{category.category_name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="add-product-field">
                    <Form.Label>Brand</Form.Label>
                    <Form.Select name="brand_id" value={product.brand_id} onChange={updateField}>
                      <option value={0}>Select brand</option>
                      {brandList.map((brand) => (
                        <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="add-product-field">
                    <Form.Label>Wholesale price</Form.Label>
                    <div className="add-product-money">
                      <span>₱</span>
                      <Form.Control
                        type="number"
                        min="0"
                        step="0.01"
                        name="price"
                        value={product.price}
                        onChange={updateField}
                        disabled={!isAdmin}
                      />
                    </div>
                    {!isAdmin && <Form.Text>Only administrators can change this price.</Form.Text>}
                    {packageQuantity > 1 && (
                      <Form.Text>{currency(retailPrice)} per {product.variation || "unit"}</Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group className="add-product-field">
                    <Form.Label>Sale price</Form.Label>
                    <div className="add-product-money">
                      <span>₱</span>
                      <Form.Control
                        type="number"
                        min="0"
                        step="0.01"
                        name="sale_price"
                        value={product.sale_price || 0}
                        onChange={updateField}
                      />
                    </div>
                    {Number(product.sale_price || 0) > 0 && packageQuantity > 1 && (
                      <Form.Text>{currency(retailSalePrice)} per {product.variation || "unit"}</Form.Text>
                    )}
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
                    <Form.Label>Packaging</Form.Label>
                    <Form.Select name="packaging" value={product.packaging || ""} onChange={updateField}>
                      <option value="">Select packaging</option>
                      <optgroup label="Product packaging">
                        <option value="Sack">Sack</option>
                        <option value="Box">Box</option>
                        <option value="Plastic">Plastic</option>
                        <option value="Galloon">Gallon</option>
                        <option value="Pack">Pack</option>
                      </optgroup>
                      <optgroup label="Training / services">
                        <option value="Session">Session</option>
                      </optgroup>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="add-product-field">
                    <Form.Label>Unit variation</Form.Label>
                    <Form.Select name="variation" value={product.variation || ""} onChange={updateField}>
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
                  </Form.Group>

                  <Form.Group className="add-product-field">
                    <Form.Label>{variationLabel}</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="any"
                      name="weight"
                      value={product.weight}
                      onChange={updateField}
                    />
                  </Form.Group>

                  <Form.Group className="add-product-field">
                    <Form.Label>{quantityLabel}</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      name="quantity"
                      value={product.quantity}
                      onChange={updateField}
                    />
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
                    <Form.Label>Warning type</Form.Label>
                    <Form.Select
                      name="stock_warning_type"
                      value={product.stock_warning_type || ""}
                      onChange={updateField}
                    >
                      <option value="">Select warning type</option>
                      <option value="WHOLESALE">Wholesale packages</option>
                      <option value="RETAIL">Retail pieces</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="add-product-field">
                    <Form.Label>Warning level</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      name="stock_warning"
                      value={product.stock_warning}
                      onChange={updateField}
                    />
                  </Form.Group>
                </div>
              </section>

              <section className="add-product-card">
                <div className="add-product-card__header">
                  <span><NotesOutlinedIcon /></span>
                  <div>
                    <h2>Notes and availability</h2>
                    <p>Add internal context and control whether this product is available.</p>
                  </div>
                </div>
                <div className="add-product-fields">
                  <Form.Group className="add-product-field add-product-field--wide">
                    <Form.Label>Internal note</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="note"
                      value={product.note || ""}
                      onChange={updateField}
                      placeholder="Add an optional product note"
                    />
                  </Form.Group>

                  <Form.Group className="add-product-field add-product-field--wide">
                    <Form.Check
                      type="switch"
                      id="edit-product-disabled"
                      name="disabled"
                      checked={Number(product.disabled) !== 0}
                      onChange={updateField}
                      label="Disable this product"
                    />
                    <Form.Text>Disabled products are kept in records but cannot be used normally.</Form.Text>
                  </Form.Group>
                </div>
              </section>
            </main>

            <aside className="add-product-aside">
              <div className="add-product-preview">
                <span className="add-product-preview__label">Product preview</span>
                <div className="add-product-preview__avatar">
                  {product.product_name ? product.product_name.charAt(0).toUpperCase() : "P"}
                </div>
                <h3>{product.product_name || "Product"}</h3>
                <p>{product.packaging || "Packaging"} · {product.quantity || 0} {product.variation || "units"}</p>
                <strong>{currency(product.price)}</strong>
                <div className="add-product-preview__warning">
                  <WarningAmberRoundedIcon />
                  Warn at {product.stock_warning || 0} {product.stock_warning_type === "RETAIL" ? "pieces" : "packages"}
                </div>
              </div>

              <div className="add-product-tips">
                <h3><CheckCircleOutlineRoundedIcon /> Inventory snapshot</h3>
                <ul>
                  <li>{Number(product.stock || 0).toLocaleString()} wholesale packages in stock.</li>
                  <li>{Number(product.stock_pc || 0).toLocaleString()} retail pieces in stock.</li>
                  <li>Product is currently {Number(product.disabled) === 0 ? "active" : "disabled"}.</li>
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
              {submitting ? "Updating product..." : "Update product"}
            </Button>
            {submitting && <LinearProgress className="add-product-progress" />}
          </footer>
        </Form>
      )}
    </div>
  );
};

export default EditProduct;
