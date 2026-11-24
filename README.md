# Student Management App

<p align="center">
  <strong>Полноценное SPA-приложение для управления студентами</strong>
</p>

<p align="center">
  Svelte 5 · RxJS · Vite · Jakarta EE 11 · GlassFish 8 · PostgreSQL · JWT · Docker · Nginx
</p>

---

## О проекте

**Student Management App** — веб-приложение для управления информацией о студентах, разработанное в рамках лабораторных работ по веб-программированию в Университете ИТМО.

Приложение построено как полноценная клиент-серверная система:

- frontend реализован как SPA на **Svelte 5**;
- реактивная обработка поиска выполнена с помощью **RxJS**;
- backend построен на **Jakarta EE 11 / JAX-RS / JPA**;
- приложение работает на **GlassFish 8**;
- данные хранятся в **PostgreSQL 16**;
- аутентификация реализована через **JWT access- и refresh-токены**;
- предусмотрены роли **USER** и **ADMIN**;
- поиск, фильтрация, сортировка и пагинация выполняются через собственный HTTP-метод **`QUERY`**;
- frontend, backend и PostgreSQL полностью контейнеризированы и запускаются через **Docker Compose**;
- production frontend собирается multi-stage Dockerfile и раздаётся через **Nginx**.

---

# Возможности

## Управление студентами

Приложение поддерживает полный CRUD:

- просмотр списка студентов;
- просмотр отдельного студента;
- создание студента;
- полное редактирование;
- частичное редактирование;
- удаление.

Для списка студентов реализованы:

- поиск по ФИО;
- фильтрация по ИСУ;
- фильтрация по группе;
- фильтрация по общежитию;
- фильтрация по комнате;
- фильтрация по дате заселения;
- фильтрация по признаку иностранного студента;
- поиск по заметкам;
- сортировка;
- пагинация.

Поиск по ФИО обрабатывается реактивно через RxJS с debounce и отменой устаревших HTTP-запросов.

---

## Аутентификация

Реализованы:

- регистрация пользователей;
- вход по username или email;
- хранение паролей с помощью BCrypt;
- JWT access token;
- JWT refresh token;
- автоматическое обновление access token;
- refresh token rotation;
- завершение сессии при невозможности обновить токен;
- сохранение состояния авторизации между обновлениями страницы.

Access token используется для доступа к защищённым API-методам:

```http
Authorization: Bearer <access-token>
```

По умолчанию время жизни задаётся через environment variables:

```text
access token  — 900 секунд
refresh token — 604800 секунд
```

То есть:

```text
access token  — 15 минут
refresh token — 7 дней
```

---

# Роли и права доступа

В приложении предусмотрены две роли:

| Возможность | USER | ADMIN |
|---|:---:|:---:|
| Просмотр студентов | ✅ | ✅ |
| Поиск | ✅ | ✅ |
| Фильтрация | ✅ | ✅ |
| Сортировка | ✅ | ✅ |
| Пагинация | ✅ | ✅ |
| Просмотр карточки студента | ✅ | ✅ |
| Создание студента | ❌ | ✅ |
| Редактирование | ❌ | ✅ |
| Удаление | ❌ | ✅ |

Проверка прав выполняется на двух уровнях.

### Frontend

Router ограничивает доступ к страницам:

```text
/students/new
/students/:id/edit
```

только для `ADMIN`.

Пользователь без необходимых прав перенаправляется на:

```text
/forbidden
```

### Backend

Frontend-защита используется только для корректного UX.

Реальная авторизация выполняется на сервере:

```text
GET / QUERY
    → USER или ADMIN

POST / PUT / PATCH / DELETE
    → только ADMIN
```

Таким образом, пользователь не сможет обойти ограничения, отправив HTTP-запрос вручную.

---

# Архитектура

Полная production-схема приложения:

