const apiKey = "01c9e13fcbbe7011f830ac0c994d3cc6";

let history = JSON.parse(localStorage.getItem("cityHistory")) || [];

// log function
function log(msg) {
    document.getElementById("logs").innerHTML += `<p>${msg}</p>`;
}

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) return alert("Enter city");

    document.getElementById("logs").innerHTML = "";

    log("Sync Start");
    log("[ASYNC] Fetching...");

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        log("Promise.then (Microtask)");

        if (!res.ok) throw new Error();

        const data = await res.json();

        log("[ASYNC] Data received");

        // display
        document.getElementById("city").textContent = data.name;
        document.getElementById("temp").textContent = data.main.temp + " °C";
        document.getElementById("weather").textContent = data.weather[0].main;
        document.getElementById("humidity").textContent = data.main.humidity + "%";
        document.getElementById("wind").textContent = data.wind.speed + " m/s";

        // save history
        if (!history.includes(city)) {
            history.push(city);
            localStorage.setItem("cityHistory", JSON.stringify(history));
            showHistory();
        }

    } catch {
        document.getElementById("city").innerHTML = "<span style='color:red'>City not found</span>";
        document.getElementById("temp").textContent = "-";
        document.getElementById("weather").textContent = "-";
        document.getElementById("humidity").textContent = "-";
        document.getElementById("wind").textContent = "-";
    }

    setTimeout(() => log("setTimeout (Macrotask)"), 0);
    log("Sync End");
}

function showHistory() {
    const box = document.getElementById("history");
    box.innerHTML = "";

    history.forEach(c => {
        const span = document.createElement("span");
        span.textContent = c;

        span.onclick = () => {
            document.getElementById("cityInput").value = c;
            getWeather();
        };

        box.appendChild(span);
    });
}

showHistory();