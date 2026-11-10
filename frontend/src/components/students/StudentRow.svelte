<script>
    import { push } from "svelte-spa-router";
    let { student } = $props();
</script>

<tr>
    <td>{student.fullName}</td>
    <td>{student.isuId}</td>
    <td>{student.group}</td>
    <td>{student.dormitoryNumber}</td>
    <td>{student.roomNumber}</td>
    <td>{student.moveInDate}</td>
    <td>{student.isForeign ? "Да" : "Нет"}</td>
    <td>
        <button
                type="button"
                onclick={() => push(`/students/${student.id}`)}
        >
            Подробнее
        </button>
    </td>
</tr>

<style>
    td {
        padding: 0.75rem;
        border: 1px solid #cccccc;
        text-align: left;
    }

    button {
        padding: 0.45rem 0.75rem;
        cursor: pointer;
    }
</style>