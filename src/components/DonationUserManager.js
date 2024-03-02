import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Paper, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControlLabel } from '@material-ui/core';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alert from '@material-ui/lab/Alert';
const useStyles = makeStyles((theme) => ({
  form: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const DonationUserManager = () => {
  const [error, setError] = useState(null);
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    paymentSuccessful: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    axios.get('http://localhost:4000/getDonationUsers', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => setUsers(response.data))
      .catch(error => {
        console.error("Error adding user:", error);
        if (error.response && error.response.data) {
          setError("Error adding user: " + error.response.data);
        } else {
          setError("Error adding user: " + error.message);
        }
      }
      );
  }, [selectedUser]);
  const handleSendReminder = (user) => {
    // Implement your email or SMS sending logic here
    toast.info("youor Email being sent.");
    const token = localStorage.getItem('jwt');
    axios.post(`http://localhost:4000/sendReminder`, {email:user.email, userName: user.name}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        toast.success(response.data.message);
      })
      .catch(error => {
        console.error("Error adding user:", error);
        if (error.response && error.response.data) {
          setError("Error adding user: " + error.response.data);
        } else {
          setError("Error adding user: " + error.message);
        }
      }
      );
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('jwt');
    if (selectedUser) {
      axios.put(`http://localhost:4000/editDonationUser/${selectedUser._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setUsers(users.map(user => user._id === selectedUser._id ? response.data : user));
          setSelectedUser(null);
          setFormData({ name: '', lastName: '', email: '', phone: '', address: '' });
        })
        .catch(error => {
          console.error("Error adding user:", error);
          if (error.response && error.response.data) {
            setError("Error adding user: " + error.response.data);
          } else {
            setError("Error adding user: " + error.message);
          }
        }
        );
    } else {
      axios.post('http://localhost:4000/addDonationUser', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setUsers([...users, response.data]);
          setFormData({ name: '', lastName: '', email: '', phone: '', address: '' });
        })
        .catch(error => 
          {
            console.error("Error adding user:", error);
            if (error.response && error.response.data) {
              setError("Error adding user: " + error.response.data);
            } else {
              setError("Error adding user: " + error.message);
            }
        });
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      paymentSuccessful: user.paymentSuccessful,
    });
  };
  const handleVerifyPayment = async (user) => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.put(`http://localhost:4000/editDonationUser/${user._id}`, {
        paymentSuccessful: true,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Update the local state if the update was successful
      if (response.data) {
        setUsers(users.map(u => u._id === user._id ? { ...u, paymentSuccessful: true } : u));
      }
    } catch (error) {
      console.error("Error adding user:", error);
      if (error.response && error.response.data) {
        setError("Error adding user: " + error.response.data);
      } else {
        setError("Error adding user: " + error.message);
      }
    }
  };

  const handleDelete = (userId) => {
    const token = localStorage.getItem('jwt');
    axios.delete(`http://localhost:4000/deleteDonationUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        setUsers(users.filter(user => user._id !== userId));
      })
      .catch(error => {
        console.error("Error adding user:", error);
        if (error.response && error.response.data) {
          setError("Error adding user: " + error.response.data);
        } else {
          setError("Error adding user: " + error.message);
        }
      }
      );
  };
  const handleCheckboxChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Grid container spacing={3}>
      <ToastContainer />
      {error && <Alert severity="error">{error}</Alert>}
      <Grid item xs={12}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField name="name" value={formData.name} onChange={handleInputChange} label="Name" required />
          <TextField name="lastName" value={formData.lastName} onChange={handleInputChange} label="Last Name" required />
          <TextField name="email" value={formData.email} onChange={handleInputChange} label="Email" required />
          <TextField name="phone" value={formData.phone} onChange={handleInputChange} label="Phone" required />
          <TextField name="address" value={formData.address} onChange={handleInputChange} label="Address" required />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.paymentSuccessful}
                onChange={handleCheckboxChange}
                name="paymentSuccessful"
                color="primary"
              />
            }
            label="Payment Successful"
          />
          <Button type="submit" variant="contained" color="primary">{selectedUser ? 'Update' : 'Add'} User</Button>
        </form>
      </Grid>
      <Grid container spacing={3} style={{ padding: '0 20px' }}>
        {users.map(user => (
          <Grid item xs={12} sm={6} key={user._id}>
            <Paper elevation={3} style={{ padding: '10px', marginBottom: '10px' }}>
              <Grid container spacing={3} direction="column">
                <Grid item>
                  <Typography variant="subtitle1">{user.name} {user.lastName}</Typography>
                  <Typography>Email: {user.email}</Typography>
                  <Typography>Phone: {user.phone}</Typography>
                  <Typography>Address: {user.address}</Typography>
                </Grid>
                <Grid item>
                  <Button onClick={() => handleEdit(user)} variant="outlined" color="primary" style={{ marginRight: '10px' }}>Edit</Button>
                  <Button onClick={() => handleDelete(user._id)} variant="outlined" color="secondary" style={{ marginRight: '10px' }}>Delete</Button>
                  <Button onClick={() => handleVerifyPayment(user)} variant="outlined" color="primary" style={{ marginRight: '10px' }}>Verify Payment</Button>
                  <Button onClick={() => handleSendReminder(user)} variant="outlined" color="secondary" style={{ marginRight: '10px' }}>Send Reminder</Button>
                </Grid>
                <Grid item>
                  <div>Payment Status: {user.paymentSuccessful ? 'Confirmed' : 'Not Confirmed'}</div>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default DonationUserManager;