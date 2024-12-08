let redirect = function (page) {window.location.href = page}
let check_response = function (res){
    if (!res.ok){
        redirect("login.html")
    }
}