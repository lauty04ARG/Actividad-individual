# PRD — Product Requirements Document — ComunidadCursos

> **Qué es este documento:** define el QUÉ y el POR QUÉ de **ComunidadCursos**. Establece a quién va dirigido, qué necesidades formativas cubre, qué funcionalidades forman parte del producto y cuáles quedan explícitamente fuera.
> **Cuándo está bien:** cualquier miembro del equipo puede implementar las pantallas, endpoints y reglas de negocio sin ambigüedades; el alcance (in/out) es tajante; y cada Historia de Usuario posee criterios de aceptación verificables e independientes.

---

## 1. Resumen ejecutivo

**ComunidadCursos** es una plataforma web colaborativa donde estudiantes universitarios y autodidactas construyen un catálogo curado de cursos gratuitos de acceso libre y gestionan itinerarios personales de estudio (roadmaps). Quienes aportan cursos proporcionan metadatos detallados y declaran si realizaron la cursada; tras una validación administrativa rápida, los cursos se publican en un catálogo comunitario paginado desde el cual cualquier estudiante puede incorporarlos a su ruta de aprendizaje con seguimiento de progreso.

---

## 2. Objetivos y métricas de éxito

| Objetivo | Cómo sabemos que lo logramos |
|----------|------------------------------|
| Construir un catálogo confiable de cursos gratuitos | El 100% de los cursos visibles en el catálogo están validados, cuentan con enlaces activos y poseen metadatos completos (año, versión, docentes, certificación). |
| Fomentar la planificación estructurada del estudio | Los usuarios autenticados pueden organizar y secuenciar al menos un roadmap personal con estados de avance (`por_empezar`, `en_progreso`, `completado`). |
| Garantizar transparencia en las recomendaciones | Cada curso aportado exhibe públicamente si quien lo recomendó realizó o no la cursada. |
| Rendimiento y accesibilidad mobile | Carga inicial del catálogo en menos de 2 segundos en redes móviles 4G y navegación 100% funcional en pantallas desde 360px de ancho. |

---

## 3. Personas

### Persona 1 — Lucas Gómez (Estudiante Universitario / Autodidacta)
- **Contexto:** Estudiante de 2º año de Sistemas. Necesita complementar la teoría de la facultad con cursos prácticos sobre tecnologías específicas (ej. Docker, FastAPI, React), pero dispone de poco presupuesto.
- **Motivaciones:** Encontrar cursos que no estén desactualizados, saber si tienen exámenes prácticos para autoevaluarse y organizar un orden lógico de estudio sin perderse en favoritos del navegador.
- **Frustraciones actuales:** Los buscadores tradicionales devuelven resultados patrocinados o cursos pagos; en YouTube los videos suelen quedar obsoletos y no sabe cuál tomar primero.
- **Historias tipo:**
  > *"Quiero saber si un curso gratuito de verdad vale la pena antes de meterle 20 horas."*  
  > *"Necesito armarme una lista de pasos: primero este curso de base de datos, después el de backend y al final el de Docker."*

### Persona 2 — Mariana Torres (Ayudante de Cátedra / Moderadora)
- **Contexto:** Graduada reciente y ayudante de cátedra. Recomienda constantemente recursos a sus alumnos y le interesa que la comunidad acceda a material riguroso.
- **Motivaciones:** Disponer de un canal donde centralizar recomendaciones verificadas para sus estudiantes y moderar aportes para evitar links caídos o cursos spam.
- **Frustraciones actuales:** Los alumnos le piden recomendaciones por chat o correo y las respuestas se pierden; los repositorios en GitHub tipo "awesome-list" son estáticos y nadie sabe si los links siguen activos.
- **Historias tipo:**
  > *"Quiero un lugar donde revisar aportes en 2 minutos: verificar que el link ande, que sea gratis y aprobarlo para todos."*  
  > *"Me interesa que los chicos declaren si hicieron el curso, para tener una referencia genuina."*

---

## 4. User Stories

> Clasificación de prioridad:
> - **P0 (Crítico / MVP):** Imprescindible para el funcionamiento del producto. Sin esto no hay entrega de Instancia B.
> - **P1 (Importante):** Complementa la experiencia esencial y completa ciclos de soporte.

