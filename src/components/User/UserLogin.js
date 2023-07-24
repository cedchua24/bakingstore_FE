import React, { useState, useEffect } from "react";
import UserService from './UserService.service'
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';

const UserLogin = (props) => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        id: 0,
        name: '',
        email: '',
        password: ''
    });
    const [error_message, setErrorMessage] = useState({});
    const onChangeEmail = (e) => {
        setUser({ ...user, email: e.target.value });
    }

    const onChangePassword = (e) => {
        setUser({ ...user, password: e.target.value });
    }


    const login = (e) => {
        e.preventDefault();
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`api/login/`, user).then(response => {
                if (response.data.status === 200) {
                    setErrorMessage('');
                    localStorage.setItem('auth_token', response.data.token);
                    localStorage.setItem('auth_name', response.data.email);
                    localStorage.setItem('auth_user_id', response.data.id);
                    // swal("Success", response.data.message, "success")

                    if (response.data.role === 'admin') {
                        navigate('/orderSupplierTransaction');
                    } else if (response.data.role === 'user') {
                        navigate('/');
                    }
                    window.location.reload();

                } else if (response.data.status === 401) {
                    swal("warning", response.data.message, "warning")
                }
                else {
                    setErrorMessage(response.data.validator_errors);
                }
            });

        });
    }

    return (
        <Form onSubmit={login}>

            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" value={user.email} placeholder="Enter email" onChange={onChangeEmail} />
                <Form.Text className="text-danger"  >
                    {error_message.email}
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={user.password} placeholder="Enter password" onChange={onChangePassword} />
                <Form.Text className="text-danger"  >
                    {error_message.password}
                </Form.Text>
            </Form.Group>

            <Button variant="primary" type='submit'>
                Login
            </Button>
        </Form>
    )
}

export default UserLogin
