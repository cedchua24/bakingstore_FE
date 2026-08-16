import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import CustomerService from "./CustomerService";
import "./CustomerForm.css";

const SearchCustomer = () => {
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const searchCustomerList = (search) => {
    CustomerService.searchVipCustomerList({ search, limit: 50 })
      .then((response) => setCustomerOptions(response.data))
      .catch(() => setAlert({ severity: "error", message: "Unable to search customers." }));
  };

  useEffect(() => searchCustomerList(""), []);

  const getCustomerName = (customer) => customer
    ? customer.customer_name || `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
    : "";
  const vipColors = (customer) => customer && Array.isArray(customer.vip_customers)
    ? customer.vip_customers.map((vip) => vip.vip_color).filter(Boolean)
    : [];

  const renderVipDots = (customer) => (
    <span className="customer-vip-dots">
      {vipColors(customer).map((color, index) => (
        <span
          key={`${color}-${index}`}
          title="VIP Customer"
          style={{
            width: "15px",
            height: "15px",
            borderRadius: "50%",
            backgroundColor: color,
            border: "1px solid #ced4da",
          }}
        />
      ))}
    </span>
  );

  const fetchCustomer = () => {
    if (!selectedCustomer) {
      setResult(null);
      setAlert({ severity: "warning", message: "Please select a customer." });
      return;
    }

    setLoading(true);
    setAlert(null);
    CustomerService.get(selectedCustomer.id)
      .then((response) => {
        setResult({
          ...selectedCustomer,
          ...response.data,
          vip_customers: selectedCustomer.vip_customers || response.data.vip_customers,
        });
      })
      .catch(() => setAlert({ severity: "error", message: "Unable to fetch customer." }))
      .finally(() => setLoading(false));
  };

  const formatDate = (date) => date
    ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "2-digit" }).format(new Date(date))
    : "-";
  const initials = result
    ? `${result.first_name?.charAt(0) || ""}${result.last_name?.charAt(0) || ""}`.toUpperCase()
    : "CU";

  return (
    <div className="customer-page">
      <div className="customer-shell">
        <header className="customer-header">
          <div>
            <span className="customer-eyebrow">Customer directory</span>
            <h1>Search Customer</h1>
            <p>Find a customer and quickly open their profile, transactions, or purchased products.</p>
          </div>
          <div className="customer-header__icon"><PersonSearchOutlinedIcon /></div>
        </header>

        {alert && <Alert severity={alert.severity} className="customer-alert">{alert.message}</Alert>}

        <section className="customer-search-card">
          <div className="customer-search-row">
            <Autocomplete
              className="customer-search-input"
              options={customerOptions}
              value={selectedCustomer}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={getCustomerName}
              onInputChange={(event, value) => searchCustomerList(value)}
              onChange={(event, value) => {
                setSelectedCustomer(value);
                setResult(null);
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  <span style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: "12px" }}>
                    <span>
                      <strong>{getCustomerName(option)}</strong>
                      {option.store_name && (
                        <small style={{ display: "block", color: "#6b7587" }}>{option.store_name}</small>
                      )}
                    </span>
                    {vipColors(option).length > 0 && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        {renderVipDots(option)}
                        <small style={{ color: "#6b7587", fontWeight: 700 }}>VIP</small>
                      </span>
                    )}
                  </span>
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Search by customer name" />}
            />
            <Button
              variant="contained"
              disabled={loading}
              onClick={fetchCustomer}
              className="customer-search-button"
            >
              Search customer
            </Button>
          </div>
          {loading && <LinearProgress color="warning" style={{ marginTop: "14px" }} />}
        </section>

        {result ? (
          <section className="customer-result">
            <div className="customer-result__identity">
              <div className="customer-result__avatar">{initials || "CU"}</div>
              <h2>{getCustomerName(result)}</h2>
              {result.store_name && <p>{result.store_name}</p>}
              {vipColors(result).length > 0 && renderVipDots(result)}
            </div>
            <div className="customer-result__body">
              <div className="customer-result__grid">
                <div className="customer-result__item">
                  <span>Contact number</span>
                  <strong>{result.contact_number || "-"}</strong>
                </div>
                <div className="customer-result__item">
                  <span>Email</span>
                  <strong>{result.email || "-"}</strong>
                </div>
                <div className="customer-result__item customer-result__wide">
                  <span>Address</span>
                  <strong>{result.address || "-"}</strong>
                </div>
                <div className="customer-result__item">
                  <span>Status</span>
                  <strong>{Number(result.disabled) === 0 ? "Active" : "Disabled"}</strong>
                </div>
                <div className="customer-result__item">
                  <span>Date created</span>
                  <strong>{formatDate(result.created_at)}</strong>
                </div>
              </div>
              <div className="customer-result__actions">
                <Link to={`/customers/${result.id}`}>
                  <Button variant="outlined" startIcon={<EditOutlinedIcon />}>Edit customer</Button>
                </Link>
                <Link to={`/customers/customerTransactionList/${result.id}`}>
                  <Button variant="contained" startIcon={<ReceiptLongOutlinedIcon />}>View transactions</Button>
                </Link>
                <Link to={`/customers/customerProductList/${result.id}`}>
                  <Button variant="outlined" startIcon={<Inventory2OutlinedIcon />}>View products</Button>
                </Link>
                <Link to={`/customers/${result.id}/sales-history`}>
                  <Button variant="outlined" color="success" startIcon={<QueryStatsOutlinedIcon />}>Sales history</Button>
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <div className="customer-empty">Select a customer above to view their profile and activity.</div>
        )}
      </div>

    </div>
  );
};

export default SearchCustomer;
