<script>
    let {
        onapply,
        onreset,
        onsearch
    } = $props();

    let fullName = $state("");
    let isuId = $state("");
    let group = $state("");
    let dormitoryNumber = $state("");
    let roomNumber = $state("");
    let moveInDate = $state("");
    let isForeign = $state("");
    let notes = $state("");

    let sortBy = $state("id");
    let sortDirection = $state("asc");


    function formatDateForBackend(value) {
        if (!value) {
            return undefined;
        }

        const [year, month, day] = value.split("-");

        return `${day}-${month}-${year}`;
    }


    function handleSubmit(event) {
        event.preventDefault();

        onapply?.({
            fullName: fullName.trim(),
            isuId: isuId ? Number(isuId) : undefined,
            group: group.trim(),
            dormitoryNumber: dormitoryNumber
                ? Number(dormitoryNumber)
                : undefined,
            roomNumber: roomNumber
                ? Number(roomNumber)
                : undefined,
            moveInDate: formatDateForBackend(moveInDate),
            isForeign: isForeign || undefined,
            notes: notes.trim(),
            sortBy,
            sortDirection
        });
    }


    function handleReset() {
        fullName = "";
        isuId = "";
        group = "";
        dormitoryNumber = "";
        roomNumber = "";
        moveInDate = "";
        isForeign = "";
        notes = "";

        sortBy = "id";
        sortDirection = "asc";

        onreset?.();
    }
</script>


<form onsubmit={handleSubmit}>
    <div class="filters">
        <label>
            ФИО

            <input
                    type="text"
                    bind:value={fullName}
                    placeholder="Иванов"
                    oninput={(event) =>
            onsearch?.(event.currentTarget.value)
        }
            />
        </label>

        <label>
            ИСУ
            <input
                    type="number"
                    bind:value={isuId}
                    placeholder="123456"
            />
        </label>

        <label>
            Группа
            <input
                    type="text"
                    bind:value={group}
                    placeholder="P3120"
            />
        </label>

        <label>
            Общежитие
            <input
                    type="number"
                    bind:value={dormitoryNumber}
            />
        </label>

        <label>
            Комната
            <input
                    type="number"
                    bind:value={roomNumber}
            />
        </label>

        <label>
            Дата заселения
            <input
                    type="date"
                    bind:value={moveInDate}
            />
        </label>

        <label>
            Иностранец
            <select bind:value={isForeign}>
                <option value="">Все</option>
                <option value="true">Да</option>
                <option value="false">Нет</option>
            </select>
        </label>

        <label>
            Заметки
            <input
                    type="text"
                    bind:value={notes}
            />
        </label>

        <label>
            Сортировать по
            <select bind:value={sortBy}>
                <option value="id">ID</option>
                <option value="fullName">ФИО</option>
                <option value="isuId">ИСУ</option>
                <option value="group">Группе</option>
                <option value="dormitoryNumber">Общежитию</option>
                <option value="roomNumber">Комнате</option>
                <option value="moveInDate">Дате заселения</option>
                <option value="isForeign">Иностранцу</option>
                <option value="notes">Заметкам</option>
            </select>
        </label>

        <label>
            Направление
            <select bind:value={sortDirection}>
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
            </select>
        </label>
    </div>

    <div class="actions">
        <button type="submit">
            Применить
        </button>

        <button
                type="button"
                onclick={handleReset}
        >
            Сбросить
        </button>
    </div>
</form>


<style>
    form {
        margin-bottom: 1.5rem;
        padding: 1rem;
        border: 1px solid #cccccc;
        border-radius: 0.5rem;
    }

    .filters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1rem;
    }

    label {
        display: grid;
        gap: 0.35rem;
    }

    input,
    select {
        padding: 0.5rem;
        font: inherit;
    }

    .actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;
    }

    button {
        padding: 0.5rem 0.8rem;
        cursor: pointer;
    }
</style>