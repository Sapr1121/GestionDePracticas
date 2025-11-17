import React from 'react';

export const AplicacionModal = ({
    showModal,
    selectedOferta,
    companyName,
    formAplicacion,
    aplicando,
    error,
    onClose,
    onChange,
    onFileChange,
    onSubmit
}) => {
    if (!showModal || !selectedOferta) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                <h3 className="text-2xl font-bold mb-4">Aplicar a: {selectedOferta.nombreProyecto}</h3>
                <p className="text-gray-600 mb-6">{companyName}</p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Teléfono de contacto *
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formAplicacion.telefono}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="3001234567"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Hoja de Vida (PDF) *
                        </label>
                        <input
                            type="file"
                            name="hojaVida"
                            accept=".pdf"
                            onChange={(e) => onFileChange(e, 'hojaVida')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {formAplicacion.hojaVida && (
                            <p className="text-sm text-green-600 mt-2">
                                ✓ {formAplicacion.hojaVida.name}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Máximo 5MB en formato PDF
                        </p>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Carta de Presentación (PDF - opcional)
                        </label>
                        <input
                            type="file"
                            name="cartaPresentacion"
                            accept=".pdf"
                            onChange={(e) => onFileChange(e, 'cartaPresentacion')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formAplicacion.cartaPresentacion && (
                            <p className="text-sm text-green-600 mt-2">
                                ✓ {formAplicacion.cartaPresentacion.name}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Máximo 5MB en formato PDF
                        </p>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={aplicando}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                            {aplicando ? 'Enviando...' : 'Enviar Aplicación'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={aplicando}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};