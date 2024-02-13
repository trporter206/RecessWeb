import { useContext, useState } from "react";
import { UserContext } from "../../services/UserContext";
import { createClub } from "../../services/ClubServices";
import { DataContext } from "../../services/DataProvider";
import { CircularProgress } from "@mui/material";

interface ClubCreatiopnModalProps {
    show: boolean;
    onClose: () => void;
}

export const ClubCreationModal: React.FC<ClubCreatiopnModalProps> = ({ show, onClose }) => {
    const [clubName, setClubName] = useState('');
    const [clubDescription, setClubDescription] = useState('');
    const [clubSport, setClubSport] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { addClubContext } = useContext(DataContext);
    const userContext = useContext(UserContext);
    const user = userContext ? userContext.user : null;
    // const profile = userContext ? userContext.profile : null;

    const handleClose = (event: React.MouseEvent) => {
        event.stopPropagation();
        onClose();
    }

    const stopPropagation = (event: React.MouseEvent) => {
        event.stopPropagation();
    }

    const handleSave = async () => {
        if (!clubName || !clubDescription || !clubSport || !user) {
            // Handle validation error
            return;
        }

        const newClub = {
            id: '',
            name: clubName,
            organizer: user.uid,
            description: clubDescription,
            sport: clubSport,
            members: [user.uid],
            games: [],
            isPublic: isPublic
        };

        setIsLoading(true);
        try {
            const newClubId = await createClub(newClub);
            const createdClub = { ...newClub, id: newClubId };
            addClubContext(createdClub);
            console.log('Club created:', createdClub);
            onClose();
        } catch (error) {
            console.error('Error creating club:', error);
        } finally {
            setIsLoading(false);
            onClose();
        }
    }

    if (!show) {
        return null;
    }

    return (
        <div className='modal-backdrop' onClick={handleClose}>
            <div className='gameCreationModal-content' onClick={stopPropagation}>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <div className='modal-header'>
                            <h3>Create a Club</h3>
                            <button className='close-button' onClick={onClose}>X</button>
                        </div>
                        <div className='modal-content'>
                            <div className='form-group'>
                                <label htmlFor='clubName'>Club Name</label>
                                <input type='text' id='clubName' value={clubName} onChange={(e) => setClubName(e.target.value)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='clubDescription'>Description</label>
                                <textarea id='clubDescription' value={clubDescription} onChange={(e) => setClubDescription(e.target.value)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='clubSport'>Sport</label>
                                <input type='text' id='clubSport' value={clubSport} onChange={(e) => setClubSport(e.target.value)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='isPublic'>Public</label>
                                <input type='checkbox' id='isPublic' checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                            </div>
                            <div className='form-group'>
                                <button onClick={handleSave} disabled={isLoading}>Save</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};