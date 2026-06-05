/**
 * Базовый URL API. В Docker задаётся при сборке; локально — из .env или запасной вариант.
 */
export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env.REACT_APP_API_BASE_URL) ||
  'http://109.172.37.85:8080';

/**
 * Путь Socket.IO на сервере: fastapi-socketio монтирует ASGI-приложение в /ws,
 * внутри него engine.io слушает путь socket.io → полный URL …/ws/socket.io/
 */
export const SOCKET_PATH = '/ws/socket.io';
