<script>
  import StudentForm from "$lib/components/StudentForm.svelte";

  let { data, form } = $props();
</script>

<section class="card">
  <h1>Редактирование</h1>
  <StudentForm
    student={data.student}
    error={form?.error}
    submitLabel="Сохранить"
    cancelHref={`/students/${data.student.id}`}
  />
</section>