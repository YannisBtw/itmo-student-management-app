    <script>
        let {
            query = {},
            onfilterschange
        } = $props();


        function formatDateForInput(value) {
            if (!value) {
                return "";
            }

            const [day, month, year] = value.split("-");

            return `${year}-${month}-${day}`;
        }


        let fullName = $state(query.fullName ?? "");
        let isuId = $state(query.isuId ?? "");
        let group = $state(query.group ?? "");
        let dormitoryNumber = $state(query.dormitoryNumber ?? "");
        let roomNumber = $state(query.roomNumber ?? "");

        let moveInDate = $state(
          formatDateForInput(query.moveInDate)
        );

        let isForeign = $state(
          query.isForeign === undefined
            ? ""
            : String(query.isForeign)
        );

        let notes = $state(query.notes ?? "");

        let sortBy = $state(query.sortBy ?? "id");
        let sortDirection = $state(query.sortDirection ?? "asc");


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


        let isuInvalid = $derived(
                isuId !== "" &&
                !/^[1-9]\d{5}$/.test(String(isuId))
        );


        let dormitoryInvalid = $derived(
                dormitoryNumber !== "" &&
                (
                        !Number.isInteger(Number(dormitoryNumber)) ||
                        Number(dormitoryNumber) < 1 ||
                        Number(dormitoryNumber) > 99
                )
        );


        let roomInvalid = $derived(
                roomNumber !== "" &&
                (
                        !Number.isInteger(Number(roomNumber)) ||
                        Number(roomNumber) < 1 ||
                        Number(roomNumber) > 9999
                )
        );
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

          {#if isuInvalid}
            <span class="field-error">
              ИСУ должен состоять из 6 цифр
            </span>
          {/if}

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

          {#if dormitoryInvalid}
            <span class="field-error">
              Допустимые значения: от 1 до 99
            </span>
          {/if}

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

          {#if roomInvalid}
            <span class="field-error">
              Допустимые значения: от 1 до 9999
            </span>
          {/if}

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

    .field-error {
    color: #c62828;
    font-size: 0.8rem;
}
</style>