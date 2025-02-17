document.addEventListener("DOMContentLoaded", () => {
    getCurrentLocation();
    document.getElementById("submit-btn").addEventListener("click", getTimezoneByAddress);
});

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById("latitude").textContent = lat;
            document.getElementById("longitude").textContent = lon;
            await fetchTimezone(lat, lon, "current-timezone");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

async function fetchTimezone(lat, lon, elementId) {
    const apiKey = "99c262d2ca2448819224b11450baade9";
    const url = `https://api.geoapify.com/v1/timezone?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        document.getElementById(elementId).innerHTML = `
            <p><strong>Name Of Time Zone:</strong> ${data.timezone.name}</p>
            <p><strong>Lat:</strong> ${lat} <strong>Long:</strong> ${lon}</p>
            <p><strong>Offset STD:</strong> ${data.timezone.offset_STD}</p>
            <p><strong>Offset STD Seconds:</strong> ${data.timezone.offset_STD_seconds}</p>
            <p><strong>Offset DST:</strong> ${data.timezone.offset_DST}</p>
            <p><strong>Offset DST Seconds:</strong> ${data.timezone.offset_DST_seconds}</p>
            <p><strong>Country:</strong> ${data.country.name}</p>
            <p><strong>Postcode:</strong> ${data.postcode || "N/A"}</p>
            <p><strong>City:</strong> ${data.city || "N/A"}</p>
        `;
    } catch (error) {
        console.error("Error fetching timezone data:", error);
    }
}

async function getTimezoneByAddress() {
    const address = document.getElementById("address").value;
    if (!address) {
        alert("Please enter an address.");
        return;
    }

    const apiKey = "99c262d2ca2448819224b11450baade9"; 
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`;

    try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.features.length > 0) {
            const lat = data.features[0].geometry.coordinates[1];
            const lon = data.features[0].geometry.coordinates[0];
            await fetchTimezone(lat, lon, "address-timezone");
        } else {
            alert("Address not found.");
        }
    } catch (error) {
        console.error("Error fetching geolocation data:", error);
    }
}
