<script>
    import StudentRow from "./StudentRow.svelte";

    let { students = [] } = $props();
</script>

{#if students.length === 0}
    <p>Студенты не найдены.</p>
{:else}
    <table>
        <thead>
        <tr>
            <th>ФИО</th>
            <th>ИСУ</th>
            <th>Группа</th>
            <th>Общежитие</th>
            <th>Комната</th>
            <th>Дата заселения</th>
            <th>Иностранец</th>
            <th>Действия</th>
        </tr>
        </thead>

        <tbody>
        {#each students as student (student.id)}
            <StudentRow {student} />
        {/each}
        </tbody>
    </table>
{/if}

<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th {
        padding: 0.75rem;
        border: 1px solid #cccccc;
        background-color: #f2f2f2;
        text-align: left;
    }
</style>