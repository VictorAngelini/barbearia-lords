import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const services = [
  { name: 'Corte Clássico', price: 'R$ 35', duration: '30 min', icon: '✂' },
  { name: 'Barba', price: 'R$ 25', duration: '20 min', icon: '🧔' },
  { name: 'Corte + Barba', price: 'R$ 55', duration: '50 min', icon: '💈' },
  { name: 'Pezinho', price: 'R$ 15', duration: '15 min', icon: '✨' },
  { name: 'Hidratação', price: 'R$ 30', duration: '20 min', icon: '💧' },
  { name: 'Progressiva', price: 'R$ 80', duration: '60 min', icon: '🪒' },
];

const barbers = [
  { name: 'Carlos Silva', specialty: 'Cortes Clássicos', experience: '8 anos' },
  { name: 'Rafael Costa', specialty: 'Barba & Estilo', experience: '5 anos' },
  { name: 'Diego Souza', specialty: 'Cortes Modernos', experience: '3 anos' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-transparent to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[url('/banner.jpg.PNG')] bg-cover bg-center opacity-20" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center px-4 max-w-3xl mx-auto"
        >
          <div className="text-yellow-500 text-6xl mb-6">✂</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Barbearia <span className="text-yellow-500">Lords</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed">
            Estilo, precisão e elegância. O melhor corte para o melhor de você.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/agendar"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-lg transition-all text-lg"
            >
              Agendar Agora
            </Link>
            <a
              href="#servicos"
              className="border border-yellow-500/50 hover:border-yellow-500 text-yellow-500 font-semibold px-8 py-4 rounded-lg transition-all text-lg"
            >
              Ver Serviços
            </a>
          </div>
        </motion.div>
      </section>

      <section id="servicos" className="py-20 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Nossos Serviços</h2>
          <div className="w-16 h-1 bg-yellow-500 mx-auto" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111] border border-yellow-500/10 hover:border-yellow-500/40 rounded-xl p-6 transition-all cursor-default"
            >
              <div className="text-3xl mb-3">{service.icon}</div>
              <h3 className="text-white font-semibold text-lg">{service.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{service.duration}</p>
              <p className="text-yellow-500 font-bold text-xl mt-3">{service.price}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Nossa Equipe</h2>
          <div className="w-16 h-1 bg-yellow-500 mx-auto" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {barbers.map((barber, i) => (
            <motion.div
              key={barber.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-[#111] border border-yellow-500/10 rounded-xl p-8 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4 text-3xl">
                💈
              </div>
              <h3 className="text-white font-semibold text-lg">{barber.name}</h3>
              <p className="text-yellow-500 text-sm mt-1">{barber.specialty}</p>
              <p className="text-gray-500 text-sm mt-2">{barber.experience} de experiência</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-yellow-500/10 border-t border-b border-yellow-500/20 py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: '500+', label: 'Clientes Atendidos' },
            { value: '5★', label: 'Avaliação Média' },
            { value: '3', label: 'Barbeiros Especialistas' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-bold text-yellow-500">{stat.value}</div>
              <div className="text-gray-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-8 px-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Barbearia Lords. Todos os direitos reservados.</p>
        <p className="mt-1">Seg-Sáb: 09h–19h | Rua dos Estilos, 123</p>
      </footer>
    </div>
  );
}
