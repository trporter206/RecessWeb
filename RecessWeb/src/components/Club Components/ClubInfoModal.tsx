import { useState } from "react";
import { Club } from "../../models/Club";

interface ClubInfoModalProps {
    club: Club;
}

export const ClubInfoModal: React.FC<ClubInfoModalProps> = ({ club }) => {
    const [showModal, setShowModal] = useState(false);

    const handleToggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div className='modal-backdrop' onClick={handleToggleModal}>
            <div className='game-item'>
                <h3>{club.name}</h3>
                <p>{club.description}</p>
                <p>{club.sport}</p>
                <p>{club.members.length}</p>
                <button onClick={handleToggleModal}>Close</button>
            </div>
        </div>
    );
}