    <script>
        import {page} from "$app/state";

        let {user} = $props();

        let isAdmin = $derived(user?.role === "ADMIN");
    </script>

<header class="header">
    <a class="brand" href="/students">Студенты</a>

    <nav class="nav">
      {#if user}
        <a
                href="/students"
                aria-current={ page.url.pathname.startsWith("/students") ? "page" : undefined }
        >Список</a>
      {#if isAdmin}
        <a
                href="/students/new"
                aria-current={ page.url.pathname === "/students/new" ? "page" : undefined }
        >Добавить</a>
      {/if}
        <a
                href="/profile"
                aria-current={ page.url.pathname === "/profile" ? "page" : undefined }
        >Профиль</a>
      {:else}
        <a href="/login">Вход</a>
        <a href="/register">Регистрация</a>
      {/if}
    </nav>

  {#if user}
    <form method="POST" action="/profile?/logout" class="logout">
        <span class="user">{ user.username }{#if isAdmin} · ADMIN{/if}</span>
        <button type="submit">Выйти</button>
    </form>
  {/if}
</header>

<style>
  .header {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 14px 24px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
    position: sticky;
    top: 0;
    z-index: 10;
    flex-wrap: wrap;
  }

  .brand {
    font-weight: 600;
    color: var(--text-h);
    text-decoration: none;
    font-size: 18px;
  }

  .nav {
    display: flex;
    gap: 16px;
    flex: 1;
    flex-wrap: wrap;
  }

  .nav a {
    color: var(--text);
    text-decoration: none;
    font-size: 15px;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background 0.2s, color 0.2s;
  }

  .nav a:hover {
    color: var(--text-h);
    background: var(--accent-bg);
  }

  .nav a[aria-current="page"] {
    color: var(--accent);
    background: var(--accent-bg);
  }

  .logout {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
  }

  .user {
    font-size: 14px;
    color: var(--text);
  }

  .logout button {
    font: inherit;
    font-size: 14px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text-h);
    cursor: pointer;
  }

  .logout button:hover {
    border-color: var(--accent-border);
    color: var(--accent);
  }

  @media (max-width: 1024px) {
    .header {
      padding: 12px 16px;
      gap: 12px;
    }
    .user {
      display: none;
    }
  }
</style>