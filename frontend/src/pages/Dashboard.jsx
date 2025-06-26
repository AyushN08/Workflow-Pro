import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">Welcome to Workflow-Pro!</h1>
        <p className="text-gray-700 mb-6">
          You are now logged in. Here you'll manage projects, track time, collaborate, and more.
        </p>
        <button
          onClick={() => auth.signOut().then(() => navigate('/login'))}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
