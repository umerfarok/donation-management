import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';

import 'bootstrap/dist/css/bootstrap.min.css';
import './CollectionPage.css';
import DeleteUser from './DeleteUser';

const CollectionPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('jwt');
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (error) {
      const errorTimeout = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(errorTimeout);
    }
  }, [error]);

  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };
      const response = await axios.get('http://localhost:4000/home', config);
      setUsers(response.data);
      setLoading(false);
      setError('');
    } catch (error) {
      handleError('Failed to fetch users. Please try again.');
    }
  };

  const handleMoneyUpdate = async (userId, amount) => {
    const parsedAmount = parseFloat(amount); // Parse input value to a number
    console.log(parsedAmount);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          amount: parsedAmount,
        },
      };
      const response = await axios.patch(`http://localhost:4000/users/${userId}`, config);
      if (response.status === 200) {
        fetchUsers();
        setError('');
      } else {
        handleError('Failed to update money. Please try again.');
      }
    } catch (error) {
      handleError('Failed to update money. Please try again.');
    }
  };

  const handleDeleteUser = async (userId, password) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          password,
        },
      };
      const response = await axios.delete(`http://localhost:4000/users/${userId}`, config);
      if (response.status === 200) {
        fetchUsers();
        setError('');
      } else {
        handleError('Failed to delete user. Please try again.');
      }
    } catch (error) {
      handleError('Failed to delete user. Please try again.');
    }
  };

  const handleError = (errorMessage) => {
    console.error(errorMessage);
    setError(errorMessage);
  };

  return (
    <div className="container">
      <h2>Collection Page</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {loading ? (
        <div className="loader-container">
          <BeatLoader color="Green" loading={loading} size={15} />
        </div>
      ) : (
        users.map((user) => {
          return (
            
            <div key={user._id} className="user-card">
              <p className="user-info">
                <strong>Name:</strong> {user.name}
              </p>
              <p className="user-info">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="user-info">
                <strong>Team Name:</strong> {user.teamName}
              </p>
              <p className="user-info">
                <strong>Money:</strong> {user.money}
              </p>
              <div className="money-actions">
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    onChange={(e) => handleMoneyUpdate(user._id, e.target.value)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary"
                      onClick={(e) => handleMoneyUpdate(user._id, e.target.value)}
                    >
                      Add Money
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => handleMoneyUpdate(user._id, -e.target.value)}
                    >
                      Remove Money
                    </button>
                  </div>
                </div>
              </div>
              <DeleteUser userId={user._id} onDeleteUser={handleDeleteUser} />
            </div>
          );
        })
      )}
    </div>
  );
};

export default CollectionPage;
