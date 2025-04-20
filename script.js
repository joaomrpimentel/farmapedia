// Elementos DOM
const pages = {
  home: document.getElementById("home-page"),
  detail: document.getElementById("detail-page"),
  add: document.getElementById("add-page"),
  edit: document.getElementById("edit-page"),
  education: document.getElementById("education-page"),
}

const elements = {
  medicinesList: document.getElementById("medicines-list"),
  emptyState: document.getElementById("empty-state"),
  searchInput: document.getElementById("search-input"),
  addButton: document.getElementById("add-button"),

  // Detalhes
  detailName: document.getElementById("detail-name"),
  detailDescription: document.getElementById("detail-description"),
  detailDosage: document.getElementById("detail-dosage"),
  detailUsage: document.getElementById("detail-usage"),
  detailSideEffects: document.getElementById("detail-side-effects"),
  detailContraindications: document.getElementById("detail-contraindications"),
  detailBack: document.getElementById("detail-back"),
  editButton: document.getElementById("edit-button"),
  deleteButton: document.getElementById("delete-button"),

  // Formulário de adição
  addForm: document.getElementById("add-form"),
  addBack: document.getElementById("add-back"),

  // Formulário de edição
  editForm: document.getElementById("edit-form"),
  editId: document.getElementById("edit-id"),
  editName: document.getElementById("edit-name"),
  editDescription: document.getElementById("edit-description"),
  editDosage: document.getElementById("edit-dosage"),
  editUsage: document.getElementById("edit-usage"),
  editSideEffects: document.getElementById("edit-side-effects"),
  editContraindications: document.getElementById("edit-contraindications"),
  editBack: document.getElementById("edit-back"),

  // Modal de exclusão
  deleteModal: document.getElementById("delete-modal"),
  cancelDelete: document.getElementById("cancel-delete"),
  confirmDelete: document.getElementById("confirm-delete"),

  // Toast
  toast: document.getElementById("toast"),
  toastMessage: document.getElementById("toast-message"),
}

// Estado da aplicação
let medicines = []
let currentMedicineId = null
let currentCategory = "all" // Categoria atual selecionada

// Funções de navegação
function navigateTo(pageId) {
  // Se for a página educacional, redirecionar para education.html
  if (pageId === "education") {
    window.location.href = "education.html"
    return
  }

  Object.values(pages).forEach((page) => {
    page.classList.remove("active")
  })
  pages[pageId].classList.add("active")

  // Atualizar botões de navegação inferior
  const navButtons = document.querySelectorAll(".nav-button")
  navButtons.forEach((button) => {
    if (button.dataset.page === pageId) {
      button.classList.add("active")
    } else {
      button.classList.remove("active")
    }
  })

  // Scroll para o topo
  window.scrollTo(0, 0)
}

// Funções de manipulação de dados
function loadMedicines() {
  const storedMedicines = localStorage.getItem("medicines")
  medicines = storedMedicines ? JSON.parse(storedMedicines) : []
  renderMedicinesList()
}

function saveMedicines() {
  localStorage.setItem("medicines", JSON.stringify(medicines))
}

// Adicionar categoria ao estado da aplicação

// Atualizar a função de adição de medicamento para incluir categoria
function addMedicine(medicine) {
  // Garantir que a categoria esteja definida
  if (!medicine.categoria) {
    medicine.categoria = "outro"
  }
  medicines.push(medicine)
  saveMedicines()
  showToast("Medicamento adicionado com sucesso")
}

function updateMedicine(updatedMedicine) {
  const index = medicines.findIndex((med) => med.id === updatedMedicine.id)
  if (index !== -1) {
    medicines[index] = updatedMedicine
    saveMedicines()
    showToast("Medicamento atualizado com sucesso")
  }
}

function deleteMedicine(id) {
  medicines = medicines.filter((med) => med.id !== id)
  saveMedicines()
  showToast("Medicamento excluído com sucesso")
}

