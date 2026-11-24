    <script>
        import StudentForm from
                    "$lib/components/StudentForm.svelte";

        let {form} = $props();
    </script>


<section class="card">

    <h1>Новый студент</h1>{ form?.values ?? null }
    error={ form?.error }
    fieldErrors={ form?.fieldErrors ?? {} }
    submitLabel="Создать"
    cancelHref="/students"
    />

</section>