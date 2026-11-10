<script>
    let {
        id,
        label,
        type = "text",
        value = $bindable(""),
        error = "",
        hint = "",
        autocomplete = "off"
    } = $props();
</script>

<div class="field">
    <label for={id}>{label}</label>

    <input
        {id}
        {type}
        {value}
        {autocomplete}
        oninput={(event) => (value = event.currentTarget.value)}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? id + "-error" : undefined}
    />

    {#if error}
        <span class="error" id={id + "-error"}>{error}</span>
    {:else if hint}
        <small>{hint}</small>
    {/if}
</div>

<style>
    .field {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        margin-bottom: 1rem;
    }

    input {
        padding: 0.625rem;
        border: 1px solid #cccccc;
        border-radius: 0.375rem;
        font-size: 1rem;
    }

    input[aria-invalid="true"] {
        border-color: #b3261e;
    }

    .error {
        color: #b3261e;
        font-size: 0.875rem;
    }

    small {
        color: #666666;
    }
</style>