| ID | Prioridad | Historia | Criterios de aceptación |
|----|-----------|----------|-------------------------|
| **US-001** | **P0** | **Como** visitante o estudiante,<br>**quiero** explorar el catálogo comunitario paginado con filtros por categoría y búsqueda textual,<br>**para** descubrir recursos educativos gratuitos sin fricción. | - [ ] Dado que accedo a `/catalogo`, veo una lista paginada de cursos publicados (10 por página).<br>- [ ] Dado que hay más de 10 cursos, se visualiza el control de paginación (`Página X de Y`, botones Anterior/Siguiente).<br>- [ ] Dado que selecciono una categoría o escribo en el buscador, el listado se filtra respetando la paginación.<br>- [ ] Dado que una búsqueda no arroja coincidencias, se muestra un estado vacío (*empty state*) claro con sugerencia de reinicio de filtros. |
| **US-002** | **P0** | **Como** usuario nuevo o existente,<br>**quiero** registrarme e iniciar sesión de forma segura,<br>**para** acceder a las funcionalidades de aporte y gestión de roadmap. | - [ ] Dado un formulario de registro, puedo crear cuenta con nombre, email válido y contraseña (mínimo 8 caracteres).<br>- [ ] Dado que ingreso credenciales correctas en `/login`, obtengo acceso y token de autenticación.<br>- [ ] Dado que intento iniciar sesión con credenciales erróneas reiteradas veces (más de 5 intentos en 1 minuto), el sistema bloquea temporalmente las solicitudes respondiendo `429 Too Many Requests`.<br>- [ ] Las contraseñas se almacenan hasheadas con bcrypt en la base de datos. |
| **US-003** | **P0** | **Como** estudiante autenticado,<br>**quiero** aportar un curso gratuito completando sus metadatos y declarando si lo cursé,<br>**para** enriquecer el catálogo de la comunidad. | - [ ] Dado que estoy autenticado y voy a `/aportar`, puedo cargar: URL activa, título, categoría (selector cerrado), tema, versión, año de edición, docentes, y los 4 flags (cuestionarios, examen, certificado, aval organizacional).<br>- [ ] Es obligatorio marcar si tomé o no el curso (`declare_que_lo_tomo`: Sí/No).<br>- [ ] Dado que envío el formulario válido, el curso se guarda en estado `en_revision` y se muestra un mensaje de confirmación.<br>- [ ] Dado que ingreso una URL que ya existe en el sistema, se rechaza la carga informando la duplicación. |
| **US-004** | **P0** | **Como** administrador / moderador,<br>**quiero** visualizar los cursos pendientes de revisión y aprobarlos o rechazarlos,<br>**para** asegurar que solo contenido legítimo y vigente llegue al catálogo comunitario. | - [ ] Dado que inicio sesión con rol `admin` y accedo a `/validar`, veo la lista de cursos en estado `en_revision`.<br>- [ ] Puedo revisar el enlace y los metadatos de cada aporte.<br>- [ ] Al hacer clic en "Aprobar", el estado pasa a `publicado` y el curso se vuelve visible de inmediato en el catálogo comunitario.<br>- [ ] Al hacer clic en "Rechazar", el estado pasa a `rechazado` y no aparece en el catálogo. |
| **US-005** | **P0** | **Como** estudiante autenticado,<br>**quiero** agregar cursos publicados a mi roadmap y gestionar su orden y estado de avance,<br>**para** planificar mi itinerario de aprendizaje de manera ordenada. | - [ ] En la card o detalle de un curso publicado, puedo hacer clic en "Agregar a mi roadmap".<br>- [ ] Dado que el curso ya está en mi roadmap, el botón se deshabilita indicando que ya forma parte de mi ruta.<br>- [ ] En `/roadmap`, veo mis cursos ordenados secuencialmente.<br>- [ ] Puedo cambiar el estado de cada curso en mi roadmap entre `por_empezar`, `en_progreso` y `completado`.<br>- [ ] Puedo quitar un curso de mi roadmap personal mediante confirmación. |
| **US-006** | **P1** | **Como** usuario registrado que olvidó su clave,<br>**quiero** solicitar la recuperación de contraseña vía token y definir una nueva clave,<br>**para** restablecer el acceso a mi cuenta. | - [ ] En `/recuperar-password`, ingreso mi email y el sistema genera un token seguro de recuperación.<br>- [ ] En entorno de desarrollo, el token se emite/registra de forma trazable para simular el enlace de reseteo.<br>- [ ] Al ingresar a `/reset-password?token=...`, puedo ingresar y confirmar una nueva contraseña.<br>- [ ] La nueva contraseña se guarda con hash bcrypt y permite iniciar sesión de inmediato. |
| **US-007** | **P1** | **Como** visitante o estudiante,<br>**quiero** ver la ficha detallada de un curso particular,<br>**para** analizar en profundidad sus metadatos antes de decidir sumarlo a mi roadmap o cursarlo. | - [ ] Al cliquear una tarjeta del catálogo, navego a `/catalogo/:id`.<br>- [ ] Veo el detalle completo: enlace externo activo para abrirlo en nueva pestaña, si el autor lo cursó, si entrega certificado, si posee examen o cuestionarios, institución que lo avala y año/versión. |

