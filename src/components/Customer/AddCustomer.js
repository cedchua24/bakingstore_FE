import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CustomerService from "./CustomerService";
import "./CustomerForm.css";

const emptyCustomer = {
  id: 0,
  first_name: "",
  last_name: "",
  store_name: "",
  contact_number: "",
  email: "",
  ads: 0,
  user_id: localStorage.getItem("auth_user_id"),
  address: "",
  updated_at: "",
};

const AddCustomer = ({ onSaveCustomerData }) => {
  const [customer, setCustomer] = useState(emptyCustomer);
  const [customerList, setCustomerList] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchCustomerList = () => {
    CustomerService.getAll()
      .then((response) => setCustomerList(response.data))
      .catch(() => setAlert({ severity: "error", message: "Unable to fetch customers." }));
  };

  useEffect(fetchCustomerList, []);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setCustomer((current) => ({
      ...current,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
    setFormErrors((current) => ({ ...current, [name]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!customer.first_name.trim()) errors.first_name = "First name is required.";
    if (!customer.last_name.trim()) errors.last_name = "Last name is required.";
    return errors;
  };

  const saveCustomer = (event) => {
    event.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length) {
      setAlert({ severity: "error", message: "Please complete the required fields." });
      return;
    }

    setSubmitting(true);
    setAlert(null);
    CustomerService.sanctum()
      .then(() => CustomerService.create(customer))
      .then((response) => {
        setAlert({
          severity: "success",
          message: response.data.message || "Customer added successfully.",
        });
        setCustomer({ ...emptyCustomer, user_id: localStorage.getItem("auth_user_id") });
        fetchCustomerList();
        if (onSaveCustomerData) onSaveCustomerData(response.data);
        window.scrollTo(0, 0);
      })
      .catch(() => setAlert({
        severity: "error",
        message: "Unable to add customer. The customer may already exist.",
      }))
      .finally(() => setSubmitting(false));
  };

  const customerName = `${customer.first_name} ${customer.last_name}`.trim();
  const initials = `${customer.first_name.charAt(0)}${customer.last_name.charAt(0)}`.toUpperCase() || "CU";
  const formatDate = (date) => date
    ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(date))
    : "-";

  return (
    <div className="customer-page">
      <div className="customer-shell">
        <header className="customer-header">
          <div>
            <span className="customer-eyebrow">Customer directory</span>
            <h1>Add Customer</h1>
            <p>Create a customer profile for orders, communication, and marketing preferences.</p>
          </div>
          <div className="customer-header__icon"><PersonAddAltOutlinedIcon /></div>
        </header>

        {alert && (
          <Alert severity={alert.severity} className="customer-alert">{alert.message}</Alert>
        )}

        <Form onSubmit={saveCustomer} noValidate>
          <div className="customer-layout">
            <main>
              <section className="customer-card">
                <div className="customer-card__header">
                  <span><BadgeOutlinedIcon /></span>
                  <div>
                    <h2>Customer identity</h2>
                    <p>The customer name and associated store.</p>
                  </div>
                </div>
                <div className="customer-fields">
                  <Form.Group className="customer-field">
                    <Form.Label>First name <em>*</em></Form.Label>
                    <Form.Control
                      name="first_name"
                      value={customer.first_name}
                      onChange={updateField}
                      isInvalid={Boolean(formErrors.first_name)}
                      placeholder="First name"
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.first_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="customer-field">
                    <Form.Label>Last name <em>*</em></Form.Label>
                    <Form.Control
                      name="last_name"
                      value={customer.last_name}
                      onChange={updateField}
                      isInvalid={Boolean(formErrors.last_name)}
                      placeholder="Last name"
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.last_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="customer-field customer-field--wide">
                    <Form.Label>Store name</Form.Label>
                    <Form.Control
                      name="store_name"
                      value={customer.store_name}
                      onChange={updateField}
                      placeholder="Business or store name"
                    />
                  </Form.Group>
                </div>
              </section>

              <section className="customer-card">
                <div className="customer-card__header">
                  <span><ContactPhoneOutlinedIcon /></span>
                  <div>
                    <h2>Contact information</h2>
                    <p>Ways to reach and deliver orders to this customer.</p>
                  </div>
                </div>
                <div className="customer-fields">
                  <Form.Group className="customer-field">
                    <Form.Label>Contact number</Form.Label>
                    <Form.Control
                      name="contact_number"
                      value={customer.contact_number}
                      onChange={updateField}
                      placeholder="Contact number"
                    />
                  </Form.Group>
                  <Form.Group className="customer-field">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={updateField}
                      placeholder="customer@example.com"
                    />
                  </Form.Group>
                  <Form.Group className="customer-field customer-field--wide">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={customer.address}
                      onChange={updateField}
                      placeholder="Complete delivery address"
                    />
                  </Form.Group>
                  <Form.Group className="customer-field customer-field--wide">
                    <Form.Check
                      type="switch"
                      id="add-customer-ads"
                      name="ads"
                      checked={Number(customer.ads) === 1}
                      onChange={updateField}
                      label="Include in Facebook Ads audience"
                    />
                  </Form.Group>
                </div>
              </section>
            </main>

            <aside className="customer-aside">
              <div className="customer-preview">
                <span className="customer-preview__label">Customer preview</span>
                <div className="customer-preview__avatar">{initials}</div>
                <h3>{customerName || "New customer"}</h3>
                <p>{customer.store_name || "No store name"}</p>
                <p>{customer.contact_number || "No contact number"}</p>
                <span className="customer-preview__tag">
                  {Number(customer.ads) === 1 ? "Ads enabled" : "Ads disabled"}
                </span>
              </div>
            </aside>
          </div>

          <footer className="customer-footer">
            <Button type="submit" variant="contained" disabled={submitting} className="customer-submit">
              {submitting ? "Saving customer..." : "Save customer"}
            </Button>
            {submitting && <LinearProgress className="customer-progress" />}
          </footer>
        </Form>

        <section className="customer-list-card">
          <h2>Customer List</h2>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead>
                <tr className="table-secondary">
                  <th>#</th><th>Name</th><th>Store</th><th>Contact</th><th>Email</th>
                  <th>Address</th><th>Ads</th><th>Status</th><th>Date</th><th></th>
                </tr>
              </thead>
              <tbody>
                {customerList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{`${item.first_name || ""} ${item.last_name || ""}`.trim()}</td>
                    <td>{item.store_name}</td>
                    <td>{item.contact_number}</td>
                    <td>{item.email}</td>
                    <td>{item.address}</td>
                    <td>{Number(item.ads) === 1
                      ? <CheckIcon style={{ color: "green" }} />
                      : <CloseIcon style={{ color: "red" }} />}</td>
                    <td>{Number(item.disabled) === 0
                      ? <CheckIcon style={{ color: "green" }} />
                      : <CloseIcon style={{ color: "red" }} />}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>
                      <Link to={`/customers/${item.id}`}>
                        <Button size="small" variant="outlined">Update</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddCustomer;
