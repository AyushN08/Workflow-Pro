import { useState } from 'react';
import { Link } from 'react-router-dom';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async e => {
    e.preventDefault();
    // Add API logic here later
    console.log({ name, email, password });
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
