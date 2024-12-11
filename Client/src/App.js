import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './views/Landing';
import Auth from './views/Auth';
import './App.css';
import HomePage from './views/HomePage';
import CommunityPage from './views/CommunityPage';
import GroupPage from './views/GroupPage';
import ContestPage from './views/ContestPage';
import TeamEditor from "./views/TeamEditor";
import TeamsPage from './views/TeamsPage';
import ProfilePage from './views/ProfilePage';
import PostsPage from './views/PostsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/group" element={<GroupPage />} />
          <Route path="/contest" element={<ContestPage />} />
          <Route path="/teame" element={<TeamEditor />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/profile/:name" element={<ProfilePage/>} /> 
          <Route path="/posts/:name" element={<PostsPage/>} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
