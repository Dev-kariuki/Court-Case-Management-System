// DOM elements
document.addEventListener("DOMContentLoaded", function () {
  //get case ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const caseId = urlParams.get("id");
  if (!caseId) {
    console.error("Case ID not found in URL.");
    return;
  }
  const caseStatus = document.getElementById("case-status-badge");
  const deleteBtn = document.getElementById("delete-btn");

  deleteBtn.addEventListener("click", () => {
    const confirmation = confirm(
      "Are you sure you want to delete this case? This action cannot be undone."
    );
    if (confirmation) {
      $.ajax({
        url: "logic/delete-legal-case.php",
        method: "GET",
        data: { caseId: caseId },
        success: function (response) {
          alert(response);
          setTimeout(() => {
            window.location.href = "index.php";
          }, 500);
        },
        error: function (error) {
          alert("Error deleting case:" + error);
        },
      });
    }
  });

  caseStatus.addEventListener("click", function () {
    $.ajax({
      url: "logic/update-case-status.php",
      type: "POST",
      data: { id: caseId },
      success: function (response) {
        console.log(response);
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

  // Fetch case data
  fetchCaseData(caseId);
});
$(document).on("click", ".timeline-status", function () {
  const $this = $(this);
  const stepId = $this.data("step-id");
  const currentStatus = $this.text().trim();

  if (currentStatus === "In Progress") {
    $.ajax({
      url: "logic/update-timeline-status.php",
      type: "POST",
      data: { step_id: stepId, new_status: 1 },
      success: function (response) {
        if (response === "success") {
          $this
            .removeClass("in-progress")
            .addClass("completed")
            .text("Completed");
        } else {
          alert("Update failed: " + response);
        }
      },
      error: function () {
        alert("AJAX error occurred.");
      },
    });
  }
});

const clientAdvocateDocs = document.getElementById("client-confidential-docs");
const pleadingType = document.getElementById("pleading-type");

function fetchCaseData(caseId) {
  $.ajax({
    url: "logic/get-case-data.php", // The PHP file path
    method: "GET",
    data: { case_id: caseId }, // Send the case ID as a parameter
    success: function (response) {
      const caseData = JSON.parse(response);

      // Sample data structure: Render case details
      const sampleCase = {
        id: caseData.id,
        caseNumber: caseData.caseNumber,
        title: caseData.title,
        description: caseData.description || "No description available.",
        status: caseData.status,
        filingDate: caseData.filingDate,
        bringUpDate: caseData.bringUpDate,
        court: caseData.court,
        advocate: caseData.advocate,
        dateCompleted: caseData.dateCompleted,
        party: caseData.party,
        parties: caseData.parties.length
          ? caseData.parties
          : ["No parties available."],
        documents: caseData.documents.length
          ? caseData.documents
          : ["No case documents available."],
        pleadings: caseData.pleadings.length
          ? caseData.pleadings
          : ["No pleadings available."],
        courtDocs: caseData.courtDocuments.length
          ? caseData.courtDocuments
          : ["No court documents available."],
        correspondence: caseData.correspondence.length
          ? caseData.correspondence
          : ["No correspondence available."],
        clientAdvocate: caseData.clientAdvocate.length
          ? caseData.clientAdvocate
          : ["No client-advocate documents available."],
        courtAttendanceMemo: caseData.courtAttendanceMemo.length
          ? caseData.courtAttendanceMemo
          : ["No court attendance memo available."],
        confidentialDocuments: caseData.confidentialDocuments.length
          ? caseData.confidentialDocuments
          : ["No counterpart pleadings available."],
        servDocs: caseData.servDocuments.length
          ? caseData.servDocuments
          : ["No service documents available."],
        timeline: caseData.timeline.length
          ? caseData.timeline
          : ["No timeline available."],
      };

      // Initialize the case dossier with the fetched data
      initCaseDossier(sampleCase);
    },
    error: function (error) {
      console.error("Error fetching case data:", error);
    },
  });
}

function initCaseDossier(sampleCase) {
  // Load case data
  loadCaseData(sampleCase);

  // Set up event listeners
  setupEventListeners(sampleCase);
}

function loadCaseData(caseData) {
  // Load case header
  loadCaseHeader(caseData);

  // Load court info
  loadCourtInfo(caseData.court);

  // Load parties involved
  loadPartiesInvolved(caseData.parties);

  // Load documents
  loadDocuments(caseData.documents);

  const admin = localStorage.getItem("admin");
  if (admin == 1) {
    clientAdvocateDocs.classList.remove("hidden");
    // Load client-advocate documents
    loadClientAdvocateDocuments(caseData.clientAdvocate);
  }

  // Load pleadings
  loadPleadings(caseData.pleadings);

  // Load court documents
  loadCourtDocuments(caseData.courtDocs);

  // Load correspondence
  loadCorrespondence(caseData.correspondence);

  // Load court attendance memo
  loadCourtAttendanceMemo(caseData.courtAttendanceMemo);

  // Load service documents
  loadServiceDocs(caseData.servDocs);

  // Load timeline
  loadTimeline(caseData.timeline, caseData.documents);

  // Setup add step form
  setupAddStepForm(caseData.documents);

  setupAddDocument();

  setupAddPleading();

  setupAddCourtDocument();

  setupAddCorrespondence();

  setupAddCourtAttendanceMemo();

  setupAddClientAdvocateDocument();

  setupAddParty();

  setupAddServiceDoc();
}

function loadCaseHeader(caseData) {
  document.title = `Case Dossier - ${caseData.title}`;
  document.getElementById("case-title").textContent = caseData.title;
  document.getElementById("case-number").textContent = caseData.caseNumber;
  document.getElementById("party-type-case").textContent = caseData.party;
  if (caseData.party === "accused") {
    document.getElementById("party-type-case").style.border =
      "1px solid #3b82f6"; // Blue
  } else if (caseData.party === "complainant") {
    document.getElementById("party-type-case").style.border =
      "1px solid #fbbf24"; // Yellow
  } else {
    document.getElementById("party-type-case").style.border =
      "1px solid #ef4444"; // Red
  }

  document.getElementById("case-description").textContent =
    caseData.description;

  const filingDate = new Date(caseData.filingDate);
  document.getElementById("filing-date").textContent =
    filingDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const bringUpDate = new Date(caseData.bringUpDate);
  document.getElementById("bringUpDate").textContent =
    "Bring up date: " +
    bringUpDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  document.getElementById("advocate-name").textContent = caseData.advocate;

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

function loadCourtInfo(court) {
  const courtDetailsContainer = document.getElementById("court-details");
  courtDetailsContainer.innerHTML = ""; // Clear any existing content

  const courtInfoItems = [
    { label: "Court Name", value: court.name },
    { label: "Division", value: court.division },
    { label: "Judge", value: court.judge },
    { label: "Location", value: court.location },
  ];

  courtInfoItems.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "court-detail-item";

    const labelElement = document.createElement("div");
    labelElement.className = "court-detail-label";
    labelElement.textContent = item.label;

    const valueElement = document.createElement("div");
    valueElement.className = "court-detail-value";
    valueElement.textContent = item.value;

    itemElement.appendChild(labelElement);
    itemElement.appendChild(valueElement);

    courtDetailsContainer.appendChild(itemElement);
  });
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
    partyCard.className = `${
      party.type == "plaintiff" ||
      party.type == "defendant" ||
      party.type == "republic" ||
      party.type == "appellant" ||
      party.type == "claimant" ||
      party.type == "respondent"
        ? "party-card other"
        : "party-card " + party.type
    }`;

    const partyName = document.createElement("div");
    partyName.className = "party-name";
    partyName.textContent = party.name || "No name";

    const partyType = document.createElement("div");
    partyType.className = `${
      party.type == "plaintiff" ||
      party.type == "defendant" ||
      party.type == "republic" ||
      party.type == "appellant" ||
      party.type == "claimant" ||
      party.type == "respondent"
        ? "party-type other"
        : "party-type " + party.type
    }`;
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

function loadDocuments(documents) {
  const documentsContainer = document.getElementById("documents-container");

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
    statusButton.textContent = documentt.party || "No party";
    statusButton.style.textTransform = "uppercase";
    statusButton.style.padding = "5px 10px";
    statusButton.style.border = "none";
    statusButton.style.height = "max-content";
    statusButton.style.fontSize = "12px";
    statusButton.style.borderRadius = "5px";
    statusButton.style.fontWeight = "bold";
    statusButton.style.cursor = "pointer";
    statusButton.style.backgroundColor =
      documentt.party == "accused" ? "lightblue" : "#F8A58E";
    statusButton.style.color = documentt.party == "accused" ? "blue" : "red";

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

    /* const statusButton = document.createElement("button");
    statusButton.className = "status-button";
    statusButton.textContent = documentt.party || "No party";
    statusButton.style.textTransform = "uppercase";
    statusButton.style.padding = "5px 10px";
    statusButton.style.border = "none";
    statusButton.style.height = "max-content";
    statusButton.style.fontSize = "12px";
    statusButton.style.borderRadius = "5px";
    statusButton.style.fontWeight = "bold";
    statusButton.style.cursor = "pointer";
    statusButton.style.backgroundColor =
      documentt.party == "company" ? "lightblue" : "#F8A58E";
    statusButton.style.color = documentt.party == "company" ? "blue" : "red"; */

    documentInfo.appendChild(documentTitle);
    documentInfo.appendChild(documentMeta);

    documentInfo1.appendChild(documentInfo);
    /* documentInfo1.appendChild(statusButton); */
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

function loadServiceDocs(documents) {
  const documentsContainer = document.getElementById(
    "service-documents-container"
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
    statusButton.textContent =
      documentt.status === 1 ? "RETURNED SERVICE" : "PENDING SERVICE";
    statusButton.style.padding = "5px 10px";
    statusButton.style.border = "none";
    statusButton.style.fontWeight = "bold";
    statusButton.style.height = "max-content";
    statusButton.style.fontSize = "12px";
    statusButton.style.borderRadius = "5px";
    statusButton.style.cursor = "pointer";
    statusButton.style.backgroundColor =
      documentt.status === 1 ? "green" : "orange";
    statusButton.style.color = "white";

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

function loadTimeline(steps, documents) {
  const timelineContainer = document.getElementById("timeline-container");

  timelineContainer.innerHTML = ""; // Clear any existing content

  if (
    !Array.isArray(steps) ||
    (steps.length === 1 && typeof steps[0] === "string")
  ) {
    timelineContainer.style.paddingLeft = "0px";
    const message = document.createElement("div");
    message.className = "no-parties-message";
    message.textContent = steps[0];
    timelineContainer.appendChild(message);
    return;
  }

  steps.forEach((step) => {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";
    timelineItem.id = "timeline-item-dash" + step.id;

    const timelineDot = document.createElement("div");
    if (step.status == 0) {
      timelineDot.className = "timeline-dot in-progress";
    } else if (step.status == 1) {
      timelineDot.className = "timeline-dot completed";
    } else if (step.status == 2) {
      timelineDot.className = "timeline-dot pending";
    }

    const timelineContent = document.createElement("div");
    timelineContent.className = "timeline-content";

    // Header with title and status
    const timelineHeader = document.createElement("div");
    timelineHeader.className = "timeline-header";

    const timelineTitle = document.createElement("div");
    timelineTitle.className = "timeline-title";
    timelineTitle.textContent = step.title;

    const timelineStatus = document.createElement("span");
    timelineStatus.setAttribute("data-step-id", step.id);
    timelineStatus.style.cursor = "pointer";
    if (step.status == 0) {
      timelineStatus.className = "timeline-status in-progress";
      timelineStatus.textContent = "In Progress";
    } else if (step.status == 1) {
      timelineStatus.className = "timeline-status completed";
      timelineStatus.textContent = "Completed";
    } else if (step.status == 2) {
      timelineStatus.className = "timeline-status pending";
      timelineStatus.textContent = "Pending";
    }

    timelineHeader.appendChild(timelineTitle);
    timelineHeader.appendChild(timelineStatus);

    // Description
    const timelineDescription = document.createElement("div");
    timelineDescription.className = "timeline-description";
    timelineDescription.textContent = step.description;

    // Meta information
    const timelineMeta = document.createElement("div");
    timelineMeta.className = "timeline-meta";

    const dateElement = document.createElement("div");
    dateElement.className = "meta-item";
    dateElement.innerHTML = `<i class="fas fa-calendar"></i> ${formatDate(
      step["bringup_date"]
    )}`;

    const userElement = document.createElement("div");
    userElement.className = "meta-item";
    userElement.innerHTML = `<i class="fas fa-user"></i> ${step["advocate"]}`;

    timelineMeta.appendChild(userElement);
    timelineMeta.appendChild(dateElement);

    // Add all elements to timeline content
    timelineContent.appendChild(timelineHeader);
    timelineContent.appendChild(timelineDescription);
    timelineContent.appendChild(timelineMeta);

    // Add documents if available
    const documentIds = [
      step.supp_doc1,
      step.supp_doc2,
      step.supp_doc3,
      step.supp_doc4,
      step.supp_doc5,
      step.supp_doc6,
      step.supp_doc7,
      step.supp_doc8,
      step.supp_doc9,
      step.supp_doc10,
    ];

    // Filter valid IDs (not null, not empty)
    const validDocumentIds = documentIds.filter((id) => id);

    // Get matching document objects from full document list
    const matchedDocs = documents.filter((doc) =>
      validDocumentIds.includes(String(doc.id))
    );

    if (matchedDocs.length > 0) {
      const documentsSection = document.createElement("div");
      documentsSection.className = "timeline-documents";

      const documentsTitle = document.createElement("div");
      documentsTitle.className = "timeline-documents-title";
      documentsTitle.textContent = "Supporting Documents";

      const documentsList = document.createElement("div");
      documentsList.className = "timeline-documents-list";

      matchedDocs.forEach((doc) => {
        const documentBadge = document.createElement("div");
        documentBadge.className = "document-badge";
        documentBadge.innerHTML = `<i class="fas fa-file-alt"></i> ${doc.title}`;
        documentBadge.addEventListener("click", function (e) {
          e.stopPropagation();
          openDocumentViewer(doc); // Show viewer or modal for file_name
        });

        documentsList.appendChild(documentBadge);
      });

      documentsSection.appendChild(documentsTitle);
      documentsSection.appendChild(documentsList);

      // Append this section to your timeline card/step container
      timelineContent.appendChild(documentsSection);
    }

    // Add all components to timeline item
    timelineItem.appendChild(timelineDot);
    timelineItem.appendChild(timelineContent);

    // Add to timeline container
    timelineContainer.appendChild(timelineItem);
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

    fileItem.addEventListener("click", () => removeFile(filesList, fileInput));

    fileList.appendChild(fileItem);
  }
}

function removeFile(fileListSelector, fileUpload) {
  const filesList = document.getElementById(fileListSelector);
  const fileInput = document.getElementById(fileUpload);

  fileInput.value = ""; // Clear the file input value
  filesList.innerHTML = ""; // Clear the file list
}

function setupAddDocument() {
  const addDocumentButton = document.getElementById("add-document-form-button");
  const addDocumentFormContainer = document.getElementById(
    "add-document-form-container"
  );

  const urlParams = new URLSearchParams(window.location.search);
  const caseId = urlParams.get("id");

  // Create form HTML
  const formHTML = `
    <h3 class="form-title">Add New Document</h3>
    <form id="add-document-form">
      <div class="form-group">
        <label for="title" class="form-label">Document Title</label>
        <input type="text" name="title" id="title" class="form-input" placeholder="Enter document title" required>
        <div class="form-error" id="title-error"></div>
      </div>

      <div class="form-group">
        <label for=type" class="form-label">Party Type</label>
        <select id="party-category" name="type" class="form-select" required>
          <option value="accused">Accused</option>
          <option value="complainant">Complainant</option>
          <option value="republic">Republic</option>
          <option value="appellant">Appellant</option>
          <option value="claimant">Claimant</option>
          <option value="respondent">Respondent</option>
          <option value="plaintiff">Plaintiff</option>
          <option value="defendant">Defendant</option>
        </select>
        <div class="form-error" id="type-error"></div>
      </div>
      
      <div class="form-group">
            <label class="label">Image</label>
            <div class="file-upload" id="dropZone">
              <i class="fas fa-cloud-upload-alt" style="font-size: 30px; color: #333;"></i>
              <p style="font-size: 0.875rem; margin-bottom: 0;">Click to upload or drag and drop</p>
              <p style="font-size: 0.75rem; color: #666; margin-bottom: 0;">
                PDF & Images
              </p>
              <input
                name="file"
                type="file"
                id="fileUpload"
                accept=".pdf,image/*"
                style="display: none"
              />
        </div>

        <div id="fileList"></div>
        
      
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
      addDocumentButton.innerHTML = '<i class="fas fa-plus"></i> Add Document';
    }
  });

  initializeDropZone("dropZone", "fileUpload", "fileList");

  // jQuery AJAX submission
  $(document).on("submit", "#add-document-form", function (e) {
    e.preventDefault();

    const form = document.getElementById("add-document-form");
    const formData = new FormData(form);

    formData.append("case_id", caseId);

    $.ajax({
      url: "logic/add-case-document.php", // Backend script
      method: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        if (response === "success") {
          alert("Document added successfully.");
          $("#add-document-form")[0].reset();
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
      addDocumentButton.innerHTML = '<i class="fas fa-plus"></i> Add Document';
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
      url: "logic/add-case-pleadings-document.php", // Backend script
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
      addDocumentButton.innerHTML = '<i class="fas fa-plus"></i> Add Document';
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
      url: "logic/add-case-court-document.php", // Backend script
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
      addDocumentButton.innerHTML = '<i class="fas fa-plus"></i> Add Document';
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
      url: "logic/add-case-correspondence-document.php", // Backend script
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
      addDocumentButton.innerHTML = '<i class="fas fa-plus"></i> Add Document';
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
      url: "logic/add-case-court-attendance-memo.php", // Backend script
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
      addDocumentButton.innerHTML = '<i class="fas fa-plus"></i> Add Document';
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
      url: "logic/add-case-client-advocate-document.php", // Backend script
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

function setupAddServiceDoc() {
  const addDocumentButton = document.getElementById(
    "add-service-document-button"
  );
  const addDocumentFormContainer = document.getElementById(
    "add-service-doc-form-container"
  );

  const urlParams = new URLSearchParams(window.location.search);
  const caseId = urlParams.get("id");

  // Create form HTML
  const formHTML = `
    <h3 class="form-title">Add New Service Document</h3>
    <form id="add-serv-document-form">
      <div class="form-group">
        <label for="title" class="form-label">Document Title</label>
        <input type="text" name="title" id="title" class="form-input" placeholder="Enter document title" required>
        <div class="form-error" id="title-error"></div>
      </div>
      
      <div class="form-group">
            <label class="label">Image</label>
            <div class="file-upload" id="dropZone2">
              <i class="fas fa-cloud-upload-alt" style="font-size: 30px; color: #333;"></i>
              <p style="font-size: 0.875rem; margin-bottom: 0;">Click to upload or drag and drop</p>
              <p style="font-size: 0.75rem; color: #666; margin-bottom: 0;">
                PDF & Images
              </p>
              <input
                name="file"
                type="file"
                id="fileUpload2"
                accept=".pdf,image/*"
                style="display: none"
              />
        </div>

        <div id="fileList2"></div>
        
      
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
      addDocumentButton.innerHTML = '<i class="fas fa-plus"></i> Add Document';
    }
  });

  initializeDropZone("dropZone2", "fileUpload2", "fileList2");

  // jQuery AJAX submission
  $(document).on("submit", "#add-serv-document-form", function (e) {
    e.preventDefault();

    const form = document.getElementById("add-serv-document-form");
    const formData = new FormData(form);

    formData.append("case_id", caseId);

    $.ajax({
      url: "logic/add-serv-case-document.php", // Backend script
      method: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        if (response === "success") {
          alert("Document added successfully.");
          $("#add-serv-document-form")[0].reset();
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
        <button type="submit" class="button">Add Document</button>
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
      url: "logic/add-conf-case-document.php", // Backend script
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

function setupAddParty() {
  const addPartyButton = document.getElementById("add-party-button");
  const addPartyFormContainer = document.getElementById(
    "add-party-form-container"
  );

  const urlParams = new URLSearchParams(window.location.search);
  const caseId = urlParams.get("id");

  // Create form HTML
  const formHTML = `
    <h3 class="form-title">Add New Party</h3>
    <form id="add-party-form">
      <div class="form-group">
        <label for="party-name" class="form-label">Party Name</label>
        <input type="text" name="name" id="party-name" class="form-input" placeholder="Enter party name" required>
        <div class="form-error" id="name-error"></div>
      </div>

      <div class="form-group">
        <label for="role" class="form-label">Party Role</label>
        <input type="text" name="role" id="role" class="form-input" placeholder="Enter party role" required>
        <div class="form-error" id="occupation-error"></div>
      </div>
      
      <div class="form-group">
        <label for="party-category" class="form-label">Party Type</label>
        <select id="party-category" name="type" class="form-select" required>
          <option value="accused">Accused</option>
          <option value="complainant">Complainant</option>
          <option value="witness">Witness</option>
          <option value="republic">Republic</option>
          <option value="appellant">Appellant</option>
          <option value="claimant">Claimant</option>
          <option value="respondent">Respondent</option>
          <option value="plaintiff">Plaintiff</option>
          <option value="defendant">Defendant</option>
        </select>
        <div class="form-error" id="type-error"></div>
      </div>
 
      <div class="form-group">
        <label for="party-contact" class="form-label">Party Contact</label>
        <input type="text" name="contact" id="party-contact" class="form-input" placeholder="Enter party contact" required>
        <div class="form-error" id="contact-error"></div>
      </div>
      
      <div class="form-group" style="margin-top: 1.5rem;">
        <button type="submit" class="button">Add Party</button>
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
      role: $("#role").val(),
      type: $("#party-category").val(),
      contact: $("#party-contact").val(),
      case_id: caseId, // Make sure this is defined globally
    };

    $.ajax({
      url: "logic/add-case-party.php", // Backend script
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

function setupAddStepForm(documents) {
  const addStepButton = document.getElementById("add-step-button");
  const addStepFormContainer = document.getElementById(
    "add-step-form-container"
  );
  const timelineContainer = document.getElementById("timeline-container");

  // Create form HTML
  const formHTML = `
    <h3 class="form-title">Add New Step</h3>
    <form id="add-step-form">
      <div class="form-group">
        <label for="step-title" class="form-label">Step Title</label>
        <input type="text" id="step-title" class="form-input" placeholder="Enter step title" required>
        <div class="form-error" id="title-error"></div>
      </div>
      
      <div class="form-group">
        <label for="step-description" class="form-label">Description</label>
        <textarea id="step-description" class="form-textarea" placeholder="Describe the step completed" required></textarea>
        <div class="form-error" id="description-error"></div>
      </div>
      
      <div class="form-grid">
        <div class="form-group">
          <label for="step-date" class="form-label">Date</label>
          <input type="date" id="step-date" class="form-input">
          <div class="form-error" id="date-error"></div>
        </div>
        
        <div class="form-group">
          <label for="step-completed-by" class="form-label">Advocate</label>
          <input type="text" id="step-completed-by" class="form-input" placeholder="Enter name">
          <div class="form-error" id="completed-by-error"></div>
        </div>
      </div>
      
      <div class="form-group">
        <label for="step-status" class="form-label">Status</label>
        <select id="step-status" class="form-select" required>
          <option value="0">In Progress</option>
          <option value="1">Completed</option>
          <option value="2">Pending</option>
        </select>
        <div class="form-error" id="status-error"></div>
      </div>
      
      <div class="form-group">
        <label class="form-label">Supporting Documents</label>
        <div class="document-selection">
          <select id="document-select" class="form-select">
            <option value="">Select a document</option>
            ${documents
              .map((doc) => `<option value="${doc.id}">${doc.title}</option>`)
              .join("")}
          </select>
          <button type="button" id="add-step-document-button" class="button btn-outline btn-sm" style="margin-top: 0.5rem;">
            <i class="fas fa-plus"></i> Add Document
          </button>
        </div>
        <div id="selected-documents" class="selected-documents"></div>
      </div>
      
      <div class="form-group" style="margin-top: 1.5rem;">
        <button type="submit" class="button">Add Step</button>
      </div>
    </form>
  `;

  addStepFormContainer.innerHTML = formHTML;

  // Toggle form visibility
  addStepButton.addEventListener("click", function () {
    addStepFormContainer.classList.toggle("hidden");
    if (addStepButton.innerHTML.includes("Add Step")) {
      addStepButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
    } else {
      addStepButton.innerHTML = '<i class="fas fa-plus"></i> Add Step';
    }
  });

  // Handle document selection
  const addDocumentButton = document.getElementById("add-step-document-button");
  const documentSelect = document.getElementById("document-select");
  const selectedDocumentsContainer =
    document.getElementById("selected-documents");
  const selectedDocuments = [];

  addDocumentButton.addEventListener("click", function () {
    const selectedDocumentId = documentSelect.value;
    if (selectedDocumentId && !selectedDocuments.includes(selectedDocumentId)) {
      const selectedDocument = documents.find(
        (doc) => doc.id == selectedDocumentId
      );
      if (selectedDocument) {
        selectedDocuments.push(selectedDocumentId);

        const documentElement = document.createElement("div");
        documentElement.className = "selected-document";
        documentElement.innerHTML = `
          <span>${selectedDocument.title}</span>
          <span class="remove-document" data-id="${selectedDocument.id}">
            <i class="fas fa-times"></i>
          </span>
        `;

        selectedDocumentsContainer.appendChild(documentElement);

        // Reset select
        documentSelect.value = "";
      }
    }
  });

  // Handle document removal
  selectedDocumentsContainer.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("remove-document") ||
      e.target.parentElement.classList.contains("remove-document")
    ) {
      const removeButton = e.target.classList.contains("remove-document")
        ? e.target
        : e.target.parentElement;
      const documentId = removeButton.dataset.id;
      const index = selectedDocuments.indexOf(documentId);

      if (index !== -1) {
        selectedDocuments.splice(index, 1);
        removeButton.parentElement.remove();
      }
    }
  });

  // Handle form submission
  const addStepForm = document.getElementById("add-step-form");
  addStepForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate form
    if (!validateStepForm()) {
      return;
    }

    const title = document.getElementById("step-title").value;
    const description = document.getElementById("step-description").value;
    const dateCompleted = document.getElementById("step-date").value;
    const completedBy = document.getElementById("step-completed-by").value;
    const status = document.getElementById("step-status").value;

    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get("id");

    // Build data for up to 10 document IDs
    const suppDocs = [];
    for (let i = 0; i < 10; i++) {
      suppDocs[i] = selectedDocuments[i] || null;
    }

    const formData = {
      title,
      description,
      date_completed: dateCompleted,
      completed_by: completedBy,
      status,
      case_id: caseId,
      supp_doc1: suppDocs[0],
      supp_doc2: suppDocs[1],
      supp_doc3: suppDocs[2],
      supp_doc4: suppDocs[3],
      supp_doc5: suppDocs[4],
      supp_doc6: suppDocs[5],
      supp_doc7: suppDocs[6],
      supp_doc8: suppDocs[7],
      supp_doc9: suppDocs[8],
      supp_doc10: suppDocs[9],
    };

    $.ajax({
      url: "logic/add-timeline-step.php",
      method: "POST",
      data: formData,
      success: function (response) {
        console.log(response);
        if (response === "success") {
          timelineContainer.style.paddingLeft = "initial";
          // Add to timeline
          addStepToTimeline(formData, documents);
          showNotification("Step added successfully", "success");
          addStepForm.reset();
          selectedDocumentsContainer.innerHTML = "";
          selectedDocuments.length = 0;
          addStepFormContainer.classList.add("hidden");
          addStepButton.innerHTML = '<i class="fas fa-plus"></i> Add Step';

          window.location.reload();
        } else {
          alert("Error: " + response);
        }
      },
      error: function (xhr, status, error) {
        alert("AJAX error: " + error);
      },
    });
  });
}

function validateStepForm() {
  let isValid = true;

  // Validate title
  const title = document.getElementById("step-title").value;
  const titleError = document.getElementById("title-error");
  if (!title || title.length < 2) {
    titleError.textContent = "Title must be at least 2 characters";
    isValid = false;
  } else {
    titleError.textContent = "";
  }

  // Validate description
  const description = document.getElementById("step-description").value;
  const descriptionError = document.getElementById("description-error");
  if (!description || description.length < 10) {
    descriptionError.textContent = "Description must be at least 10 characters";
    isValid = false;
  } else {
    descriptionError.textContent = "";
  }

  return isValid;
}

function addStepToTimeline(step, documents) {
  const timelineContainer = document.getElementById("timeline-container");
  timelineContainer.style.paddingLeft = "3rem";

  const timelineItem = document.createElement("div");
  timelineItem.className = "timeline-item";

  const timelineDot = document.createElement("div");
  if (step.status == 0) {
    timelineDot.className = "timeline-dot in-progress";
  } else if (step.status == 1) {
    timelineDot.className = "timeline-dot completed";
  } else if (step.status == 2) {
    timelineDot.className = "timeline-dot pending";
  }

  const timelineContent = document.createElement("div");
  timelineContent.className = "timeline-content";

  // Header with title and status
  const timelineHeader = document.createElement("div");
  timelineHeader.className = "timeline-header";

  const timelineTitle = document.createElement("div");
  timelineTitle.className = "timeline-title";
  timelineTitle.textContent = step.title;

  const timelineStatus = document.createElement("span");
  timelineStatus.setAttribute("data-step-id", step.id);
  timelineStatus.style.cursor = "pointer";
  if (step.status == 0) {
    timelineStatus.className = "timeline-status in-progress";
    timelineStatus.textContent = "In Progress";
  } else if (step.status == 1) {
    timelineStatus.className = "timeline-status completed";
    timelineStatus.textContent = "Completed";
  } else if (step.status == 2) {
    timelineStatus.className = "timeline-status pending";
    timelineStatus.textContent = "Pending";
  }

  timelineHeader.appendChild(timelineTitle);
  timelineHeader.appendChild(timelineStatus);

  // Description
  const timelineDescription = document.createElement("div");
  timelineDescription.className = "timeline-description";
  timelineDescription.textContent = step.description;

  // Meta information
  const timelineMeta = document.createElement("div");
  timelineMeta.className = "timeline-meta";

  const dateElement = document.createElement("div");
  dateElement.className = "meta-item";
  dateElement.innerHTML = `<i class="fas fa-calendar"></i> ${formatDate(
    step["date_completed"]
  )}`;

  const userElement = document.createElement("div");
  userElement.className = "meta-item";
  userElement.innerHTML = `<i class="fas fa-user"></i> ${step["advocate"]}`;

  timelineMeta.appendChild(userElement);
  timelineMeta.appendChild(dateElement);

  // Add all elements to timeline content
  timelineContent.appendChild(timelineHeader);
  timelineContent.appendChild(timelineDescription);
  timelineContent.appendChild(timelineMeta);

  // Add documents if available
  const documentIds = [
    step.supp_doc1,
    step.supp_doc2,
    step.supp_doc3,
    step.supp_doc4,
    step.supp_doc5,
    step.supp_doc6,
    step.supp_doc7,
    step.supp_doc8,
    step.supp_doc9,
    step.supp_doc10,
  ];

  // Filter valid IDs (not null, not empty)
  const validDocumentIds = documentIds.filter((id) => id);

  // Get matching document objects from full document list
  const matchedDocs = documents.filter((doc) =>
    validDocumentIds.includes(doc.id)
  );

  if (matchedDocs.length > 0) {
    const documentsSection = document.createElement("div");
    documentsSection.className = "timeline-documents";

    const documentsTitle = document.createElement("div");
    documentsTitle.className = "timeline-documents-title";
    documentsTitle.textContent = "Supporting Documents";

    const documentsList = document.createElement("div");
    documentsList.className = "timeline-documents-list";

    matchedDocs.forEach((doc) => {
      const documentBadge = document.createElement("div");
      documentBadge.className = "document-badge";
      documentBadge.innerHTML = `<i class="fas fa-file-alt"></i> ${doc.title}`;
      documentBadge.addEventListener("click", function (e) {
        e.stopPropagation();
        openDocumentViewer(doc); // Show viewer or modal for file_name
      });

      documentsList.appendChild(documentBadge);
    });

    documentsSection.appendChild(documentsTitle);
    documentsSection.appendChild(documentsList);

    // Append this section to your timeline card/step container
    timelineContent.appendChild(documentsSection);
  }

  // Add all components to timeline item
  timelineItem.appendChild(timelineDot);
  timelineItem.appendChild(timelineContent);

  // Add to timeline container
  timelineContainer.insertBefore(timelineItem, timelineContainer.firstChild);

  // Add animation class
  timelineItem.classList.add("animate-fadeDown");
  setTimeout(() => {
    timelineItem.classList.remove("animate-fadeDown");
  }, 500);
}

function openDocumentViewer(documentt) {
  const modal = document.getElementById("document-viewer-modal");
  const modalTitle = document.getElementById("modal-title");
  const documentPreview = document.getElementById("document-preview");
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

  // Add status button only for service documents
  if (documentt.isServiceDocument) {
    const statusButton = document.createElement("button");
    statusButton.className = "status-button";
    statusButton.title = "Click to mark as returned";
    statusButton.textContent =
      documentt.status === 1 ? "RETURNED SERVICE" : "Mark as Returned";
    statusButton.style.padding = "5px 10px";
    statusButton.style.border = "none";
    statusButton.style.borderRadius = "5px";
    statusButton.style.fontWeight = "bold";
    statusButton.style.fontSize = "12px";
    statusButton.style.cursor = "pointer";
    statusButton.style.backgroundColor =
      documentt.status === 1 ? "green" : "orange";
    statusButton.style.color = "white";

    // Add click event to toggle status
    statusButton.addEventListener("click", function () {
      const newStatus = 1;

      if (documentt.status == 1) {
        return;
      }
      // Update status via AJAX
      $.ajax({
        url: "logic/update-service-document-status.php", // Replace with your backend endpoint
        type: "POST",
        data: { document_id: documentt.id, status: newStatus },
        success: function (response) {
          if (response == "success") {
            alert("Stamped successfully.");
            documentt.status = newStatus;
            statusButton.textContent =
              documentt.status === 1 ? "RETURNED SERVICE" : "PENDING SERVICE";
            statusButton.style.backgroundColor =
              documentt.status === 1 ? "green" : "orange";
          } else {
            alert("Failed to update status. Please try again.");
          }
        },
        error: function (xhr, status, error) {
          console.error("Error updating status:", error);
          alert("An error occurred while updating the status.");
        },
      });
    });

    downloadStatus.appendChild(statusButton);
  }

  documentPreview.appendChild(downloadStatus);

  // Show modal
  modal.classList.add("active");
}

function setupEventListeners(caseData) {
  const modal = document.getElementById("document-viewer-modal");
  const closeModalButton = document.getElementById("close-modal");

  if (!modal || !closeModalButton) {
    console.error("Modal or Close button not found.");
    return; // Exit early if modal or close button is missing
  }

  pleadingType.addEventListener("change", function () {
    const selectedType = pleadingType.value;

    if (selectedType === "other") {
      loadPleadings(caseData.confidentialDocuments);
    } else {
      loadPleadings(caseData.pleadings);
    }
  });

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

// Helper functions
function formatDate(dateString) {
  if (!dateString) return "";

  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Add close button
  const closeButton = document.createElement("span");
  closeButton.className = "notification-close";
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", function () {
    notification.remove();
  });

  notification.appendChild(closeButton);

  // Add to DOM
  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);

  // Add styles for notification if not already in CSS
  if (!document.querySelector("style#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      .notification {
        position: fixed;
        top: 1rem;
        right: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 0.375rem;
        background-color: var(--white);
        box-shadow: var(--shadow-elevated);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 24rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .notification.info {
        border-left: 4px solid var(--blue-500);
      }
      
      .notification.success {
        border-left: 4px solid var(--green-500);
      }
      
      .notification.warning {
        border-left: 4px solid var(--yellow-500);
      }
      
      .notification.error {
        border-left: 4px solid var(--red-500);
      }
      
      .notification-close {
        cursor: pointer;
        margin-left: 0.75rem;
        font-size: 1.25rem;
        line-height: 1;
      }
      
      .notification.fade-out {
        opacity: 0;
        transform: translateX(10px);
        transition: opacity 0.3s, transform 0.3s;
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
}
