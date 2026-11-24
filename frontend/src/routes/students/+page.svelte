    <script>
        import { onMount } from "svelte";

        import {
            Subject,
            debounce,
            distinctUntilChanged,
            filter,
            timer,
            of
        } from "rxjs";

        import {
            goto,
            beforeNavigate,
            afterNavigate
        } from "$app/navigation";

        import { page } from "$app/state";

        import StudentTable from
                    "$lib/components/students/StudentTable.svelte";

        import StudentFilters from
                    "$lib/components/students/StudentFilters.svelte";

        import Pagination from
                    "$lib/components/students/Pagination.svelte";


        let { data } = $props();

        const filters$ = new Subject();

        let filterVersion = $state(0);

        let students = $derived(data.students);

        let query = $derived(data.query);

        let currentPage = $derived(query.page);

        let pageSize = $derived(query.size);

        let hasNext = $derived(
                students.length === pageSize
        );

        let isAdmin = $derived(
                data.user?.role === "ADMIN"
        );


        function navigateToQuery(nextQuery) {
            const params = new URLSearchParams();

            for (const [key, value] of Object.entries(nextQuery)) {
                if (
                        value !== undefined &&
                        value !== null &&
                        value !== ""
                ) {
                    params.set(key, String(value));
                }
            }

            const url = `${page.url.pathname}?${params.toString()}`;

            return goto(url, {
                keepFocus: true,
                noScroll: true
            });
        }


        function handleFiltersChange(nextFilters) {
            filters$.next(nextFilters);
        }


        function handlePrev() {
            if (currentPage === 0) {
                return;
            }

            return navigateToQuery({
                ...query,
                page: currentPage - 1
            });
        }


        function handleNext() {
            if (!hasNext) {
                return;
            }

            return navigateToQuery({
                ...query,
                page: currentPage + 1
            });
        }


        function handlePageSizeChange(nextSize) {
            return navigateToQuery({
                ...query,
                page: 0,
                size: nextSize
            });
        }


        function isOptionalInteger(value, min, max) {
            return value === undefined ||
                    (
                            Number.isInteger(value) &&
                            value >= min &&
                            value <= max
                    );
        }


        function areFiltersValid(filters) {
            return (
                    isOptionalInteger(
                            filters.isuId, 100000, 999999
                    ) &&

                    isOptionalInteger(
                            filters.dormitoryNumber, 1, 99
                    ) &&

                    isOptionalInteger(
                            filters.roomNumber, 1, 9999
                    )
            );
        }


        onMount(() => {
            const subscription = filters$.pipe(

                    debounce((filters) =>
                            filters === null
                                    ? of(0)
                                    : timer(300)
                    ),

                    distinctUntilChanged((previous, current) =>
                            previous !== null &&
                            current !== null &&
                            JSON.stringify(previous) ===
                            JSON.stringify(current)
                    ),

                    filter((filters) =>
                            filters !== null &&
                            areFiltersValid(filters)
                    )

            ).subscribe((nextFilters) => {

                navigateToQuery({
                    ...nextFilters,
                    page: 0,
                    size: pageSize
                }).catch(console.error);

            });

            return () => {
                subscription.unsubscribe();
                filters$.complete();
            };
        });
    </script>


<section>
    <div class="toolbar">
        <h1>Студенты</h1>

      {#if isAdmin}
        <a href="/students/new" class="button">
            Добавить студента
        </a>
      {/if}
    </div>

    <StudentFilters
        {query}
        onfilterschange={handleFiltersChange}
    />

    <StudentTable {students} />

    <Pagination
        page={currentPage}
{pageSize}
{hasNext}
        onprev={handlePrev}
        onnext={handleNext}
        onpagesizechange={handlePageSizeChange}
    />
</section>


<style>
    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
</style>