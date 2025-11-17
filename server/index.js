import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './db/db.js';
import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import ofertaRoutes from './routes/ofertaRoutes.js';
import estudianteRoutes from './routes/estudianteRoutes.js'; 
import aplicacionRoutes from './routes/aplicacionRoutes.js';
import observacionRoutes from './routes/observacionRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import asignacionRoutes from './routes/asignacionRoutes.js';


dotenv.config();

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
connectToDatabase();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tutores', tutorRoutes); 
app.use('/api/company', companyRoutes);
app.use('/api/companies', companyRoutes);

app.use('/api/ofertas', ofertaRoutes);
app.use('/api/estudiantes', estudianteRoutes); 
app.use('/api/aplicaciones', aplicacionRoutes);
app.use('/api/observaciones', observacionRoutes);
app.use('/api/asignaciones', asignacionRoutes);





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});