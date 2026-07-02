const clientsBody = document.querySelector("#clientsBody");
const clientForm = document.querySelector("#clientForm");
const serveButton = document.querySelector("#serveButton");

async function loadClients() {
  try {
    const clients = await apiRequest("/clientes");
    clientsBody.innerHTML = clients.map((client) => `
      <tr>
        <td>${client.ordenLlegada ?? ""}</td>
        <td>${client.nombre}</td>
        <td>${client.documento ?? ""}</td>
        <td><span class="badge">${client.preferencial ? "Preferencial" : "General"}</span></td>
        <td><span class="badge ${client.atendido ? "ok" : ""}">${client.atendido ? "Atendido" : "Pendiente"}</span></td>
      </tr>
    `).join("");
  } catch (error) {
    showMessage(error.message, true);
  }
}

clientForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formDataToObject(clientForm);
  data.preferencial = data.preferencial === "true";
  try {
    await apiRequest("/clientes", {
      method: "POST",
      body: JSON.stringify(data)
    });
    clientForm.reset();
    showMessage("Cliente agregado a la cola");
    loadClients();
  } catch (error) {
    showMessage(error.message, true);
  }
});

serveButton.addEventListener("click", async () => {
  try {
    const client = await apiRequest("/clientes/atender", { method: "POST" });
    showMessage(`Cliente atendido: ${client.nombre}`);
    loadClients();
  } catch (error) {
    showMessage(error.message, true);
  }
});

loadClients();
