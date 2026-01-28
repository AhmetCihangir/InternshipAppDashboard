import { useState, useEffect } from "react";
import { Widget } from "../utils/components";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useStateContext } from "../utils/StateContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api/productivity-stats";

const WidgetPieChart = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get real data from StateContext (Firestore)
    const { internList, todoList } = useStateContext();

    useEffect(() => {
        // Fetch data when internList or todoList changes
        if (internList && todoList) {
            fetchProductivityData();
        }
    }, [internList, todoList]);

    const fetchProductivityData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if we have real data from Firestore
            const hasRealData = internList && internList.length > 0 && todoList && todoList.length > 0;

            let response;

            if (hasRealData) {
                // Use POST with real Firestore data
                const users = internList.map(user => ({
                    userID: user.getUserID(),
                    name: user.getName(),
                    department: user.getDepartment(),
                    role: user.getRole()
                }));

                const todos = todoList.map(todo => ({
                    title: todo.getTitle(),
                    description: todo.getDescription(),
                    status: todo.getStatus(),
                    priority: todo.getPriority(),
                    value: todo.getValue(),
                    responsibleUsers: todo.getResponsibleUsers().map(u => u.getUserID()),
                    departments: todo.getDepartments()
                }));

                console.log("Sending real Firestore data to backend:", { users: users.length, todos: todos.length });

                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ users, todos })
                });
            } else {
                // Fallback to GET with mock data
                console.log("No Firestore data available, using mock data");
                response = await fetch(API_URL);
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === "success") {
                setData(result.data);
            } else {
                throw new Error(result.message || "Failed to fetch data");
            }
        } catch (err) {
            setError(err.message);
            console.error("Error fetching productivity data:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Widget title="Productivity / Efficiency" index={2}>
            <Box sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                minHeight: '70vh',
                overflowY: 'auto',
                backgroundColor: '#03045e'
            }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <CircularProgress sx={{ color: '#00d4aa' }} />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        Failed to load productivity data: {error}
                        <br />
                        <Typography variant="caption" sx={{ mt: 1 }}>
                            Make sure the Flask backend is running on port 5001
                        </Typography>
                    </Alert>
                )}

                {data && !loading && (
                    <>
                        {/* Data Source Indicator */}
                        <Typography variant="caption" sx={{ color: '#8892b0', mb: 1 }}>
                            {data.user_count ? `📊 Real Data (${data.user_count} users, ${data.total_tasks} tasks)` : '📋 Mock Data'}
                        </Typography>

                        {/* Section 1: Team Members - Individual Efficiency */}
                        <Typography variant="h5" sx={{ color: '#caf0f8', mb: 2, fontWeight: 'bold' }}>
                            Team Members - Efficiency Scores
                        </Typography>
                        {data.charts.person_charts && Object.keys(data.charts.person_charts).length > 0 ? (
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 2,
                                width: '100%',
                                mb: 4
                            }}>
                                {Object.entries(data.charts.person_charts).map(([name, chartBase64]) => (
                                    <ChartImage
                                        key={name}
                                        base64={chartBase64}
                                        alt={`${name}'s Efficiency`}
                                    />
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" sx={{ color: '#8892b0', mb: 4 }}>
                                No team member data available
                            </Typography>
                        )}

                        {/* Section 2: Task Difficulty Distribution + Upcoming Tasks by User */}
                        <Typography variant="h5" sx={{ color: '#caf0f8', mb: 2, fontWeight: 'bold' }}>
                            Task Overview
                        </Typography>
                        <ChartRow>
                            {data.charts.difficulty_pie_base64 && (
                                <ChartImage
                                    base64={data.charts.difficulty_pie_base64}
                                    alt="Task Difficulty Distribution"
                                />
                            )}
                            {data.charts.upcoming_by_user_bar_base64 && (
                                <ChartImage
                                    base64={data.charts.upcoming_by_user_bar_base64}
                                    alt="Upcoming Tasks by User"
                                />
                            )}
                        </ChartRow>

                        {/* Section 3: Per-Person Weekly Trends */}
                        <Typography variant="h5" sx={{ color: '#caf0f8', mt: 4, mb: 2, fontWeight: 'bold' }}>
                            Weekly Efficiency Trends by Member
                        </Typography>
                        {data.charts.person_weekly_trends && Object.keys(data.charts.person_weekly_trends).length > 0 ? (
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 2,
                                width: '100%'
                            }}>
                                {Object.entries(data.charts.person_weekly_trends).map(([name, chartBase64]) => (
                                    <ChartImage
                                        key={name}
                                        base64={chartBase64}
                                        alt={`${name}'s Weekly Trend`}
                                    />
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" sx={{ color: '#8892b0' }}>
                                No weekly trend data available
                            </Typography>
                        )}
                    </>
                )}
            </Box>
        </Widget>
    );
};

// Chart Row Container
const ChartRow = ({ children }) => (
    <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        width: '100%',
        mb: 2
    }}>
        {children}
    </Box>
);

// Reusable Chart Image Component
const ChartImage = ({ base64, alt }) => (
    <Box sx={{
        backgroundColor: 'rgba(26, 26, 46, 0.8)',
        borderRadius: 2,
        p: 1,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    }}>
        <img
            src={`data:image/png;base64,${base64}`}
            alt={alt}
            style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '8px'
            }}
        />
    </Box>
);

export default WidgetPieChart;
