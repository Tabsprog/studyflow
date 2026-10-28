import React, { useState, useEffect } from 'react';
import { X, Calendar, Sparkles, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import {
  ObjectiveFormData,
  ObjectiveStatus,
  StudyObjective,
  STATUS_CONFIG,
} from '../types/objective';

interface ObjectiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ObjectiveFormData) => void;
  editingObjective: StudyObjective | null;
}

export const ObjectiveFormModal: React.FC<ObjectiveFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingObjective,
}) => {
  const isEditing = Boolean(editingObjective);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ObjectiveStatus>('nao_iniciado');
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  // Atualiza os campos sempre que abrir ou mudar o item em edição
  useEffect(() => {
    if (editingObjective) {
      setTitle(editingObjective.title);
      setDescription(editingObjective.description || '');
      setDeadline(editingObjective.deadline || '');
      setStatus(editingObjective.status);
    } else {
      // Padrão para novo objetivo: data sugerida daqui a 3 dias
      setTitle('');
      setDescription('');
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      setDeadline(defaultDate.toISOString().split('T')[0]);
      setStatus('nao_iniciado');
    }
    setErrors({});
  }, [editingObjective, isOpen]);

  if (!isOpen) return null;

  // Atalhos rápidos para preencher a data de prazo
  const setQuickDeadline = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDeadline(d.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, informe o título do seu objetivo de estudo.';
    }

    if (!deadline) {
      newErrors.deadline = 'Escolha uma data de prazo para organizar seu cronograma.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-stone-900">
                {isEditing ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
              </h2>
              <p className="text-xs text-stone-500">
                {isEditing
                  ? 'Atualize os dados e o andamento do seu estudo'
                  : 'Defina uma meta clara para manter o foco'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl hover:bg-stone-200/50 transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5">
          {/* Campo: Título */}
          <div>
            <label
              htmlFor="goal-title"
              className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5"
            >
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
              }}
              placeholder="Ex: Aprender funções em JavaScript e resolver 5 exercícios"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-stone-200 focus:border-indigo-500 focus:ring-indigo-200/50 bg-stone-50/50'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-rose-600 font-medium mt-1.5">{errors.title}</p>
            )}
          </div>

          {/* Campo: Descrição */}
          <div>
            <label
              htmlFor="goal-description"
              className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5"
            >
              Descrição ou Anotações <span className="text-stone-400 font-normal lowercase">(opcional)</span>
            </label>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ex: Consultar a documentação do MDN, ver vídeos do canal X e criar uma lista de dúvidas para o próximo encontro."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 transition-all resize-none"
            />
          </div>

          {/* Campo: Prazo */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="goal-deadline"
                className="text-xs font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                Prazo Limite <span className="text-rose-500">*</span>
              </label>
            </div>

            <input
              id="goal-deadline"
              type="date"
              value={deadline}
              onChange={e => {
                setDeadline(e.target.value);
                if (errors.deadline) setErrors(prev => ({ ...prev, deadline: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                errors.deadline
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-stone-200 focus:border-indigo-500 focus:ring-indigo-200/50 bg-stone-50/50'
              }`}
            />
            {errors.deadline && (
              <p className="text-xs text-rose-600 font-medium mt-1.5">{errors.deadline}</p>
            )}

            {/* Atalhos rápidos para o estudante */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] text-stone-400 font-medium mr-1">Atalhos:</span>
              <button
                type="button"
                onClick={() => setQuickDeadline(0)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(3)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                Em 3 dias
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(7)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                1 semana
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(15)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                15 dias
              </button>
            </div>
          </div>

          {/* Campo: Status */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
              Status do Estudo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Não Iniciado */}
              <button
                type="button"
                onClick={() => setStatus('nao_iniciado')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  status === 'nao_iniciado'
                    ? 'border-amber-400 bg-amber-50 text-amber-900 ring-2 ring-amber-400/30'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-600'
                }`}
              >
                <Clock className="w-4 h-4 mb-1 text-amber-600" />
                <span className="text-xs font-semibold">Não iniciado</span>
              </button>

              {/* Em Andamento */}
              <button
                type="button"
                onClick={() => setStatus('em_andamento')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  status === 'em_andamento'
                    ? 'border-blue-400 bg-blue-50 text-blue-900 ring-2 ring-blue-400/30'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-600'
                }`}
              >
                <PlayCircle className="w-4 h-4 mb-1 text-blue-600" />
                <span className="text-xs font-semibold">Em andamento</span>
              </button>

              {/* Concluído */}
              <button
                type="button"
                onClick={() => setStatus('concluido')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  status === 'concluido'
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400/30'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-600'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 mb-1 text-emerald-600" />
                <span className="text-xs font-semibold">Concluído</span>
              </button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-sm font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
            >
              {isEditing ? 'Atualizar Objetivo' : 'Salvar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
