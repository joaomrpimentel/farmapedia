// Base de dados de interações medicamentosas
const interactionsDatabase = [
    {
      medicines: ["Paracetamol", "Ibuprofeno"],
      description:
        "Tomar paracetamol e ibuprofeno juntos pode aumentar o risco de efeitos colaterais renais e gastrointestinais. No entanto, em doses adequadas e por curtos períodos, essa combinação é frequentemente usada para controle da dor.",
      severity: "low",
    },
    {
      medicines: ["Paracetamol", "Dipirona"],
      description:
        "Não há interações significativas conhecidas entre paracetamol e dipirona. No entanto, ambos são analgésicos e antipiréticos, então tomar os dois juntos pode não oferecer benefício adicional significativo.",
      severity: "low",
    },
    {
      medicines: ["Ibuprofeno", "Aspirina"],
      description:
        "Tomar ibuprofeno e aspirina juntos pode reduzir os efeitos cardioprotetores da aspirina e aumentar o risco de problemas gastrointestinais, como úlceras e sangramento.",
      severity: "moderate",
    },
    {
      medicines: ["Amoxicilina", "Álcool"],
      description:
        "O consumo de álcool durante o tratamento com amoxicilina pode causar efeitos colaterais como náuseas, vômitos, dores de cabeça e possivelmente reduzir a eficácia do antibiótico.",
      severity: "moderate",
    },
    {
      medicines: ["Omeprazol", "Clopidogrel"],
      description:
        "O omeprazol pode reduzir a eficácia do clopidogrel, aumentando o risco de eventos cardiovasculares em pacientes que tomam clopidogrel para prevenir coágulos sanguíneos.",
      severity: "high",
    },
    {
      medicines: ["Varfarina", "Aspirina"],
      description:
        "A combinação de varfarina e aspirina aumenta significativamente o risco de sangramento, pois ambos os medicamentos afetam a coagulação sanguínea.",
      severity: "high",
    },
    {
      medicines: ["Fluoxetina", "Tramadol"],
      description:
        "Esta combinação aumenta o risco de síndrome serotoninérgica, uma condição potencialmente fatal caracterizada por agitação, alucinações, batimentos cardíacos rápidos, febre, reflexos exagerados, tremores e outros sintomas.",
      severity: "high",
    },
    {
      medicines: ["Amoxicilina", "Contraceptivos Orais"],
      description:
        "A amoxicilina pode reduzir a eficácia dos contraceptivos orais, aumentando o risco de gravidez não planejada. Recomenda-se o uso de métodos contraceptivos adicionais durante o tratamento com antibióticos.",
      severity: "moderate",
    },
    {
      medicines: ["Ibuprofeno", "Diclofenaco"],
      description:
        "Tomar dois anti-inflamatórios não esteroidais (AINEs) juntos aumenta significativamente o risco de efeitos colaterais gastrointestinais, como úlceras e sangramento, sem proporcionar benefício analgésico adicional significativo.",
      severity: "high",
    },
    {
      medicines: ["Omeprazol", "Ferro"],
      description:
        "O omeprazol pode reduzir a absorção de ferro, potencialmente levando a deficiência de ferro em tratamentos prolongados. Recomenda-se tomar suplementos de ferro pelo menos 2 horas antes ou 4 horas após o omeprazol.",
      severity: "low",
    },
    {
      medicines: ["Metformina", "Álcool"],
      description:
        "O consumo de álcool durante o tratamento com metformina aumenta o risco de hipoglicemia (baixo nível de açúcar no sangue) e acidose láctica, uma condição rara mas grave.",
      severity: "moderate",
    },
    {
      medicines: ["Azitromicina", "Amoxicilina"],
      description:
        "Não há interações significativas conhecidas entre azitromicina e amoxicilina. No entanto, tomar dois antibióticos simultaneamente sem orientação médica não é recomendado, pois pode aumentar o risco de efeitos colaterais sem benefício adicional.",
      severity: "low",
    },
    {
      medicines: ["Loratadina", "Dipirona"],
      description:
        "Não há interações significativas conhecidas entre loratadina e dipirona. Estes medicamentos podem ser tomados juntos com segurança quando necessário.",
      severity: "low",
    },
    {
      medicines: ["Dexametasona", "Ibuprofeno"],
      description:
        "A combinação de dexametasona e ibuprofeno aumenta o risco de efeitos colaterais gastrointestinais, como úlceras e sangramento. Se esta combinação for necessária, deve ser usada pelo menor tempo possível e com monitoramento médico.",
      severity: "moderate",
    },
    {
      medicines: ["Dipirona", "Ibuprofeno"],
      description:
        "Tomar dipirona e ibuprofeno juntos aumenta o risco de efeitos colaterais renais e gastrointestinais. Esta combinação deve ser evitada ou usada com cautela e por curtos períodos.",
      severity: "moderate",
    },
  ]
  
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
  
  // Funções de manipulação de dados
  function loadMedicines() {
    const storedMedicines = localStorage.getItem("medicines")
    const medicines = storedMedicines ? JSON.parse(storedMedicines) : []
  
    // Limpar o seletor
    elements.medicineSelector.innerHTML = '<option value="">Selecione um medicamento...</option>'
  
    // Adicionar medicamentos ao seletor
    medicines.forEach((medicine) => {
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
    }, 1500)
  }
  
  function findInteractions(medicinesList) {
    const interactions = []
  
    // Para cada par de medicamentos, verificar se há interação
    for (let i = 0; i < medicinesList.length; i++) {
      for (let j = i + 1; j < medicinesList.length; j++) {
        const medicine1 = medicinesList[i]
        const medicine2 = medicinesList[j]
  
        // Verificar na base de dados
        const interaction = interactionsDatabase.find(
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
  
  // Funções de UI
  function showToast(message) {
    const toast = document.createElement("div")
    toast.className = "toast"
    toast.innerHTML = `<div class="toast-content"><p>${message}</p></div>`
  
    document.body.appendChild(toast)
  
    // Mostrar o toast
    setTimeout(() => {
      toast.classList.add("active")
    }, 100)
  
    // Esconder e remover o toast
    setTimeout(() => {
      toast.classList.remove("active")
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }
  
  // Event Listeners
  function setupEventListeners() {
    elements.addMedicineBtn.addEventListener("click", addMedicineToSelection)
    elements.checkInteractionsBtn.addEventListener("click", checkInteractions)
  
    // Permitir adicionar medicamento pressionando Enter no seletor
    elements.medicineSelector.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addMedicineToSelection()
      }
    })
  }
  
  // Inicialização
  document.addEventListener("DOMContentLoaded", () => {
    // Inicializar ícones Lucide
    const lucide = window.lucide
    lucide.createIcons()
  
    // Carregar medicamentos do localStorage
    loadMedicines()
  
    // Renderizar lista vazia de medicamentos selecionados
    renderSelectedMedicines()
  
    // Configurar event listeners
    setupEventListeners()
  })
  