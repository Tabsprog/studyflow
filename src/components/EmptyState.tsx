import React from 'react';
import { BookOpen, Plus, Sparkles, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenNewModal: () => void;
  onClearFilters: () => void;
  onRestoreExamples: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenNewModal,
  onClearFilters,
  onRestoreExamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-8 sm:p-12 text-center max-w-xl mx-auto my-6">
        <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-500 mx-auto flex items-center justify-center mb-4">
          <BookOpen className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-1">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-stone-500 mb-6 max-w-md mx-auto">
          Não encontramos objetivos correspondentes aos filtros ou termo de busca informado.
        </p>
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Limpar filtros de busca
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 text-center max-w-xl mx-auto my-6 shadow-xs">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center mb-4 shadow-inner">
        <Sparkles className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-stone-900 mb-2">
        Sua jornada de estudos começa aqui!
      </h3>
      <p className="text-sm text-stone-600 mb-6 max-w-md mx-auto leading-relaxed">
        Você ainda não cadastrou nenhum objetivo de estudo. Que tal dar o primeiro passo definindo uma pequena meta para hoje ou esta semana?
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenNewModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Primeiro Objetivo</span>
        </button>

        <button
          onClick={onRestoreExamples}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
          title="Carregar sugestões de estudo de exemplo"
        >
          <RotateCcw className="w-4 h-4 text-stone-500" />
          <span>Carregar Exemplos Guiados</span>
        </button>
      </div>
    </div>
  );
};
