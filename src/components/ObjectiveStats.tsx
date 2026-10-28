import React from 'react';
import { Target, PlayCircle, CheckCircle2, Clock, Award } from 'lucide-react';
import { StudyObjective } from '../types/objective';

interface ObjectiveStatsProps {
  objectives: StudyObjective[];
  selectedFilter: string;
  onFilterChange: (status: string) => void;
}

export const ObjectiveStats: React.FC<ObjectiveStatsProps> = ({
  objectives,
  selectedFilter,
  onFilterChange,
}) => {
  const total = objectives.length;
  const naoIniciados = objectives.filter(o => o.status === 'nao_iniciado').length;
  const emAndamento = objectives.filter(o => o.status === 'em_andamento').length;
  const concluidos = objectives.filter(o => o.status === 'concluido').length;

  const percentConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs transition-all">
      {/* Barra de Progresso Geral */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-semibold text-stone-900">
              Progresso Geral dos Estudos
            </h2>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            {percentConcluido}% concluído
          </span>
        </div>
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${percentConcluido}%` }}
            title={`Concluídos: ${concluidos}`}
          />
          <div
            className="bg-blue-400 h-full transition-all duration-500 ease-out"
            style={{
              width: `${total > 0 ? (emAndamento / total) * 100 : 0}%`,
            }}
            title={`Em andamento: ${emAndamento}`}
          />
        </div>
      </div>

      {/* Grid de Contadores Informativos e Interativos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Cadastrado */}
        <button
          onClick={() => onFilterChange('todos')}
          className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedFilter === 'todos'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200/80 text-stone-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-xs font-medium ${
                selectedFilter === 'todos' ? 'text-stone-300' : 'text-stone-500'
              }`}
            >
              Total de Objetivos
            </span>
            <Target
              className={`w-4 h-4 ${
                selectedFilter === 'todos' ? 'text-stone-200' : 'text-indigo-600'
              }`}
            />
          </div>
          <div className="text-2xl font-bold tracking-tight">{total}</div>
          <p
            className={`text-[11px] mt-0.5 ${
              selectedFilter === 'todos' ? 'text-stone-300' : 'text-stone-500'
            }`}
          >
            {total === 1 ? '1 meta cadastrada' : `${total} metas cadastradas`}
          </p>
        </button>

        {/* Em Andamento */}
        <button
          onClick={() => onFilterChange('em_andamento')}
          className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedFilter === 'em_andamento'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-blue-50/70 hover:bg-blue-50 border-blue-200/80 text-blue-950'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-xs font-medium ${
                selectedFilter === 'em_andamento' ? 'text-blue-100' : 'text-blue-700'
              }`}
            >
              Em Andamento
            </span>
            <PlayCircle
              className={`w-4 h-4 ${
                selectedFilter === 'em_andamento' ? 'text-white' : 'text-blue-600'
              }`}
            />
          </div>
          <div className="text-2xl font-bold tracking-tight">{emAndamento}</div>
          <p
            className={`text-[11px] mt-0.5 ${
              selectedFilter === 'em_andamento' ? 'text-blue-100' : 'text-blue-600'
            }`}
          >
            Foco ativo no momento
          </p>
        </button>

        {/* Concluídos */}
        <button
          onClick={() => onFilterChange('concluido')}
          className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedFilter === 'concluido'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-emerald-50/70 hover:bg-emerald-50 border-emerald-200/80 text-emerald-950'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-xs font-medium ${
                selectedFilter === 'concluido'
                  ? 'text-emerald-100'
                  : 'text-emerald-700'
              }`}
            >
              Concluídos
            </span>
            <CheckCircle2
              className={`w-4 h-4 ${
                selectedFilter === 'concluido' ? 'text-white' : 'text-emerald-600'
              }`}
            />
          </div>
          <div className="text-2xl font-bold tracking-tight">{concluidos}</div>
          <p
            className={`text-[11px] mt-0.5 ${
              selectedFilter === 'concluido' ? 'text-emerald-100' : 'text-emerald-600'
            }`}
          >
            Metas alcançadas!
          </p>
        </button>

        {/* Não Iniciados */}
        <button
          onClick={() => onFilterChange('nao_iniciado')}
          className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedFilter === 'nao_iniciado'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-amber-50/70 hover:bg-amber-50 border-amber-200/80 text-amber-950'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-xs font-medium ${
                selectedFilter === 'nao_iniciado' ? 'text-amber-100' : 'text-amber-700'
              }`}
            >
              Não Iniciados
            </span>
            <Clock
              className={`w-4 h-4 ${
                selectedFilter === 'nao_iniciado' ? 'text-white' : 'text-amber-600'
              }`}
            />
          </div>
          <div className="text-2xl font-bold tracking-tight">{naoIniciados}</div>
          <p
            className={`text-[11px] mt-0.5 ${
              selectedFilter === 'nao_iniciado' ? 'text-amber-100' : 'text-amber-700'
            }`}
          >
            Aguardando início
          </p>
        </button>
      </div>
    </div>
  );
};
