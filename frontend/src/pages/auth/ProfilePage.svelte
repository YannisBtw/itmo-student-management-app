<script>
    import { link } from "svelte-spa-router";

    import AuthCard from "../../components/auth/AuthCard.svelte";
    import { logout } from "../../services/authService.js";
    import { currentUser } from "../../stores/authStore.js";

    const roleLabels = {
        ADMIN: "Администратор",
        USER: "Пользователь"
    };

    const rights = {
        ADMIN: "Просмотр, создание, редактирование и удаление студентов",
        USER: "Просмотр списка студентов и подробной информации о них"
    };
</script>

<AuthCard title="Профиль">
    {#if $currentUser}
        <dl>
            <dt>Логин</dt>
            <dd>{$currentUser.username}</dd>

            <dt>Роль</dt>
            <dd>{roleLabels[$currentUser.role] ?? $currentUser.role}</dd>

            <dt>Доступные действия</dt>
            <dd>{rights[$currentUser.role] ?? "Нет данных"}</dd>
        </dl>

        <div class="actions">
            <a href="/" use:link>К списку студентов</a>
            <button type="button" onclick={logout}>Выйти</button>
        </div>
    {/if}
</AuthCard>

<style>
    dl {
        margin: 0 0 1.5rem;
    }

    dt {
        margin-top: 1rem;
        color: #666666;
        font-size: 0.875rem;
    }

    dd {
        margin: 0.25rem 0 0;
        overflow-wrap: anywhere;
    }

    .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    button {
        padding: 0.5rem 1rem;
        border: 1px solid #cccccc;
        border-radius: 0.375rem;
        background-color: #eeeeee;
        cursor: pointer;
    }
</style>
