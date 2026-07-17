CREATE DATABASE IF NOT EXISTS recetas_db;
USE recetas_db;

-- Tabla de Usuarios con roles (Admin y Cliente)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  clave VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(100) NOT NULL,
  rol ENUM('admin', 'cliente') DEFAULT 'cliente'
);

-- Tabla de Recetas (Incluye imagen y enlace a video)
CREATE TABLE IF NOT EXISTS recetas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(50) NOT NULL,
  porciones INT DEFAULT 1,
  disponible TINYINT(1) DEFAULT 1,
  imagen_url VARCHAR(255) DEFAULT NULL,
  video_url VARCHAR(255) DEFAULT NULL,
  creado_el TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para persistir las sesiones de Express
CREATE TABLE IF NOT EXISTS sesiones (
  session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL PRIMARY KEY,
  expires INT(11) UNSIGNED NOT NULL,
  data MEDIUMTEXT COLLATE utf8mb4_bin
);

-- Usuarios iniciales de prueba
INSERT INTO usuarios (usuario, clave, nombre_completo, rol) VALUES
('admin', 'admin123', 'Alessia Pérez', 'admin'),
('cliente', 'cliente123', 'Nayely Ayol', 'cliente')
ON DUPLICATE KEY UPDATE id=id;

-- Recetas iniciales con URLs de imágenes y videos
INSERT INTO recetas (codigo, nombre, descripcion, categoria, porciones, disponible, imagen_url, video_url) VALUES
(
  'REC-001', 
  'Encebollado de Pescado', 
  'Tradicional sopa ecuatoriana preparada con albacora, yuca y cebolla curtida.', 
  'Plato Fuerte', 
  4, 
  1, 
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', 
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
),
(
  'REC-002', 
  'Locro de Papa', 
  'Sopa cremosa tradicional a base de papa, servida con queso fresco y aguacate.', 
  'Entrada', 
  6, 
  1, 
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80', 
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
),
(
  'REC-003', 
  'Empanadas de Viento', 
  'Empanadas fritas crujientes rellenas de queso derretido y espolvoreadas con azúcar.', 
  'Postre', 
  12, 
  1, 
  'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', 
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
)
ON DUPLICATE KEY UPDATE id=id;