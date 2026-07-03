import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import VipProductList from "./VipProductList";
import VipProductService from "./VipProductService";
import VipProductTransactionService from "./VipProductTransactionService";

const VipProductListPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [templateId, setTemplateId] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const fetchTransactions = (id = "") => {
        setLoading(true);
        const request = id
            ? VipProductTransactionService.fetchVipTransactionByVipId(id)
            : VipProductTransactionService.getAll();
        request
            .then((response) => {
                setTransactions(response.data);
                setAlert({ severity: "success", message: "VIP Product List fetched successfully." });
            })
            .catch(() => setAlert({ severity: "error", message: "Unable to fetch VIP Product List." }))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTransactions();
        VipProductService.getAll()
            .then((response) => setTemplates(response.data))
            .catch(() => setAlert({ severity: "error", message: "Unable to fetch VIP Product Templates." }));
    }, []);

    const deleteTransaction = (id) => {
        VipProductTransactionService.delete(id)
            .then(() => setTransactions(transactions.filter((item) => item.id !== id)))
            .catch(() => setAlert({ severity: "error", message: "Unable to delete VIP Product." }));
    };

    return (
        <div>
            {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
            <br />
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>VIP Product Template</Form.Label>
                    <Form.Select value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
                        <option value="">All VIP Products</option>
                        {templates.map((template) => (
                            <option key={template.id} value={template.id}>{template.vip_product_name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Button disabled={loading} onClick={() => fetchTransactions(templateId)}>Search</Button>
                <br /><br />
                {loading && <LinearProgress color="warning" />}
            </Form>
            <br />
            <VipProductList transactions={transactions} onDelete={deleteTransaction} />
        </div>
    );
};

export default VipProductListPage;
