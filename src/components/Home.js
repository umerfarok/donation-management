import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { BeatLoader } from 'react-spinners';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { REACT_API_ENDPOINT } from '../constants';

function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  useEffect(() => {
    if (token) {
    fetchUsers();}
    else {
navigate('/login')
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };
      const response = await axios.get(`${REACT_API_ENDPOINT}/home`, config);
      // if (response.status === 401) {
      //   // Handle unauthorized access, such as clearing token and redirecting to login page
      //   setIsLoggedIn(false);
      //   setJwt(null);
      //   localStorage.removeItem('jwt');
      //   // Redirect to login page
      //   return <Navigate to="/login" />;
      // }
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMMM dd, yyyy HH:mm:ss');
  };

  return (
    <div className="home-container">
      <h2 className="home-title">Home</h2>
      {loading ? (
        <div className="loader-container">
          <BeatLoader color="Green" loading={loading} size={15} />
        </div>
      ) : users.length === 0 ? (
        <div className="no-users-message">No users found.</div>
      ) : (
        <div className="user-list">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <h3 className="user-name">{user.name}</h3>
              <p className="user-email">Email: {user.email}</p>
              <p className="user-email">Money: {user.money}</p>
              <p className="user-email">Team: {user.teamName  }</p>
              <p className="user-date">Date: {formatDate(user.date)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
