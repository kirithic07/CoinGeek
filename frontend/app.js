// Page Navigation Controls
document.getElementById('goHome').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('homePage');
});

// Login Form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    try {
      const response = await fetch('../backend/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        showPage('mainPage');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Login failed');
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  });

// Signup Form (similar to login)
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
  
    try {
      const response = await fetch('../backend/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        alert('Account created! Please login');
        showPage('loginPage');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Signup failed');
      }
    } catch (error) {
      alert('Signup failed: ' + error.message);
    }
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

// Navigation between login and signup pages
document.getElementById('showSignup').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('signupPage');
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('loginPage');
});

// Nav bar login/signup buttons
document.getElementById('navLogin').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('loginPage');
});

document.getElementById('navSignup').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('signupPage');
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
    
    // Bids (Buy Orders)
    let bidsHtml = '<h4 class="mb-3">Buy Orders</h4><ul class="list-group">';
    data.bids.forEach(bid => {
        bidsHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
                        <span class="text-success">${parseFloat(bid[0]).toFixed(2)}</span>
                        <span class="badge bg-success rounded-pill">${parseFloat(bid[1]).toFixed(4)}</span>
                    </li>`;
    });
    bidsHtml += '</ul>';
    document.getElementById('orderBookBids').innerHTML = bidsHtml;

    // Asks (Sell Orders)
    let asksHtml = '<h4 class="mb-3">Sell Orders</h4><ul class="list-group">';
    data.asks.forEach(ask => {
        asksHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
                        <span class="text-danger">${parseFloat(ask[0]).toFixed(2)}</span>
                        <span class="badge bg-danger rounded-pill">${parseFloat(ask[1]).toFixed(4)}</span>
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
// Add these at the bottom of your existing app.js

// Scroll Reveal Animation
function checkScroll() {
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      
      if (elementTop < window.innerHeight && elementBottom > 0) {
        element.classList.add('active');
      }
    });
  }
  
  // Initialize Scroll Reveal
  window.addEventListener('scroll', checkScroll);
  window.addEventListener('load', checkScroll);
  
  // Animated Background
  document.body.insertAdjacentHTML('afterbegin', '<div class="animated-bg"></div>');
  
  // Enhanced Price Update Animation
  binanceWebSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const newPrice = parseFloat(data.p).toFixed(2);
    
    if (newPrice !== currentPrice) {
      document.getElementById('priceTicker').classList.add('price-update');
      setTimeout(() => {
        document.getElementById('priceTicker').classList.remove('price-update');
      }, 600);
    }
    
    currentPrice = newPrice;
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
  
  // Enhanced Trade Confirmation
  function showTradeConfirmation(message) {
    const confirmationDiv = document.getElementById('tradeConfirmation');
    confirmationDiv.textContent = message;
    confirmationDiv.classList.add('show');
    setTimeout(() => {
      confirmationDiv.classList.remove('show');
    }, 3000);
  }
  
  // Page Transition Animation
  function showPage(pageId) {
    const pages = ['homePage', 'loginPage', 'signupPage', 'mainPage'];
    pages.forEach(page => {
      const pageElement = document.getElementById(page);
      if (page === pageId) {
        pageElement.style.display = 'block';
        pageElement.classList.add('page-transition');
      } else {
        pageElement.style.display = 'none';
        pageElement.classList.remove('page-transition');
      }
    });
  }