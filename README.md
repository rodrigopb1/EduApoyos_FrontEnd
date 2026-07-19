# EduApoyos FrontEnd

Aplicación web de EduApoyos desarrollada con Angular 19.

## Requisitos

Para ejecutar el proyecto se necesita:

- Node.js 22 LTS
- npm 10 o superior
- Git
- Angular CLI 19

## Instalación de herramientas

Verificar si Node.js, npm y Git ya están instalados:

```cmd
node --version
npm --version
git --version
```

Si no están instalados, instalar Node.js 22 LTS y Git para Windows.

Instalar Angular CLI 19:

```cmd
npm install -g @angular/cli@19
```

Verificar la instalación:

```cmd
ng version
```

## Descargar el proyecto

Crear una carpeta de trabajo:

```cmd
mkdir C:\EduApoyos
cd /d C:\EduApoyos
```

Clonar el repositorio:

```cmd
git clone https://github.com/rodrigopb1/EduApoyos_FrontEnd.git
```

Ingresar al proyecto:

```cmd
cd /d C:\EduApoyos\EduApoyos_FrontEnd
```

## Instalar dependencias

Instalar las dependencias:

```cmd
npm install
```

## Configuración del API

La URL del backend se configura en `proxy.conf.json`.

Ejemplo:

```json
{
  "/api": {
    "target": "https://localhost:7080",
    "secure": false,
    "changeOrigin": true
  }
}
```

El valor de `target` debe coincidir con la dirección en la que se está ejecutando el API.

Después de modificar `proxy.conf.json`, reiniciar el frontend.

## Ejecutar el proyecto

```cmd
cd /d C:\EduApoyos\EduApoyos_FrontEnd
npm start
```

La aplicación estará disponible en:

```text
http://localhost:4200
```

Para detener la ejecución:

```text
Ctrl + C
```

## Compilar

```cmd
npm run build
```
