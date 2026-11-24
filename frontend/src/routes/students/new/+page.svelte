<script>
  import StudentForm from "$lib/components/StudentForm.svelte";

  let { form } = $props();
</script>

<section class="card">
  <h1>Новый студент</h1>
  <StudentForm
    error={form?.error}
    submitLabel="Создать"
    cancelHref="/students"
  />
</section>