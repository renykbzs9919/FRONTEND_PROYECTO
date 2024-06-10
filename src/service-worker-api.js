// service-worker-api.js

// Nombre del caché
const CACHE_NAME = 'api-cache';

// Escucha el evento 'fetch' para interceptar las solicitudes HTTP
self.addEventListener('fetch', event => {
  // Intercepta todas las solicitudes GET y POST
  if (event.request.method === 'GET' || event.request.method === 'POST') {
    // Agrega un registro de mensaje a la consola
    console.log(`Solicitud ${event.request.method} interceptada para la URL: ${event.request.url}`);
    
    // Llama a la función para manejar la solicitud
    event.respondWith(handleRequest(event.request));
  }
});

// Función para manejar todas las solicitudes GET y POST
async function handleRequest(request) {
  try {
    // Abre el caché
    const cache = await caches.open(CACHE_NAME);
    
    // Intenta obtener la respuesta del caché
    let cachedResponse = await cache.match(request);
    
    // Si se encuentra en caché, devuelve la respuesta almacenada
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si no está en caché, realiza la solicitud al servidor
    const networkResponse = await fetch(request);
    
    // Clona la respuesta de la red para poder almacenarla en el caché
    const responseToCache = networkResponse.clone();
    
    // Almacena la respuesta en el caché para futuras solicitudes
    cache.put(request, responseToCache);
    
    // Agrega un registro de mensaje a la consola
    console.log(`Solicitud ${request.method} almacenada en el caché para la URL: ${request.url}`);
    
    // Clona la respuesta de la red para devolverla
    return networkResponse.clone();
  } catch (error) {
    console.error('Error handling request:', error);
    // Si ocurre un error, devuelve una respuesta por defecto
    return new Response(null, { status: 500, statusText: 'Internal Server Error' });
  }
}
