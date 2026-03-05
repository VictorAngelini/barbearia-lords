import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';

const schema = z.object({
  clientName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  clientPhone: z.string().min(8, 'Telefone inválido'),
  service: z.string().min(1, 'Selecione um serviço'),
  barber: z.string().min(1, 'Selecione um barbeiro'),
  date: z.string().min(1, 'Selecione uma data'),
  time: z.string().min(1, 'Selecione um horário'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const SERVICES = [
  'Corte Clássico',
  'Barba',
  'Corte + Barba',
  'Pezinho',
  'Hidratação',
  'Progressiva',
];

const BARBERS = ['Carlos Silva', 'Rafael Costa', 'Diego Souza'];

export default function Booking() {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const selectedDate = watch('date');
  const selectedBarber = watch('barber');

  useEffect(() => {
    if (selectedDate && selectedBarber) {
      fetch(`/api/appointments/available-times?date=${selectedDate}&barber=${encodeURIComponent(selectedBarber)}`)
        .then((r) => r.json())
        .then((data) => setAvailableTimes(data.available || []))
        .catch(() => setAvailableTimes([]));
      setValue('time', '');
    }
  }, [selectedDate, selectedBarber, setValue]);

  const minDate = new Date().toISOString().split('T')[0];

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Erro ao criar agendamento');
        return;
      }
      setSuccess(true);
      reset();
      setAvailableTimes([]);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#111] border border-yellow-500/30 rounded-2xl p-10 text-center max-w-md"
        >
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Agendado com sucesso!</h2>
          <p className="text-gray-400 mb-6">Seu horário foi reservado. Aguarde a confirmação.</p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg transition-all"
          >
            Fazer outro agendamento
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Agendar Horário</h1>
          <div className="w-16 h-1 bg-yellow-500 mx-auto" />
          <p className="text-gray-400 mt-4">Preencha os dados abaixo para reservar seu horário</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#111] border border-yellow-500/10 rounded-2xl p-8 space-y-6"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome completo *</label>
              <input
                {...register('clientName')}
                placeholder="Seu nome"
                className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
              />
              {errors.clientName && <p className="text-red-400 text-xs mt-1">{errors.clientName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Telefone / WhatsApp *</label>
              <input
                {...register('clientPhone')}
                placeholder="(11) 99999-9999"
                className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
              />
              {errors.clientPhone && <p className="text-red-400 text-xs mt-1">{errors.clientPhone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Serviço *</label>
            <select
              {...register('service')}
              className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
            >
              <option value="">Selecione um serviço</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.service && <p className="text-red-400 text-xs mt-1">{errors.service.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Barbeiro *</label>
            <select
              {...register('barber')}
              className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
            >
              <option value="">Selecione um barbeiro</option>
              {BARBERS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {errors.barber && <p className="text-red-400 text-xs mt-1">{errors.barber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Data *</label>
            <input
              type="date"
              {...register('date')}
              min={minDate}
              className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
            />
            {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Horário *</label>
            {selectedDate && selectedBarber ? (
              availableTimes.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <label
                      key={time}
                      className={`cursor-pointer border rounded-lg px-3 py-2 text-sm text-center transition-all ${
                        watch('time') === time
                          ? 'bg-yellow-500 border-yellow-500 text-black font-bold'
                          : 'bg-[#1a1a1a] border-gray-700 text-white hover:border-yellow-500'
                      }`}
                    >
                      <input
                        type="radio"
                        value={time}
                        {...register('time')}
                        className="sr-only"
                      />
                      {time}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm py-3">Nenhum horário disponível para esta data e barbeiro.</p>
              )
            ) : (
              <p className="text-gray-500 text-sm py-3">Selecione barbeiro e data primeiro.</p>
            )}
            {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Observações (opcional)</label>
            <textarea
              {...register('notes')}
              placeholder="Alguma preferência ou observação?"
              rows={3}
              className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-4 rounded-lg transition-all text-lg"
          >
            {loading ? 'Agendando...' : 'Confirmar Agendamento'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
