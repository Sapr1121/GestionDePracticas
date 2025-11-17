import React, { useState } from 'react';
import { CARRERAS_DISPONIBLES } from '../../constants/carreras';
import { ofertaService } from '../../services/empresa.service';

export const OfertaForm = ({ empresaId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        carrera: [],
        nombreProyecto: '',
        areasProyecto: [],
        observaciones: '',
        esConducenteGrado: false,
        maxEstudiantesEntrevistar: '',
        maxEstudiantesAceptar: '',
        fechaInicio: '',
        fechaFin: '',
        pago: ''
    });
    const [currentArea, setCurrentArea] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCarreraToggle = (carrera) => {
        setFormData(prev => ({
            ...prev,
            carrera: prev.carrera.includes(carrera)
                ? prev.carrera.filter(c => c !== carrera)
                : [...prev.carrera, carrera]
        }));
    };

    const handleAddArea = () => {
        if (currentArea.trim() && !formData.areasProyecto.includes(currentArea.trim())) {
            setFormData(prev => ({
                ...prev,
                areasProyecto: [...prev.areasProyecto, currentArea.trim()]
            }));
            setCurrentArea('');
        }
    };

    const handleRemoveArea = (area) => {
        setFormData(prev => ({
            ...prev,
            areasProyecto: prev.areasProyecto.filter(a => a !== area)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await ofertaService.create({
                ...formData,
                empresaId
            });

            if (response.success) {
                setSuccess('Oferta creada exitosamente');
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear oferta');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {success}
                </div>
            )}

            <div>
                <label className="block text-gray-700 font-medium mb-2">Carreras</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                        {CARRERAS_DISPONIBLES.map((carrera) => (
                            <div
                                key={carrera}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                                    formData.carrera.includes(carrera)
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.carrera.includes(carrera)}
                                        onChange={() => handleCarreraToggle(carrera)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">{carrera}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                {formData.carrera.length > 0 && (
                    <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Seleccionadas:</p>
                        <div className="flex flex-wrap gap-2">
                            {formData.carrera.map((carrera) => (
                                <span
                                    key={carrera}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                >
                                    {carrera}
                                    <button
                                        type="button"
                                        onClick={() => handleCarreraToggle(carrera)}
                                        className="text-red-600 hover:text-red-800 font-bold"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    Nombre del Proyecto
                </label>
                <input
                    type="text"
                    name="nombreProyecto"
                    value={formData.nombreProyecto}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    Áreas del Proyecto
                </label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={currentArea}
                        onChange={(e) => setCurrentArea(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArea())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Escribe un área y presiona Enter"
                    />
                    <button
                        type="button"
                        onClick={handleAddArea}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Agregar
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.areasProyecto.map((area, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {area}
                            <button
                                type="button"
                                onClick={() => handleRemoveArea(area)}
                                className="text-red-600 hover:text-red-800 font-bold"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Observaciones</label>
                <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Información adicional sobre la práctica..."
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    name="esConducenteGrado"
                    checked={formData.esConducenteGrado}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-gray-700 font-medium">
                    ¿Es conducente a grado?
                </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Máximo de estudiantes a entrevistar
                    </label>
                    <input
                        type="number"
                        name="maxEstudiantesEntrevistar"
                        value={formData.maxEstudiantesEntrevistar}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Máximo de estudiantes a aceptar
                    </label>
                    <input
                        type="number"
                        name="maxEstudiantesAceptar"
                        value={formData.maxEstudiantesAceptar}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Fecha de inicio</label>
                    <input
                        type="date"
                        name="fechaInicio"
                        value={formData.fechaInicio}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Fecha de fin</label>
                    <input
                        type="date"
                        name="fechaFin"
                        value={formData.fechaFin}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Pago mensual</label>
                <input
                    type="number"
                    name="pago"
                    value={formData.pago}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1000000"
                    min="0"
                    required
                />
            </div>

            <div className="flex space-x-4">
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    Crear Oferta
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};
