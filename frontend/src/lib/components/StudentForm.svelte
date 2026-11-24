<script>
  let {
    student = null,
    error: errorMessage = null,
    submitLabel = "Сохранить",
    cancelHref = "/students"
  } = $props();
</script>

{#if errorMessage}
  <p class="error" role="alert">{errorMessage}</p>
{/if}

<form method="POST" class="form">
  <label>
    ФИО
    <input
      name="fullName"
      type="text"
      value={student?.fullName ?? student?.name ?? ""}
      required
    />
  </label>
  <label>
    Группа
    <input
      name="groupName"
      type="text"
      value={student?.groupName ?? student?.group ?? ""}
    />
  </label>
  <label>
    Email
    <input name="email" type="email" value={student?.email ?? ""} />
  </label>
  <label>
    Телефон
    <input name="phone" type="tel" value={student?.phone ?? ""} />
  </label>

  <div class="row">
    <button type="submit" class="button">{submitLabel}</button>
    <a href={cancelHref} class="button">Отмена</a>
  </div>
</form>

<style>
  button.button {
    font: inherit;
  }
</style>