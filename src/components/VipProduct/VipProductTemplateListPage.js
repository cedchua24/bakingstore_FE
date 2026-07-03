import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import VipProductService from "./VipProductService";
import VipProductTemplateList from "./VipProductTemplateList";

const VipProductTemplateListPage = () => {
    const [templates, setTemplates] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        VipProductService.getAll()
            .then((response) => setTemplates(response.data))
            .catch(() => setError("Unable to fetch VIP Product Templates."));
    }, []);

    return (
        <div>
            {error && <Alert severity="error">{error}</Alert>}
            <VipProductTemplateList templates={templates} />
        </div>
    );
};

export default VipProductTemplateListPage;
