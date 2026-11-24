<script>
  import { page } from "$app/state";

  let { form } = $props();
</script>

<section class="card">
  <h1>Вход</h1>

  {#if page.url.searchParams.get("redirect")}
    <p class="hint">Войдите, чтобы продолжить</p>
  {/if}

  {#if form?.error}
    <p class="error" role="alert">{form.error}</p>
  {/if}

  <form method="POST">
    <label>
      Логин или email
      <input
        name="usernameOrEmail"
        type="text"
        autocomplete="username"
        value={form?.usernameOrEmail ?? ""}
        required
      />
    </label>
    <label>
      Пароль
      <input
        name="password"
        type="password"
        autocomplete="current-password"
        required
      />
    </label>
    <button type="submit" class="button">Войти</button>
  </form>

  <p class="hint">Нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
</section>