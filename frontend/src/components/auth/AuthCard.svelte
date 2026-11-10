<script>
    let { title, children } = $props();
</script>

<section class="card">
    <h1>{title}</h1>

    {@render children?.()}
</section>

<style>
    .card {
        width: 100%;
        max-width: 28rem;
        margin: 2rem auto;
        padding: 1.5rem;
        border: 1px solid #cccccc;
        border-radius: 0.5rem;
    }

    h1 {
        margin: 0 0 1.5rem;
        font-size: 1.5rem;
    }

    .card :global(form) {
        max-width: none;
    }

    .card :global(fieldset) {
        margin: 0;
        padding: 0;
        border: none;
    }

    .card :global(button[type="submit"]) {
        width: 100%;
        padding: 0.625rem 1rem;
        border: 1px solid #cccccc;
        border-radius: 0.375rem;
        background-color: #eeeeee;
        font-size: 1rem;
        cursor: pointer;
    }

    .card :global(button[type="submit"]:disabled) {
        cursor: not-allowed;
        opacity: 0.6;
    }

    .card :global(.alt) {
        margin: 1rem 0 0;
        text-align: center;
    }

    .card :global(.notice) {
        margin: 0 0 1rem;
        padding: 0.75rem 1rem;
        border: 1px solid #b6d4fe;
        border-radius: 0.375rem;
        background-color: #e7f1ff;
        color: #084298;
    }

    .card :global(a) {
        color: #0645ad;
    }
</style>
