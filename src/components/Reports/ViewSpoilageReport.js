import { useState, useEffect } from "react";

import { useParams } from 'react-router-dom';
import { Form } from 'react-bootstrap';

import SpoilageService from "../Spoilage/SpoilageService";


const ViewSpoilageReport = (props) => {


    const { id } = useParams();
    useEffect(() => {
        fetchProductList();
    }, []);



    const [productList, setProductList] = useState({
        data: [],
        total_cost: {},
        code: '',
        message: '',
    });

    const fetchProductList = () => {
        SpoilageService.fetchSpoilageReportByDate(id)
            .then(response => {
                setProductList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const covertDateString = (day) => {
        var d = new Date(day);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }


    return (
        <div>

            <br></br>
            <Form>
                <Form.Group className="w-15 mb-2" controlId="formBasicEmail" disabled>
                    <Form.Label>Total Spoilage: </Form.Label>
                    <Form.Control type="text" value={numberFormat(productList.total_cost.total_cost)} />
                </Form.Group>
                <br></br>
            </Form >


            <legend align="center" style={{ fontWeight: 'bold' }} > Spoilage    </legend>
            <legend align="center" style={{ fontWeight: 'bold' }} ><h6>{covertDateString(id)}  </h6></legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Unit</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Cost</th>
                        <th>Reason</th>

                    </tr>
                </thead>
                {productList.data.length == 0 ?
                    (<tr style={{ color: "red" }}>{"No Data Available"}</tr>)
                    :
                    (
                        <tbody>


                            {
                                productList.data.map((product, index) => (
                                    <tr key={product.stock_order_id} >
                                        <td>{product.stock_order_id}</td>
                                        <td>{product.product_name}</td>
                                        <td>{product.brand_name}</td>
                                        <td>{product.category_name}</td>
                                        <td>{product.pack}</td>
                                        <td>{product.pack === 'Pc' ? numberFormat(product.price / product.quantity) : numberFormat(product.price)}</td>
                                        <td>{product.stock_quantity}</td>
                                        <td>{numberFormat(product.total_cost)}</td>
                                        <td>{product.reason}</td>

                                    </tr>
                                )
                                )
                            }
                        </tbody>)}
            </table>

        </div >
    )
}

export default ViewSpoilageReport
