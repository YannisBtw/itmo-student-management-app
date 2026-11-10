<script>
    import { link } from "svelte-spa-router";

    import AuthCard from "../../components/auth/AuthCard.svelte";
</script>

<AuthCard title="Недостаточно прав">
    <p>Это действие доступно только администратору.</p>
    <p><a href="/" use:link>Перейти к списку студентов</a></p>
</AuthCard>
