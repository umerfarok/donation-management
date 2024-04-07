import React, { useState } from 'react';

const DeleteUser = ({ userId, onDeleteUser }) => {
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    onDeleteUser(userId, password);
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setPassword('');
  };

  return (
    <div className="delete-user "style={{display:'inline-block'}}>
      <button className="btn btn-danger" onClick={handleDeleteClick}>
        Delete User
      </button>

      {showModal && (
        <div className="modal" >
          <div className="modal-content">
            <h3>Confirm user deletion</h3>
            <p >Enter password to delete the user:</p>
            <input
              type="text"
              placeholder='Some secret password...'
              value={password}
              style={{marginBottom:'8px',borderRadius:'9px',padding:'4px'}}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Delete
              </button>
              <button className="btn btn-secondary" style={{margin:'8px'}} onClick={handleCancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteUser;
