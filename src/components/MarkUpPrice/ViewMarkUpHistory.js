import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MarkUpPriceServiceService from "./MarkUpPriceService.service";

import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


const ViewMarkUpHistory = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchMarkUpPriceList(id);
    }, []);

    const [markupPriceList, setMarkupPriceList] = useState([]);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        '& .MuiTextField-root': { m: 1, width: '25ch' },
    };


    const fetchMarkUpPriceList = (id) => {
        MarkUpPriceServiceService.fetchMarkupByProductId(id)
            .then(response => {
                setMarkupPriceList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }



    //formatdate
    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const groupedByDate = markupPriceList.reduce((acc, item) => {
        const date = formatStatementDate(item.created_at);

        if (!acc[date]) {
            acc[date] = {
                date,
                retail: null,
                wholesale: null,
            };
        }

        if (item.business_type === 'RETAIL') {
            acc[date].retail = item;
        }

        if (item.business_type === 'WHOLESALE') {
            acc[date].wholesale = item;
        }

        return acc;
    }, {});

    const pairedMarkupList = Object.values(groupedByDate);

    return (
        <div>
            <legend align="center" style={{ fontWeight: 'bold' }} > Mark Up History </legend>
            <h6 align="center"> {markupPriceList?.[0]?.product_name || ''}  </h6>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr className="table-secondary">
                        <th>Date</th>


                        <th>Retail Details</th>
                        <th>Retail Supplier Price</th>
                        <th>Retail Mark Up Price</th>
                        <th>Retail New Price</th>


                        <th>Wholesale Details</th>
                        <th>Wholesale Supplier Price</th>
                        <th>Wholesale Mark Up Price</th>
                        <th>Wholesale New Price</th>
                    </tr>
                </thead>

                <tbody>
                    {pairedMarkupList.map((row, index) => (
                        <tr key={index}>
                            <td>{row.date}</td>


                            <td>
                                {row.retail
                                    ? `(${Number.isInteger(row.retail.weight / row.retail.quantity)
                                        ? row.retail.weight / row.retail.quantity
                                        : (row.retail.weight / row.retail.quantity).toPrecision(2)
                                    }${row.retail.variation})`
                                    : ''}
                            </td>
                            <td>{row.retail ? `₱ ${row.retail.price}.00` : ''}</td>
                            <td>
                                {row.retail
                                    ? row.retail.mark_up_option === 'PERCENTAGE'
                                        ? `${row.retail.mark_up_price}% / ₱ ${Number(row.retail.new_price) - Number(row.retail.price)}.00`
                                        : `₱ ${row.retail.mark_up_price}.00`
                                    : ''}
                            </td>
                            <td style={{ fontWeight: 'bold' }}>
                                {row.retail ? `₱ ${row.retail.new_price}${row.retail.new_price % 1 === 0 ? '.00' : ''}` : ''}
                            </td>


                            <td>
                                {row.wholesale
                                    ? `(${row.wholesale.weight / row.wholesale.quantity}${row.wholesale.variation} x ${row.wholesale.quantity}) ${row.wholesale.packaging}`
                                    : ''}
                            </td>
                            <td>{row.wholesale ? `₱ ${row.wholesale.price}.00` : ''}</td>
                            <td>
                                {row.wholesale
                                    ? row.wholesale.mark_up_option === 'PERCENTAGE'
                                        ? `${row.wholesale.mark_up_price}% / ₱ ${Number(row.wholesale.new_price) - Number(row.wholesale.price)}.00`
                                        : `₱ ${row.wholesale.mark_up_price}.00`
                                    : ''}
                            </td>
                            <td style={{ fontWeight: 'bold' }}>
                                {row.wholesale ? `₱ ${row.wholesale.new_price}${row.wholesale.new_price % 1 === 0 ? '.00' : ''}` : ''}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default ViewMarkUpHistory
