<script>
    import { onMount } from "svelte";
    import { link, push } from "svelte-spa-router";

    import ErrorMessage from "../../components/common/ErrorMessage.svelte";
    import Loading from "../../components/common/Loading.svelte";

    import {
        createStudent,
        getStudentById,
        updateStudent
    } from "../../services/studentService.js";

    let { params = {} } = $props();

    let isEditMode = $derived(Boolean(params.id));
    let studentId = $derived(params.id ? Number(params.id) : null);

    let form = $state({
        fullName: "",
        isuId: "",
        group: "",
        dormitoryNumber: "",
        roomNumber: "",
        moveInDate: "",
        isForeign: false,
        notes: ""
    });

    function emptyErrors() {
        return {
            fullName: "",
            isuId: "",
            group: "",
            dormitoryNumber: "",
            roomNumber: "",
            moveInDate: ""
        };
    }

    let validationErrors = $state(emptyErrors());

    let loading = $state(Boolean(params.id));
    let submitting = $state(false);
    let error = $state(null);


    async function loadStudent() {
        if (!isEditMode) {
            loading = false;
            return;
        }

        if (!Number.isInteger(studentId) || studentId <= 0) {
            error = "Некорректный идентификатор студента";
            loading = false;
            return;
        }

        try {
            const student = await getStudentById(studentId);

            form.fullName = student.fullName;
            form.isuId = student.isuId;
            form.group = student.group;
            form.dormitoryNumber = student.dormitoryNumber;
            form.roomNumber = student.roomNumber;
            form.moveInDate = student.moveInDate;
            form.isForeign = student.isForeign;
            form.notes = student.notes ?? "";
        } catch (caught) {
            error = caught;
        } finally {
            loading = false;
        }
    }


    function validate() {
        const errors = emptyErrors();

        if (!form.fullName.trim()) {
            errors.fullName = "Введите ФИО";
        }

        const isuId = Number(form.isuId);

        if (!Number.isInteger(isuId) || isuId < 100000 || isuId > 999999) {
            errors.isuId = "ИСУ должен состоять из 6 цифр";
        }

        if (!/^[A-Z][1-9][1-4][0-9]{2}$/.test(form.group)) {
            errors.group = "Пример корректной группы: P3120";
        }

        const dormitoryNumber = Number(form.dormitoryNumber);

        if (
            !Number.isInteger(dormitoryNumber) ||
            dormitoryNumber < 1 ||
            dormitoryNumber > 99
        ) {
            errors.dormitoryNumber = "Номер общежития: от 1 до 99";
        }

        const roomNumber = Number(form.roomNumber);

        if (
            !Number.isInteger(roomNumber) ||
            roomNumber < 1 ||
            roomNumber > 9999
        ) {
            errors.roomNumber = "Номер комнаты: от 1 до 9999";
        }

        if (!form.moveInDate) {
            errors.moveInDate = "Укажите дату заселения";
        } else {
            const moveInDate = new Date(form.moveInDate + "T00:00:00");

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (moveInDate >= today) {
                errors.moveInDate = "Дата заселения должна быть в прошлом";
            }
        }

        validationErrors = errors;

        return !Object.values(errors).some(Boolean);
    }


    async function handleSubmit(event) {
        event.preventDefault();

        if (submitting) {
            return;
        }

        if (!validate()) {
            return;
        }

        error = null;
        submitting = true;

        const student = {
            fullName: form.fullName.trim(),
            isuId: Number(form.isuId),
            group: form.group.trim(),
            dormitoryNumber: Number(form.dormitoryNumber),
            roomNumber: Number(form.roomNumber),
            moveInDate: form.moveInDate,
            isForeign: form.isForeign,
            notes: form.notes.trim()
        };

        try {
            let savedStudent;

            if (isEditMode) {
                savedStudent = await updateStudent(studentId, student);
            } else {
                savedStudent = await createStudent(student);
            }

            push(`/students/${savedStudent.id}`);
        } catch (caught) {
            error = caught;
        } finally {
            submitting = false;
        }
    }


    onMount(() => {
        loadStudent();
    });
</script>


<a href="/students" use:link>← К списку студентов</a>

<h1>{isEditMode ? "Редактирование студента" : "Новый студент"}</h1>


{#if loading}
    <Loading message="Загружаем данные студента..." />

{:else}
    <ErrorMessage {error} />

    <form onsubmit={handleSubmit}>

        <label>
            ФИО
            <input
                    type="text"
                    bind:value={form.fullName}
                    required
            />
        </label>

        {#if validationErrors.fullName}
            <p class="field-error">{validationErrors.fullName}</p>
        {/if}


        <label>
            ИСУ
            <input
                    type="number"
                    bind:value={form.isuId}
                    min="100000"
                    max="999999"
                    required
            />
        </label>

        {#if validationErrors.isuId}
            <p class="field-error">{validationErrors.isuId}</p>
        {/if}


        <label>
            Группа
            <input
                    type="text"
                    bind:value={form.group}
                    placeholder="P3120"
                    required
            />
        </label>

        {#if validationErrors.group}
            <p class="field-error">{validationErrors.group}</p>
        {/if}


        <label>
            Номер общежития
            <input
                    type="number"
                    bind:value={form.dormitoryNumber}
                    min="1"
                    max="99"
                    required
            />
        </label>

        {#if validationErrors.dormitoryNumber}
            <p class="field-error">
                {validationErrors.dormitoryNumber}
            </p>
        {/if}


        <label>
            Номер комнаты
            <input
                    type="number"
                    bind:value={form.roomNumber}
                    min="1"
                    max="9999"
                    required
            />
        </label>

        {#if validationErrors.roomNumber}
            <p class="field-error">
                {validationErrors.roomNumber}
            </p>
        {/if}


        <label>
            Дата заселения
            <input
                    type="date"
                    bind:value={form.moveInDate}
                    required
            />
        </label>

        {#if validationErrors.moveInDate}
            <p class="field-error">{validationErrors.moveInDate}</p>
        {/if}


        <label class="checkbox">
            <input
                    type="checkbox"
                    bind:checked={form.isForeign}
            />

            Иностранный студент
        </label>


        <label>
            Заметки

            <textarea
                    bind:value={form.notes}
                    rows="4"
            ></textarea>
        </label>


        <button type="submit" disabled={submitting}>
            {submitting
                ? "Сохраняем..."
                : isEditMode
                    ? "Сохранить изменения"
                    : "Создать студента"}
        </button>

    </form>
{/if}


<style>
    form {
        display: grid;
        gap: 1rem;
        max-width: 32rem;
        margin-top: 1.5rem;
    }

    label {
        display: grid;
        gap: 0.35rem;
    }

    input,
    textarea {
        padding: 0.6rem;
        font: inherit;
    }

    .checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .field-error {
        margin: -0.7rem 0 0;
        color: #b00020;
        font-size: 0.875rem;
    }

    button {
        width: fit-content;
        padding: 0.65rem 1rem;
        cursor: pointer;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
</style>