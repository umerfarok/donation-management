import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Paper, Typography, Grid, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControlLabel } from '@material-ui/core';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alert from '@material-ui/lab/Alert';
import { REACT_API_ENDPOINT } from '../constants';
import Loading from './Loading';
import AlarmIcon from '@mui/icons-material/Alarm';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VerifiedIcon from '@mui/icons-material/Verified';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
const useStyles = makeStyles((theme) => ({
  form: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  select: {
    minWidth: 130,
    marginRight: "23px",
  },
}));
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 3,
  paddingRight: 4,
};
const DonationUserManager = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    reminder: 0,
    year: '',
    money: 0,
    paymentSuccessful: false,
  });

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('jwt');
    let fetchUrl = `${REACT_API_ENDPOINT}/getDonationUsers`;
    if (formData.year) {
      fetchUrl += `?year=${formData.year}`;
    }

    axios.get(fetchUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        setError("Error fetching users: " + error.message);
        setLoading(false);
      });
  }, []);

  const handleYearChange = (event) => {
    const selectedYear = event.target.value;
    setFormData({
      ...formData,
      year: selectedYear === '' ? '' : selectedYear,
    });
  };
  const handleOpen = () => {
    setOpen(true);
    setSelectedUser(null);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', lastName: '', email: '', phone: '', address: '', reminder: 0, year: '', paymentSuccessful: false });
  };

  const handleSendReminder = (user) => {
    // Implement your email or SMS sending logic here
    const token = localStorage.getItem('jwt');
    axios.post(`${REACT_API_ENDPOINT}/sendReminder`, { email: user.email, userName: user.name }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        axios.get(`${REACT_API_ENDPOINT}/getDonationUsers`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => {
            setUsers(response.data);
            toast.success(response.data.message);
            toast.info("Your Email is being sent.");
          })
          .catch(error => {
            console.error("Error fetching updated data:", error);
            if (error.response && error.response.data) {
              setError("Error fetching updated data: " + error.response.data);
            } else {
              setError("Error fetching updated data: " + error.message);
            }
          });
      })
      .catch(error => {
        console.error("Error sending reminder:", error);
        if (error.response && error.response.data) {
          setError("Error sending reminder: " + error.response.data);
        } else {
          setError("Error sending reminder: " + error.message);
        }
      });
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
    const currentYear = new Date().getFullYear();
    setFormData({ ...formData, year: currentYear });
    
    if (selectedUser) {
      axios.put(`${REACT_API_ENDPOINT}/editDonationUser/${selectedUser._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setUsers(users.map(user => user._id === selectedUser._id ? response.data : user));
          setSelectedUser(null);
          setFormData({ name: '', lastName: '', email: '', phone: '', address: '', reminder: 0 });
        })
        .catch(error => {
          console.error("Error updating user:", error);
          if (error.response && error.response.data) {
            setError("Error updating user: " + error.response.data);
          } else {
            setError("Error updating user: " + error.message);
          }
        });
    } else {
      const formDataWithYear = {
        ...formData,
        year: currentYear
      };

      axios.post(`${REACT_API_ENDPOINT}/addDonationUser`, formDataWithYear, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setOpen(false);
          const newUser = response.data;
          newUser.years = [{ year: currentYear }];
          setUsers(prevUsers => [...prevUsers, newUser]);
          setFormData({ name: '', lastName: '', email: '', phone: '', address: '', reminder: 0 });
        })
        .catch(error => {
          setOpen(false);
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
    const currentYear = new Date().getFullYear();
    const currentYearData = user.years.find(yearData => yearData.year === currentYear);
    const paymentSuccessful = currentYearData ? currentYearData.paymentSuccessful : false;
    setFormData({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      paymentSuccessful: paymentSuccessful,
    });
    setOpen(true);
  };
  
  

  const handleVerifyPayment = async (user) => {
    try {
      const token = localStorage.getItem('jwt');
      const currentYear = new Date().getFullYear();
      setFormData({ ...formData, year: currentYear });
      const response = await axios.put(`${REACT_API_ENDPOINT}/editDonationUser/${user._id}`, formData , {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.paymentSuccessful) {
        setUsers(users.map(u => u._id === user._id ? { ...u, paymentSuccessful: true } : u));
      }
    } catch (error) {
      console.error("Error Updating user:", error);
      if (error.response && error.response.data) {
        setError("Error updating user: " + error.response.data);
      } else {
        setError("Error updating user: " + error.message);
      }
    }
  };
  const handleAddCurrentYear = (userId) => {
    const token = localStorage.getItem('jwt');
    const currentYear = new Date().getFullYear();
    const user = users.find(u => u._id === userId);
    if (user && user.years.some(year => year.year === currentYear)) {
      toast.error(" Year already exists");
      return;
    }
    setFormData({ ...formData, year: currentYear });

    axios.put(
      `${REACT_API_ENDPOINT}/editDonationUser/${userId}`,
     formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(response => {
        if (response.data) {
          setUsers(users.map(u => u._id === userId ? response.data : u));
          toast.success("Current year added successfully");
        }
      })
      .catch(error => {
        console.error("Error adding current year:", error);
        if (error.response && error.response.data) {
          setError("Error adding current year: " + error.response.data);
        } else {
          setError("Error adding current year: " + error.message);
        }
      });
  };



  const handleDelete = (userId) => {
    const token = localStorage.getItem('jwt');
    axios.delete(`${REACT_API_ENDPOINT}/deleteDonationUser/${userId}`, {
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
  if (loading) {
    return <div><Loading /></div>;
  }
  return (
    <Grid container spacing={3}>
      <ToastContainer />
      {error && <Alert severity="error">{error}</Alert>}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CloseIcon onClick={handleClose} style={{ position: 'absolute', top: 12, right: 15, borderRadius: '50%', boxShadow: '3px 3px 5px 0px rgba(0,0,0,0.15)', color: 'rgba(0, 0, 0, 0.5)' }}>Cancel</CloseIcon>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <TextField name="name" value={formData.name} onChange={handleInputChange} label="Name" required fullWidth />
              </Grid>
              <Grid item xs={9}>
                <TextField name="lastName" value={formData.lastName} onChange={handleInputChange} label="Last Name" required fullWidth />
              </Grid>

              <Grid item xs={9}>
                <TextField name="phone" value={formData.phone} onChange={handleInputChange} label="Phone" required fullWidth />
              </Grid>
              <Grid item xs={11}>
                <TextField name="email" value={formData.email} onChange={handleInputChange} label="Email" required fullWidth />
              </Grid>
              <Grid item xs={11}>
                <TextField name="address" value={formData.address} onChange={handleInputChange} label="Address" required fullWidth />
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={11} marginLeft='14px'>
                <Button type="submit" variant="contained" color="primary" fullWidth>{selectedUser ? 'Update' : 'Add'} User</Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
      <Grid container item xs={12} justifyContent="flex-end" style={{ marginRight: '23px', marginTop: '20px' }}>

        <FormControl className={classes.select}>
          <Select
            labelId="year-label"
            id="year"
            value={formData.year || ''}
            onChange={handleYearChange}
            displayEmpty
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={handleOpen} variant="contained" color="primary" style={{ marginRight: '12px' }}>
          <AddIcon />New User
        </Button>
      </Grid>
      <Grid container spacing={3} style={{ padding: '0 20px' }}>
        {users.map(user => (
          <Grid item xs={12} sm={6} key={user._id}>
            <Paper elevation={3} style={{ padding: '10px', marginBottom: '5px' }}>
              <Grid container spacing={3} direction="column">
                <Grid item>
                  <Typography variant="subtitle1" style={{ margin: '5px' }}><span style={{ fontSize: '16px', color: '#3F51B5' }}> Contributor Name : </span><span style={{ fontSize: '20px', fontWeight: 'bold' }}>{user.name} {user.lastName}</span></Typography>
                  <Typography style={{ margin: '5px' }}><span style={{ fontSize: '16px', color: '#3F51B5' }}>Email:</span> {user.email}</Typography>
                  <Typography style={{ margin: '5px' }}><span style={{ fontSize: '16px', color: '#3F51B5' }}>Phone:</span> {user.phone}</Typography>
                  <Typography style={{ margin: '5px' }}><span style={{ fontSize: '16px', color: '#3F51B5' }}>Adress:</span> {user.address}</Typography>
                  <Typography style={{ margin: '5px' }}><span style={{ fontSize: '16px', color: '#3F51B5' }}>Reminder :</span> {user.reminder}</Typography>
                  <Typography style={{ margin: '5px' }}><span style={{ fontSize: '16px', color: '#3F51B5' }}>Money :</span> {user.money}</Typography>
                  <Typography style={{ margin: '5px' }}>
                    <Grid item xs={6}>
                      <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #a8a8a8', padding: '1px' }}>
                        <thead>
                          <tr>
                            <th style={{ border: '1px solid #a8a8a8', padding: '3px', textAlign: 'center', fontWeight: 'bold' }}>Payment Year</th>
                            <th style={{ border: '1px solid #a8a8a8', padding: '3px', textAlign: 'center', fontWeight: 'bold' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {user.years && user.years.length > 0 ? (
                            user.years.map(year => (
                              
                              <tr key={year.year}>
                                <td style={{ border: '1px solid #a8a8a8', padding: '2px', textAlign: 'center' }}>{year.year}</td>
                                <td style={{ border: '1px solid #a8a8a8', padding: '2px', textAlign: 'center' }}>
                                  <span style={{ color: year.paymentSuccessful ? '#16c946' : '#841d1d' }}>
                                    {year.paymentSuccessful ? ' Confirmed' : 'Not Confirmed'}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td style={{ border: '1px solid #a8a8a8', padding: '2px', textAlign: 'center' }}>--</td>
                              <td style={{ border: '1px solid #a8a8a8', padding: '2px', textAlign: 'center' }}>--</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </Grid>
                  </Typography>

                </Grid>
                <Grid style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }} item>
                <Button type="button" onClick={() => handleEdit(user)} variant="outlined" color="primary" style={{ marginRight: '5px', padding: '0' }}>
  <ModeEditIcon sx={{ fontSize: 18 }} />
  Edit
</Button>
                  <Button onClick={() => handleDelete(user._id)} variant="outlined" color="secondary" style={{ color: '#FF0000', marginRight: '5px', }}><DeleteIcon sx={{ fontSize: 18 }} />Delete</Button>
                  <Button onClick={() => handleVerifyPayment(user)} variant="outlined" color="primary" style={{ marginRight: '5px' }}><VerifiedIcon sx={{ fontSize: 18 }} />Verify Payment</Button>
                  <Button onClick={() => handleSendReminder(user)} variant="outlined" color="secondary" style={{ color: '#FF0000', marginRight: '5px' }}> <AlarmIcon sx={{ fontSize: 18 }} />Send Reminder</Button>
                  <Button onClick={() => handleAddCurrentYear(user._id)} variant="outlined" color="primary" style={{ marginRight: '5px' }}><AddCircleOutlineIcon sx={{ fontSize: 18 }} />Add Year</Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))
        }
      </Grid >
    </Grid >
  );
};

export default DonationUserManager;