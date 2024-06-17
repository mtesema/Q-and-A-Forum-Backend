import React from "react";
import "./Modal.css"; // Ensure this path is correct

const Modal = ({ isOpen, onClose, answer }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Answer Details</h2>
        {answer ? (
          <>
            <p>{answer.content}</p>
            <div className="modal-meta">
              <span>Answered by: {answer.authorName}</span>
              <span>
                Date: {new Date(answer.creation_date).toLocaleDateString()}
              </span>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
