export const getEstadoColor = (estado) => {
    const colores = {
        'pendiente': 'bg-yellow-100 text-yellow-800',
        'en_revision': 'bg-blue-100 text-blue-800',
        'preseleccionado': 'bg-purple-100 text-purple-800',
        'entrevista': 'bg-indigo-100 text-indigo-800',
        'aceptado': 'bg-green-100 text-green-800',
        'rechazado': 'bg-red-100 text-red-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
};

export const getEstadoTexto = (estado) => {
    const textos = {
        'pendiente': 'Pendiente',
        'en_revision': 'En Revisión',
        'preseleccionado': 'Preseleccionado',
        'entrevista': 'Entrevista',
        'aceptado': 'Aceptado',
        'rechazado': 'Rechazado'
    };
    return textos[estado] || estado;
};