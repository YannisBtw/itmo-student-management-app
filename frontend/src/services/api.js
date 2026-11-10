const BASE_URL = (import.meta.env?.VITE_API_BASE_URL ?? "/api").replace(/\/+$/, "");


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
        if (this.status === 0) {
            return STATUS_MESSAGES[0];
        }

        if (KNOWN_MESSAGES[this.message]) {
            return KNOWN_MESSAGES[this.message];
        }

        if (/[А-Яа-яЁё]/.test(this.message)) {
            return this.message;
        }

        if (this.status >= 500) {
            return "Внутренняя ошибка сервера. Попробуйте позже";
        }

        return STATUS_MESSAGES[this.status] ?? "Не удалось выполнить запрос";
    }
}


export function getErrorMessage(error) {
    return error instanceof ApiError
        ? error.userMessage
        : "Произошла непредвиденная ошибка";
}


let handlers = {
    getAccessToken: () => null,
    refresh: null,
    onAuthFailure: () => {}
};


export function configureApi(next) {
    handlers = { ...handlers, ...next };
}


function buildUrl(path, query) {
    const url = BASE_URL + (path.startsWith("/") ? path : "/" + path);

    if (!query) {
        return url;
    }

    const params = new URLSearchParams();

    Object.entries(query).forEach(function ([key, value]) {
        if (value !== undefined && value !== null && value !== "") {
            params.set(key, String(value));
        }
    });

    const queryString = params.toString();

    return queryString ? url + "?" + queryString : url;
}


async function send(url, { method, body, headers, signal, auth }) {
    const finalHeaders = { Accept: "application/json", ...headers };

    if (body !== undefined) {
        finalHeaders["Content-Type"] = "application/json";
    }

    if (auth) {
        const token = handlers.getAccessToken();

        if (token) {
            finalHeaders["Authorization"] = "Bearer " + token;
        }
    }

    try {
        return await fetch(url, {
            method,
            headers: finalHeaders,
            body: body === undefined ? undefined : JSON.stringify(body),
            signal
        });
    } catch (error) {
        if (error?.name === "AbortError") {
            throw error;
        }

        throw new ApiError(0, "Network error");
    }
}


async function parseBody(response) {
    if (response.status === 204) {
        return null;
    }

    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        return null;
    }
}


async function retryAfterRefresh(url, params) {
    try {
        await handlers.refresh();
    } catch (error) {
        if (error?.name === "AbortError") {
            throw error;
        }

        if (error instanceof ApiError && error.status === 401) {
            handlers.onAuthFailure();
        }

        throw error;
    }

    return send(url, params);
}


export async function request(path, options = {}) {
    const { method = "GET", body, query, headers, signal, auth = true } = options;

    const url = buildUrl(path, query);
    const params = { method, body, headers, signal, auth };

    let response = await send(url, params);

    if (response.status === 401 && auth && handlers.refresh) {
        response = await retryAfterRefresh(url, params);

        if (response.status === 401) {
            handlers.onAuthFailure();
        }
    }

    if (!response.ok) {
        const payload = await parseBody(response);

        throw new ApiError(response.status, payload?.message ?? "", {
            details: payload?.details ?? null
        });
    }

    return parseBody(response);
}


export const api = {
    request,
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, body, options) => request(path, { ...options, method: "POST", body }),
    put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
    patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
    delete: (path, options) => request(path, { ...options, method: "DELETE" }),
    query: (path, query, options) => request(path, { ...options, method: "QUERY", query })
};
