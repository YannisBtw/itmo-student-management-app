    <script>
        let {data} = $props();
    </script>

<section class="card">
    <h1>Профиль</h1>

    <dl>
        <dt>Имя пользователя</dt>
        <dd>{data.user.username}</dd>
        <dt>Роль</dt>
        <dd>{data.user.role ?? "USER"}</dd>
    </dl>

    <a href="/students" class="button">К списку студентов</a>
</section>