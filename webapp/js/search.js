const dataset = api.get("/products_name").then((res) => {
    localStorage.setItem('data', JSON.stringify(res));
    console.log(JSON.stringify(res));
});
api.get("/get_filters").then((res)=> {
        localStorage.setItem("filters", JSON.stringify(res.data))


    }
);
let data = JSON.parse(localStorage.getItem(('data')))
let filter_data = JSON.parse(localStorage.getItem("filters"))
let _input = document.getElementById('search-input');
let brand_filters = new Set(filter_data[0])
let category_filters = new Set(filter_data[1])
let b_filters = new Set(), c_filters = new Set();
$("btn-success").on('click', function(){
    const keyword = $("#search-input").val()
    searchProducts(keyword, b_filters, c_filters)
})
// constructs the suggestion engine
var products = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    // `states` is an array of state names defined in "The Basics"
    local: data,

});

var brands = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: filter_data[0]
})
$('#bloodhound .typeahead').typeahead({
        limit:10,
        hint: true,
        highlight: true,
        minLength: 1,


    },
    {
        name: 'products',
        source: products
    },

);

window.addEventListener("keydown", (event) =>{
    console.log(event.key)
    if (event.key==="Enter"){
        console.log($("#search-input")[0].value)
        searchProducts($("#search-input")[0].value, b_filters, c_filters)
    }
})


$('#o_bloodhound .o_typeahead').typeahead({
        limit:10,
        hint: true,
        highlight: true,
        minLength: 1,


    },
    {
        name: 'products',
        source: brands
    },

);
$("#brand-filter-adder").on('click', function () {
    addToBFilter()
})
function addToBFilter(){
    b_filters.add($('.o_typeahead.tt-input').val())
}


const extracted = (product, resultsContainer) => {
    const productDiv = document.createElement("div");

    productDiv.className = "product card mb-3";
    productDiv.innerHTML = `
            <div class="card-body">
                <h4 class="card-title">${product.title}</h4>
                <img src="${product.thumbnail}" class="img-fluid float-left mr-3 mb-1" alt="${product.title}" />
                <p class="card-text">${product.description}</p>
                <hr>

                <button  id="${product.id}" class="btn btn-primary add-to-cart-btn">Add to Cart</button>

            </div>
        `;

    resultsContainer.appendChild(productDiv);
    document.getElementById(`${product.id}`).addEventListener("click", (event) => {
        event.preventDefault();
        addToCart(product.title).then();

    });

}

function searchProducts(keyword, b_filters, c_filters) {

    console.log(keyword)
    let resultsContainer = document.getElementById("search-results")

    if (!keyword) {
        resultsContainer.innerHTML  = `<p class="text-danger">Please enter a keyword.</p>`;
        return;
    }

    api.post(`/search/${keyword}`).then((res) => {
        let results = res.data;
        resultsContainer.innerHTML = "";
        let _set = new Set()
        console.log(b_filters)
        if (res.status === 200) {
            if (results.length === 0) {
                resultsContainer.innerHTML = "<p>No products found</p>";
                return;
            }

            if (b_filters.size===0 && c_filters.size===0){
                console.log("no filter")
            results.forEach((product) => {
                extracted(product, resultsContainer);

            });}
            else{
                console.log("there is a filter: ", b_filters, c_filters)
                results.forEach((product) => {

                    if (b_filters.has(product.brand) || c_filters.has(product.category)) {
                        extracted(product, resultsContainer)
                    }
                });
            }

        } else {
            resultsContainer.innerHTML = `<p class="text-danger">try <a href = 'login.html'>logging in</a>.</p>`;
        }




    });
}

function check_for_change() {
    let checkboxes = $("[type=checkbox][name=checker]")
    checkboxes.change(function () {
        let enabledSettings = checkboxes
            .filter(":checked") // Filter out unchecked boxes.
            .map(function () { // Extract values using jQuery map.
                return this.value;
            })
            .get() // Get array.
        
        console.log(enabledSettings);
        c_filters = new Set(enabledSettings)

        searchProducts($("#search-input")[0].value, b_filters, c_filters)
    });
}

function make_filter(filter) {
    console.log(filter)
    brand_filter = $("#type-filter")[0]


        brand_filter.innerHTML=""
        for (const el of filter) {
            brand_filter.innerHTML += `
            <div class="form-check">
  <input class="form-check-input  border border-dark" type="checkbox" value="${el}" name = "checker">
  <label class="form-check-label" for="defaultCheck1">
    ${el}
  </label>
</div>
<br>
            `


        }

    localStorage.setItem("innerTypeHtml", brand_filter.innerHTML)
    check_for_change();


}
make_filter(category_filters)





function show_filters(){

}



