const Signinbtn = document.getElementById("Signinbtn");
Signinbtn.addEventListener("click",async(e)=>{
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmpassword = document.getElementById("confirmpassword").value;

    const user_details = {
        username,
        email,
        password,
        confirmpassword
    }
    
    const url = 'https://cinipulse.onrender.com/auth/register';
    const obj = {
        method:'POST',
        headers:{
            'Content-Type':"application/json"
        },
        body:JSON.stringify(user_details)
    }
    const response = await fetch(url,obj);
    const data = await response.json();
    if(data.message == 'User Registered Succefully'){
        Swal.fire({
            title: `${data.message}`,
            icon: "success",
            confirmButtonColor: "#e50914",
            draggable: true
          }).then(async (result)=>{
            if(result.isConfirmed){
                location.href = '../../Views/Login.html';
            }
          })
    }else{
        Swal.fire({
            icon: "error",
            title: "Invalid Login Credentials",
            text: "Please check your email and password and try again.",
            confirmButtonColor: "#e50914",
            
          });
    }
    
})