import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const { signUp, loading } = useAuth();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email,password);
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create account</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full p-2 bg-indigo-600 text-white rounded">{loading ? 'Creating...' : 'Create account'}</button>
      </form>
      <p className="mt-4">Already have account? <Link to="/login" className="text-indigo-600">Sign in</Link></p>
    </div>
  );
};

export default Register;
