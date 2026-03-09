<?php require_once 'components/sidebar.php';?>
      <div class="bottom">
        <!-- Case Header -->
        <section id="case-header" class="card glass-card">
          <div class="case-status-badge" id="case-status-badge" style="cursor: pointer;">Active</div>
          <h1 id="case-title" style="font-size: 1.75rem; color: #1e293b">
            Loading case...
          </h1>
          <div style="display: flex; gap: 15px;">
            <div
              class="case-number"
              id="case-number"
              style="width: max-content"
            ></div>
            <div
              class="case-number"
              id="party-type-case"
              style="width: max-content; text-transform:uppercase; font-size: 0.8rem"
            ></div>
          </div>
          <p id="case-description" class="case-description"></p>
          <div class="case-meta">
            <span class="meta-item"
              ><i class="fa-solid fa-user-tie"></i> <span id="advocate-name"></span
            ></span>
            <span class="meta-item"
              ><i class="fas fa-calendar"></i> <span id="filing-date"></span
            ></span>
            <span class="meta-item"
              ><i class="fas fa-calendar"></i> <span id="bringUpDate"></span
            ></span>
           <span class="meta-item" id="case-status-date"
              ><i class="fa-solid fa-calendar-xmark"></i> <span id="closed-date"></span
            ></span> 
          </div>
        </section>

        <!-- Parties Involved -->
        <section
          id="parties-involved"
          class="card glass-card two-column-span"
          style="width: 100%; margin-top: 15px">
          <div class="card-header">
            <h2 class="card-title" style="font-size: 1.1rem">
              <i class="fas fa-users"></i> Parties Involved
            </h2>
            <button id="add-party-button" class="button2 btn-outline">
              <i class="fas fa-plus"></i> Add Party
            </button>
          </div>
          <div class="card-content">
            <div
              id="add-party-form-container"
              class="add-step-form-container hidden"
            >
              <!-- Add Party Form will be inserted here -->
            </div>
            <div id="parties-container" class="parties-grid"></div>
          </div>
        </section>

        <!-- Document Gallery -->
        <section id="document-gallery" class="card glass-card">
          <div class="card-header">
            <h2 class="card-title" style="font-size: 1.1rem">
              <i class="fas fa-file-alt"></i> Our Documents
            </h2>
            <button id="add-pleadings-form-button" class="button btn-outline">
              <i class="fas fa-plus"></i> Add Document
            </button>
          </div>
          <div class="card-content">
            <div
              id="add-pleadings-form-container"
              class="add-step-form-container hidden"
            >
              <!-- Add Document Form will be inserted here -->
            </div>
            <div id="pleadings-container" class="documents-grid"></div>
          </div>
        </section>

        <!-- Document Gallery -->
        <section id="document-gallery" class="card glass-card">
          <div class="card-header">
            <h2 class="card-title" style="font-size: 1.1rem">
              <i class="fas fa-file-alt"></i> Counterpart Documents
            </h2>
            <button id="add-court-doc-form-button" class="button btn-outline">
              <i class="fas fa-plus"></i> Add Document
            </button>
          </div>
          <div class="card-content">
            <div
              id="add-court-doc-form-container"
              class="add-step-form-container hidden"
            >
              <!-- Add Document Form will be inserted here -->
            </div>
            <div id="court-docs-container" class="documents-grid"></div>
          </div>
        </section>

        <!-- Document Gallery -->
        <section id="correspondence-documents" class="card glass-card">
          <div class="card-header">
            <h2 class="card-title" style="font-size: 1.1rem">
              <i class="fas fa-file-alt"></i> Correspondences
            </h2>
            <button id="add-correspondence-document-button" class="button btn-outline">
              <i class="fas fa-plus"></i> Add Document
            </button>
          </div>
          <div class="card-content">
            <div
              id="add-correspondence-doc-form-container"
              class="add-step-form-container hidden"
            >
              <!-- Add Document Form will be inserted here -->
            </div>
            <div id="correspondence-documents-container" class="documents-grid"></div>
          </div>
        </section>

        <!-- Document Gallery -->
        <section id="attendance-memo-documents" class="card glass-card">
          <div class="card-header">
            <h2 class="card-title" style="font-size: 1.1rem">
              <i class="fas fa-file-alt"></i> Completion Documents
            </h2>
            <button id="add-attendance-memo-doc-button" class="button btn-outline">
              <i class="fas fa-plus"></i> Add Document
            </button>
          </div>
          <div class="card-content">
            <div
              id="add-attendance-memo-doc-form-container"
              class="add-step-form-container hidden"
            >
              <!-- Add Document Form will be inserted here -->
            </div>
            <div id="attendance-memo-documents-container" class="documents-grid"></div>
          </div>
        </section>

        <!-- Confidential Documents -->
        <section
          id="client-confidential-docs"
          class="card glass-card two-column-span hidden"
          style="width: 100%; margin-top: 15px;">
          <div class="card-header">
            <h2 class="card-title" style="font-size: 1.1rem">
              <i class="fas fa-file-alt"></i> Client-Advocate Documents
            </h2>
            <button id="add-client-confidential-doc-button" class="button btn-outline">
              <i class="fas fa-plus"></i> Add Document
            </button>
          </div>
          <div class="card-content">
            <div
              id="add-client-confidential-doc-form-container"
              class="add-step-form-container hidden"
            >
              <!-- Add Party Form will be inserted here -->
            </div>
            <div id="client-confidential-docs-container" class="documents-grid"></div>
          </div>
        </section>

        <button id='delete-btn' style="
            background-color: #e74c3c;
            width: 100%;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
          " >
            <i class="fas fa-trash"></i> Delete Case
          </button>
      </div>

      <!-- Document Viewer Modal -->
      <div id="document-viewer-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modal-title">Document Viewer</h2>
            <button id="close-modal" class="button btn-icon">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div id="document-previeww" class="document-previeww" style="display: flex; flex-direction:column; gap: 15px"></div>
            <div class="document-info">
              <div class="meta-item">
                <i class="fas fa-calendar"></i> <span id="document-date"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script src="script/conveyancing.js"></script>
    <script>
      
    // Close preview
    function closePrevieww() {
      const previewContainer = document.getElementById("document-preview");
      previewContainer.className = "document-preview";
      previewDocument = null;
      previewCorrespondence = null;
    }
    </script>
  </body>
</html>
