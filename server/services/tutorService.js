// server/services/tutorService.js (nuevo archivo)
import Estudiante from '../models/Estudiante.js';

export const actualizarDisponibilidadTutor = async (tutorId) => {
    const count = await Estudiante.countDocuments({ tutor: tutorId });
    const disponible = count < 3;

    await Tutor.findByIdAndUpdate(tutorId, { 
        $set: { 
            disponible,
            estudiantesAsignadosCount: count 
        }
    });
};