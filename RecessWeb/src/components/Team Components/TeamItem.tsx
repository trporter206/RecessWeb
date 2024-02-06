import { useState } from "react";
import { Team } from "../../models/Team";
import { TeamInfoModal } from "./TeamInfoModal";

export const TeamItem: React.FC<{ team: Team }> = ({ team }) => {
    const { name, wins, losses } = team;
    const [showTeamInfoModal, setShowTeamInfoModal] = useState(false);

    const handleToggleModal = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowTeamInfoModal(!showTeamInfoModal);
    }

    return (
        <div className='team-item' onClick={handleToggleModal}>
            <div className='team-content'>
                <h2>{name}</h2>
                <div className='teamItem-stats'>
                    <div className='team-record'>
                        <p>Record</p>
                        <h3>{wins} - {losses}</h3>
                    </div>
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