import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/MyNavbar';
import Footer from '../components/Footer';
import {requestAPI, useAPI} from '../hooks/useAPI';
import { HttpStatusCode } from 'axios';
import { AuthProvider, ProtectedRoute, useAuth} from '../hooks/authProvider';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const nav = useNavigate();

  const auther = useAuth();
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if(isLogin){
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      
      const {data, status} = await requestAPI('/users/login', 'post');
      
      if(status == HttpStatusCode.Ok){
        localStorage.setItem('user', JSON.stringify(data.data.user));
        auther.login(data.data.user);
        nav('/home');
      }else if (status == HttpStatusCode.Unauthorized) {
        alert("Invalid email or password");
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      } else {
        alert("Something went wrong please try again");
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }

    }else{
      const firstname = document.getElementById('formFirstName').value;
      const lastname = document.getElementById('formLastName').value;

      const {data, status} = await requestAPI('/users', 'post', {body: {firstname, lastname, email, password, bio}});

      if(status > 199 && status < 300){
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        nav('/home');
      } else{
        console.log(data)
        alert("Error: "+ data.details[0].error);
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <div className="flex flex-1 items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="formFirstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="formFirstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="formLastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="formLastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            {!isLogin && (
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Tell us about yourself"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <button
            onClick={toggleForm}
            className="w-full mt-4 text-center text-primary hover:underline"
          >
            {isLogin ? 'Create an account' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Auth;
