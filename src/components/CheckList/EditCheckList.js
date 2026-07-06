import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import CheckListService from "./CheckListService";
import UserService from "../User/UserService.service";


const EditCheckList = () => {


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
        frequency: '',
        time_of_day: '',
        status: 0,
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

        CheckListService.update(checkList.id, checkList)
            .then(response => {
                setCheckList(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchUserList = () => {
        UserService.fetchUserList()
            .then(response => {
                setUserList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const fetchCheckList = (id) => {
        CheckListService.get(id)
            .then(response => {
                setCheckList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }
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
                    <Form.Control type="text" value={checkList.check_list_name} name="check_list_name" placeholder="Enter Check List Name" onChange={onChangeCheckList} />

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

                <Form.Group className="mb-3" controlId="formFrequency">
                    <Form.Label>Frequency</Form.Label>
                    <Form.Select
                        name="frequency"
                        value={checkList.frequency}
                        onChange={onChangeCheckList}
                        style={{
                            color:
                                checkList.frequency === "DAILY"
                                    ? "#22c55e"
                                    : checkList.frequency === "WEEKLY"
                                        ? "#3b82f6"
                                        : checkList.frequency === "MONTHLY"
                                            ? "#8b5cf6"
                                            : "#000"
                        }}
                    >
                        <option value="">Select Frequency</option>

                        <option value="DAILY" style={{ color: "#22c55e" }}>
                            📅 DAILY
                        </option>

                        <option value="WEEKLY" style={{ color: "#3b82f6" }}>
                            📆 WEEKLY
                        </option>

                        <option value="MONTHLY" style={{ color: "#8b5cf6" }}>
                            🗓️ MONTHLY
                        </option>
                    </Form.Select>

                </Form.Group>

                <Form.Group className="w-25 mb-3" controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                        name="status"
                        value={checkList.status}
                        onChange={onChangeCheckList}
                        style={{
                            color:
                                checkList.status == 0
                                    ? 'green'
                                    : checkList.status == 1
                                        ? 'red'
                                        : 'black',
                            fontWeight: 'bold'
                        }}
                    >
                        <option value="">Select Status</option>
                        <option value={0}>✅ ENABLED</option>
                        <option value={1}>❌ DISABLED</option>
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditCheckList
