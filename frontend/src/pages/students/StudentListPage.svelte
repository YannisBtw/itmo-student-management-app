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

    import {
        createStudentLiveUpdates
    } from "../../rx/studentLiveUpdates.js";


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


    function handleFiltersChange(nextFilters) {
        filters = nextFilters;
        page = 0;

        loading = true;
        error = null;

        studentSearch.search({
            ...filters,
            page,
            size: pageSize
        });
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


    onMount(() => {
        const searchSubscription =
            studentSearch.results$.subscribe((result) => {
                if (result.error) {
                    error = result.error;
                } else {
                    students = result.students;
                    error = null;
                }

                loading = false;
            });


        const liveSubscription =
            createStudentLiveUpdates(() => ({
                ...filters,
                page,
                size: pageSize
            })).subscribe((result) => {
                if (result.error) {
                    console.error(
                        "LIVE STUDENTS UPDATE ERROR:",
                        result.error
                    );

                    return;
                }

                students = result.students;
            });


        loadStudents();


        return () => {
            searchSubscription.unsubscribe();
            liveSubscription.unsubscribe();
            studentSearch.complete();
        };
    });
</script>


<h1>Студенты</h1>


<StudentFilters
        onfilterschange={handleFiltersChange}
/>


{#if loading}
    <Loading
            message="Загружаем студентов..."
    />

{:else if error}
    <ErrorMessage
            {error}
            onretry={loadStudents}
    />

{:else}
    <StudentTable
            {students}
    />

    <Pagination
            {page}
            {pageSize}
            {hasNext}
            onprev={handlePreviousPage}
            onnext={handleNextPage}
            onpagesizechange={handlePageSizeChange}
    />
{/if}