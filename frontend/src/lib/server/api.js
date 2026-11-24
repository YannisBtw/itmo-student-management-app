import { env } from "$env/dynamic/private";

const BASE_URL = (env.API_BASE_URL ?? "http://localhost:8080/api").replace(
  /\/+$/,
  ""
);

const KNOWN_MESSAGES = {
  "Invalid credentials": "Неверный логин или пароль",
  "Username already taken": "Имя пользователя уже занято",
  "Email already registered": "Этот email уже зарегистрирован",
  "Missing or malformed Authorization header": "Требуется вход в систему",
  "Authentication required": "Требуется вход в систему",
  "Invalid or expired token": "Сессия истекла. Войдите заново",
  "Insufficient role": "Недостаточно прав для этого действия",
  "ADMIN role required": "Это действие доступно только администратору"
};

const STATUS_MESSAGES = {
  0: "Сервер недоступен. Проверьте подключение и попробуйте позже",
  400: "Некорректный запрос",
  401: "Сессия истекла. Войдите заново",
  403: "Недостаточно прав для этого действия",
  404: "Запрашиваемые данные не найдены",
  409: "Такая запись уже существует",
  422: "Проверьте правильность заполнения полей"
};

export class ApiError extends Error {
  constructor(status, message = "", { details = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }

  get fieldErrors() {
    return this.details ?? {};
  }

  get userMessage() {
    if (this.status === 0) return STATUS_MESSAGES[0];
    if (KNOWN_MESSAGES[this.message]) return KNOWN_MESSAGES[this.message];
    if (/[А-Яа-яЁё]/.test(this.message)) return this.message;
    if (this.status >= 500) return "Внутренняя ошибка сервера. Попробуйте позже";
    return STATUS_MESSAGES[this.status] ?? "Не удалось выполнить запрос";
  }
}

export function getErrorMessage(error) {
  return error instanceof ApiError
    ? error.userMessage
    : "Произошла непредвиденная ошибка";
}

function buildUrl(path, query) {
  const url = BASE_URL + (path.startsWith("/") ? path : "/" + path);

  if (!query) return url;

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const qs = params.toString();

  return qs ? url + "?" + qs : url;
}

async function parseBody(response) {
  if (response.status === 204) return null;

  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiRequest(
  fetch,
  { method = "GET", path, query, body, token, auth = true }
) {
  const url = buildUrl(path, query);
  const headers = { Accept: "application/json" };

  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && token) headers["Authorization"] = "Bearer " + token;

  let response;

  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new ApiError(0, "Network error");
  }

  if (!response.ok) {
    const payload = await parseBody(response);

    throw new ApiError(response.status, payload?.message ?? "", {
      details: payload?.details ?? null
    });
  }

  return parseBody(response);
}