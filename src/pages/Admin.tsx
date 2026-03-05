import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Appointment = {
  id: number;
  clientName: string;
  clientPhone: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  createdAt: string;
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function Admin() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(data);
    } catch {
      console.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchAppointments();
    } catch {
      console.error('Erro ao atualizar status');
    }
  };

  const deleteAppointment = async (id: number) => {
    if (!confirm('Deseja excluir este agendamento?')) return;
    try {
      await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      fetchAppointments();
    } catch {
      console.error('Erro ao excluir');
    }
  };

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter((a) => a.status === filter);

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-gray-400">Gerencie todos os agendamentos da barbearia</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { key: 'all', label: 'Todos', color: 'text-white' },
            { key: 'pending', label: 'Pendentes', color: 'text-yellow-400' },
            { key: 'confirmed', label: 'Confirmados', color: 'text-blue-400' },
            { key: 'completed', label: 'Concluídos', color: 'text-green-400' },
            { key: 'cancelled', label: 'Cancelados', color: 'text-red-400' },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`bg-[#111] border rounded-xl p-4 text-center transition-all ${
                filter === key ? 'border-yellow-500' : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className={`text-2xl font-bold ${color}`}>{counts[key as keyof typeof counts]}</div>
              <div className="text-gray-500 text-xs mt-1">{label}</div>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Carregando agendamentos...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-4xl mb-4">📋</div>
            <p>Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((apt, i) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold text-lg">{apt.clientName}</h3>
                    <span className={`text-xs border px-2 py-0.5 rounded-full ${STATUS_COLORS[apt.status]}`}>
                      {STATUS_LABELS[apt.status]}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-400">
                    <div>📞 {apt.clientPhone}</div>
                    <div>✂ {apt.service}</div>
                    <div>💈 {apt.barber}</div>
                    <div>📅 {apt.date} às {apt.time}</div>
                  </div>
                  {apt.notes && (
                    <div className="text-gray-500 text-xs mt-2">💬 {apt.notes}</div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {apt.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(apt.id, 'confirmed')}
                      className="bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 text-blue-400 text-xs px-3 py-2 rounded-lg transition-all"
                    >
                      Confirmar
                    </button>
                  )}
                  {(apt.status === 'pending' || apt.status === 'confirmed') && (
                    <button
                      onClick={() => updateStatus(apt.id, 'completed')}
                      className="bg-green-500/20 hover:bg-green-500/40 border border-green-500/30 text-green-400 text-xs px-3 py-2 rounded-lg transition-all"
                    >
                      Concluir
                    </button>
                  )}
                  {apt.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(apt.id, 'cancelled')}
                      className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded-lg transition-all"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    onClick={() => deleteAppointment(apt.id)}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs px-3 py-2 rounded-lg transition-all"
                  >
                    Excluir
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
