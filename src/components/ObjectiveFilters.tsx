import React from 'react';
import { Search, ArrowUpDown, X, ListFilter } from 'lucide-react';
import { ObjectiveStatus } from '../types/objective';

interface ObjectiveFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: 'deadline' | 'createdAt' | 'title';
  onSortChange: (sort: 'deadline' | 'createdAt' | 'title') => void;
  counts: {
    todos: number;
    nao_iniciado: number;
    em_andamento: number;
    concluido: number;
  };
}

export const ObjectiveFilters: React.FC<ObjectiveFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  counts,
}) => {
  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'todos';

  const clearAllFilters = () => {
    onSearchChange('');
    onStatusFilterChange('todos');
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs space-y-3.5">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição do estudo..."
            className="w-full pl-9.5 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="sort-select" className="text-xs text-stone-500 font-medium flex items-center gap-1.5 whitespace-nowrap">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            Ordenar por:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={e => onSortChange(e.target.value as 'deadline' | 'createdAt' | 'title')}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="deadline">Prazo mais próximo</option>
            <option value="createdAt">Criados recentemente</option>
            <option value="title">Título (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Abas de Status com Contadores */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-stone-100">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-stone-400 flex items-center gap-1 mr-1">
            <ListFilter className="w-3.5 h-3.5" />
            Status:
          </span>

          <button
            onClick={() => onStatusFilterChange('todos')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'todos'
                ? 'bg-stone-900 text-white font-semibold'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            Todos ({counts.todos})
          </button>

          <button
            onClick={() => onStatusFilterChange('nao_iniciado')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'nao_iniciado'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100/70'
            }`}
          >
            Não iniciados ({counts.nao_iniciado})
          </button>

          <button
            onClick={() => onStatusFilterChange('em_andamento')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'em_andamento'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100/70'
            }`}
          >
            Em andamento ({counts.em_andamento})
          </button>

          <button
            onClick={() => onStatusFilterChange('concluido')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === 'concluido'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70'
            }`}
          >
            Concluídos ({counts.concluido})
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-stone-500 hover:text-stone-800 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
};
