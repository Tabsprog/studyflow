import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ObjectiveStats } from './components/ObjectiveStats';
import { ObjectiveFilters } from './components/ObjectiveFilters';
import { ObjectiveCard } from './components/ObjectiveCard';
import { ObjectiveFormModal } from './components/ObjectiveFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { Toast, ToastMessage } from './components/Toast';
import { storageService } from './services/storageService';
import { StudyObjective, ObjectiveFormData, ObjectiveStatus } from './types/objective';
import { Lightbulb, Plus } from 'lucide-react';

export default function App() {
  const [objectives, setObjectives] = useState<StudyObjective[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState<'deadline' | 'createdAt' | 'title'>('deadline');

  // Controle de Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<StudyObjective | null>(null);
  const [deletingObjective, setDeletingObjective] = useState<StudyObjective | null>(null);

  // Notificações Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToast({
      id: String(Date.now()),
      type,
      text,
    });
  };

  // Carrega objetivos do localStorage na montagem
  useEffect(() => {
    const loaded = storageService.getAll();
    setObjectives(loaded);
  }, []);

  // Abrir modal para novo objetivo
  const handleOpenNewModal = () => {
    setEditingObjective(null);
    setIsFormModalOpen(true);
  };

  // Abrir modal para edição
  const handleOpenEditModal = (obj: StudyObjective) => {
    setEditingObjective(obj);
    setIsFormModalOpen(true);
  };

  // Salvar novo objetivo ou atualizar existente
  const handleSubmitForm = (formData: ObjectiveFormData) => {
    if (editingObjective) {
      const updated = storageService.update(editingObjective.id, formData);
      if (updated) {
        setObjectives(prev => prev.map(o => (o.id === updated.id ? updated : o)));
        showToast('Objetivo de estudo atualizado com sucesso!');
      }
    } else {
      const created = storageService.create(formData);
      setObjectives(prev => [created, ...prev]);
      showToast('Novo objetivo de estudo cadastrado!');
    }
    setIsFormModalOpen(false);
    setEditingObjective(null);
  };

  // Alternar status do objetivo diretamente pelo card
  const handleStatusChange = (id: string, newStatus: ObjectiveStatus) => {
    const updated = storageService.update(id, { status: newStatus });
    if (updated) {
      setObjectives(prev => prev.map(o => (o.id === id ? updated : o)));
      const statusLabels: Record<ObjectiveStatus, string> = {
        nao_iniciado: 'marcado como Não iniciado',
        em_andamento: 'iniciado! Bom estudo!',
        concluido: 'concluído! Parabéns pela conquista! 🎉',
      };
      showToast(`Objetivo ${statusLabels[newStatus]}`);
    }
  };

  // Solicitar exclusão (abre confirmação)
  const handleDeleteRequest = (obj: StudyObjective) => {
    setDeletingObjective(obj);
  };

  // Confirmar exclusão do objetivo
  const handleConfirmDelete = () => {
    if (!deletingObjective) return;
    const success = storageService.delete(deletingObjective.id);
    if (success) {
      setObjectives(prev => prev.filter(o => o.id !== deletingObjective.id));
      showToast('Objetivo removido com sucesso.', 'info');
    }
    setDeletingObjective(null);
  };

  // Restaurar exemplos para testar
  const handleRestoreExamples = () => {
    const examples = storageService.resetWithExamples();
    setObjectives(examples);
    showToast('Exemplos de objetivos recarregados.');
  };

  // Contagens para os filtros
  const counts = useMemo(() => {
    return {
      todos: objectives.length,
      nao_iniciado: objectives.filter(o => o.status === 'nao_iniciado').length,
      em_andamento: objectives.filter(o => o.status === 'em_andamento').length,
      concluido: objectives.filter(o => o.status === 'concluido').length,
    };
  }, [objectives]);

  // Filtragem e ordenação dos objetivos
  const filteredObjectives = useMemo(() => {
    return objectives
      .filter(obj => {
        // Filtro por status
        if (statusFilter !== 'todos' && obj.status !== statusFilter) {
          return false;
        }

        // Filtro por texto de busca (título ou descrição)
        if (searchTerm.trim() !== '') {
          const query = searchTerm.toLowerCase();
          const matchTitle = obj.title.toLowerCase().includes(query);
          const matchDesc = obj.description?.toLowerCase().includes(query);
          return matchTitle || matchDesc;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          // Objetivos sem prazo vão para o final
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline.localeCompare(b.deadline);
        }
        if (sortBy === 'createdAt') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title, 'pt-BR');
        }
        return 0;
      });
  }, [objectives, statusFilter, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-stone-50/70 text-stone-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Cabeçalho */}
      <Header
        totalCount={counts.todos}
        completedCount={counts.concluido}
        onOpenNewModal={handleOpenNewModal}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Painel de Estatísticas & Quantidade Cadastrada */}
        <ObjectiveStats
          objectives={objectives}
          selectedFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        {/* Barra de Filtros e Busca (exibida quando houver objetivos) */}
        {objectives.length > 0 && (
          <ObjectiveFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            counts={counts}
          />
        )}

        {/* Lista de Cards ou Estado Vazio */}
        {filteredObjectives.length > 0 ? (
          <section
            aria-label="Lista de Objetivos de Estudo"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5"
          >
            {filteredObjectives.map(obj => (
              <ObjectiveCard
                key={obj.id}
                objective={obj}
                onEdit={handleOpenEditModal}
                onDeleteRequest={handleDeleteRequest}
                onStatusChange={handleStatusChange}
              />
            ))}
          </section>
        ) : (
          <EmptyState
            isFiltered={objectives.length > 0 && filteredObjectives.length === 0}
            onOpenNewModal={handleOpenNewModal}
            onClearFilters={() => {
              setSearchTerm('');
              setStatusFilter('todos');
            }}
            onRestoreExamples={handleRestoreExamples}
          />
        )}

        {/* Dica Pedagógica Fixa para Iniciantes */}
        <div className="bg-indigo-50/60 border border-indigo-150/70 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs sm:text-sm text-indigo-950">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-indigo-900">
              Dica pedagógica para estudantes iniciantes:
            </p>
            <p className="text-indigo-800/90 leading-relaxed">
              Divida matérias extensas em metas pequenas (de 30 a 50 minutos). Completar objetivos curtos com frequência estimula o cérebro, consolida o hábito diário e evita a frustração do acúmulo de matéria.
            </p>
          </div>
        </div>
      </main>

      {/* Rodapé Simples e Acolhedor */}
      <footer className="border-t border-stone-200/80 bg-white/70 py-6 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} StudyFlow • Organização simples para estudantes iniciantes.</p>
          <p className="text-stone-400">Dados salvos com segurança no seu navegador.</p>
        </div>
      </footer>

      {/* Modais do Sistema */}
      <ObjectiveFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingObjective(null);
        }}
        onSubmit={handleSubmitForm}
        editingObjective={editingObjective}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingObjective)}
        objective={deletingObjective}
        onCancel={() => setDeletingObjective(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Notificação Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
