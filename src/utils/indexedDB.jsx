// src/utils/indexedDB.js
const dbName = 'MiBaseDeDatos';
const dbVersion = 1;
const storeName = 'DatosStore';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);
    request.onupgradeneeded = (event) => {
      console.log('IndexedDB: Actualización de la base de datos.');
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = (event) => {
      console.log('IndexedDB: Base de datos abierta con éxito.');
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      console.error('IndexedDB: Error al abrir la base de datos:', event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
}

function addData(data) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      request.onsuccess = () => {
        console.log('IndexedDB: Datos añadidos con éxito.');
        resolve(request.result);
      };
      request.onerror = (event) => {
        console.error('IndexedDB: Error al añadir datos:', event.target.errorCode);
        reject(event.target.errorCode);
      };
    });
  });
}

export { addData };
