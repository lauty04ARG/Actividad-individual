FROM node:20-alpine

WORKDIR /app

# Habilitar e inicializar pnpm usando corepack de Node.js
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar especificación de paquetes
COPY package.json ./

# Instalar dependencias del proyecto
RUN pnpm install

# Copiar el código fuente completo del frontend
COPY . .

EXPOSE 5173

# Iniciar servidor de desarrollo Vite expuesto para el contenedor
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
