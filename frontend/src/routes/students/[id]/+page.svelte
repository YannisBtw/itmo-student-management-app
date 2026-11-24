<script>
  import { enhance } from "$app/forms";

  let { data, form } = $props();

  let deleting = $state(false);
</script>

<section class="card">
  <div class="toolbar">
    <h1>{data.student.fullName ?? data.student.name}</h1>
    {#if data.user?.role === "ADMIN"}
      <div class="row">
        <a href={`/students/${data.student.id}/edit`} class="button">
          Редактировать
        </a>
        <form
          method="POST"
          action="?/delete"
          use:enhance={() => {
            deleting = true;
            return async ({ update }) => {
              await update();
              deleting = false;
            };
          }}
        >
          <button type="submit" class="button danger" disabled={deleting}>
            Удалить
          </button>
        </form>
      </div>
    {/if}
  </div>

  {#if form?.error}
    <p class="error" role="alert">{form.error}</p>
  {/if}

  <dl>
    <dt>ФИО</dt>
    <dd>{data.student.fullName ?? data.student.name}</dd>
    <dt>Группа</dt>
    <dd>{data.student.groupName ?? data.student.group ?? "—"}</dd>
    <dt>Email</dt>
    <dd>{data.student.email ?? "—"}</dd>
    <dt>Телефон</dt>
    <dd>{data.student.phone ?? "—"}</dd>
  </dl>

  <a href="/students" class="button">← К списку</a>
</section>

<style>
  button.button {
    font: inherit;
  }
</style>