// Funções de renderização
// Atualizar a função renderMedicinesList para filtrar por categoria
function renderMedicinesList() {
  const searchTerm = elements.searchInput.value.toLowerCase()
  let filteredMedicines = medicines.filter((medicine) => medicine.nome.toLowerCase().includes(searchTerm))

  // Filtrar por categoria se não for "all"
  if (currentCategory !== "all") {
    filteredMedicines = filteredMedicines.filter((medicine) => medicine.categoria === currentCategory)
  }

  elements.medicinesList.innerHTML = ""

  if (filteredMedicines.length === 0) {
    elements.medicinesList.style.display = "none"
    elements.emptyState.style.display = "block"

    // Atualizar texto do estado vazio com base na pesquisa
    const emptyTitle = elements.emptyState.querySelector(".empty-title")
    const emptySubtitle = elements.emptyState.querySelector(".empty-subtitle")

    if (searchTerm || currentCategory !== "all") {
      emptyTitle.textContent = "Nenhum medicamento encontrado"
      emptySubtitle.style.display = "none"
    } else {
      emptyTitle.textContent = "Nenhum medicamento cadastrado"
      emptySubtitle.style.display = "block"
    }
  } else {
    elements.medicinesList.style.display = "flex"
    elements.emptyState.style.display = "none"

    filteredMedicines.forEach((medicine) => {
      const card = document.createElement("div")
      card.className = "medicine-card"
      card.dataset.id = medicine.id

      // Gerar ícone aleatório mas consistente com base no ID
      const iconIndex = Number.parseInt(medicine.id.substring(medicine.id.length - 2), 10) % 4
      const icons = ["pill", "pill", "flask-round", "stethoscope"]
      const icon = icons[iconIndex]

      // Obter nome da categoria para exibição
      const categoryName = getCategoryName(medicine.categoria || "outro")
      const categoryIcon = getCategoryIcon(medicine.categoria || "outro")

      card.innerHTML = `
        <div class="medicine-icon">
          <i data-lucide="${icon}"></i>
        </div>
        <div class="medicine-info">
          <h3>${medicine.nome}</h3>
          <p>${medicine.descricao || "Sem descrição"}</p>
          <div style="text-align: right;">
            <div class="category-badge">
              <i data-lucide="${categoryIcon}"></i>
              ${categoryName}
            </div>
          </div>
        </div>
      `

      card.addEventListener("click", () => {
        showMedicineDetails(medicine.id)
      })

      elements.medicinesList.appendChild(card)
    })

    // Adicionar um espaçador no final da lista para evitar que o último item seja cortado
    const spacer = document.createElement("div")
    spacer.className = "list-spacer"
    elements.medicinesList.appendChild(spacer)

    // Inicializar ícones Lucide após adicionar ao DOM
    const lucide = window.lucide
    lucide.createIcons()
  }
}

// Função para obter o nome da categoria
function getCategoryName(categoryId) {
  const categories = {
    analgesico: "Analgésico",
    antibiotico: "Antibiótico",
    "anti-inflamatorio": "Anti-inflamatório",
    outro: "Outro",
  }
  return categories[categoryId] || "Outro"
}

// Função para obter o ícone da categoria
function getCategoryIcon(categoryId) {
  const icons = {
    analgesico: "pill",
    antibiotico: "flask-round",
    "anti-inflamatorio": "heart-pulse",
    outro: "package",
  }
  return icons[categoryId] || "package"
}

// Atualizar a função showMedicineDetails para mostrar a categoria
function showMedicineDetails(id) {
  currentMedicineId = id
  const medicine = medicines.find((med) => med.id === id)

  if (!medicine) {
    navigateTo("home")
    return
  }

  elements.detailName.textContent = medicine.nome
  elements.detailDescription.textContent = medicine.descricao || "Não informado"
  elements.detailDosage.textContent = medicine.dosagem || "Não informado"
  elements.detailUsage.textContent = medicine.uso || "Não informado"
  elements.detailSideEffects.textContent = medicine.efeitosColaterais || "Não informado"
  elements.detailContraindications.textContent = medicine.contraindicacoes || "Não informado"

  // Adicionar categoria ao cabeçalho do medicamento
  const medicineHeader = document.querySelector(".medicine-header")
  const existingBadge = medicineHeader.querySelector(".category-badge")
  if (existingBadge) {
    existingBadge.remove()
  }

  const categoryBadge = document.createElement("div")
  categoryBadge.className = "category-badge"
  categoryBadge.innerHTML = `
    <i data-lucide="${getCategoryIcon(medicine.categoria || "outro")}"></i>
    ${getCategoryName(medicine.categoria || "outro")}
  `

  medicineHeader.appendChild(categoryBadge)
  const lucide = window.lucide
  lucide.createIcons()

  navigateTo("detail")
}

// Atualizar a função populateEditForm para incluir categoria
function populateEditForm(id) {
  const medicine = medicines.find((med) => med.id === id)

  if (!medicine) {
    navigateTo("home")
    return
  }

  elements.editId.value = medicine.id
  elements.editName.value = medicine.nome
  elements.editDescription.value = medicine.descricao || ""
  elements.editDosage.value = medicine.dosagem || ""
  elements.editUsage.value = medicine.uso || ""
  elements.editSideEffects.value = medicine.efeitosColaterais || ""
  elements.editContraindications.value = medicine.contraindicacoes || ""

  // Definir a categoria no formulário
  const categorySelect = document.getElementById("edit-category")
  categorySelect.value = medicine.categoria || "outro"

  navigateTo("edit")
}

