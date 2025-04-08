const Loginbtn = document.getElementById("Loginbtn");
Loginbtn.addEventListener("click",async(e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user_details = {
        email,
        password
    }
    const url = 'http://localhost:3000/auth/login'
    const obj = {
        method:'POST',
        headers:{
            'Content-Type':"application/json"
        },
        body:JSON.stringify(user_details)
    }
    const response = await fetch(url,obj);
    const data = await response.json();
    console.log(data.JWT_Token);

    if(data.JWT_Token){
       sessionStorage.setItem("Token",data.JWT_Token);
      
        Swal.fire({
            title: `${data.message}`,
            icon: "success",
            confirmButtonColor: "#e50914",
            draggable: true
          }).then(async (result)=>{
            if(result.isConfirmed){
                const url = 'http://localhost:3001/auth/roleBasedAccess';
                const token = sessionStorage.getItem("Token")
                console.log(token);
                const obj = {
                    method:'GET',
                    headers:{
                        'Content-Type':"application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
                let response = await fetch(url,obj);
                let data = await response.json();
                console.log(data);
                console.log(data.redirectTo);
                window.location.href = data.redirectTo
            }else{
                Swal.fire({
                    icon: "error",
                    title: "Invalid Login Credentials",
                    text: "Please check your email and password and try again.",
                    confirmButtonColor: "#e50914",
                    
                  });
            }
          });
    }else{
        console.log(data)
        Swal.fire({
            icon: "error",
            title: `${data.message}`,
            text: `${data.details}`,
            confirmButtonColor: "#e50914",
            
          });
    }  
})