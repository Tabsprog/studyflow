import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  PlayCircle,
  Edit3,
  Trash2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { StudyObjective, ObjectiveStatus, STATUS_CONFIG } from '../types/objective';

interface ObjectiveCardProps {
  objective: StudyObjective;
  onEdit: (objective: StudyObjective) => void;
  onDeleteRequest: (objective: StudyObjective) => void;
  onStatusChange: (id: string, newStatus: ObjectiveStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const currentConfig = STATUS_CONFIG[objective.status];

  // Cálculo amigável de prazo
  const getDeadlineBadge = () => {
    if (!objective.deadline) {
      return {
        text: 'Sem prazo definido',
        className: 'bg-stone-100 text-stone-600 border-stone-200',
        isOverdue: false,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = objective.deadline.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

    if (objective.status === 'concluido') {
      return {
        text: `Prazo: ${formattedDate}`,
        className: 'bg-stone-100 text-stone-600 border-stone-200',
        isOverdue: false,
      };
    }

    if (diffDays < 0) {
      const daysOverdue = Math.abs(diffDays);
      return {
        text: `Atrasado há ${daysOverdue} ${daysOverdue === 1 ? 'dia' : 'dias'} (${formattedDate})`,
        className: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
        isOverdue: true,
      };
    }

    if (diffDays === 0) {
      return {
        text: `Vence hoje! (${formattedDate})`,
        className: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold animate-pulse',
        isOverdue: false,
      };
    }

    if (diffDays === 1) {
      return {
        text: `Vence amanhã (${formattedDate})`,
        className: 'bg-amber-50 text-amber-800 border-amber-200',
        isOverdue: false,
      };
    }

    if (diffDays <= 5) {
      return {
        text: `Faltam ${diffDays} dias (${formattedDate})`,
        className: 'bg-sky-50 text-sky-800 border-sky-200',
        isOverdue: false,
      };
    }

    return {
      text: `Até ${formattedDate}`,
      className: 'bg-stone-50 text-stone-700 border-stone-200',
      isOverdue: false,
    };
  };

  const deadlineInfo = getDeadlineBadge();

  return (
    <article
      className={`relative rounded-2xl bg-white border transition-all duration-200 p-5 flex flex-col justify-between shadow-xs hover:shadow-md ${
        objective.status === 'concluido'
          ? 'border-emerald-200/80 bg-gradient-to-b from-emerald-50/20 to-white'
          : 'border-stone-200/90 hover:border-stone-300'
      }`}
    >
      {/* Barra de Status Lateral sutil */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl ${
          objective.status === 'concluido'
            ? 'bg-emerald-500'
            : objective.status === 'em_andamento'
            ? 'bg-blue-500'
            : 'bg-amber-400'
        }`}
      />

      <div>
        {/* Cabeçalho do Card: Status Badge & Ações Rápidas */}
        <div className="flex items-start justify-between gap-3 mb-3 pl-2">
          {/* Badge de Status Atual */}
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${currentConfig.badgeClass} ${currentConfig.borderClass}`}
          >
            {objective.status === 'concluido' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            {objective.status === 'em_andamento' && <PlayCircle className="w-3.5 h-3.5 text-blue-600" />}
            {objective.status === 'nao_iniciado' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
            {currentConfig.label}
          </span>

          {/* Botões de Ação (Editar e Excluir) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(objective)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Editar objetivo de estudo"
              aria-label={`Editar objetivo ${objective.title}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteRequest(objective)}
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Excluir objetivo"
              aria-label={`Excluir objetivo ${objective.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título */}
        <div className="pl-2 mb-2">
          <h3
            className={`text-base sm:text-lg font-bold leading-snug tracking-tight ${
              objective.status === 'concluido'
                ? 'line-through text-stone-500'
                : 'text-stone-900'
            }`}
          >
            {objective.title}
          </h3>
        </div>

        {/* Descrição */}
        {objective.description ? (
          <p
            className={`text-xs sm:text-sm pl-2 mb-4 leading-relaxed whitespace-pre-wrap ${
              objective.status === 'concluido'
                ? 'text-stone-400'
                : 'text-stone-600'
            }`}
          >
            {objective.description}
          </p>
        ) : (
          <p className="text-xs text-stone-400 pl-2 italic mb-4">
            Sem descrição complementar
          </p>
        )}
      </div>

      {/* Rodapé do Card: Prazo e Alternador Rápido de Status */}
      <div className="pt-3.5 border-t border-stone-100 pl-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Prazo */}
        <div
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border ${deadlineInfo.className}`}
        >
          {deadlineInfo.isOverdue ? (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <Calendar className="w-3.5 h-3.5 shrink-0 text-stone-500" />
          )}
          <span>{deadlineInfo.text}</span>
        </div>

        {/* Alternador de Status em 1 Clique */}
        <div className="flex items-center gap-1 text-xs font-medium w-full sm:w-auto justify-end">
          {objective.status !== 'concluido' ? (
            <button
              onClick={() => onStatusChange(objective.id, 'concluido')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
              title="Marcar este objetivo como Concluído"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Concluir</span>
            </button>
          ) : (
            <button
              onClick={() => onStatusChange(objective.id, 'em_andamento')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              title="Reabrir objetivo"
            >
              <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Reabrir</span>
            </button>
          )}

          {objective.status === 'nao_iniciado' && (
            <button
              onClick={() => onStatusChange(objective.id, 'em_andamento')}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors cursor-pointer"
              title="Começar este estudo agora"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Iniciar</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
