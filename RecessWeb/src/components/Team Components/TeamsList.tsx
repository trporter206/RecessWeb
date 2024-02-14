// LocationsList component
import React from 'react';
import { Team } from '../../models/Team';
import { TeamItem } from './TeamItem';

type TeamsListProps = {
    teams: Team[];
};

export const TeamsList: React.FC<TeamsListProps> = ({ teams }) => {
    return (
        <div className="playerlist-container">
            {teams.map(team => (
                <TeamItem team={team} />
            ))}
        </div>
    );
};
