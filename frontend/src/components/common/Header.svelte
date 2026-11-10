<script>
    import { link, push, router } from "svelte-spa-router";

    import { logout } from "../../services/authService.js";
    import {
        currentUser,
        isAdmin,
        isAuthenticated
    } from "../../stores/authStore.js";

    const roleLabels = {
        ADMIN: "Администратор",
        USER: "Пользователь"
    };

    const onProfile = $derived(router.location === "/profile");
</script>

<header>
    <a class="brand" href="/" use:link>
        Управление студентами
    </a>

    <nav>
        {#if $isAuthenticated}
            <button
                    type="button"
                    onclick={() => push("/students")}
            >
                Студенты
            </button>

            {#if $isAdmin}
                <button
                        type="button"
                        onclick={() => push("/students/new")}
                >
                    Добавить студента
                </button>
            {/if}
        {/if}
    </nav>

    <div class="user">
        {#if $isAuthenticated && $currentUser}
            <a
                    class="profile"
                    href="/profile"
                    use:link
                    aria-current={onProfile ? "page" : undefined}
            >
                {$currentUser.username}

                <span class="role">
                    {roleLabels[$currentUser.role] ?? $currentUser.role}
                </span>
            </a>

            <button
                    type="button"
                    onclick={logout}
            >
                Выйти
            </button>

        {:else}
            <a href="/login" use:link>
                Войти
            </a>

            <a href="/register" use:link>
                Регистрация
            </a>
        {/if}
    </div>
</header>

<style>
    header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 1rem 2rem;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #cccccc;
    }

    .brand {
        color: #000000;
        font-size: 1.25rem;
        font-weight: bold;
        text-decoration: none;
    }

    nav {
        display: flex;
        flex: 1;
        gap: 0.75rem;
    }

    nav button {
        padding: 0.55rem 0.9rem;
        border: 1px solid #cccccc;
        border-radius: 0.375rem;
        background-color: #eeeeee;
        font: inherit;
        cursor: pointer;
    }

    nav button:hover {
        background-color: #dddddd;
    }

    .user {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .profile {
        color: #0645ad;
        text-decoration: none;
    }

    .profile:hover {
        text-decoration: underline;
    }

    .profile[aria-current="page"] {
        font-weight: bold;
        text-decoration: underline;
    }

    .role {
        margin-left: 0.5rem;
        padding: 0.125rem 0.5rem;
        border: 1px solid #cccccc;
        border-radius: 0.75rem;
        background-color: #f2f2f2;
        color: #333333;
        font-size: 0.8rem;
        font-weight: normal;
    }

    .user button {
        padding: 0.375rem 0.75rem;
        border: 1px solid #cccccc;
        border-radius: 0.375rem;
        background-color: #eeeeee;
        cursor: pointer;
    }

    .user a {
        color: #0645ad;
    }
</style>