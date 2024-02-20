import React from 'react';
import { GameComment } from '../../models/Game'; // Adjust the import path based on your project structure

interface GameCommentBoxProps {
    comment: GameComment;
    username: string;
    currentUserId: string;
    onDelete: (comment: GameComment) => void; // Function to handle comment deletion
  }
  

  const GameCommentBox: React.FC<GameCommentBoxProps> = ({ comment, username, currentUserId, onDelete }) => {
    const isUserComment = comment.userId === currentUserId;

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation(); // Prevent the event from bubbling up
        onDelete(comment); // Proceed to delete the comment
      };
  
    return (
      <div className="game-comment-box">
        <p>{comment.text}</p>
        <div className='comment-notes'>
          <p><strong>{username}</strong></p>
          {isUserComment && (
            <button onClick={handleDeleteClick}>Delete</button> // Call onDelete with the comment to delete
          )}
        </div>
      </div>
    );
  };
  

export default GameCommentBox;