// Funções de UI
function showToast(message) {
  elements.toastMessage.textContent = message
  elements.toast.classList.add("active")

  setTimeout(() => {
    elements.toast.classList.remove("active")
  }, 3000)
}

function showDeleteModal() {
  elements.deleteModal.classList.add("active")
}

function hideDeleteModal() {
  elements.deleteModal.classList.remove("active")
}

// Event Listeners
function setupEventListeners() {
  // Pesquisa
  elements.searchInput.addEventListener("input", renderMedicinesList)

  // Navegação
  elements.addButton.addEventListener("click", () => navigateTo("add"))
  elements.detailBack.addEventListener("click", () => navigateTo("home"))
  elements.addBack.addEventListener("click", () => navigateTo("home"))
  elements.editBack.addEventListener("click", () => showMedicineDetails(currentMedicineId))

  // Ações de medicamento
  elements.editButton.addEventListener("click", () => {
    populateEditForm(currentMedicineId)
  })

  elements.deleteButton.addEventListener("click", showDeleteModal)

  // Modal de exclusão
  elements.cancelDelete.addEventListener("click", hideDeleteModal)
  elements.confirmDelete.addEventListener("click", () => {
    deleteMedicine(currentMedicineId)
    hideDeleteModal()
    navigateTo("home")
  })

  // Adicionar evento para filtro de categorias
  const categoryChips = document.querySelectorAll(".category-chip")
  categoryChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      // Remover classe ativa de todos os chips
      categoryChips.forEach((c) => c.classList.remove("active"))

      // Adicionar classe ativa ao chip clicado
      chip.classList.add("active")

      // Atualizar categoria atual e renderizar lista
      currentCategory = chip.dataset.category
      renderMedicinesList()
    })
  })

  // Atualizar o formulário de adição para incluir categoria
  elements.addForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const newMedicine = {
      id: Date.now().toString(),
      nome: e.target.elements["add-name"].value,
      descricao: e.target.elements["add-description"].value,
      dosagem: e.target.elements["add-dosage"].value,
      uso: e.target.elements["add-usage"].value,
      efeitosColaterais: e.target.elements["add-side-effects"].value,
      contraindicacoes: e.target.elements["add-contraindications"].value,
      categoria: e.target.elements["add-category"].value,
    }

    addMedicine(newMedicine)
    e.target.reset()
    navigateTo("home")
  })

  // Atualizar o formulário de edição para incluir categoria
  elements.editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const updatedMedicine = {
      id: elements.editId.value,
      nome: elements.editName.value,
      descricao: elements.editDescription.value,
      dosagem: elements.editDosage.value,
      uso: elements.editUsage.value,
      efeitosColaterais: elements.editSideEffects.value,
      contraindicacoes: elements.editContraindications.value,
      categoria: document.getElementById("edit-category").value,
    }

    updateMedicine(updatedMedicine)
    showMedicineDetails(updatedMedicine.id)
  })

  // Configurar navegação entre páginas principais
  const navButtons = document.querySelectorAll(".nav-button")
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const pageId = button.dataset.page
      navigateTo(pageId)
    })
  })
}

