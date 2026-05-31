import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import CheckListTransactionService from "../CheckList/CheckListTransactionService";
import UserService from "../User/UserService.service";
import { Button, Form, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';


const StaffCheckList = () => {
    const { id } = useParams();
    useEffect(() => {
        fetchCheckList();
        fetchUserList();
    }, []);

    const [userList, setUserList] = useState([]);
    const [date, setDate] = useState({
        dateTo: id,
        dateFrom: id,
        frequency: '',
        time_of_day: '',
        assignee: 0,
        checker: 0,
        status: 0
    });
    const onChangeInput = (e) => {
        setDate({ ...date, [e.target.name]: e.target.value });
    }
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [checkListList, setCheckList] = useState([]);


    const fetchUserList = () => {
        UserService.getAll()
            .then(response => {
                setUserList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }
    const fetchCheckList = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        CheckListTransactionService.fetchCheckListByDate(date)
            .then(response => {
                setCheckList(response.data);
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const statusColorTd = {
        PENDING: 'orange',
        SENT_TO_SUPERVISOR: 'blue',
        APPROVED: 'green',
        REJECTED: 'red',
    };


    return (
        <div>
            <br></br>

            <Form>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date From <span style={{ color: 'red' }}>*</span> :</Form.Label>
                    <Form.Control type="date" name="dateFrom" value={date.dateFrom} onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date To <span style={{ color: 'red' }}>*</span> :</Form.Label>
                    <Form.Control type="date" name="dateTo" value={date.dateTo} onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="w-25 mb-3" controlId="formTimeOfDay">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                        name="status"
                        value={date.status}
                        onChange={onChangeInput}
                        style={{
                            color: statusColorTd[date.status] || 'black',
                            fontWeight: 'bold'
                        }}
                    >
                        <option value="">Select Status</option>
                        <option value="PENDING">🟠 PENDING</option>
                        <option value="SENT_TO_SUPERVISOR">🔵 SENT TO SUPERVISOR</option>
                        <option value="APPROVED">🟢 APPROVED</option>
                        <option value="REJECTED">🔴 REJECTED</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="w-25 mb-3" controlId="formAssignee">
                    <Form.Label>Assignee</Form.Label>
                    <Form.Select name="assignee" onChange={onChangeInput}>
                        <option value={0}>Select Assignee</option>
                        {userList.map((user) => (
                            <option value={user.id} key={user.id}>{user.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="w-25 mb-3" controlId="formAssignee">
                    <Form.Label>Checker</Form.Label>
                    <Form.Select name="checker" onChange={onChangeInput}>
                        <option value={0}>Select Assignee</option>
                        {userList.map((user) => (
                            <option value={user.id} key={user.id}>{user.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="w-25 mb-3" controlId="formTimeOfDay">
                    <Form.Label>Time of Day</Form.Label>
                    <Form.Select
                        name="time_of_day"
                        value={date.time_of_day}
                        onChange={onChangeInput}
                        style={{
                            color:
                                date.time_of_day === "MORNING"
                                    ? "#f59e0b"
                                    : date.time_of_day === "AFTERNOON"
                                        ? "#3b82f6"
                                        : date.time_of_day === "EVENING"
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

                <Form.Group className="w-25 mb-3" controlId="formFrequency">
                    <Form.Label>Frequency</Form.Label>
                    <Form.Select
                        name="frequency"
                        value={date.frequency}
                        onChange={onChangeInput}
                        style={{
                            color:
                                date.frequency === "DAILY"
                                    ? "#22c55e"
                                    : date.frequency === "WEEKLY"
                                        ? "#3b82f6"
                                        : date.frequency === "MONTHLY"
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


                <Button variant="primary"
                    disabled={isAddDisabled}
                    onClick={fetchCheckList}>
                    Search
                </Button>
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }
            </Form>
            <legend align="center" style={{ fontWeight: 'bold' }} > Employee Check List </legend>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr className="table-secondary">
                        <th>ID</th>
                        <th>Check List Name</th>
                        <th>Assignee </th>
                        <th>Checker</th>
                        <th>Time of Day</th>
                        <th>Frequency</th>
                        <th>Comment</th>
                        <th>Status</th>
                        <th>Date</th>
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
                                <td><h6>{data.comment}</h6></td>
                                <td style={{ color: statusColorTd[data.status] }}>{data.status}</td>

                                <td>{data.date}</td>
                                <td>
                                    <Link variant="primary" to={"/employee/updateStaffCheckList/" + data.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div >
    )
}


export default StaffCheckList
