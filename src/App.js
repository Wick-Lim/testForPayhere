import { Search as SearchIcon, Star as StarIcon } from '@mui/icons-material';
import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import FavorList from './containers/favorlist';
import RepoList from './containers/repolist';

axios.defaults.baseURL = 'https://api.github.com';

export default function App() {
  const [tab, setTab] = useState('search');

  return (
    <>
      <style>{`
        html, body, #root {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
      `}</style>

      <AppBar position='sticky'>
        <Toolbar>
          <Typography>
            페이히어 테스트 프로젝트
          </Typography>
        </Toolbar>
      </AppBar>
      <Box flex='1' display='flex' flexDirection='column' overflow='hidden' padding='0px 24px'>
        {tab === 'search' && <RepoList />}
        {tab === 'favor' && <FavorList />}
      </Box>
      <footer>
        <Tabs value={tab} onChange={(e, tab) => setTab(tab)} orientation='horizontal' variant='fullWidth' indicatorColor='primary'>
          <Tab value='search' label='검색' icon={<SearchIcon />} />
          <Tab value='favor' label='즐겨찾기' icon={<StarIcon />} />
        </Tabs>
      </footer>

      {/* <Fallback open={isFetching} label='불러오는 중...' /> */}
    </>
  );
}
