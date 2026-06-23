 

const SESSION_KEY = "imc_current_user_id"; 

 

function showMessage(element, type, text) { 

  if (!element) return; 

 

  element.className = "alert alert-" + type + " mb-0"; 

  element.textContent = text; 

} 

 

function hideMessage(element) { 

  if (!element) return; 

 

  element.className = "alert invisible mb-0"; 

  element.textContent = ""; 

} 

 

function normalizeEmail(email) { 

  return String(email || "").trim().toLowerCase(); 

} 

 

async function hashPassword(password) { 

  const encoder = new TextEncoder(); 

  const data = encoder.encode(password); 

  const hashBuffer = await crypto.subtle.digest("SHA-256", data); 

  const hashArray = Array.from(new Uint8Array(hashBuffer)); 

  return hashArray.map(item => item.toString(16).padStart(2, "0")).join(""); 

} 

 

function setCurrentUserId(userId) { 

  localStorage.setItem(SESSION_KEY, String(userId)); 

} 

 

function getCurrentUserId() { 

  const value = localStorage.getItem(SESSION_KEY); 

 

  if (!value) { 

    return null; 

  } 

 

  return Number(value); 

} 

 

function clearCurrentUserId() { 

  localStorage.removeItem(SESSION_KEY); 

} 

 

async function getCurrentUser() { 

  const currentUserId = getCurrentUserId(); 

 

  if (!currentUserId) { 

    return null; 

  } 

 

  return await getUserById(currentUserId); 

} 

 

function calculateAge(dateString) { 

  if (!dateString) return ""; 

 

  const birthDate = new Date(dateString + "T00:00:00"); 

  const today = new Date(); 

 

  let age = today.getFullYear() - birthDate.getFullYear(); 

  const monthDifference = today.getMonth() - birthDate.getMonth(); 

 

  if ( 

    monthDifference < 0 || 

    (monthDifference === 0 && today.getDate() < birthDate.getDate()) 

  ) { 

    age--; 

  } 

 

  return age; 

} 

 

function formatObjective(value) { 

  if (value === "ganhar_massa") return "Ganhar massa"; 

  if (value === "reduzir_massa") return "Reduzir massa"; 

  return ""; 

} 

 

function validateRegisterData(data) { 

  if (!data.email) return "Informe um e-mail."; 

  if (!data.email.includes("@")) return "Informe um e-mail válido."; 

  if (!data.password) return "Informe uma senha."; 

  if (data.password.length < 6) return "A senha deve ter pelo menos 6 caracteres."; 

  if (data.password !== data.passwordConfirmation) return "As senhas não conferem."; 

  if (!data.nome) return "Informe o nome completo."; 

  if (!data.genero) return "Selecione o gênero."; 

  if (!data.nascimento) return "Informe a data de nascimento."; 

  if (!data.objetivo) return "Selecione o objetivo."; 

  return null; 

} 

 

function validateLoginData(email, password) { 

  if (!email) return "Informe o e-mail."; 

  if (!password) return "Informe a senha."; 

  return null; 

} 

 

function initRegisterPage() { 

  const btnSalvar = document.getElementById("salva"); 

  const btnVoltar = document.getElementById("voltar"); 

  const messageBox = document.getElementById("erro"); 

 

  if (!btnSalvar) return; 

 

  hideMessage(messageBox); 

 

  btnSalvar.addEventListener("click", async function () { 

    hideMessage(messageBox); 

 

    const email = normalizeEmail(document.getElementById("email").value); 

    const password = document.getElementById("senha").value; 

    const passwordConfirmation = document.getElementById("resenha").value; 

    const nome = document.getElementById("nome").value.trim(); 

    const generoSelecionado = document.querySelector("input[name='genero']:checked"); 

    const nascimento = document.getElementById("nascimento").value; 

    const objetivo = document.getElementById("objetivo").value; 

 

    const formData = { 

      email, 

      password, 

      passwordConfirmation, 

      nome, 

      genero: generoSelecionado ? generoSelecionado.value : "", 

      nascimento, 

      objetivo 

    }; 

 

    const error = validateRegisterData(formData); 

 

    if (error) { 

      showMessage(messageBox, "danger", error); 

      return; 

    } 

 

    btnSalvar.disabled = true; 

    btnSalvar.textContent = "Salvando..."; 

 

    try { 

      const existingUser = await getUserByEmail(email); 

 

      if (existingUser) { 

        showMessage(messageBox, "warning", "Este e-mail já está cadastrado."); 

        return; 

      } 

 

      const passwordHash = await hashPassword(password); 

 

      const user = { 

        email, 

        passwordHash, 

        nome, 

        genero: formData.genero, 

        nascimento, 

        objetivo, 

        createdAt: new Date().toISOString() 

      }; 

 

      await addUser(user); 

 

      showMessage(messageBox, "success", "Cadastro realizado com sucesso. Você será enviado para o login."); 

 

      setTimeout(function () { 

        window.location.href = "index.html"; 

      }, 1200); 

    } catch (errorObject) { 

      if (errorObject && errorObject.name === "ConstraintError") { 

        showMessage(messageBox, "warning", "Este e-mail já está cadastrado."); 

      } else { 

        showMessage(messageBox, "danger", "Erro ao salvar cadastro: " + (errorObject.message || errorObject)); 

      } 

    } finally { 

      btnSalvar.disabled = false; 

      btnSalvar.textContent = "Salvar"; 

    } 

  }); 

 

  if (btnVoltar) { 

    btnVoltar.addEventListener("click", function () { 

      window.location.href = "index.html"; 

    }); 

  } 

} 

 

function initLoginPage() { 

  const btnEntrar = document.getElementById("entra"); 

  const btnCadastrar = document.getElementById("cadastra"); 

  const messageBox = document.getElementById("erro"); 

 

  if (!btnEntrar) return; 

 

  hideMessage(messageBox); 

 

  getCurrentUser().then(function (user) { 

    if (user) { 

      window.location.href = "IMCcalc.html"; 

    } 

  }); 

 

  btnEntrar.addEventListener("click", async function () { 

    hideMessage(messageBox); 

 

    const email = normalizeEmail(document.getElementById("email").value); 

    const password = document.getElementById("senha").value; 

 

    const error = validateLoginData(email, password); 

 

    if (error) { 

      showMessage(messageBox, "danger", error); 

      return; 

    } 

 

    btnEntrar.disabled = true; 

    btnEntrar.textContent = "Entrando..."; 

 

    try { 

      const user = await getUserByEmail(email); 

 

      if (!user) { 

        showMessage(messageBox, "warning", "Usuário não encontrado."); 

        return; 

      } 

 

      const informedPasswordHash = await hashPassword(password); 

 

      if (user.passwordHash !== informedPasswordHash) { 

        showMessage(messageBox, "danger", "Senha incorreta."); 

        return; 

      } 

 

      setCurrentUserId(user.id); 

      window.location.href = "IMCcalc.html"; 

    } catch (errorObject) { 

      showMessage(messageBox, "danger", "Erro ao fazer login: " + (errorObject.message || errorObject)); 

    } finally { 

      btnEntrar.disabled = false; 

      btnEntrar.textContent = "Entrar"; 

    } 

  }); 

 

  if (btnCadastrar) { 

    btnCadastrar.addEventListener("click", function () { 

      window.location.href = "register.html"; 

    }); 

  } 

} 

 

function logout() { 

  clearCurrentUserId(); 

  window.location.href = "index.html"; 

} 

 

document.addEventListener("DOMContentLoaded", function () { 

  initLoginPage(); 

  initRegisterPage(); 

}); 

 

 