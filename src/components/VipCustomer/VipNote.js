import React, { useEffect, useState, useCallback } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import VipCustomerNoteService from "./VipCustomerNoteService";
import VipCustomerTransactionService from "./VipCustomerTransactionService";
import VipCustomerService from "./VipCustomerService";

const styles = {
    detailPanel: {
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '18px 18px',
        marginBottom: '18px',
        boxShadow: '0 8px 22px rgba(23, 32, 51, 0.06)',
    },
    vipHeader: {
        textAlign: 'center',
        paddingBottom: '16px',
        marginBottom: '16px',
        borderBottom: '1px solid #edf0f3',
    },
    vipLabel: {
        color: '#6c757d',
        fontSize: '12px',
        fontWeight: '800',
        letterSpacing: '0.4px',
        marginBottom: '8px',
        textTransform: 'uppercase',
    },
    vipNameWrap: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '9px 16px',
        borderRadius: '999px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
    },
    vipName: {
        color: '#172033',
        fontWeight: '800',
        fontSize: '20px',
        marginBottom: '0',
    },
    detailGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '10px',
    },
    detailItem: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        padding: '10px 12px',
    },
    detailLabel: {
        color: '#6c757d',
        fontSize: '12px',
        fontWeight: '700',
        marginBottom: '4px',
        textTransform: 'uppercase',
    },
    detailValue: {
        color: '#172033',
        fontWeight: '600',
        marginBottom: '0',
        overflowWrap: 'anywhere',
    },
    vipColorSwatch: {
        width: '22px',
        height: '22px',
        borderRadius: '999px',
        border: '2px solid #ffffff',
        display: 'inline-block',
        flex: '0 0 auto',
        boxShadow: '0 0 0 1px #ced4da, 0 6px 14px rgba(23, 32, 51, 0.18)',
    },
}

