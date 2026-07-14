import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { Alert, Button, Form } from 'react-bootstrap';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LinearProgress from '@mui/material/LinearProgress';
import CheckListTransactionService from "../CheckList/CheckListTransactionService";
import UserService from "../User/UserService.service";
import './StaffCheckList.css';

const StaffCheckList = () => {
    const { id } = useParams();
    const initialFilters = {
        dateTo: id,
        dateFrom: id,
        frequency: '',
        time_of_day: '',
        assignee: 0,
        checker: 0,
        status: 0
    };

    const [userList, setUserList] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(false);
    const [checkListList, setCheckListList] = useState([]);
    const [requestError, setRequestError] = useState('');

    useEffect(() => {
        fetchCheckList(initialFilters);
        fetchUserList();
    }, []);

    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setFilters(current => ({ ...current, [name]: value }));
    };

    const fetchUserList = () => {
        UserService.fetchUserList()
            .then(response => setUserList(response.data))
            .catch(error => console.error("Unable to load users:", error));
    };

    const fetchCheckList = (requestFilters = filters) => {
        setIsLoading(true);
        setRequestError('');

        CheckListTransactionService.fetchCheckListByDate(requestFilters)
            .then(response => setCheckListList(Array.isArray(response.data) ? response.data : []))
            .catch(error => {
                console.error("Unable to load employee checklists:", error);
                setRequestError(error.response?.data?.message || 'Unable to load employee checklists. Please try again.');
            })
            .finally(() => setIsLoading(false));
    };

    const submitFilters = (event) => {
        event.preventDefault();
        fetchCheckList();
    };

    const resetFilters = () => {
        setFilters(initialFilters);
    };

    const statusColor = {
        PENDING: '#b77908',
        SENT_TO_SUPERVISOR: '#1976d2',
        APPROVED: '#2e7d45',
        REJECTED: '#c03932',
        NOT_APPLICABLE: '#6c757d',
    };

    const gradeMap = {
        1: { label: 'Poor', icon: '❌', className: 'poor' },
        2: { label: 'Needs Improvement', icon: '⚠️', className: 'needs-improvement' },
        3: { label: 'Satisfactory', icon: '👌', className: 'satisfactory' },
        4: { label: 'Good', icon: '👍', className: 'good' },
        5: { label: 'Excellent', icon: '🏆', className: 'excellent' },
    };
    const checkerGradeMap = {
        1: { icon: '❌', className: 'poor' },
        5: { icon: '🏆', className: 'excellent' },
    };

    const timeOfDayIcon = {
        MORNING: '🌅',
        AFTERNOON: '☀️',
        EVENING: '🌙'
    };

    const statusClass = (status) => String(status || 'PENDING').toLowerCase().replaceAll('_', '-');
    const formatLabel = (value) => String(value || '—').replaceAll('_', ' ');
    const canUpdate = (status) => !['APPROVED', 'REJECTED', 'NOT_APPLICABLE'].includes(status);
    const gradedCheckLists = checkListList.filter(checkListItem => (
        checkListItem.status !== 'NOT_APPLICABLE'
        && Number(checkListItem.grade) > 0
    ));
    const averageGrade = gradedCheckLists.length > 0
        ? gradedCheckLists.reduce((total, checkListItem) => total + Number(checkListItem.grade), 0) / gradedCheckLists.length
        : 0;
    const gradedCheckerCheckLists = checkListList.filter(checkListItem => (
        checkListItem.status !== 'NOT_APPLICABLE'
        && Number(checkListItem.grade_checker) > 0
    ));
    const averageCheckerGrade = gradedCheckerCheckLists.length > 0
        ? gradedCheckerCheckLists.reduce((total, checkListItem) => total + Number(checkListItem.grade_checker), 0) / gradedCheckerCheckLists.length
        : 0;
    const gradeVerdict = averageGrade >= 4.5
        ? { icon: '🏆', label: 'Excellent', detail: 'Performance consistently exceeds expectations.', className: 'excellent' }
        : averageGrade >= 3.5
            ? { icon: '👍', label: 'Good', detail: 'Performance meets expectations with strong results.', className: 'good' }
            : averageGrade >= 2.5
                ? { icon: '👌', label: 'Satisfactory', detail: 'Performance meets the basic checklist requirements.', className: 'satisfactory' }
                : averageGrade >= 1.5
                    ? { icon: '⚠️', label: 'Needs Improvement', detail: 'Several checklist areas require closer attention.', className: 'needs-improvement' }
                    : averageGrade > 0
                        ? { icon: '❌', label: 'Poor', detail: 'Performance requires immediate improvement and follow-up.', className: 'poor' }
                        : { icon: '📋', label: 'No Grade Yet', detail: 'Complete a graded checklist to calculate a verdict.', className: 'empty' };
    const checkerVerdict = averageCheckerGrade >= 4.5
        ? { icon: '🏆', label: 'Excellent', detail: 'Checker reviews were completed consistently.', className: 'excellent' }
        : averageCheckerGrade >= 3.5
            ? { icon: '👍', label: 'Good', detail: 'Most checker reviews were completed as required.', className: 'good' }
            : averageCheckerGrade >= 2.5
                ? { icon: '👌', label: 'Satisfactory', detail: 'Checker review performance meets the basic requirements.', className: 'satisfactory' }
                : averageCheckerGrade >= 1.5
                    ? { icon: '⚠️', label: 'Needs Improvement', detail: 'Several checker reviews require closer follow-up.', className: 'needs-improvement' }
                    : averageCheckerGrade > 0
                        ? { icon: '❌', label: 'Poor', detail: 'Checker review performance requires immediate improvement.', className: 'poor' }
                        : { icon: '📋', label: 'No Grade Yet', detail: 'Complete a checker review to calculate a verdict.', className: 'empty' };

    return (
        <div className="staff-checklist-page">
            <section className="staff-checklist-hero">
                <div className="staff-checklist-hero__icon"><AssignmentRoundedIcon /></div>
                <div>
                    <span>Employee operations</span>
                    <h1>Staff Checklists</h1>
                    <p>Find assigned tasks, review progress, and open checklists that still need attention.</p>
                </div>
                <div className="staff-checklist-hero__total">
                    <strong>{checkListList.length}</strong>
                    <span>records</span>
                </div>
            </section>

            {requestError && (
                <Alert variant="danger" dismissible onClose={() => setRequestError('')} className="staff-checklist-alert">
                    <strong>Could not load checklists.</strong> {requestError}
                </Alert>
            )}

            <section className="staff-checklist-card staff-checklist-filters">
                {isLoading && <LinearProgress color="warning" />}
                <div className="staff-checklist-card__header">
                    <div className="staff-checklist-card__title">
                        <div className="staff-checklist-card__icon"><FilterAltRoundedIcon /></div>
                        <div>
                            <span>Search tools</span>
                            <h2>Filter checklists</h2>
                        </div>
                    </div>
                    <Button variant="link" type="button" className="staff-checklist-reset" onClick={resetFilters}>
                        Reset filters
                    </Button>
                </div>

                <Form onSubmit={submitFilters}>
                    <div className="staff-checklist-filter-grid">
                        <Form.Group className="staff-checklist-field" controlId="staffChecklistDateFrom">
                            <Form.Label>Date from <span>*</span></Form.Label>
                            <Form.Control type="date" name="dateFrom" value={filters.dateFrom} onChange={onChangeInput} required />
                        </Form.Group>

                        <Form.Group className="staff-checklist-field" controlId="staffChecklistDateTo">
                            <Form.Label>Date to <span>*</span></Form.Label>
                            <Form.Control type="date" name="dateTo" value={filters.dateTo} onChange={onChangeInput} required />
                        </Form.Group>

                        <Form.Group className="staff-checklist-field" controlId="staffChecklistStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={filters.status}
                                onChange={onChangeInput}
                                style={{ color: statusColor[filters.status] || '#4d433d', fontWeight: filters.status ? 700 : 400 }}
                            >
                                <option value={0}>All statuses</option>
                                <option value="PENDING" style={{ color: '#b77908' }}>🟠 PENDING</option>
                                <option value="SENT_TO_SUPERVISOR" style={{ color: '#1976d2' }}>🔵 SENT TO SUPERVISOR</option>
                                <option value="APPROVED" style={{ color: '#2e7d45' }}>🟢 APPROVED</option>
                                <option value="REJECTED" style={{ color: '#c03932' }}>🔴 REJECTED</option>
                                <option value="NOT_APPLICABLE" style={{ color: '#6c757d' }}>⚪ NOT APPLICABLE</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="staff-checklist-field" controlId="staffChecklistTime">
                            <Form.Label>Time of day</Form.Label>
                            <Form.Select
                                name="time_of_day"
                                value={filters.time_of_day}
                                onChange={onChangeInput}
                                style={{
                                    color: filters.time_of_day === 'MORNING'
                                        ? '#b77908'
                                        : filters.time_of_day === 'AFTERNOON'
                                            ? '#0b87a1'
                                            : filters.time_of_day === 'EVENING'
                                                ? '#0d6efd'
                                                : '#4d433d',
                                    fontWeight: filters.time_of_day ? 700 : 400
                                }}
                            >
                                <option value="">All schedules</option>
                                <option value="MORNING">🌅 MORNING</option>
                                <option value="AFTERNOON">☀️ AFTERNOON</option>
                                <option value="EVENING">🌙 EVENING</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="staff-checklist-field" controlId="staffChecklistAssignee">
                            <Form.Label>Assignee</Form.Label>
                            <Form.Select name="assignee" value={filters.assignee} onChange={onChangeInput}>
                                <option value={0}>All assignees</option>
                                {userList.map(user => <option value={user.id} key={user.id}>{user.name}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="staff-checklist-field" controlId="staffChecklistChecker">
                            <Form.Label>Checker</Form.Label>
                            <Form.Select name="checker" value={filters.checker} onChange={onChangeInput}>
                                <option value={0}>All checkers</option>
                                {userList.map(user => <option value={user.id} key={user.id}>{user.name}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="staff-checklist-field" controlId="staffChecklistFrequency">
                            <Form.Label>Frequency</Form.Label>
                            <Form.Select name="frequency" value={filters.frequency} onChange={onChangeInput}>
                                <option value="">All frequencies</option>
                                <option value="DAILY">DAILY</option>
                                <option value="WEEKLY">WEEKLY</option>
                                <option value="MONTHLY">MONTHLY</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="staff-checklist-filter-action">
                            <Button type="submit" disabled={isLoading}>
                                <SearchRoundedIcon />
                                {isLoading ? 'Searching...' : 'Search checklists'}
                            </Button>
                        </div>
                    </div>
                </Form>
            </section>

            <section className="staff-checklist-card staff-checklist-results">
                <div className="staff-checklist-card__header">
                    <div className="staff-checklist-card__title">
                        <div className="staff-checklist-card__icon staff-checklist-card__icon--results"><AssignmentRoundedIcon /></div>
                        <div>
                            <span>Employee tasks</span>
                            <h2>Checklist records</h2>
                        </div>
                    </div>
                    <div className="staff-checklist-results__count">{checkListList.length} found</div>
                </div>

                <div className="staff-checklist-table-wrap">
                    <table className="staff-checklist-table">
                        <thead>
                            <tr>
                                <th>Checklist</th>
                                <th>Assignee</th>
                                <th>Checker</th>
                                <th>Schedule</th>
                                <th>Frequency</th>
                                <th>Comment</th>
                                <th>Status</th>
                                <th>Assignee Grade</th>
                                <th>Checker Grade</th>
                                <th>Date</th>
                                <th aria-label="Actions"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading && checkListList.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="staff-checklist-table__empty">
                                        <InboxRoundedIcon />
                                        <strong>No checklists found</strong>
                                        <span>Try changing the filters or selecting a wider date range.</span>
                                    </td>
                                </tr>
                            ) : checkListList.map(checkListItem => {
                                const grade = gradeMap[checkListItem.grade];
                                const checkerGrade = checkerGradeMap[checkListItem.grade_checker];
                                return (
                                    <tr key={checkListItem.id}>
                                        <td className="staff-checklist-table__name">{checkListItem.check_list_name}</td>
                                        <td>{checkListItem.assignee_name || '—'}</td>
                                        <td>{checkListItem.checker_name || '—'}</td>
                                        <td>
                                            <span className={`staff-checklist-pill staff-checklist-pill--${String(checkListItem.time_of_day || '').toLowerCase()}`}>
                                                <span>{timeOfDayIcon[checkListItem.time_of_day]}</span>
                                                {formatLabel(checkListItem.time_of_day)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`staff-checklist-pill staff-checklist-pill--${String(checkListItem.frequency || '').toLowerCase()}`}>
                                                {formatLabel(checkListItem.frequency)}
                                            </span>
                                        </td>
                                        <td className="staff-checklist-table__comment">{checkListItem.comment || 'No comment'}</td>
                                        <td>
                                            <span className={`staff-checklist-status staff-checklist-status--${statusClass(checkListItem.status)}`}>
                                                <span />{formatLabel(checkListItem.status)}
                                            </span>
                                        </td>
                                        <td>
                                            {grade ? (
                                                <span className={`staff-checklist-grade staff-checklist-grade--${grade.className}`}>
                                                    <span>{grade.icon}</span>
                                                    <strong>{checkListItem.grade}</strong>
                                                    {grade.label}
                                                </span>
                                            ) : <span className="staff-checklist-table__muted">—</span>}
                                        </td>
                                        <td>
                                            {checkerGrade ? (
                                                <span className={`staff-checklist-grade staff-checklist-grade--${checkerGrade.className}`}>
                                                    <span>{checkerGrade.icon}</span>
                                                    <strong>{checkListItem.grade_checker}</strong>
                                                </span>
                                            ) : <span className="staff-checklist-table__muted">—</span>}
                                        </td>
                                        <td className="staff-checklist-table__date">{checkListItem.date || '—'}</td>
                                        <td>
                                            {canUpdate(checkListItem.status) ? (
                                                <Link className="staff-checklist-edit" to={`/employee/updateStaffCheckList/${checkListItem.id}`}>
                                                    <EditRoundedIcon /> Update
                                                </Link>
                                            ) : (
                                                <span className="staff-checklist-complete">Closed</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="staff-checklist-score">
                    <div className="staff-checklist-score__header">
                        <span>Performance averages</span>
                        <small>Calculated from graded records only · Not Applicable excluded</small>
                    </div>
                    <div className="staff-checklist-score__grid">
                        <article className="staff-checklist-score-card">
                            <div className="staff-checklist-score-card__top">
                                <div>
                                    <span>Assignee average</span>
                                    <small>{gradedCheckLists.length} graded checklist{gradedCheckLists.length === 1 ? '' : 's'}</small>
                                </div>
                                <strong>{averageGrade.toFixed(2)}</strong>
                            </div>
                            <div className={`staff-checklist-verdict staff-checklist-verdict--${gradeVerdict.className}`}>
                                <span className="staff-checklist-verdict__icon">{gradeVerdict.icon}</span>
                                <div>
                                    <small>Assignee verdict</small>
                                    <b>{gradeVerdict.label}</b>
                                    <p>{gradeVerdict.detail}</p>
                                </div>
                            </div>
                        </article>

                        <article className="staff-checklist-score-card">
                            <div className="staff-checklist-score-card__top">
                                <div>
                                    <span>Checker average</span>
                                    <small>{gradedCheckerCheckLists.length} graded checklist{gradedCheckerCheckLists.length === 1 ? '' : 's'}</small>
                                </div>
                                <strong>{averageCheckerGrade.toFixed(2)}</strong>
                            </div>
                            <div className={`staff-checklist-verdict staff-checklist-verdict--${checkerVerdict.className}`}>
                                <span className="staff-checklist-verdict__icon">{checkerVerdict.icon}</span>
                                <div>
                                    <small>Checker verdict</small>
                                    <b>{checkerVerdict.label}</b>
                                    <p>{checkerVerdict.detail}</p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StaffCheckList;