---

## 5. Requisitos funcionales

| ID | Requisito funcional | Historias relacionadas |
|----|---------------------|------------------------|
| **RF-001** | Registro de nuevos usuarios con validación de email y contraseña segura. | US-002 |
| **RF-002** | Inicio de sesión con generación de token de sesión (JWT) y rate limiting en el endpoint. | US-002 |
| **RF-003** | Cierre de sesión e invalidación de credenciales del cliente. | US-002 |
| **RF-004** | Solicitud y ejecución de reseteo de contraseña mediante token temporal con expiración. | US-006 |
| **RF-005** | Listado de cursos públicos con paginación (`page`, `page_size`), filtro por categoría y búsqueda textual `q`. | US-001 |
| **RF-006** | Consulta de detalle individual de curso por identificador único. | US-007 |
| **RF-007** | Alta de aportes de cursos con validación estricta de metadatos, verificación de URL única y declaración de cursada. | US-003 |
| **RF-008** | Moderación de cursos en revisión por parte de usuarios con rol `admin` (aprobar / rechazar). | US-004 |
| **RF-009** | Gestión de roadmap personal: incorporar curso publicado, consultar listado paginado propio, reordenar y alternar estados de avance (`por_empezar`, `en_progreso`, `completado`). | US-005 |
| **RF-010** | Eliminación de un curso del roadmap personal. | US-005 |
| **RF-011** | Listado maestro de categorías temáticas para poblar selectores y filtros. | US-001, US-003 |

---

## 6. Requisitos no funcionales

| ID | Requisito no funcional | Origen / Criterio |
|----|------------------------|-------------------|
| **RNF-001** | **Paginación obligatoria:** Todas las consultas de listados (catálogo, aportes pendientes, roadmap) deben implementarse paginadas tanto en API como en UI. | SPEC de clase |
| **RNF-002** | **Mobile-First con mejora progresiva:** Estilos base desarrollados para 360px sin media queries; breakpoints con `@media (min-width: ...)` exclusivamente para ampliar a tablet y desktop. | SPEC de clase |
| **RNF-003** | **Menú sándwich accesible:** Navegación mobile colapsable con soporte de teclado (`ESC`), atributos ARIA (`aria-expanded`, `aria-controls`) y contraste visual adecuado. | SPEC de clase |
| **RNF-004** | **Screaming Architecture:** Código fuente organizado por dominios de negocio y no por artefactos técnicos. | SPEC de clase |
| **RNF-005** | **Seguridad en autenticación:** Contraseñas protegidas mediante algoritmo de derivación de claves `bcrypt` con costo de cómputo adecuado (work factor 12). | SPEC de clase |
| **RNF-006** | **Protección anti-fuerza bruta:** Rate limiting activo en el endpoint de autenticación `/api/v1/auth/login` (máximo 5 solicitudes por minuto por IP). | SPEC de clase |
| **RNF-007** | **Estética tipo Google / Material:** Interfaz limpia con azul Google (`#1a73e8`), tipografía legible, sombras suaves, bordes redondeados y estados interactivos claros. | SPEC de clase |
| **RNF-008** | **Tiempos de respuesta:** Respuestas de API de lectura en menos de 300 ms en condiciones normales de desarrollo local. | Decisión de calidad |

