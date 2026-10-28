import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { StudyObjective } from '../types/objective';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  objective: StudyObjective | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  objective,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen || !objective) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden p-6 transform transition-all animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="flex-1">
            <h3 id="delete-dialog-title" className="text-lg font-bold text-stone-900">
              Confirmar exclusão
            </h3>
            <p id="delete-dialog-desc" className="text-sm text-stone-600 mt-1 leading-relaxed">
              Você tem certeza de que deseja excluir o objetivo:{' '}
              <strong className="text-stone-900 font-semibold block mt-1 p-2 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                "{objective.title}"
              </strong>
            </p>
            <p className="text-xs text-rose-600 font-medium mt-2">
              Esta ação é permanente e os dados serão removidos do seu navegador.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-sm font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sim, excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