```text
                        Browser
                           │
                           │ http://localhost:3000
                           ▼
                ┌─────────────────────┐
                │      Frontend       │
                │                     │
                │      Svelte 5       │
                │        RxJS         │
                │       Router        │
                │                     │
                │       Nginx         │
                └──────────┬──────────┘
                           │
                           │ /api/*
                           │
                           ▼
                ┌─────────────────────┐
                │       Backend       │
                │                     │
                │    GlassFish 8      │
                │    Jakarta EE 11    │
                │       JAX-RS        │
                │        JPA          │
                │     EclipseLink     │
                └──────────┬──────────┘
                           │
                           │ jdbc/StudentDS
                           │
                           ▼
                ┌─────────────────────┐
                │     PostgreSQL      │
                │                     │
                │     PostgreSQL 16   │
                └─────────────────────┘
```

Все три компонента работают в одной Docker Compose network.

Внутри Docker контейнеры обращаются друг к другу по именам сервисов:

```text
frontend → backend:8080
backend  → postgres:5432
```

---

# Frontend

Frontend представляет собой SPA на **Svelte 5**.

Основные технологии:

| Технология | Назначение |
|---|---|
| Svelte 5 | компонентный UI и реактивность |
| Vite | development server и production build |
| RxJS | реактивные потоки |
| svelte-spa-router | клиентская маршрутизация |
| Fetch API | HTTP-запросы |
| Nginx | production-раздача frontend и reverse proxy |

---

## SPA и маршрутизация

Приложение работает как Single Page Application.

Основные маршруты:

```text
/                     список студентов
/students             список студентов
/students/new         создание студента
/students/:id         карточка студента
/students/:id/edit    редактирование
/login                вход
/register             регистрация
/profile              профиль
/forbidden            недостаточно прав
```

Защита маршрутов реализована через guards.

Доступны три типа guard:

```text
auth
admin
guest
```

Например:

```text
/students/:id
    → авторизованный пользователь

/students/new
    → только ADMIN

/login
    → только неавторизованный пользователь
```

---

# Компонентная архитектура frontend

Frontend разделён по ответственности.

```text
frontend/src/
│
├── components/
│   ├── auth/
│   │   ├── AuthCard.svelte
│   │   └── FormField.svelte
│   │
│   ├── common/
│   │   ├── ErrorMessage.svelte
│   │   ├── Header.svelte
│   │   └── Loading.svelte
│   │
│   └── students/
│       ├── Pagination.svelte
│       ├── StudentFilters.svelte
│       ├── StudentRow.svelte
│       └── StudentTable.svelte
│
├── pages/
│   ├── auth/
│   ├── common/
│   └── students/
│
├── router/
│   └── router.js
│
├── rx/
│   ├── authSession.js
│   ├── fromStore.js
│   └── studentSearch.js
│
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── jwt.js
│   └── studentService.js
│
├── stores/
│   ├── authStore.js
│   └── flashStore.js
│
├── App.svelte
└── main.js
```

### `components`

Переиспользуемые UI-компоненты.

### `pages`

Компоненты уровня маршрута.

### `services`

Взаимодействие с backend.

### `stores`

Глобальное состояние приложения.

### `rx`

Реактивная логика на RxJS.

### `router`

Маршрутизация и route guards.

---

# Реактивность Svelte

В проекте используется **Svelte 5**.

Компоненты используют реактивное состояние Svelte и автоматически обновляют интерфейс при изменении данных.

Svelte отличается от React тем, что не использует классический Virtual DOM.

Значительная часть работы выполняется Svelte-компилятором во время build, после чего генерируется JavaScript для точечного обновления DOM.

---

# RxJS

RxJS используется в приложении не только как зависимость, а как часть реальной бизнес-логики.

## Реактивный поиск студентов

Поиск строится как поток событий:

```text
пользователь вводит ФИО
        │
        ▼
     Subject
        │
        ▼
 debounceTime(300)
        │
        ▼
distinctUntilChanged
        │
        ▼
    switchMap
        │
        ▼
 QUERY /students
        │
        ▼
 результат поиска
```

### `Subject`

Используется как источник событий поиска.

### `debounceTime(300)`

Запрос не выполняется после каждого введённого символа.

Например, при быстром вводе:

```text
И
Ив
Ива
Иван
```

не требуется выполнять четыре запроса подряд.

### `distinctUntilChanged`

Предотвращает повторную обработку одинакового поискового значения.

