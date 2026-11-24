<script>
    let {
        onfilterschange
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


    function notifyFiltersChange() {
        onfilterschange?.({
            fullName: fullName.trim(),

            isuId: isuId
                ? Number(isuId)
                : undefined,

            group: group.trim(),

            dormitoryNumber: dormitoryNumber
                ? Number(dormitoryNumber)
                : undefined,

            roomNumber: roomNumber
                ? Number(roomNumber)
                : undefined,

            moveInDate:
                formatDateForBackend(moveInDate),

            isForeign:
                isForeign === ""
                    ? undefined
                    : isForeign === "true",

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

        notifyFiltersChange();
    }
</script>


<div class="filter-form">
    <div class="filters">
        <label>
            ФИО

            <input
                    type="text"
                    value={fullName}
                    placeholder="Иванов"
                    oninput={(event) => {
                        fullName = event.currentTarget.value;
                        notifyFiltersChange();
                    }}
            />
        </label>


        <label>
            ИСУ

            <input
                    type="number"
                    value={isuId}
                    placeholder="123456"
                    oninput={(event) => {
                        isuId = event.currentTarget.value;
                        notifyFiltersChange();
                    }}
            />
        </label>


        <label>
            Группа

            <input
                    type="text"
                    value={group}
                    placeholder="P3120"
                    oninput={(event) => {
                        group = event.currentTarget.value;
                        notifyFiltersChange();
                    }}
            />
        </label>


        <label>
            Общежитие

            <input
                    type="number"
                    value={dormitoryNumber}
                    oninput={(event) => {
                        dormitoryNumber =
                            event.currentTarget.value;

                        notifyFiltersChange();
                    }}
            />
        </label>


        <label>
            Комната

            <input
                    type="number"
                    value={roomNumber}
                    oninput={(event) => {
                        roomNumber =
                            event.currentTarget.value;

                        notifyFiltersChange();
                    }}
            />
        </label>


        <label>
            Дата заселения

            <input
                    type="date"
                    value={moveInDate}
                    onchange={(event) => {
                        moveInDate =
                            event.currentTarget.value;

                        notifyFiltersChange();
                    }}
            />
        </label>


        <label>
            Иностранец

            <select
                    value={isForeign}
                    onchange={(event) => {
                        isForeign =
                            event.currentTarget.value;

                        notifyFiltersChange();
                    }}
            >
                <option value="">Все</option>
                <option value="true">Да</option>
                <option value="false">Нет</option>
            </select>
        </label>


        <label>
            Заметки

            <input
                    type="text"
                    value={notes}
                    oninput={(event) => {
                        notes = event.currentTarget.value;
                        notifyFiltersChange();
                    }}
            />
        </label>


        <label>
            Сортировать по

            <select
                    value={sortBy}
                    onchange={(event) => {
                        sortBy =
                            event.currentTarget.value;

                        notifyFiltersChange();
                    }}
            >
                <option value="id">ID</option>
                <option value="fullName">ФИО</option>
                <option value="isuId">ИСУ</option>
                <option value="group">Группе</option>
                <option value="dormitoryNumber">
                    Общежитию
                </option>
                <option value="roomNumber">Комнате</option>
                <option value="moveInDate">
                    Дате заселения
                </option>
                <option value="isForeign">
                    Иностранцу
                </option>
                <option value="notes">Заметкам</option>
            </select>
        </label>


        <label>
            Направление

            <select
                    value={sortDirection}
                    onchange={(event) => {
                        sortDirection =
                            event.currentTarget.value;

                        notifyFiltersChange();
                    }}
            >
                <option value="asc">
                    По возрастанию
                </option>

                <option value="desc">
                    По убыванию
                </option>
            </select>
        </label>
    </div>


    <div class="actions">
        <button
                type="button"
                onclick={handleReset}
        >
            Сбросить
        </button>
    </div>
</div>


<style>
    .filter-form {
        margin-bottom: 1.5rem;
        padding: 1rem;
        border: 1px solid #cccccc;
        border-radius: 0.5rem;
    }

    .filters {
        display: grid;
        grid-template-columns:
            repeat(auto-fit, minmax(160px, 1fr));
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