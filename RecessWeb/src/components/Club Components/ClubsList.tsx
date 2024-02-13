import { Club } from "../../models/Club";
import { ClubItem } from "./ClubItem";

interface ClubsListProps {
    clubs: Club[];
}

export const ClubsList: React.FC<ClubsListProps> = ({ clubs }) => {
    return (
        <div>
            {clubs.map(club => (
                <ClubItem 
                    key={club.id}
                    club={club} />
            ))}
        </div>
    );
}