### `switchMap`

При появлении нового запроса RxJS переключается на новый поток и перестаёт использовать старый результат.

### `AbortController`

Для HTTP-запросов дополнительно используется `AbortController`.

Это позволяет не только отписаться от устаревшего Observable, но и физически отменить ненужный `fetch`.

---

# Автоматическое обновление JWT

RxJS также используется для контроля времени жизни access token.

Логика:

```text
получен access token
        │
        ▼
определяется exp
        │
        ▼
RxJS timer
        │
        ▼
за 30 секунд до истечения
        │
        ▼
refresh token request
        │
        ▼
новая пара токенов
```

При временной ошибке refresh предусмотрены повторные попытки.

При `401 Unauthorized` сессия завершается.

---

# Глобальное состояние

Состояние авторизации хранится в `authStore`.

В нём находятся:

```text
accessToken
refreshToken
user
```

Из основного store создаются derived stores:

```text
isAuthenticated
currentUser
userRole
isAdmin
```

Токены сохраняются в `localStorage`, поэтому пользователь остаётся авторизованным после перезагрузки страницы.

---

# Работа с API

Базовый URL frontend:

```text
/api
```

В development Vite проксирует его на:

```text
http://localhost:8080/web-lab-3/api
```

В production эту же задачу выполняет Nginx.

Таким образом frontend-код не зависит от конкретного адреса backend.

При необходимости базовый URL можно переопределить через:

```text
VITE_API_BASE_URL
```

---

# Custom HTTP method QUERY

Для поиска, фильтрации, сортировки и пагинации используется собственный HTTP-метод:

```http
QUERY
```

На backend создана собственная JAX-RS HTTP-аннотация.

Пример запроса:

```http
QUERY /api/students?sortBy=id&sortDirection=asc&page=0&size=20
```

Поиск по ФИО:

```http
QUERY /api/students?fullName=Иван
```

Фильтрация по группе:

```http
QUERY /api/students?group=P3110
```

Использование отдельного метода позволяет отделить обычное получение ресурсов от расширенного запроса с фильтрацией.

---

# Параметры QUERY

Поддерживаются:

| Параметр | Назначение |
|---|---|
| `fullName` | поиск по ФИО |
| `isuId` | фильтр по ИСУ |
| `group` | фильтр по группе |
| `dormitoryNumber` | номер общежития |
| `roomNumber` | номер комнаты |
| `moveInDate` | дата заселения |
| `isForeign` | иностранный студент |
| `notes` | поиск по заметкам |
| `sortBy` | поле сортировки |
| `sortDirection` | `asc` / `desc` |
| `page` | номер страницы |
| `size` | размер страницы |

Для фильтра `moveInDate` backend принимает:

```text
DD-MM-YYYY
```

Например:

```text
10-11-2026
```

При создании и редактировании студента дата передаётся стандартным JSON-представлением `LocalDate`.

---

# Формат отображения даты

В таблице frontend дата отображается в пользовательском формате:

```text
DD-MM-YYYY
```

Например:

```text
01-09-2026
```

При этом в Java используется:

```java
LocalDate
```

а в PostgreSQL:

```sql
DATE
```

То есть формат отображения интерфейса не влияет на тип хранения даты.

---

# Backend

Backend построен на Jakarta EE.

Основной стек:

| Технология | Использование |
|---|---|
| Java 21 | язык backend |
| Jakarta EE 11 | серверная платформа |
| JAX-RS | REST API |
| CDI | dependency injection |
| Jakarta Validation | валидация DTO |
| Jakarta Persistence | persistence API |
| EclipseLink | ORM |
| PostgreSQL JDBC | соединение с БД |
| JJWT | JWT |
| BCrypt | hashing паролей |
| Swagger / OpenAPI | описание API |
| Maven | сборка |
| GlassFish 8 | application server |

Backend собирается как:

```text
WAR
```

и разворачивается на GlassFish.

---

# Backend architecture

Backend разделён на слои:

```text
HTTP request
     │
     ▼
 Resource
     │
     ▼
 Service
     │
     ▼
 Repository
     │
     ▼
 JPA / EntityManager
     │
     ▼
 EclipseLink
     │
     ▼
 PostgreSQL
```

