import React, { createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

import ApprovePage from './views/AprovePage'
import SubmissionsPage from './views/SubmissionsPage';

import { AuthProvider, ProtectedRoute} from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
            <Route path="/community/:name" element={<ProtectedRoute element={<CommunityPage />} />} />
            <Route path="/community/:name/group/:id" element={<ProtectedRoute element={<GroupPage />} />} />
            <Route path="/contest" element={<ProtectedRoute element={<ContestPage />} />} />
            <Route path="/team/create" element={<ProtectedRoute element={<TeamEditor />} />} />
            <Route path="/teams" element={<ProtectedRoute element={<TeamsPage />} />} />

            <Route path="/community/:name/stats/summary" element={<ProtectedRoute element={<SummaryPage />} />} />
            <Route path="/community/:name/stats/detailed" element={<ProtectedRoute element={<DetailedPage />} />} />

            <Route path="/profile/:id" element={<ProtectedRoute element={<ProfilePage />} />} />
            <Route path="/community/:name/posts" element={<ProtectedRoute element={<PostsPage />} />} />
            <Route path="/community/:name/posts/edit" element={<ProtectedRoute element={<AddPostPage editing={false} />} />} />
            <Route path="/community/:name/posts/edit/:post_id" element={<ProtectedRoute element={<AddPostPage editing={true} />} />} />

            <Route path="/sub" element={<ProtectedRoute element={<SubmissionsPage />} />} />

            <Route path="/community/:name/group/:groupID/create" element={<ProtectedRoute element={<ContestPage MODE={"create"} />} />} />
            <Route path="/community/:name/group/:groupID/contest/:contestID/edit" element={<ProtectedRoute element={<ContestPage MODE={"edit"} />} />} />
            <Route path="/community/:name/group/:groupID/contest/:contestID/show" element={<ProtectedRoute element={<ContestPage MODE={"submit"} />} />} />
            <Route path="/community/:name/group/:groupID/contest/:contestID/approve" element={<ProtectedRoute element={<ApprovePage />} />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
