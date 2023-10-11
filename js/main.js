
    const MIN_POTENCIA = 100;
    const MAX_POTENCIA = 300;
    const MAX_VUELTAS = 5;
    const API_URL = 'ruta/al/archivo/datos.json'; // Reemplaza esto con la ruta correcta a tu archivo JSON

    let hamilton = {
        nombre: "Hamilton",
        vueltasGanadas: 0,
        historialVelocidad: [],
    };

    let verstappen = {
        nombre: "Verstappen",
        vueltasGanadas: 0,
        historialVelocidad: [],
    };

    let vueltaActual = 0;

    // Agregar solicitud fetch para cargar datos al inicio
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (data.historialHamilton) {
                hamilton.historialVelocidad = data.historialHamilton;
            }
            if (data.historialVerstappen) {
                verstappen.historialVelocidad = data.historialVerstappen;
            }
        })
        .catch(error => {
            console.error("Error al cargar datos:", error);
        });

    function guardarDatosLocalStorage() {
        localStorage.setItem("historialHamilton", JSON.stringify(hamilton.historialVelocidad));
        localStorage.setItem("historialVerstappen", JSON.stringify(verstappen.historialVelocidad));
    }

    function obtenerPotenciaValida() {
        const inputPotenciaHamilton = document.getElementById("velocidadHamilton");
        const potenciaHamilton = parseInt(inputPotenciaHamilton.value);

        const inputPotenciaVerstappen = document.getElementById("velocidadVerstappen");
        const potenciaVerstappen = parseInt(inputPotenciaVerstappen.value);

        if (
            !isNaN(potenciaHamilton) &&
            potenciaHamilton >= MIN_POTENCIA &&
            potenciaHamilton <= MAX_POTENCIA &&
            !isNaN(potenciaVerstappen) &&
            potenciaVerstappen >= MIN_POTENCIA &&
            potenciaVerstappen <= MAX_POTENCIA
        ) {
            return {
                potenciaHamilton,
                potenciaVerstappen,
            };
        } else {
            alert("Ingresa potencias válidas entre 100 y 300.");
            return null;
        }
    }

    function simularVuelta() {
        const potencias = obtenerPotenciaValida();

        if (potencias === null) {
            return;
        }

        vueltaActual++;

        const now = luxon.DateTime.local(); // Obtener la hora actual con Luxon
        const horaVuelta = now.toFormat("HH:mm:ss"); // Formatear la hora
        const dt = DateTime.now ();
        dt.year

        hamilton.historialVelocidad.push({
            potencia: potencias.potenciaHamilton,
            hora: horaVuelta,
        });
        verstappen.historialVelocidad.push({
            potencia: potencias.potenciaVerstappen,
            hora: horaVuelta,
        });

        const resultadoVuelta = document.createElement("p");
        let ganadorVuelta = "";

        if (potencias.potenciaHamilton > potencias.potenciaVerstappen) {
            hamilton.vueltasGanadas++;
            ganadorVuelta = `Hamilton (${potencias.potenciaHamilton} km/h)`;
        } else if (potencias.potenciaVerstappen > potencias.potenciaHamilton) {
            verstappen.vueltasGanadas++;
            ganadorVuelta = `Verstappen (${potencias.potenciaVerstappen} km/h)`;
        } else {
            ganadorVuelta = "Empate";
        }

        resultadoVuelta.textContent = `Vuelta ${vueltaActual}: Ganador - ${ganadorVuelta}, Hora: ${horaVuelta}`;

        const resultadosCarrera = document.getElementById("resultadosCarrera");
        resultadosCarrera.appendChild(resultadoVuelta);

        guardarDatosLocalStorage();

        if (vueltaActual >= MAX_VUELTAS) {
            mostrarGanadorCarrera();
            document.getElementById("iniciarVuelta").disabled = true;
        }
    }

    function mostrarGanadorCarrera() {
        const resultadosCarrera = document.getElementById("resultadosCarrera");
        const imgHamilton = document.getElementById("imgHamilton");
        const imgVerstappen = document.getElementById("imgVerstappen");
        const imgEmpate = document.getElementById("imgEmpate");

        if (hamilton.vueltasGanadas > verstappen.vueltasGanadas) {
            resultadosCarrera.innerHTML += `<p>Ganador de la carrera: Hamilton (${hamilton.vueltasGanadas} vueltas ganadas)</p>`;
            imgHamilton.style.display = "block";
            imgVerstappen.style.display = "none";
            imgEmpate.style.display = "none";
        } else if (verstappen.vueltasGanadas > hamilton.vueltasGanadas) {
            resultadosCarrera.innerHTML += `<p>Ganador de la carrera: Verstappen (${verstappen.vueltasGanadas} vueltas ganadas)</p>`;
            imgHamilton.style.display = "none";
            imgVerstappen.style.display = "block";
            imgEmpate.style.display = "none";
        } else {
            resultadosCarrera.innerHTML += `<p>La carrera terminó en empate</p>`;
            imgHamilton.style.display = "none";
            imgVerstappen.style.display = "none";
            imgEmpate.style.display = "block";
        }
    }

    document.getElementById("iniciarVuelta").addEventListener("click", () => {
        if (vueltaActual < MAX_VUELTAS) {
            simularVuelta();
        }
    });

    document.getElementById("reiniciarCarrera").addEventListener("click", () => {
        vueltaActual = 0;
        hamilton.vueltasGanadas = 0;
        verstappen.vueltasGanadas = 0;
        hamilton.historialVelocidad = [];
        verstappen.historialVelocidad = [];
        document.getElementById("resultadosCarrera").innerHTML = "";
        document.getElementById("iniciarVuelta").disabled = false;
        document.getElementById("imgHamilton").style.display = "none";
        document.getElementById("imgVerstappen").style.display = "none";
        document.getElementById("imgEmpate").style.display = "none";

        localStorage.removeItem("historialHamilton");
        localStorage.removeItem("historialVerstappen");
    });

