import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db, dbPath, initDatabase } from './db.js';
import { authRouter } from './routes/auth.js';
import { doctorsRouter } from './routes/doctors.js';
import { appointmentsRouter } from './routes/appointments.js';
import { prescriptionsRouter } from './routes/prescriptions.js';
import { ocrRouter } from './routes/ocr.js';
import { aiRouter } from './routes/ai.js';
import { kiosksRouter } from './routes/kiosks.js';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const rawCors = process.env.CORS_ORIGIN;
const corsOrigin =
  !rawCors || rawCors === '*'
    ? '*'
    : rawCors.includes(',')
    ? rawCors.split(',').map((s) => s.trim())
    : rawCors.trim();

// Middleware
app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));

// Initialize SQLite database
initDatabase();

// Health check verifying server and SQLite connectivity
app.get('/api/health', (_req, res) => {
  try {
    const dbCheck = db.prepare('SELECT 1 as connected').get();
    res.json({
      status: 'healthy',
      platform: 'Arogya Setu Rural Telemedicine Backend',
      database: 'SQLite (better-sqlite3)',
      databasePath: dbPath,
      databaseConnected: Boolean(dbCheck),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'unhealthy',
      error: err.message || 'Database connection error',
    });
  }
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/prescriptions', prescriptionsRouter);
app.use('/api/ocr', ocrRouter);
app.use('/api/ai', aiRouter);
app.use('/api/kiosks', kiosksRouter);

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start listening (bind to 0.0.0.0 for Linux container/Render compatibility)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🩺 Arogya Setu Backend Server is running!`);
  console.log(`🚀 API Base URL: http://0.0.0.0:${PORT}/api`);
  console.log(`💾 Database: SQLite (${dbPath})`);
  console.log(`🌐 CORS Origin: ${corsOrigin === '*' ? 'All origins (*)' : JSON.stringify(corsOrigin)}`);
  console.log(`=======================================================`);
});
