<script>
    import { get } from "svelte/store";
    import { link, push, router } from "svelte-spa-router";

    import AuthCard from "../../components/auth/AuthCard.svelte";
    import FormField from "../../components/auth/FormField.svelte";
    import ErrorMessage from "../../components/common/ErrorMessage.svelte";
    import Loading from "../../components/common/Loading.svelte";
    import { login } from "../../services/authService.js";
    import { flash } from "../../stores/flashStore.js";

    let usernameOrEmail = $state("");
    let password = $state("");
    let submitting = $state(false);
    let submitted = $state(false);
    let error = $state(null);

    const notice = get(flash);
    flash.set(null);

    const errors = $derived({
        usernameOrEmail: usernameOrEmail.trim() ? "" : "Введите логин или email",
        password: password ? "" : "Введите пароль"
    });

    const hasErrors = $derived(Boolean(errors.usernameOrEmail || errors.password));

    function getRedirectTarget() {
        const target = new URLSearchParams(router.querystring).get("redirect");

        return target && target.startsWith("/") && !target.startsWith("//") ? target : "/";
    }

    async function handleSubmit(event) {
        event.preventDefault();
        submitted = true;

        if (submitting || hasErrors) {
            return;
        }

        submitting = true;
        error = null;

        try {
            await login(usernameOrEmail.trim(), password);
            push(getRedirectTarget());
        } catch (caught) {
            error = caught;
            password = "";
        } finally {
            submitting = false;
        }
    }
</script>

<AuthCard title="Вход">
    {#if notice}
        <p class="notice" role="status">{notice}</p>
    {/if}

    <form onsubmit={handleSubmit} novalidate>
        <fieldset disabled={submitting}>
            <FormField
                id="usernameOrEmail"
                label="Логин или email"
                autocomplete="username"
                bind:value={usernameOrEmail}
                error={submitted ? errors.usernameOrEmail : ""}
            />

            <FormField
                id="password"
                label="Пароль"
                type="password"
                autocomplete="current-password"
                bind:value={password}
                error={submitted ? errors.password : ""}
            />
        </fieldset>

        <ErrorMessage {error} />

        <button type="submit" disabled={submitting}>Войти</button>

        {#if submitting}
            <Loading message="Выполняется вход..." />
        {/if}
    </form>

    <p class="alt">Нет аккаунта? <a href="/register" use:link>Зарегистрироваться</a></p>
</AuthCard>
