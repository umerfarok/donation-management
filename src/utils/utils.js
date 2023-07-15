const fetchWithAuth = async (url, options) => {
    // Add the Authorization header with the JWT token
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${jwt}`,
    };

    const response = await fetch(url, options);

    if (response.status === 401) {
      // Handle unauthorized access, such as clearing token and redirecting to login page
      setIsLoggedIn(false);
      setJwt(null);
      localStorage.removeItem('jwt');
      // Redirect to login page
      return <Navigate to="/login" />;
    }

    return response;
  };