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
    let element = getDoc("carousel-inner");
    if ((product.images.length === 1)) {
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


  }