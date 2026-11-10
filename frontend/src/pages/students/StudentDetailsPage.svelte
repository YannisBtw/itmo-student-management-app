<script>
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";

    import ErrorMessage from "../../components/common/ErrorMessage.svelte";
    import Loading from "../../components/common/Loading.svelte";

    import {
        deleteStudent,
        getStudentById
    } from "../../services/studentService.js";
    import { isAdmin } from "../../stores/authStore.js";

    let { params = {} } = $props();

    let student = $state(null);
    let loading = $state(true);
    let error = $state(null);
    let deleting = $state(false);

    let studentId = $derived(Number(params.id));

    async function loadStudent() {
        loading = true;
        error = null;

        if (!Number.isInteger(studentId) || studentId <= 0) {
            error = "Некорректный идентификатор студента";
            loading = false;
            return;
        }

        try {
            student = await getStudentById(studentId);
        } catch (caught) {
            error = caught;
        } finally {
            loading = false;
        }
    }


    async function handleDelete() {
        if (!student || deleting) {
            return;
        }

        const confirmed = window.confirm(
            `Удалить студента "${student.fullName}"?`
        );

        if (!confirmed) {
            return;
        }

        deleting = true;
        error = null;

        try {
            await deleteStudent(student.id);

            push("/students");
        } catch (caught) {
            error = caught;
        } finally {
            deleting = false;
        }
    }

    onMount(() => {
        loadStudent();
    });
</script>

<button
        type="button"
        class="back-button"
        onclick={() => push("/students")}
>
    ← К списку студентов
</button>

<h1>Информация о студенте</h1>

{#if loading}
    <Loading message="Загружаем данные студента..." />

{:else if error}
    <ErrorMessage {error} onretry={loadStudent} />

{:else if student}
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
        <dd>{student.moveInDate}</dd>

        <dt>Иностранец</dt>
        <dd>{student.isForeign ? "Да" : "Нет"}</dd>

        <dt>Заметки</dt>
        <dd>{student.notes || "Нет"}</dd>
    </dl>

    {#if $isAdmin}
        <div class="actions">
            <button
                    type="button"
                    onclick={() => push(`/students/${student.id}/edit`)}
            >
                Редактировать
            </button>

            <button
                    type="button"
                    onclick={handleDelete}
                    disabled={deleting}
            >
                {deleting ? "Удаляем..." : "Удалить"}
            </button>
        </div>
    {/if}
{/if}

<style>
    dl {
        max-width: 40rem;
    }

    dt {
        margin-top: 1rem;
        color: #666666;
        font-size: 0.875rem;
    }

    dd {
        margin: 0.25rem 0 0;
        font-size: 1.05rem;
    }

    .back-button {
        margin-bottom: 1rem;
        padding: 0.5rem 0.75rem;
        border: 1px solid #cccccc;
        border-radius: 0.375rem;
        background-color: #eeeeee;
        cursor: pointer;
        font: inherit;
    }

    .back-button:hover {
        background-color: #dddddd;
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 1.5rem;
    }

    .actions button {
        padding: 0.55rem 0.9rem;
        cursor: pointer;
    }

    .actions button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
</style>