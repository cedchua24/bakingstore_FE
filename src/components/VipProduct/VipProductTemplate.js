import React, { useEffect, useState } from "react";
import VipProductService from "./VipProductService";
import VipProductTemplateForm from "./VipProductTemplateForm";
import VipProductTemplateList from "./VipProductTemplateList";

const VipProductTemplate = () => {
    const [templates, setTemplates] = useState([]);

    const fetchTemplates = () => {
        VipProductService.getAll()
            .then((response) => setTemplates(response.data))
            .catch((error) => console.log("Unable to fetch VIP Product Templates", error));
    };

    useEffect(fetchTemplates, []);

    return (
        <div>
            <VipProductTemplateForm onSaved={fetchTemplates} />
            <VipProductTemplateList templates={templates} />
        </div>
    );
};

export default VipProductTemplate;
