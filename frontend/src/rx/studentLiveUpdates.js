import {
    fromEvent,
    merge,
    timer,
    switchMap,
    map,
    catchError,
    of
} from "rxjs";

import {
    queryStudentsObservable
} from "./studentSearch.js";


export function createStudentLiveUpdates(
    getQuery,
    intervalMs = 2000
) {
    const timer$ = timer(intervalMs, intervalMs);

    const focus$ = fromEvent(window, "focus");

    return merge(
        timer$,
        focus$
    ).pipe(
        switchMap(() =>
            queryStudentsObservable(getQuery()).pipe(
                map((students) => ({
                    students,
                    error: null
                })),

                catchError((error) =>
                    of({
                        students: null,
                        error
                    })
                )
            )
        )
    );
}