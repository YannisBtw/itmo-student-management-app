<script>
    import { link } from "svelte-spa-router";

    import AuthCard from "../../components/auth/AuthCard.svelte";
</script>

<AuthCard title="Страница не найдена">
    <p>Такой страницы не существует или она была удалена.</p>
    <p><a href="/" use:link>Перейти к списку студентов</a></p>
</AuthCard>
