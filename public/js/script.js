loginForm = document.querySelector('#login-form')
submitButton = document.querySelector("#username-and-password-submit");
inputUsername = document.querySelector('#username');
inputPassword = document.querySelector('#password');
inputRole = document.querySelector('.role-selector');
errorUsername = document.querySelector('#username-error');
errorPassword = document.querySelector('#password-error');

async function getApiToken() {
    const api = await fetch("../API_token/api.txt")
        .then(res => res.text())
        .then(text => text)
        .catch(e => console.error(e));
    return api;
}

function createP(s) {
    display = document.createElement("p");
    display.textContent = s;
    return display;
}

function resetForm() {
    inputUsername.value = ""
    inputPassword.value = ""
    submitButton.disabled = true;
}


async function call_REST_API_Hello() {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const displayID = document.querySelector("#id-info");
    const url = "https://restapi.tu.ac.th/api/v1/auth/Ad/verify"
    const API_KEY = "TU25a63c0977c9aa0ad9c54a14ba0d2411c9af040827378717db1a65c4fbb69d637f1c13ca83aa4d92d78c22ea85c79a73"

    resetForm();

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Application-Key": `${API_KEY}`
        },
        body: JSON.stringify({
            "UserName": username,
            "PassWord": password
        })

    })
        .then(response => response.json())
        .then(text => {
            if (text.status === true) {
                if (inputRole.value === "student") {
                    fetch(`https://restapi.tu.ac.th/api/v2/profile/std/info/?id=${text.username}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Application-Key": `${API_KEY}`
                        },
                    })
                        .then(res => res.json())
                        .then(text => {
                            if (text.status === true) {
                                console.log(text);
                                displayID.innerHTML = "";

                                displayID.appendChild(createP(`ชื่อ: ${text.data.displayname_th}`));
                                displayID.appendChild(createP(`รหัสนักศึกษา: ${text.data.userName}`));
                                displayID.appendChild(createP(`สาขา: ${text.data.department}`));
                                displayID.appendChild(createP(`คณะ: ${text.data.faculty}`));

                                document.querySelector(".login-container").classList.add("after-login");
                                document.querySelector("#id-container").classList.add("visible");
                            } else {
                                displayID.innerHTML = "";
                                alert(text.message);

                                document.querySelector("#id-container").classList.remove("visible");
                                document.querySelector(".login-container").classList.remove("after-login");
                            }

                        })
                        .catch(e => {
                            console.error(e)
                            displayID.innerHTML = "";

                            document.querySelector("#id-container").classList.remove("visible");
                            document.querySelector(".login-container").classList.remove("after-login");
                        });
                } else {
                    fetch(`https://restapi.tu.ac.th/api/v2/profile/Instructors/info/?Email=${text.email}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Application-Key": `${API_KEY}`
                        },
                    })
                        .then(res => res.json())
                        .then(text => {
                            if (text.status === true) {
                                console.log(text);
                                displayID.innerHTML = "";

                                document.querySelector("h2").textContent = "ข้อมูลบุคลากร";

                                displayID.appendChild(createP(`ชื่อ: ${text.First_Name_Th} ${text.Last_Name_Th}`));
                                displayID.appendChild(createP(`แผนก: ${text.department}`));
                                displayID.appendChild(createP(`สังกัด: ${text.faculty}`));

                                document.querySelector(".login-container").classList.add("after-login");
                                document.querySelector("#id-container").classList.add("visible");
                            } else {
                                displayID.innerHTML = "";
                                alert(text.message);

                                document.querySelector("#id-container").classList.remove("visible");
                                document.querySelector(".login-container").classList.remove("after-login");
                            }
                        })
                        .catch(e => {
                            console.error(e)
                            displayID.innerHTML = "";

                            document.querySelector("#id-container").classList.remove("visible");
                            document.querySelector(".login-container").classList.remove("after-login");
                        });
                }

            } else {

                console.log(text);
                displayID.innerHTML = "";
                alert(text.message);

                document.querySelector("#id-container").classList.remove("visible");
                document.querySelector(".login-container").classList.remove("after-login");
            }
        })
        .catch(e => console.error(e));

}





function displayUsernameError(s) {
    console.log('username invalid');
    errorUsername.style.display = 'block';
    errorUsername.textContent = s;
}
function displayPasswordError(s) {
    console.log('password invalid');
    errorPassword.style.display = 'block';
    errorPassword.textContent = s;
}


checkEmptyUsername = function () {
    errorUsername.style.display = 'none';

    if (!inputUsername.value) {
        displayUsernameError("Your username can't be empty");
    }
}
checkEmptyPassword = function () {
    errorPassword.style.display = 'none';

    if (!inputPassword.value) {
        displayPasswordError("Your password can't be empty");
    }
}

checkEmptyRole = function () {

    if (inputRole.value === 'empty') {
    }
}

checkAll = function () {
    submitButton.disabled = false;
    if (!inputUsername.value || !inputPassword.value || inputRole.value === 'empty') {
        submitButton.disabled = true;
    }
}

submitButton.disabled = true;
loginForm.addEventListener("input", checkAll);
inputUsername.addEventListener("change", checkEmptyUsername);
inputPassword.addEventListener("change", checkEmptyPassword);
inputRole.addEventListener("input", checkEmptyRole);

document.querySelector("#show-password").addEventListener("change", function () {
    if (document.querySelector("#show-password").checked) {
        inputPassword.type = "text";
    } else {
        inputPassword.type = "password";
    }
});
submitButton.addEventListener("click", call_REST_API_Hello);


