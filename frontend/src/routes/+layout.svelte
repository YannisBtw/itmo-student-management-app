<script>
  import "../app.css";
  import Header from "$lib/components/Header.svelte";

  let { data, children } = $props();
</script>

<Header user={data.user} />

<main class="page">
  {@render children()}
</main>