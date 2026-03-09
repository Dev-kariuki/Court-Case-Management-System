document.addEventListener("DOMContentLoaded", function () {
  // Initial data structure - kept for reference and state management
  const initialPhases = [
    {
      id: "due-diligence",
      name: "Due Diligence",
      completed: false,
      active: true,
      steps: [
        {
          id: "title-search",
          name: "Title Search",
          phase: "due-diligence",
          description:
            "Conduct a comprehensive search of the property title to ensure there are no liens, encumbrances, or other issues.",
          completed: false,
          documents: [
            {
              id: "title-report",
              name: "Title Report",
              type: "application/pdf",
              step: "title-search",
              phase: "due-diligence",
              date: "",
              completed: false,
              file: null,
              url: null,
            },
          ],
        },
        {
          id: "ground-verification",
          name: "Ground Verification",
          phase: "due-diligence",
          description:
            "Physical inspection of the property to confirm boundaries and identify any potential issues not covered in documentation.",
          completed: false,
          documents: [
            {
              id: "inspection-report",
              name: "Inspection Report",
              type: "application/pdf",
              step: "ground-verification",
              phase: "due-diligence",
              date: "",
              completed: false,
              file: null,
              url: null,
            },
            {
              id: "property-photos",
              name: "Property Photos",
              type: "image/*",
              step: "ground-verification",
              phase: "due-diligence",
              date: "",
              completed: false,
              file: null,
              url: null,
            },
          ],
        },
        {
          id: "survey-map-review",
          name: "Survey Map Review",
          phase: "due-diligence",
          description:
            "Review of property survey maps to confirm property boundaries, easements, and rights of way.",
          completed: false,
          documents: [
            {
              id: "survey-map",
              name: "Survey Map",
              type: "application/pdf",
              step: "survey-map-review",
              phase: "due-diligence",
              date: "",
              completed: false,
              file: null,
              url: null,
            },
          ],
        },
      ],
    },
    {
      id: "contract",
      name: "Contract",
      completed: false,
      active: false,
      steps: [
        {
          id: "drafting-sale-agreement",
          name: "Drafting Sale Agreement",
          phase: "contract",
          description:
            "Creation of a comprehensive sale agreement that outlines all terms and conditions of the property transfer.",
          completed: false,
          documents: [
            {
              id: "draft-agreement",
              name: "Draft Agreement",
              type: "application/pdf",
              step: "drafting-sale-agreement",
              phase: "contract",
              date: "",
              completed: false,
              file: null,
              url: null,
            },
          ],
        },
        {
          id: "exchange-contracts",
          name: "Exchange of Contracts",
          phase: "contract",
          description:
            "Formal exchange of signed contracts between buyer and seller, often with a deposit paid at this stage.",
          completed: false,
          documents: [
            {
              id: "signed-contract",
              name: "Signed Contract",
              type: "application/pdf",
              step: "exchange-contracts",
              phase: "contract",
              date: "",
              completed: false,
              file: null,
              url: null,
            },
            {
              id: "deposit-receipt",
              name: "Deposit Receipt",
              type: "application/pdf",
              step: "exchange-contracts",
              phase: "contract",
              date: "",
              completed: false,
              file: null,
              url: null,
            },
          ],
        },
      ],
    },
    {
      id: "completion",
      name: "Completion",
      completed: false,
      active: false,
      steps: [
        {
          id: "transfer-document-preparation",
          name: "Transfer Document Preparation",
          phase: "completion",
          description:
            "Preparation of all documents required for the legal transfer of the property.",
          completed: false,
          documents: [
            {
              id: "transfer-deed",
              name: "Transfer Deed",
              type: "application/pdf",
              step: "transfer-document-preparation",
              phase: "completion",
              date: "",
              completed: false,
              file: null,
              url: null,
            },
          ],
        },
        {
          id: "paying-stamp-duty",
          name: "Paying Stamp Duty & Fees",
          phase: "completion",
          description:
            "Payment of all necessary government fees, including stamp duty, to complete the transaction legally.",
          completed: false,
          documents: [
            {
              id: "stamp-duty-receipt",
              name: "Stamp Duty Receipt",
              type: "application/pdf",
              step: "paying-stamp-duty",
              phase: "completion",
              date: "",
              completed: false,
              file: null,
              url: null,
            },
            {
              id: "fee-receipts",
              name: "Other Fee Receipts",
              type: "application/pdf",
              step: "paying-stamp-duty",
              phase: "completion",
              date: "",
              completed: false,
              file: null,
              url: null,
            },
          ],
        },
      ],
    },
  ];

  const initialCorrespondences = [
    {
      id: "welcome-letter",
      name: "Welcome Letter",
      date: "",
      type: "letter",
      to: "Buyer",
      from: "Solicitor",
      completed: false,
      file: null,
      url: null,
    },
    {
      id: "initial-inquiry",
      name: "Initial Inquiry",
      date: "",
      type: "email",
      to: "Seller",
      from: "Agent",
      completed: false,
      file: null,
      url: null,
    },
    {
      id: "client-call-notes",
      name: "Client Call Notes",
      date: "",
      type: "phone",
      to: "Buyer",
      from: "Solicitor",
      completed: false,
      file: null,
      url: null,
    },
  ];

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
          if (response == "success") {
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

  // Initialize state
  let correspondences = initialCorrespondences;
  let previewCorrespondence = null;
  let phases = initialPhases;
  let expandedSteps = {};
  let previewDocument = null;

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

        transformCorrespondences(caseData);

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

          titleReport: caseData.titleReport,
          inspectionReport: caseData.inspectionReport,
          propertyPhotos: caseData.propertyPhotos,
          surveyMap: caseData.surveyMap,
          draftAgreement: caseData.draftAgreement,
          signedContract: caseData.signedContract,
          depositReceipt: caseData.depositReceipt,
          transferDeed: caseData.transferDeed,
          stampDutyReceipt: caseData.stampDutyReceipt,
          feeReceipts: caseData.feeReceipts,

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
              : ["No pleadings available."],
          courtDocuments:
            caseData.courtDocuments && caseData.courtDocuments.length
              ? caseData.courtDocuments
              : ["No court documents available."],
          clientAdvocate:
            caseData.clientAdvocateDocs && caseData.clientAdvocateDocs.length
              ? caseData.clientAdvocateDocs
              : ["No client advocate documents available."],
          courtAttendanceMemo:
            caseData.courtAttendanceMemo && caseData.courtAttendanceMemo.length
              ? caseData.courtAttendanceMemo
              : ["No court attendance memo available."],
        };

        const fetchedDocs = transformCaseDocuments(sampleCase);
        injectDocuments(fetchedDocs);
        // Initialize the case dossier with the fetched data
        initializeUI(sampleCase);
      },
      error: function (error) {
        console.error("Error fetching case data:", error);
      },
    });
  }

  function injectDocuments(fetchedDocs) {
    fetchedDocs.forEach((doc) => {
      for (const phase of phases) {
        if (phase.id !== doc.phase) continue;

        const step = phase.steps.find((s) => s.id === doc.step);
        if (!step) continue;

        const targetDoc = step.documents.find((d) => d.id === doc.id);
        if (!targetDoc) continue;

        // Inject data into document
        targetDoc.completed = true;
        targetDoc.file = doc.filename;
        targetDoc.date =
          doc.uploadedAt || new Date().toISOString().split("T")[0];
        targetDoc.url = `logic/uploads/${doc.filename}`;
      }
    });

    // Optionally mark completed steps and phases
    phases.forEach((phase, index) => {
      let allStepsComplete = true;

      phase.steps.forEach((step) => {
        if (step.documents.every((doc) => doc.completed)) {
          step.completed = true;
        } else {
          allStepsComplete = false;
        }
      });

      // Mark phase as complete if all steps are complete
      if (allStepsComplete) {
        phase.completed = true;
      } else {
        phase.completed = false;
      }

      // If the current phase is complete, mark the next phase as active
      if (phase.completed) {
        phase.active = false; // Mark current phase as inactive
        if (index + 1 < phases.length) {
          phases[index + 1].active = true; // Make next phase active
        }
      }
    });
  }

  function transformCaseDocuments(caseData) {
    return [
      {
        id: "title-report",
        step: "title-search",
        phase: "due-diligence",
        filename: caseData.titleReport || null,
        uploadedAt: caseData.titleReport?.uploadedAt || null,
      },
      {
        id: "inspection-report",
        step: "ground-verification",
        phase: "due-diligence",
        filename: caseData.inspectionReport || null,
        uploadedAt: caseData.inspectionReport?.uploadedAt || null,
      },
      {
        id: "property-photos",
        step: "ground-verification",
        phase: "due-diligence",
        filename: caseData.propertyPhotos || null,
        uploadedAt: caseData.propertyPhotos?.uploadedAt || null,
      },
      {
        id: "survey-map",
        step: "survey-map-review",
        phase: "due-diligence",
        filename: caseData.surveyMap || null,
        uploadedAt: caseData.surveyMap?.uploadedAt || null,
      },
      {
        id: "draft-agreement",
        step: "drafting-sale-agreement",
        phase: "contract",
        filename: caseData.draftAgreement || null,
        uploadedAt: caseData.draftAgreement?.uploadedAt || null,
      },
      {
        id: "signed-contract",
        step: "exchange-contracts",
        phase: "contract",
        filename: caseData.signedContract || null,
        uploadedAt: caseData.signedContract?.uploadedAt || null,
      },
      {
        id: "deposit-receipt",
        step: "exchange-contracts",
        phase: "contract",
        filename: caseData.depositReceipt || null,
        uploadedAt: caseData.depositReceipt?.uploadedAt || null,
      },
      {
        id: "transfer-deed",
        step: "transfer-document-preparation",
        phase: "completion",
        filename: caseData.transferDeed || null,
        uploadedAt: caseData.transferDeed?.uploadedAt || null,
      },
      {
        id: "stamp-duty-receipt",
        step: "paying-stamp-duty",
        phase: "completion",
        filename: caseData.stampDutyReceipt || null,
        uploadedAt: caseData.stampDutyReceipt?.uploadedAt || null,
      },
      {
        id: "fee-receipts",
        step: "paying-stamp-duty",
        phase: "completion",
        filename: caseData.feeReceipts || null,
        uploadedAt: caseData.feeReceipts?.uploadedAt || null,
      },
    ].filter((doc) => doc.filename); // Only keep non-null files
  }

  function transformCorrespondences(caseData) {
    if (!caseData.correspondence || !Array.isArray(caseData.correspondence)) {
      return;
    }

    correspondences = initialCorrespondences.map((item) => {
      const matched = caseData.correspondence.find(
        (c) => c.corr_id === item.id
      );

      if (matched) {
        return {
          ...item,
          date: matched.date || "",
          type: item.type,
          to: item.to,
          from: item.from,
          completed: matched.completed === "1" || matched.completed === 1,
          file: matched.file || null,
          url: matched.file ? `logic/uploads/${matched.file}` : null,
        };
      }

      return item;
    });
  }

  // DOM elements
  const documentPreviewModal = document.getElementById("document-preview");
  const toastContainer = document.getElementById("toast-container");
  const confidentialDocs = document.getElementById("confidential-docs");
  const clientAdvocateDocs = document.getElementById(
    "client-confidential-docs"
  );

  // Initialize the UI
  function initializeUI(caseData) {
    loadPartiesInvolved(caseData.parties);
    const admin = localStorage.getItem("admin");
    if (admin == 1) {
      confidentialDocs.classList.remove("hidden");
      clientAdvocateDocs.classList.remove("hidden");
      // Load confidential documents
      loadConfidentialDocuments(caseData.confidentialDocuments);
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

    setupAddParty();

    setupAddPleading();

    setupAddCourtDocument();

    setupAddCorrespondence();

    setupAddCourtAttendanceMemo();

    setupAddClientAdvocateDocument();

    loadCaseHeader(caseData);

    renderCorrespondences();
    setupAddConfidentialDoc();
    updatePhaseIndicators();
    attachEventListeners();
    restoreUserProgress();
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

  // Update phase indicators based on the current state
  function updatePhaseIndicators() {
    const indicators = document.querySelectorAll(
      "#phase-indicators .stage-indicator"
    );
    phases.forEach((phase, index) => {
      const indicator = indicators[index];
      if (!indicator) return;

      indicator.classList.remove("completed", "active");

      if (phase.completed) {
        indicator.classList.add("completed");
        indicator.innerHTML = '<span class="icon icon-check"></span>';
      } else if (phase.active) {
        indicator.classList.add("active");
        indicator.innerHTML = `<span>${index + 1}</span>`;
      } else {
        indicator.innerHTML = `<span>${index + 1}</span>`;
      }

      // Update phase element
      const phaseElement = document.getElementById(`phase-${phase.id}`);
      if (phaseElement) {
        if (phase.completed) {
          phaseElement.classList.add("border-primary/30", "bg-primary/5");
          phaseElement.classList.remove("opacity-50");
          phaseElement.classList.add("opacity-100");
          document.getElementById(`phase-status-${phase.id}`).textContent =
            "Completed";
        } else if (phase.active) {
          phaseElement.classList.remove("opacity-50");
          phaseElement.classList.add("opacity-100");
          document.getElementById(`phase-status-${phase.id}`).textContent =
            "In Progress";
        } else {
          phaseElement.classList.add("opacity-50");
          phaseElement.classList.remove("opacity-100");
        }
      }
    });
  }

  // Attach event listeners to interactive elements
  function attachEventListeners() {
    // Add click listeners to step headers for expanding/collapsing
    const stepHeaders = document.querySelectorAll("[data-step-id]");
    stepHeaders.forEach((header) => {
      header.addEventListener("click", function () {
        const stepId = this.getAttribute("data-step-id");
        toggleStep(stepId);
      });
    });

    // Add event listeners to file upload areas
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.addEventListener("change", function (e) {
        const documentId = this.getAttribute("data-document-id");
        const stepId = this.getAttribute("data-step-id");
        const phaseId = this.getAttribute("data-phase-id");

        const files = e.target.files;
        if (files && files.length > 0) {
          const document = findDocument(phaseId, stepId, documentId);
          if (document) {
            uploadFile(files[0], document);
          }
        }
      });
    });

    // Add drag-and-drop listeners to file upload areas
    const dropAreas = document.querySelectorAll(".file-upload-area");
    dropAreas.forEach((area) => {
      area.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.add("dragging");
      });

      area.addEventListener("dragleave", function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove("dragging");
      });

      area.addEventListener("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove("dragging");

        const documentId = this.getAttribute("data-document-id");
        const stepId = this.getAttribute("data-step-id");
        const phaseId = this.getAttribute("data-phase-id");

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          const document = findDocument(phaseId, stepId, documentId);
          if (document) {
            uploadFile(files[0], document);
          }
        }
      });

      area.addEventListener("click", function () {
        const documentId = this.getAttribute("data-document-id");
        const fileInput = document.getElementById(`file-${documentId}`);
        if (fileInput) {
          fileInput.click();
        }
      });
    });

    // Add listeners to complete step buttons
    const completeButtons = document.querySelectorAll(".step-complete-btn");
    completeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const stepId = this.getAttribute("data-step-id");
        const phaseId = this.getAttribute("data-phase-id");

        const stepIdd = stepId.replace(/-complete$/, "");

        const phase = phases.find((p) => p.id === phaseId);
        const step = phase ? phase.steps.find((s) => s.id === stepIdd) : null;

        if (phase && step) {
          handleMarkStepComplete(phase, step);
        }
      });
    });

    // Close preview when clicking outside
    documentPreviewModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closePreview();
      }
    });
  }

  // Find document object in the data model
  function findDocument(phaseId, stepId, documentId) {
    const phase = phases.find((p) => p.id === phaseId);
    if (!phase) return null;

    const step = phase.steps.find((s) => s.id === stepId);
    if (!step) return null;

    return step.documents.find((d) => d.id === documentId);
  }

  // Restore user progress from saved state
  function restoreUserProgress() {
    phases.forEach((phase) => {
      // Update phase completion state
      phase.steps.forEach((step) => {
        // Update step completion state
        if (step.completed) {
          updateStepUI(step.id, true);
        }

        // Update document states
        step.documents.forEach((doc) => {
          if (doc.completed) {
            updateDocumentUI(doc);
          }
        });
      });
    });
  }

  // Toggle step expansion
  function toggleStep(stepId) {
    expandedSteps[stepId] = !expandedSteps[stepId];

    const stepContent = document.querySelector(`#step-${stepId} .step-content`);
    const chevron = document.querySelector(
      `#step-${stepId} [data-step-id="${stepId}"] .icon-chevron-right, #step-${stepId} [data-step-id="${stepId}"] .icon-chevron-down`
    );

    if (stepContent) {
      if (expandedSteps[stepId]) {
        stepContent.style.display = "block";
        if (chevron) {
          chevron.classList.remove("icon-chevron-right");
          chevron.classList.add("icon-chevron-down");
        }
      } else {
        stepContent.style.display = "none";
        if (chevron) {
          chevron.classList.remove("icon-chevron-down");
          chevron.classList.add("icon-chevron-right");
        }
      }
    }
  }

  setupEventListeners();

  // Render correspondences
  function renderCorrespondences() {
    const correspondenceContainer = document.getElementById(
      "correspondence-container"
    );
    correspondenceContainer.innerHTML = "";

    correspondences.forEach((correspondence) => {
      const correspondenceElement = document.createElement("div");
      correspondenceElement.className = `border mb-3 rounded-lg overflow-hidden transition-all duration-300 ${
        correspondence.completed
          ? "border-primary/30 bg-primary/5"
          : "border-border"
      }`;

      const headerDiv = document.createElement("div");
      headerDiv.className = "p-4";

      const titleDiv = document.createElement("div");
      titleDiv.className = "flex items-center justify-between mb-3";

      const leftDiv = document.createElement("div");
      leftDiv.className = "flex items-center gap-2";

      const iconDiv = document.createElement("div");
      iconDiv.className = "p-2 bg-muted rounded-md";
      iconDiv.innerHTML = getCorrespondenceIcon(correspondence.type);

      const textDiv = document.createElement("div");

      const titleHeading = document.createElement("h3");
      titleHeading.className = "font-medium text-sm";
      titleHeading.textContent = correspondence.name;

      const subtitlePara = document.createElement("p");
      subtitlePara.className = "text-xs text-muted-foreground";
      subtitlePara.textContent = `${correspondence.from} → ${correspondence.to}`;

      textDiv.appendChild(titleHeading);
      textDiv.appendChild(subtitlePara);

      leftDiv.appendChild(iconDiv);
      leftDiv.appendChild(textDiv);

      titleDiv.appendChild(leftDiv);

      headerDiv.appendChild(titleDiv);

      if (correspondence.completed) {
        const statusDiv = document.createElement("div");
        statusDiv.className = "flex items-center justify-between mt-3";

        const dateSpan = document.createElement("span");
        dateSpan.className = "text-xs text-muted-foreground";
        dateSpan.textContent = `Uploaded on ${formatDate(correspondence.date)}`;

        const actionDiv = document.createElement("div");
        actionDiv.className = "flex gap-2";

        const viewButton = document.createElement("button");
        viewButton.className = "button button-outline h-8";
        viewButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg> View`;
        viewButton.addEventListener("click", () => {
          previewCorrespondence = correspondence;
          showPreview();
        });

        const replaceLabel = document.createElement("label");
        replaceLabel.className = "cursor-pointer button button-outline h-8";
        replaceLabel.textContent = "Replace";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.className = "hidden";
        // Restrict accepted file types to PDF, JPG, PNG
        fileInput.accept = "application/pdf, image/jpeg, image/png";
        fileInput.addEventListener("change", (e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            const file = files[0];
            // Validate file type
            if (
              !["application/pdf", "image/jpeg", "image/png"].includes(
                file.type
              )
            ) {
              alert("Please upload only PDF, JPG, or PNG files.");
              return;
            }
            uploadCorrespondenceFile(file, correspondence);
          }
        });

        replaceLabel.appendChild(fileInput);
        actionDiv.appendChild(viewButton);
        actionDiv.appendChild(replaceLabel);

        statusDiv.appendChild(dateSpan);
        statusDiv.appendChild(actionDiv);

        headerDiv.appendChild(statusDiv);
      } else {
        const uploadDiv = document.createElement("div");
        uploadDiv.className = "mt-3";

        const inputElement = document.createElement("input");
        inputElement.type = "file";
        inputElement.id = `file-correspondence-${correspondence.id}`;
        inputElement.className = "hidden";
        inputElement.accept = "application/pdf, image/jpeg, image/png";

        inputElement.addEventListener("change", (e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            const file = files[0];
            // Validate file type
            if (
              !["application/pdf", "image/jpeg", "image/png"].includes(
                file.type
              )
            ) {
              alert("Please upload only PDF, JPG, or PNG files.");
              return;
            }
            uploadCorrespondenceFile(file, correspondence);
          }
        });

        const dropArea = document.createElement("div");
        dropArea.className = "file-upload-area cursor-pointer";
        dropArea.innerHTML = `
        <i class="fas fa-cloud-upload-alt" style="font-size: 24px; color: #333;"></i>
        <p class="text-sm font-medium text-center">Upload ${correspondence.name}</p>
        <p class="text-xs text-muted-foreground mt-1 text-center">Drag & drop or click to browse</p>
      `;

        dropArea.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropArea.classList.add("dragging");
        });

        dropArea.addEventListener("dragleave", (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropArea.classList.remove("dragging");
        });

        dropArea.addEventListener("drop", (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropArea.classList.remove("dragging");

          const files = e.dataTransfer.files;
          if (files && files.length > 0) {
            uploadCorrespondenceFile(files[0], correspondence);
          }
        });

        dropArea.addEventListener("click", () => {
          document
            .getElementById(`file-correspondence-${correspondence.id}`)
            .click();
        });

        uploadDiv.appendChild(inputElement);
        uploadDiv.appendChild(dropArea);

        // Progress bar container (initially hidden)
        const progressContainer = document.createElement("div");
        progressContainer.id = `progress-${correspondence.id}`;
        progressContainer.className = "upload-progress mt-2 hidden";

        const progressBar = document.createElement("div");
        progressBar.className = "upload-progress-bar";
        progressBar.style.width = "0%";

        progressContainer.appendChild(progressBar);
        uploadDiv.appendChild(progressContainer);

        headerDiv.appendChild(uploadDiv);
      }

      correspondenceElement.appendChild(headerDiv);
      correspondenceContainer.appendChild(correspondenceElement);
    });
  }

  // Helper function to get correspondence icon
  function getCorrespondenceIcon(type) {
    switch (type) {
      case "email":
        return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>';
      case "letter":
        return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
      case "phone":
        return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
      default:
        return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path></svg>';
    }
  }

  // Update step UI based on completion state
  function updateStepUI(stepId, completed) {
    const stepElement = document.getElementById(`step-${stepId}`);
    if (stepElement) {
      if (completed) {
        stepElement.classList.add("border-primary/30", "bg-primary/5");

        const statusText = stepElement.querySelector(".text-xs.font-medium");
        if (statusText) {
          statusText.className = "text-xs font-medium text-primary";
          statusText.innerHTML =
            '<span class="icon icon-check"></span> Completed';
        }

        const stepIcon = stepElement.querySelector(".w-6.h-6");
        if (stepIcon) {
          stepIcon.className =
            "w-6 h-6 rounded-full flex items-center justify-center bg-primary text-primary-foreground";
          stepIcon.innerHTML = '<span class="icon icon-check"></span>';
        }

        const stepName = stepElement.querySelector("h3");
        if (stepName) {
          stepName.classList.add("text-primary");
        }
      }
    }
  }

  // Update document UI based on upload state
  function updateDocumentUI(documentt) {
    const documentElement = document.getElementById(`document-${documentt.id}`);
    if (!documentElement) return;

    documentElement.classList.add("border-primary/30", "bg-primary/5");

    const container = documentElement.querySelector(
      ".flex.flex-col.md\\:flex-row"
    );
    if (!container) return;

    // Clear the old content
    container.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="icon icon-file text-muted-foreground h-5 w-5"></span>
        <div>
          <p class="font-medium text-sm">${documentt.name}</p>
          <p class="text-xs text-muted-foreground">Uploaded on ${
            documentt.date || new Date().toISOString().split("T")[0]
          }</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="button button-outline button-sm document-view-btn" data-document-id="${
          documentt.id
        }" data-step-id="${documentt.step}" data-phase-id="${documentt.phase}">
          <span class="icon icon-eye mr-1"></span> View
        </button>
      </div>
    `;

    // Add event listener to the new view button
    const viewButton = documentElement.querySelector(".document-view-btn");
    if (viewButton) {
      viewButton.addEventListener("click", function () {
        const documentId = this.getAttribute("data-document-id");
        const stepId = this.getAttribute("data-step-id");
        const phaseId = this.getAttribute("data-phase-id");

        const documennt = findDocument(phaseId, stepId, documentId);
        if (documennt) {
          showDocumentPreview(documennt);
        }
      });
    }
  }

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

  // Upload correspondence file
  function uploadCorrespondenceFile(file, correspondence) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("corr_id", correspondence.id);
    formData.append("case_id", caseId);

    $.ajax({
      url: "logic/upload-correspondence.php",
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.trim() === "success") {
          updateCorrespondence(correspondence.id, {
            file: file.name,
            url: `logic/uploads/${file.name}`,
            date: new Date().toISOString().split("T")[0],
            completed: true,
          });

          showToast(
            "File uploaded",
            `${file.name} has been successfully uploaded.`
          );
          renderCorrespondences();
        } else {
          showToast("Upload failed", "Server did not return success.", "error");
        }
      },
      error: function () {
        showToast(
          "Upload failed",
          "An error occurred during the upload.",
          "error"
        );
      },
    });
  }

  // Update correspondence
  function updateCorrespondence(correspondenceId, updates) {
    correspondences = correspondences.map((correspondence) => {
      if (correspondence.id !== correspondenceId) return correspondence;
      return { ...correspondence, ...updates };
    });
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

  // Handle file upload
  function uploadFile(file, document) {
    // Update document with file info
    updateDocument(document.phase, document.step, document.id, {
      file: file,
      url: URL.createObjectURL(file),
      date: new Date().toISOString().split("T")[0],
      completed: true,
    });

    showToast({
      title: "Document uploaded",
      description: `${file.name} has been successfully uploaded.`,
      type: "success",
    });
  }

  // Update document in the data model
  function updateDocument(phaseId, stepId, documentId, updates) {
    phases = phases.map((phase) => {
      if (phase.id !== phaseId) return phase;

      return {
        ...phase,
        steps: phase.steps.map((step) => {
          if (step.id !== stepId) return step;

          return {
            ...step,
            documents: step.documents.map((doc) => {
              if (doc.id !== documentId) return doc;
              return { ...doc, ...updates };
            }),
          };
        }),
      };
    });

    // Update the document UI
    const document = findDocument(phaseId, stepId, documentId);
    if (document) {
      updateDocumentUI(document);
    }

    // Check if step is now complete
    const phase = phases.find((p) => p.id === phaseId);
    const step = phase ? phase.steps.find((s) => s.id === stepId) : null;

    if (phase && step) {
      checkStepCompletion(phase, step);
    }
  }

  // Check if step is complete
  function checkStepCompletion(phase, step) {
    const allDocumentsComplete = step.documents.every((doc) => doc.completed);

    if (allDocumentsComplete && !step.completed) {
      // Enable the "Mark as Complete" button
      const completeButton = document.querySelector(
        `button[data-step-id="${step.id}-complete"]`
      );

      if (completeButton) {
        completeButton.disabled = false;
      }
    }
  }

  function handleMarkStepComplete(phase, step) {
    const allDocumentsComplete = step.documents.every(
      (doc) => doc.completed && doc.file
    );

    if (!allDocumentsComplete) {
      showToast({
        title: "Action required",
        description:
          "Please upload all required documents before marking this step as complete.",
        type: "error",
      });
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const conveyancingId = urlParams.get("id");

    if (!conveyancingId) {
      showToast({
        title: "Error",
        description: "Missing conveyancing ID in the URL.",
        type: "error",
      });
      return;
    }

    // Upload all documents one-by-one via jQuery AJAX
    let uploadCount = 0;
    let uploadErrors = [];

    step.documents.forEach((document) => {
      const formData = new FormData();
      const columnName = document.id.replace(/-/g, "_");
      formData.append("file", document.file);
      formData.append("column", columnName);
      formData.append("id", conveyancingId);

      $.ajax({
        url: "logic/upload-conveyancing-file.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          uploadCount++;
          if (!response.success) {
            uploadErrors.push(
              response.message || `Failed to upload ${columnName}`
            );
          }

          if (uploadCount === step.documents.length) {
            finalizeStepMarking();
          }
        },
        error: function () {
          uploadCount++;
          uploadErrors.push(`AJAX failed for ${columnName}`);
          if (uploadCount === step.documents.length) {
            finalizeStepMarking();
          }
        },
      });
    });

    // Final step marking after uploads
    function finalizeStepMarking() {
      if (uploadErrors.length > 0) {
        showToast({
          title: "Upload failed",
          description: uploadErrors.join(", "),
          type: "error",
        });
        return;
      }

      // Mark step as completed in the data model
      phases = phases.map((p) => {
        if (p.id !== phase.id) return p;

        return {
          ...p,
          steps: p.steps.map((s) => {
            if (s.id !== step.id) return s;
            return { ...s, completed: true };
          }),
        };
      });

      updateStepUI(step.id, true);

      showToast({
        title: "Step completed",
        description: `${step.name} has been marked as complete.`,
        type: "success",
      });

      setTimeout(() => checkPhaseCompletion(phase), 300);
    }
  }

  // Check if phase is complete
  function checkPhaseCompletion(phase) {
    const updatedPhase = phases.find((p) => p.id === phase.id);
    if (!updatedPhase) return;

    const allStepsComplete = updatedPhase.steps.every((s) => s.completed);

    if (allStepsComplete && !updatedPhase.completed) {
      const phaseIndex = phases.findIndex((p) => p.id === phase.id);

      // Mark this phase as completed
      phases = phases.map((p, index) => {
        if (index === phaseIndex) {
          return { ...p, completed: true };
        } else if (index === phaseIndex + 1) {
          return { ...p, active: true };
        }
        return p;
      });

      updatePhaseIndicators();

      // Add completion message if it doesn't exist
      const phaseElement = document.getElementById(`phase-${phase.id}`);
      if (phaseElement) {
        let completionMessage = phaseElement.querySelector(
          ".bg-primary\\/10.border.border-primary\\/30"
        );

        if (!completionMessage) {
          completionMessage = document.createElement("div");
          completionMessage.className =
            "mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-center gap-2";

          const checkIcon = document.createElement("span");
          checkIcon.className = "icon icon-check text-primary";

          const messageText = document.createElement("p");
          messageText.className = "text-sm font-medium";
          messageText.textContent = `${phase.name} phase completed successfully!`;

          completionMessage.appendChild(checkIcon);
          completionMessage.appendChild(messageText);
          phaseElement.appendChild(completionMessage);
        }
      }

      showToast({
        title: "Phase completed",
        description: `The ${phase.name} phase has been completed successfully!`,
        type: "success",
      });
    }
  }

  // Show document preview
  function showDocumentPreview(documentt) {
    console.log(documentt.type);
    previewDocument = documentt;

    documentPreviewModal.innerHTML = "";
    documentPreviewModal.classList.add("active");

    const previewContent = document.createElement("div");
    previewContent.className =
      "relative bg-background rounded-lg shadow-lg overflow-hidden max-w-3xl w-full max-h-[80vh] animate-fadeIn";
    previewContent.onclick = (e) => e.stopPropagation();

    const previewHeader = document.createElement("div");
    previewHeader.className = "flex items-center justify-between p-4 border-b";

    const previewTitle = document.createElement("h3");
    previewTitle.className = "font-medium";
    previewTitle.textContent = documentt.name;

    const closeButton = document.createElement("button");
    closeButton.className = "button button-outline button-sm";
    closeButton.innerHTML = '<span class="icon icon-x"></span>';
    closeButton.onclick = closePreview;

    previewHeader.appendChild(previewTitle);
    previewHeader.appendChild(closeButton);

    const previewBody = document.createElement("div");
    previewBody.className = "p-4 overflow-auto max-h-[calc(80vh-64px)]";

    if (documentt.url) {
      if (documentt.type && documentt.type.startsWith("image/")) {
        const image = document.createElement("img");
        image.src = documentt.url;
        image.alt = documentt.name;
        image.className = "max-w-full h-auto rounded-md mx-auto";
        previewBody.appendChild(image);
      } else {
        const filePreview = document.createElement("div");
        filePreview.className = "flex flex-col items-center justify-center p-8";

        const fileIcon = document.createElement("span");
        fileIcon.className =
          "icon icon-file h-16 w-16 text-muted-foreground mb-4";

        const previewMessage = document.createElement("p");
        previewMessage.className = "text-muted-foreground mb-4";
        previewMessage.textContent = "Preview not available for this file type";

        const openButton = document.createElement("a");
        openButton.href = documentt.url;
        openButton.target = "_blank";
        openButton.rel = "noopener noreferrer";
        openButton.className = "button button-primary";
        openButton.textContent = "Open Document";

        filePreview.appendChild(fileIcon);
        filePreview.appendChild(previewMessage);
        filePreview.appendChild(openButton);
        previewBody.appendChild(filePreview);
      }
    }

    previewContent.appendChild(previewHeader);
    previewContent.appendChild(previewBody);
    documentPreviewModal.appendChild(previewContent);
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

  // Close preview
  function closePreview() {
    documentPreviewModal.classList.remove("active");
    previewDocument = null;
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

  // Show toast notification
  function showToast({ title, description, type = "success" }) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const toastTitle = document.createElement("div");
    toastTitle.className = "toast-title";
    toastTitle.textContent = title;

    const toastDescription = document.createElement("div");
    toastDescription.textContent = description;

    toast.appendChild(toastTitle);
    toast.appendChild(toastDescription);
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        if (toast.parentNode === toastContainer) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // Show document preview
  function showPreview() {
    const previewContainer = document.getElementById("document-preview");
    previewContainer.className = "document-preview active";

    let content = "";
    let previewContent = previewDocument || previewCorrespondence;

    if (!previewContent) return;

    content = `
    <div class="relative bg-background rounded-lg shadow-lg overflow-hidden max-w-3xl w-full max-h-[80vh] animate-fadeIn" onClick="event.stopPropagation()">
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="font-medium">${previewContent.name}</h3>
        <button class="button button-outline close-preview-btn" onClick="closePrevieww()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="p-4 overflow-auto max-h-[calc(80vh-64px)]">
  `;

    if (previewContent.url) {
      content += `
        <div class="flex flex-col items-center justify-center p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground mb-4"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          <p class="text-muted-foreground mb-4">
            Preview not available for this file type
          </p>
          <a 
            href="${previewContent.url}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="button button-primary"
          >
            Open Document
          </a>
        </div>
      `;
    }

    content += `
      </div>
    </div>
  `;

    previewContainer.innerHTML = content;
  }
});
