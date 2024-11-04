if (localStorage.getItem("cart") === null) {
    cart = []
    priceCart = []
    imageCart = []
}
else {
    cart = JSON.parse(localStorage.getItem("cart"))
    priceCart = JSON.parse(localStorage.getItem("prices"))
    imageCart = JSON.parse(localStorage.getItem("images"))
}
async function getData(){
    try {
        data = await fetch("./data.json")
        items = await data.json()
        return items

    } catch (error) {
        console.log("oops an error occured")
        console.log(error)
    }    
}
list = getData()
function addCart(){
    
    itemName = document.getElementById("product-name").textContent;
    
    list.then(items => {
        let item = items.find(i => i.name === itemName);
        if (item) {
            console.log(item["name"]);
            cart.push(item["name"]);
            priceCart.push(item["price"]);
            imageCart.push(item["image"])
            console.log(`Added ${itemName} to cart`);
            
        } else {
            console.log(`Item ${itemName} not found`);
        }
        console.log(cart)
        numberOfItems = Object.keys(cart).length;
        console.log(numberOfItems)
        document.getElementById("cartNumber").innerHTML = numberOfItems-1;
    });
    console.log(imageCart)
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("prices", JSON.stringify(priceCart));
    localStorage.setItem("images", JSON.stringify(imageCart));
    

}
function sendCart(){
    console.log(cart)
    
    window.location.href = "./cart.html";
}
function clearCart(){
    localStorage.setItem("cart") = []
    localStorage.setItem("prices") = []
    localStorage.setItem('images') = []
}
