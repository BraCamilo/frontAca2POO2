const studentsBody = document.querySelector("#studentsBody");
const studentForm = document.querySelector("#studentForm");
const searchForm = document.querySelector("#searchForm");
const clearSearch = document.querySelector("#clearSearch");

async function loadStudents(path = "/estudiantes") {
  try {
    const students = await apiRequest(path);
    studentsBody.innerHTML = students.map((student) => `
      <tr>
        <td>${student.ordenInscripcion ?? ""}</td>
        <td>${student.nombre}</td>
        <td>${student.correo ?? ""}</td>
        <td>${student.curso ?? ""}</td>
        <td><button class="danger" data-id="${student.id}">Eliminar</button></td>
      </tr>
    `).join("");
  } catch (error) {
    showMessage(error.message, true);
  }
}

studentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await apiRequest("/estudiantes", {
      method: "POST",
      body: JSON.stringify(formDataToObject(studentForm))
    });
    studentForm.reset();
    showMessage("Estudiante agregado a la lista");
    loadStudents();
  } catch (error) {
    showMessage(error.message, true);
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const { nombre } = formDataToObject(searchForm);
  loadStudents(`/estudiantes/buscar?nombre=${encodeURIComponent(nombre)}`);
});

clearSearch.addEventListener("click", () => {
  searchForm.reset();
  loadStudents();
});

studentsBody.addEventListener("click", async (event) => {
  if (!event.target.matches("button[data-id]")) {
    return;
  }
  try {
    await apiRequest(`/estudiantes/${event.target.dataset.id}`, { method: "DELETE" });
    showMessage("Estudiante eliminado. Lista actualizada");
    loadStudents();
  } catch (error) {
    showMessage(error.message, true);
  }
});

loadStudents();
