import React, { useContext, useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from '../../firebaseConfig';
import { UserContext } from '../../services/UserContext';
import { CircularProgress } from "@mui/material";
import { updateUser } from '../../services/UserServices';
import { DataContext } from '../../services/DataProvider';
import { sportsList } from '../../services/DataProvider';

interface ProfileCreationModalProps {
  show: boolean;
  onClose: () => void;
  editMode?: boolean;
}

export const ProfileCreationModal: React.FC<ProfileCreationModalProps> = ({ show, onClose, editMode }) => {
  const userContext = useContext(UserContext);
  const profile = userContext ? userContext.profile : null;
  const { updateUserContext } = useContext(DataContext);
  const [username, setUsername] = useState(editMode ? profile?.username : '');
  const [firstName, setFirstName] = useState(editMode ? profile?.firstName : '');
  const [lastName, setLastName] = useState(editMode ? profile?.lastName : '');
  // const [pickleballSkill, setPickleballSkill] = useState(editMode ? profile?.pickleballSkill?.toString() : '');
  const [gender, setGender] = useState(editMode ? profile?.gender : '');
  const [age, setAge] = useState(editMode ? profile?.age?.toString() : '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isEditMode = Boolean(editMode);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [interestedSports, setInterestedSports] = useState<string[]>([]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !firstName || !lastName || !gender || !age || !email || !password) {
      console.error('Invalid profile data');
      return;
    }

    if (isEditMode && profile) {
      const updatedProfile = {
        ...profile,
        username,
        firstName,
        lastName,
        age: parseInt(age, 10),
        gender,
        pickleballSkill: 0,
        interestedSports

      };

      setIsLoading(true);
      try {
        console.log('Updating profile:', updatedProfile);
        await updateUser(profile.id, updatedProfile);
        updateUserContext(profile.id, updatedProfile);
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setIsLoading(false);
        onClose();
      }

    } else {
      setIsLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        await setDoc(doc(firestore, 'Users', userId), {
          id: userId,
          username,
          firstName,
          lastName,
          pickleballSkill: 0,
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
          pendingInvites: [],
          teams: [],
          ownedLocations: [],
          currentGames: [],
          interestedSports
        });
        setIsLoading(false);
        onClose();
      } catch (error) {
        console.error('Error creating profile:', error);
      }
    }
  };

  const handleSportsSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setInterestedSports(selectedOptions);
  };

  if (!show) {
    return null;
  }

  return (
    <div className='modal-backdrop'>
  <div className='profileCreationModal-content'>
    {isLoading ? ( 
      <CircularProgress />
    ) : (
      <>
        <h2>{isEditMode ? 'Edit Profile' : 'Create Profile'}</h2>
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
          {/* <div className="form-group">
            <label>Pickleball Skill:</label>
            <select value={pickleballSkill} onChange={e => setPickleballSkill(e.target.value)} required>
              <option value="">Select Skill Level</option>
              {
                Array.from({ length: 10 }, (_, i) => (1 + i * 0.5)).map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))
              }
            </select>
          </div> */}
          <div className="form-group">
            <label>Interested Sports:</label>
            <select multiple value={interestedSports} onChange={handleSportsSelectionChange} required>
              {sportsList.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
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
          <button type="submit">{isEditMode ? 'Save Changes' : 'Create Profile'}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </>
    )}
      </div>
    </div>
  );
};
