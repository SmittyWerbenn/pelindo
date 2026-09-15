import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = "Hapus", onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      widthClass="max-w-sm"
      footer={
        <>
          <button
            onClick={onCancel}
            className="rounded-md border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 hover:bg-surface-alt"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-status-red px-3.5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-gray-600">{message}</p>
    </Modal>
  );
}
