import React from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="bg-crema-fondo border-2 border-cacao-900 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 className="text-base font-bold text-cacao-950">{title}</h3>
        <p className="text-sm text-cacao-900">{description}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-full bg-crema-pildora hover:bg-crema-pildoraActiva text-cacao-950 text-xs font-semibold"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-full bg-carmesi hover:bg-carmesi-oscuro text-white text-xs font-semibold"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
