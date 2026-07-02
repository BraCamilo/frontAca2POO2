const participantsBody = document.querySelector("#participantsBody");
const participantForm = document.querySelector("#participantForm");

async function loadParticipants() {
  try {
    const participants = await apiRequest("/participantes");
    participantsBody.innerHTML = participants.map((participant) => `
      <tr>
        <td>${participant.nombre}</td>
        <td>${participant.correo}</td>
        <td>${participant.empresa ?? ""}</td>
        <td><button class="danger" data-id="${participant.id}">Eliminar</button></td>
      </tr>
    `).join("");
  } catch (error) {
    showMessage(error.message, true);
  }
}

participantForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await apiRequest("/participantes", {
      method: "POST",
      body: JSON.stringify(formDataToObject(participantForm))
    });
    participantForm.reset();
    showMessage("Participante registrado en el conjunto");
    loadParticipants();
  } catch (error) {
    showMessage(error.message, true);
  }
});

participantsBody.addEventListener("click", async (event) => {
  if (!event.target.matches("button[data-id]")) {
    return;
  }
  try {
    await apiRequest(`/participantes/${event.target.dataset.id}`, { method: "DELETE" });
    showMessage("Participante eliminado");
    loadParticipants();
  } catch (error) {
    showMessage(error.message, true);
  }
});

loadParticipants();
