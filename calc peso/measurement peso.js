 

function parseDecimal(value) { 

  if (!value) return NaN; 

  return Number(String(value).trim().replace(",", ".")); 

} 

 

function formatDateToInputValue(date) { 

  return date.toISOString().split("T")[0]; 

} 

 

function calculateIMC(mass, height) { 

  return mass / (height * height); 

} 

 

function validateMeasurementData(data) { 

  if (!data.measurementDate) return "Informe a data da aferição."; 

  if (!Number.isFinite(data.mass) || data.mass <= 0) return "Informe uma massa válida."; 

  if (!Number.isFinite(data.height) || data.height <= 0) return "Informe uma altura válida."; 

  if (!Number.isFinite(data.abdominalCircumference) || data.abdominalCircumference <= 0) { 

    return "Informe uma circunferência abdominal válida."; 

  } 

  return null; 

} 

 

function fillUserVisualData(user) { 

  const hiddenName = document.getElementById("nome"); 

  const ageField = document.getElementById("idade-visual"); 

  const objectiveField = document.getElementById("objetivo-visual"); 

 

  if (hiddenName) hiddenName.value = user.nome || ""; 

  if (ageField) ageField.value = calculateAge(user.nascimento); 

  if (objectiveField) objectiveField.value = formatObjective(user.objetivo); 

} 

 

function clearMeasurementResultArea() { 

  document.getElementById("imc").value = ""; 

  document.getElementById("status-imc-visual").value = ""; 

  document.getElementById("risco-circunferencia-visual").value = ""; 

  document.getElementById("risco-geral-visual").value = ""; 

 

  const statusBox = document.getElementById("status"); 

  statusBox.className = "alert alert-secondary mt-3 mb-0"; 

  statusBox.textContent = "A lógica de cálculo e classificação será conectada depois."; 

 

  const badge = document.querySelector("#quadro-resultado .badge"); 

  if (badge) { 

    badge.className = "badge badge-secondary"; 

    badge.textContent = "Aguardando cálculo"; 

  } 

 

  const saveButton = document.getElementById("salva-imc"); 

  if (saveButton) { 

    saveButton.disabled = true; 

  } 

} 

 

function buildMeasurementObject(user) { 

  const measurementDate = document.getElementById("data-afericao").value; 

  const mass = parseDecimal(document.getElementById("massa").value); 

  const height = parseDecimal(document.getElementById("altura").value); 

  const abdominalCircumference = parseDecimal(document.getElementById("circunferencia").value); 

 

  const imcValue = calculateIMC(mass, height); 

  const imcRounded = Number(imcValue.toFixed(2)); 

 

  return { 

    userId: user.id, 

    userName: user.nome, 

    measurementDate, 

    mass, 

    height, 

    abdominalCircumference, 

    imc: imcRounded, 

    imcStatus: "Pendente da regra de negócio", 

    abdominalRisk: "Pendente da regra de negócio", 

    generalRisk: "Pendente da regra de negócio", 

    createdAt: new Date().toISOString() 

  }; 

} 

 

 

function showMeasurementCalculation(measurement) { 

  document.getElementById("imc").value = measurement.imc.toFixed(2); 

  document.getElementById("status-imc-visual").value = measurement.imcStatus; 

  document.getElementById("risco-circunferencia-visual").value = measurement.abdominalRisk; 

  document.getElementById("risco-geral-visual").value = measurement.generalRisk; 

 

  const statusBox = document.getElementById("status"); 

  statusBox.className = "alert alert-info mt-3 mb-0"; 

  statusBox.textContent = "IMC calculado com sucesso. As classificações detalhadas serão ligadas quando a regra de negócio for definida."; 

 

  const badge = document.querySelector("#quadro-resultado .badge"); 

  if (badge) { 

    badge.className = "badge badge-info"; 

    badge.textContent = "Cálculo realizado"; 

  } 

 

  const saveButton = document.getElementById("salva-imc"); 

  if (saveButton) { 

    saveButton.disabled = false; 

  } 

} 

 

async function initMeasurementsPage() { 

  const measurementForm = document.getElementById("form-afericao"); 

 

  if (!measurementForm) { 

    return; 

  } 

 

  const currentUser = await getCurrentUser(); 

 

  if (!currentUser) { 

    window.location.href = "index.html"; 

    return; 

  } 

 

  fillUserVisualData(currentUser); 

 

  const measurementDateField = document.getElementById("data-afericao"); 

  const calculateButton = document.getElementById("calcula"); 

  const clearButton = document.getElementById("limpar"); 

  const saveButton = document.getElementById("salva-imc"); 

  const logoutButton = document.getElementById("logout"); 

 

  if (measurementDateField && !measurementDateField.value) { 

    measurementDateField.value = formatDateToInputValue(new Date()); 

  } 

 

  clearMeasurementResultArea(); 

 

  calculateButton.addEventListener("click", function () { 

    const measurementDate = document.getElementById("data-afericao").value; 

    const mass = parseDecimal(document.getElementById("massa").value); 

    const height = parseDecimal(document.getElementById("altura").value); 

    const abdominalCircumference = parseDecimal(document.getElementById("circunferencia").value); 

 

    const error = validateMeasurementData({ 

      measurementDate, 

      mass, 

      height, 

      abdominalCircumference 

    }); 

 

    if (error) { 

      const statusBox = document.getElementById("status"); 

      statusBox.className = "alert alert-danger mt-3 mb-0"; 

      statusBox.textContent = error; 

      saveButton.disabled = true; 

      return; 

    } 

 

    const measurement = buildMeasurementObject(currentUser); 

    showMeasurementCalculation(measurement); 

  }); 

 

  clearButton.addEventListener("click", function () { 

    setTimeout(function () { 

      fillUserVisualData(currentUser); 

      clearMeasurementResultArea(); 

    }, 0); 

  }); 

 

  saveButton.addEventListener("click", async function () { 

    try { 

      const measurement = buildMeasurementObject(currentUser); 

      const newMeasurementId = await addMeasurement(measurement); 

 

      const statusBox = document.getElementById("status"); 

      statusBox.className = "alert alert-success mt-3 mb-0"; 

      statusBox.textContent = "Aferição salva com sucesso. ID: " + newMeasurementId; 

 

      saveButton.disabled = true; 

    } catch (errorObject) { 

      const statusBox = document.getElementById("status"); 

      statusBox.className = "alert alert-danger mt-3 mb-0"; 

      statusBox.textContent = "Erro ao salvar a aferição: " + (errorObject.message || errorObject); 

    } 

  }); 

 

  if (logoutButton) { 

    logoutButton.addEventListener("click", logout); 

  } 

} 

 

document.addEventListener("DOMContentLoaded", function () { 

  initMeasurementsPage(); 

}); 

 

 