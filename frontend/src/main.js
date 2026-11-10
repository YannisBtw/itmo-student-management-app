import { mount } from "svelte";

import App from "./App.svelte";
import { initAuth } from "./services/authService.js";
import { flash } from "./stores/flashStore.js";

initAuth({
    onSessionExpired: () => flash.set("Сессия истекла. Войдите заново")
});

const app = mount(App, {
    target: document.getElementById("app")
});

export default app;
