function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark');

    const themeButton = document.getElementById("themeToggle");
    if (body.classList.contains('dark')) {
        themeButton.textContent = "Modo Claro";
    } else {
        themeButton.textContent = "Modo Oscuro";
    }

    // Guardar la preferencia de tema en localStorage
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
}

function encrypt() {
    const text = document.getElementById("inputText").value;
    const algorithm = document.getElementById("algorithm").value;

    if (!text) {
        showNotification("Por favor, ingresa un texto para encriptar.", "error");
        return;
    }

    showLoadingIndicator(true);

    setTimeout(() => {
        let encryptedText = '';
        if (algorithm === "caesar") {
            encryptedText = shiftText(text, 3);
        } else if (algorithm === "base64") {
            encryptedText = btoa(text); // Base64 encoding
        }

        document.getElementById("outputText").value = encryptedText;
        showNotification("Texto encriptado con éxito.", "success");
        addToHistory(text, encryptedText, "Encriptado");
        showLoadingIndicator(false);
    }, 1000); // Simula un proceso
}

function decrypt() {
    const text = document.getElementById("inputText").value;
    const algorithm = document.getElementById("algorithm").value;

    if (!text) {
        showNotification("Por favor, ingresa un texto para desencriptar.", "error");
        return;
    }

    showLoadingIndicator(true);

    setTimeout(() => {
        let decryptedText = '';
        if (algorithm === "caesar") {
            decryptedText = shiftText(text, -3);
        } else if (algorithm === "base64") {
            try {
                decryptedText = atob(text); // Base64 decoding
            } catch (e) {
                showNotification("Error al desencriptar. Verifica el texto.", "error");
                showLoadingIndicator(false);
                return;
            }
        }

        document.getElementById("outputText").value = decryptedText;
        showNotification("Texto desencriptado con éxito.", "success");
        addToHistory(text, decryptedText, "Desencriptado");
        showLoadingIndicator(false);
    }, 1000); // Simula un proceso
}

function shiftText(text, shift) {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
        }
        return char;
    }).join('');
}

function copyText() {
    const outputText = document.getElementById("outputText").value;

    if (!outputText) {
        showNotification("No hay texto para copiar.", "error");
        return;
    }

    navigator.clipboard.writeText(outputText)
        .then(() => {
            showNotification("Texto copiado al portapapeles.", "success");
        })
        .catch(err => {
            showNotification("Error al copiar el texto.", "error");
        });
}

function clearFields() {
    document.getElementById("inputText").value = '';
    document.getElementById("outputText").value = '';
    showNotification("Campos limpiados.", "success");
}

function showLoadingIndicator(show) {
    const indicator = document.getElementById("loadingIndicator");
    indicator.classList.toggle('hidden', !show);
}

function showNotification(message, type) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = type;
    notification.classList.remove("hidden");

    setTimeout(() => {
        notification.classList.add("hidden");
    }, 3000);
}

function addToHistory(input, result, type) {
    const historyList = document.getElementById("historyList");
    const row = document.createElement("tr");

    const typeCell = document.createElement("td");
    typeCell.textContent = type;
    row.appendChild(typeCell);

    const inputCell = document.createElement("td");
    inputCell.textContent = input;
    row.appendChild(inputCell);

    const resultCell = document.createElement("td");
    resultCell.textContent = result;
    row.appendChild(resultCell);

    historyList.appendChild(row);
}

// Verificar el tema almacenado en localStorage al cargar la página
document.addEventListener('DOMContentLoaded', (event) => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        document.getElementById("themeToggle").textContent = "Modo Claro";
    }
});
