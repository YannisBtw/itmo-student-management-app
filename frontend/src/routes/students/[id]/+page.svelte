    <script>
        import { enhance } from "$app/forms";

        let { data, form } = $props();

        let student = $derived(data.student);

        let isAdmin = $derived(
                data.user?.role === "ADMIN"
        );

        let deleting = $state(false);


        function formatDate(value) {
            if (!value) {
                return "—";
            }

            const [year, month, day] = value.split("-");

            return `${day}-${month}-${year}`;
        }
    </script>


<section class="card">

    <div class="toolbar">
        <h1>{student.fullName}</h1>

      {#if isAdmin}
        <div class="row">

            <a
                    href={`/students/${student.id}/edit`}
                    class="button"
            >
                Редактировать
            </a>

            <form
                    method="POST"
                    action="?/delete"
            use:enhance={({ cancel }) => {

            if (!confirm("Удалить студента?")) {
            cancel();
                            return;
            }

                        deleting = true;

                        return async ({ update }) => {
            try {
            await update();
            } finally {
            deleting = false;
            }
            };
            }}
            >
                <button
                        type="submit"
                        class="button danger"
                        disabled={deleting}
                >
                {deleting
                            ? "Удаление..."
                            : "Удалить"}
                </button>
            </form>

        </div>
      {/if}
    </div>


  {#if form?.error}
    <p class="error" role="alert">
    {form.error}
    </p>
  {/if}


    <dl>
        <dt>ФИО</dt>
        <dd>{student.fullName}</dd>

        <dt>ИСУ</dt>
        <dd>{student.isuId}</dd>

        <dt>Группа</dt>
        <dd>{student.group}</dd>

        <dt>Общежитие</dt>
        <dd>{student.dormitoryNumber}</dd>

        <dt>Комната</dt>
        <dd>{student.roomNumber}</dd>

        <dt>Дата заселения</dt>
        <dd>{formatDate(student.moveInDate)}</dd>

        <dt>Иностранец</dt>
        <dd>{student.isForeign ? "Да" : "Нет"}</dd>

        <dt>Заметки</dt>
        <dd>{student.notes || "—"}</dd>
    </dl>


    <a href="/students" class="button">
        ← К списку студентов
    </a>

</section>


<style>
    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    dt {
        font-weight: 600;
        margin-top: 1rem;
    }

    dd {
        margin-left: 0;
        margin-top: 0.25rem;
        overflow-wrap: anywhere;
    }

    dl {
        margin-bottom: 1.5rem;
    }

    button.button {
        font: inherit;
    }
</style>