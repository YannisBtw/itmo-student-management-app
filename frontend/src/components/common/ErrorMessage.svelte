<script>
    import { getErrorMessage } from "../../services/api.js";

    let { error = null, message = "", onretry = null } = $props();

    const text = $derived(
        message || (typeof error === "string" ? error : error ? getErrorMessage(error) : "")
    );
</script>

{#if text}
    <div class="error-message" role="alert">
        <span>{text}</span>

        {#if onretry}
            <button type="button" onclick={onretry}>Повторить</button>
        {/if}
    </div>
{/if}

<style>
    .error-message {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin: 0 0 1rem;
        padding: 0.75rem 1rem;
        border: 1px solid #f5c2c0;
        border-radius: 0.375rem;
        background-color: #fdecea;
        color: #8a1f17;
    }

    button {
        padding: 0.375rem 0.75rem;
        border: 1px solid #cccccc;
        border-radius: 0.375rem;
        background-color: #eeeeee;
        cursor: pointer;
    }
</style>
