import React, { useState, useEffect } from 'react';
import { Dialog, Slide, Fade, Box, Button, Typography, IconButton, Card, CardHeader, Avatar, } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CropFreeIcon from '@mui/icons-material/CropFree';
import { blue } from '@mui/material/colors';
import { useStateContext } from './StateContext';
import { BG_COLOR, TEXT_COLOR, CARD_COLOR } from './constants';


const Transition = React.forwardRef(function Transition(props, ref) {
    //   return <Slide direction="up" ref={ref} {...props} />;
    return <Fade ref={ref} {...props} />;
});

export function Widget({ children, title = "", height = "25vh", width = "100%", index, }) {
    const [open, setOpen] = useState(false);
    const { pageIndex, setPageIndex } = useStateContext();

    useEffect(() => {
        if (pageIndex === index) {
            setOpen(true);
        }
    }, [pageIndex, index]);

    const handleClose = () => {
        setOpen(false);
        setPageIndex(-1);
    };

    return (
        <Box p={4} sx={{

        }}>

            <Card
                sx={{
                    height: height,
                    width: width,
                    borderRadius: 2,
                    overflowY: 'hidden',
                    backgroundColor: CARD_COLOR,
                    color: TEXT_COLOR,
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: blue[500] }}>
                            F
                        </Avatar>
                    }
                    action={
                        <IconButton onClick={() => setOpen(true)} sx={{ color: TEXT_COLOR }}>
                            <CropFreeIcon />
                        </IconButton>
                    }
                    title={title || "Focus Mode Card"}
                    sx={{
                        color: TEXT_COLOR

                    }}
                />
            </Card>

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <Box p={4} sx={{
                    backgroundColor: BG_COLOR,
                    minHeight : '150vh',
                }}>
                    <IconButton edge="start" sx={{
                        color: TEXT_COLOR
                    }} onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    {children || (<><Typography variant="h4" mt={2} sx={{ color: TEXT_COLOR }}>
                        Smooth Transition {title}
                    </Typography><Typography mt={2} sx={{ color: TEXT_COLOR }}>
                            This dialog uses the standard TransitionComponent prop, but specifically
                            implements React.forwardRef to satisfy React StrictMode and MUI v6 standards.
                        </Typography></>)}
                </Box>
            </Dialog>
        </Box>
    );
}
