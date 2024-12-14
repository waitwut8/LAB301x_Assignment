async function loadHome() {
    const productsContainer = document.querySelector("#row");
  
    productsContainer.innerHTML = "";
  
    let list_of_items = await api.get(`${api_url}/product_noLogin/18`);
    list_of_items = list_of_items.data;
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
                                  <div class="text-center"><a class="btn btn-outline-dark mt-auto"  onclick = 'setProduct("${product.id}")'>See More Information</a></div>
                                  <div class="text-center"><a class="btn btn-outline-dark mt-auto"  onclick = 'addToCart("${product.title}")'>Buy now</a></div>
                              </div>
                          </div>
                      </div>
                  `;
      productsContainer.insertAdjacentHTML("beforeend", productCard);
    }
  }