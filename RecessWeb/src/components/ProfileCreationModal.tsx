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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pickleballSkill, setPickleballSkill] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(firestore, 'Users', userId), {
        id: userId,
        username,
        firstName,
        lastName,
        pickleballSkill: pickleballSkill ? parseInt(pickleballSkill, 10) : null,
        gender,
        age: parseInt(age, 10),
        email,
        points: 0,
        rating: 0,
        gamesHosted: 0,
        gamesJoined: 0,
        ratings: {},
        network: [],
        favoriteLocations: [],
        pendingInvites: []
      });

      onClose(); // Close the modal upon successful profile creation
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
      <div className="form-group">
        <label>Username:</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
      </div>
      <div className="form-group">
        <label>First Name:</label>
        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
      </div>
      <div className="form-group">
        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
      </div>
      <div className="form-group">
        <label>Pickleball Skill:</label>
        <select value={pickleballSkill} onChange={e => setPickleballSkill(e.target.value)} required>
          <option value="">Select Skill Level</option>
          {
            Array.from({ length: 10 }, (_, i) => (1 + i * 0.5)).map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))
          }
        </select>
      </div>
      <div className="form-group">
        <label>Gender:</label>
        <select value={gender} onChange={e => setGender(e.target.value)} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <label>Age:</label>
        <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" required />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      </div>
      <button type="submit">Create Profile</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  </div>
</div>

  );
};
