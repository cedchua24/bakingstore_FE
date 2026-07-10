import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    LinearProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import { useParams } from "react-router-dom";

import DashboardService from "../OtherService/DashboardService";
import DailySessionService from "../OtherService/DailySessionService";

const StartOfDay = () => {
    const { id } = useParams();
    const [dailySessionList, setDailySessionList] = useState({ data: [] });
    const [validator, setValidator] = useState({ severity: "", message: "", isShow: false });
    const [activeAction, setActiveAction] = useState("");
    const [isFetching, setIsFetching] = useState(true);

    const date = useMemo(() => ({
        today: id,
        user_id: localStorage.getItem("auth_user_id"),
        status: 0,
    }), [id]);

    const formattedDate = useMemo(() => {
        const parsedDate = new Date(`${id}T00:00:00`);
        return Number.isNaN(parsedDate.getTime())
            ? id
            : parsedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
            });
    }, [id]);

    const fetchDailySessionByDate = useCallback(async () => {
        setIsFetching(true);
        try {
            const response = await DailySessionService.fetchDailySessionByDate(id);
            setDailySessionList(response.data);
        } catch (error) {
            console.error("Unable to fetch daily sessions:", error);
            setValidator({
                severity: "error",
                message: "We couldn't load today's sessions. Please try again.",
                isShow: true,
            });
        } finally {
            setIsFetching(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDailySessionByDate();
    }, [fetchDailySessionByDate]);

    const downloadWorkbook = async ({ action, request, fileName, successMessage }) => {
        try {
            setActiveAction(action);
            setValidator(previous => ({ ...previous, isShow: false }));
            await DashboardService.sanctum();
            const response = await request();
            const contentType = response.headers["content-type"] || "";

            if (!contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
                throw new Error("The server returned an unexpected file type.");
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            await fetchDailySessionByDate();
            setValidator({ severity: "success", message: successMessage, isShow: true });
        } catch (error) {
            console.error("Workbook download failed:", error);
            setValidator({
                severity: "error",
                message: "Something went wrong. Please try the action again.",
                isShow: true,
            });
        } finally {
            setActiveAction("");
        }
    };

    const sessions = Array.isArray(dailySessionList.data) ? dailySessionList.data : [];
    const isBusy = Boolean(activeAction);

    return (
        <Box sx={{ minHeight: "100%", bgcolor: "#f7f5f1", py: { xs: 3, md: 5 } }}>
            <Container maxWidth="lg">
                <Stack spacing={3}>
                    <Paper
                        elevation={0}
                        sx={{
                            overflow: "hidden",
                            color: "white",
                            borderRadius: 4,
                            background: "linear-gradient(135deg, #5f3d2e 0%, #9a6247 58%, #d99555 100%)",
                            position: "relative",
                        }}
                    >
                        <Box sx={{ position: "absolute", right: -35, top: -55, width: 210, height: 210, borderRadius: "50%", bgcolor: "rgba(255,255,255,.08)" }} />
                        <Box sx={{ position: "absolute", right: 125, bottom: -75, width: 150, height: 150, borderRadius: "50%", bgcolor: "rgba(255,255,255,.06)" }} />
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "center" }} sx={{ p: { xs: 3, md: 4 }, position: "relative" }}>
                            <Box sx={{ width: 64, height: 64, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: "rgba(255,255,255,.15)", backdropFilter: "blur(6px)" }}>
                                <WbSunnyRoundedIcon sx={{ fontSize: 34, color: "#ffd38d" }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="overline" sx={{ opacity: .78, letterSpacing: 1.8 }}>Daily operations</Typography>
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: .75 }}>Start of Day</Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <TodayRoundedIcon sx={{ fontSize: 18, opacity: .8 }} />
                                    <Typography sx={{ opacity: .9 }}>{formattedDate}</Typography>
                                </Stack>
                            </Box>
                            <Chip
                                label={sessions.length ? `${sessions.length} session${sessions.length === 1 ? "" : "s"}` : "No sessions yet"}
                                sx={{ color: "white", bgcolor: "rgba(255,255,255,.16)", fontWeight: 700 }}
                            />
                        </Stack>
                    </Paper>

                    {validator.isShow && (
                        <Alert severity={validator.severity} onClose={() => setValidator(previous => ({ ...previous, isShow: false }))} sx={{ borderRadius: 2.5 }}>
                            {validator.message}
                        </Alert>
                    )}

                    <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="stretch">
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e9e3dc", flex: 1 }}>
                            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
                                <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: "#fff2df", color: "#a85d22", display: "grid" }}>
                                    <PlayArrowRoundedIcon />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 750 }}>Open today’s session</Typography>
                                    <Typography variant="body2" color="text.secondary">Initialize daily records and download the product report.</Typography>
                                </Box>
                            </Stack>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                disabled={isBusy}
                                startIcon={activeAction === "start" ? <CircularProgress size={18} color="inherit" /> : <PlayArrowRoundedIcon />}
                                onClick={() => downloadWorkbook({
                                    action: "start",
                                    request: () => DashboardService.submitStartOfDay(date.today, date),
                                    fileName: `product_reports_${date.today}.xlsx`,
                                    successMessage: "Good morning! Today's session is ready to go.",
                                })}
                                sx={{ bgcolor: "#8a4f35", py: 1.25, borderRadius: 2, fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#6f3e29" } }}
                            >
                                {activeAction === "start" ? "Starting your day…" : "Start the day"}
                            </Button>
                        </Paper>

                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e9e3dc", flex: 1 }}>
                            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
                                <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: "#edf5ee", color: "#4d7753", display: "grid" }}>
                                    <CloudDownloadRoundedIcon />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 750 }}>Updated price list</Typography>
                                    <Typography variant="body2" color="text.secondary">Export the latest product pricing as an Excel workbook.</Typography>
                                </Box>
                            </Stack>
                            <Button
                                fullWidth
                                size="large"
                                variant="outlined"
                                disabled={isBusy}
                                startIcon={activeAction === "export" ? <CircularProgress size={18} color="inherit" /> : <CloudDownloadRoundedIcon />}
                                onClick={() => downloadWorkbook({
                                    action: "export",
                                    request: () => DashboardService.submitExportPriceList(date.today, date),
                                    fileName: `price_list_${date.today}.xlsx`,
                                    successMessage: "Your updated price list has been downloaded.",
                                })}
                                sx={{ color: "#4d7753", borderColor: "#8dac91", py: 1.25, borderRadius: 2, fontWeight: 700, textTransform: "none", "&:hover": { borderColor: "#4d7753", bgcolor: "#f4f8f4" } }}
                            >
                                {activeAction === "export" ? "Preparing price list…" : "Export price list"}
                            </Button>
                        </Paper>
                    </Stack>

                    <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e9e3dc", overflow: "hidden" }}>
                        {(isFetching || isBusy) && <LinearProgress sx={{ bgcolor: "#f1e6dc", "& .MuiLinearProgress-bar": { bgcolor: "#a86543" } }} />}
                        <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #eee8e2" }}>
                            <Typography variant="h6" sx={{ fontWeight: 750 }}>Session history</Typography>
                            <Typography variant="body2" color="text.secondary">Records created for the selected business date.</Typography>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#fbfaf8" }}>
                                        <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Session ID</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Created</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!isFetching && sessions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3}>
                                                <Stack alignItems="center" spacing={1} sx={{ py: 5, color: "text.secondary" }}>
                                                    <TodayRoundedIcon sx={{ fontSize: 34, color: "#c5b9ad" }} />
                                                    <Typography sx={{ fontWeight: 700, color: "text.primary" }}>No sessions for this date</Typography>
                                                    <Typography variant="body2">Use “Start the day” to create the first one.</Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ) : sessions.map((session) => {
                                        const isOpen = session.status === 0;
                                        return (
                                            <TableRow key={session.id} hover>
                                                <TableCell sx={{ fontWeight: 700 }}>#{session.id}</TableCell>
                                                <TableCell>{session.created_at}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        icon={isOpen ? <CheckCircleRoundedIcon /> : <ErrorOutlineRoundedIcon />}
                                                        label={isOpen ? "Open" : "Closed"}
                                                        sx={{ fontWeight: 700, color: isOpen ? "#3f7048" : "#9b4b42", bgcolor: isOpen ? "#eaf4ec" : "#fbecea", "& .MuiChip-icon": { color: "inherit" } }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Stack>
            </Container>
        </Box>
    );
};

export default StartOfDay;