---

## 7. Reglas de negocio

| ID | Regla de negocio | Fuente |
|----|------------------|--------|
| **BR-001** | Un curso aportado adquiere inicialmente el estado `en_revision`. Solo pasa al catálogo comunitario una vez validado y aprobado por un usuario con rol `admin`. | SPEC de clase |
| **BR-002** | Quien aporta un curso debe declarar obligatoriamente si él/ella realizó la cursada (`declare_que_lo_tomo = true/false`). | SPEC de clase |
| **BR-003** | No se admite la carga de cursos con URLs que ya existan en la base de datos (evita duplicación y spam). | Decisión técnica / producto |
| **BR-004** | Solo los cursos en estado `publicado` pueden ser visualizados en el catálogo público e incorporados al roadmap de los usuarios. | SPEC de clase / Consistencia |
| **BR-005** | Cada usuario posee un único roadmap personal privado; no puede agregar dos veces el mismo curso a su ruta. | Decisión de producto |
| **BR-006** | Los cursos en el roadmap personal tienen tres estados válidos y secuenciales: `por_empezar`, `en_progreso` y `completado`. | Decisión de producto |
| **BR-007** | Todos los cursos registrados en la plataforma deben ser gratuitos y de libre acceso. Si un reporte o revisión detecta que un curso es pago, es rechazado. | SPEC de clase |

---

## 8. Fuera de alcance (Out of scope)

Para mantener el foco en la entrega del MVP y asegurar la calidad de la ingeniería sin sobrecomplejidades, queda expresamente excluido:

1. **Pasarelas de cobro o venta de cursos:** No hay transacciones monetarias ni carritos de compra.
2. **Reproducción o alojamiento de video dentro de la app:** Los contenidos se consumen externamente en los sitios originales de los proveedores (YouTube, Coursera, etc.).
3. **Emisión de certificados académicos propios:** La plataforma solo registra si el proveedor emite o no certificado oficial.
4. **Comentarios abiertos sin moderación o foros:** Se evita la complejidad de moderación de texto libre en el MVP.
5. **Aplicación móvil nativa:** No se compilan binarios para Android ni iOS; se garantiza experiencia responsive web.
6. **Autenticación social OAuth de terceros (Google, GitHub):** Se mantiene autenticación local sólida (email/contraseña con bcrypt) para no depender de credenciales de API externas en la corrección docente.

---

## 9. Supuestos y decisiones sobre la SPEC de clase

1. **Validación asistida por rol administrador:** En lugar de sistemas complejos de reputación o votación que requerirían cientos de usuarios concurrentes para funcionar, se adoptó un rol `admin` para validar los aportes de forma determinista y comprobable durante las pruebas.
2. **Estructura del Roadmap:** Se asume que el roadmap es una lista priorizada con orden numérico y estado de avance, permitiendo al estudiante organizar su itinerario semana a semana.
3. **Simulación de emails en desarrollo:** La recuperación de contraseña genera un token seguro con expiración que en desarrollo se expone en la respuesta o logs, permitiendo verificar el flujo completo de reseteo sin requerir servidores SMTP pagos o externos.

---

## 10. Preguntas abiertas y decisiones tomadas

| Pregunta | Impacto | Decisión tomada |
|----------|---------|-----------------|
| ¿Qué ocurre con los aportes rechazados? | Bajo | Quedan en la base de datos con estado `rechazado` para registro histórico y auditoría del moderador. |
| ¿Un usuario puede editar los metadatos de un curso ya publicado? | Medio | No en el MVP; para corregir datos erróneos un administrador puede intervenir o se carga un nuevo aporte rectificado. |
| ¿Qué orden por defecto tiene el catálogo comunitario? | Bajo | Se ordenan por fecha de publicación descendente (los más recientes primero), con opción de filtro por categoría. |

---

**Referencias:**
- Atlassian — Product Requirements Document Template: https://www.atlassian.com/software/confluence/templates/product-requirements
- Lenny Rachitsky — Product Management Templates: https://www.atlassian.com/software/confluence/templates/requirements
