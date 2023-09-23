import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import ProductTransactionService from "../OtherService/ProductTransactionService";
import { styled } from '@mui/material/styles';

const ProductTransactionList = () => {

    const { id } = useParams();
    const [productTransactionList, setProductTransactionList] = useState([]);
    const [productName, setProductName] = useState('');
    useEffect(() => {
        fetchProductTransactionList();
    }, []);

    const fetchProductTransactionList = async () => {
        await ProductTransactionService.fetchProductTransactionList(id)
            .then(response => {
                setProductTransactionList(response.data);
                setProductName(response.data[0].product_name);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
    }));


    return (
        <div>
            <Div>{productName}</Div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Quantity</th>
                        <th>Operator</th>
                        <th>Date</th>
                        {/* <th></th>
                        <th></th> */}
                    </tr>
                </thead>
                <tbody>

                    {
                        productTransactionList.map((productTransaction, index) => (
                            <tr key={productTransaction.id} >
                                <td>{productTransaction.id}</td>
                                <td>{productTransaction.quantity}</td>
                                <td>{productTransaction.name}</td>
                                <td>{productTransaction.created_at}</td>
                                {/* <td>
                                    <Link variant="primary" to={"/editSupplier/" + productTransaction.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td> */}
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ProductTransactionList
