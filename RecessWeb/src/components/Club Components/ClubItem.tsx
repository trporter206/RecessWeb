import React, { useState } from 'react';
import { Club } from '../../models/Club';
import { ClubInfoModal } from './ClubInfoModal';

interface ClubItemProps {
    club: Club;
}

export const ClubItem: React.FC<ClubItemProps> = ({club}) => {
    const [showModal, setShowModal] = useState(false);

    const handleToggleModal = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowModal(!showModal);
      };

    return (
        <div className='club-item' onClick={handleToggleModal}>
            <div className='club-content'>
                <h3>{club.name}</h3>
                <p>{club.sport}</p>
                <p>{club.members.length}</p>
            </div>
            {showModal && (
                <ClubInfoModal
                club={club}
                />
            )}
        </div>
    );
}