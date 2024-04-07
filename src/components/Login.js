import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REACT_API_ENDPOINT } from '../constants';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Background from './images/bg1.jpg';

const LoginForm = ({ setIsLoggedIn, setJwt }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${REACT_API_ENDPOINT}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('jwt', data.token);
        setIsLoggedIn(true);
        setJwt(data.token);
        history('/');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: '90vh' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '0 0px' }}>
        <div style={{ width: '450px', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '6px 12px 10px rgba(0, 0, 0, 0.1)', padding: '30px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Login</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                placeholder='Enter email'
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                required
                fullWidth
                InputProps={{
                  style: { fontSize: '16px', borderRadius: '5px' },
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder='Enter password'
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
                fullWidth
                InputProps={{
                  style: { fontSize: '16px', borderRadius: '5px' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginLeft:'23%', width: '50%', marginBottom: '20px', padding: '10px', fontSize: '16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </button>
            <div style={{ textAlign: 'center' }}>Don't have an account? <a href='/register' style={{ textDecoration: 'none', color: '#007bff', fontSize:'17px' }}>Sign Up</a></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;