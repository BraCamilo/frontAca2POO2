const DEFAULT_API_URL = "https://backaca2poo2-production.up.railway.app/api";
//Url producción: https://backaca2poo2-production.up.railway.app/api
//UrL local: http://localhost:8080/api
//Desplegar localmente: docker run -d --rm --name programacionOO2-api-test -p 8080:8080 -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/estructuras -e SPRING_DATASOURCE_USERNAME=poo2admin -e SPRING_DATASOURCE_PASSWORD=poo2123 por-back:latest

function getApiUrl() {
  return localStorage.getItem("apiUrl") || DEFAULT_API_URL;
}

function setApiUrl(url) {
  localStorage.setItem("apiUrl", url.replace(/\/$/, ""));
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${getApiUrl()}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = "No fue posible completar la solicitud";
    try {
      const body = await response.json();
      message = body.message || message;
    } catch (error) {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function configureApiForm() {
  const input = document.querySelector("#apiUrl");
  const form = document.querySelector("#apiConfig");
  if (!input || !form) {
    return;
  }
  input.value = getApiUrl();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setApiUrl(input.value.trim());
    window.location.reload();
  });
}

function showMessage(text, isError = false) {
  const message = document.querySelector("#message");
  if (message) {
    message.textContent = text;
    message.style.color = isError ? "var(--danger)" : "var(--accent)";
  }
}

function formDataToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

configureApiForm();
