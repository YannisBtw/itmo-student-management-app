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


export function queryStudentsObservable(query) {    return new Observable((subscriber) => {
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


function queriesAreEqual(previous, current) {
    return (
        previous.fullName === current.fullName &&
        previous.isuId === current.isuId &&
        previous.group === current.group &&
        previous.dormitoryNumber === current.dormitoryNumber &&
        previous.roomNumber === current.roomNumber &&
        previous.moveInDate === current.moveInDate &&
        previous.isForeign === current.isForeign &&
        previous.notes === current.notes &&
        previous.sortBy === current.sortBy &&
        previous.sortDirection === current.sortDirection &&
        previous.page === current.page &&
        previous.size === current.size
    );
}


export function createStudentSearch() {
    const searchSubject = new Subject();

    const results$ = searchSubject.pipe(
        debounceTime(300),

        distinctUntilChanged(queriesAreEqual),

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