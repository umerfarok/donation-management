import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CollectionPage.css';
import DeleteUser from './DeleteUser';
import { REACT_API_ENDPOINT } from '../constants';
console.log(REACT_API_ENDPOINT);
const CollectionPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approved, setApproved] = useState(false);
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
      const response = await axios.get(`${REACT_API_ENDPOINT}/home`, config);
      setUsers(response.data);
      setLoading(false);
      setError('');
    } catch (error) {
      handleError('Failed to fetch users. Please try again.');
    }
  };
  // const handleMoneyUpdate = async (userId, amount) => {
  //   const parsedAmount = parseFloat(am/ount); 
  //   console.log(parsedAmount);
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       data: {
  //         amount: parsedAmount,
  //       },
  //     };
  //     const response = await axios.patch(`${REACT_API_ENDPOINT}/users/${userId}`, config);
  //     if (response.status === 200) {
  //       fetchUsers();
  //       setError('');
  //     } else {
  //       handleError('Failed to update money. Please try again.');
  //     }
  //   } catch (error) {
  //     handleError('Failed to update money. Please try again.');
  //   }
  // };

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
      const response = await axios.delete(`${REACT_API_ENDPOINT}/users/${userId}`, config);
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
  const handleApproveUser = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${REACT_API_ENDPOINT}/approveUser/${userId}`, { approved: !approved }, config);
      if (response.status === 200) {
        setUsers(users.map(user => {
          if (user._id === userId) {
            return { ...user, approved: !user.approved };
          }
          return user;
        }));
        setError('');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Super Admin cannot be disapproved');
      } else {
        console.log(error);
        toast.error("Failed to Approve User...");
      }
    }
  }
  

  const handleError = (errorMessage) => {
    console.error(errorMessage);
    setError(errorMessage);
  };

  return (
    <div className="container">
    <ToastContainer />
      <h2 className='heading'>Admin Page</h2>
      <div className='main_section'>
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
                  <strong className='stront_txt'>Name:</strong> {user.name}
                </p>
                <p className="user-info">
                  <strong className='stront_txt'>Email:</strong> {user.email}
                </p>
                {/* <p className="user-info">
                <strong>Team Name:</strong> {user.teamName}
              </p> */}
                {/* <p className="user-info">
                <strong>Money:</strong> {user.money}
              </p> */}
                {/* <div className="money-actions">
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
              </div> */}
                <div className='btns'>
                  <DeleteUser userId={user._id} onDeleteUser={handleDeleteUser} />

                  <button
                    className="btn"
                    style={{
                      backgroundColor: user.approved ? '#bb2d3b' : '#228B22',
                      color: 'white',
                      width: '107px',
                      marginLeft: '35px'
                    }}
                    onClick={() => handleApproveUser(user._id)}
                  >
                    {user.approved ? 'Disapprove' : 'Approve'}
                  </button> 
                   </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