## Resource

Обрабатывает HTTP.

Например:

```text
StudentResource
AuthResource
```

## Service

Содержит бизнес-логику:

```text
StudentService
AuthService
UserService
JwtService
PasswordService
```

## Repository

Работает с EntityManager и БД.

## DTO

Используются для входящих и исходящих данных.

JPA Entity напрямую наружу не передаются.

---

# Student API

Базовый endpoint:

```text
/api/students
```

| Метод | Endpoint | Действие | Доступ |
|---|---|---|---|
| `GET` | `/students` | получить список | USER / ADMIN |
| `QUERY` | `/students` | поиск, фильтрация, сортировка, пагинация | USER / ADMIN |
| `GET` | `/students/{id}` | получить студента | USER / ADMIN |
| `POST` | `/students` | создать | ADMIN |
| `PUT` | `/students/{id}` | полностью обновить | ADMIN |
| `PATCH` | `/students/{id}` | частично обновить | ADMIN |
| `DELETE` | `/students/{id}` | удалить | ADMIN |

---

# Auth API

Базовый endpoint:

```text
/api/auth
```

### Регистрация

```http
POST /api/auth/register
```

### Вход

```http
POST /api/auth/login
```

### Обновление токенов

```http
POST /api/auth/refresh
```

---

# JWT authentication

После успешного входа backend выдаёт:

```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

Access token содержит claims, необходимые для авторизации:

```text
sub
role
type
iat
exp
```

Подпись JWT проверяется backend при каждом защищённом запросе.

Если содержимое JWT изменить вручную, подпись перестанет соответствовать token payload и токен будет отклонён.

---

# Refresh Token Rotation

Refresh token после использования не остаётся действующим бесконечно.

Логика:

```text
refresh token A
      │
      ▼
refresh request
      │
      ├── revoke A
      │
      └── create B
```

Таким образом каждый refresh token используется как часть последовательности обновления.

В PostgreSQL хранится не исходный refresh token, а его hash.

---

# Валидация

Валидация выполняется на нескольких уровнях:

```text
Frontend
   +
Backend
   +
PostgreSQL
```

Это важно, потому что frontend validation нельзя считать механизмом безопасности — HTTP-запрос можно отправить напрямую.

---

## Student validation

Основные ограничения:

### ФИО

```text
обязательное
не пустое
не более 255 символов
```

### ИСУ

```text
6 цифр
100000–999999
уникальный
```

### Группа

Используется формат группы, соответствующий регулярному выражению backend и database constraint.

### Номер общежития

```text
1–99
```

### Номер комнаты

```text
1–9999
```

### Дата заселения

Дата должна находиться в прошлом.

### Признак иностранного студента

```text
true / false
```

### Заметки

```text
не более 255 символов
```

---

# PostgreSQL

Используется:

```text
PostgreSQL 16
```

Основные таблицы:

```text
students
users
refresh_tokens
```

---

## Таблица students

Содержит:

```text
id
fullname
isuid
student_group
dormitorynumber
roomnumber
moveindate
isforeign
notes
```

На уровне БД дополнительно заданы:

- Primary Key;
- Unique constraint для `isuid`;
- NOT NULL;
- CHECK для пустого ФИО;
- проверка диапазона ИСУ;
- проверка формата группы;
- диапазон общежития;
- диапазон комнаты;
- проверка даты заселения.

---

## Таблица users

Хранит:

```text
id
username
email
password_hash
role
created_at
```

Дополнительно:

- уникальный username;
- уникальный email;
- роли только `USER` и `ADMIN`;
- запрет пустых обязательных полей.

Пароль пользователя в открытом виде в БД не хранится.

---

## Таблица refresh_tokens

Хранит:

```text
id
token_hash
user_id
expires_at
revoked
```

Также созданы индексы для:

```text
user_id
expires_at
```

---

# Инициализация базы

Схема находится в:

```text
backend/db/init.sql
```

PostgreSQL container монтирует файл в:

```text
/docker-entrypoint-initdb.d/
```

Поэтому при создании нового PostgreSQL volume схема создаётся автоматически.

JPA schema generation отключён:

```xml
jakarta.persistence.schema-generation.database.action = none
```

Это сделано для того, чтобы ORM не пересоздавала таблицы при redeploy приложения.

---

# GlassFish JDBC

Backend использует JTA datasource:

```text
jdbc/StudentDS
```

Persistence unit:

```text
studentPU
```

При запуске Docker backend автоматически настраивает:

```text
StudentPool
     ↓
