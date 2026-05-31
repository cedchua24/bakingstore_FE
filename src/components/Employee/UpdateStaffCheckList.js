import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import CheckListTransactionService from "../CheckList/CheckListTransactionService";
import UserService from "../User/UserService.service";


const UpdateStaffCheckList = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchCheckList(id);
        fetchUserList();
    }, []);

    const [checkList, setCheckList] = useState({
        id: 0,
        check_list_name: '',
        assignee: 0,
        checker: 0,
        checker_name: '',
        assignee_name: '',
        comment: '',
        time_of_day: '',
        status: '',
        created_at: '',
        updated_at: ''
    });
    const [userList, setUserList] = useState([]);

    const [message, setMessage] = useState(false);

    const onChangeCheckList = (e) => {
        setCheckList({ ...checkList, [e.target.name]: e.target.value });
    }

    const updateCheckList = (e) => {
        e.preventDefault();

        CheckListTransactionService.update(checkList.id, checkList)
            .then(response => {
                setCheckList(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchUserList = () => {
        UserService.getAll()
            .then(response => {
                setUserList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const fetchCheckList = (id) => {
        CheckListTransactionService.get(id)
            .then(response => {
                setCheckList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const statusColor = {
        PENDING: 'orange',
        SENT_TO_SUPERVISOR: '#1976d2',
        APPROVED: 'green',
        REJECTED: 'red',
    };

    return (
        <div>
            {message &&
                <Alert variant="success" dismissible>
                    <Alert.Heading>Successfully Updated!</Alert.Heading>
                    <p>
                        Change this and that and try again. Duis mollis, est non commodo
                        luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                        Cras mattis consectetur purus sit amet fermentum.
                    </p>
                </Alert>
            }
            <Form onSubmit={updateCheckList}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Check List Name</Form.Label>
                    <Form.Control type="text" value={checkList.check_list_name} name="check_list_name" placeholder="Enter Check List Name" onChange={onChangeCheckList} disabled />

                </Form.Group>

                <Form.Group className="mb-3" controlId="formAssignee">
                    <Form.Label>Assignee</Form.Label>
                    <Form.Select name="assignee" value={checkList.assignee} onChange={onChangeCheckList}>
                        <option value={0}>Select Assignee</option>
                        {userList.map((user) => (
                            <option value={user.id} key={user.id}>{user.name}</option>
                        ))}
                    </Form.Select>

                </Form.Group>

                <Form.Group className="mb-3" controlId="formChecker">
                    <Form.Label>Checker</Form.Label>
                    <Form.Select name="checker" value={checkList.checker} onChange={onChangeCheckList}>
                        <option value={0}>Select Checker</option>
                        {userList.map((user) => (
                            <option value={user.id} key={user.id}>{user.name}</option>
                        ))}
                    </Form.Select>

                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control type="text" value={checkList.comment} name="comment" placeholder="Enter Comment" onChange={onChangeCheckList} />

                </Form.Group>



                <Form.Group className="mb-3" controlId="formTimeOfDay">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                        name="status"
                        value={checkList.status}
                        onChange={onChangeCheckList}
                        style={{
                            color: statusColor[checkList.status] || 'black',
                            fontWeight: 'bold'
                        }}

                    >
                        <option value="PENDING" style={{ color: 'orange' }}>
                            🟠 PENDING
                        </option>
                        <option value="SENT_TO_SUPERVISOR" style={{ color: '#1976d2' }}>
                            🔵 SENT TO SUPERVISOR
                        </option>
                        <option value="APPROVED" style={{ color: 'green' }}>
                            🟢 APPROVED
                        </option>
                        <option value="REJECTED" style={{ color: 'red' }}>
                            🔴 REJECTED
                        </option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTimeOfDay">
                    <Form.Label>Time of Day</Form.Label>
                    <Form.Select
                        name="time_of_day"
                        value={checkList.time_of_day}
                        onChange={onChangeCheckList}
                        style={{
                            color:
                                checkList.time_of_day === "MORNING"
                                    ? "#f59e0b"
                                    : checkList.time_of_day === "AFTERNOON"
                                        ? "#3b82f6"
                                        : checkList.time_of_day === "EVENING"
                                            ? "#8b5cf6"
                                            : "#000"
                        }}
                        disabled
                    >
                        <option value="">Select Time of Day</option>
                        <option value="MORNING" style={{ color: "#f59e0b" }}>
                            🌅 MORNING
                        </option>
                        <option value="AFTERNOON" style={{ color: "#3b82f6" }}>
                            ☀️ AFTERNOON
                        </option>
                        <option value="EVENING" style={{ color: "#8b5cf6" }}>
                            🌙 EVENING
                        </option>
                    </Form.Select>

                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default UpdateStaffCheckList
