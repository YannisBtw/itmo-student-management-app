    <script>
        import "../app.css";

        import Header from "$lib/components/Header.svelte";

        import {navigating} from "$app/state";


        let {data, children} = $props();

        let loading = $derived(navigating.to !== null);
    </script>


{#if loading}
    <div
            class="loading-bar"
            role="progressbar"
            aria-label="Загрузка страницы"
    ></div>
{/if}


<Header user={ data.user } />


<main class="page">
      {@render children()}
    </main>


<style>
    .loading-bar {
        position: fixed;
        top: 0;
        left: 0;

        width: 100%;
        height: 4px;

        background-color: #e5e7eb;

        overflow: hidden;
        z-index: 1000;
    }

    .loading-bar::after {
        content: "";

        display: block;

        width: 35%;
        height: 100%;

        background-color: #2563eb;

        animation: loading 1s linear infinite;
    }

    @keyframes loading {
        from {
            transform: translateX(-100%);
        }

        to {
            transform: translateX(300%);
        }
    }
</style>