import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';

import DashboardService from "../OtherService/DashboardService";
import DailySessionService from "../OtherService/DailySessionService";
import { useParams, useNavigate } from 'react-router-dom';

import LinearProgress from '@mui/material/LinearProgress';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const StartOfDay = () => {

    const { id } = useParams();
    useEffect(() => {
        fetchDailySessionByDate();
    }, []);

    const [dailySessionList, setDailySessionList] = useState({
        data: []
    });

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const [date, setDate] = useState({
        today: id,
        user_id: localStorage.getItem('auth_user_id'),
        status: 0
    });

    const fetchDailySessionByDate = () => {
        DailySessionService.fetchDailySessionByDate(id)
            .then(response => {
                setDailySessionList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const startOfdaySubmit = async () => {
        try {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            console.log("dateToday" + date.today)
            await DashboardService.sanctum();

            const response = await DashboardService.submitStartOfDay(date.today, date);

            // Verify that content type is correct
            if (response.headers["content-type"].includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "product_reports_" + date.today + ".xlsx");
                document.body.appendChild(link);
                link.click();
                link.remove();
                fetchDailySessionByDate();
                setValidator({
                    severity: 'success',
                    message: 'Good morning, everyone! Let’s make today productive and positive.!',
                    isShow: true,
                });
                ;
            } else {
                console.error("Invalid file type — backend may be returning HTML or JSON:", response);
            }
            setSubmitLoadingAdd(false);
            setIsAddDisabled(false)
        } catch (e) {
            console.error("Excel download failed:", e);
            setSubmitLoadingAdd(false);
            setIsAddDisabled(false);
        }
    };

    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>


            <div>
                <br></br>
                <legend align="center" style={{ fontWeight: 'bold' }} > Session List  </legend>
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr class="table-secondary">
                            <th>ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            dailySessionList.data.map((dailysession, index) => (
                                <tr key={dailysession.id} >
                                    <td>{dailysession.id}</td>
                                    <td>{dailysession.created_at}</td>
                                    <td>{dailysession.status === 0 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                </tr>
                            )
                            )
                        }
                    </tbody>
                </table>
                <br></br>
                <br></br>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        align="center"
                        variant="contained"
                        type="submit"
                        disabled={isAddDisabled}
                        onClick={startOfdaySubmit}
                    >
                        Start of Day
                    </Button>
                    <br></br>
                    <br></br>

                </div>
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }


            </div>
        </div>
    )
}

export default StartOfDay
