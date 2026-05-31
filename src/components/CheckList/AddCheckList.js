import React, { useState, useEffect } from "react";
import CheckListService from "./CheckListService";
import UserService from "../User/UserService.service";
import { Button, Form, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";


const AddCheckList = () => {

    useEffect(() => {
        fetchCheckList();
        fetchUserList();
    }, []);

    const initialCheckList = {
        id: 0,
        check_list_name: '',
        assignee: 0,
        checker: 0,
        time_of_day: '',
        frequency: '',
        status: 0,
        created_at: '',
        updated_at: ''
    };

    const [checkList, setCheckList] = useState(initialCheckList);

    const [message, setMessage] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [checkListList, setCheckListList] = useState([]);
    const [userList, setUserList] = useState([]);

    const onChangeCheckList = (e) => {
        setCheckList({ ...checkList, [e.target.name]: e.target.value });
    }

    const saveCheckList = (e) => {
        e.preventDefault();

        const errors = {};

        if (checkList.check_list_name.length === 0) {
            errors.check_list_name = "Check List Name is Required!";
        }

        if (checkList.assignee === 0 || checkList.assignee === "0") {
            errors.assignee = "Assignee is Required!";
        }

        if (checkList.checker === 0 || checkList.checker === "0") {
            errors.checker = "Checker is Required!";
        }

        if (checkList.time_of_day.length === 0) {
            errors.time_of_day = "Time of Day is Required!";
        }

        if (checkList.frequency.length === 0) {
            errors.frequency = "Frequency is Required!";
        }


        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        const data = {
            check_list_name: checkList.check_list_name,
            assignee: checkList.assignee,
            checker: checkList.checker,
            time_of_day: checkList.time_of_day,
            frequency: checkList.frequency,
            status: 0
        };

        CheckListService.sanctum().then(response => {
            CheckListService.create(data)
                .then(response => {
                    setCheckListList([...checkListList, response.data]);
                    fetchCheckList();
                    setCheckList(initialCheckList);
                    setFormErrors({});
                    setMessage(true);
                })
                .catch(e => {
                    console.log(e);
                });
        });
    }

    const fetchCheckList = () => {
        CheckListService.getAll()
            .then(response => {
                setCheckListList(response.data);
            })
            .catch(e => {
                console.log("error", e)
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

    const deleteCheckList = (id, e) => {

        const index = checkListList.findIndex(checkList => checkList.id === id);
        const newCheckList = [...checkListList];
        newCheckList.splice(index, 1);

        CheckListService.delete(id)
            .then(response => {
                setCheckListList(newCheckList);
            })
            .catch(e => {
                console.log('error', e);
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

            <Form onSubmit={saveCheckList}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Check List Name</Form.Label>
                    <Form.Control type="text" value={checkList.check_list_name} name="check_list_name" placeholder="Enter Check List Name" onChange={onChangeCheckList} />
                    <Form.Text className="text-danger"  >
                        {formErrors.check_list_name}
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAssignee">
                    <Form.Label>Assignee</Form.Label>
                    <Form.Select name="assignee" value={checkList.assignee} onChange={onChangeCheckList}>
                        <option value={0}>Select Assignee</option>
                        {userList.map((user) => (
                            <option value={user.id} key={user.id}>{user.name}</option>
                        ))}
                    </Form.Select>
                    <Form.Text className="text-danger"  >
                        {formErrors.assignee}
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formChecker">
                    <Form.Label>Checker</Form.Label>
                    <Form.Select name="checker" value={checkList.checker} onChange={onChangeCheckList}>
                        <option value={0}>Select Checker</option>
                        {userList.map((user) => (
                            <option value={user.id} key={user.id}>{user.name}</option>
                        ))}
                    </Form.Select>
                    <Form.Text className="text-danger"  >
                        {formErrors.checker}
                    </Form.Text>
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
                    <Form.Text className="text-danger"  >
                        {formErrors.time_of_day}
                    </Form.Text>
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

                    <Form.Text className="text-danger">
                        {formErrors.frequency}
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <br></br>

            <legend align="center" style={{ fontWeight: 'bold' }} > Check List </legend>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr className="table-secondary">
                        <th>ID</th>
                        <th>Check List Name</th>
                        <th>Assignee </th>
                        <th>Checker</th>
                        <th>Time of Day</th>
                        <th>Frequency</th>
                        <th>Status</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        checkListList.map((data, index) => (
                            <tr key={data.id} >
                                <td>{data.id}</td>
                                <td>{data.check_list_name}</td>
                                <td>{data.assignee_name}</td>
                                <td>{data.checker_name}</td>
                                <td>
                                    {data.time_of_day === "MORNING" && (
                                        <span className="badge bg-warning text-dark">
                                            🌅 MORNING
                                        </span>
                                    )}

                                    {data.time_of_day === "AFTERNOON" && (
                                        <span className="badge bg-info">
                                            ☀️ AFTERNOON
                                        </span>
                                    )}

                                    {data.time_of_day === "EVENING" && (
                                        <span className="badge bg-primary">
                                            🌙 EVENING
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <span
                                        style={{
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: '#fff',
                                            backgroundColor:
                                                data.frequency === 'DAILY'
                                                    ? '#22c55e'
                                                    : data.frequency === 'WEEKLY'
                                                        ? '#3b82f6'
                                                        : data.frequency === 'MONTHLY'
                                                            ? '#8b5cf6'
                                                            : '#6b7280'
                                        }}
                                    >
                                        {data.frequency === 'DAILY' && '📅 DAILY'}
                                        {data.frequency === 'WEEKLY' && '📆 WEEKLY'}
                                        {data.frequency === 'MONTHLY' && '🗓️ MONTHLY'}
                                    </span>
                                </td>
                                <td>
                                    {data.status == 0 ? (
                                        <span className="badge bg-success">
                                            ✅ ENABLED
                                        </span>
                                    ) : (
                                        <span className="badge bg-danger">
                                            ❌ DISABLED
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <Link variant="primary" to={"/checkList/editCheckList/" + data.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteCheckList(data.id, e)} disabled>
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


export default AddCheckList
