const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

// Serve static files
app.use(express.static('./'));

// Proxy middleware
app.use('/proxy', createProxyMiddleware({
  changeOrigin: true,
  router: (req) => decodeURIComponent(req.url.slice(1)),
  pathRewrite: {'^/proxy/': '/'},
}));

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
});

// Function to show a temporary notification
function showNotification(message) {
  const notifications = document.getElementById("notifications");
  const note = document.createElement("div");
  note.className = "notification text-white text-sm mt-2";
  note.textContent = message;
  notifications.appendChild(note);

  // Auto-remove after animation (4s from CSS)
  setTimeout(() => {
    note.remove();
  }, 4000);
}

// Handle form submission
document.getElementById("proxyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const input = document.getElementById("proxyInput");
  let url = input.value.trim();

  if (!url) {
    showNotification("Please enter a URL.");
    return;
  }

  // Add scheme if missing
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  showNotification(`Proxying to: ${url}`);

  // Load proxied page into iframe -  Target the backend proxy
  const frame = document.getElementById("proxyFrame");
  frame.src = `/proxy/${encodeURIComponent(url)}`; // Updated to use backend proxy
});

// Modal toggle for instructions
document.getElementById("openModal").addEventListener("click", () => {
  document.getElementById("proxyModal").classList.remove("hidden");
  document.getElementById("proxyModal").classList.add("flex");
});

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("proxyModal").classList.remove("flex");
  document.getElementById("proxyModal").classList.add("hidden");
});