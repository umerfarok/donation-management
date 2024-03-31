import React, { useState } from 'react';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import { REACT_API_ENDPOINT } from '../constants';
import Background from './images/bg1.jpg'; 
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamName, setTeamName] = useState('');
  const [money, setMoney] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${REACT_API_ENDPOINT}/register`, {
        name,
        email,
        password,
        teamName,
        money,
      });
      console.log(response.data);
      // Do something with the response if needed
      setLoading(false);
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Failed to register. Please try again.');
      setLoading(false);
    }
  };
  const handleRegister = async () => {
    toast.success('Registration successful');
    setName('');
    setEmail('');
    setPassword('');
    setTeamName('');
    setMoney('');

  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: '90vh', backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <ToastContainer />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ width: '450px', padding: '40px', borderRadius: '23px', backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <BeatLoader color="green" loading={loading} size={15} />
            </div>
          )}
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h2>
            <div style={{ marginBottom: '20px' }}>
              <TextField
                label="Name"
                type="text"
                value={name}
                placeholder='Enter name'
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                InputProps={{
                  style: { fontSize: '16px', borderRadius: '5px' },
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                placeholder='Enter email'
                onChange={(e) => setEmail(e.target.value)}
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
            <div style={{ marginBottom: '20px' }}>
              <TextField
                label="Team Name"
                type="text"
                value={teamName}
                placeholder='Enter team name'
                onChange={(e) => setTeamName(e.target.value)}
                required
                fullWidth
                InputProps={{
                  style: { fontSize: '16px', borderRadius: '5px' },
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <TextField
                label="Money"
                type="text"
                value={money}
                placeholder='Enter money'
                onChange={(e) => setMoney(e.target.value)}
                required
                fullWidth
                InputProps={{
                  style: { fontSize: '16px', borderRadius: '5px' },
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" onClick={handleRegister} style={{marginLeft:'23%', width: '50%', padding: '10px', borderRadius: '5px', fontSize: '16px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', marginBottom:'15px' }}>
              Register
            </button>
            <div style={{ textAlign: 'center' }}>Already have an account? <a href='/login' style={{ textDecoration: 'none', color: '#007bff',fontSize:'17px' }}>login</a></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
