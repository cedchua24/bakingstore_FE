import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const MarkUpPriceList = (props) => {

    const markupPriceList = props.markupPriceList;
    const deleteMarkUpPrice = props.deleteMarkUpPrice;

    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Product Name </th>
                        <th>Warehouse Name </th>
                        <th>Supplier Price </th>
                        {/* <th>Mark Up Type</th> */}
                        <th>Mark Up Price</th>
                        {/* <th>Descrepancy</th> */}
                        <th>New Price</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        markupPriceList.map((mark_up, index) => (
                            <tr key={mark_up.id} >
                                <td>{mark_up.id}</td>
                                <td>{mark_up.product_name}</td>
                                <td>{mark_up.warehouse_name}</td>
                                <td>{'₱ ' + mark_up.price + '.00'}</td>
                                {/* <td>{mark_up.mark_up_option}</td> */}
                                <td>{mark_up.mark_up_option === 'PERCENTAGE' ? mark_up.mark_up_price + '% / ' + '₱ ' + (Number(mark_up.new_price) - Number(mark_up.price)) + '.00' : '₱ ' + mark_up.mark_up_price + '.00'}</td>
                                {/* <td>{'₱ ' + (Number(mark_up.new_price) - Number(mark_up.price)) + '.00'}</td> */}
                                <td style={{ fontWeight: 'bold' }}>{'₱ ' + mark_up.new_price}{mark_up.new_price % 1 === 0 ? '.00' : ''}</td>
                                <td>
                                    <Link variant="primary" to={"/editMarkUp/" + mark_up.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteMarkUpPrice(mark_up.id, e)} >
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

export default MarkUpPriceList
