const api_url = "http://127.0.0.1:8000";
// Add a response interceptor
const api = axios.create({
  baseURL: api_url,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (
      error.response.status === 401 &&
      error.response.data.detail.includes("expire")
    ) {
      let res = await axios.post(
        `${api_url}/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
          },
        }
      );
      if (res.status != 200) {
        alert("Your session has expired. Please login again");
        window.location.href = "login.html";
      } else {
        localStorage.setItem("refresh_token", res.data["refresh_token"]);
        localStorage.setItem("access_token", res.data["access_token"]);
      }
    } else if (error.response.status === 401) {
      console.log(error.response);
      alert("Unauthorized access, please login");
      window.location.href = "login.html";
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getToken() {
  return localStorage.getItem("access_token");
}
async function loadHome() {
  const productsContainer = document.querySelector("#row");

  productsContainer.innerHTML = "";

  let list_of_items = await api.get(`${api_url}/product_noLogin/18`);
  list_of_items = list_of_items.data;
  addCards(list_of_items, productsContainer);
}
async function loadPosts() {
  const postContainer = document.querySelector(".row");
  postContainer.innerHTML = "";
  let post_req = await api.get("/posts_noLogin/3");
  let posts = post_req.data;
  for (const post of posts) {
    const productCard = `<div class = "col-4 py-1">
                    <div class="card-group">
  <div class="card">
    
    <div class="card-body">
      <h5 class="card-title">A ${post.tags[0]} story</h5>
      <p class="card-text">${post.title}...</p>
      
      
    </div>
    <div class="card-footer">
      <small class="text-muted" onclick = 'loadPost(${post.id})'">Click here to read more </small>
    

  </div>
  </div>
                `;
    postContainer.insertAdjacentHTML("beforeend", productCard);
  }
}

async function loadPost(id) {
  let post_data = await api.get(`${api_url}/posts/${id}`);
  let post = post_data.data;
  localStorage.setItem("post", JSON.stringify(post));
  window.location.href = "posts.html";
}
async function loadPostPage() {
  let post = JSON.parse(localStorage.getItem("post"))[0];
  let postTitle = document.getElementsByClassName("card-title")[0],
    postBody = document.getElementsByClassName("card-text")[0],
    postLikes = document.getElementById("thumbsUpCount"),
    postDislikes = document.getElementById("thumbsDownCount"),
    postviews = document.getElementById("viewsCount");
  postTitle.textContent = post.title;
  postBody.textContent = post.body;
  postLikes.textContent = post["reactions"]["likes"];
  postDislikes.textContent = post.reactions.dislikes;
  postviews.textContent = post.views;
}
let setProduct = async function (id) {
  let res = await api.get(`/product/${id}`);
  let product = JSON.stringify(res.data);
  console.log(product);
  localStorage.setItem("product", product);
  window.location.href = "product.html";
};
async function loadProductPage() {
  let product = JSON.parse(localStorage.getItem("product"));
  if (!product) {
    alert("product has not loaded yet, try again");
    window.location.href = "index.html";
  }
  let name = getDoc("title");
  let category = getDoc("category");
  let price = getDoc("prices");
  let desc = getDoc("description");
  let weight = getDoc("weight");
  let dims = getDoc("dimensions");
  let warranty = getDoc("warranty");
  let productDims = product.dimensions;
  let dimString = `${productDims.width} x ${productDims.height} x ${productDims.depth} cm`;
  element = getDoc("carousel-inner");
  if ((product.images.length == 1)) {
    let noImg =getDoc("noimg")
    noImg.src = product.images[0]
  } else {
    for (const image of product.images) {
      let carousel_object = `<div class="carousel-item">
                        <img class="d-block w-50" src="${image}">
                      </div>`;
      console.log(carousel_object);

      element.innerHTML += carousel_object;
    }
  }

  setTextByList(
    [name, price, desc, weight, dims, warranty, category],
    [
      product.title,
      "$" + product.price,
      product.description,
      product.weight + "g",
      dimString,
      product.warrantyInformation,
      product.category,
    ]
  );
  let reviews = getDoc("reviews")
  for (const review of product.reviews) {
    let review_card = `<div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">John Doe</h5>
                            <h6 class="card-subtitle mb-2 text-muted">5 stars</h6>
                            <p class="card-text">This product is amazing! It exceeded my expectations and I would highly recommend it to anyone.</p>
                        </div>
                    </div>
                </div>`
  }
}
function setText(element, text) {
  element.textContent = text;
}
function setTextByList(elementList, textList) {
  for (let index = 0; index < elementList.length; index++) {
    const element = elementList[index];
    const text = textList[index];
    setText(element, text);
  }
}
function setHTML(element, HTML) {
  element.innerHTML = HTML;
}
function getDoc(id) {
  return document.getElementById(id);
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
                                <div class="text-center"><a class="btn btn-outline-dark mt-auto"  onclick = 'setProduct("${product.id}")'>See More Information</a></div>
                                <div class="text-center"><a class="btn btn-outline-dark mt-auto"  onclick = 'addToCart("${product.title}")'>Buy now</a></div>
                            </div>
                        </div>
                    </div>
                `;
    productsContainer.insertAdjacentHTML("beforeend", productCard);
  }
}

function logout() {
  localStorage.clear();
  alert("Logged out");
}

async function cartLoad() {
  let response = await api.get("/cart");
  let data = await response.data;

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
    totalPrice.innerHTML = `<p><strong>Total:</strong> $${
      product.total.toFixed(2) * product.quantity
    }</p>`;
    sumTotal += product.total * product.quantity;
    const discountedTotalPrice = document.createElement("div");
    discountedTotalPrice.classList.add("col-md-4");
    discountedTotalPrice.innerHTML = `<p><strong>Discounted Total:</strong> $${
      product.discountedTotal.toFixed(2) * product.quantity
    }</p>`;
    sumDiscountedTotal += product.discountedTotal * product.quantity;
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
// async function loadPost(postId) {
//   let response = fetch(`/posts/${postId}`);
//   if (response.status !== 200) {
//     console.log("Error fetching post data");
//     alert("Error fetching post data");
//     return;
//   }
//   let data = await response.data;
//   let documentPostTitle = document.getElementsByClassName("card-title")[0],
//     documentPostBody = document.getElementsByClassName("cart-text"),
//     postTitle = data["title"],
//     postBody = data["body"];
//   if (postTitle && postBody) {
//     documentPostTitle.textContent = postTitle;
//     documentPostBody.textContent = postBody;
//   } else {
//     alert("Content not loaded, redirecting to login page");
//     window.location.href = "login.html";
//   }
// }

async function addToCart(id) {
  let response = await api.post("/cart", {
    quantity: 1,
    product_name: id,
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

  let response = await api.post(`/search/${keyword}`);

  const results = await response.data;

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
              <h4 class="card-title">${product.title}</h4>
              <img src="${product.thumbnail}" class="img-fluid float-left mr-3" alt="${product.title}" />
              <p class="card-text">${product.description}</p>
              <hr>
              <button id="${product.id}" class="btn btn-primary add-to-cart-btn">Add to Cart</button>
          </div>
      `;

      resultsContainer.appendChild(productDiv);

      const addToCartButton = document.getElementById(`${product.id}`);
      addToCartButton.addEventListener("click", (event) => {
        event.preventDefault();
        addToCart(product.title);
      });
    });
  } else {
    resultsContainer.innerHTML = `<p class="text-danger">try <a href = 'login.html'>logging in</a>.</p>`;
  }
}
function login(form) {
  form.addEventListener("submit", async (e) => {
    let r = {
      username: form.username.value,
      password: form.password.value,
    };
    console.log(r);
    e.preventDefault();
    let x = localStorage.getItem("access_token");

    let res = await axios.post(`${api_url}/login`, r);

    let s = await res.data;

    let token = s["access_token"],
      r_token = s["refresh_token"];

    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", r_token);
    if (res.status == 200) {
      window.location.href = "index.html";
    } else {
      document.getElementById("products").innerHTML =
        "Please try logging in again";
    }
  });
}
