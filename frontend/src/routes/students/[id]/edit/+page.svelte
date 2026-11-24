    <script>
        import StudentForm from
                    "$lib/components/StudentForm.svelte";

        let {data, form} = $props();
    </script>


<section class="card">

    <h1>Редактирование студента</h1>{ form?.values ?? data.student }
    error={ form?.error }
    fieldErrors={ form?.fieldErrors ?? {} }
    submitLabel="Сохранить"
    cancelHref={ `/students/${data.student.id}` }
    />

</section>