const VipNote = () => {

    const { id } = useParams();

    const [vipCustomerNote, setVipCustomerNote] = useState({
        id: 0,
        vip_customer_transaction_id: id,
        user_id: localStorage.getItem('auth_user_id'),
        comment: '',
        status: 0,
        created_at: '',
        updated_at: ''
    });
    const [vipCustomerNoteList, setVipCustomerNoteList] = useState([]);
    const [vipCustomerTransaction, setVipCustomerTransaction] = useState({});
    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const fetchVipCustomerNoteList = useCallback(() => {
        VipCustomerNoteService.getAll()
            .then(response => {
                const noteList = Array.isArray(response.data) ? response.data : [];
                setVipCustomerNoteList(noteList.filter(note => Number(note.vip_customer_transaction_id) === Number(id)));
            })
            .catch(e => {
                console.log("error", e);
                setValidator({
                    severity: 'error',
                    message: 'Unable to fetch VIP Customer Notes',
                    isShow: true,
                });
            });
    }, [id]);

    const fetchVipCustomerTransaction = useCallback(() => {
        VipCustomerTransactionService.get(id)
            .then(response => {
                const transaction = response.data || {};
                setVipCustomerTransaction(transaction);

                if (transaction.vip_customer_id && !transaction.vip_color) {
                    VipCustomerService.get(transaction.vip_customer_id)
                        .then(templateResponse => {
                            setVipCustomerTransaction({
                                ...transaction,
                                vip_name: transaction.vip_name || templateResponse.data.vip_name,
                                details: transaction.details || templateResponse.data.details,
                                vip_color: templateResponse.data.vip_color,
                            });
                        })
                        .catch(e => {
                            console.log("error", e);
                        });
                }
            })
            .catch(e => {
                console.log("error", e);
            });
    }, [id]);

    useEffect(() => {
        fetchVipCustomerNoteList();
        fetchVipCustomerTransaction();
    }, [fetchVipCustomerNoteList, fetchVipCustomerTransaction]);

    const onChangeInput = (e) => {
        setVipCustomerNote({ ...vipCustomerNote, [e.target.name]: e.target.value });
    }

    const validate = () => {
        const errors = {};
        if (!vipCustomerNote.comment) {
            errors.comment = "Comment is Required!";
        }
        return errors;
    }

    const formatStatementDateTime = (date) => {
        if (!date) {
            return '';
        }
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(d);
    }

    const saveVipCustomerNote = () => {
        const errors = validate();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);

        const notePayload = {
            ...vipCustomerNote,
            vip_customer_transaction_id: id,
            user_id: localStorage.getItem('auth_user_id'),
            status: 0
        };

        VipCustomerNoteService.sanctum().then(response => {
            VipCustomerNoteService.create(notePayload)
                .then(response => {
                    setVipCustomerNote({
                        id: 0,
                        vip_customer_transaction_id: id,
                        user_id: localStorage.getItem('auth_user_id'),
                        comment: '',
                        status: 0,
                        created_at: '',
                        updated_at: ''
                    });
                    setValidator({
                        severity: 'success',
                        message: response.data.message || 'Successfully Added!',
                        isShow: true,
                    });
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                    fetchVipCustomerNoteList();
                })
                .catch(e => {
                    console.log(e);
                    setValidator({
                        severity: 'error',
                        message: 'Unable to save VIP Customer Note',
                        isShow: true,
                    });
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                });
        });
    }

    return (
        <div>
            <legend align="center" style={{ fontWeight: 'bold' }} > Vip Note </legend>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>

            <div style={styles.detailPanel}>
                <div style={styles.vipHeader}>

                    <div style={styles.vipNameWrap}>
                        {vipCustomerTransaction.vip_color &&
                            <span
                                style={{
                                    ...styles.vipColorSwatch,
                                    backgroundColor: vipCustomerTransaction.vip_color,
                                }}
                            ></span>
                        }
                        <p style={styles.vipName}>{vipCustomerTransaction.vip_name || '-'}</p>
                    </div>
                </div>

                <div style={styles.detailGrid}>
                    <div style={styles.detailItem}>
                        <p style={styles.detailLabel}>Customer</p>
                        <p style={styles.detailValue}>{vipCustomerTransaction.customer_name || '-'}</p>
                    </div>
                    <div style={styles.detailItem}>
                        <p style={styles.detailLabel}>Address</p>
                        <p style={styles.detailValue}>{vipCustomerTransaction.address || '-'}</p>
                    </div>
                    <div style={styles.detailItem}>
                        <p style={styles.detailLabel}>Contact Number</p>
                        <p style={styles.detailValue}>{vipCustomerTransaction.contact_number || '-'}</p>
                    </div>
                    <div style={styles.detailItem}>
                        <p style={styles.detailLabel}>Email</p>
                        <p style={styles.detailValue}>{vipCustomerTransaction.email || '-'}</p>
                    </div>
                    <div style={styles.detailItem}>
                        <p style={styles.detailLabel}>Details</p>
                        <p style={styles.detailValue}>{vipCustomerTransaction.details || '-'}</p>
                    </div>
                </div>
            </div>

            <Form>
                {formErrors.comment && <p style={{ color: "red" }}>{formErrors.comment}</p>}
                <Form.Group className="mb-3" controlId="formVipNoteComment">
                    <Form.Label>Comment *</Form.Label>
                    <Form.Control as="textarea" rows={4} value={vipCustomerNote.comment} name="comment" placeholder="Enter comment" onChange={onChangeInput} />
                </Form.Group>

                <Button variant="primary"
                    disabled={isAddDisabled}
                    onClick={saveVipCustomerNote}>
                    Submit
                </Button>
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }
            </Form>

            <br></br>
            <legend align="center" style={{ fontWeight: 'bold' }} > VIP Customer Note List </legend>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr className="table-secondary">
                        <th>ID</th>
                        <th>Comment</th>
                        <th>User</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        vipCustomerNoteList.length > 0 ? vipCustomerNoteList.map((note, index) => (
                            <tr key={note.id} >
                                <td>{note.id}</td>
                                <td>{note.comment}</td>
                                <td>{note.name}</td>
                                <td>{formatStatementDateTime(note.created_at)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>No notes found.</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default VipNote
