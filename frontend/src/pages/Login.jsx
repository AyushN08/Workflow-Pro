<<<<<<< HEAD
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Firebase Auth: sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Optional: Send to backend for session/auth verification
      await axios.post('http://localhost:5000/api/auth/login', { idToken });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <InputField 
          label="Email" 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="you@example.com"
          disabled={loading}
        />
        <PasswordField 
          label="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="••••••••"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-sm text-center mt-4">
          Don't have an account? <Link to="/signup" className="text-indigo-600 font-medium">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

=======
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Firebase Auth: sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Optional: Send to backend for session/auth verification
      await axios.post('http://localhost:5000/api/auth/login', { idToken });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <InputField 
          label="Email" 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="you@example.com"
          disabled={loading}
        />
        <PasswordField 
          label="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="••••••••"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-sm text-center mt-4">
          Don't have an account? <Link to="/signup" className="text-indigo-600 font-medium">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

>>>>>>> d780f90519e66a9003e4a125dda904d885ba041f
export default Login;