  import React, { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import axios from 'axios';

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');

      try {
        const res = await axios.post('http://localhost:3000/login', { email, password }, {
          withCredentials: true, // only needed if you use cookies for JWT
        });

        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/'); // or your homepage
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Login failed. Try again.');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 px-4">
        <motion.div
          className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={0}
        >
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Welcome Back</h2>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    );
  };

  export default Login;
