<script>
    import { link, push } from "svelte-spa-router";

    import AuthCard from "../../components/auth/AuthCard.svelte";
    import FormField from "../../components/auth/FormField.svelte";
    import ErrorMessage from "../../components/common/ErrorMessage.svelte";
    import Loading from "../../components/common/Loading.svelte";
    import { ApiError } from "../../services/api.js";
    import { login, register } from "../../services/authService.js";
    import { flash } from "../../stores/flashStore.js";

    const FIELDS = ["username", "email", "password"];

    let username = $state("");
    let email = $state("");
    let password = $state("");
    let confirmPassword = $state("");
    let submitting = $state(false);
    let submitted = $state(false);
    let generalError = $state(null);
    let serverErrors = $state({});

    const currentValues = $derived({ username, email, password });

    const clientErrors = $derived({
        username: validateUsername(username),
        email: validateEmail(email),
        password: validatePassword(password),
        confirmPassword: password === confirmPassword ? "" : "Пароли не совпадают"
    });

    const hasClientErrors = $derived(Object.values(clientErrors).some(Boolean));

    function validateUsername(value) {
        const length = value.trim().length;

        return length >= 3 && length <= 64 ? "" : "От 3 до 64 символов";
    }

    function validateEmail(value) {
        const trimmed = value.trim();

        if (!trimmed) {
            return "Введите email";
        }

        return trimmed.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
            ? ""
            : "Введите корректный email";
    }

    function validatePassword(value) {
        if (value.length < 8 || value.length > 72) {
            return "От 8 до 72 символов";
        }

        return /[A-Za-z]/.test(value) && /\d/.test(value)
            ? ""
            : "Нужна хотя бы одна латинская буква и одна цифра";
    }

    function shown(field) {
        const server = serverErrors[field];

        if (server && server.value === currentValues[field]) {
            return server.message;
        }

        return submitted ? clientErrors[field] : "";
    }

    function applyServerError(caught, values) {
        const next = {};

        if (caught instanceof ApiError && caught.status === 422) {
            FIELDS.forEach(function (field) {
                if (caught.fieldErrors[field]) {
                    next[field] = { value: values[field], message: caught.fieldErrors[field] };
                }
            });
        } else if (caught instanceof ApiError && caught.status === 409) {
            const field = caught.message === "Email already registered" ? "email" : "username";

            next[field] = { value: values[field], message: caught.userMessage };
        }

        serverErrors = next;
        generalError = Object.keys(next).length > 0 ? null : caught;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        submitted = true;

        if (submitting || hasClientErrors) {
            return;
        }

        submitting = true;
        generalError = null;
        serverErrors = {};

        const values = { username, email, password };
        const payload = { username: username.trim(), email: email.trim(), password };

        try {
            await register(payload);
        } catch (caught) {
            applyServerError(caught, values);
            submitting = false;
            return;
        }

        try {
            await login(payload.username, payload.password);
            push("/");
        } catch (caught) {
            flash.set("Регистрация прошла успешно. Войдите в систему");
            push("/login");
        } finally {
            submitting = false;
        }
    }
</script>

<AuthCard title="Регистрация">
    <form onsubmit={handleSubmit} novalidate>
        <fieldset disabled={submitting}>
            <FormField
                id="username"
                label="Логин"
                autocomplete="username"
                hint="От 3 до 64 символов"
                bind:value={username}
                error={shown("username")}
            />

            <FormField
                id="email"
                label="Email"
                type="email"
                autocomplete="email"
                bind:value={email}
                error={shown("email")}
            />

            <FormField
                id="password"
                label="Пароль"
                type="password"
                autocomplete="new-password"
                hint="От 8 до 72 символов, минимум одна буква и одна цифра"
                bind:value={password}
                error={shown("password")}
            />

            <FormField
                id="confirmPassword"
                label="Повторите пароль"
                type="password"
                autocomplete="new-password"
                bind:value={confirmPassword}
                error={submitted ? clientErrors.confirmPassword : ""}
            />
        </fieldset>

        <ErrorMessage error={generalError} />

        <button type="submit" disabled={submitting}>Зарегистрироваться</button>

        {#if submitting}
            <Loading message="Создаём аккаунт..." />
        {/if}
    </form>

    <p class="alt">Уже есть аккаунт? <a href="/login" use:link>Войти</a></p>
</AuthCard>
