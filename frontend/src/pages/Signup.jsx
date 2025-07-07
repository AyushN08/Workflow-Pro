<<<<<<< HEAD
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase'; // make sure this is configured
import axios from 'axios';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async e => {
    e.preventDefault();
    try {
      // Firebase Auth: create user
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName: name });

      // Get Firebase ID token
      const idToken = await auth.currentUser.getIdToken();

      // Optional: Send to backend to create user in DB or session
      await axios.post('http://localhost:5000/api/auth/signup', { idToken });

      // Redirect or show success
      navigate('/');
    } catch (err) {
      console.error("Signup error:", err.message);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Sign Up</h2>
        <InputField label="Name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
        <InputField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        <PasswordField label="Password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Create Account
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
=======
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase'; // make sure this is configured
import axios from 'axios';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async e => {
    e.preventDefault();
    try {
      // Firebase Auth: create user
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName: name });

      // Get Firebase ID token
      const idToken = await auth.currentUser.getIdToken();

      // Optional: Send to backend to create user in DB or session
      await axios.post('http://localhost:5000/api/auth/signup', { idToken });

      // Redirect or show success
      navigate('/');
    } catch (err) {
      console.error("Signup error:", err.message);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Sign Up</h2>
        <InputField label="Name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
        <InputField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        <PasswordField label="Password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Create Account
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
>>>>>>> d780f90519e66a9003e4a125dda904d885ba041f
