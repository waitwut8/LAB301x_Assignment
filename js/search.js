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
               
                <button  id="${product.id}" class="btn btn-primary add-to-cart-btn">Add to Cart</button>
           
            </div>
        `;
  
        resultsContainer.appendChild(productDiv);
  
        document.getElementById(`${product.id}`).addEventListener("click", (event) => {
          event.preventDefault();
          addToCart(product.title);
          
  
        }, false)
      //   const addToCartButton = document.getElementById(`${product.id}`);
        
      //   addToCartButton.addEventListener("click", async (event) => {
      //     addToCart(product.title);
      //     event.preventDefault();
      //    }, false);
      });
   
    } else {
      resultsContainer.innerHTML = `<p class="text-danger">try <a href = 'login.html'>logging in</a>.</p>`;
    }
  }