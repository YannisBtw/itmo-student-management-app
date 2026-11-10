import {
    Subject,
    Observable,
    debounceTime,
    distinctUntilChanged,
    switchMap,
    map,
    catchError,
    of
} from "rxjs";

import { queryStudents } from "../services/studentService.js";


function queryStudentsObservable(query) {
    return new Observable((subscriber) => {
        const controller = new AbortController();

        queryStudents(query, {
            signal: controller.signal
        })
            .then((students) => {
                if (!subscriber.closed) {
                    subscriber.next(students);
                    subscriber.complete();
                }
            })
            .catch((error) => {
                if (
                    error?.name !== "AbortError" &&
                    !subscriber.closed
                ) {
                    subscriber.error(error);
                }
            });

        return () => {
            controller.abort();
        };
    });
}


export function createStudentSearch() {
    const searchSubject = new Subject();

    const results$ = searchSubject.pipe(
        debounceTime(300),

        distinctUntilChanged(
            (previous, current) =>
                previous.fullName === current.fullName
        ),

        switchMap((query) =>
            queryStudentsObservable(query).pipe(
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

    return {
        search(query) {
            searchSubject.next(query);
        },

        results$,

        complete() {
            searchSubject.complete();
        }
    };
}