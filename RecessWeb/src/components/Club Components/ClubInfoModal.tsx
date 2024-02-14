import { useContext, useState } from "react";
import { Club } from "../../models/Club";
import { UserContext } from "../../services/UserContext";
import { deleteClub } from "../../services/ClubServices";
import { DataContext } from "../../services/DataProvider";

interface ClubInfoModalProps {
    club: Club;
}

export const ClubInfoModal: React.FC<ClubInfoModalProps> = ({ club }) => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useContext(UserContext);
    const  { removeClubContext } = useContext(DataContext);

    const handleToggleModal = () => {
        setShowModal(!showModal);
    };

    const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log('Delete club:', club.id);
        event.stopPropagation();

        if (user?.uid !== club.organizer) {
            return;
        }
        
        const confirmDelete = window.confirm('Are you sure you want to delete this club?');
        if (confirmDelete) {
            try {
                deleteClub(club.id);
                removeClubContext(club.id);
            } catch (error) {
                console.error('Error deleting club:', error);
            }
        }
    };

    return (
        <div className='modal-backdrop' onClick={handleToggleModal}>
            <div className='game-item'>
                <h3>{club.name}</h3>
                <p>{club.description}</p>
                <p>{club.sport}</p>
                <p>{club.members.length}</p>
                <button onClick={handleToggleModal}>Close</button>
                {user?.uid === club.organizer && (
                    <button onClick={handleDelete}>Delete</button>
                )}
            </div>
        </div>
    );
}