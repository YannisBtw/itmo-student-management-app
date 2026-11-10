<script>
    import { get } from "svelte/store";
    import Router, { replace } from "svelte-spa-router";

    import Header from "./components/common/Header.svelte";
    import { handleConditionsFailed, routes } from "./router/router.js";
    import { isAuthenticated } from "./stores/authStore.js";

    let wasAuthenticated = get(isAuthenticated);

    $effect(() => {
        const current = $isAuthenticated;

        if (wasAuthenticated && !current) {
            replace("/login");
        }

        wasAuthenticated = current;
    });
</script>

<Header />

<main>
    <Router {routes} onConditionsFailed={handleConditionsFailed} />
</main>

<style>
    :global(body) {
        margin: 2.5rem;
        font-family: Arial, sans-serif;
    }

    :global(*) {
        box-sizing: border-box;
    }
</style>
