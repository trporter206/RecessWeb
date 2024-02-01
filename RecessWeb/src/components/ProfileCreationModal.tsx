import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from '../firebaseConfig';

interface ProfileCreationModalProps {
  show: boolean;
  onClose: () => void;
}

export const ProfileCreationModal: React.FC<ProfileCreationModalProps> = ({ show, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateProfile = async (e: React.FormEvent) => {
    console.log('fetching...');
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user?.uid;

      if (userId) {
        await setDoc(doc(firestore, 'Users', userId), {
          username,
          email, // Password should not be stored in Firestore for security reasons
          id: userId,
          points: 0,
          rating: 0,
          gamesHosted: 0,
          gamesJoined: 0,
          ratings: {}, // Initialize as an empty object
          network: [], // Initialize as an empty array
          favoriteLocations: [] // Initialize as an empty array
        });
      }
      onClose();
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className='InfoModal-backdrop'>
      <div className='profileCreationModal-content'>
        <h2>Create Profile</h2>
        <form onSubmit={handleCreateProfile}>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit">Create Profile</button>
          <button onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};
