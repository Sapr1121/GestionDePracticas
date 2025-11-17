import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const ObservacionModal = ({ isOpen, onClose, onSubmit, aplicacion, loading }) => {
    const [formData, setFormData] = useState({
        tipo: 'neutra',
        motivo: '',
        descripcion: ''
    });
    const [errors, setErrors] = useState({});

    if (!isOpen || !aplicacion) return null;

    const tiposObservacion = [
        { value: 'positiva', label: 'Positiva', icon: CheckCircle, color: 'green', desc: 'Buen desempeño o actitud destacable' },
        { value: 'neutra', label: 'Neutra', icon: Info, color: 'blue', desc: 'Información general o comentario' },
        { value: 'negativa', label: 'Negativa', icon: AlertTriangle, color: 'red', desc: 'Comportamiento inapropiado o incumplimiento' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        
        if (!formData.motivo.trim()) {
            newErrors.motivo = 'El motivo es requerido';
        } else if (formData.motivo.length < 10) {
            newErrors.motivo = 'El motivo debe tener al menos 10 caracteres';
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        } else if (formData.descripcion.length < 20) {
            newErrors.descripcion = 'La descripción debe tener al menos 20 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const handleClose = () => {
        setFormData({ tipo: 'neutra', motivo: '', descripcion: '' });
        setErrors({});
        onClose();
    };

    const selectedTipo = tiposObservacion.find(t => t.value === formData.tipo);
    const IconoTipo = selectedTipo?.icon;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Reportar Observación
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Estudiante: {aplicacion.estudianteData.nombre} {aplicacion.estudianteData.apellido}
                        </p>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Tipo de observación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Tipo de Observación *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {tiposObservacion.map(tipo => {
                                const Icono = tipo.icon;
                                const isSelected = formData.tipo === tipo.value;
                                
                                return (
                                    <button
                                        key={tipo.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, tipo: tipo.value }))}
                                        className={`p-4 rounded-lg border-2 transition ${
                                            isSelected
                                                ? `border-${tipo.color}-500 bg-${tipo.color}-50`
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icono 
                                            className={`mx-auto mb-2 ${
                                                isSelected ? `text-${tipo.color}-600` : 'text-gray-400'
                                            }`} 
                                            size={32} 
                                        />
                                        <p className={`font-medium text-sm ${
                                            isSelected ? `text-${tipo.color}-700` : 'text-gray-700'
                                        }`}>
                                            {tipo.label}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {tipo.desc}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Motivo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Motivo Principal * <span className="text-gray-500 text-xs">(mínimo 10 caracteres)</span>
                        </label>
                        <input
                            type="text"
                            name="motivo"
                            value={formData.motivo}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.motivo 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Ej: Incumplimiento de horarios, Excelente desempeño..."
                            maxLength={100}
                        />
                        {errors.motivo && (
                            <p className="text-red-500 text-xs mt-1">{errors.motivo}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.motivo.length}/100 caracteres
                        </p>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción Detallada * <span className="text-gray-500 text-xs">(mínimo 20 caracteres)</span>
                        </label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows={5}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                                errors.descripcion 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Describe la situación con el mayor detalle posible..."
                            maxLength={1000}
                        />
                        {errors.descripcion && (
                            <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.descripcion.length}/1000 caracteres
                        </p>
                    </div>

                    {/* Información del estudiante */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-2">Información del Estudiante</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p><strong>Carrera:</strong> {aplicacion.estudianteData.carrera}</p>
                            <p><strong>Semestre:</strong> {aplicacion.estudianteData.semestre}</p>
                            <p><strong>Email:</strong> {aplicacion.estudianteData.correo}</p>
                            <p><strong>Teléfono:</strong> {aplicacion.estudianteData.telefono}</p>
                        </div>
                    </div>

                    {/* Alerta */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <AlertTriangle className="text-yellow-400 flex-shrink-0" size={20} />
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <strong>Importante:</strong> Esta observación será enviada al administrador de la plataforma 
                                    y quedará registrada en el historial del estudiante. Asegúrate de que la información sea precisa y objetiva.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                            {loading ? 'Enviando...' : 'Enviar Observación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};