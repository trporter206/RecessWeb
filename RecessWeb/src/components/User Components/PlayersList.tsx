// LocationsList component
import React from 'react';
import { User } from '../../models/User';
import { PlayerItem } from './PlayerItem';

type PlayersListProps = {
    users: User[];
};

export const PlayersList: React.FC<PlayersListProps> = ({ users }) => {
    return (
        <div>
            {users.map(user => (
                <PlayerItem 
                    key={user.id} 
                    user={user} // Pass the entire location object
                />
            ))}
        </div>
    );
};
