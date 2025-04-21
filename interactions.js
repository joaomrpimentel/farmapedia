// Elementos DOM
const elements = {
    medicineSelector: document.getElementById("medicine-selector"),
    selectedMedicines: document.getElementById("selected-medicines"),
    addMedicineBtn: document.getElementById("add-medicine-btn"),
    checkInteractionsBtn: document.getElementById("check-interactions-btn"),
    interactionsResults: document.getElementById("interactions-results"),
    noInteractionsMessage: document.getElementById("no-interactions-message"),
    loadingIndicator: document.getElementById("loading-indicator"),
  }
  
  // Estado da aplicação
  let selectedMedicinesList = []
  let medicinesData = []
  let interactionsData = []
  
  // Funções de carregamento de dados
  async function loadDatabases() {
    try {
      // Mostrar indicador de carregamento
      elements.loadingIndicator.style.display = "flex"
  
      const medicinesResponse = await fetch("medicines-db.json")
      const medicinesJson = await medicinesResponse.json()
      medicinesData = medicinesJson.medicines
  
      const interactionsResponse = await fetch("interactions-db.json")
      const interactionsJson = await interactionsResponse.json()
      interactionsData = interactionsJson.interactions
      populateMedicineSelector()
  
      elements.loadingIndicator.style.display = "none"
      
    } catch (error) {
      console.error("Erro ao carregar bancos de dados:", error)
      showToast("Erro ao carregar dados. Por favor, recarregue a página.")
      elements.loadingIndicator.style.display = "none"
    }
  }
  
  function populateMedicineSelector() {
    // Limpar o seletor
    elements.medicineSelector.innerHTML = '<option value="">Selecione um medicamento...</option>'
  
    // Adicionar medicamentos ao seletor em ordem alfabética
    medicinesData
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .forEach((medicine) => {
        const option = document.createElement("option")
        option.value = medicine.nome
        option.textContent = medicine.nome
        elements.medicineSelector.appendChild(option)
      })
  }
  
  function addMedicineToSelection() {
    const medicineName = elements.medicineSelector.value
  
    if (!medicineName) {
      showToast("Por favor, selecione um medicamento")
      return
    }
  
    if (selectedMedicinesList.includes(medicineName)) {
      showToast("Este medicamento já foi selecionado")
      return
    }
  
    selectedMedicinesList.push(medicineName)
    renderSelectedMedicines()
    elements.medicineSelector.value = ""
  }
  
  function removeMedicineFromSelection(medicineName) {
    selectedMedicinesList = selectedMedicinesList.filter((name) => name !== medicineName)
    renderSelectedMedicines()
  }
  
  function renderSelectedMedicines() {
    elements.selectedMedicines.innerHTML = ""
  
    if (selectedMedicinesList.length === 0) {
      const emptyMessage = document.createElement("p")
      emptyMessage.textContent = "Nenhum medicamento selecionado"
      emptyMessage.style.color = "var(--gray-500)"
      emptyMessage.style.fontStyle = "italic"
      elements.selectedMedicines.appendChild(emptyMessage)
      return
    }
  
    selectedMedicinesList.forEach((medicineName) => {
      const pill = document.createElement("div")
      pill.className = "selected-medicine-pill"
      pill.innerHTML = `
        ${medicineName}
        <button class="remove-medicine" data-medicine="${medicineName}">
          <i data-lucide="x"></i>
        </button>
      `
      elements.selectedMedicines.appendChild(pill)
    })
  
    // Inicializar ícones Lucide
    const lucide = window.lucide
    lucide.createIcons()
  
    // Adicionar eventos de remoção
    const removeButtons = document.querySelectorAll(".remove-medicine")
    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const medicineName = button.dataset.medicine
        removeMedicineFromSelection(medicineName)
      })
    })
  }
  
  function checkInteractions() {
    if (selectedMedicinesList.length < 2) {
      showToast("Selecione pelo menos dois medicamentos para verificar interações")
      return
    }
  
    // Mostrar indicador de carregamento
    elements.loadingIndicator.style.display = "flex"
    elements.interactionsResults.innerHTML = ""
    elements.noInteractionsMessage.style.display = "none"
  
    // Simular um pequeno atraso para dar feedback visual
    setTimeout(() => {
      const interactions = findInteractions(selectedMedicinesList)
      renderInteractionsResults(interactions)
      elements.loadingIndicator.style.display = "none"
    }, 1000)
  }
  
  function findInteractions(medicinesList) {
    const interactions = []
  

    for (let i = 0; i < medicinesList.length; i++) {
      for (let j = i + 1; j < medicinesList.length; j++) {
        const medicine1 = medicinesList[i]
        const medicine2 = medicinesList[j]
  
        const interaction = interactionsData.find(
          (item) => item.medicines.includes(medicine1) && item.medicines.includes(medicine2),
        )
  
        if (interaction) {
          interactions.push({
            medicine1,
            medicine2,
            description: interaction.description,
            severity: interaction.severity,
          })
        }
      }
    }
  
    return interactions
  }
  
  function renderInteractionsResults(interactions) {
    elements.interactionsResults.innerHTML = ""
  
    if (interactions.length === 0) {
      elements.noInteractionsMessage.style.display = "flex"
      return
    }
  
    const severityOrder = { high: 0, moderate: 1, low: 2 }
    interactions.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
  
    interactions.forEach((interaction) => {
      const card = document.createElement("div")
      card.className = "interaction-card"
  
      let severityText = "Baixa"
      if (interaction.severity === "moderate") severityText = "Moderada"
      if (interaction.severity === "high") severityText = "Alta"
  
      card.innerHTML = `
        <div class="interaction-header">
          <i data-lucide="alert-triangle"></i>
          <h3>Interação Medicamentosa</h3>
        </div>
        <div class="interaction-content">
          <div class="interaction-medicines">
            <span class="interaction-medicine">${interaction.medicine1}</span>
            <i data-lucide="arrow-right" class="interaction-icon"></i>
            <span class="interaction-medicine">${interaction.medicine2}</span>
          </div>
          <p class="interaction-description">${interaction.description}</p>
          <span class="interaction-severity severity-${interaction.severity}">Severidade: ${severityText}</span>
        </div>
      `
  
      elements.interactionsResults.appendChild(card)
    })
  
    // Inicializar ícones Lucide
    const lucide = window.lucide
    lucide.createIcons()
  }
  
  function showToast(message) {
    const toast = document.createElement("div")
    toast.className = "toast"
    toast.innerHTML = `<div class="toast-content"><p>${message}</p></div>`
  
    document.body.appendChild(toast)
  
    setTimeout(() => {
      toast.classList.add("active")
    }, 100)
  
    setTimeout(() => {
      toast.classList.remove("active")
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }
  
  function setupEventListeners() {
    elements.addMedicineBtn.addEventListener("click", addMedicineToSelection)
    elements.checkInteractionsBtn.addEventListener("click", checkInteractions)
    elements.medicineSelector.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addMedicineToSelection()
      }
    })
  }
  

  document.addEventListener("DOMContentLoaded", async () => {

    const lucide = window.lucide
    lucide.createIcons()
    await loadDatabases()
    renderSelectedMedicines()
  
    setupEventListeners()
  })
  