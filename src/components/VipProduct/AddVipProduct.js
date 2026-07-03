import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ProductService from "../Product/ProductService.service";
import VipProductService from "./VipProductService";
import VipProductTransactionService from "./VipProductTransactionService";

const AddVipProduct = ({ onSaved }) => {
    const [transaction, setTransaction] = useState({ vip_product_id: "", product_id: "" });
    const [templates, setTemplates] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        VipProductService.getAll()
            .then((response) => setTemplates(response.data.filter((item) => Number(item.status) === 0)))
            .catch(() => setAlert({ severity: "error", message: "Unable to fetch VIP Product Templates." }));
        searchProductList("");
    }, []);

    const searchProductList = (search) => {
        ProductService.searchProductByName({
            search,
            limit: 50,
        })
            .then((response) => setProducts(response.data))
            .catch(() => setAlert({ severity: "error", message: "Unable to search Products." }));
    };

    const getVipProducts = (product) => (
        product && Array.isArray(product.vip_products) ? product.vip_products : []
    );

    const renderVipProductBadges = (product) => {
        const vipProducts = getVipProducts(product);
        if (!vipProducts.length) return null;

        return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                {vipProducts.map((vipProduct, index) => (
                    <span
                        key={`${vipProduct.vip_product_name}-${index}`}
                        title={vipProduct.vip_product_name}
                        style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "999px",
                            backgroundColor: vipProduct.vip_color || "#6c757d",
                            border: "1px solid #ced4da",
                            display: "inline-block",
                            flex: "0 0 auto",
                        }}
                    />
                ))}
            </span>
        );
    };

    const save = () => {
        const validationErrors = {};
        if (!transaction.vip_product_id) validationErrors.vip_product_id = "VIP Product Template is required.";
        if (!transaction.product_id) validationErrors.product_id = "Product is required.";
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length) return;

        setLoading(true);
        VipProductTransactionService.sanctum()
            .then(() => VipProductTransactionService.create(transaction))
            .then(() => {
                setTransaction({ vip_product_id: "", product_id: "" });
                setSelectedTemplate(null);
                setSelectedProduct(null);
                searchProductList("");
                setAlert({ severity: "success", message: "VIP Product added successfully." });
                if (onSaved) onSaved();
            })
            .catch(() => setAlert({ severity: "error", message: "Unable to save VIP Product." }))
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <Stack sx={{ width: "100%" }} spacing={2}>
                {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
            </Stack>
            <br />
            <Form>
                {errors.vip_product_id && <p style={{ color: "red" }}>{errors.vip_product_id}</p>}
                <Form.Group className="mb-3" style={{ maxWidth: "560px" }}>
                    <Form.Label>VIP Product Template *</Form.Label>
                    <Autocomplete
                        options={templates}
                        value={selectedTemplate}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => option.vip_product_name || ""}
                        onChange={(event, value) => {
                            setSelectedTemplate(value);
                            setTransaction({ ...transaction, vip_product_id: value ? value.id : "" });
                        }}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <span style={{
                                    width: "16px",
                                    height: "16px",
                                    borderRadius: "4px",
                                    backgroundColor: option.vip_color || "#6c757d",
                                    border: "1px solid #ced4da",
                                    marginRight: "8px",
                                }} />
                                {option.vip_product_name}
                            </li>
                        )}
                        renderInput={(params) => <TextField {...params} label="Select VIP Product Template" />}
                    />
                </Form.Group>
                {errors.product_id && <p style={{ color: "red" }}>{errors.product_id}</p>}
                <Form.Group className="mb-3" style={{ maxWidth: "560px" }}>
                    <Form.Label>Product *</Form.Label>
                    <Autocomplete
                        options={products}
                        value={selectedProduct}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => option.product_name || ""}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <span style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "12px",
                                    width: "100%",
                                }}>
                                    <span>{option.product_name}</span>
                                    {getVipProducts(option).length > 0 &&
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                            {renderVipProductBadges(option)}
                                            <span style={{ color: "#6c757d", fontSize: "11px", fontWeight: "700" }}>VIP</span>
                                        </span>
                                    }
                                </span>
                            </li>
                        )}
                        onInputChange={(event, value) => searchProductList(value)}
                        onChange={(event, value) => {
                            setSelectedProduct(value);
                            setTransaction({ ...transaction, product_id: value ? value.id : "" });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search Product"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            {selectedProduct &&
                                                <span style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                    marginRight: "10px",
                                                }}>
                                                    {renderVipProductBadges(selectedProduct)}
                                                    {getVipProducts(selectedProduct).length > 0 &&
                                                        <span style={{ color: "#495057", fontSize: "11px", fontWeight: "700" }}>VIP</span>
                                                    }
                                                </span>
                                            }
                                            {params.InputProps.startAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                </Form.Group>
                <Button disabled={loading} onClick={save}>Submit</Button>
                <br /><br />
                {loading && <LinearProgress color="warning" />}
            </Form>
            <br />
        </div>
    );
};

export default AddVipProduct;
