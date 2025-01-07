
interface ConfirmationModelProps {
    isOpen:boolean,
    onClose:() => void;
    onConfirm: () => void;
    title: string;
    actionText?: string;
}


const ConfirmationModal = ({
    isOpen, onClose, onConfirm, title, actionText,
}:ConfirmationModelProps) => {

  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="flex items-center justify-end">
        <button
          className="btn-secondary mr-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="btn-primary"
          onClick={onConfirm}
        >
          {actionText || "Confirm"}
        </button>
      </div>
    </div>
  </div>
  )
}

export default ConfirmationModal