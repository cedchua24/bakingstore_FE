import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const ShopList = (props) => {

    const shopList = props.shopList;
    const deleteShop = props.deleteShop;

    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Shop Name</th>
                        <th>Shop Details</th>
                        <th>View Stock</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        shopList.map((shop, index) => (
                            <tr key={shop.id} >
                                <td>{shop.id}</td>
                                <td>{shop.shop_name}</td>
                                <td>{shop.shop_type_description}</td>
                                <td>
                                    <Link variant="primary" to={"/shopStock/" + shop.id}   >
                                        <Button variant="primary" >
                                            Show
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Link variant="primary" to={"/editShop/" + shop.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
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

export default ShopList
