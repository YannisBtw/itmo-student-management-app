export function readStudentForm(form) {
    function readString(name) {
        return String(form.get(name) ?? "").trim();
    }

    function readNumber(name) {
        const value = readString(name);

        if (value === "") {
            return null;
        }

        const number = Number(value);

        return Number.isInteger(number)
            ? number
            : null;
    }

    function readBoolean(name) {
        const value = readString(name);

        if (value === "true") return true;
        if (value === "false") return false;

        return null;
    }

    return {
        fullName: readString("fullName"),
        isuId: readNumber("isuId"),
        group: readString("group"),
        dormitoryNumber: readNumber("dormitoryNumber"),
        roomNumber: readNumber("roomNumber"),
        moveInDate: readString("moveInDate") || null,
        isForeign: readBoolean("isForeign"),
        notes: readString("notes")
    };
}