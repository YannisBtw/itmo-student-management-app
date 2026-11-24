<script>
  import { goto, invalidateAll } from "$app/navigation";
  import { page } from "$app/state";

  let { data } = $props();

  let q = $state(data.query.q);
  let timer = null;

  function buildParams(overrides) {
    const params = new URLSearchParams(page.url.searchParams);
    Object.entries(overrides).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    return params.toString();
  }

  function onSearchInput(event) {
    q = event.currentTarget.value;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const qs = buildParams({ q, page: "0" });
      goto(`?${qs}`, { keepFocus: true, noScroll: true, replaceState: true });
    }, 300);
  }

  function setParam(name, value) {
    const overrides = { [name]: value };
    if (name !== "page") overrides.page = "0";
    const qs = buildParams(overrides);
    goto(`?${qs}`, { keepFocus: true, noScroll: true });
  }

  let students = $derived(
    Array.isArray(data.students)
      ? data.students
      : data.students?.content ?? []
  );
  let totalElements = $derived(data.students?.totalElements ?? students.length);
  let totalPages = $derived(data.students?.totalPages ?? 1);
  let currentPage = $derived(Number(data.query.page) || 0);
</script>

<section>
  <div class="toolbar">
    <h1>Студенты</h1>
    {#if data.user?.role === "ADMIN"}
      <a href="/students/new" class="button">Добавить</a>
    {/if}
  </div>

  <div class="filters">
    <input
      type="search"
      placeholder="Поиск по ФИО"
      value={q}
      oninput={onSearchInput}
    />
    <select
      value={data.query.sort}
      onchange={(e) => setParam("sort", e.currentTarget.value)}
    >
      <option value="">Без сортировки</option>
      <option value="fullName">По ФИО</option>
      <option value="groupName">По группе</option>
    </select>
    <select
      value={data.query.order}
      onchange={(e) => setParam("order", e.currentTarget.value)}
    >
      <option value="">Порядок</option>
      <option value="asc">По возрастанию</option>
      <option value="desc">По убыванию</option>
    </select>
  </div>

  {#if students.length === 0}
    <p class="hint">Студентов не найдено</p>
  {:else}
    <ul class="list">
      {#each students as s (s.id)}
        <li>
          <a href={`/students/${s.id}`}>{s.fullName ?? s.name}</a>
          <span>{s.groupName ?? s.group ?? ""}</span>
        </li>
      {/each}
    </ul>

    <div class="pager">
      <button
        disabled={currentPage <= 0}
        onclick={() => setParam("page", String(currentPage - 1))}
      >Назад</button>
      <span>
        Страница {currentPage + 1} из {totalPages} · всего {totalElements}
      </span>
      <button
        disabled={currentPage + 1 >= totalPages}
        onclick={() => setParam("page", String(currentPage + 1))}
      >Вперёд</button>
    </div>
  {/if}
</section>