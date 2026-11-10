<script>
    let {
        page,
        pageSize,
        hasNext,
        onprev,
        onnext,
        onpagesizechange
    } = $props();
</script>


<div class="pagination">
    <button
            type="button"
            onclick={onprev}
            disabled={page === 0}
    >
        ← Назад
    </button>

    <span>
        Страница {page + 1}
    </span>

    <button
            type="button"
            onclick={onnext}
            disabled={!hasNext}
    >
        Вперёд →
    </button>

    <label>
        На странице:

        <select
                value={pageSize}
                onchange={(event) =>
                onpagesizechange(
                    Number(event.currentTarget.value)
                )
            }
        >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
        </select>
    </label>
</div>


<style>
    .pagination {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    button,
    select {
        padding: 0.5rem 0.75rem;
        font: inherit;
    }

    button {
        cursor: pointer;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    label {
        margin-left: auto;
    }
</style>