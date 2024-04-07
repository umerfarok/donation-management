import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, makeStyles, Tooltip, Grid, Container, Drawer, List, ListItem, ListItemIcon, ListItemText, Hidden } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import LoginIcon from '@material-ui/icons/VpnKey';
import RegisterForm from './components/RegisterForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './components/Home';
import logoimg from './images/logo.png';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CollectionPage from './components/CollectionPage';
import LoginForm from './components/Login';
import DonationUserManager from './components/DonationUserManager';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import './App.css';
import { REACT_API_ENDPOINT } from './constants';

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
  container: {
    marginTop: theme.spacing(2),
  },
  drawerPaper: {
    width: 240,
  },
}));

const App = () => {
  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jwt, setJwt] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('jwt');
      console.log('Token from local storage:', token);
      if (token) {
        const response = await fetch(`${REACT_API_ENDPOINT}/isLoggedIn`, {
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
    const response = await fetch(`${REACT_API_ENDPOINT}/logout`);
    if (response.ok) {
      localStorage.removeItem('jwt');
      setIsLoggedIn(false);
    } else {
      localStorage.removeItem('jwt');
      setIsLoggedIn(false);
      console.error('Logout failed');
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        {isLoggedIn && (
          <>
            <ListItem button component={Link} to="/admin" onClick={toggleDrawer(false)}>
              <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
              <ListItemText primary="Admin Panel" />
            </ListItem>
            <ListItem button component={Link} to="/donation" onClick={toggleDrawer(false)}>
            <ListItemIcon><VolunteerActivismIcon /></ListItemIcon>
              <ListItemText primary="Donation Management" />
            </ListItem>
            <ListItem button onClick={() => { handleLogout(); toggleDrawer(false); }}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
        {!isLoggedIn && (
          <>
            <ListItem button component={Link} to="/register" onClick={toggleDrawer(false)}>
              <ListItemIcon><PersonAddIcon /></ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
            <ListItem button component={Link} to="/login" onClick={toggleDrawer(false)}>
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Hidden smUp>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Typography variant="h6" className={classes.title}>
              <Link to="/">
                <img src={logoimg} style={{ height: '75px', margin: '6px' }} alt="Logo" />
              </Link>
            </Typography>
            <Hidden xsDown>
              <Tooltip title="Home">
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="home" component={Link} to="/">
                  <HomeIcon />
                  <Typography variant="body1">Home</Typography>
                </IconButton>
              </Tooltip>
              {isLoggedIn ? (
                <>
                  <Tooltip title="Admin Panel">
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="admin" component={Link} to="/admin">
                      <AdminPanelSettingsIcon />
                      <Typography variant="body1">Admin Panel</Typography>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Donation Management">
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="donation" component={Link} to="/donation">
                      <VolunteerActivismIcon />
                      <Typography variant="body1">Donation Management</Typography>
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
                      <Typography variant="body2">Register</Typography>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Login">
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="login" component={Link} to="/login">
                      <LoginIcon />
                      <Typography variant="body2">Login</Typography>
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Hidden>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                {isLoggedIn ? (
                  <>
                    <Route path="/register" element={<Navigate to="/" />} />
                    <Route path="/admin" element={<CollectionPage />} />
                    <Route path="/donation" element={<DonationUserManager />} />
                  </>
                ) : (
                  <>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                      path="/login"
                      element={<LoginForm setIsLoggedIn={setIsLoggedIn} setJwt={setJwt} />}
                    />
                    <Route path="/admin" element={<Navigate to="/login" replace />} />
                  </>
                )}
              </Routes>
            </Grid>
          </Grid>
        </Container>
      </div>
      <ToastContainer />
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {drawer}
      </Drawer>
    </Router>
  );
};

const RegisterPage = () => {
  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default App;