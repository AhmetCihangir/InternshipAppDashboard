import { Box, Drawer, Grid, List, IconButton, ListItem, ListItemButton, ListItemText, Card, Typography, TextField, Button } from "@mui/material";

import Widget3true1wrong from "../features/3true1wrong";
import WidgetAutoMailing from "../features/autoMailing";
import WidgetPieChart from "../features/pieChart";
import WidgetProfil from "../features/profil";
import WidgetToDoList from "../features/toDoList";
import { useState } from "react";

import MenuIcon from '@mui/icons-material/Menu';


import { useStateContext } from "../utils/StateContext";
import { BG_COLOR, CARD_COLOR, TEXT_COLOR, WidgetNames } from "../utils/constants";
import { useAuth } from "../utils/AuthContext";


function Main() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, loading, login } = useAuth();

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    }

    return (
        loading ? (<LoginPage />) : (<div style={{
            backgroundColor: BG_COLOR,
        }}>
            <DrawerComponent isOpen={isOpen} toggleOpen={toggleOpen} />
            <WidgetPage />
        </div>)
    );
}

const LoginPage = () => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            flexDirection: 'column',
            backgroundColor: BG_COLOR,
            color: TEXT_COLOR,
        }}>
            <Card sx={{ p: 4, backgroundColor: CARD_COLOR, color: TEXT_COLOR }}>
                <Typography variant="h4" gutterBottom>
                    Please Log In
                </Typography>
                <Typography>
                    You must be logged in to access the dashboard.
                </Typography>

                <TextField label="Email" variant="outlined" fullWidth margin="normal" />
                <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" />
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Log In
                </Button>
            </Card>
        </Box>
    );
}

const DrawerComponent = ({ isOpen, toggleOpen, }) => {
    const { setPageIndex } = useStateContext();
    return (
        <div>
            <IconButton onClick={toggleOpen} sx={{ color: TEXT_COLOR }}>
                <MenuIcon />
            </IconButton>
            <Drawer sx={{
                backgroundColor: BG_COLOR,
                color: TEXT_COLOR,
            }} variant="temporary" anchor="left" open={isOpen} onClose={toggleOpen}>
                <List sx={{ width: 250, p: 2, backgroundColor: BG_COLOR, color: TEXT_COLOR, minHeight: '96.3%' }}>
                    {
                        WidgetNames.map((name, index) => {
                            return (<ListItem disablePadding key={index}>
                                <ListItemButton onClick={() => { setPageIndex(index); toggleOpen(); }}>
                                    <ListItemText primary={name} />
                                </ListItemButton>
                            </ListItem>);
                        })
                    }

                </List>

            </Drawer>
        </div>
    );
}

const WidgetPage = () => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 2
        }}>
            <Grid container spacing={2}>
                <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                    <Widget3true1wrong />
                </Grid>

                <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                    <WidgetAutoMailing />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                    <WidgetPieChart />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                    <WidgetProfil />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                    <WidgetToDoList />
                </Grid>
            </Grid>
        </Box>
    );
}


export default Main;