// Adicionar função para criar dados de exemplo
function addSampleData() {
  const sampleMedicines = [
    {
      id: "1682541234567",
      nome: "Paracetamol",
      descricao:
        "Medicamento analgésico e antipirético utilizado para alívio temporário de dores leves a moderadas e redução da febre.",
      dosagem: "Adultos e crianças acima de 12 anos: 500-1000mg a cada 4-6 horas, não excedendo 4g por dia.",
      uso: "Pode ser utilizado para dores de cabeça, dores musculares, dores de dente, dores nas costas, resfriados e febres. Tomar com um copo de água.",
      efeitosColaterais:
        "Raramente causa efeitos colaterais quando tomado na dose correta. Em alguns casos pode causar náuseas, vômitos, dor abdominal e reações alérgicas.",
      contraindicacoes: "Pacientes com doença hepática grave, alcoolismo ou hipersensibilidade ao paracetamol.",
      categoria: "analgesico",
    },
    {
      id: "1682541234568",
      nome: "Ibuprofeno",
      descricao:
        "Anti-inflamatório não esteroidal (AINE) que reduz substâncias no corpo que causam inflamação, dor e febre.",
      dosagem: "Adultos: 200-400mg a cada 4-6 horas conforme necessário, não excedendo 1200mg em 24 horas.",
      uso: "Utilizado para alívio de dores de cabeça, dores musculares, artrite, cólicas menstruais, febre e dores associadas a resfriados comuns. Tomar preferencialmente após as refeições.",
      efeitosColaterais:
        "Dor de estômago, azia, náuseas, vômitos, diarreia, constipação, gases, tontura, dor de cabeça e erupções cutâneas.",
      contraindicacoes:
        "Pacientes com úlcera péptica ativa, histórico de hipersensibilidade ao ibuprofeno, ácido acetilsalicílico ou outros AINEs. Não recomendado no último trimestre da gravidez.",
      categoria: "anti-inflamatorio",
    },
    {
      id: "1682541234569",
      nome: "Amoxicilina",
      descricao:
        "Antibiótico da classe das penicilinas que combate bactérias no corpo. Eficaz contra uma ampla variedade de infecções bacterianas.",
      dosagem: "Adultos: 250-500mg três vezes ao dia a cada 8 horas, dependendo da gravidade da infecção.",
      uso: "Tratamento de infecções bacterianas do trato respiratório, ouvido, nariz, garganta, trato urinário, pele e tecidos moles. Tomar com ou sem alimentos.",
      efeitosColaterais: "Diarreia, náuseas, vômitos, erupções cutâneas, candidíase e reações alérgicas.",
      contraindicacoes:
        "Pacientes com histórico de alergia a penicilinas ou cefalosporinas. Usar com cautela em pacientes com mononucleose infecciosa.",
      categoria: "antibiotico",
    },
    {
      id: "1682541234570",
      nome: "Dipirona",
      descricao: "Medicamento analgésico, antipirético e antiespasmódico utilizado para alívio da dor e febre.",
      dosagem: "Adultos: 500-1000mg até 4 vezes ao dia, com intervalo mínimo de 4 horas entre as doses.",
      uso: "Indicado para dores intensas de origem diversa, incluindo dor de cabeça, dor de dente, dor pós-operatória e cólicas. Também eficaz para redução da febre.",
      efeitosColaterais:
        "Reações alérgicas, queda de pressão arterial, náuseas, boca seca e, em casos raros, agranulocitose (redução de células de defesa no sangue).",
      contraindicacoes:
        "Pacientes com alergia a dipirona ou a qualquer componente da fórmula, deficiência de glicose-6-fosfato desidrogenase, porfiria hepática ou granulocitopenia.",
      categoria: "analgesico",
    },
    {
      id: "1682541234571",
      nome: "Omeprazol",
      descricao:
        "Medicamento que reduz a produção de ácido no estômago, pertencente à classe dos inibidores da bomba de prótons.",
      dosagem: "Adultos: 20mg uma vez ao dia, preferencialmente pela manhã, por 4 a 8 semanas.",
      uso: "Tratamento de úlceras gástricas e duodenais, refluxo gastroesofágico, síndrome de Zollinger-Ellison e prevenção de úlceras em pacientes que usam anti-inflamatórios não esteroidais.",
      efeitosColaterais:
        "Dor de cabeça, diarreia, constipação, náuseas, dor abdominal, flatulência e, em uso prolongado, pode causar deficiência de vitamina B12 e magnésio.",
      contraindicacoes:
        "Pacientes com hipersensibilidade ao omeprazol ou a qualquer componente da fórmula. Usar com cautela em pacientes com doença hepática grave.",
      categoria: "outro",
    },
    {
      id: "1682541234572",
      nome: "Azitromicina",
      descricao:
        "Antibiótico da classe dos macrolídeos que impede o crescimento de bactérias. Eficaz contra infecções respiratórias, de pele e outras.",
      dosagem:
        "Adultos: 500mg uma vez ao dia durante 3 dias, ou 500mg no primeiro dia seguido de 250mg por dia nos dias 2 a 5.",
      uso: "Tratamento de infecções do trato respiratório superior e inferior, infecções de pele e tecidos moles, e algumas doenças sexualmente transmissíveis.",
      efeitosColaterais:
        "Diarreia, náuseas, dor abdominal, vômitos e, raramente, alterações na função hepática e reações alérgicas.",
      contraindicacoes:
        "Pacientes com hipersensibilidade à azitromicina, eritromicina ou qualquer antibiótico macrolídeo. Usar com cautela em pacientes com problemas hepáticos ou renais.",
      categoria: "antibiotico",
    },
    {
      id: "1682541234573",
      nome: "Diclofenaco",
      descricao:
        "Anti-inflamatório não esteroidal (AINE) potente que reduz a inflamação, alivia a dor e diminui a febre.",
      dosagem: "Adultos: 50mg 2 a 3 vezes ao dia, ou 75mg 2 vezes ao dia, não excedendo 150mg por dia.",
      uso: "Tratamento de dores reumáticas, musculares, pós-traumáticas, pós-operatórias, cólicas menstruais e outras condições dolorosas e inflamatórias.",
      efeitosColaterais:
        "Dor de estômago, azia, náuseas, diarreia, dor de cabeça, tontura, erupções cutâneas e, em casos raros, problemas renais, hepáticos ou cardiovasculares.",
      contraindicacoes:
        "Pacientes com úlcera péptica ativa, insuficiência cardíaca grave, doença renal avançada ou histórico de reações alérgicas a AINEs.",
      categoria: "anti-inflamatorio",
    },
    {
      id: "1682541234574",
      nome: "Loratadina",
      descricao:
        "Anti-histamínico de segunda geração que alivia os sintomas de alergias como coriza, espirros e coceira nos olhos, sem causar sonolência significativa.",
      dosagem: "Adultos e crianças acima de 12 anos: 10mg uma vez ao dia.",
      uso: "Alívio temporário dos sintomas de rinite alérgica (febre do feno) e urticária (erupções cutâneas com coceira).",
      efeitosColaterais: "Boca seca, dor de cabeça, fadiga e, raramente, sonolência.",
      contraindicacoes:
        "Pacientes com hipersensibilidade à loratadina ou a qualquer componente da fórmula. Usar com cautela em pacientes com doença hepática.",
      categoria: "outro",
    },
    {
      id: "1682541234575",
      nome: "Dexametasona",
      descricao:
        "Corticosteroide potente com propriedades anti-inflamatórias e imunossupressoras, usado para tratar várias condições inflamatórias.",
      dosagem: "Varia conforme a condição: 0,5-10mg por dia, dividido em várias doses ou em dose única.",
      uso: "Tratamento de condições alérgicas graves, doenças inflamatórias, doenças autoimunes, edema cerebral e como adjuvante em alguns protocolos de quimioterapia.",
      efeitosColaterais:
        "Em uso prolongado: aumento de peso, retenção de líquidos, hipertensão, hiperglicemia, maior suscetibilidade a infecções, osteoporose e alterações de humor.",
      contraindicacoes:
        "Infecções fúngicas sistêmicas, hipersensibilidade à dexametasona. Usar com cautela em pacientes com diabetes, hipertensão, osteoporose ou úlcera péptica.",
      categoria: "anti-inflamatorio",
    },
    {
      id: "1682541234576",
      nome: "Metformina",
      descricao:
        "Medicamento antidiabético oral que reduz a produção de glicose pelo fígado e aumenta a sensibilidade à insulina nos tecidos.",
      dosagem:
        "Iniciar com 500mg 1-2 vezes ao dia, podendo aumentar gradualmente até 2000-2500mg por dia, divididos em 2-3 doses.",
      uso: "Tratamento do diabetes tipo 2, especialmente em pacientes com sobrepeso. Também usado em casos de síndrome dos ovários policísticos e resistência à insulina.",
      efeitosColaterais:
        "Distúrbios gastrointestinais como náuseas, vômitos, diarreia, desconforto abdominal e perda de apetite, especialmente no início do tratamento.",
      contraindicacoes:
        "Doença renal moderada a grave, acidose metabólica aguda ou crônica, insuficiência cardíaca descompensada e condições hipóxicas.",
      categoria: "outro",
    },
  ]

  // Adicionar os medicamentos de exemplo ao localStorage
  localStorage.setItem("medicines", JSON.stringify(sampleMedicines))

  // Carregar os medicamentos
  loadMedicines()

  // Mostrar toast informando que dados de exemplo foram adicionados
  showToast("Dados de exemplo adicionados com sucesso!")
}

// Inicialização
function init() {
  // Verificar se já existem medicamentos no localStorage
  const storedMedicines = localStorage.getItem("medicines")
  if (!storedMedicines || JSON.parse(storedMedicines).length === 0) {
    // Se não existirem medicamentos, adicionar dados de exemplo
    addSampleData()
  } else {
    // Se já existirem medicamentos, apenas carregar
    loadMedicines()
  }

  setupEventListeners()
}

// Iniciar a aplicação quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar ícones Lucide
  const lucide = window.lucide
  lucide.createIcons()

  init()
})
