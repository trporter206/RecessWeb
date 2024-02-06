import { Team } from "../../models/Team";

export const TeamItem: React.FC<{ team: Team }> = ({ team }) => {
    const { name, wins, losses } = team;

    return (
        <div className='team-item'>
            <div className='team-content'>
                <div className='team-circle'></div>
                <h2>{name}</h2>
                <div className='teamItem-stats'>
                    <div className='team-wins'>
                        <p>Wins</p>
                        <h3>{wins}</h3>
                    </div>
                    <div className='team-losses'>
                        <p>Losses</p>
                        <h3>{losses}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}