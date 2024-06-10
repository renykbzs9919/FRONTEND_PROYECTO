import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../services/api';

const MySwal = withReactContent(Swal);

function Predictions() {
    const [numDiasHistorial, setNumDiasHistorial] = useState('');
    const [numDiasPrediccion, setNumDiasPrediccion] = useState('');
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        Chart.defaults.font.family = 'Arial';
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/predictions/dias', {
                numDiasHistorial,
                numDiasPrediccion
            });
            setResultados(response.data);
            setLoading(false);
            createCharts(response.data);
        } catch (error) {
            console.error('Error al obtener datos y realizar predicciones:', error);
            setLoading(false);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message || 'Hubo un problema al realizar la predicción. Por favor, inténtalo de nuevo más tarde.',
            });
        }
    };

    const createCharts = (data) => {
        data.forEach((item, index) => {
            const canvasId = `chart_${index}`;
            const canvas = document.getElementById(canvasId);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: item.ventasUltimosDias.map(venta => venta.fecha),
                        datasets: [{
                            label: 'Ventas Últimos Días',
                            data: item.ventasUltimosDias.map(venta => venta.cantidad),
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            tension: 0.4,
                            fill: true
                        }, {
                            label: 'Predicciones',
                            data: item.prediccionVentas.map(prediccion => prediccion.prediccionVentas),
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        animation: {
                            duration: 2000,
                            easing: 'easeInOutCubic'
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Predicciones de Ventas</h2>
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-4">
                    <label htmlFor="numDiasHistorial" className="block text-sm font-medium text-gray-700">Días de Historial:</label>
                    <input
                        type="number"
                        id="numDiasHistorial"
                        value={numDiasHistorial}
                        onChange={(e) => setNumDiasHistorial(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="numDiasPrediccion" className="block text-sm font-medium text-gray-700">Días de Predicción:</label>
                    <input
                        type="number"
                        id="numDiasPrediccion"
                        value={numDiasPrediccion}
                        onChange={(e) => setNumDiasPrediccion(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-md focus:outline-none focus:bg-indigo-700">Realizar Predicción</button>
            </form>

            <div>
                {loading && <p>Cargando...</p>}
                {!loading && resultados.length === 0 && <p>Aún no se han realizado predicciones</p>}
                {resultados.map((resultado, index) => (
                    <div key={index} className="mb-4 border border-gray-300 rounded p-4">
                        <h3 className="text-lg font-semibold mb-2">{resultado.producto}</h3>
                        <canvas id={`chart_${index}`} width="400" height="200"></canvas>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Predictions;
