# API RESTful de Tickets

API desarrollada con Express y CommonJS para gestionar tickets y sus notificaciones.

## Requisitos

- Node.js instalado.
- Dependencias instaladas con `npm install`.
- Archivo `.env` configurado si se desea probar el envío de correos.

No es necesario modificar `.env` para probar los endpoints de consulta.

## Iniciar el servidor

Desde la carpeta del proyecto:

```bash
npm run dev
```

La consola debe mostrar un resultado similar a:

```text
[nodemon] starting `node app.js`
Servidor ejecutándose en http://localhost:3000
```

Mantén esta terminal abierta y ejecuta las pruebas desde una segunda terminal.

El servidor escucha en `127.0.0.1:3000`, por lo que puedes usar indistintamente `http://localhost:3000` o `http://127.0.0.1:3000`.

### Si el puerto 3000 está ocupado

Si aparece `EADDRINUSE`, cierra el proceso anterior que está usando el puerto y vuelve a iniciar:

```bash
lsof -i :3000
kill <PID>
npm run dev
```

También puedes cerrar la terminal anterior donde quedó ejecutándose `nodemon`.

## Pruebas con curl

Todas las respuestas se pueden mostrar con su código HTTP usando `-i`.

### 1. Crear un ticket

```bash
curl -i -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Error en el inicio de sesión",
    "description": "El usuario no puede ingresar al sistema",
    "priority": "high"
  }'
```

La respuesta debe ser `201 Created`. Copia el valor de `id` de la respuesta y úsalo como `<ID_DEL_TICKET>` en las siguientes pruebas.

### 2. Listar tickets con paginación

```bash
curl -i "http://localhost:3000/tickets?page=1&limit=5"
```

Debe responder `200 OK` y mostrar `page`, `limit`, `totalTickets`, `totalPages` y `tickets`.

### 3. Asignar el ticket

```bash
curl -i -X PUT "http://localhost:3000/tickets/<ID_DEL_TICKET>/assign" \
  -H "Content-Type: application/json" \
  -d '{"user":"Ana Pérez"}'
```

Debe responder `200 OK` y mostrar `assignedUser`.

### 4. Cambiar el estado

```bash
curl -i -X PUT "http://localhost:3000/tickets/<ID_DEL_TICKET>/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"en progreso"}'
```

Debe responder `200 OK` y mostrar el nuevo `status`.

### 5. Listar todas las notificaciones

```bash
curl -i http://localhost:3000/notifications
```

Debe responder `200 OK`. Después de crear, asignar y cambiar el estado, debe incluir las notificaciones generadas para esas acciones.

### 6. Consultar el historial de un ticket

```bash
curl -i "http://localhost:3000/tickets/<ID_DEL_TICKET>/notifications"
```

Debe responder `200 OK` con un arreglo de notificaciones cuyo `ticketId` coincida con el ticket consultado.

### 7. Eliminar el ticket

```bash
curl -i -X DELETE "http://localhost:3000/tickets/<ID_DEL_TICKET>"
```

Debe responder `200 OK` con el mensaje `Ticket eliminado correctamente`.

## Evidencia recomendada para capturas

Toma las capturas con la terminal mostrando el comando completo y su respuesta:

1. `npm run dev` mostrando que el servidor inicia sin crash.
2. `POST /tickets` mostrando `201 Created` y el `id` generado.
3. `GET /tickets?page=1&limit=5` mostrando `200 OK` y la paginación.
4. `PUT /tickets/:id/assign` mostrando el usuario asignado.
5. `PUT /tickets/:id/status` mostrando el estado actualizado.
6. `GET /notifications` mostrando las notificaciones creadas.
7. `GET /tickets/:id/notifications` mostrando el historial filtrado por ticket.
8. `DELETE /tickets/:id` mostrando la eliminación correcta.

Para que cada captura sea clara, deja visible el prompt, el comando `curl`, el código HTTP y el JSON de respuesta. Puedes usar una captura por endpoint o agrupar dos endpoints relacionados en una misma captura si todo el contenido resulta legible.

Guarda las imágenes, por ejemplo, en `docs/evidencias/` y enlázalas así:

```markdown
### Inicio del servidor

![Servidor iniciado](docs/evidencias/01-servidor-iniciado.png)

### Historial de notificaciones

![Historial de notificaciones](docs/evidencias/07-historial-notificaciones.png)
```

Usa nombres numerados (`01-...`, `02-...`, etc.) para que las evidencias sigan el mismo orden que las pruebas.

## Verificación de la solución implementada

La ruta de historial sigue este flujo:

```text
GET /tickets/:id/notifications
        -> TicketController.notifications
        -> TicketService.getNotifications(id)
        -> NotificationService.listByTicket(ticketId)
```

Además, `app.js` registra `errorHandler` después de las rutas para procesar los errores de la API.

## Restaurar la base de datos de prueba

Si las pruebas generaron datos y se necesita dejar el proyecto limpio, conserva `database/db.json` con este contenido:

```json
{
  "tickets": [],
  "notifications": []
}
```

Las pruebas no requieren realizar commits ni modificar credenciales.
