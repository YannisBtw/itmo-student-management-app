import { EMPTY, throwError, timer } from "rxjs";
import {
    catchError,
    distinctUntilChanged,
    map,
    retry,
    switchMap
} from "rxjs/operators";

import { getTokenExpiresAtMs } from "../services/jwt.js";
import { fromStore } from "./fromStore.js";


const REFRESH_MARGIN_MS = 30_000;
const RETRY_DELAY_MS = 10_000;
const MAX_RETRIES = 3;


export function startSessionWatcher({ authStore, refresh$, onSessionExpired }) {
    return fromStore(authStore).pipe(
        map((state) => state.accessToken),
        distinctUntilChanged(),

        switchMap(function (accessToken) {
            const expiresAt = accessToken ? getTokenExpiresAtMs(accessToken) : null;

            if (!expiresAt) {
                return EMPTY;
            }

            const delay = Math.max(expiresAt - Date.now() - REFRESH_MARGIN_MS, 0);

            return timer(delay).pipe(
                switchMap(() => refresh$.pipe(
                    retry({
                        count: MAX_RETRIES,
                        delay: (error) => error?.status === 401
                            ? throwError(() => error)
                            : timer(RETRY_DELAY_MS)
                    })
                )),
                catchError(function (error) {
                    if (error?.status === 401) {
                        onSessionExpired();
                    }

                    return EMPTY;
                })
            );
        })
    ).subscribe();
}
