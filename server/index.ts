import express from "express";
import cors from "cors";
import { db } from "./db.js";
import { appointments } from "./schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const appointmentSchema = z.object({
  clientName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  clientPhone: z.string().min(8, "Telefone inválido"),
  service: z.string().min(1, "Selecione um serviço"),
  barber: z.string().min(1, "Selecione um barbeiro"),
  date: z.string().min(1, "Selecione uma data"),
  time: z.string().min(1, "Selecione um horário"),
  notes: z.string().optional(),
});

const BUSINESS_HOURS = {
  start: 9,
  end: 19,
};

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30",
];

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/appointments", async (_req, res) => {
  try {
    const all = await db.select().from(appointments).orderBy(appointments.date, appointments.time);
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
  }
});

app.get("/api/appointments/available-times", async (req, res) => {
  const { date, barber } = req.query as { date: string; barber: string };
  if (!date || !barber) {
    return res.status(400).json({ error: "Data e barbeiro são obrigatórios" });
  }

  try {
    const booked = await db
      .select()
      .from(appointments)
      .where(eq(appointments.date, date));

    const bookedTimes = booked
      .filter((a) => a.barber === barber && a.status !== "cancelled")
      .map((a) => a.time);

    const available = TIME_SLOTS.filter((t) => !bookedTimes.includes(t));
    res.json({ available, allSlots: TIME_SLOTS });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar horários" });
  }
});

app.post("/api/appointments", async (req, res) => {
  try {
    const data = appointmentSchema.parse(req.body);

    const [hour] = data.time.split(":").map(Number);
    if (hour < BUSINESS_HOURS.start || hour >= BUSINESS_HOURS.end) {
      return res.status(400).json({ error: "Horário fora do expediente" });
    }

    const existing = await db
      .select()
      .from(appointments)
      .where(eq(appointments.date, data.date));

    const conflict = existing.find(
      (a) => a.barber === data.barber && a.time === data.time && a.status !== "cancelled"
    );

    if (conflict) {
      return res.status(409).json({ error: "Horário já ocupado para este barbeiro" });
    }

    const [created] = await db.insert(appointments).values(data).returning();
    res.status(201).json(created);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});

app.patch("/api/appointments/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
    return res.status(400).json({ error: "Status inválido" });
  }

  try {
    const [updated] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, parseInt(id)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

app.delete("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.delete(appointments).where(eq(appointments.id, parseInt(id)));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao excluir agendamento" });
  }
});

app.listen(PORT, "localhost", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
