import React, { useState, useEffect } from "react";
import UserService from './UserService.service'
import { Button, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from 'sweetalert';


const UserRegistration = () => {

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserList();
    }, []);

    const [user, setUser] = useState({
        id: 0,
        name: '',
        email: '',
        password: ''
    });

    const [error_message, setErrorMessage] = useState({});

    const [message, setMessage] = useState(false);

    const [userList, setUserList] = useState([]);

    const onChangeUser = (e) => {
        setUser({ ...user, name: e.target.value });
    }

    const onChangeEmail = (e) => {
        setUser({ ...user, email: e.target.value });
    }

    const onChangePassword = (e) => {
        setUser({ ...user, password: e.target.value });
    }

    const saveUser = () => {
        UserService.sanctum().then(response => {
            // axios.get('/sanctum/csrf-cookie').then(response => {

            UserService.create(user).then(response => {
                // axios.post(`/api/register`, user).then(response => {

                console.log('response', response);
                console.log('response', response.data.validator_errors)

                if (response.data.status === 200) {
                    setUserList([...userList, response.data]);
                    setErrorMessage('');
                    setMessage(true);
                    localStorage.setItem('auth_token', response.data.token);
                    localStorage.setItem('auth_name', response.data.email);
                    localStorage.setItem('auth_user_id', response.data.id);
                    swal("Success", response.data.message, "success")
                    navigate('/');
                }
                else {
                    setErrorMessage(response.data.validator_errors);
                }

            });

        });
    }

    const fetchUserList = () => {
        axios.get('/sanctum/csrf-cookie').then(response => {
            UserService.getAll()
                .then(response => {
                    setUserList(response.data);
                })
                .catch(e => {
                    console.log("error", e)
                });
        });
    }

    const deleteUser = (id, e) => {

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const index = userList.findIndex(user => user.id === id);
                    const newUser = [...userList];
                    newUser.splice(index, 1);
                    axios.get('/sanctum/csrf-cookie').then(response => {
                        // UserService.sanctum().then(response => {
                        axios.delete(`/api/register/${id}`)
                            .then(response => {
                                setUserList(newUser);
                            })
                            .catch(e => {
                                console.log('error', e);
                            });

                        // UserService.delete(id)
                        //     .then(response => {
                        //         setUserList(newUser);
                        //     })
                        //     .catch(e => {
                        //         console.log('error', e);
                        //     });

                    });
                    swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                    });
                } else {
                    swal("Your imaginary file is safe!");
                }
            });
    }


    return (
        <div>
            {message &&
                <Alert variant="success" dismissible>
                    <Alert.Heading>Successfully Added!</Alert.Heading>
                    <p>
                        Change this and that and try again. Duis mollis, est non commodo
                        luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                        Cras mattis consectetur purus sit amet fermentum.
                    </p>
                </Alert>
            }

            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={user.name} placeholder="Enter name" onChange={onChangeUser} />
                    <Form.Text className="text-danger"   >
                        {error_message.name}
                    </Form.Text>
                </Form.Group>

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

                <Button variant="primary" onClick={saveUser}>
                    Submit
                </Button>
            </Form>
            <br></br>

            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        userList.map((user, index) => (
                            <tr key={user.id} >
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Link variant="primary" to={"/editUser/" + user.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteUser(user.id, e)} >
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

export default UserRegistration
