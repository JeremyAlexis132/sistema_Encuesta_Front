# Sistema de Encuestas con Firmas Digitales

## Descripción General del Proyecto

Este sistema es una plataforma completa para la gestión de encuestas electrónicas con autenticación segura, manejo de roles y validación criptográfica mediante llaves RSA.

Incluye:
- Panel de administración
- Panel de usuario
- Generación y verificación de firmas digitales
- Asignación de encuestas
- Visualización y análisis de respuestas
- Seguridad mediante JWT, bcrypt y RSA
- Arquitectura completa (Frontend + Backend + Base de Datos)

---

## 1. Requisitos Previos

### 1.1 Software Necesario

Antes de iniciar, asegúrate de tener instalado:

✔ **Node.js** (v16+ recomendado)  
https://nodejs.org/

✔ **MySQL Server**  
Puedes usar:
- XAMPP
- WAMP
- MAMP
- MySQL Workbench
- MariaDB

✔ **Git**  
https://git-scm.com/

---

## 2. Clonar los Repositorios

**Backend:**
```bash
git clone https://github.com/JeremyAlexis132/sistema_Encuestas_Back.git
```

**Frontend:**
```bash
git clone https://github.com/JeremyAlexis132/sistema_Encuesta_Front.git
```

---

## 3. Configuración de Base de Datos (MySQL)

### 3.1 Crear la base de datos

En MySQL ejecuta:

```sql
CREATE DATABASE sistema_encuestas;
```

### 3.2 Importar el archivo SQL

Dentro del repositorio encontrarás un archivo como:
- `database/sistema_encuestas.sql`
- `criptografia.sql`

Importa ambos en la base de datos, por ejemplo desde phpMyAdmin o desde consola:

```bash
mysql -u root -p sistema_encuestas < sistema_encuestas.sql
mysql -u root -p sistema_encuestas < criptografia.sql
```

---

## 4. Crear el Primer Administrador (Manual en MySQL)

Este paso solo se realiza una vez.

El sistema no cuenta con un administrador inicial por seguridad; debes crearlo manualmente para arrancar el sistema.

### 4.1 Generar una contraseña hasheada

En el backend puedes usar este script temporal:

```javascript
const bcrypt = require("bcrypt");
console.log(bcrypt.hashSync("TuContraseñaSegura", 10));
```

Ejecuta:
```bash
node script.js
```

### 4.2 Generar un par de llaves RSA

Puedes usar:

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

Copia ambas llaves en tu base de datos.

### 4.3 Insertar al administrador en MySQL

Ejemplo:

```sql
INSERT INTO usuarios (correo, numeroCuenta, password, rol, llavePublica, llavePrivada)
VALUES (
  'admin@admin.com', 
  '000000000',
  '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'Administrador',
  '-----BEGIN PUBLIC KEY----- ...',
  '-----BEGIN PRIVATE KEY----- ...'
);
```

Después de esto podrás iniciar sesión como administrador.

---

## 5. Configuración del Backend

### 5.1 Entrar al backend

```bash
cd sistema_Encuestas_Back
```

### 5.2 Instalar dependencias

```bash
npm install
```

### 5.3 Configurar el archivo config.js

Edita:  
`/database/config.js`

Y coloca tus credenciales MySQL:

```javascript
module.exports = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sistema_encuestas'
};
```

### 5.4 Iniciar el backend

```bash
npm start
```

El servidor iniciará en:  
http://localhost:3000

---

## 6. Configuración del Frontend

### 6.1 Entrar al frontend

```bash
cd sistema_Encuesta_Front
```

### 6.2 Instalar dependencias

```bash
npm install
```

### 6.3 Configurar rutas de API

En:  
`src/constants/paths.js`

Asegúrate de que apunte al backend:

```javascript
export const API_URL = "http://localhost:3000";
```

### 6.4 Ejecutar el frontend

```bash
npm run dev
```

El sistema se abrirá en:  
http://localhost:5173

---

## 7. Probar el Sistema

### Ingresar como Administrador

1. Ir a:  
   http://localhost:5173/admin/login

2. Usar el correo y contraseña del administrador creado en la BD.

3. Desde el panel podrás:
   - Crear usuarios
   - Crear encuestas
   - Asignar encuestas
   - Ver respuestas
   - Generar más administradores

### 👤 Ingresar como Usuario

1. Ir a:  
   http://localhost:5173/login

2. Responder encuestas asignadas

3. Enviar respuestas firmadas digitalmente

---

## 8. Preparado para Producción

El sistema está listo para desplegarse en:
- Apache / Nginx
- VPS o hosting
- Servidores Linux o Windows
- Docker (opcional)

El backend soporta HTTPS con certificados SSL, aunque no se activó en el frontend