jdbc/StudentDS
```

через `asadmin`.

Параметры подключения берутся из environment variables:

```text
POSTGRES_HOST
POSTGRES_PORT
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
```

При работе через Docker:

```text
POSTGRES_HOST=postgres
```

потому что `postgres` — имя Compose-сервиса.

---

# Docker

В проекте контейнеризированы все основные части системы.

```text
frontend
backend
postgres
```

---

# Frontend Dockerfile

Frontend использует multi-stage build.

## Stage 1 — Node.js

```text
Node 22
↓
npm ci
↓
Vite build
↓
dist/
```

## Stage 2 — Nginx

```text
Nginx
+
dist/
```

В финальный frontend image не попадают:

- Node.js build environment;
- исходные npm dependencies;
- development server.

Nginx раздаёт готовые статические файлы.

---

# Nginx

Production frontend доступен через:

```text
http://localhost:3000
```

Все запросы:

```text
/api/*
```

проксируются на:

```text
http://backend:8080/web-lab-3/api/
```

Также настроен fallback:

```nginx
try_files $uri $uri/ /index.html;
```

Он позволяет корректно работать клиентской маршрутизации SPA.

---

# Backend Dockerfile

Backend также использует multi-stage build.

Первый этап:

```text
Maven
↓
Java 21
↓
mvn clean package
↓
WAR
```

После этого WAR переносится в официальный GlassFish image.

Также в GlassFish добавляется PostgreSQL JDBC driver.

WAR разворачивается под context root:

```text
/web-lab-3
```

---

# Docker Compose

Корневой:

```text
compose.yaml
```

запускает:

```text
PostgreSQL
     ↓ healthy
Backend / GlassFish
     ↓
Frontend / Nginx
```

Для PostgreSQL настроен healthcheck.

Backend запускается после успешной проверки базы:

```yaml
depends_on:
  postgres:
    condition: service_healthy
```

---

# Environment variables

Пример конфигурации находится в:

```text
.env.example
```

Настоящий:

```text
.env
```

не коммитится и находится в `.gitignore`.

Основные переменные:

```env
POSTGRES_DB=student_db
POSTGRES_USER=student
POSTGRES_PASSWORD=...

JWT_SECRET=...
JWT_ACCESS_TTL_SECONDS=900
JWT_REFRESH_TTL_SECONDS=604800

ADMIN_USERNAME=admin
ADMIN_PASSWORD=...
ADMIN_EMAIL=admin@example.com
```

---

# Первый запуск

## Требования

Для полного Docker-запуска требуется только:

```text
Docker
Docker Compose
```

Java, Maven, Node.js, PostgreSQL и GlassFish локально устанавливать не требуется.

---

## 1. Клонировать репозиторий

```bash
git clone https://github.com/YannisBtw/itmo-student-management-app.git
cd itmo-student-management-app
```

---

## 2. Создать `.env`

Linux / macOS:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

После этого рекомендуется изменить:

```text
POSTGRES_PASSWORD
JWT_SECRET
ADMIN_PASSWORD
ADMIN_EMAIL
```

`JWT_SECRET` должен быть достаточно длинным случайным значением.

---

## 3. Собрать и запустить проект

```bash
docker compose up --build
```

После запуска приложение доступно по адресу:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:8080/web-lab-3/
```

---

# Запуск в фоне

```bash
docker compose up -d
```

С пересборкой:

```bash
docker compose up -d --build
```

---

# Проверка контейнеров

```bash
docker compose ps
```

Должны работать:

```text
postgres
backend
frontend
```

---

# Остановка

```bash
docker compose down
```

Обычный `down` не удаляет данные PostgreSQL.

---

## Полный сброс БД

> Использовать только если действительно нужно удалить все данные.

```bash
docker compose down -v
```

Флаг:

```text
-v
```

удаляет Docker volume PostgreSQL.

После следующего запуска база будет создана заново из:

```text
backend/db/init.sql
```

---

# Разработка frontend

Во время разработки frontend необязательно каждый раз пересобирать Docker image.

Удобный режим:

```text
PostgreSQL → Docker
Backend    → Docker
Frontend   → Vite dev server
```

Запустить backend и БД:

```bash
docker compose up -d postgres backend
```

Затем:

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен примерно по:

```text
http://localhost:5173
```

Vite автоматически проксирует `/api` на backend:

```text
localhost:8080/web-lab-3/api
```

Изменения `.svelte`, `.js` и CSS применяются через hot reload.

---

# Пересборка отдельных сервисов

Только frontend:

```bash
docker compose up -d --build frontend
```

Только backend:

```bash
docker compose up -d --build backend
```

Всё приложение:

```bash
docker compose up -d --build
```

---

# Полезные Docker-команды

Логи всех контейнеров:

```bash
docker compose logs
```

Логи backend:

```bash
docker compose logs backend
```

Последние строки backend:

```bash
docker compose logs backend --tail=100
```

Логи frontend:

```bash
docker compose logs frontend
```

Логи PostgreSQL:

```bash
docker compose logs postgres
```

Перезапуск backend:

```bash
docker compose restart backend
```

---

# Администратор

При запуске backend может автоматически создать администратора на основе:

```text
ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_EMAIL
```

Если пользователь с таким username уже существует, его пароль автоматически не перезаписывается.

Это важно при изменении `ADMIN_PASSWORD` в существующей БД.

---

# Работа `.env` с существующей PostgreSQL

Переменная:

```text
POSTGRES_PASSWORD
```

используется:

1. PostgreSQL при первоначальном создании пользователя;
2. backend при подключении к PostgreSQL.

Если Docker volume уже существует, простое изменение:

```env
POSTGRES_PASSWORD=...
```

не меняет пароль пользователя внутри существующей БД.

Поэтому для существующей БД пароль в `.env` должен соответствовать реальному паролю PostgreSQL.

---

# Безопасность

В проекте реализованы следующие меры:

- BCrypt hashing паролей;
- JWT signature validation;
- короткоживущий access token;
- refresh token;
- refresh token rotation;
- хранение hash refresh token вместо исходного значения;
- backend role-based authorization;
- frontend route guards;
- Bean Validation;
- database constraints;
- environment variables для секретов;
- `.env` исключён из Git;
- пользовательские ошибки обрабатываются централизованно;
- защищённые API требуют Bearer token.

---

# Обработка ошибок

Frontend содержит общий `ApiError`.

Обрабатываются:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
5xx Server Error
Network Error
```

Пользователю отображаются понятные сообщения вместо сырых backend-ошибок.

---

# Loading states

При асинхронных операциях интерфейс показывает состояние загрузки.

Для форм используется отдельное состояние отправки, которое предотвращает повторную отправку одного запроса несколькими быстрыми нажатиями.

---

# HTTP request flow

Пример получения списка:

```text
StudentListPage
      │
      ▼
studentService
      │
      ▼
api.js
      │
      ▼
QUERY /api/students
      │
      ▼
Nginx
      │
      ▼
StudentResource
      │
      ▼
StudentService
      │
      ▼
StudentRepository
      │
      ▼
JPA / EclipseLink
      │
      ▼
PostgreSQL
```

---

# Authentication flow

```text
Login form
    │
    ▼
POST /auth/login
    │
    ▼
Backend
    │
    ├── BCrypt password verification
    │
    └── JWT generation
            │
            ▼
   access + refresh
            │
            ▼
       authStore
            │
            ▼
       localStorage
```

Затем:

```text
API request
    │
    ▼
Authorization: Bearer accessToken
    │
    ▼
JWT authentication filter
    │
    ▼
Authorization filter
    │
    ▼
Resource
```

---

# Refresh flow

```text
access token almost expired
          │
          ▼
      RxJS timer
          │
          ▼
POST /auth/refresh
          │
          ▼
validate refresh token
          │
          ▼
revoke old token
          │
          ▼
create new token pair
          │
          ▼
     update authStore
```

---

# Структура проекта

Ключевая структура репозитория:

```text
itmo-student-management-app/
│
├── .env.example
├── .gitignore
├── compose.yaml
│
├── backend/
│   ├── db/
│   │   └── init.sql
│   │
│   ├── docker/
│   │   └── init.sh
│   │
│   ├── bruno/
│   │
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── ru/itmo/weblab3/
│   │       │       ├── bootstrap/
│   │       │       ├── config/
│   │       │       ├── dto/
│   │       │       ├── entity/
│   │       │       ├── exception/
│   │       │       ├── http/
│   │       │       ├── repository/
│   │       │       ├── resource/
│   │       │       ├── security/
│   │       │       ├── service/
│   │       │       └── util/
│   │       │
│   │       └── resources/
│   │           └── META-INF/
│   │               └── persistence.xml
│   │
│   ├── Dockerfile
│   └── pom.xml
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── router/
    │   ├── rx/
    │   ├── services/
    │   ├── stores/
    │   ├── App.svelte
    │   └── main.js
    │
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── vite.config.js
```

---

# Bruno

В директории:

```text
backend/bruno/
```

находится коллекция запросов для ручного тестирования backend API.

Она содержит примеры:

- регистрации;
- входа USER;
- входа ADMIN;
- refresh;
- получения студентов;
- создания;
- PUT;
- PATCH;
- DELETE;
- фильтрации;
- поиска;
- сортировки;
- пагинации;
- ошибок авторизации.

---

# Основные технологии

### Frontend

```text
Svelte 5
Vite
RxJS
svelte-spa-router
JavaScript
HTML
CSS
Nginx
```

### Backend

```text
Java 21
Jakarta EE 11
JAX-RS
CDI
Jakarta Validation
Jakarta Persistence
EclipseLink
JJWT
BCrypt
OpenAPI / Swagger
Maven
GlassFish 8
```

### Infrastructure

```text
PostgreSQL 16
Docker
Docker Compose
Nginx
```

---

# Что демонстрирует проект

Проект охватывает основные концепции современной frontend- и backend-разработки:

- SPA;
- клиентскую маршрутизацию;
- компонентную архитектуру;
- props;
- lifecycle;
- реактивность;
- локальное и глобальное состояние;
- RxJS;
- Observable;
- Subject;
- Subscription;
- debounce;
- switchMap;
- отмену HTTP-запросов;
- REST API;
- custom HTTP methods;
- JWT authentication;
- refresh token rotation;
- RBAC;
- validation;
- error handling;
- Docker;
- multi-stage builds;
- reverse proxy;
- Docker networking;
- environment configuration;
- persistence;
- database constraints.

---

# Лабораторная работа №4

Основной frontend лабораторной реализован на **Svelte**, без использования SvelteKit.

В рамках работы реализованы:

- SPA;
- компоненты;
- props;
- lifecycle;
- routing;
- global state;
- CRUD;
- поиск;
- фильтрация;
- сортировка;
- пагинация;
- reactive UI;
- RxJS;
- JWT authentication;
- access/refresh tokens;
- роли;
- route guards;
- client-side validation;
- loading/error states;
- custom HTTP method `QUERY`;
- Docker Compose;
- multi-stage frontend build;
- Nginx;
- PostgreSQL;
- environment configuration.

---

# Автор

Проект выполнен в рамках обучения в:

**Университете ИТМО**

Курс:

```text
Веб-программирование
```

Проект:

```text
Student Management App
```

---

## Быстрый старт

```bash
git clone https://github.com/YannisBtw/itmo-student-management-app.git
cd itmo-student-management-app

cp .env.example .env

docker compose up --build
```

После запуска:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8080/web-lab-3/
```

---

<p align="center">
  <strong>Svelte · RxJS · Jakarta EE · PostgreSQL · Docker</strong>
</p>