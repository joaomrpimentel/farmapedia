// Elementos DOM
const pages = {
  home: document.getElementById("home-page"),
  detail: document.getElementById("detail-page"),
  add: document.getElementById("add-page"),
  edit: document.getElementById("edit-page"),
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
let currentCategory = "all" 

// Funções de navegação
function navigateTo(pageId) {
  // Verificar se a página existe
  if (!pages[pageId]) {
    console.error("Página não encontrada:", pageId)
    return
  }

  Object.values(pages).forEach((page) => {
    if (page) page.classList.remove("active")
  })

  pages[pageId].classList.add("active")

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
async function loadMedicines() {
  try {
    const storedMedicines = localStorage.getItem("medicines")

      const response = await fetch("medicines-db.json")
      const data = await response.json()
      medicines = data.medicines

      saveMedicines()

    renderMedicinesList()
  } catch (error) {
    console.error("Erro ao carregar medicamentos:", error)
    showToast("Erro ao carregar medicamentos. Por favor, recarregue a página.")
  }
}

function saveMedicines() {
  localStorage.setItem("medicines", JSON.stringify(medicines))
}

// Atualizar a função de adição de medicamento para incluir categoria
function addMedicine(medicine) {
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

function renderMedicinesList() {
  const searchTerm = elements.searchInput.value.toLowerCase()
  let filteredMedicines = medicines.filter((medicine) => medicine.nome.toLowerCase().includes(searchTerm))

  if (currentCategory !== "all") {
    filteredMedicines = filteredMedicines.filter((medicine) => medicine.categoria === currentCategory)
  }

  elements.medicinesList.innerHTML = ""

  if (filteredMedicines.length === 0) {
    elements.medicinesList.style.display = "none"
    elements.emptyState.style.display = "block"

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

      const iconIndex = Number.parseInt(medicine.id.substring(medicine.id.length - 2), 10) % 4
      const icons = ["pill", "pill", "flask-round", "stethoscope"]
      const icon = icons[iconIndex]

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

      // Adicionar evento de clique de forma mais explícita
      card.addEventListener("click", () => {
        console.log("Card clicado, ID:", medicine.id)
        showMedicineDetails(medicine.id)
      })

      elements.medicinesList.appendChild(card)
    })

    const lucide = window.lucide
    lucide.createIcons()
  }
  window.scrollTo(0, 0)
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
  console.log("Mostrando detalhes do medicamento:", id)
  currentMedicineId = id
  const medicine = medicines.find((med) => med.id === id)

  if (!medicine) {
    console.error("Medicamento não encontrado:", id)
    navigateTo("home")
    return
  }

  console.log("Medicamento encontrado:", medicine)

  // Verificar se os elementos existem antes de tentar acessá-los
  if (!elements.detailName || !elements.detailDescription) {
    console.error("Elementos de detalhe não encontrados")
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
  if (!medicineHeader) {
    console.error("Cabeçalho do medicamento não encontrado")
    return
  }

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

  console.log("Navegando para a página de detalhes")
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
      principioAtivo: e.target.elements["add-name"].value, // Simplificação, idealmente teria um campo separado
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
      principioAtivo: elements.editName.value, // Simplificação, idealmente manteria o valor original
    }

    updateMedicine(updatedMedicine)
    showMedicineDetails(updatedMedicine.id)
  })

  // Configurar navegação entre páginas principais
  const navButtons = document.querySelectorAll(".nav-button")
  navButtons.forEach((button) => {
    if (button.dataset.page) {
      button.addEventListener("click", () => {
        const pageId = button.dataset.page
        navigateTo(pageId)
      })
    }
  })
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  pages.home = document.getElementById("home-page")
  pages.detail = document.getElementById("detail-page")
  pages.add = document.getElementById("add-page")
  pages.edit = document.getElementById("edit-page")

  elements.medicinesList = document.getElementById("medicines-list")
  elements.emptyState = document.getElementById("empty-state")
  elements.searchInput = document.getElementById("search-input")
  elements.addButton = document.getElementById("add-button")

  elements.detailName = document.getElementById("detail-name")
  elements.detailDescription = document.getElementById("detail-description")
  elements.detailDosage = document.getElementById("detail-dosage")
  elements.detailUsage = document.getElementById("detail-usage")
  elements.detailSideEffects = document.getElementById("detail-side-effects")
  elements.detailContraindications = document.getElementById("detail-contraindications")
  elements.detailBack = document.getElementById("detail-back")
  elements.editButton = document.getElementById("edit-button")
  elements.deleteButton = document.getElementById("delete-button")

  elements.addForm = document.getElementById("add-form")
  elements.addBack = document.getElementById("add-back")

  elements.editForm = document.getElementById("edit-form")
  elements.editId = document.getElementById("edit-id")
  elements.editName = document.getElementById("edit-name")
  elements.editDescription = document.getElementById("edit-description")
  elements.editDosage = document.getElementById("edit-dosage")
  elements.editUsage = document.getElementById("edit-usage")
  elements.editSideEffects = document.getElementById("edit-side-effects")
  elements.editContraindications = document.getElementById("edit-contraindications")
  elements.editBack = document.getElementById("edit-back")

  elements.deleteModal = document.getElementById("delete-modal")
  elements.cancelDelete = document.getElementById("cancel-delete")
  elements.confirmDelete = document.getElementById("confirm-delete")

  elements.toast = document.getElementById("toast")
  elements.toastMessage = document.getElementById("toast-message")

  const lucide = window.lucide
  lucide.createIcons()

  loadMedicines()
  setupEventListeners()
})
