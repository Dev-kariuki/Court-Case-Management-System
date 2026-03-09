document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const caseId = urlParams.get("id");
  if (!caseId) {
    console.error("Case ID not found in URL.");
    return;
  }

  const deleteBtn = document.getElementById("delete-btn");
  deleteBtn.addEventListener("click", () => {
    const confirmation = confirm(
      "Are you sure you want to delete this case? This action cannot be undone."
    );
    if (confirmation) {
      $.ajax({
        url: "logic/delete-conv-case.php",
        type: "POST",
        data: { caseId: caseId },
        success: function (response) {
          if (response.trim() == "success") {
            alert("Case deleted successfully.");
            setTimeout(() => {
              window.location.href = "index.php";
            }, 500);
          }
        },
        error: function (xhr, status, error) {
          console.error("AJAX Error:", error);
        },
      });
    }
  });

  const caseStatus = document.getElementById("case-status-badge");

  caseStatus.addEventListener("click", function () {
    $.ajax({
      url: "logic/update-conv-status.php",
      type: "POST",
      data: { id: caseId },
      success: function (response) {
        if (response === "success") {
          alert("Case status updated successfully.");
          fetchCaseData(caseId);
        }
      },
      error: function (xhr, status, error) {
        console.error("AJAX Error:", error);
      },
    });
  });

  fetchCaseData(caseId);

  function fetchCaseData(caseId) {
    $.ajax({
      url: "logic/get-conveyancing-data.php", // The PHP file path
      method: "GET",
      data: { case_id: caseId }, // Send the case ID as a parameter
      success: function (response) {
        const caseData = JSON.parse(response);

        // Sample data structure: Render case details
        const sampleCase = {
          id: caseData.id,
          caseNumber: caseData.caseNumber,
          fileColor: caseData.fileColor,
          title: caseData.title,
          description: caseData.description || "No description available.",
          status: caseData.status,
          filingDate: caseData.filingDate,
          bringUpDate: caseData.bringUpDate,
          dateCreated: caseData.dateCreated,
          dateCompleted: caseData.dateCompleted,
          advocate: caseData.advocate,
          party: caseData.party,

          parties:
            caseData.parties && caseData.parties.length
              ? caseData.parties
              : ["No parties available."],
          confidentialDocuments:
            caseData.confidentialDocuments &&
            caseData.confidentialDocuments.length
              ? caseData.confidentialDocuments
              : ["No confidential documents available."],
          correspondence:
            caseData.correspondence && caseData.correspondence.length
              ? caseData.correspondence
              : ["No correspondences available."],
          pleadings:
            caseData.pleadings && caseData.pleadings.length
              ? caseData.pleadings
              : ["No documents available."],
          courtDocuments:
            caseData.courtDocuments && caseData.courtDocuments.length
              ? caseData.courtDocuments
              : ["No counterpart documents available."],
          clientAdvocate:
            caseData.clientAdvocate && caseData.clientAdvocate.length
              ? caseData.clientAdvocate
              : ["No client advocate documents available."],
          courtAttendanceMemo:
            caseData.courtAttendanceMemo && caseData.courtAttendanceMemo.length
              ? caseData.courtAttendanceMemo
              : ["No completion documents available."],
        };

        // Initialize the case dossier with the fetched data
        initializeUI(sampleCase);
      },
      error: function (error) {
        console.error("Error fetching case data:", error);
      },
    });
  }

  // DOM elements
  const confidentialDocs = document.getElementById("confidential-docs");
  const clientAdvocateDocs = document.getElementById(
    "client-confidential-docs"
  );

  // Initialize the UI
  function initializeUI(caseData) {
    loadPartiesInvolved(caseData.parties);

    const admin = localStorage.getItem("admin");
    if (admin == 1) {
      // confidentialDocs.classList.remove("hidden");
      clientAdvocateDocs.classList.remove("hidden");
      // Load confidential documents
      // loadConfidentialDocuments(caseData.confidentialDocuments);
      loadClientAdvocateDocuments(caseData.clientAdvocate);
    }

    // Load pleadings
    loadPleadings(caseData.pleadings);

    // Load court documents
    loadCourtDocuments(caseData.courtDocuments);

    // Load correspondence
    loadCorrespondence(caseData.correspondence);

    // Load court attendance memo
    loadCourtAttendanceMemo(caseData.courtAttendanceMemo);

    setupAddParty();

    setupAddPleading();

    setupAddCourtDocument();

    setupAddCorrespondence();

    setupAddCourtAttendanceMemo();

    setupAddClientAdvocateDocument();

    loadCaseHeader(caseData);

    // setupAddConfidentialDoc();
  }

  function loadCaseHeader(caseData) {
    document.title = `Conveyancing - ${caseData.title}`;
    document.getElementById("case-title").textContent = caseData.title;
    document.getElementById("case-number").textContent = caseData.caseNumber;
    document.getElementById("case-description").textContent =
      caseData.description;
    document.getElementById("party-type-case").textContent = caseData.party;
    if (caseData.party === "buyer") {
      document.getElementById("party-type-case").style.border =
        "1px solid #3b82f6"; // Blue
    } else if (caseData.party === "seller") {
      document.getElementById("party-type-case").style.border =
        "1px solid #fbbf24"; // Yellow
    }

    document.getElementById("advocate-name").textContent = caseData.advocate;

    const filingDate = new Date(caseData.filingDate);
    const bringUpDate = new Date(caseData.bringUpDate);
    document.getElementById("filing-date").textContent =
      filingDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    document.getElementById("bringUpDate").textContent =
      "Bring up date: " +
      bringUpDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    const statusBadge = document.querySelector(".case-status-badge");
    const closeDate = document.getElementById("closed-date");
    const statusDate = document.getElementById("case-status-date");
    if (caseData.status == 0) {
      statusBadge.textContent = "Active";
      statusDate.style.display = "none";
    } else if (caseData.status == 1) {
      statusBadge.textContent = "Closed";
      statusBadge.style.backgroundColor = "#fee2e2"; // Red
      statusBadge.style.color = "#991b1b";
      const date = new Date(caseData.dateCompleted);
      closeDate.textContent = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } else {
      statusBadge.textContent = "Archived";
    }

    if (caseData.status == 0) {
      statusBadge.style.backgroundColor = "var(--blue-100)";
      statusBadge.style.color = "var(--blue-800)";
    } else if (caseData.status == 1) {
      statusBadge.style.backgroundColor = "var(--red-100)";
      statusBadge.style.color = "var(--red-800)";
    } else {
      statusBadge.style.backgroundColor = "var(--yellow-100)";
      statusBadge.style.color = "var(--yellow-800)";
    }
  }

  function loadPleadings(documents) {
    const documentsContainer = document.getElementById("pleadings-container");

    documentsContainer.innerHTML = ""; // Clear any existing content

    if (
      !Array.isArray(documents) ||
      (documents.length === 1 && typeof documents[0] === "string")
    ) {
      const message = document.createElement("div");
      message.className = "no-parties-message";
      message.textContent = documents[0];
      documentsContainer.appendChild(message);
      return;
    }

    documents.forEach((documentt) => {
      const documentCard = document.createElement("div");
      documentCard.className = "document-card";
      documentCard.dataset.documentId = documentt.id;

      const thumbnail = document.createElement("img");
      thumbnail.className = "document-thumbnail";

      // Check if the file is a PDF
      if (documentt.file_name.toLowerCase().endsWith(".pdf")) {
        thumbnail.src = "assets/pdf-icon.png"; // Replace with your actual icon path
      } else {
        thumbnail.src = `logic/uploads/${documentt.file_name}`;
      }

      thumbnail.alt = documentt.title;

      const documentInfo = document.createElement("div");
      const documentInfo1 = document.createElement("div");
      documentInfo1.className = "document-info";
      documentInfo1.style.display = "flex";
      documentInfo1.style.justifyContent = "space-between";
      documentInfo1.style.alignItems = "center";

      const documentTitle = document.createElement("div");
      documentTitle.className = "document-title";
      documentTitle.textContent = documentt.title;

      const documentMeta = document.createElement("div");
      documentMeta.className = "document-meta";
      documentMeta.textContent = new Date(
        documentt["date_created"]
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      documentInfo.appendChild(documentTitle);
      documentInfo.appendChild(documentMeta);

      documentInfo1.appendChild(documentInfo);
      documentCard.appendChild(thumbnail);
      documentCard.appendChild(documentInfo1);

      documentCard.addEventListener("click", function () {
        openDocumentViewer(documentt);
      });

      documentsContainer.appendChild(documentCard);
    });
  }

  function loadCourtDocuments(documents) {
    const documentsContainer = document.getElementById("court-docs-container");

    documentsContainer.innerHTML = ""; // Clear any existing content

    if (
      !Array.isArray(documents) ||
      (documents.length === 1 && typeof documents[0] === "string")
    ) {
      const message = document.createElement("div");
      message.className = "no-parties-message";
      message.textContent = documents[0];
      documentsContainer.appendChild(message);
      return;
    }

    documents.forEach((documentt) => {
      const documentCard = document.createElement("div");
      documentCard.className = "document-card";
      documentCard.dataset.documentId = documentt.id;

      const thumbnail = document.createElement("img");
      thumbnail.className = "document-thumbnail";

      // Check if the file is a PDF
      if (documentt.file_name.toLowerCase().endsWith(".pdf")) {
        thumbnail.src = "assets/pdf-icon.png"; // Replace with your actual icon path
      } else {
        thumbnail.src = `logic/uploads/${documentt.file_name}`;
      }

      thumbnail.alt = documentt.title;

      const documentInfo = document.createElement("div");
      const documentInfo1 = document.createElement("div");
      documentInfo1.className = "document-info";
      documentInfo1.style.display = "flex";
      documentInfo1.style.justifyContent = "space-between";
      documentInfo1.style.alignItems = "center";

      const documentTitle = document.createElement("div");
      documentTitle.className = "document-title";
      documentTitle.textContent = documentt.title;

      const documentMeta = document.createElement("div");
      documentMeta.className = "document-meta";
      documentMeta.textContent = new Date(
        documentt["date_created"]
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      documentInfo.appendChild(documentTitle);
      documentInfo.appendChild(documentMeta);

      documentInfo1.appendChild(documentInfo);
      documentCard.appendChild(thumbnail);
      documentCard.appendChild(documentInfo1);

      documentCard.addEventListener("click", function () {
        openDocumentViewer(documentt);
      });

      documentsContainer.appendChild(documentCard);
    });
  }

  function loadCorrespondence(documents) {
    const documentsContainer = document.getElementById(
      "correspondence-documents-container"
    );

    documentsContainer.innerHTML = ""; // Clear any existing content

    if (
      !Array.isArray(documents) ||
      (documents.length === 1 && typeof documents[0] === "string")
    ) {
      const message = document.createElement("div");
      message.className = "no-parties-message";
      message.textContent = documents[0];
      documentsContainer.appendChild(message);
      return;
    }

    documents.forEach((documentt) => {
      const documentCard = document.createElement("div");
      documentCard.className = "document-card";
      documentCard.dataset.documentId = documentt.id;

      const thumbnail = document.createElement("img");
      thumbnail.className = "document-thumbnail";

      // Check if the file is a PDF
      if (documentt.file_name.toLowerCase().endsWith(".pdf")) {
        thumbnail.src = "assets/pdf-icon.png"; // Replace with your actual icon path
      } else {
        thumbnail.src = `logic/uploads/${documentt.file_name}`;
      }

      thumbnail.alt = documentt.title;

      const documentInfo = document.createElement("div");
      const documentInfo1 = document.createElement("div");
      documentInfo1.className = "document-info";
      documentInfo1.style.display = "flex";
      documentInfo1.style.justifyContent = "space-between";
      documentInfo1.style.alignItems = "center";

      const documentTitle = document.createElement("div");
      documentTitle.className = "document-title";
      documentTitle.textContent = documentt.title;

      const documentMeta = document.createElement("div");
      documentMeta.className = "document-meta";
      documentMeta.textContent = new Date(
        documentt["date_created"]
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      documentInfo.appendChild(documentTitle);
      documentInfo.appendChild(documentMeta);

      documentInfo1.appendChild(documentInfo);
      documentCard.appendChild(thumbnail);
      documentCard.appendChild(documentInfo1);

      documentCard.addEventListener("click", function () {
        openDocumentViewer(documentt);
      });

      documentsContainer.appendChild(documentCard);
    });
  }

  function loadCourtAttendanceMemo(documents) {
    const documentsContainer = document.getElementById(
      "attendance-memo-documents-container"
    );

    documentsContainer.innerHTML = ""; // Clear any existing content

    if (
      !Array.isArray(documents) ||
      (documents.length === 1 && typeof documents[0] === "string")
    ) {
      const message = document.createElement("div");
      message.className = "no-parties-message";
      message.textContent = documents[0];
      documentsContainer.appendChild(message);
      return;
    }

    documents.forEach((documentt) => {
      const documentCard = document.createElement("div");
      documentCard.className = "document-card";
      documentCard.dataset.documentId = documentt.id;

      const thumbnail = document.createElement("img");
      thumbnail.className = "document-thumbnail";

      // Check if the file is a PDF
      if (documentt.file_name.toLowerCase().endsWith(".pdf")) {
        thumbnail.src = "assets/pdf-icon.png"; // Replace with your actual icon path
      } else {
        thumbnail.src = `logic/uploads/${documentt.file_name}`;
      }

      thumbnail.alt = documentt.title;

      const documentInfo = document.createElement("div");
      const documentInfo1 = document.createElement("div");
      documentInfo1.className = "document-info";
      documentInfo1.style.display = "flex";
      documentInfo1.style.justifyContent = "space-between";
      documentInfo1.style.alignItems = "center";

      const documentTitle = document.createElement("div");
      documentTitle.className = "document-title";
      documentTitle.textContent = documentt.title;

      const documentMeta = document.createElement("div");
      documentMeta.className = "document-meta";
      documentMeta.textContent = new Date(
        documentt["date_created"]
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      documentInfo.appendChild(documentTitle);
      documentInfo.appendChild(documentMeta);

      documentInfo1.appendChild(documentInfo);
      documentCard.appendChild(thumbnail);
      documentCard.appendChild(documentInfo1);

      documentCard.addEventListener("click", function () {
        openDocumentViewer(documentt);
      });

      documentsContainer.appendChild(documentCard);
    });
  }

  function loadClientAdvocateDocuments(documents) {
    const documentsContainer = document.getElementById(
      "client-confidential-docs-container"
    );

    documentsContainer.innerHTML = ""; // Clear any existing content

    if (
      !Array.isArray(documents) ||
      (documents.length === 1 && typeof documents[0] === "string")
    ) {
      const message = document.createElement("div");
      message.className = "no-parties-message";
      message.textContent = documents[0];
      documentsContainer.appendChild(message);
      return;
    }

    documents.forEach((documentt) => {
      const documentCard = document.createElement("div");
      documentCard.className = "document-card";
      documentCard.dataset.documentId = documentt.id;

      const thumbnail = document.createElement("img");
      thumbnail.className = "document-thumbnail";

      // Check if the file is a PDF
      if (documentt.file_name.toLowerCase().endsWith(".pdf")) {
        thumbnail.src = "assets/pdf-icon.png"; // Replace with your actual icon path
      } else {
        thumbnail.src = `logic/uploads/${documentt.file_name}`;
      }

      thumbnail.alt = documentt.title;

      const documentInfo = document.createElement("div");
      const documentInfo1 = document.createElement("div");
      documentInfo1.className = "document-info";
      documentInfo1.style.display = "flex";
      documentInfo1.style.justifyContent = "space-between";
      documentInfo1.style.alignItems = "center";

      const documentTitle = document.createElement("div");
      documentTitle.className = "document-title";
      documentTitle.textContent = documentt.title;

      const documentMeta = document.createElement("div");
      documentMeta.className = "document-meta";
      documentMeta.textContent = new Date(
        documentt["date_created"]
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      documentInfo.appendChild(documentTitle);
      documentInfo.appendChild(documentMeta);

      documentInfo1.appendChild(documentInfo);
      documentCard.appendChild(thumbnail);
      documentCard.appendChild(documentInfo1);

      documentCard.addEventListener("click", function () {
        openDocumentViewer(documentt);
      });

      documentsContainer.appendChild(documentCard);
    });
  }

  function setupAddPleading() {
    const addDocumentButton = document.getElementById(
      "add-pleadings-form-button"
    );
    const addDocumentFormContainer = document.getElementById(
      "add-pleadings-form-container"
    );

    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get("id");

    // Create form HTML
    const formHTML = `
      <h3 class="form-title">Add New Document</h3>
      <form id="add-pleadings-form">
        <div class="form-group">
          <label for="title" class="form-label">Document Title</label>
          <input type="text" name="title" id="title" class="form-input" placeholder="Enter document title" required>
          <div class="form-error" id="title-error"></div>
        </div>
        
        <div class="form-group">
              <label class="label">Image</label>
              <div class="file-upload" id="dropZone3">
                <i class="fas fa-cloud-upload-alt" style="font-size: 30px; color: #333;"></i>
                <p style="font-size: 0.875rem; margin-bottom: 0;">Click to upload or drag and drop</p>
                <p style="font-size: 0.75rem; color: #666; margin-bottom: 0;">
                  PDF & Images
                </p>
                <input
                  name="file"
                  type="file"
                  id="fileUpload3"
                  accept=".pdf,image/*"
                  style="display: none"
                />
          </div>
  
          <div id="fileList3"></div>
          
        
        <div class="form-group" style="margin-top: 1.5rem;">
          <button type="submit" class="button">Add Document</button>
        </div>
      </form>
    `;

    addDocumentFormContainer.innerHTML = formHTML;

    // Toggle form visibility
    addDocumentButton.addEventListener("click", function () {
      addDocumentFormContainer.classList.toggle("hidden");
      if (addDocumentButton.innerHTML.includes("Add Document")) {
        addDocumentButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
      } else {
        addDocumentButton.innerHTML =
          '<i class="fas fa-plus"></i> Add Document';
      }
    });

    initializeDropZone("dropZone3", "fileUpload3", "fileList3");

    // jQuery AJAX submission
    $(document).on("submit", "#add-pleadings-form", function (e) {
      e.preventDefault();

      const form = document.getElementById("add-pleadings-form");
      const formData = new FormData(form);

      formData.append("case_id", caseId);

      $.ajax({
        url: "logic/add-conv-case-pleadings-document.php", // Backend script
        method: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          if (response === "success") {
            alert("Document added successfully.");
            $("#add-pleadings-form")[0].reset();
            addDocumentFormContainer.classList.add("hidden");
            addDocumentButton.innerHTML =
              '<i class="fas fa-plus"></i> Add Document';

            window.location.reload();
          } else {
            alert("Error adding document: " + response);
          }
        },
        error: function (xhr, status, error) {
          alert("AJAX error: " + error);
        },
      });
    });
  }

  function setupAddCourtDocument() {
    const addDocumentButton = document.getElementById(
      "add-court-doc-form-button"
    );
    const addDocumentFormContainer = document.getElementById(
      "add-court-doc-form-container"
    );

    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get("id");

    // Create form HTML
    const formHTML = `
      <h3 class="form-title">Add New Document</h3>
      <form id="add-court-doc-form">
        <div class="form-group">
          <label for="title" class="form-label">Document Title</label>
          <input type="text" name="title" id="title" class="form-input" placeholder="Enter document title" required>
          <div class="form-error" id="title-error"></div>
        </div>
        
        <div class="form-group">
              <label class="label">Image</label>
              <div class="file-upload" id="dropZone4">
                <i class="fas fa-cloud-upload-alt" style="font-size: 30px; color: #333;"></i>
                <p style="font-size: 0.875rem; margin-bottom: 0;">Click to upload or drag and drop</p>
                <p style="font-size: 0.75rem; color: #666; margin-bottom: 0;">
                  PDF & Images
                </p>
                <input
                  name="file"
                  type="file"
                  id="fileUpload4"
                  accept=".pdf,image/*"
                  style="display: none"
                />
          </div>
  
          <div id="fileList4"></div>
          
        
        <div class="form-group" style="margin-top: 1.5rem;">
          <button type="submit" class="button">Add Document</button>
        </div>
      </form>
    `;

    addDocumentFormContainer.innerHTML = formHTML;

    // Toggle form visibility
    addDocumentButton.addEventListener("click", function () {
      addDocumentFormContainer.classList.toggle("hidden");
      if (addDocumentButton.innerHTML.includes("Add Document")) {
        addDocumentButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
      } else {
        addDocumentButton.innerHTML =
          '<i class="fas fa-plus"></i> Add Document';
      }
    });

    initializeDropZone("dropZone4", "fileUpload4", "fileList4");

    // jQuery AJAX submission
    $(document).on("submit", "#add-court-doc-form", function (e) {
      e.preventDefault();

      const form = document.getElementById("add-court-doc-form");
      const formData = new FormData(form);

      formData.append("case_id", caseId);

      $.ajax({
        url: "logic/add-conv-case-court-document.php", // Backend script
        method: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          if (response === "success") {
            alert("Document added successfully.");
            $("#add-court-doc-form")[0].reset();
            addDocumentFormContainer.classList.add("hidden");
            addDocumentButton.innerHTML =
              '<i class="fas fa-plus"></i> Add Document';

            window.location.reload();
          } else {
            alert("Error adding document: " + response);
          }
        },
        error: function (xhr, status, error) {
          alert("AJAX error: " + error);
        },
      });
    });
  }

  function setupAddCorrespondence() {
    const addDocumentButton = document.getElementById(
      "add-correspondence-document-button"
    );
    const addDocumentFormContainer = document.getElementById(
      "add-correspondence-doc-form-container"
    );

    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get("id");

    // Create form HTML
    const formHTML = `
      <h3 class="form-title">Add New Document</h3>
      <form id="add-correspondence-doc-form">
        <div class="form-group">
          <label for="title" class="form-label">Document Title</label>
          <input type="text" name="title" id="title" class="form-input" placeholder="Enter document title" required>
          <div class="form-error" id="title-error"></div>
        </div>
        
        <div class="form-group">
              <label class="label">Image</label>
              <div class="file-upload" id="dropZone5">
                <i class="fas fa-cloud-upload-alt" style="font-size: 30px; color: #333;"></i>
                <p style="font-size: 0.875rem; margin-bottom: 0;">Click to upload or drag and drop</p>
                <p style="font-size: 0.75rem; color: #666; margin-bottom: 0;">
                  PDF & Images
                </p>
                <input
                  name="file"
                  type="file"
                  id="fileUpload5"
                  accept=".pdf,image/*"
                  style="display: none"
                />
          </div>
  
          <div id="fileList5"></div>
          
        
        <div class="form-group" style="margin-top: 1.5rem;">
          <button type="submit" class="button">Add Document</button>
        </div>
      </form>
    `;

    addDocumentFormContainer.innerHTML = formHTML;

    // Toggle form visibility
    addDocumentButton.addEventListener("click", function () {
      addDocumentFormContainer.classList.toggle("hidden");
      if (addDocumentButton.innerHTML.includes("Add Document")) {
        addDocumentButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
      } else {
        addDocumentButton.innerHTML =
          '<i class="fas fa-plus"></i> Add Document';
      }
    });

    initializeDropZone("dropZone5", "fileUpload5", "fileList5");

    // jQuery AJAX submission
    $(document).on("submit", "#add-correspondence-doc-form", function (e) {
      e.preventDefault();

      const form = document.getElementById("add-correspondence-doc-form");
      const formData = new FormData(form);

      formData.append("case_id", caseId);

      $.ajax({
        url: "logic/add-conv-case-correspondence-document.php", // Backend script
        method: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          if (response === "success") {
            alert("Document added successfully.");
            $("#add-correspondence-doc-form")[0].reset();
            addDocumentFormContainer.classList.add("hidden");
            addDocumentButton.innerHTML =
              '<i class="fas fa-plus"></i> Add Document';

            window.location.reload();
          } else {
            alert("Error adding document: " + response);
          }
        },
        error: function (xhr, status, error) {
          alert("AJAX error: " + error);
        },
      });
    });
  }

  function setupAddCourtAttendanceMemo() {
    const addDocumentButton = document.getElementById(
      "add-attendance-memo-doc-button"
    );
    const addDocumentFormContainer = document.getElementById(
      "add-attendance-memo-doc-form-container"
    );

    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get("id");

    // Create form HTML
    const formHTML = `
      <h3 class="form-title">Add New Document</h3>
      <form id="add-court-attendance-memo-form">
        <div class="form-group">
          <label for="title" class="form-label">Document Title</label>
          <input type="text" name="title" id="title" class="form-input" placeholder="Enter document title" required>
          <div class="form-error" id="title-error"></div>
        </div>
        
        <div class="form-group">
              <label class="label">Image</label>
              <div class="file-upload" id="dropZone6">
                <i class="fas fa-cloud-upload-alt" style="font-size: 30px; color: #333;"></i>
                <p style="font-size: 0.875rem; margin-bottom: 0;">Click to upload or drag and drop</p>
                <p style="font-size: 0.75rem; color: #666; margin-bottom: 0;">
                  PDF & Images
                </p>
                <input
                  name="file"
                  type="file"
                  id="fileUpload6"
                  accept=".pdf,image/*"
                  style="display: none"
                />
          </div>
  
          <div id="fileList6"></div>
  
  
        <div class="form-group" style="margin-top: 1.5rem;">
          <button type="submit" class="button">Add Document</button>
        </div>
      </form>
    `;

    addDocumentFormContainer.innerHTML = formHTML;

    // Toggle form visibility
    addDocumentButton.addEventListener("click", function () {
      addDocumentFormContainer.classList.toggle("hidden");
      if (addDocumentButton.innerHTML.includes("Add Document")) {
        addDocumentButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
      } else {
        addDocumentButton.innerHTML =
          '<i class="fas fa-plus"></i> Add Document';
      }
    });

    initializeDropZone("dropZone6", "fileUpload6", "fileList6");

    // jQuery AJAX submission
    $(document).on("submit", "#add-court-attendance-memo-form", function (e) {
      e.preventDefault();

      const form = document.getElementById("add-court-attendance-memo-form");
      const formData = new FormData(form);

      formData.append("case_id", caseId);

      $.ajax({
        url: "logic/add-conv-case-court-attendance-memo.php", // Backend script
        method: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          if (response === "success") {
            alert("Document added successfully.");
            $("#add-court-attendance-memo-form")[0].reset();
            addDocumentFormContainer.classList.add("hidden");
            addDocumentButton.innerHTML =
              '<i class="fas fa-plus"></i> Add Document';

            window.location.reload();
          } else {
            alert("Error adding document: " + response);
          }
        },
        error: function (xhr, status, error) {
          alert("AJAX error: " + error);
        },
      });
    });
  }

  function setupAddClientAdvocateDocument() {
    const addDocumentButton = document.getElementById(
      "add-client-confidential-doc-button"
    );
    const addDocumentFormContainer = document.getElementById(
      "add-client-confidential-doc-form-container"
    );

    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get("id");

    // Create form HTML
    const formHTML = `
      <h3 class="form-title">Add New Document</h3>
      <form id="add-client-confidential-doc-form">
        <div class="form-group">
          <label for="title" class="form-label">Document Title</label>
          <input type="text" name="title" id="title" class="form-input" placeholder="Enter document title" required>
          <div class="form-error" id="title-error"></div>
        </div>
        
        <div class="form-group">
              <label class="label">Image</label>
              <div class="file-upload" id="dropZone7">
                <i class="fas fa-cloud-upload-alt" style="font-size: 30px; color: #333;"></i>
                <p style="font-size: 0.875rem; margin-bottom: 0;">Click to upload or drag and drop</p>
                <p style="font-size: 0.75rem; color: #666; margin-bottom: 0;">
                  PDF & Images
                </p>
                <input
                  name="file"
                  type="file"
                  id="fileUpload7"
                  accept=".pdf,image/*"
                  style="display: none"
                />
          </div>
  
          <div id="fileList7"></div>
  
  
        <div class="form-group" style="margin-top: 1.5rem;">
          <button type="submit" class="button">Add Document</button>
        </div>
      </form>
    `;

    addDocumentFormContainer.innerHTML = formHTML;

    // Toggle form visibility
    addDocumentButton.addEventListener("click", function () {
      addDocumentFormContainer.classList.toggle("hidden");
      if (addDocumentButton.innerHTML.includes("Add Document")) {
        addDocumentButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
      } else {
        addDocumentButton.innerHTML =
          '<i class="fas fa-plus"></i> Add Document';
      }
    });

    initializeDropZone("dropZone7", "fileUpload7", "fileList7");

    // jQuery AJAX submission
    $(document).on("submit", "#add-client-confidential-doc-form", function (e) {
      e.preventDefault();

      const form = document.getElementById("add-client-confidential-doc-form");
      const formData = new FormData(form);

      formData.append("case_id", caseId);

      $.ajax({
        url: "logic/add-conv-case-client-advocate-document.php", // Backend script
        method: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          if (response === "success") {
            alert("Document added successfully.");
            $("#add-client-confidential-doc-form")[0].reset();
            addDocumentFormContainer.classList.add("hidden");
            addDocumentButton.innerHTML =
              '<i class="fas fa-plus"></i> Add Document';

            window.location.reload();
          } else {
            alert("Error adding document: " + response);
          }
        },
        error: function (xhr, status, error) {
          alert("AJAX error: " + error);
        },
      });
    });
  }

  setupEventListeners();

  function openDocumentViewer(documentt) {
    const modal = document.getElementById("document-viewer-modal");
    const modalTitle = document.getElementById("modal-title");
    const documentPreview = document.getElementById("document-previeww");
    const documentDate = document.getElementById("document-date");

    // Set modal content
    modalTitle.textContent = documentt.title;
    documentDate.textContent = formatDate(documentt["date_created"]);

    // Clear previous content
    documentPreview.innerHTML = "";

    const fileName = documentt["file_name"];
    const fileUrl = `logic/uploads/${fileName}`;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    const isImage = imageExtensions.some((ext) => fileName.endsWith(ext));
    const isPDF = fileName.endsWith(".pdf");

    // Create and append download button
    const downloadBtn = document.createElement("a");
    downloadBtn.href = fileUrl;
    downloadBtn.download = fileName;
    downloadBtn.className = "button btn-sm download-button";
    downloadBtn.style.textTransform = "uppercase";
    downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download`;

    // Preview file
    if (isImage) {
      const img = document.createElement("img");
      img.src = fileUrl;
      img.alt = documentt.title;
      img.style.marginTop = "1rem";
      documentPreview.appendChild(img);
    } else if (isPDF) {
      const iframe = document.createElement("iframe");
      iframe.src = fileUrl;
      iframe.title = documentt.title;
      iframe.width = "100%";
      iframe.height = "600px";
      iframe.style.marginTop = "1rem";
      documentPreview.appendChild(iframe);
    } else {
      const message = document.createElement("p");
      message.textContent = "Preview not available for this file type.";
      message.style.marginTop = "1rem";
      documentPreview.appendChild(message);
    }

    const downloadStatus = document.createElement("div");
    downloadStatus.style.display = "flex";
    downloadStatus.style.gap = "1rem";
    downloadStatus.style.alignItems = "center";

    downloadStatus.appendChild(downloadBtn);
    documentPreview.appendChild(downloadStatus);

    // Show modal
    modal.classList.add("active");
  }

  // Helper functions
  function formatDate(dateString) {
    if (!dateString) return "";

    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  function setupEventListeners() {
    // Close modal button
    const closeModalButton = document.getElementById("close-modal");
    closeModalButton.addEventListener("click", function () {
      const modal = document.getElementById("document-viewer-modal");
      modal.classList.remove("active");
    });

    // Close modal on click outside
    const modal = document.getElementById("document-viewer-modal");
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.classList.remove("active");
      }
    });

    // Close modal on escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        const modal = document.getElementById("document-viewer-modal");
        if (modal.classList.contains("active")) {
          modal.classList.remove("active");
        }
      }
    });
  }

  function initializeDropZone(
    dropZoneSelector,
    fileInputSelector,
    fileListSelector
  ) {
    const dropZone = document.getElementById(dropZoneSelector);
    const fileInput = document.getElementById(fileInputSelector);
    const filesList = document.getElementById(fileListSelector);

    if (!dropZone || !fileInput || !filesList) return;

    // Trigger file dialog on click
    dropZone.addEventListener("click", () => {
      fileInput.click();
    });

    // Update UI after manual file selection
    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        handleFile(fileInput.files[0], fileListSelector, fileInputSelector);
      }
    });

    // Drag events
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("drag-over");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("drag-over");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("drag-over");

      if (e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];
        fileInput.files = e.dataTransfer.files;

        handleFile(file, fileListSelector, fileInputSelector);
      }
    });
  }

  function handleFile(file, filesList, fileInput) {
    const fileList = document.getElementById(filesList);
    fileList.innerHTML = "";
    if (file) {
      const fileSizeKB = (file.size / 1024).toFixed(1) + " KB";

      const fileItem = document.createElement("div");
      fileItem.className =
        "file-item flex items-center justify-between bg-gray-50 p-2 rounded shadow";

      fileItem.innerHTML = `
        <div class="overflow-hidden flex items-center justify-between" style="width: 100%; cursor:pointer;">
          <p class="text-sm font-medium truncate" style="margin-bottom: 0;">${file.name}</p>
          <p class="text-xs text-gray-500" style="margin-bottom: 0;">${fileSizeKB}</p>
        </div>
    `;

      fileItem.addEventListener("click", () =>
        removeFile(filesList, fileInput)
      );

      fileList.appendChild(fileItem);
    }
  }

  function removeFile(fileListSelector, fileUpload) {
    const filesList = document.getElementById(fileListSelector);
    const fileInput = document.getElementById(fileUpload);

    fileInput.value = ""; // Clear the file input value
    filesList.innerHTML = ""; // Clear the file list
  }

  function loadPartiesInvolved(parties) {
    const partiesContainer = document.getElementById("parties-container");
    partiesContainer.innerHTML = ""; // Clear any existing content

    // If no valid parties, show styled message
    if (
      !Array.isArray(parties) ||
      (parties.length === 1 && typeof parties[0] === "string")
    ) {
      const message = document.createElement("div");
      message.className = "no-parties-message";
      message.textContent = parties[0];
      partiesContainer.appendChild(message);
      return;
    }

    // Render the parties if valid array
    parties.forEach((party) => {
      const partyCard = document.createElement("div");
      partyCard.className = `party-card ${party.type || ""}`;

      const partyName = document.createElement("div");
      partyName.className = "party-name";
      partyName.textContent = party.name || "No name";

      const partyType = document.createElement("div");
      partyType.className = `party-type ${party.type || ""}`;
      partyType.textContent = party.type || "No type";

      const partyRole = document.createElement("div");
      partyRole.className = "party-role";
      partyRole.textContent = party.role || "No role";

      partyCard.appendChild(partyName);
      partyCard.appendChild(partyType);
      partyCard.appendChild(partyRole);

      if (party.contact) {
        const partyContact = document.createElement("div");
        partyContact.className = "party-contact";
        partyContact.textContent = party.contact;
        partyCard.appendChild(partyContact);
      }

      partiesContainer.appendChild(partyCard);
    });
  }

  function loadConfidentialDocuments(documents) {
    const documentsContainer = document.getElementById(
      "confidential-docs-container"
    );

    documentsContainer.innerHTML = ""; // Clear any existing content

    if (
      !Array.isArray(documents) ||
      (documents.length === 1 && typeof documents[0] === "string")
    ) {
      const message = document.createElement("div");
      message.className = "no-parties-message";
      message.textContent = documents[0];
      documentsContainer.appendChild(message);
      return;
    }

    documents.forEach((documentt) => {
      const documentCard = document.createElement("div");
      documentCard.className = "document-card";
      documentCard.dataset.documentId = documentt.id;

      const thumbnail = document.createElement("img");
      thumbnail.className = "document-thumbnail";

      // Check if the file is a PDF
      if (documentt.file_name.toLowerCase().endsWith(".pdf")) {
        thumbnail.src = "assets/pdf-icon.png"; // Replace with your actual icon path
      } else {
        thumbnail.src = `logic/uploads/${documentt.file_name}`;
      }

      thumbnail.alt = documentt.title;

      const documentInfo = document.createElement("div");
      const documentInfo1 = document.createElement("div");
      documentInfo1.className = "document-info";
      documentInfo1.style.display = "flex";
      documentInfo1.style.justifyContent = "space-between";
      documentInfo1.style.alignItems = "center";

      const documentTitle = document.createElement("div");
      documentTitle.className = "document-title";
      documentTitle.textContent = documentt.title;

      const documentMeta = document.createElement("div");
      documentMeta.className = "document-meta";
      documentMeta.textContent = new Date(
        documentt["date_created"]
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // Add status button
      const statusButton = document.createElement("button");
      statusButton.className = "status-button";
      statusButton.textContent = documentt.party;
      statusButton.style.textTransform = "uppercase";
      statusButton.style.padding = "5px 10px";
      statusButton.style.border = "none";
      statusButton.style.height = "max-content";
      statusButton.style.fontSize = "12px";
      statusButton.style.borderRadius = "5px";
      statusButton.style.fontWeight = "bold";
      statusButton.style.cursor = "pointer";
      statusButton.style.backgroundColor =
        documentt.party == "buyer" ? "lightblue" : "lightcoral";
      statusButton.style.color = documentt.party == "buyer" ? "blue" : "red";

      documentInfo.appendChild(documentTitle);
      documentInfo.appendChild(documentMeta);

      documentInfo1.appendChild(documentInfo);
      documentInfo1.appendChild(statusButton);
      documentCard.appendChild(thumbnail);
      documentCard.appendChild(documentInfo1);

      documentCard.addEventListener("click", function () {
        openDocumentViewer(documentt);
      });

      documentsContainer.appendChild(documentCard);
    });
  }

  function setupAddParty() {
    const addPartyButton = document.getElementById("add-party-button");
    const addPartyFormContainer = document.getElementById(
      "add-party-form-container"
    );

    // Create form HTML
    const formHTML = `
    <h3 class="form-title">Add New Party</h3>
    <form id="add-party-form">
      <div class="form-group">
        <label for="party-name" class="form-label">Party Name</label>
        <input type="text" id="party-name" class="form-input" placeholder="Enter party name" required>
        <div class="form-error" id="title-error"></div>
      </div>

      <div class="form-group">
        <label for="party-role" class="form-label">Party Role</label>
        <input type="text" id="party-role" class="form-input" placeholder="Enter party role" required>
        <div class="form-error" id="title-error"></div>
      </div>
      
      <div class="form-group">
        <label for="type" class="form-label">Party Type</label>
        <select id="type" name='type' class="form-select" required>
          <option value="seller">Seller</option>
          <option value="buyer">Buyer</option>
        </select>
        <div class="form-error" id="status-error"></div>
      </div>
 
      <div class="form-group">
        <label for="party-rep" class="form-label">Contact</label>
        <input type="text" name="contact" id="party-contact" class="form-input" placeholder="Enter party contact" required>
        <div class="form-error" id="completed-by-error"></div>
      </div>
      
      <div class="form-group" style="margin-top: 1.5rem;">
        <button type="submit" class="button2">Add Party</button>
      </div>
    </form>
  `;

    addPartyFormContainer.innerHTML = formHTML;

    // Toggle form visibility
    addPartyButton.addEventListener("click", function () {
      addPartyFormContainer.classList.toggle("hidden");
      if (addPartyButton.innerHTML.includes("Add Party")) {
        addPartyButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
      } else {
        addPartyButton.innerHTML = '<i class="fas fa-plus"></i> Add Party';
      }
    });

    // jQuery AJAX submission
    $(document).on("submit", "#add-party-form", function (e) {
      e.preventDefault();

      const formData = {
        name: $("#party-name").val(),
        role: $("#party-role").val(),
        type: $("#type").val(),
        contact: $("#party-contact").val(),
        case_id: caseId, // Make sure this is defined globally
      };

      $.ajax({
        url: "logic/add-conveyancing-party.php", // Backend script
        method: "POST",
        data: formData,
        success: function (response) {
          if (response === "success") {
            alert("Party added successfully.");
            $("#add-party-form")[0].reset();
            addPartyFormContainer.classList.add("hidden");
            addPartyButton.innerHTML = '<i class="fas fa-plus"></i> Add Party';

            window.location.reload();
          } else {
            alert("Error adding party: " + response);
          }
        },
        error: function (xhr, status, error) {
          alert("AJAX error: " + error);
        },
      });
    });
  }

  function setupAddConfidentialDoc() {
    const addConfidentialDocButton = document.getElementById(
      "add-confidential-doc-button"
    );
    const addConfidentialDocFormContainer = document.getElementById(
      "add-confidential-doc-form-container"
    );

    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get("id");

    const formHTML = `
      <h3 class="form-title">Add Confidential Document</h3>
      <form id="add-conf-document-form">
        <div class="form-group">
          <label for="document-title" class="form-label">Document Title</label>
          <input type="text" name="title" id="document-title" class="form-input" placeholder="Enter document title" required>
          <div class="form-error" id="title-error"></div>
        </div>
        
        <div class="form-group">
          <label for=type" class="form-label">Party Type</label>
          <select id="party-category" name="type" class="form-select" required>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </select>
          <div class="form-error" id="type-error"></div>
        </div>
  
        <div class="form-group">
              <label class="label">Image</label>
              <div class="file-upload" id="dropZone1">
                <i class="fas fa-cloud-upload-alt" style="font-size: 30px; color: #333;"></i>
                <p style="font-size: 0.875rem; margin-bottom: 0;">Click to upload or drag and drop</p>
                <p style="font-size: 0.75rem; color: #666; margin-bottom: 0;">
                  PDF & Images
                </p>
                <input
                  name="file1"
                  type="file"
                  id="fileUpload1"
                  accept=".pdf,image/*"
                  style="display: none"
                />
          </div>
  
          <div id="fileList1"></div>
          
        
        <div class="form-group" style="margin-top: 1.5rem;">
          <button type="submit" class="button2">Add Document</button>
        </div>
      </form>
    `;

    addConfidentialDocFormContainer.innerHTML = formHTML;

    // Toggle form visibility
    addConfidentialDocButton.addEventListener("click", function () {
      addConfidentialDocFormContainer.classList.toggle("hidden");
      if (addConfidentialDocButton.innerHTML.includes("Add Document")) {
        addConfidentialDocButton.innerHTML =
          '<i class="fas fa-times"></i> Cancel';
      } else {
        addConfidentialDocButton.innerHTML =
          '<i class="fas fa-plus"></i> Add Document';
      }
    });

    initializeDropZone("dropZone1", "fileUpload1", "fileList1");

    // jQuery AJAX submission
    $(document).on("submit", "#add-conf-document-form", function (e) {
      e.preventDefault();

      const form = document.getElementById("add-conf-document-form");
      const formData = new FormData(form);

      formData.append("case_id", caseId);

      $.ajax({
        url: "logic/add-conf-conv-document.php", // Backend script
        method: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          if (response === "success") {
            alert("Document added successfully.");
            $("#add-conf-document-form")[0].reset();
            addConfidentialDocFormContainer.classList.add("hidden");
            addConfidentialDocButton.innerHTML =
              '<i class="fas fa-plus"></i> Add Document';

            window.location.reload();
          } else {
            alert("Error adding document: " + response);
          }
        },
        error: function (xhr, status, error) {
          alert("AJAX error: " + error);
        },
      });
    });
  }
});
