console.log("displaycart.js loaded")
console.log(JSON.parse(localStorage.getItem("prices")))
var _prices = JSON.parse(localStorage.getItem("prices"))
var _names = JSON.parse(localStorage.getItem("cart"))
var _images = JSON.parse(localStorage.getItem("images"))
var prices = []
var names = []
var images = []

_prices.forEach(element => {
    prices.push(element)
});
_names.forEach(element => {
    names.push(element)
});
_images.forEach(element => {
    images.push(element)
});
