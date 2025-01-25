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
        localStorage.setItem("logged_in", "true")
        api.get(`/get_role?user_id=${s.user_id}`).then((res)=>{
          console.log(res.data)
          if (res.status === 200) {
            data = res.data;
            console.log(data)
            if (data && data.length > 0) {
              console.log(data.length, data && data.length > 0)
              if (data === 'admin'){
                console.log(data === 'admin')
                window.location.href = "admin_index.html"
              }
              else{
                if (localStorage.getItem('loadedBefore')){
                  window.location.href = localStorage.getItem('loadedBefore')
                }
                else{
                  window.location.href = 'index.html'
                }
              }
            }
          }
        })
        
        
      } else {
        document.getElementById("products").innerHTML =
          "Please try logging in again";
      }
    });
    }