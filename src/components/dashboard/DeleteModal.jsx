const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Deletion</h3>
        <p className="py-4">
          Are you sure you want to delete this donation request? 
          This action cannot be undone.
        </p>
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-error">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;