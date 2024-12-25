function login(form) {
    form.addEventListener("submit", async (e) => {
      let r = {
        username: form.username.value,
        password: form.password.value,
      };
      console.log(r);
      e.preventDefault();

  
      let res = await axios.post(`${api_url}/login`, r);
  
      let s = await res.data;
  
      let token = s["access_token"],
        r_token = s["refresh_token"];
  
      localStorage.setItem("access_token", token);
      localStorage.setItem("refresh_token", r_token);
      localStorage.setItem("user_name", r.username)
      if (res.status === 200) {
        window.history.back()
        
      } else {
        document.getElementById("products").innerHTML =
          "Please try logging in again";
      }
    });
    }