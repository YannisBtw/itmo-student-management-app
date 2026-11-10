<script>
    let { message = "Загрузка..." } = $props();
</script>

<div class="loading" role="status" aria-live="polite">
    <span class="spinner" aria-hidden="true"></span>
    <span>{message}</span>
</div>

<style>
    .loading {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 0;
        color: #555555;
    }

    .spinner {
        width: 1.25rem;
        height: 1.25rem;
        border: 0.18rem solid #cccccc;
        border-top-color: #555555;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
