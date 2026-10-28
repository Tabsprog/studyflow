import React from 'react';
import { BookOpen, Plus, Target, Sparkles } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  completedCount: number;
  onOpenNewModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  completedCount,
  onOpenNewModal,
}) => {
  return (
    <header className="border-b border-stone-200/80 bg-white/95 sticky top-0 z-30 backdrop-blur-md shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Marca e Descrição */}
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                StudyFlow
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Iniciantes
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              Organize o que você quer aprender, um passo de cada vez
            </p>
          </div>
        </div>

        {/* Resumo do Header & Botão de Ação */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-stone-100/80 px-3 py-1.5 rounded-xl border border-stone-200/60 text-xs text-stone-600 font-medium">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>
              <strong className="text-stone-900">{completedCount}</strong> de{' '}
              <strong className="text-stone-900">{totalCount}</strong> concluídos
            </span>
          </div>

          <button
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
            aria-label="Cadastrar novo objetivo de estudo"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
