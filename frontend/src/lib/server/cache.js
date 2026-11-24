const cache = new Map();

const TTL = 30000;

const MAX_ENTRIES = 300;

let generation = 0;


export async function getCached(key, loader) {

    const entry = cache.get(key);

    if (entry) {
        if (Date.now() < entry.expiresAt) {
            console.log("[CACHE] HIT");
            return entry.data;
        }

        cache.delete(key);
    }

    const currentGeneration = generation;

    console.log("[CACHE] MISS");
    const data = await loader();

    if (currentGeneration !== generation) {
        return data;
    }

    if (cache.size >= MAX_ENTRIES) {
        const oldestKey = cache.keys().next().value;

        cache.delete(oldestKey);
    }

    cache.set(key, {
        data,
        expiresAt: Date.now() + TTL
    });

    return data;
}


export function clearCache() {
    generation++;
    console.log("[CACHE] INVALIDATED");
    cache.clear();
}