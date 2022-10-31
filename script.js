const apiRequest = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
const button_login = document.getElementById("button-login");
const login_painel = document.getElementById("login");
const button_send_request = document.getElementById("send-message")
const message_text = document.getElementById("text-message")

let name_server = {
    from: "",
    to: "Todos",
    text: "",
    type: "message" // ou "private_message" para o bônus
}

function loginApp(){
    let input_name = document.getElementById("name-login")
    let error_login = document.querySelector(".loading p")
    
    if(input_name.value == ""){
        error_login.textContent = "Este campo não pode estar vazio"
        input_name.style.borderColor = "rgb(255, 0, 0)"

    }else{
        let apiRequestPost = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: input_name.value})
        login_painel.querySelector(".loading").classList.add("hidden")
        login_painel.querySelector("#img").classList.remove("hidden")

        apiRequestPost.then(
            response => {
                name_server.from = input_name.value
                apiRequest.then(
                    response => {
                        login_painel.classList.add("hidden")
                        conectionFrequence(name_server.from)
                    }
                );
            }
        );

        apiRequestPost.catch(
            response => {
                login_painel.querySelector(".loading").classList.remove("hidden")
                login_painel.querySelector("#img").classList.add("hidden")
                error_login.textContent = `Erro${response.response.status}, insira outro nome`;
            }
        );
    }
};

function conectionFrequence(name){
    let conection = setInterval(() => {
        axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {
            name: name
        });
    }, 2000);
}

function loadMensages(msg){
    let element = document.querySelector(".messages");
    element.innerHTML = ""
    
    for(let i = 0; i < msg.data.length; i++){
        if(msg.data[i].type == "status"){
            element.innerHTML += `<li class="status"><span class="message-hour">(${msg.data[i].time})</span>&nbsp;<span class="message-name">${msg.data[i].from}</span>&nbsp;<span>${msg.data[i].text}</span>
            </li>`
            
        }else if(msg.data[i].type == "message" && msg.data[i].to == "Todos"){
            element.innerHTML += `<li class="message"><span class="message-hour">(${msg.data[i].time})</span>&nbsp;<span class="message-name">${msg.data[i].from}</span>&nbsp;para&nbsp;<span class="message-name">${msg.data[i].to}</span>:&nbsp;<span class="text">${msg.data[i].text}</span></li>`

        }
    }
    element.lastChild.scrollIntoView();

};

setInterval(() => {
    let apiRequest = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    apiRequest.then(
        response => loadMensages(response)
    )

}, 3000);

function sendMessage(event){
    if(event.key === "Enter" || event.key === undefined){
        if(message_text.value == ""){
            return
        }else{
            name_server.text = message_text.value
            let message_send = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", name_server)
    
            message_send.then(
                response => {
                    message_text.value = ""
                    console.log(response);
                }
    
            )
        }
    }
}

message_text.addEventListener("keyup", sendMessage)
button_send_request.addEventListener("click", sendMessage);
button_login.addEventListener("click", loginApp);