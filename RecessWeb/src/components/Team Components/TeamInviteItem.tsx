import { useState } from "react";
import { Team } from "../../models/Team";
import { TeamInfoModal } from "./TeamInfoModal";
import { Button } from "@mui/material";

interface TeamInviteItemProps {
    team: Team;
    onAccept: (teamId: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onDecline: (teamId: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const TeamInviteItem: React.FC<TeamInviteItemProps> = ({ team, onAccept, onDecline }) => {
    const { name } = team;
    const [showTeamInfoModal, setShowTeamInfoModal] = useState(false);

    const handleToggleModal = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowTeamInfoModal(!showTeamInfoModal);
    }

    const handleAccept = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        onAccept(team.id, event); // Pass the team ID and event to the callback
    };

    const handleDecline = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        onDecline(team.id, event); // Similarly pass the event
      };

    return (
        <div className='team-item' onClick={handleToggleModal}>
            <div className='team-content'>
            <h3>{name}</h3>
            <div className="team-invite-actions">
                <Button variant="contained" color="primary" onClick={handleAccept}>
                Accept
                </Button>
                <Button variant="contained" color="secondary" onClick={handleDecline}>
                Decline
                </Button>
            </div>
            </div>
            {showTeamInfoModal && (
                <TeamInfoModal 
                    team={team} 
                    onClose={() => setShowTeamInfoModal(false)} 
                />
            )}
        </div>
    );
}