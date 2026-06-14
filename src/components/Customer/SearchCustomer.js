import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CustomerService from "./CustomerService";

const SearchCustomer = () => {
    useEffect(() => {
        searchCustomerList("");
    }, []);

    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchCustomerResultList, setSearchCustomerResultList] = useState([]);
    const [submitLoadingFetch, setSubmitLoadingFetch] = useState(false);
    const [isFetchDisabled, setIsFetchDisabled] = useState(false);
    const [validator, setValidator] = useState({
        severity: "",
        message: "",
        isShow: false
    });

    const getCustomerName = (customer) => {
        if (!customer) {
            return "";
        }

        return customer.customer_name || `${customer.first_name || ""} ${customer.last_name || ""}`.trim();
    }

    const getVipCustomerColors = (customer) => {
        if (!customer || !Array.isArray(customer.vip_customers)) {
            return [];
        }

        return customer.vip_customers
            .map(vipCustomer => vipCustomer.vip_color)
            .filter(vipColor => vipColor);
    }

    const renderVipColorDots = (customer) => {
        const vipColors = getVipCustomerColors(customer);

        if (vipColors.length === 0) {
            return null;
        }

        return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                {vipColors.map((vipColor, index) => (
                    <span
                        key={index}
                        title="VIP Customer"
                        style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "999px",
                            backgroundColor: vipColor,
                            border: "1px solid #ced4da",
                            display: "inline-block",
                            flex: "0 0 auto"
                        }}
                    ></span>
                ))}
            </span>
        );
    }

    const searchCustomerList = (search) => {
        CustomerService.searchVipCustomerList({
            search: search,
            limit: 50
        })
            .then(response => {
                setCustomerList(response.data);
            })
            .catch(e => {
                console.log("error", e);
            });
    }

    const formatStatementDate = (date) => {
        if (!date) {
            return "";
        }

        var d = new Date(date);
        return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "2-digit" }).format(d);
    }

    const searchCustomerTransaction = () => {
        if (!selectedCustomer) {
            setSearchCustomerResultList([]);
            setValidator({
                severity: "warning",
                message: "Please select a customer.",
                isShow: true
            });
            return;
        }

        setSubmitLoadingFetch(true);
        setIsFetchDisabled(true);

        CustomerService.get(selectedCustomer.id)
            .then(response => {
                setSearchCustomerResultList([{
                    ...selectedCustomer,
                    ...response.data,
                    vip_customers: selectedCustomer.vip_customers || response.data.vip_customers
                }]);
                setValidator({
                    severity: "success",
                    message: "Successfully fetched customer.",
                    isShow: true
                });
                setSubmitLoadingFetch(false);
                setIsFetchDisabled(false);
            })
            .catch(e => {
                setSubmitLoadingFetch(false);
                setIsFetchDisabled(false);
                setValidator({
                    severity: "error",
                    message: "Unable to fetch customer.",
                    isShow: true
                });
                console.log("error", e);
            });
    }

    return (
        <div>
            <Stack sx={{ width: "100%" }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>

            <legend align="center" style={{ fontWeight: "bold" }}>Search Customer</legend>
            <Form>
                <Form.Group className="mb-3" style={{ maxWidth: "560px" }} controlId="formSearchCustomer">
                    <Form.Label>Customer</Form.Label>
                    <Autocomplete
                        options={customerList}
                        value={selectedCustomer}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => getCustomerName(option)}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: "12px", width: "100%" }}>
                                    <span>{getCustomerName(option)}</span>
                                    {getVipCustomerColors(option).length > 0 &&
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                            {renderVipColorDots(option)}
                                            <span style={{ color: "#6c757d", fontSize: "11px", fontWeight: "700" }}>VIP</span>
                                        </span>
                                    }
                                </span>
                            </li>
                        )}
                        onInputChange={(event, value) => {
                            searchCustomerList(value);
                        }}
                        onChange={(event, value) => {
                            setSelectedCustomer(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search Customer"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            {selectedCustomer &&
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginRight: "10px" }}>
                                                    {renderVipColorDots(selectedCustomer)}
                                                    {getVipCustomerColors(selectedCustomer).length > 0 &&
                                                        <span style={{ color: "#495057", fontSize: "11px", fontWeight: "700" }}>VIP</span>
                                                    }
                                                </span>
                                            }
                                            {params.InputProps.startAdornment}
                                        </>
                                    )
                                }}
                            />
                        )}
                    />
                </Form.Group>
                <Button variant="primary" disabled={isFetchDisabled} onClick={searchCustomerTransaction}>
                    Search
                </Button>
                <br></br>
                <br></br>
                {submitLoadingFetch &&
                    <LinearProgress color="warning" />
                }
            </Form>
            <br></br>

            <legend align="center" style={{ fontWeight: "bold" }}>Customer Result</legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Contact Number</th>
                        <th>Store Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>VIP</th>
                        <th>FB Ads</th>
                        <th>Active</th>
                        <th>Date Created</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {searchCustomerResultList.length === 0 ?
                        (
                            <tr>
                                <td colSpan="13" style={{ color: "red" }}>No Data Available</td>
                            </tr>
                        )
                        :
                        searchCustomerResultList.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.first_name}</td>
                                <td>{customer.last_name}</td>
                                <td>{customer.contact_number}</td>
                                <td>{customer.store_name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.address}</td>
                                <td>{renderVipColorDots(customer)}</td>
                                <td>{customer.ads === 1 ? <CheckIcon style={{ color: "green" }} /> : <CloseIcon style={{ color: "red" }} />}</td>
                                <td>{customer.disabled === 0 ? <CheckIcon style={{ color: "green" }} /> : <CloseIcon style={{ color: "red" }} />}</td>
                                <td>{formatStatementDate(customer.created_at)}</td>
                                <td>
                                    <Link variant="primary" to={"/customers/customerTransactionList/" + customer.id}>
                                        <Button variant="primary">
                                            View Transaction
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Link variant="primary" to={"/customers/customerProductList/" + customer.id}>
                                        <Button variant="primary">
                                            View Products
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default SearchCustomer
