import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, makeStyles, Tooltip } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import MoneyIcon from '@material-ui/icons/Money';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import LoginIcon from '@material-ui/icons/VpnKey';
import RegisterForm from './components/RegisterForm';
import HomePage from './components/Home';
import CollectionPage from './components/CollectionPage';
import LoginForm from './components/Login';
import DonationUserManager from './components/DonationUserManager';
import './App.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const App = () => {
  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jwt, setJwt] = useState('');

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('jwt');
      console.log('Token from local storage:', token);
      if (token) {
        const response = await fetch('http://localhost:4000/isLoggedIn', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const isLoggedIn = await response.json();
        console.log('Response from /isLoggedIn:', isLoggedIn);
        setIsLoggedIn(isLoggedIn);
      }
    };
  
    checkLoggedIn();
  }, []);

  const handleLogout = async () => {
    const response = await fetch('/logout');
    if (response.ok) {
      localStorage.removeItem('jwt');
      setIsLoggedIn(false);
    } else {
      console.error('Logout failed');
    }
  };

  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Donation Management
            </Typography>
            <Tooltip title="Home">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="home" component={Link} to="/">
            <HomeIcon />
            <Typography variant="body2">Home</Typography>
          </IconButton>
        </Tooltip>
            {isLoggedIn ? (
                <>
                <Tooltip title="Collection">
                  <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="collection" component={Link} to="/collection">
                    <MoneyIcon />
                    <Typography variant="body2">Collection</Typography>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Donation Management">
                  <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="donation" component={Link} to="/donation">
                    <MoneyIcon />
                    <Typography variant="body2">Donation Management</Typography>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Logout">
                  <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="logout" onClick={handleLogout}>
                    <ExitToAppIcon />
                    <Typography variant="body2">Logout</Typography>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
            <Tooltip title="Register">
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="register" component={Link} to="/register">
                <PersonAddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Login">
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="login" component={Link} to="/login">
                <LoginIcon />
              </IconButton>
            </Tooltip>
          </>
            )}
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {isLoggedIn ? (
            <>
              <Route path="/register" element={<Navigate to="/" />} />
              <Route path="/collection" element={<CollectionPage />} />
              <Route path="/donation" element={<DonationUserManager />} />
            </>
          ) : (
            <>
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/login"
                element={<LoginForm setIsLoggedIn={setIsLoggedIn} setJwt={setJwt} />}
              />
              <Route path="/collection" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

const RegisterPage = () => {
  return (
    <div>
      <h2>Register Page</h2>
      <RegisterForm />
    </div>
  );
};

export default App;