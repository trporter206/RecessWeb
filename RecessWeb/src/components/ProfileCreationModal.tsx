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
  const [skill, setSkill] = useState(1);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user?.uid;

      if (userId) {
        await setDoc(doc(firestore, 'Users', userId), {
          username,
          skill,
          email,
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
          <select value={skill} onChange={e => setSkill(parseInt(e.target.value))}>
            {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="submit">Create Profile</button>
          <button onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};
