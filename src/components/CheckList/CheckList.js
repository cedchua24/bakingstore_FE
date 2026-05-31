import React, { useState, useEffect } from "react";
import CheckListService from "./CheckListService";
import { Button, Form, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";


const CheckList = () => {

    useEffect(() => {
        fetchCheckList();
    }, []);



    const [checkListList, setCheckListList] = useState([]);


    const fetchCheckList = () => {
        CheckListService.getAll()
            .then(response => {
                setCheckListList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    return (
        <div>
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
                        <th>Status</th>
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
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}


export default CheckList
