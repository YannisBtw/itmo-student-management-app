<script>
  import { page } from "$app/state";
</script>

<section class="card error-page">
  {#if page.status === 404}
    <h1>Страница не найдена</h1>
    <p>Запрашиваемая страница не существует или была удалена.</p>
  {:else if page.status === 403}
    <h1>Доступ запрещён</h1>
    <p>У вас нет прав для просмотра этой страницы.</p>
  {:else if page.status === 401}
    <h1>Требуется вход</h1>
    <p>Войдите в систему, чтобы продолжить.</p>
  {:else}
    <h1>Ошибка {page.status}</h1>
    <p>{page.error?.message ?? "Что-то пошло не так."}</p>
  {/if}

  <a href="/students" class="button">На главную</a>
</section>