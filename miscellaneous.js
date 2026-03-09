document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const documentsEmpty = document.getElementById("documents-empty");
  const documentsList = document.getElementById("documents-list");
  const uploadDialog = document.getElementById("upload-dialog");
  const selectedFilesContainer = document.getElementById("selected-files");
  const filesList = document.getElementById("files-list");
  const fileInput = document.getElementById("file-input");
  const fileCount = document.getElementById("file-count");
  const caseStatus = document.getElementById("case-status-badge");
  const urlParams = new URLSearchParams(window.location.search);
  const caseId = urlParams.get("id");
  const admin = localStorage.getItem("admin");
  const clientAdvocateDocs = document.getElementById(
    "client-confidential-docs"
  );
  const pleadingType = document.getElementById("pleading-type");
  const deleteBtn = document.getElementById("delete-btn");

  deleteBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this case?")) {
      deleteCase();
    }
  });

  function deleteCase() {
    $.ajax({
      url: "logic/delete-misc-case.php",
      type: "GET",
      data: { id: caseId },
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

  caseStatus.addEventListener("click", function () {
    $.ajax({
      url: "logic/update-misc-status.php",
      type: "POST",
      data: { id: caseId },
      success: function (response) {
        if (response == "success") {
          alert("Case status updated successfully.");
          fetchdata(caseId);
        }
      },
      error: function (xhr, status, error) {
        console.error("AJAX Error:", error);
      },
    });
  });

  // Fetch case details when page loads
  fetchdata(caseId);

  function fetchdata(caseId) {
    $.ajax({
      url: `logic/get-miscellaneous-data.php`,
      method: "GET",
      data: { id: caseId },
      success: function (data) {
        displayCaseDetails(data);

        if (admin == 1) {
          clientAdvocateDocs.classList.remove("hidden");
          // Handle confidential documents

          if (data.clientAdvocate && data.clientAdvocate.length > 0) {
            loadClientAdvocateDocuments(data.clientAdvocate);
          } else {
            loadClientAdvocateDocuments([
              "No client advocate documents available.",
            ]);
          }
        }

        // Handle pleadings
        if (data.pleadings && data.pleadings.length > 0) {
          loadPleadings(data.pleadings);
        } else {
          loadPleadings(["No pleadings available."]);
        }

        // Handle court documents
        if (data.courtDocuments && data.courtDocuments.length > 0) {
          loadCourtDocuments(data.courtDocuments);
        } else {
          loadCourtDocuments(["No court documents available."]);
        }

        // Handle correspondence
        if (data.correspondence && data.correspondence.length > 0) {
          loadCorrespondence(data.correspondence);
        } else {
          loadCorrespondence(["No correspondence available."]);
        }

        // Handle court attendance memo
        if (data.courtAttendanceMemo && data.courtAttendanceMemo.length > 0) {
          loadCourtAttendanceMemo(data.courtAttendanceMemo);
        } else {
          loadCourtAttendanceMemo(["No court attendance memos available."]);
        }

        setupEventListeners(data);
      },
      error: function (xhr, status, err) {
        console.error("AJAX error: ", err);
      },
    });
  }

  function displayCaseDetails(data) {
    const status = document.getElementById("case-status-badge");

    document.title = `Miscellaneous Case - ${data.title}`;

    if (data.status == 0) {
      status.innerHTML = "Active";
    } else if (data.status == 1) {
      status.innerHTML = "Closed";
      status.style.backgroundColor = "#fee2e2"; // Red
      status.style.color = "#991b1b";
    }
    // Populate case details
    document.getElementById("case-title").textContent = data.title;
    document.getElementById("case-number").textContent = data.caseNumber;
    document.getElementById("filing-date").textContent = formatDate(
      data.filingDate
    );
    document.getElementById("party-type-case").textContent = data.type;
    if (data.type === "accused") {
      document.getElementById("party-type-case").style.border =
        "1px solid #3b82f6"; // Blue
    } else if (data.type === "complainant") {
      document.getElementById("party-type-case").style.border =
        "1px solid #fbbf24"; // Yellow
    } else {
      document.getElementById("party-type-case").style.border =
        "1px solid #ef4444"; // Red
    }

    document.getElementById("advocate-name").textContent = data.advocate;

    // Set case notes
    const notesElement = document.getElementById("case-notes");
    if (data.notes && data.notes.trim()) {
      notesElement.innerHTML = data.notes;
    } else {
      notesElement.innerHTML =
        '<p class="text-gray-600">No notes available for this case.</p>';
    }

    const statusBadge = document.querySelector(".case-status-badge");
    const closeDate = document.getElementById("closed-date");
    const statusDate = document.getElementById("case-status-date");
    if (data.status == 0) {
      statusBadge.textContent = "Active";
      statusDate.style.display = "none";
    } else if (data.status == 1) {
      statusBadge.textContent = "Closed";
      statusBadge.style.backgroundColor = "#fee2e2"; // Red
      statusBadge.style.color = "#991b1b";
      const date = new Date(data.dateCompleted);
      closeDate.textContent = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } else {
      statusBadge.textContent = "Archived";
    }

    if (data.status == 0) {
      statusBadge.style.backgroundColor = "var(--blue-100)";
      statusBadge.style.color = "var(--blue-800)";
    } else if (data.status == 1) {
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
          <label for="type" class="form-label">Pleadings party</label>
          <select id="party-category" name="type" class="form-select" required>
            <option value="company">Our pleadings</option>
            <option value="other">Counterpart pleadings</option>
          </select>
          <div class="form-error" id="type-error"></div>
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
          <button type="submit" class="button2">Add Document</button>
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
        url: "logic/add-misc-case-pleadings-document.php", // Backend script
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
          <button type="submit" class="button2">Add Document</button>
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
        url: "logic/add-misc-case-court-document.php", // Backend script
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
          <button type="submit" class="button2">Add Document</button>
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
        url: "logic/add-misc-case-correspondence-document.php", // Backend script
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
          <button type="submit" class="button2">Add Document</button>
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
        url: "logic/add-misc-case-court-attendance-memo.php", // Backend script
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
          <button type="submit" class="button2">Add Document</button>
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
        url: "logic/add-misc-case-client-advocate-document.php", // Backend script
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

  setupAddPleading();

  setupAddCourtDocument();

  setupAddCorrespondence();

  setupAddCourtAttendanceMemo();

  setupAddClientAdvocateDocument();

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function openDocumentViewer(documentt) {
    const modal = document.getElementById("document-viewer-modal");
    const modalTitle = document.getElementById("modal-title");
    const documentPreview = document.getElementById("document-preview");
    const documentDate = document.getElementById("document-date");

    // Set modal content
    modalTitle.textContent = documentt.title;
    documentDate.textContent = formatDate(
      documentt.uploadDate || documentt.date_created
    );

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
    downloadBtn.className = "button2 btn-sm download-button";
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

  function setupEventListeners(data) {
    const modal = document.getElementById("document-viewer-modal");
    const closeModalButton = document.getElementById("close-modal");

    pleadingType.addEventListener("change", function () {
      const selectedType = pleadingType.value;

      if (selectedType === "other") {
        if (
          data.confidentialDocuments &&
          data.confidentialDocuments.length > 0
        ) {
          loadPleadings(data.confidentialDocuments);
        } else {
          loadPleadings(["No counterpart pleadings available."]);
        }
      } else {
        if (data.pleadings && data.pleadings.length > 0) {
          loadPleadings(data.pleadings);
        } else {
          loadPleadings(["No pleadings available."]);
        }
      }
    });

    if (!modal || !closeModalButton) {
      console.error("Modal or Close button not found.");
      return; // Exit early if modal or close button is missing
    }

    // Close modal button
    closeModalButton.addEventListener("click", function () {
      modal.classList.remove("active");
    });

    // Close modal on click outside
    modal.addEventListener("click", function (event) {
      // Ensure the click is on the background and not the content
      if (event.target === modal) {
        modal.classList.remove("active");
      }
    });

    // Close modal on escape key press
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        if (modal.classList.contains("active")) {
          modal.classList.remove("active");
        }
      }
    });
  }
});
