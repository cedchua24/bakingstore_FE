import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CustomerService from "./CustomerService";
import "./CustomerForm.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({ dateFrom: "", dateTo: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [sourceCustomer, setSourceCustomer] = useState(null);
  const [replacementCustomer, setReplacementCustomer] = useState(null);
  const [replacementOptions, setReplacementOptions] = useState([]);
  const [transferError, setTransferError] = useState("");

  const fetchCustomers = (dateFilters = filters) => {
    setLoading(true);
    CustomerService.fetchCustomerByDate(dateFilters)
      .then((response) => setCustomers(response.data))
      .catch(() => setAlert({ severity: "error", message: "Unable to fetch customers." }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    CustomerService.fetchCustomerByDate({})
      .then((response) => setCustomers(response.data))
      .catch(() => setAlert({ severity: "error", message: "Unable to fetch customers." }))
      .finally(() => setLoading(false));
  }, []);

  const openTransfer = (customer) => {
    setSourceCustomer(customer);
    setReplacementCustomer(null);
    setTransferError("");
    setTransferOpen(true);
    CustomerService.fetchCustomerToDelete(customer.id)
      .then((response) => setReplacementOptions(response.data))
      .catch(() => setTransferError("Unable to fetch replacement customers."));
  };

  const transferAndDelete = () => {
    if (!replacementCustomer) {
      setTransferError("Choose a customer to receive the transferred records.");
      return;
    }

    setLoading(true);
    CustomerService.updateAndDeleteCustomer({
      ...sourceCustomer,
      customer_id: replacementCustomer.id,
    })
      .then(() => {
        setTransferOpen(false);
        setAlert({ severity: "success", message: "Customer records transferred and customer deleted." });
        fetchCustomers();
      })
      .catch(() => setTransferError("Unable to transfer and delete this customer."))
      .finally(() => setLoading(false));
  };

  const formatDate = (date) => date
    ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(date))
    : "-";
  const getName = (customer) => `${customer.first_name || ""} ${customer.last_name || ""}`.trim();

  return (
    <div className="customer-page">
      <div className="customer-shell">
        <header className="customer-header">
          <div>
            <span className="customer-eyebrow">Customer directory</span>
            <h1>Customer List</h1>
            <p>Review customer profiles, filter registrations, and manage account records.</p>
          </div>
          <div className="customer-header__icon"><PeopleAltOutlinedIcon /></div>
        </header>

        {alert && <Alert severity={alert.severity} className="customer-alert">{alert.message}</Alert>}

        <section className="customer-list-card">
          <div className="customer-list-header">
            <div>
              <h2>All Customers</h2>
              <p>Use the registration dates to narrow the customer list.</p>
            </div>
            <div className="customer-count">
              <strong>{customers.length}</strong>
              <span>Customers</span>
            </div>
          </div>

          <Form
            className="customer-filter"
            onSubmit={(event) => {
              event.preventDefault();
              fetchCustomers(filters);
            }}
          >
            <Form.Group className="customer-field">
              <Form.Label>Date from</Form.Label>
              <Form.Control
                type="date"
                value={filters.dateFrom}
                onChange={(event) => setFilters({ ...filters, dateFrom: event.target.value })}
              />
            </Form.Group>
            <Form.Group className="customer-field">
              <Form.Label>Date to</Form.Label>
              <Form.Control
                type="date"
                value={filters.dateTo}
                onChange={(event) => setFilters({ ...filters, dateTo: event.target.value })}
              />
            </Form.Group>
            <Button type="submit" variant="contained" disabled={loading} className="customer-filter-button">
              Find customers
            </Button>
          </Form>

          {loading && <LinearProgress color="warning" style={{ marginBottom: "12px" }} />}

          <div className="table-responsive">
            <table className="table table-sm table-bordered table-hover align-middle">
              <thead>
                <tr className="table-secondary">
                  <th>ID</th><th>Customer</th><th>Contact</th><th>Email</th><th>Address</th>
                  <th>Active</th><th>Registered</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length ? customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td className="customer-name-cell">
                      <strong>{getName(customer)}</strong>
                      {customer.store_name && <span>{customer.store_name}</span>}
                    </td>
                    <td>{customer.contact_number || "-"}</td>
                    <td>{customer.email || "-"}</td>
                    <td>{customer.address || "-"}</td>
                    <td>{Number(customer.disabled) === 0
                      ? <CheckIcon style={{ color: "green" }} />
                      : <CloseIcon style={{ color: "red" }} />}</td>
                    <td>{formatDate(customer.created_at)}</td>
                    <td>
                      <div className="customer-table-actions">
                        <Link to={`/customers/${customer.id}`}>
                          <Button size="small" variant="outlined" startIcon={<EditOutlinedIcon />}>Update</Button>
                        </Link>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<DeleteOutlineRoundedIcon />}
                          onClick={() => openTransfer(customer)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="8" className="text-center text-muted py-4">No customers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Modal open={transferOpen} onClose={() => setTransferOpen(false)}>
        <div className="customer-transfer-modal">
          <h2>Delete and transfer customer</h2>
          <p>
            Transfer records from <strong>{sourceCustomer ? getName(sourceCustomer) : ""}</strong> before deleting.
          </p>
          {transferError && <Alert severity="error" style={{ marginBottom: "12px" }}>{transferError}</Alert>}
          <Autocomplete
            options={replacementOptions}
            value={replacementCustomer}
            onChange={(event, value) => {
              setReplacementCustomer(value);
              setTransferError("");
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => `${getName(option)}${option.store_name ? ` · ${option.store_name}` : ""}`}
            renderInput={(params) => <TextField {...params} label="Transfer records to" />}
          />
          <div className="customer-transfer-actions">
            <Button onClick={() => setTransferOpen(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={transferAndDelete} disabled={loading}>
              Transfer and delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerList;
