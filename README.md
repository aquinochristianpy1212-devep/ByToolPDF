
# PDF Tools - 4 funciones

Funciones:

- Separar PDF: frontend, funciona directo.
- Unir PDF: frontend, funciona directo.
- PDF a Word: backend Node + Python pdf2docx.
- Word a PDF: backend Node + LibreOffice.

## Abrir frontend

Abrí:

frontend/index.html

## Encender backend

```bash
cd backend
npm install
npm start
```

## Requisitos para PDF a Word

Instalar Python y luego:

```bash
pip install pdf2docx
```

## Requisitos para Word a PDF

Instalar LibreOffice.

En Windows, asegurate de que `soffice.exe` esté en el PATH.

Normalmente está en:

```txt
C:\Program Files\LibreOffice\program
```

## Importante

En producción, cambiá en:

frontend/js/app.js

```js
const API = "http://localhost:3000";
```

por la URL real de tu backend, ejemplo:

```js
const API = "https://api-tuweb.com";
```
