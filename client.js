// DOM elements
document.addEventListener("DOMContentLoaded", function () {
  //get case ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const caseNo = urlParams.get("case_no");
  if (!caseNo) {
    console.error("Case number not found in URL.");
    return;
  }

  // Fetch case data
  fetchCaseData(caseNo);
});

const clientAdvocateDocs = document.getElementById("client-confidential-docs");
const pleadingType = document.getElementById("pleading-type");

function fetchCaseData(caseNo) {
  $.ajax({
    url: "logic/get-client-data.php", // The PHP file path
    method: "GET",
    data: { case_no: caseNo }, // Send the case number as a parameter
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

  // Load client-advocate documents
  loadClientAdvocateDocuments(caseData.clientAdvocate);

  // Load pleadings
  loadPleadings(caseData.pleadings);

  // Load court documents
  loadCourtDocuments(caseData.courtDocs);

  // Load correspondence
  loadCorrespondence(caseData.correspondence);

  // Load court attendance memo
  loadCourtAttendanceMemo(caseData.courtAttendanceMemo);

  // Load timeline
  loadTimeline(caseData.timeline, caseData.documents);
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
      documentt["date_created"],
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
      documentt["date_created"],
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
      documentt["date_created"],
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
    "correspondence-documents-container",
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
      documentt["date_created"],
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
    "attendance-memo-documents-container",
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
      documentt["date_created"],
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
    "client-confidential-docs-container",
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
      documentt["date_created"],
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

function loadConfidentialDocuments(documents) {
  const documentsContainer = document.getElementById(
    "confidential-docs-container",
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
      documentt["date_created"],
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
      step["bringup_date"],
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
      validDocumentIds.includes(String(doc.id)),
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

  documentPreview.appendChild(downloadBtn);

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

function formatDate(dateString) {
  if (!dateString) return "";

  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}
