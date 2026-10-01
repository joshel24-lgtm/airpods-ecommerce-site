const products = [
  {
    id: 1,
    name: "AirPods Pro Max",
    category: "Premium",
    price: 349,
    rating: 4.9,
    description: "Son immersif, réduction active du bruit et confort ultime.",
    badge: "Top vente",
    color: "purple"
  },
  {
    id: 2,
    name: "AirPods Lite",
    category: "Essentiel",
    price: 129,
    rating: 4.7,
    description: "Design compact, audio clair et autonomie de 20h.",
    badge: "Nouveau",
    color: "blue"
  },
  {
    id: 3,
    name: "AirPods Sport",
    category: "Sport",
    price: 199,
    rating: 4.8,
    description: "Ultra léger, sécurisé et parfait pour les entraînements.",
    badge: "Popular",
    color: "orange"
  },
  {
    id: 4,
    name: "Étui MagSafe",
    category: "Accessoire",
    price: 69,
    rating: 4.9,
    description: "Recharge rapide, protection premium et style élégant.",
    badge: "Promo",
    color: "pink"
  }
];

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const newsletterForm = document.getElementById("newsletterForm");

let cart = JSON.parse(localStorage.getItem("airwave-cart")) || [];

function formatPrice(value) {
  return `${value} €`;
}

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-visual" style="background: linear-gradient(135deg, ${product.color === "purple" ? "rgba(124,92,255,0.18)" : product.color === "blue" ? "rgba(57,208,255,0.18)" : product.color === "orange" ? "rgba(255,166,77,0.18)" : "rgba(255,78,201,0.18)"}, rgba(255,255,255,0.03));">
            <div class="earbud-set"></div>
          </div>
          <span class="product-badge">${product.badge}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-meta">
            <span class="product-price">${formatPrice(product.price)}</span>
            <span class="product-rating">★ ${product.rating}</span>
          </div>
          <div class="product-actions">
            <button class="btn btn-secondary" type="button">Détails</button>
            <button class="btn btn-primary add-to-cart" type="button" data-id="${product.id}">Ajouter</button>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.id);
      addToCart(productId);
    });
  });
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find((item) => item.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
  cartPanel.classList.add("open");
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("airwave-cart", JSON.stringify(cart));
}

function renderCart() {
  cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);

  if (!cart.length) {
    cartItems.innerHTML = `<p style="color: var(--muted); margin: 0;">Votre panier est vide.</p>`;
    cartTotal.textContent = "0 €";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div class="cart-item-visual"></div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>${item.quantity} × ${formatPrice(item.price)}</p>
          </div>
          <button class="cart-item-remove" type="button" data-id="${item.id}">✕</button>
        </div>
      `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = formatPrice(total);

  document.querySelectorAll(".cart-item-remove").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(Number(button.dataset.id));
    });
  });
}

function setupCartToggle() {
  const cartButton = document.querySelector(".cart-button");
  const closeCart = document.getElementById("closeCart");

  cartButton.addEventListener("click", () => {
    cartPanel.classList.toggle("open");
  });

  closeCart.addEventListener("click", () => {
    cartPanel.classList.remove("open");
  });
}

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("newsletterEmail");
  const message = document.createElement("p");
  message.textContent = `Merci ! ${email.value} a bien été inscrit à la newsletter.`;
  message.style.marginTop = "14px";
  message.style.color = "#aaf7cb";
  message.style.fontWeight = "600";

  if (newsletterForm.querySelector(".newsletter-success")) {
    newsletterForm.querySelector(".newsletter-success").remove();
  }

  message.className = "newsletter-success";
  newsletterForm.appendChild(message);
  newsletterForm.reset();
});

renderProducts();
renderCart();
setupCartToggle();
