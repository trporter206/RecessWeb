import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ProfileCreationModal } from './ProfileCreationModal'; // Import the ProfileCreationModal

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showProfileCreation, setShowProfileCreation] = useState(false); // New state for showing the modal

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Handle successful login
    } catch (error) {
      // Handle login errors
      console.error("Login error:", error);
    }
  };

  const handleShowProfileCreation = () => {
    setShowProfileCreation(true); // Show the profile creation modal
  };

  const handleCloseProfileCreation = () => {
    setShowProfileCreation(false); // Hide the profile creation modal
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <button onClick={handleShowProfileCreation}>Sign Up</button>
      {showProfileCreation && (
        <ProfileCreationModal
          show={showProfileCreation}
          onClose={handleCloseProfileCreation}
        />
      )}
    </div>
  );
};
