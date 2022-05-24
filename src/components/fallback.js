import { CircularProgress, Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const Fallback = ({ open, label }) => {

    return (
        <Modal open={open}>
            <Box display='flex' flexDirection='column' width='100%' height='100%' justifyContent='center' alignItems='center'>
                <CircularProgress />
                <Typography color='white'>
                    {label}
                </Typography>
            </Box>
        </Modal>
    )
}

export default Fallback;