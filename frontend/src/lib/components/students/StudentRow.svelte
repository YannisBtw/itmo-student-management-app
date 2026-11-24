    <script>
        let {student} = $props();


        function formatDate(value) {
            if (!value) {
                return "";
            }

            const [year, month, day] = value.split("-");

            return `${day}-${month}-${year}`;
        }
    </script>


<tr>
    <td>{student.fullName}</td>
    <td>{student.isuId}</td>
    <td>{student.group}</td>
    <td>{student.dormitoryNumber}</td>
    <td>{student.roomNumber}</td>
    <td>{formatDate(student.moveInDate)}</td>
    <td>{student.isForeign ? "Да" : "Нет"}</td>

    <td>
        <a href={ `/students/${student.id}` }>
            Подробнее
        </a>
    </td>
</tr>


<style>
    td {
        padding: 0.75rem;
        border: 1px solid #cccccc;
        text-align: left;
    }

    a {
        display: inline-block;
        padding: 0.45rem 0.75rem;
        cursor: pointer;
    }
</style>