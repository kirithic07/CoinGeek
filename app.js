// Page Navigation Controls
document.getElementById('goHome').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('homePage');
});

document.getElementById('navLogin').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('loginPage');
});

document.getElementById('navSignup').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('signupPage');
});

document.getElementById('heroGetStarted').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('signupPage');
});

// Page Management
function showPage(pageId) {
    const pages = ['homePage', 'loginPage', 'signupPage', 'mainPage'];
    pages.forEach(page => {
        document.getElementById(page).style.display = page === pageId ? 'block' : 'none';
    });
}

// Auth Handlers
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (email && password) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainPage').style.display = 'block';
    }
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    if (email && password) {
        document.getElementById('signupPage').style.display = 'none';
        document.getElementById('mainPage').style.display = 'block';
    }
});

// Trading Features
let currentPrice = 0;
const binanceWebSocket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

binanceWebSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    currentPrice = parseFloat(data.p).toFixed(2);
    document.getElementById('priceTicker').innerHTML = `
        <div class="col">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">BTC/USDT</h5>
                    <p class="card-text">$${currentPrice}</p>
                </div>
            </div>
        </div>
    `;
};

// Trade Execution
document.getElementById('buyButton').addEventListener('click', () => {
    const tradeMessage = `Bought BTC at $${currentPrice}`;
    showTradeConfirmation(tradeMessage);
});

document.getElementById('sellButton').addEventListener('click', () => {
    const tradeMessage = `Sold BTC at $${currentPrice}`;
    showTradeConfirmation(tradeMessage);
});

function showTradeConfirmation(message) {
    const confirmationDiv = document.getElementById('tradeConfirmation');
    confirmationDiv.textContent = message;
    confirmationDiv.style.display = 'block';
    setTimeout(() => {
        confirmationDiv.style.display = 'none';
    }, 3000);
}

// TradingView Chart
new TradingView.widget({
    "width": "100%",
    "height": "500",
    "symbol": "BINANCE:BTCUSDT",
    "interval": "1",
    "timezone": "Etc/UTC",
    "theme": "light",
    "style": "1",
    "locale": "en",
    "toolbar_bg": "#f1f3f6",
    "hide_side_toolbar": false,
    "allow_symbol_change": true,
    "container_id": "tradingview-chart"
});

// Order Book
async function fetchOrderBook() {
    const response = await fetch('https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=10');
    const data = await response.json();
    
    let bidsHtml = '<ul class="list-group">';
    data.bids.forEach(bid => {
        bidsHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
                        ${bid[0]}
                        <span class="badge bg-primary rounded-pill">${bid[1]}</span>
                    </li>`;
    });
    bidsHtml += '</ul>';
    document.getElementById('orderBookBids').innerHTML = bidsHtml;

    let asksHtml = '<ul class="list-group">';
    data.asks.forEach(ask => {
        asksHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
                        ${ask[0]}
                        <span class="badge bg-danger rounded-pill">${ask[1]}</span>
                    </li>`;
    });
    asksHtml += '</ul>';
    document.getElementById('orderBookAsks').innerHTML = asksHtml;
}

// Market Ticker Simulation
const tickerData = [
    { symbol: 'BTC/USDT', price: '32450.00', change: '+2.4%' },
    { symbol: 'ETH/USDT', price: '2120.50', change: '-1.2%' },
    { symbol: 'BNB/USDT', price: '312.70', change: '+0.8%' },
    { symbol: 'XRP/USDT', price: '0.6820', change: '+5.1%' }
];

function updateMarketTicker() {
    const container = document.getElementById('marketTicker');
    container.innerHTML = tickerData.map(pair => `
        <div class="col-6 col-md-3">
            <div class="ticker-item">
                <div>
                    <h5>${pair.symbol}</h5>
                    <span class="${pair.change.includes('+') ? 'price-up' : 'price-down'}">
                        ${pair.change}
                    </span>
                </div>
                <div class="text-end">
                    <div class="h5">$${pair.price}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize
showPage('homePage');
fetchOrderBook();
setInterval(fetchOrderBook, 5000);
updateMarketTicker();
setInterval(updateMarketTicker, 3000);