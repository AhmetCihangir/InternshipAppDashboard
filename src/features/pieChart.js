import { useState, useEffect } from "react";
import { Widget } from "../utils/components";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api/productivity-stats";

const WidgetPieChart = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProductivityData();
    }, []);

    const fetchProductivityData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(API_URL);

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
                        {/* Section 1: Team Members - Individual Efficiency */}
                        <Typography variant="h5" sx={{ color: '#caf0f8', mb: 2, fontWeight: 'bold' }}>
                            👥 Team Members - Efficiency Scores
                        </Typography>
                        {data.charts.person_charts && (
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
                        )}

                        {/* Section 2: Task Difficulty Distribution + Upcoming Tasks by User */}
                        <Typography variant="h5" sx={{ color: '#caf0f8', mb: 2, fontWeight: 'bold' }}>
                            📊 Task Overview
                        </Typography>
                        <ChartRow>
                            <ChartImage
                                base64={data.charts.difficulty_pie_base64}
                                alt="Task Difficulty Distribution"
                            />
                            <ChartImage
                                base64={data.charts.upcoming_by_user_bar_base64}
                                alt="Upcoming Tasks by User"
                            />
                        </ChartRow>

                        {/* Section 3: Per-Person Weekly Trends */}
                        <Typography variant="h5" sx={{ color: '#caf0f8', mt: 4, mb: 2, fontWeight: 'bold' }}>
                            � Weekly Efficiency Trends by Member
                        </Typography>
                        {data.charts.person_weekly_trends && (
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

// Reusable Stat Card Component
const StatCard = ({ label, value, color }) => (
    <Box sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 2,
        p: 2,
        textAlign: 'center',
        border: `1px solid ${color}33`,
        minWidth: '120px'
    }}>
        <Typography variant="h4" sx={{ color: color, fontWeight: 'bold' }}>
            {value}
        </Typography>
        <Typography variant="body2" sx={{ color: '#8892b0', mt: 0.5 }}>
            {label}
        </Typography>
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
