/*!
 * Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
 */
// This file is intentionally blank
// Use this file to add JavaScript to your project
const api_url = "http://127.0.0.1:8000";

const getToken = function () {
  return localStorage.getItem("access_token");
};
async function loadHome() {
  const productsContainer = document.querySelector(".row");

  productsContainer.innerHTML = "";
  let list_of_items = await fetch(`${api_url}/product_noLogin/18`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  list_of_items = await list_of_items.json();

  addCards(list_of_items, productsContainer);
}
function addCards(list_of_items, productsContainer) {
  for (const product of list_of_items) {
    var message = "";
    let discounted = 0;
    discounted = product.price * (1 - (product.discountPercentage + 5) / 100);
    discounted = discounted.toFixed(2);
    let ending = "";
    if (product.discountPercentage > 50 && product.discountPercentage < 75) {
      ending = "Hurry up! This is a limited time offer!";
    } else if (
      product.discountPercentage > 75 &&
      product.discountPercentage < 90
    ) {
      ending = "Clearance Sale! Get it before it's gone!";
    }
    message = `${(
      Number(product.discountPercentage) + 5
    ).toFixed()}% off! Save $${(product.price - discounted).toFixed(
      2
    )} ${ending}`;

    let { images } = product;
    images = images[0];
    const productCard = `
                    <div class="col-2 col gx-5 gy-2">
                        <div class="card h-80">
                            <img class="card-img-top img-fluid img-thumbnail" src="${product.thumbnail}" alt="${product.title}" />
                            <div class="card-body p-4">
                                <div class="text-center">
                                    <h6 class="fw-bolder">${product.title}</h5>
                                    <span class="text-muted text-decoration-line-through">$${product.price}</span> $<span>${discounted}</span>
                                    <br>
                                    <p class = "fw-bolder">${message}</p>
                                </div>
                            </div>
                            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">See More Information</a></div>
                            </div>
                        </div>
                    </div>
                `;
    productsContainer.insertAdjacentHTML("beforeend", productCard);
  }
}

function logout() {
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  alert("Logged out");
}

async function cartLoad(token) {
  response = await fetch(`${api_url}/cart`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data = await response.json();

  console.log(data);
  localStorage.setItem("cart", JSON.stringify(data));

  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  console.log(cart);

  console.log(cart);

  const productsContainer = document.querySelector(".card.mt-4 .card-body");
  productsContainer.innerHTML = ""; // Clear existing products
  var sumTotal = 0,
    sumDiscountedTotal = 0,
    sumTotalProducts = 0,
    sumTotalQuantity = 0;
  cart["products"].forEach((product) => {
    sumTotalProducts += 1;
    const productRow = document.createElement("div");
    productRow.classList.add("row", "mb-3");

    const productName = document.createElement("div");
    productName.classList.add("col-md-8");
    productName.innerHTML = `<h5>${product.title}</h5> `;

    const productPrice = document.createElement("div");
    productPrice.classList.add("col-md-2");
    productPrice.innerHTML = `<p>$${product.price.toFixed(2)}</p>  <img src="${
      product.thumbnail
    }" class="img-fluid float-left mr-3" alt="${
      product.title
    }" color = "white"/>`;

    const productQuantity = document.createElement("div");
    productQuantity.classList.add("col-md-2");
    productQuantity.innerHTML = `<p>Quantity: ${product.quantity}</p>`;
    sumTotalQuantity += product.quantity;
    productRow.appendChild(productName);
    productRow.appendChild(productPrice);
    productRow.appendChild(productQuantity);

    productsContainer.appendChild(productRow);

    const totalRow = document.createElement("div");
    totalRow.classList.add("row");

    const totalPrice = document.createElement("div");
    totalPrice.classList.add("col-md-8");
    totalPrice.innerHTML = `<p><strong>Total:</strong> $${product.total.toFixed(
      2
    )}</p>`;
    sumTotal += product.total;
    const discountedTotalPrice = document.createElement("div");
    discountedTotalPrice.classList.add("col-md-4");
    discountedTotalPrice.innerHTML = `<p><strong>Discounted Total:</strong> $${product.discountedTotal.toFixed(
      2
    )}</p>`;
    sumDiscountedTotal += product.discountedTotal;
    totalRow.appendChild(totalPrice);
    totalRow.appendChild(discountedTotalPrice);
    totalRow.appendChild(document.createElement("hr"));

    productsContainer.appendChild(totalRow);

    document.querySelector(
      ".card-body p:nth-child(1)"
    ).innerText = `Total: $${sumTotal.toFixed(2)}`;

    document.querySelector(
      ".card-body p:nth-child(2)"
    ).innerText = `Discounted Total: $${sumDiscountedTotal.toFixed(2)}`;

    document.querySelector(
      ".card-body p:nth-child(3)"
    ).innerText = `Total Products: ${sumTotalProducts}`;

    document.querySelector(
      ".card-body p:nth-child(4)"
    ).innerText = `Total Quantity: ${sumTotalQuantity}`;
  });
}
async function loadPost(postId) {
  let response = fetch(`127.0.0.1:8000/posts/${postId}`);
  if (response.status !== 200) {
    console.log("Error fetching post data");
    alert("Error fetching post data");
    return;
  }
  let data = await response.json();
  let documentPostTitle = document.getElementsByClassName("card-title")[0],
    documentPostBody = document.getElementsByClassName("cart-text"),
    postTitle = data["title"],
    postBody = data["body"];
  if (postTitle && postBody) {
    documentPostTitle.textContent = postTitle;
    documentPostBody.textContent = postBody;
  } else {
    alert("Content not loaded, redirecting to login page");
    window.location.href = "login.html";
  }
}

async function addToCart(id) {
  const token = getToken();
  // console.log(id);
  const response = await fetch(`${api_url}/cart`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantity: 1,
      product_name: id,
    }),
  });
  if (response.status === 200) {
    alert("Product added to cart");
  } else {
    alert("Failed to add product to cart");
  }
}
async function searchProducts() {
  const resultsContainer = document.getElementById("search-results");
  token = getToken();
  const keyword = document.getElementById("search-input").value;
  if (keyword == "") {
    resultsContainer.innerHTML = `<p class="text-danger">Please enter a keyword.</p>`;
    return;
  }
  const response = await fetch(`${api_url}/search/${keyword}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Add your token here
    },
  });

  const results = await response.json();

  resultsContainer.innerHTML = "";

  if (response.status === 200) {
    if (results.length === 0) {
      resultsContainer.innerHTML = "<p>No products found</p>";
      return;
    }
    results.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.className = "product card mb-3";
      productDiv.innerHTML = `
                <div class="card-body">
                <h4 class="card-title">${product.title}</h5>
                <img src="${product.thumbnail}" class="img-fluid float-left mr-3" alt="${product.title}" color = "white"/>
                <p class="card-text">${product.description}</p>
                <hr>

                <button onclick = "addToCart('${product.title}')" class="btn btn-primary">Add to Cart</button>
                </div>
            `;

      resultsContainer.appendChild(productDiv);
    });
  } else {
    resultsContainer.innerHTML = `<p class="text-danger">try <a href = 'login.html'>logging in</a>.</p>`;
  }
}
function login(form) {
  form.addEventListener("submit", async (e) => {
    let r = JSON.stringify({
      username: form.username.value,
      password: form.password.value,
    });
    console.log(r);
    e.preventDefault();
    let x = localStorage.getItem("access_token");
    if (x != null) {
      var response = await fetch(`${api_url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: r,
      });
      let s = await response.json();
      console.log(s);
      let token = s["access_token"];
      localStorage.setItem("access_token", token);
    } else {
      window.location.href = "index.html";
    }

    if (response.status == 200) {
      window.location.href = "index.html";
    } else {
      document.getElementById("products").innerHTML =
        "Please try logging in again";
    }
  });
}
