import { Observable } from "rxjs";

export function fromStore(store) {
    return new Observable(function (subscriber) {
        return store.subscribe((value) => subscriber.next(value));
    });
}
