import React, { useState, useEffect } from "react";
import BrandServiceService from "./BrandService.service";
import BrandList from "./BrandList";
import AddBrand from "./AddBrand";

const Brand = () => {

    useEffect(() => {
        fetchBrandList();
    }, []);

    const [brandList, setBrandList] = useState([]);

    const saveBrandDataHandler = (brand) => {
        setBrandList([...brandList, brand]);
    }


    const fetchBrandList = () => {
        BrandServiceService.getAll()
            .then(response => {
                setBrandList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteBrand = (id, e) => {

        const index = brandList.findIndex(brand => brand.id === id);
        const newBrand = [...brandList];
        newBrand.splice(index, 1);

        BrandServiceService.delete(id)
            .then(response => {
                setBrandList(newBrand);
            })
            .catch(e => {
                console.log('error', e);
            });
    }



    return (
        <div>

            <AddBrand
                onSaveBrandData={saveBrandDataHandler}
            />

            <BrandList
                brandList={brandList}
                deleteBrand={deleteBrand}
            />
        </div>
    )
}

export default Brand
