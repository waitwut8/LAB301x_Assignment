async function cartLoad() {
    let response = await api.get("/cart");
    let data = await response.data;
    localStorage.setItem("cart", JSON.stringify(data));
    renderCart();
  }
  
  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const productsContainer = document.querySelector(".card.mt-4 .card-body");
    productsContainer.innerHTML = ""; // Clear existing products
  
    let sumTotal = 0,
      sumDiscountedTotal = 0,
      sumTotalProducts = 0,
      sumTotalQuantity = 0;
  
    cart["products"].forEach((product) => {
      sumTotalProducts += 1;
      sumTotalQuantity += product.quantity;
      sumTotal += product.total * product.quantity;
      sumDiscountedTotal += product.discountedTotal * product.quantity;
  
      const productRow = createProductRow(product);
      productsContainer.appendChild(productRow);
  
      const totalRow = createTotalRow(product);
      productsContainer.appendChild(totalRow);
    });
  
    updateCartSummary(sumTotal, sumDiscountedTotal, sumTotalProducts, sumTotalQuantity);
  }
  
  function createProductRow(product) {
    const productRow = document.createElement("div");
    productRow.classList.add("row", "mb-3");
  
    const productName = document.createElement("div");
    productName.classList.add("col-md-8");
    productName.innerHTML = `<h5>${product.title}</h5> `;
  
    const productPrice = document.createElement("div");
    productPrice.classList.add("col-md-2");
    productPrice.innerHTML = `<p>$${product.price.toFixed(2)}</p>  <img src="${product.thumbnail}" class="img-fluid float-left mr-3" alt="${product.title}" color = "white"/>`;
  
    const productQuantity = document.createElement("div");
    productQuantity.classList.add("col-md-2");
    productQuantity.innerHTML = `<p>Quantity: ${product.quantity}</p>`;
  
    productRow.appendChild(productName);
    productRow.appendChild(productPrice);
    productRow.appendChild(productQuantity);
  
    return productRow;
  }
  
  function createTotalRow(product) {
    const totalRow = document.createElement("div");
    totalRow.classList.add("row");
  
    const totalPrice = document.createElement("div");
    totalPrice.classList.add("col-md-8");
    totalPrice.innerHTML = `<p><strong>Total:</strong> $${(product.total.toFixed(2) * product.quantity).toFixed(2)}</p>`;
  
    const discountedTotalPrice = document.createElement("div");
    discountedTotalPrice.classList.add("col-md-4");
    discountedTotalPrice.innerHTML = `<p><strong>Discounted Total:</strong> $${(product.discountedTotal.toFixed(2) * product.quantity).toFixed(2)}</p>`;
  
    totalRow.appendChild(totalPrice);
    totalRow.appendChild(discountedTotalPrice);
    totalRow.appendChild(document.createElement("hr"));
  
    return totalRow;
  }
  
  function updateCartSummary(sumTotal, sumDiscountedTotal, sumTotalProducts, sumTotalQuantity) {
    document.querySelector(".card-body p:nth-child(1)").innerText = `Total: $${sumTotal.toFixed(2)}`;
    document.querySelector(".card-body p:nth-child(2)").innerText = `Discounted Total: $${sumDiscountedTotal.toFixed(2)}`;
    document.querySelector(".card-body p:nth-child(3)").innerText = `Total Products: ${sumTotalProducts}`;
    document.querySelector(".card-body p:nth-child(4)").innerText = `Total Quantity: ${sumTotalQuantity}`;
  }
  async function loadCheckout(){
    document.getElementById("checkout").addEventListener("click", (e) =>{
      e.preventDefault();
      checkout()
    })
  }  
  async function checkout(){
    let response = await api.post("/checkout", {});
    if (response.status === 200) {
      alert("Checkout successful");
      window.location.href = "index.html";
    } else {
      alert("Failed to checkout");
    }
  }