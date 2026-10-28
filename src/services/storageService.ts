import { StudyObjective, ObjectiveFormData } from '../types/objective';

const STORAGE_KEY = 'studyflow_objectives_v1';

// Exemplos iniciais acolhedores para estudantes novatos
export const INITIAL_DEMO_OBJECTIVES: StudyObjective[] = [
  {
    id: 'demo-1',
    title: 'Compreender variáveis e tipos de dados em lógica de programação',
    description: 'Assistir às duas primeiras aulas do módulo introdutório e praticar com 3 exercícios práticos no caderno ou editor.',
    deadline: getFutureDate(3),
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Ler o Capítulo 1 do livro de introdução aos estudos',
    description: 'Fazer anotações no método Cornell e destacar os conceitos principais sobre organização de tempo.',
    deadline: getFutureDate(7),
    status: 'nao_iniciado',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Montar meu cronograma semanal de estudos',
    description: 'Reservar 45 minutos por dia, de segunda a quinta-feira, para manter o ritmo sem cansaço excessivo.',
    deadline: getFutureDate(-1),
    status: 'concluido',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

export const storageService = {
  /**
   * Obtém todos os objetivos salvos no localStorage.
   * Se for o primeiro acesso absoluto, carrega os exemplos iniciais para guiar o estudante.
   */
  getAll(): StudyObjective[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        // Primeiro acesso: inicializa com exemplos acolhedores
        this.saveAll(INITIAL_DEMO_OBJECTIVES);
        return INITIAL_DEMO_OBJECTIVES;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (err) {
      console.error('Erro ao ler objetivos do localStorage:', err);
      return [];
    }
  },

  /**
   * Grava a lista completa de objetivos no localStorage.
   */
  saveAll(objectives: StudyObjective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
    } catch (err) {
      console.error('Erro ao gravar objetivos no localStorage:', err);
    }
  },

  /**
   * Adiciona um novo objetivo.
   */
  create(data: ObjectiveFormData): StudyObjective {
    const newObjective: StudyObjective = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `obj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: data.title.trim(),
      description: (data.description || '').trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const current = this.getAll();
    const updated = [newObjective, ...current];
    this.saveAll(updated);
    return newObjective;
  },

  /**
   * Atualiza um objetivo existente pelo ID.
   */
  update(id: string, updates: Partial<ObjectiveFormData>): StudyObjective | null {
    const current = this.getAll();
    const index = current.findIndex(obj => obj.id === id);
    if (index === -1) return null;

    const updatedObjective: StudyObjective = {
      ...current[index],
      ...updates,
      title: updates.title !== undefined ? updates.title.trim() : current[index].title,
      description: updates.description !== undefined ? updates.description.trim() : current[index].description,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedObjective;
    this.saveAll(current);
    return updatedObjective;
  },

  /**
   * Remove um objetivo pelo ID.
   */
  delete(id: string): boolean {
    const current = this.getAll();
    const filtered = current.filter(obj => obj.id !== id);
    if (filtered.length === current.length) return false;

    this.saveAll(filtered);
    return true;
  },

  /**
   * Restaura exemplos padrão para facilitar testes.
   */
  resetWithExamples(): StudyObjective[] {
    this.saveAll(INITIAL_DEMO_OBJECTIVES);
    return INITIAL_DEMO_OBJECTIVES;
  },

  /**
   * Limpa todos os objetivos.
   */
  clearAll(): void {
    this.saveAll([]);
  }
};
