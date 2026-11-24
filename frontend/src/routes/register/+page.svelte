<script>
  let { form } = $props();
</script>

<section class="card">
  <h1>Регистрация</h1>

  {#if form?.error}
    <p class="error" role="alert">{form.error}</p>
  {/if}

  <form method="POST">
    <label>
      Имя пользователя
      <input
        name="username"
        type="text"
        autocomplete="username"
        value={form?.username ?? ""}
        required
      />
    </label>
    <label>
      Email
      <input
        name="email"
        type="email"
        autocomplete="email"
        value={form?.email ?? ""}
        required
      />
    </label>
    <label>
      Пароль
      <input
        name="password"
        type="password"
        autocomplete="new-password"
        minlength="6"
        required
      />
    </label>
    <button type="submit" class="button">Зарегистрироваться</button>
  </form>

  <p class="hint">Уже есть аккаунт? <a href="/login">Войти</a></p>
</section>