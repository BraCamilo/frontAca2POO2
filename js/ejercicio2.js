const actionsBody = document.querySelector("#actionsBody");
const actionForm = document.querySelector("#actionForm");
const undoButton = document.querySelector("#undoButton");

async function loadActions() {
  try {
    const actions = await apiRequest("/acciones");
    actionsBody.innerHTML = actions.map((action, index) => `
      <tr>
        <td><span class="badge">${index === 0 ? "Cima" : index + 1}</span></td>
        <td>${action.tipo}</td>
        <td>${action.descripcion}</td>
        <td>${action.fechaRegistro ? new Date(action.fechaRegistro).toLocaleString() : ""}</td>
      </tr>
    `).join("");
  } catch (error) {
    showMessage(error.message, true);
  }
}

actionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await apiRequest("/acciones", {
      method: "POST",
      body: JSON.stringify(formDataToObject(actionForm))
    });
    actionForm.reset();
    showMessage("Accion apilada correctamente");
    loadActions();
  } catch (error) {
    showMessage(error.message, true);
  }
});

undoButton.addEventListener("click", async () => {
  try {
    const action = await apiRequest("/acciones/deshacer", { method: "POST" });
    showMessage(`Ultima accion eliminada: ${action.tipo} - ${action.descripcion}`);
    loadActions();
  } catch (error) {
    showMessage(error.message, true);
  }
});

loadActions();
