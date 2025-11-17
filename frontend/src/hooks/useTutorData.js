import { useState, useEffect } from 'react';

export const useTutorData = (user) => {
    const [estudiantesAsignados, setEstudiantesAsignados] = useState([]);
    const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!user || !user._id) {
            console.log('⚠️ No hay usuario, saliendo...');
            setLoading(false);
            return;
        }
        
        setLoading(true);
        console.log('🔄 Iniciando carga de datos para tutor:', user._id);
        
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // 1. Obtener SOLICITUDES PENDIENTES
            console.log('📨 Cargando solicitudes pendientes...');
            try {
                const resSolicitudes = await fetch(
                    `http://localhost:3000/api/asignaciones/tutor/${user._id}/pendientes`,
                    { headers }
                );
                
                console.log('📡 Status solicitudes:', resSolicitudes.status);
                
                if (resSolicitudes.ok) {
                    const data = await resSolicitudes.json();
                    console.log('📦 Data recibida solicitudes:', data);
                    
                    // ✅ AJUSTE: Tu backend devuelve { success, total, solicitudes }
                    const solicitudes = data.solicitudes || data || [];
                    console.log('✅ Solicitudes procesadas:', solicitudes);
                    setSolicitudesPendientes(solicitudes);
                } else {
                    console.error('❌ Error al cargar solicitudes:', resSolicitudes.status);
                    const errorText = await resSolicitudes.text();
                    console.error('Error details:', errorText);
                    setSolicitudesPendientes([]);
                }
            } catch (error) {
                console.error('❌ Error fetch solicitudes:', error);
                setSolicitudesPendientes([]);
            }

            // 2. Obtener ESTUDIANTES ASIGNADOS (aceptados)
            console.log('👥 Cargando estudiantes asignados...');
            try {
                const resEstudiantes = await fetch(
                    `http://localhost:3000/api/asignaciones/tutor/${user._id}/estudiantes`,
                    { headers }
                );
                
                console.log('📡 Status estudiantes:', resEstudiantes.status);
                
                if (resEstudiantes.ok) {
                    const data = await resEstudiantes.json();
                    console.log('📦 Data recibida estudiantes:', data);
                    
                    // ✅ AJUSTE: Tu backend devuelve { success, total, estudiantes }
                    const estudiantes = data.estudiantes || data || [];
                    console.log('✅ Estudiantes procesados:', estudiantes);
                    setEstudiantesAsignados(estudiantes);
                } else {
                    console.error('❌ Error al cargar estudiantes:', resEstudiantes.status);
                    const errorText = await resEstudiantes.text();
                    console.error('Error details:', errorText);
                    setEstudiantesAsignados([]);
                }
            } catch (error) {
                console.error('❌ Error fetch estudiantes:', error);
                setEstudiantesAsignados([]);
            }

            // 3. Reportes (vacío por ahora)
            setReportes([]);
            console.log('✅ Carga de datos completada');

        } catch (error) {
            console.error('❌ Error general cargando datos del tutor:', error);
        } finally {
            setLoading(false);
        }
    };

    // Función para responder solicitudes
    const responderSolicitud = async (solicitudId, estado, motivoRechazo = null) => {
        const token = localStorage.getItem('token');
        
        console.log('📝 Respondiendo solicitud:', solicitudId, 'Estado:', estado);
        
        try {
            let response;
            
            if (estado === 'aceptada') {
                console.log('✅ Aceptando solicitud...');
                response = await fetch(
                    `http://localhost:3000/api/asignaciones/solicitud/${solicitudId}/aceptar`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            } else if (estado === 'rechazada') {
                console.log('❌ Rechazando solicitud con motivo:', motivoRechazo);
                response = await fetch(
                    `http://localhost:3000/api/asignaciones/solicitud/${solicitudId}/rechazar`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ motivo: motivoRechazo }) // ⚠️ NOTA: Tu backend espera "motivo" no "motivoRechazo"
                    }
                );
            }

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const error = await response.json();
                console.error('❌ Error en respuesta:', error);
                throw new Error(error.message || 'Error al responder solicitud');
            }

            const result = await response.json();
            console.log('✅ Solicitud respondida exitosamente:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Error al responder solicitud:', error);
            throw error;
        }
    };

    useEffect(() => {
        console.log('🎯 useEffect ejecutado - user._id:', user?._id);
        loadData();
    }, [user?._id]);

    return {
        estudiantesAsignados,
        solicitudesPendientes,
        reportes,
        loading,
        reloadData: loadData,
        responderSolicitud
    };
};