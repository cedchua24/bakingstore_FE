import React from 'react'
import { Button, Form, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";

const BrandList = (props) => {

    const brandList = props.brandList;
    const deleteBrand = props.deleteBrand;

    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Brand Name</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        brandList.map((brand, index) => (
                            <tr key={brand.id} >
                                <td>{brand.id}</td>
                                <td>{brand.brand_name}</td>
                                <td>
                                    <Link variant="primary" to={"/editBrand/" + brand.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteBrand(brand.id, e)} >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default BrandList
