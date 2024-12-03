import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './views/Landing';
import Auth from './views/Auth';
import './App.css';
import HomePage from './views/HomePage';
import CommunityPage from './views/CommunityPage';
import GroupPage from './views/GroupPage';
import ContestPage from './views/ContestPage';
import TeamEditorBlock from './components/TeamEditorBlock';
import TeamEditor from "./views/TeamEditor";
import Dropdown from "./components/test"

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
          <Route path="/teameb" element={<TeamEditorBlock />} />
          <Route path="/teame" element={<TeamEditor />} />
          <Route path="/test" element={<Dropdown />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
