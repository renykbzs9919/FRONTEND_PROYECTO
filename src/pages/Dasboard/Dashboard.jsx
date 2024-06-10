import { useState, useEffect } from 'react';
import { Card, Row, Col } from 'antd';
import { Line } from 'react-chartjs-2';
import api from '../../services/api';
import 'chart.js/auto';

const Dashboard = () => {
    const [salesTotal, setSalesTotal] = useState(0);
    const [usersTotal, setUsersTotal] = useState(0);
    const [clientsTotal, setClientsTotal] = useState(0);
    const [productsTotal, setProductsTotal] = useState(0);
    const [granularity] = useState('month');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const usersResponse = await api.get('/users');
            const clientsResponse = await api.get('/clients');
            const salesResponse = await api.get('/sales');
            const productsResponse = await api.get('/products');


            if (usersResponse.data && Array.isArray(usersResponse.data)) {
                setUsersTotal(usersResponse.data.length);
            } else {
                console.error('Users data is not an array:', usersResponse.data);
            }

            if (clientsResponse.data && Array.isArray(clientsResponse.data)) {
                setClientsTotal(clientsResponse.data.length);
            } else {
                console.error('Clients data is not an array:', clientsResponse.data);
            }

            if (salesResponse.data && Array.isArray(salesResponse.data)) {
                const sales = salesResponse.data;
                setSalesTotal(sales.length);
            } else if (salesResponse.data && salesResponse.data.data && Array.isArray(salesResponse.data.data)) {
                const sales = salesResponse.data.data;
                setSalesTotal(sales.length);
            } else {
                console.error('Sales data is not an array:', salesResponse.data);
            }

            if (productsResponse.data.productos && Array.isArray(productsResponse.data.productos)) {
                setProductsTotal(productsResponse.data.productos.length);
                
            } else {
                console.error('Products data is not an array:', productsResponse.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const preprocessDataForChart = () => {
        const labels = granularity === 'month' ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] : ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Ventas',
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)', // Rojo
                    borderColor: 'rgba(255, 99, 132, 1)',
                    data: generateChartData(labels.length),
                },
                {
                    label: 'Clientes',
                    fill: false,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)', // Azul
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderDash: [5, 5],
                    data: generateChartData(labels.length),
                },
                {
                    label: 'Productos',
                    backgroundColor: 'rgba(255, 205, 86, 0.7)', // Amarillo
                    borderColor: 'rgba(255, 205, 86, 1)',
                    data: generateChartData(labels.length),
                    fill: false,
                },
            ],
        };
    
        return data;
    };

    // Función de utilidad para generar datos aleatorios para el gráfico
    const generateChartData = (length) => {
        return Array.from({ length }, () => Math.floor(Math.random() * 150));
    };

    return (
        <div className="container">
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card title="Total de Ventas" bordered={false}>
                        <p>{salesTotal}</p>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card title="Total de Usuarios" bordered={false}>
                        <p>{usersTotal}</p>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card title="Total de Clientes" bordered={false}>
                        <p>{clientsTotal}</p>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card title="Total de Productos" bordered={false}>
                        <p>{productsTotal}</p>
                    </Card>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col span={24}>
                    <Line
                        data={preprocessDataForChart()}
                        options={{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Evolución de Datos'
                                },
                            },
                            interaction: {
                                mode: 'index',
                                intersect: true
                            },
                            scales: {
                                x: {
                                    display: true,
                                    title: {
                                        display: true,
                                        text: granularity === 'month' ? 'Mes' : 'Día'
                                    }
                                },
                                y: {
                                    display: true,
                                    title: {
                                        display: true,
                                        text: 'Cantidad'
                                    }
                                }
                            }
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
