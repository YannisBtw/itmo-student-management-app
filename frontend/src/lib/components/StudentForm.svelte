    <script>
        import {enhance} from "$app/forms";

        let {
            student = null,
            error: errorMessage = null,
            fieldErrors = {},
            submitLabel = "Сохранить",
            cancelHref = "/students"
        } = $props();

        let submitting = $state(false);
    </script>


{#if errorMessage}
    <p class="error" role="alert">
    {errorMessage}
    </p>
{/if}


<form
        method="POST"
        class="form"
use:enhance={ () => { submitting = true;

        return async ({ update }) => { try { await update({ reset: false }); } finally { submitting = false; } }; } }
>
    <label>
        ФИО

        <input
                name="fullName"
                type="text"
                value={ student?.fullName ?? "" }
                maxlength="255"
                required
        />

      {#if fieldErrors.fullName}
        <span class="field-error">
        {fieldErrors.fullName}
        </span>
      {/if}
    </label>


    <label>
        ИСУ

        <input
                name="isuId"
                type="number"
                value={ student?.isuId ?? "" }
                min="100000"
                max="999999"
                required
        />

      {#if fieldErrors.isuId}
        <span class="field-error">
        {fieldErrors.isuId}
        </span>
      {/if}
    </label>


    <label>
        Группа

        <input
                name="group"
                type="text"
                value={ student?.group ?? "" }
                pattern={ "[A-Z][1-9][1-4][0-9]{2}" }
                placeholder="P3120"
                required
        />

      {#if fieldErrors.group}
        <span class="field-error">
        {fieldErrors.group}
        </span>
      {/if}
    </label>


    <label>
        Общежитие

        <input
                name="dormitoryNumber"
                type="number"
                value={ student?.dormitoryNumber ?? "" }
                min="1"
                max="99"
                required
        />

      {#if fieldErrors.dormitoryNumber}
        <span class="field-error">
        {fieldErrors.dormitoryNumber}
        </span>
      {/if}
    </label>


    <label>
        Комната

        <input
                name="roomNumber"
                type="number"
                value={ student?.roomNumber ?? "" }
                min="1"
                max="9999"
                required
        />

      {#if fieldErrors.roomNumber}
        <span class="field-error">
        {fieldErrors.roomNumber}
        </span>
      {/if}
    </label>


    <label>
        Дата заселения

        <input
                name="moveInDate"
                type="date"
                value={ student?.moveInDate ?? "" }
                required
        />

      {#if fieldErrors.moveInDate}
        <span class="field-error">
        {fieldErrors.moveInDate}
        </span>
      {/if}
    </label>


    <label>
        Иностранец

        <select
                name="isForeign"
                value={ String(student?.isForeign ?? "") }
                required
        >
            <option value="">Выберите</option>
            <option value="true">Да</option>
            <option value="false">Нет</option>
        </select>

      {#if fieldErrors.isForeign}
        <span class="field-error">
        {fieldErrors.isForeign}
        </span>
      {/if}
    </label>


    <label>
        Заметки

        <textarea
                name="notes"
                value={ student?.notes ?? "" }
                maxlength="255"
                rows="4"
        ></textarea>

      {#if fieldErrors.notes}
        <span class="field-error">
        {fieldErrors.notes}
        </span>
      {/if}
    </label>


    <div class="row">

        <button
                type="submit"
                class="button"
                disabled={ submitting }
        >
        {submitting
                ? "Сохранение..."
                : submitLabel}
        </button>

        <a href={ cancelHref } class="button">
            Отмена
        </a>

    </div>
</form>


<style>
    .form {
        display: grid;
        gap: 1rem;
    }

    label {
        display: grid;
        gap: 0.35rem;
    }

    input,
    select,
    textarea {
        padding: 0.65rem;
        font: inherit;
    }

    .row {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .field-error {
        color: #c62828;
        font-size: 0.85rem;
    }

    button.button {
        font: inherit;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>