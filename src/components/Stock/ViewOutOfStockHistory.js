import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import OutOfStockService from '../OtherService/OutOfStockService';


import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
import UpdateIcon from '@mui/icons-material/Update';

const ViewOutOfStockHistory = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchOutOfStockHistory(id);
    }, []);

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

    const [outOfStockList, setOutOfStockList] = useState({
        code: 0,
        product_name: '',
        data: [],
    });

    const fetchOutOfStockHistory = (id) => {
        OutOfStockService.fetchOOSbyProductId(id)
            .then(response => {
                setOutOfStockList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }
    return (
        <div>
            <legend align="center" style={{ fontWeight: 'bold' }} > {outOfStockList.product_name}  </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        outOfStockList.data.map((data, index) => (
                            <tr key={data.id} >
                                <td>{data.id}</td>
                                <td>{data.comment}</td>
                                <td>{formatStatementDate(data.created_at)}</td>


                            </tr>
                        )
                        )
                    }

                </tbody>
            </table>

        </div >
    )
}

export default ViewOutOfStockHistory
