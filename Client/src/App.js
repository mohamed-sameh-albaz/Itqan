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
import AddPostPage from './views/AddPostPage'; // Import the new component
import ProfilePage from './views/ProfilePage';
import PostsPage from './views/PostsPage';
import SummaryPage from './views/SummaryPage';
import DetailedPage from './views/DetailedPage';

import SubmissionsPage from './views/SubmissionsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/community/:name" element={<CommunityPage />} />
          <Route path="/community/:name/group/:id" element={<GroupPage />} />
          <Route path="/contest" element={<ContestPage />} />
          <Route path="/team/create" element={<TeamEditor />} />
          <Route path="/teams" element={<TeamsPage />} />

          <Route path="/community/:name/stats/summary" element={<SummaryPage/>} />
          <Route path="/community/:name/stats/detailed" element={<DetailedPage/>} />

          <Route path="/profile/:id" element={<ProfilePage/>} /> 
          <Route path="/community/:name/posts" element={<PostsPage/>} /> 
          <Route path="/community/:name/posts/edit" element={<AddPostPage editing={false} />} /> 
          <Route path="/community/:name/posts/edit/:post_id" element={<AddPostPage editing={true} />} /> 


          <Route path="/sub" element={<SubmissionsPage />} />

          <Route path="/community/:name/group/:groupID/create" element={<ContestPage MODE={"create"} />} />
          <Route path="/community/:name/group/:groupID/contest/:contestID/edit" element={<ContestPage MODE={"edit"} />} />
          <Route path="/community/:name/group/:groupID/contest/:contestID/show" element={<ContestPage MODE={"submit"} />} />
        


        </Routes>
      </div>
    </Router>
  );
}

export default App;
