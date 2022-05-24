import { Add as AddIcon, Star as StarIcon } from '@mui/icons-material';
import { Box, Fab, IconButton, List, ListItem, ListItemButton, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material';
import { Container } from '@mui/system';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { Fragment, useEffect, useState } from 'react';

const PER_PAGE = 5;

const FavorList = ({ }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [favors, setFavors] = useState(JSON.parse(localStorage.getItem('favors') || '[]'));
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`https://api.github.com/repos/${selected?.owner.login}/${selected?.name}/issues?page=1&per_page=${PER_PAGE}`).then((res) => {
            setPage(1);
            setData(res.data);
        }).catch((r) => enqueueSnackbar(r?.message || '에러가 발생했습니다.', { variant: 'warning' }));
    }, [selected]);

    useEffect(() => {
        localStorage.setItem('favors', JSON.stringify(favors));
    }, [favors]);

    const handleFavor = (item) => {
        setFavors(favors.filter((f) => f.id !== item.id));
        enqueueSnackbar('리포지터리가 등록해제되었습니다.', { variant: 'success' });
    }

    const handleClick = (item) => {
        if (selected?.id === item.id)
            return setSelected(null);

        setSelected(item);
    }

    const handleMore = () => {
        axios.get(`https://api.github.com/repos/${selected?.owner.login}/${selected?.name}/issues?page=${page + 1}&per_page=${PER_PAGE}`).then((res) => {
            if (!res.data.length)
                return enqueueSnackbar('더이상 없습니다.', { variant: 'info' });

            setPage(page + 1);
            setData(data.concat(res.data));
        }).catch((r) => enqueueSnackbar(r?.message || '에러가 발생했습니다.', { variant: 'warning' }));
    };

    return (
        <>
            <List>
                {favors?.map((item) => {
                    const isSelected = selected?.id === item.id;

                    return (
                        <Fragment key={`li-${item.id}`}>
                            <ListItemButton selected={isSelected} onClick={() => handleClick(item)}>
                                <ListItemText primary={item.name} />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => handleFavor(item)}>
                                        <StarIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        </Fragment>
                    );

                })}
            </List>

            <Box flex='1' display='flex' flexDirection='column' overflow='scroll' padding='0px 24px'>
                {selected && <Typography variant='h6'>{selected?.name || ''}의 이슈</Typography>}
                {!selected && <Typography variant='subtitle1'>이슈를 보려면 레포지터리를 선택해주세요.</Typography>}
                <Box flex='1'>
                    <List>
                        {data?.map((issue, index) => {

                            return <ListItem key={`i-${index}`}>
                                <ListItemText primary={issue.title} />
                            </ListItem>
                        })}
                    </List>
                </Box>
                {selected && <Box display='flex' flexDirection='row' justifyContent='center' padding='8px'>
                    <Fab onClick={handleMore}>
                        <AddIcon />
                    </Fab>
                </Box>}
            </Box>
        </>
    );
}

export default FavorList;