<script>
    import { onMount } from "svelte";

    import StudentTable
        from "../../components/students/StudentTable.svelte";
    import StudentFilters
        from "../../components/students/StudentFilters.svelte";
    import Pagination
        from "../../components/students/Pagination.svelte";

    import ErrorMessage
        from "../../components/common/ErrorMessage.svelte";
    import Loading
        from "../../components/common/Loading.svelte";

    import {
        queryStudents
    } from "../../services/studentService.js";

    import {
        createStudentSearch
    } from "../../rx/studentSearch.js";


    let students = $state([]);
    let loading = $state(true);
    let error = $state(null);

    let page = $state(0);
    let pageSize = $state(20);

    let filters = $state({
        sortBy: "id",
        sortDirection: "asc"
    });

    const studentSearch = createStudentSearch();

    let hasNext = $derived(
        students.length === pageSize
    );


    async function loadStudents() {
        loading = true;
        error = null;

        try {
            students = await queryStudents({
                ...filters,
                page,
                size: pageSize
            });
        } catch (caught) {
            console.error(
                "QUERY STUDENTS ERROR:",
                caught
            );

            error = caught;
        } finally {
            loading = false;
        }
    }


    function handleApplyFilters(nextFilters) {
        filters = nextFilters;
        page = 0;

        loadStudents();
    }


    function handleResetFilters() {
        filters = {
            sortBy: "id",
            sortDirection: "asc"
        };

        page = 0;

        loadStudents();
    }


    function handlePreviousPage() {
        if (page === 0) {
            return;
        }

        page -= 1;

        loadStudents();
    }


    function handleNextPage() {
        if (!hasNext) {
            return;
        }

        page += 1;

        loadStudents();
    }


    function handlePageSizeChange(size) {
        pageSize = size;
        page = 0;

        loadStudents();
    }


    function handleSearch(fullName) {
        filters = {
            ...filters,
            fullName: fullName.trim()
        };

        page = 0;

        loading = true;
        error = null;

        studentSearch.search({
            ...filters,
            page,
            size: pageSize
        });
    }


    onMount(() => {
        const subscription =
            studentSearch.results$.subscribe((result) => {
                if (result.error) {
                    error = result.error;
                } else {
                    students = result.students;
                    error = null;
                }

                loading = false;
            });

        loadStudents();

        return () => {
            subscription.unsubscribe();
            studentSearch.complete();
        };
    });
</script>


<h1>Студенты</h1>


<StudentFilters
        onapply={handleApplyFilters}
        onreset={handleResetFilters}
        onsearch={handleSearch}
/>


{#if loading}
    <Loading message="Загружаем студентов..." />

{:else if error}
    <ErrorMessage
            {error}
            onretry={loadStudents}
    />

{:else}
    <StudentTable {students} />

    <Pagination
            {page}
            {pageSize}
            {hasNext}
            onprev={handlePreviousPage}
            onnext={handleNextPage}
            onpagesizechange={handlePageSizeChange}
    />
{/if}