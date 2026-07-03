import React from "react";
import { Button } from "react-bootstrap";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const VipProductList = ({ transactions, onDelete }) => (
    <div>
        <legend align="center" style={{ fontWeight: "bold" }}>VIP Product List</legend>
        <div className="table-responsive">
            <table className="table table-bordered">
                <thead>
                    <tr className="table-secondary">
                        <th>#</th>
                        <th>ID</th>
                        <th>VIP Product Template</th>
                        <th>Product</th>
                        <th>Details</th>
                        <th>Color</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={transaction.id}>
                            <td>{index + 1}</td>
                            <td>{transaction.id}</td>
                            <td>{transaction.vip_product_name}</td>
                            <td>{transaction.product_name}</td>
                            <td>{transaction.details}</td>
                            <td>
                                <span style={{
                                    display: "inline-block",
                                    width: "22px",
                                    height: "22px",
                                    borderRadius: "4px",
                                    backgroundColor: transaction.vip_color || "#000000",
                                    border: "1px solid #ced4da",
                                }} title={transaction.vip_color} />
                            </td>
                            <td>{Number(transaction.status) === 0
                                ? <CheckIcon style={{ color: "green" }} />
                                : <CloseIcon style={{ color: "red" }} />}
                            </td>
                            <td style={{ whiteSpace: "nowrap" }}>
                                <Button variant="danger" onClick={() => onDelete(transaction.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default VipProductList;
