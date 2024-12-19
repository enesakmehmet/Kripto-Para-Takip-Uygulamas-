const API_URL = "https://api.coingecko.com/api/v3/coins/markets";
const CHART_API_URL = "https://api.coingecko.com/api/v3/coins";
const currency = "usd"; // USD fiyatlarını al
const cryptoList = document.getElementById("cryptoList");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("cryptoModal");
const cryptoName = document.getElementById("cryptoName");
const cryptoDetails = document.getElementById("cryptoDetails");
const cryptoChart = document.getElementById("cryptoChart");
let chartInstance; // Chart.js grafiği için

// Verileri getir ve ekrana yazdır
async function fetchCryptoData() {
    try {
        const response = await fetch(`${API_URL}?vs_currency=${currency}&order=market_cap_desc&per_page=20&page=1`);
        const data = await response.json();
        displayCryptoData(data);
    } catch (error) {
        console.error("Veriler alınırken hata oluştu:", error);
        cryptoList.innerHTML = "<p>Veriler yüklenemedi. Lütfen tekrar deneyin.</p>";
    }
}

// Verileri DOM'a yazdır
function displayCryptoData(data) {
    cryptoList.innerHTML = ""; // Listeyi temizle
    data.forEach(crypto => {
        const cryptoCard = `
            <div class="crypto-card" onclick="showCryptoDetails('${crypto.id}')">
                <img src="${crypto.image}" alt="${crypto.name}">
                <h2>${crypto.name}</h2>
                <p>Fiyat: $${crypto.current_price}</p>
            </div>
        `;
        cryptoList.innerHTML += cryptoCard;
    });
}

// Kripto detaylarını göster
async function showCryptoDetails(cryptoId) {
    try {
        const response = await fetch(`${CHART_API_URL}/${cryptoId}/market_chart?vs_currency=${currency}&days=7`);
        const data = await response.json();

        // Modal'da detayları göster
        cryptoName.textContent = cryptoId.toUpperCase();
        cryptoDetails.innerHTML = `Son 7 gün fiyat trendi:`;

        // Grafik oluştur
        const labels = data.prices.map(price => new Date(price[0]).toLocaleDateString());
        const prices = data.prices.map(price => price[1]);

        if (chartInstance) chartInstance.destroy(); // Önceki grafiği yok et
        chartInstance = new Chart(cryptoChart, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Fiyat ($)",
                    data: prices,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1
                }]
            }
        });

        modal.style.display = "block"; // Modal'ı aç
    } catch (error) {
        console.error("Detaylar alınırken hata oluştu:", error);
    }
}

// Modal'ı kapat
function closeModal() {
    modal.style.display = "none";
}

// Arama özelliği
function searchCrypto() {
    const filter = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".crypto-card");

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(filter) ? "block" : "none";
    });
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener("DOMContentLoaded", fetchCryptoData);
