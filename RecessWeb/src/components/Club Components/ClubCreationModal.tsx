import { useContext, useState } from "react";
import { UserContext } from "../../services/UserContext";
import { createClub, updateClub } from "../../services/ClubServices";
import { DataContext } from "../../services/DataProvider";
import { CircularProgress } from "@mui/material";
import { Select, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { v4 as uuid } from 'uuid';
import { Club } from "../../models/Club";

interface ClubCreatiopnModalProps {
    show: boolean;
    onClose: () => void;
    editMode?: boolean;
    editedClub?: Club;
}

export const ClubCreationModal: React.FC<ClubCreatiopnModalProps> = ({ show, onClose, editMode, editedClub }) => {
    const [clubName, setClubName] = useState(editedClub ? editedClub.name : '');
    const [clubDescription, setClubDescription] = useState(editedClub ? editedClub.description : '');
    const [clubSport, setClubSport] = useState(editedClub ? editedClub.sport : '');
    const [isPublic, setIsPublic] = useState(editedClub ? editedClub.isPublic : false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFreeToJoin, setIsFreeToJoin] = useState<boolean>(editedClub ? editedClub.freeToJoin : true);
    const [clubLocations, setClubLocations] = useState<string[]>(editedClub ? editedClub.clubLocations : []);
    const { addClubContext, updateClubContext, locations } = useContext(DataContext);
    const userContext = useContext(UserContext);
    const user = userContext ? userContext.user : null;
    const isEditMode = Boolean(editMode);
    // const profile = userContext ? userContext.profile : null;

    const handleLocationChange = (event: SelectChangeEvent<string[]>) => { 
        setClubLocations(Array.isArray(event.target.value) ? event.target.value : [event.target.value]);  
    };
    

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

        if (isEditMode && editedClub) {
            const updatedClub = {
                ...editedClub,
                name: clubName,
                description: clubDescription,
                sport: clubSport,
                isPublic: isPublic,
                freeToJoin: isFreeToJoin,
                clubLocations: clubLocations
            };

            setIsLoading(true);
            try {
                await updateClub(editedClub.id, updatedClub);
                updateClubContext(editedClub.id, updatedClub);
                console.log('Club updated:', updatedClub);
            } catch (error) {
                console.error('Error updating club:', error);
            } finally {
                setIsLoading(false);
                onClose();
            }
            return;
        }

        const newClub = {
            id: uuid(),
            name: clubName,
            organizer: user.uid,
            description: clubDescription,
            sport: clubSport,
            members: [user.uid],
            games: [],
            isPublic: isPublic,
            freeToJoin: isFreeToJoin,
            clubLocations: clubLocations
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
                            <h3>{isEditMode ? 'Edit Club' : 'Create Club'}</h3>
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
                                <label htmlFor='isFreeToJoin'>Free to Join</label>
                                <input type='checkbox' id='isFreeToJoin' checked={isFreeToJoin} onChange={(e) => setIsFreeToJoin(e.target.checked)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='clubLocations'>Locations</label>
                                <Select
                                    multiple
                                    value={clubLocations}
                                    onChange={handleLocationChange} // Correct type here
                                    renderValue={selected => selected.join(', ')}
                                >
                                    {locations.map((location) => (
                                        <MenuItem key={location.id} value={location.id}>
                                            {location.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                            <div className='form-group'>
                                <button onClick={handleSave} disabled={isLoading}>{isEditMode ? 'Save Changes' : 'Create Club'}</button>
                                <button className='close-button' onClick={onClose}>Cancel</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};