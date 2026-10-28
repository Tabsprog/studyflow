export type ObjectiveStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyObjective {
  id: string;
  title: string;
  description: string;
  deadline: string; // Formato YYYY-MM-DD
  status: ObjectiveStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type ObjectiveFormData = {
  title: string;
  description: string;
  deadline: string;
  status: ObjectiveStatus;
};

export const STATUS_CONFIG: Record<
  ObjectiveStatus,
  {
    label: string;
    description: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    badgeClass: string;
  }
> = {
  nao_iniciado: {
    label: 'Não iniciado',
    description: 'Planejado para começar',
    bgClass: 'bg-amber-50 dark:bg-amber-950/30',
    textClass: 'text-amber-800 dark:text-amber-300',
    borderClass: 'border-amber-200 dark:border-amber-800/60',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  },
  em_andamento: {
    label: 'Em andamento',
    description: 'Estudo em progresso',
    bgClass: 'bg-blue-50 dark:bg-blue-950/30',
    textClass: 'text-blue-800 dark:text-blue-300',
    borderClass: 'border-blue-200 dark:border-blue-800/60',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  },
  concluido: {
    label: 'Concluído',
    description: 'Objetivo alcançado!',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/30',
    textClass: 'text-emerald-800 dark:text-emerald-300',
    borderClass: 'border-emerald-200 dark:border-emerald-800/60',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
};
