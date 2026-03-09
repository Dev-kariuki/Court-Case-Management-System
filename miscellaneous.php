<?php require_once 'components/sidebar.php';?>
      <div class="animate-fadeUp" style="display: flex; flex-direction: column; gap: 20px">
        <div id="content">
          <section id="case-header" class="card glass-card mb-6">
            <div class="case-status-badge" id="case-status-badge" style="cursor: pointer;">Active</div>
            <h1 id="case-title" class="text-3xl font-semibold">
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
            <p id="case-notes" class="case-description">
              No description available for this case.
            </p>
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
            class="card glass-card two-column-span mb-6"
            style="width: 100%"
          >
            <h2 class="card-title font-semibold">Parties Involved</h2>
            <div class="card-content">
              <div id="parties-container" class="parties-grid">
                <?php
                  // Fetch from miscellaneous table
                  $id = intval($_GET['id']);

                  $sql = "SELECT party1, party2, party3, party4, party5, party6, party7, party8, party9, party10 FROM miscellaneous WHERE id = ?";
                  $stmt = $conn->prepare($sql);
                  $stmt->bind_param("i", $id);
                  $stmt->execute();
                  $result = $stmt->get_result();

                  if ($result && $row = $result->fetch_assoc()) {
                      // Collect all non-null, non-empty parties
                      $parties = [];
                      for ($i = 1; $i <= 10; $i++) {
                          $key = "party$i";
                          if (!empty($row[$key])) {
                              $parties[] = htmlspecialchars($row[$key]);
                          }
                      }

                      if (count($parties) > 0) {
                          foreach ($parties as $party) {
                              echo '<div class="party">
                                      <i class="fa-solid fa-user"></i>
                                      <h3>' . $party . '</h3>
                                    </div>';
                          }
                      } else {
                          echo '<div class="no-parties-message">
                                  No parties available.
                                </div>';
                      }
                  } else {
                      echo '<div class="no-parties-message">
                              No parties available.
                            </div>';
                  }

                ?>
              </div>
            </div>
          </section>

        <!-- Document Gallery -->
        <section id="document-gallery" class="card glass-card">
          <div class="card-header">
            <h2 class="card-title" style="font-size: 1.1rem; font-weight: 600;">
              <i class="fas fa-file-alt"></i> Pleadings
            </h2>
            <button id="add-pleadings-form-button" class="button2 btn-outline">
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
            <div style="display: flex; flex-direction: column; gap: 10px">
              <select name="pleading-type" id="pleading-type" class="pleading-type">
                <option value="company" selected>Our Pleadings</option>
                <option value="other">Counterpart Pleadings</option>
              </select>
              <div id="pleadings-container" class="documents-grid"></div>
            </div>
          </div>
        </section>

        <!-- Document Gallery -->
        <section id="document-gallery" class="card glass-card" style="width: 100%; margin-top: 20px;">
          <div class="card-header">
            <h2 class="card-title"  style="font-size: 1.1rem; font-weight: 600;">
              <i class="fas fa-file-alt"></i> Court Documents
            </h2>
            <button id="add-court-doc-form-button" class="button2 btn-outline">
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
        <section id="correspondence-documents" class="card glass-card" style="width: 100%; margin-top: 20px;">
          <div class="card-header">
            <h2 class="card-title"  style="font-size: 1.1rem; font-weight: 600;">
              <i class="fas fa-file-alt"></i> Correspondences
            </h2>
            <button id="add-correspondence-document-button" class="button2 btn-outline">
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
        <section id="attendance-memo-documents" class="card glass-card" style="width: 100%; margin-top: 20px;">
          <div class="card-header">
            <h2 class="card-title"  style="font-size: 1.1rem; font-weight: 600;">
              <i class="fas fa-file-alt"></i> Court Attendance memo & Client updates
            </h2>
            <button id="add-attendance-memo-doc-button" class="button2 btn-outline">
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
          style="width: 100%; margin-top: 20px;">
          <div class="card-header">
            <h2 class="card-title" style="font-size: 1.1rem; font-weight: 600;">
              <i class="fas fa-file-alt"></i> Client-Advocate Documents
            </h2>
            <button id="add-client-confidential-doc-button" class="button2 btn-outline">
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
      </div>
      <!-- Document Viewer Modal -->
      <div id="document-viewer-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modal-title">Document Viewer</h2>
            <button id="close-modal" class="button2 btn-icon">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div id="document-preview" class="document-preview" style="display: flex; flex-direction:column; gap: 15px"></div>
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
    <script src="script/miscellaneous.js"></script>
  </body>
</html>
