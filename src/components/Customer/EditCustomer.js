import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CustomerService from "./CustomerService";
import "./CustomerForm.css";

const emptyCustomer = {
  id: 0,
  first_name: "",
  last_name: "",
  store_name: "",
  contact_number: "",
  email: "",
  address: "",
  ads: 0,
  disabled: 0,
};

const EditCustomer = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(emptyCustomer);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setLoading(true);
    CustomerService.get(id)
      .then((response) => setCustomer({ ...emptyCustomer, ...response.data }))
      .catch(() => setAlert({ severity: "error", message: "Unable to load customer." }))
      .finally(() => setLoading(false));
  }, [id]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setCustomer((current) => ({
      ...current,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
    setFormErrors((current) => ({ ...current, [name]: undefined }));
  };

  const saveCustomer = (event) => {
    event.preventDefault();
    const errors = {};
    if (!customer.first_name.trim()) errors.first_name = "First name is required.";
    if (!customer.last_name.trim()) errors.last_name = "Last name is required.";
    setFormErrors(errors);
    if (Object.keys(errors).length) {
      setAlert({ severity: "error", message: "Please complete the required fields." });
      return;
    }

    setSubmitting(true);
    setAlert(null);
    CustomerService.update(customer.id, customer)
      .then((response) => {
        setCustomer((current) => ({ ...current, ...response.data }));
        setAlert({ severity: "success", message: "Customer updated successfully." });
        window.scrollTo(0, 0);
      })
      .catch(() => setAlert({ severity: "error", message: "Unable to update customer." }))
      .finally(() => setSubmitting(false));
  };

  const name = `${customer.first_name} ${customer.last_name}`.trim();
  const initials = `${customer.first_name.charAt(0)}${customer.last_name.charAt(0)}`.toUpperCase() || "CU";

  return (
    <div className="customer-page">
      <div className="customer-shell">
        <header className="customer-header">
          <div>
            <Link to="/customerListV2" className="customer-back">
              <ArrowBackRoundedIcon /> Back to customers
            </Link>
            <span className="customer-eyebrow">Customer directory</span>
            <h1>Edit Customer</h1>
            <p>Update identity, contact details, preferences, and account availability.</p>
          </div>
          <div className="customer-header__icon"><PersonOutlineRoundedIcon /></div>
        </header>

        {loading && <LinearProgress color="warning" className="customer-alert" />}
        {alert && <Alert severity={alert.severity} className="customer-alert">{alert.message}</Alert>}

        {!loading && (
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
                        value={customer.first_name || ""}
                        onChange={updateField}
                        isInvalid={Boolean(formErrors.first_name)}
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.first_name}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="customer-field">
                      <Form.Label>Last name <em>*</em></Form.Label>
                      <Form.Control
                        name="last_name"
                        value={customer.last_name || ""}
                        onChange={updateField}
                        isInvalid={Boolean(formErrors.last_name)}
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.last_name}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="customer-field customer-field--wide">
                      <Form.Label>Store name</Form.Label>
                      <Form.Control name="store_name" value={customer.store_name || ""} onChange={updateField} />
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
                        value={customer.contact_number || ""}
                        onChange={updateField}
                      />
                    </Form.Group>
                    <Form.Group className="customer-field">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={customer.email || ""}
                        onChange={updateField}
                      />
                    </Form.Group>
                    <Form.Group className="customer-field customer-field--wide">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="address"
                        value={customer.address || ""}
                        onChange={updateField}
                      />
                    </Form.Group>
                  </div>
                </section>

                <section className="customer-card">
                  <div className="customer-card__header">
                    <span><SettingsOutlinedIcon /></span>
                    <div>
                      <h2>Preferences and status</h2>
                      <p>Manage marketing consent and customer availability.</p>
                    </div>
                  </div>
                  <div className="customer-fields">
                    <Form.Group className="customer-field">
                      <Form.Check
                        type="switch"
                        id="edit-customer-ads"
                        name="ads"
                        checked={Number(customer.ads) === 1}
                        onChange={updateField}
                        label="Include in Facebook Ads audience"
                      />
                    </Form.Group>
                    <Form.Group className="customer-field">
                      <Form.Check
                        type="switch"
                        id="edit-customer-disabled"
                        name="disabled"
                        checked={Number(customer.disabled) !== 0}
                        onChange={updateField}
                        label="Disable this customer"
                      />
                    </Form.Group>
                  </div>
                </section>
              </main>

              <aside className="customer-aside">
                <div className="customer-preview">
                  <span className="customer-preview__label">Customer preview</span>
                  <div className="customer-preview__avatar">{initials}</div>
                  <h3>{name || "Customer"}</h3>
                  <p>{customer.store_name || "No store name"}</p>
                  <p>{customer.contact_number || "No contact number"}</p>
                  <span className="customer-preview__tag">
                    {Number(customer.disabled) === 0 ? "Active customer" : "Disabled customer"}
                  </span>
                </div>
              </aside>
            </div>

            <footer className="customer-footer">
              <Link to="/customerListV2">Cancel</Link>
              <Button type="submit" variant="contained" disabled={submitting} className="customer-submit">
                {submitting ? "Updating customer..." : "Update customer"}
              </Button>
              {submitting && <LinearProgress className="customer-progress" />}
            </footer>
          </Form>
        )}
      </div>
    </div>
  );
};

export default EditCustomer;
