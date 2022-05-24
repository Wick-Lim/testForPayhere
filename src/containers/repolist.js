import { Search as SearchIcon, Star as StarIcon, StarBorderOutlined as StarBorderOutlinedIcon } from '@mui/icons-material';
import { Box, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination, Paper, TextField } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import Fallback from '../components/fallback';

const GIT_MAX_REPOS = 1000;
const PER_PAGE = 10;

const RepoList = ({ }) => {
    const { enqueueSnackbar } = useSnackbar();
    const searchFieldRef = useRef();

    const [favors, setFavors] = useState(JSON.parse(localStorage.getItem('favors') || '[]'));
    const [searchText, setSearchText] = useState('tetris');
    const [page, setPage] = useState(100);

    const { data, refetch, isFetching } = useQuery('items', () => axios.get(`/search/repositories?q=${searchText}&sort=stars&order=desc&per_page=10&page=${page}`), {
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false,
    });

    const handleSearch = useCallback(() => {
        if (!searchFieldRef.current)
            return;

        setPage(1);
        setSearchText(searchFieldRef.current.value);
    }, [searchFieldRef]);

    const handlePaginate = useCallback((e, page) => {
        setPage(page);
    }, []);

    useEffect(() => {
        refetch();
    }, [searchText, page]);

    useEffect(() => {
        localStorage.setItem('favors', JSON.stringify(favors));
    }, [favors]);

    const handleFavor = (item) => {
        if (!!favors.find((f) => f.id === item.id)) {
            setFavors(favors.filter((f) => f.id !== item.id));
            enqueueSnackbar('리포지터리가 등록해제되었습니다.', { variant: 'success' });
        } else {
            if (favors.length >= 4)
                return enqueueSnackbar('최대 등록 갯수를 초과했습니다. (최대 4개)', { variant: 'warning' });

            setFavors(favors.concat(item));
            enqueueSnackbar('리포지터리가 등록되었습니다.', { variant: 'success' });
        }
    }

    return (
        <>
            <Paper>
                <Box display='flex' flexDirection='row' alignItems='center' width='300px' padding='4px'>
                    <TextField inputRef={searchFieldRef} variant='standard' placeholder='여기에서 검색' fullWidth />
                    <IconButton onClick={handleSearch}>
                        <SearchIcon />
                    </IconButton>
                </Box>
            </Paper>
            <List>
                {data?.data?.items?.map((item) => {
                    const favor = !!favors.find((f) => f.id === item.id);

                    return <ListItem key={`li-${item.id}`}>
                        <ListItemText primary={item.name} />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => handleFavor(item)}>
                                {favor ? <StarIcon /> : <StarBorderOutlinedIcon />}
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                })}
            </List>
            <Box display='flex' flexDirection='row' justifyContent='center'>
                <Pagination page={page} count={Math.ceil(Math.min(data?.data?.total_count || 0, GIT_MAX_REPOS) / PER_PAGE)} onChange={handlePaginate} />
            </Box>

            <Fallback open={isFetching} label='불러오는 중...' />
        </>
    );
}

export default RepoList;