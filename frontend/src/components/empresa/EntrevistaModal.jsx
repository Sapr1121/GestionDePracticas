import React, { useState } from 'react';
import { X } from 'lucide-react';

export const EntrevistaModal = ({ isOpen, onClose, onConfirm, aplicacion }) => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState('');
    const [horaSeleccionada, setHoraSeleccionada] = useState('');

    if (!isOpen) return null;

    // Generar próximos 14 días (sin fines de semana)
    const getProximosDias = () => {
        const dias = [];
        const hoy = new Date();
        let diasAgregados = 0;
        let offset = 1;

        while (diasAgregados < 14) {
            const dia = new Date(hoy);
            dia.setDate(hoy.getDate() + offset);
            const diaSemana = dia.getDay();
            
            // Excluir sábado (6) y domingo (0)
            if (diaSemana !== 0 && diaSemana !== 6) {
                dias.push(dia);
                diasAgregados++;
            }
            offset++;
        }
        return dias;
    };

    // Horarios disponibles (8am - 5pm cada hora)
    const horariosDisponibles = [
        '08:00', '09:00', '10:00', '11:00', 
        '12:00', '13:00', '14:00', '15:00', 
        '16:00', '17:00'
    ];

    const handleConfirmar = () => {
        if (!fechaSeleccionada || !horaSeleccionada) {
            alert('Por favor selecciona fecha y hora');
            return;
        }

        const fechaCompleta = `${fechaSeleccionada}T${horaSeleccionada}:00`;
        onConfirm(fechaCompleta);
        setFechaSeleccionada('');
        setHoraSeleccionada('');
    };

    const proximosDias = getProximosDias();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Agendar Entrevista
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {aplicacion?.estudianteData?.nombre} {aplicacion?.estudianteData?.apellido}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-6">
                    {/* Selección de Fecha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Selecciona una fecha
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {proximosDias.map((dia, idx) => {
                                const fechaStr = dia.toISOString().split('T')[0];
                                const isSelected = fechaSeleccionada === fechaStr;
                                
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setFechaSeleccionada(fechaStr)}
                                        className={`p-3 rounded-lg border-2 transition ${
                                            isSelected
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    >
                                        <div className="text-xs text-gray-500">
                                            {dia.toLocaleDateString('es-CO', { weekday: 'short' })}
                                        </div>
                                        <div className="font-semibold">
                                            {dia.toLocaleDateString('es-CO', { 
                                                day: 'numeric', 
                                                month: 'short' 
                                            })}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selección de Hora */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Selecciona una hora
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {horariosDisponibles.map((hora) => {
                                const isSelected = horaSeleccionada === hora;
                                
                                return (
                                    <button
                                        key={hora}
                                        type="button"
                                        onClick={() => setHoraSeleccionada(hora)}
                                        className={`p-2 rounded border-2 transition ${
                                            isSelected
                                                ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                                                : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    >
                                        {hora}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Resumen */}
                    {fechaSeleccionada && horaSeleccionada && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Entrevista agendada para:</strong><br />
                                {new Date(`${fechaSeleccionada}T${horaSeleccionada}`).toLocaleDateString('es-CO', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} a las {horaSeleccionada}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirmar}
                        disabled={!fechaSeleccionada || !horaSeleccionada}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Confirmar Entrevista
                    </button>
                </div>
            </div>
        </div>
    );
};