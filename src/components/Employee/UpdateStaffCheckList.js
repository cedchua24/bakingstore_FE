import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Alert, Button, Form } from 'react-bootstrap';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CheckListTransactionService from "../CheckList/CheckListTransactionService";
import CheckListHistoryService from "../CheckList/CheckListHistoryService";
import UserService from "../User/UserService.service";
import './UpdateStaffCheckList.css';

const applyGradeRules = (checkListData) => {
    if (checkListData.status === 'SENT_TO_SUPERVISOR') {
        return { ...checkListData, grade: 5, grade_checker: 1 };
    }

    if (checkListData.status === 'APPROVED' || checkListData.status === 'REJECTED') {
        return { ...checkListData, grade_checker: 5 };
    }

    return { ...checkListData, grade: '', grade_checker: '' };
};

const UpdateStaffCheckList = () => {
    const { id } = useParams();

    useEffect(() => {
        fetchCheckList(id);
        fetchCheckListHistory(id);
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
        grade: '',
        grade_checker: '',
        created_at: '',
        updated_at: ''
    });
    const [userList, setUserList] = useState([]);
    const [checkListHistoryList, setCheckListHistoryList] = useState([]);
    const [currentStatus, setCurrentStatus] = useState('');
    const [message, setMessage] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requestError, setRequestError] = useState('');

    const onChangeCheckList = (event) => {
        const { name, value } = event.target;

        if (name === 'status') {
            setCheckList(current => {
                const nextCheckList = { ...current, status: value };

                if (value === 'REJECTED' && Number(current.grade) > 2) {
                    nextCheckList.grade = '';
                }

                return applyGradeRules(nextCheckList);
            });
            setFormErrors(current => ({ ...current, grade: '' }));
            return;
        }

        if (name === 'grade' && value && value !== '0') {
            setFormErrors(current => ({ ...current, grade: '' }));
        }

        setCheckList(current => ({ ...current, [name]: value }));
    };

    const updateCheckList = (event) => {
        event.preventDefault();
        const updatePayload = applyGradeRules(checkList);

        if (
            (updatePayload.status === 'APPROVED' || updatePayload.status === 'REJECTED')
            && (!updatePayload.grade || String(updatePayload.grade) === '0')
        ) {
            setFormErrors(current => ({ ...current, grade: 'Grade is required for Approved or Rejected status.' }));
            return;
        }

        if (updatePayload.status === 'REJECTED' && ![1, 2].includes(Number(updatePayload.grade))) {
            setFormErrors(current => ({ ...current, grade: 'Rejected status only allows grade 1 or 2.' }));
            return;
        }

        setFormErrors({});
        setMessage(false);
        setRequestError('');
        setIsSubmitting(true);
        setCheckList(updatePayload);

        CheckListTransactionService.update(updatePayload.id, updatePayload)
            .then(response => {
                const updatedCheckList = applyGradeRules({ ...updatePayload, ...response.data });
                const checkListTransactionId = updatedCheckList.id || updatePayload.id;
                setCheckList(updatedCheckList);
                setCurrentStatus(updatedCheckList.status || updatePayload.status);

                return CheckListHistoryService.create({
                    check_list_transaction_id: checkListTransactionId,
                    comment: updatedCheckList.comment || updatePayload.comment,
                    user_id: localStorage.getItem('auth_user_id'),
                    status: updatedCheckList.status || updatePayload.status
                }).then(() => {
                    setMessage(true);
                    fetchCheckListHistory(checkListTransactionId);
                });
            })
            .catch(error => {
                console.error("Checklist update error:", error);
                setRequestError(error.response?.data?.message || 'Unable to update the checklist. Please try again.');
            })
            .finally(() => setIsSubmitting(false));
    };

    const fetchUserList = () => {
        UserService.fetchUserList()
            .then(response => setUserList(response.data))
            .catch(error => console.error("Unable to load users:", error));
    };

    const fetchCheckList = (checkListId) => {
        CheckListTransactionService.get(checkListId)
            .then(response => {
                setCheckList(applyGradeRules(response.data));
                setCurrentStatus(response.data.status);
            })
            .catch(error => {
                console.error("Unable to load checklist:", error);
                setRequestError('Unable to load the checklist details.');
            });
    };

    const fetchCheckListHistory = (checkListId) => {
        CheckListHistoryService.fetchByCheckListTransactionId(checkListId)
            .then(response => setCheckListHistoryList(response.data))
            .catch(error => console.error("Unable to load checklist history:", error));
    };

    const statusColor = {
        PENDING: '#b77908',
        SENT_TO_SUPERVISOR: '#1976d2',
        APPROVED: '#2e7d45',
        REJECTED: '#c03932',
        NOT_APPLICABLE: '#6c757d',
    };

    const statusOptions = [
        { value: 'PENDING', label: 'PENDING', color: '#b77908' },
        { value: 'SENT_TO_SUPERVISOR', label: 'SENT TO SUPERVISOR', color: '#1976d2' },
        { value: 'APPROVED', label: 'APPROVED', color: '#2e7d45' },
        { value: 'REJECTED', label: 'REJECTED', color: '#c03932' },
        { value: 'NOT_APPLICABLE', label: 'NOT APPLICABLE', color: '#6c757d' }
    ];

    const allowedStatusByCurrentStatus = {
        PENDING: ['PENDING', 'SENT_TO_SUPERVISOR', 'NOT_APPLICABLE'],
        SENT_TO_SUPERVISOR: ['REJECTED', 'APPROVED', 'NOT_APPLICABLE'],
        REJECTED: ['PENDING', 'APPROVED', 'NOT_APPLICABLE'],
        APPROVED: ['PENDING', 'REJECTED', 'NOT_APPLICABLE'],
        NOT_APPLICABLE: ['NOT_APPLICABLE', 'PENDING']
    };

    const allowedStatusList = allowedStatusByCurrentStatus[currentStatus]
        || statusOptions.map(status => status.value);
    const isGradeAvailable = checkList.status === 'REJECTED' || checkList.status === 'APPROVED';
    const getStatusOptionStyle = (status, color) => (
        allowedStatusList.includes(status)
            ? { color }
            : { color: '#9ca3af', backgroundColor: '#f3f4f6' }
    );
    const formatStatus = (status) => String(status || 'PENDING').replaceAll('_', ' ');
    const statusClass = (status) => String(status || 'PENDING').toLowerCase().replaceAll('_', '-');
    const formatDateTime = (value) => {
        if (!value) return '—';
        const parsedDate = new Date(value);
        return Number.isNaN(parsedDate.getTime()) ? value : parsedDate.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    return (
        <div className="employee-checklist-page">
            <section className="employee-checklist-hero">
                <div className="employee-checklist-hero__icon"><AssignmentTurnedInRoundedIcon /></div>
                <div className="employee-checklist-hero__content">
                    <span className="employee-checklist-hero__eyebrow">Employee checklist</span>
                    <h1>{checkList.check_list_name || 'Update Checklist'}</h1>
                    <p>Review the assignment, record the result, and keep the activity history up to date.</p>
                </div>
                <div className={`employee-checklist-status employee-checklist-status--${statusClass(checkList.status)}`}>
                    <span />{formatStatus(checkList.status)}
                </div>
            </section>

            {message && (
                <Alert variant="success" dismissible onClose={() => setMessage(false)} className="employee-checklist-alert">
                    <strong>Checklist updated.</strong> The changes were saved and added to the activity history.
                </Alert>
            )}
            {requestError && (
                <Alert variant="danger" dismissible onClose={() => setRequestError('')} className="employee-checklist-alert">
                    <strong>Update failed.</strong> {requestError}
                </Alert>
            )}

            <Form onSubmit={updateCheckList}>
                <section className="employee-checklist-card">
                    <div className="employee-checklist-card__header">
                        <div>
                            <span className="employee-checklist-section-label">Assignment details</span>
                            <h2>Checklist information</h2>
                        </div>
                        <span className="employee-checklist-record-id">Record #{checkList.id || id}</span>
                    </div>

                    <div className="employee-checklist-form-grid">
                        <Form.Group className="employee-checklist-field employee-checklist-field--wide" controlId="formCheckListName">
                            <Form.Label>Checklist name</Form.Label>
                            <Form.Control type="text" value={checkList.check_list_name || ''} name="check_list_name" disabled />
                            <Form.Text>This name is defined by the checklist template.</Form.Text>
                        </Form.Group>

                        <Form.Group className="employee-checklist-field" controlId="formAssignee">
                            <Form.Label>Assignee</Form.Label>
                            <Form.Select name="assignee" value={checkList.assignee || 0} onChange={onChangeCheckList}>
                                <option value={0}>Select assignee</option>
                                {userList.map(user => <option value={user.id} key={user.id}>{user.name}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="employee-checklist-field" controlId="formChecker">
                            <Form.Label>Checker</Form.Label>
                            <Form.Select name="checker" value={checkList.checker || 0} onChange={onChangeCheckList}>
                                <option value={0}>Select checker</option>
                                {userList.map(user => <option value={user.id} key={user.id}>{user.name}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="employee-checklist-field employee-checklist-field--wide" controlId="formComment">
                            <Form.Label>Review comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="comment"
                                value={checkList.comment || ''}
                                placeholder="Add a clear note about this checklist update..."
                                onChange={onChangeCheckList}
                            />
                        </Form.Group>
                    </div>
                </section>

                <section className="employee-checklist-card employee-checklist-card--workflow">
                    <div className="employee-checklist-card__header">
                        <div>
                            <span className="employee-checklist-section-label">Workflow review</span>
                            <h2>Status and evaluation</h2>
                        </div>
                        <FactCheckRoundedIcon className="employee-checklist-card__header-icon" />
                    </div>

                    <div className="employee-checklist-form-grid employee-checklist-form-grid--workflow">
                        <Form.Group className="employee-checklist-field" controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={checkList.status}
                                onChange={onChangeCheckList}
                                style={{ color: statusColor[checkList.status] || '#403833', fontWeight: 700 }}
                            >
                                {statusOptions.map(status => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                        style={getStatusOptionStyle(status.value, status.color)}
                                        disabled={!allowedStatusList.includes(status.value)}
                                    >
                                        {status.label}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Text>Available choices depend on the current status.</Form.Text>
                        </Form.Group>

                        <Form.Group className="employee-checklist-field" controlId="formTimeOfDay">
                            <Form.Label>Time of day</Form.Label>
                            <Form.Select
                                name="time_of_day"
                                value={checkList.time_of_day || ''}
                                style={{
                                    color: checkList.time_of_day === 'MORNING'
                                        ? '#b77908'
                                        : checkList.time_of_day === 'AFTERNOON'
                                            ? '#0b87a1'
                                            : checkList.time_of_day === 'EVENING'
                                                ? '#0d6efd'
                                                : '#756b65',
                                    fontWeight: 700
                                }}
                                disabled
                            >
                                <option value="">Select time of day</option>
                                <option value="MORNING" style={{ color: '#f59e0b' }}>🌅 MORNING</option>
                                <option value="AFTERNOON" style={{ color: '#3b82f6' }}>☀️ AFTERNOON</option>
                                <option value="EVENING" style={{ color: '#8b5cf6' }}>🌙 EVENING</option>
                            </Form.Select>
                            <Form.Text>Set by the original checklist schedule.</Form.Text>
                        </Form.Group>

                        <Form.Group className="employee-checklist-field" controlId="formGrade">
                            <Form.Label>Assignee grade</Form.Label>
                            <Form.Select
                                name="grade"
                                value={checkList.grade || 0}
                                onChange={onChangeCheckList}
                                disabled={!isGradeAvailable}
                                isInvalid={Boolean(formErrors.grade)}
                                style={{
                                    color: Number(checkList.grade) === 1
                                        ? '#dc3545'
                                        : Number(checkList.grade) === 2
                                            ? '#fd7e14'
                                            : Number(checkList.grade) === 3
                                                ? '#b58b00'
                                                : Number(checkList.grade) === 4
                                                    ? '#0d6efd'
                                                    : Number(checkList.grade) === 5
                                                        ? '#198754'
                                                        : '#756b65',
                                    fontWeight: checkList.grade ? 700 : 400
                                }}
                            >
                                <option value={0}>Select grade</option>
                                <option value={1} style={{ color: '#dc3545' }}>❌ 1 — Poor</option>
                                <option value={2} style={{ color: '#fd7e14' }}>⚠️ 2 — Needs Improvement</option>
                                <option value={3} style={{ color: '#b58b00' }} disabled={checkList.status === 'REJECTED'}>👌 3 — Satisfactory</option>
                                <option value={4} style={{ color: '#0d6efd' }} disabled={checkList.status === 'REJECTED'}>👍 4 — Good</option>
                                <option value={5} style={{ color: '#198754' }} disabled={checkList.status === 'REJECTED'}>🏆 5 — Excellent</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{formErrors.grade}</Form.Control.Feedback>
                            {!formErrors.grade && (
                                <Form.Text>
                                    {checkList.status === 'SENT_TO_SUPERVISOR'
                                        ? 'Automatically set to 5 when sent to the supervisor.'
                                        : isGradeAvailable
                                            ? 'A grade is required for this status.'
                                            : 'Available for approved or rejected checklists.'}
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="employee-checklist-field" controlId="formCheckerGrade">
                            <Form.Label>Checker grade</Form.Label>
                            <Form.Select
                                name="grade_checker"
                                value={checkList.grade_checker || 0}
                                disabled
                                style={{
                                    color: Number(checkList.grade_checker) === 1 ? '#dc3545' : Number(checkList.grade_checker) === 5 ? '#198754' : '#756b65',
                                    fontWeight: checkList.grade_checker ? 700 : 400
                                }}
                            >
                                <option value={0}>No checker grade</option>
                                <option value={1}>❌ 1 — Liable</option>
                                <option value={5}>🏆 5 — Not liable</option>
                            </Form.Select>
                            <Form.Text>
                                {checkList.status === 'SENT_TO_SUPERVISOR'
                                    ? 'Grade 1: the checklist is still waiting for the checker.'
                                    : checkList.status === 'APPROVED' || checkList.status === 'REJECTED'
                                        ? 'Grade 5: the checker completed the review and is not liable.'
                                        : 'Calculated automatically from the checklist status.'}
                            </Form.Text>
                        </Form.Group>
                    </div>

                    <div className="employee-checklist-form-actions">
                        <span>Last updated {formatDateTime(checkList.updated_at)}</span>
                        <Button className="employee-checklist-save" type="submit" disabled={isSubmitting}>
                            <SaveRoundedIcon />
                            {isSubmitting ? 'Saving changes...' : 'Save checklist update'}
                        </Button>
                    </div>
                </section>
            </Form>

            <section className="employee-checklist-card employee-checklist-history">
                <div className="employee-checklist-card__header">
                    <div>
                        <span className="employee-checklist-section-label">Audit trail</span>
                        <h2>Checklist history</h2>
                    </div>
                    <div className="employee-checklist-history__count"><HistoryRoundedIcon /> {checkListHistoryList.length} updates</div>
                </div>

                <div className="employee-checklist-table-wrap">
                    <table className="employee-checklist-table">
                        <thead>
                            <tr><th>ID</th><th>Comment</th><th>Updated by</th><th>Status</th><th>Created</th></tr>
                        </thead>
                        <tbody>
                            {checkListHistoryList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="employee-checklist-table__empty">
                                        <HistoryRoundedIcon />
                                        <strong>No history yet</strong>
                                        <span>Updates to this checklist will appear here.</span>
                                    </td>
                                </tr>
                            ) : checkListHistoryList.map(history => (
                                <tr key={history.id}>
                                    <td className="employee-checklist-table__id">#{history.id}</td>
                                    <td>{history.comment || 'No comment provided'}</td>
                                    <td>{history.user_name || history.name || `User #${history.user_id}`}</td>
                                    <td>
                                        <span className={`employee-checklist-status employee-checklist-status--small employee-checklist-status--${statusClass(history.status)}`}>
                                            <span />{formatStatus(history.status)}
                                        </span>
                                    </td>
                                    <td className="employee-checklist-table__date">{formatDateTime(history.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default UpdateStaffCheckList;
