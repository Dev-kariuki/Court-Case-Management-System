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
            <h2 class="card-title">
              <i class="fas fa-file-alt"></i> Pleadings
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
            <h2 class="card-title">
              <i class="fas fa-file-alt"></i> Court Documents
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
            <h2 class="card-title">
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
            <h2 class="card-title">
              <i class="fas fa-file-alt"></i> Court Attendance memo & Client updates
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
              <i class="fa-solid fa-file"></i> Client-Advocate Documents
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

        <!-- Confidential Documents -->
        <section
          id="confidential-docs"
          class="card glass-card two-column-span hidden"
          style="width: 100%; margin-top: 15px">
          <div class="card-header">
            <h2 class="card-title" style="font-size: 1.1rem">
              <i class="fa-solid fa-file"></i> Confidential Documents
            </h2>
            <button id="add-confidential-doc-button" class="button2 btn-outline">
              <i class="fas fa-plus"></i> Add Document
            </button>
          </div>
          <div class="card-content">
            <div
              id="add-confidential-doc-form-container"
              class="add-step-form-container hidden"
            >
              <!-- Add Party Form will be inserted here -->
            </div>
            <div id="confidential-docs-container" class="parties-grid"></div>
          </div>
        </section>

        <!-- Correspondence Tracker -->
          <div class="mb-8 bg-card rounded-xl border shadow-sm p-6">
            <h2 class="font-semibold mb-2" style="font-size: 20px;">Correspondence Tracker</h2>
            <p class="text-muted-foreground mb-3" style="font-size: 14px;">
              Upload and track all communications between parties involved in the conveyancing process.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="correspondence-container">
              <!-- Correspondence items will be dynamically added here -->
            </div>
          </div>

        <div class="min-h-screen bg-background" style="border-radius: 0.75rem">
          <div class="w-full min-h-screen px-4 py-8 md:px-8">
            <div
              class="mx-auto"
              style="display: flex; flex-direction: column; gap: 20px"
            >
            <h2 class="font-semibold" style="font-size: 30px; text-align:center;">Conveyancing Tracker</h2>
              <!-- Phase Progress Indicator -->
              <div
                class="relative mx-auto w-full max-w-3xl mb-12 mt-8"
                id="phase-progress"
              >
                <div
                  class="flex justify-between items-center relative z-10"
                  id="phase-indicators"
                >
                  <!-- Phase indicators will be updated via JavaScript -->
                  <div class="flex flex-col items-center space-y-2">
                    <div class="stage-indicator active">
                      <span>1</span>
                    </div>
                    <span class="text-sm font-medium">Due Diligence</span>
                  </div>
                  <div class="flex flex-col items-center space-y-2">
                    <div class="stage-indicator">
                      <span>2</span>
                    </div>
                    <span class="text-sm font-medium">Contract</span>
                  </div>
                  <div class="flex flex-col items-center space-y-2">
                    <div class="stage-indicator">
                      <span>3</span>
                    </div>
                    <span class="text-sm font-medium">Completion</span>
                  </div>
                </div>

                <!-- Progress Lines -->
                <div class="absolute top-4 left-0 right-0 h-0.5 bg-muted">
                  <div
                    id="overall-progress"
                    class="absolute top-0 left-0 h-full bg-primary transition-all duration-700 ease-in-out"
                    style="width: 0%"
                  ></div>
                </div>

                <!-- Phase lines will be updated via JavaScript -->
                <div id="phase-lines">
                  <div
                    id="stage-line-due-diligence"
                    class="stage-line active"
                    style="left: 0%; width: 0%"
                  ></div>
                  <div
                    id="stage-line-contract"
                    class="stage-line"
                    style="left: 50%; width: 0%"
                  ></div>
                </div>
              </div>

              <!-- Phases Container -->
              <div class="space-y-8 animate-fadeIn" id="phases-container">
                <!-- Due Diligence Phase -->
                <div
                  class="rounded-xl border bg-card p-6 shadow-sm transition-all duration-500 opacity-100"
                  id="phase-due-diligence"
                >
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center border-2 border-primary bg-primary/10"
                      >
                        <span class="icon icon-clock"></span>
                      </div>
                      <h2 class="text-xl font-semibold">Due Diligence Phase</h2>
                    </div>
                    <div class="flex items-center gap-2">
                      <span
                        class="text-sm font-medium text-muted-foreground flex items-center gap-1"
                        id="phase-status-due-diligence"
                      >
                        <span class="icon icon-clock"></span>
                        In Progress
                      </span>
                    </div>
                  </div>

                  <div class="space-y-4 mt-6">
                    <!-- Title Search Step -->
                    <div
                      class="border rounded-lg overflow-hidden transition-all duration-300 border-border"
                      id="step-title-search"
                    >
                      <div
                        class="flex items-center justify-between p-4 cursor-pointer"
                        data-step-id="title-search"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-6 h-6 rounded-full flex items-center justify-center border border-muted-foreground/50 text-muted-foreground"
                          >
                            <span class="text-xs">1</span>
                          </div>
                          <h3 class="font-medium">Title Search</h3>
                        </div>
                        <div class="flex items-center gap-3">
                          <span
                            class="text-xs font-medium text-muted-foreground"
                            >Pending</span
                          >
                          <span
                            class="icon icon-chevron-right text-muted-foreground"
                          ></span>
                        </div>
                      </div>
                      <div
                        class="step-content p-4 pt-0 border-t border-border animate-slideDown"
                        style="display: none"
                      >
                        <p class="text-sm text-muted-foreground mb-4">
                          Conduct a comprehensive search of the property title
                          to ensure there are no liens, encumbrances, or other
                          issues.
                        </p>

                        <h4 class="text-sm font-medium mb-3">
                          Required Documents
                        </h4>
                        <div class="space-y-4 mb-6">
                          <div class="document-item" id="document-title-report">
                            <div
                              class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                            >
                              <div class="flex items-center gap-2">
                                <span
                                  class="icon icon-file text-muted-foreground h-5 w-5"
                                ></span>
                                <div>
                                  <p class="font-medium text-sm">
                                    Title Report
                                  </p>
                                </div>
                              </div>
                              <div class="relative">
                                <input
                                  type="file"
                                  id="file-title-report"
                                  accept="application/pdf"
                                  class="hidden"
                                  data-document-id="title-report"
                                  data-step-id="title-search"
                                  data-phase-id="due-diligence"
                                />
                                <div
                                  class="file-upload-area"
                                  data-document-id="title-report"
                                  data-step-id="title-search"
                                  data-phase-id="due-diligence"
                                >
                                  <span
                                    class="icon icon-upload h-5 w-5 mx-auto mb-2 text-muted-foreground"
                                  ></span>
                                  <p class="text-sm font-medium">
                                    Upload Title Report
                                  </p>
                                  <p class="text-xs text-muted-foreground mt-1">
                                    Drag & drop or click to browse
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="flex justify-end">
                          <button
                            class="button button-primary step-complete-btn"
                            disabled
                            data-step-id="title-search-complete"
                            data-phase-id="due-diligence"
                          >
                            <span class="icon icon-check mr-2"></span> Mark as
                            Complete
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Ground Verification Step -->
                    <div
                      class="border rounded-lg overflow-hidden transition-all duration-300 border-border"
                      id="step-ground-verification"
                    >
                      <div
                        class="flex items-center justify-between p-4 cursor-pointer"
                        data-step-id="ground-verification"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-6 h-6 rounded-full flex items-center justify-center border border-muted-foreground/50 text-muted-foreground"
                          >
                            <span class="text-xs">2</span>
                          </div>
                          <h3 class="font-medium">Ground Verification</h3>
                        </div>
                        <div class="flex items-center gap-3">
                          <span
                            class="text-xs font-medium text-muted-foreground"
                            >Pending</span
                          >
                          <span
                            class="icon icon-chevron-right text-muted-foreground"
                          ></span>
                        </div>
                      </div>
                      <div
                        class="step-content p-4 pt-0 border-t border-border animate-slideDown"
                        style="display: none"
                      >
                        <p class="text-sm text-muted-foreground mb-4">
                          Physical inspection of the property to confirm
                          boundaries and identify any potential issues not
                          covered in documentation.
                        </p>

                        <h4 class="text-sm font-medium mb-3">
                          Required Documents
                        </h4>
                        <div class="space-y-4 mb-6">
                          <div
                            class="document-item"
                            id="document-inspection-report"
                          >
                            <div
                              class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                            >
                              <div class="flex items-center gap-2">
                                <span
                                  class="icon icon-file text-muted-foreground h-5 w-5"
                                ></span>
                                <div>
                                  <p class="font-medium text-sm">
                                    Inspection Report
                                  </p>
                                </div>
                              </div>
                              <div class="relative">
                                <input
                                  type="file"
                                  id="file-inspection-report"
                                  accept="application/pdf"
                                  class="hidden"
                                  data-document-id="inspection-report"
                                  data-step-id="ground-verification"
                                  data-phase-id="due-diligence"
                                />
                                <div
                                  class="file-upload-area"
                                  data-document-id="inspection-report"
                                  data-step-id="ground-verification"
                                  data-phase-id="due-diligence"
                                >
                                  <span
                                    class="icon icon-upload h-5 w-5 mx-auto mb-2 text-muted-foreground"
                                  ></span>
                                  <p class="text-sm font-medium">
                                    Upload Inspection Report
                                  </p>
                                  <p class="text-xs text-muted-foreground mt-1">
                                    Drag & drop or click to browse
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            class="document-item"
                            id="document-property-photos"
                          >
                            <div
                              class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                            >
                              <div class="flex items-center gap-2">
                                <span
                                  class="icon icon-file text-muted-foreground h-5 w-5"
                                ></span>
                                <div>
                                  <p class="font-medium text-sm">
                                    Property Photos
                                  </p>
                                </div>
                              </div>
                              <div class="relative">
                                <input
                                  type="file"
                                  id="file-property-photos"
                                  accept="image/*"
                                  class="hidden"
                                  data-document-id="property-photos"
                                  data-step-id="ground-verification"
                                  data-phase-id="due-diligence"
                                />
                                <div
                                  class="file-upload-area"
                                  data-document-id="property-photos"
                                  data-step-id="ground-verification"
                                  data-phase-id="due-diligence"
                                >
                                  <span
                                    class="icon icon-upload h-5 w-5 mx-auto mb-2 text-muted-foreground"
                                  ></span>
                                  <p class="text-sm font-medium">
                                    Upload Property Photos
                                  </p>
                                  <p class="text-xs text-muted-foreground mt-1">
                                    Drag & drop or click to browse
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="flex justify-end">
                          <button
                            class="button button-primary step-complete-btn"
                            disabled
                            data-step-id="ground-verification-complete"
                            data-phase-id="due-diligence"
                          >
                            <span class="icon icon-check mr-2"></span> Mark as
                            Complete
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Survey Map Review Step -->
                    <div
                      class="border rounded-lg overflow-hidden transition-all duration-300 border-border"
                      id="step-survey-map-review"
                    >
                      <div
                        class="flex items-center justify-between p-4 cursor-pointer"
                        data-step-id="survey-map-review"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-6 h-6 rounded-full flex items-center justify-center border border-muted-foreground/50 text-muted-foreground"
                          >
                            <span class="text-xs">3</span>
                          </div>
                          <h3 class="font-medium">Survey Map Review</h3>
                        </div>
                        <div class="flex items-center gap-3">
                          <span
                            class="text-xs font-medium text-muted-foreground"
                            >Pending</span
                          >
                          <span
                            class="icon icon-chevron-right text-muted-foreground"
                          ></span>
                        </div>
                      </div>
                      <div
                        class="step-content p-4 pt-0 border-t border-border animate-slideDown"
                        style="display: none"
                      >
                        <p class="text-sm text-muted-foreground mb-4">
                          Review of property survey maps to confirm property
                          boundaries, easements, and rights of way.
                        </p>

                        <h4 class="text-sm font-medium mb-3">
                          Required Documents
                        </h4>
                        <div class="space-y-4 mb-6">
                          <div class="document-item" id="document-survey-map">
                            <div
                              class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                            >
                              <div class="flex items-center gap-2">
                                <span
                                  class="icon icon-file text-muted-foreground h-5 w-5"
                                ></span>
                                <div>
                                  <p class="font-medium text-sm">Survey Map</p>
                                </div>
                              </div>
                              <div class="relative">
                                <input
                                  type="file"
                                  id="file-survey-map"
                                  accept="application/pdf"
                                  class="hidden"
                                  data-document-id="survey-map"
                                  data-step-id="survey-map-review"
                                  data-phase-id="due-diligence"
                                />
                                <div
                                  class="file-upload-area"
                                  data-document-id="survey-map"
                                  data-step-id="survey-map-review"
                                  data-phase-id="due-diligence"
                                >
                                  <span
                                    class="icon icon-upload h-5 w-5 mx-auto mb-2 text-muted-foreground"
                                  ></span>
                                  <p class="text-sm font-medium">
                                    Upload Survey Map
                                  </p>
                                  <p class="text-xs text-muted-foreground mt-1">
                                    Drag & drop or click to browse
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="flex justify-end">
                          <button
                            class="button button-primary step-complete-btn"
                            disabled
                            data-step-id="survey-map-review-complete"
                            data-phase-id="due-diligence"
                          >
                            <span class="icon icon-check mr-2"></span> Mark as
                            Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Contract Phase -->
                <div
                  class="rounded-xl border bg-card p-6 shadow-sm transition-all duration-500 opacity-50"
                  id="phase-contract"
                >
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center border-2 border-muted-foreground/30 bg-background"
                      >
                        <span class="icon icon-clock"></span>
                      </div>
                      <h2 class="text-xl font-semibold">Contract Phase</h2>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-muted-foreground" id="phase-status-contract">
                        Waiting</span
                      >
                    </div>
                  </div>

                  <div class="space-y-4 mt-6">
                    <!-- Drafting Sale Agreement Step -->
                    <div
                      class="border rounded-lg overflow-hidden transition-all duration-300 border-border"
                      id="step-drafting-sale-agreement"
                    >
                      <div
                        class="flex items-center justify-between p-4 cursor-pointer"
                        data-step-id="drafting-sale-agreement"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-6 h-6 rounded-full flex items-center justify-center border border-muted-foreground/50 text-muted-foreground"
                          >
                            <span class="text-xs">1</span>
                          </div>
                          <h3 class="font-medium">Drafting Sale Agreement</h3>
                        </div>
                        <div class="flex items-center gap-3">
                          <span
                            class="text-xs font-medium text-muted-foreground"
                            >Pending</span
                          >
                          <span
                            class="icon icon-chevron-right text-muted-foreground"
                          ></span>
                        </div>
                      </div>
                      <div
                        class="step-content p-4 pt-0 border-t border-border animate-slideDown"
                        style="display: none"
                      >
                        <p class="text-sm text-muted-foreground mb-4">
                          Creation of a comprehensive sale agreement that
                          outlines all terms and conditions of the property
                          transfer.
                        </p>

                        <h4 class="text-sm font-medium mb-3">
                          Required Documents
                        </h4>
                        <div class="space-y-4 mb-6">
                          <div
                            class="document-item"
                            id="document-draft-agreement"
                          >
                            <div
                              class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                            >
                              <div class="flex items-center gap-2">
                                <span
                                  class="icon icon-file text-muted-foreground h-5 w-5"
                                ></span>
                                <div>
                                  <p class="font-medium text-sm">
                                    Draft Agreement
                                  </p>
                                </div>
                              </div>
                              <div class="relative">
                                <input
                                  type="file"
                                  id="file-draft-agreement"
                                  accept="application/pdf"
                                  class="hidden"
                                  data-document-id="draft-agreement"
                                  data-step-id="drafting-sale-agreement"
                                  data-phase-id="contract"
                                />
                                <div
                                  class="file-upload-area"
                                  data-document-id="draft-agreement"
                                  data-step-id="drafting-sale-agreement"
                                  data-phase-id="contract"
                                >
                                  <span
                                    class="icon icon-upload h-5 w-5 mx-auto mb-2 text-muted-foreground"
                                  ></span>
                                  <p class="text-sm font-medium">
                                    Upload Draft Agreement
                                  </p>
                                  <p class="text-xs text-muted-foreground mt-1">
                                    Drag & drop or click to browse
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="flex justify-end">
                          <button
                            class="button button-primary step-complete-btn"
                            disabled
                            data-step-id="drafting-sale-agreement-complete"
                            data-phase-id="contract"
                          >
                            <span class="icon icon-check mr-2"></span> Mark as
                            Complete
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Exchange of Contracts Step -->
                    <div
                      class="border rounded-lg overflow-hidden transition-all duration-300 border-border"
                      id="step-exchange-contracts"
                    >
                      <div
                        class="flex items-center justify-between p-4 cursor-pointer"
                        data-step-id="exchange-contracts"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-6 h-6 rounded-full flex items-center justify-center border border-muted-foreground/50 text-muted-foreground"
                          >
                            <span class="text-xs">2</span>
                          </div>
                          <h3 class="font-medium">Exchange of Contracts</h3>
                        </div>
                        <div class="flex items-center gap-3">
                          <span
                            class="text-xs font-medium text-muted-foreground"
                            >Pending</span
                          >
                          <span
                            class="icon icon-chevron-right text-muted-foreground"
                          ></span>
                        </div>
                      </div>
                      <div
                        class="step-content p-4 pt-0 border-t border-border animate-slideDown"
                        style="display: none"
                      >
                        <p class="text-sm text-muted-foreground mb-4">
                          Formal exchange of signed contracts between buyer and
                          seller, often with a deposit paid at this stage.
                        </p>

                        <h4 class="text-sm font-medium mb-3">
                          Required Documents
                        </h4>
                        <div class="space-y-4 mb-6">
                          <div
                            class="document-item"
                            id="document-signed-contract"
                          >
                            <div
                              class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                            >
                              <div class="flex items-center gap-2">
                                <span
                                  class="icon icon-file text-muted-foreground h-5 w-5"
                                ></span>
                                <div>
                                  <p class="font-medium text-sm">
                                    Signed Contract
                                  </p>
                                </div>
                              </div>
                              <div class="relative">
                                <input
                                  type="file"
                                  id="file-signed-contract"
                                  accept="application/pdf"
                                  class="hidden"
                                  data-document-id="signed-contract"
                                  data-step-id="exchange-contracts"
                                  data-phase-id="contract"
                                />
                                <div
                                  class="file-upload-area"
                                  data-document-id="signed-contract"
                                  data-step-id="exchange-contracts"
                                  data-phase-id="contract"
                                >
                                  <span
                                    class="icon icon-upload h-5 w-5 mx-auto mb-2 text-muted-foreground"
                                  ></span>
                                  <p class="text-sm font-medium">
                                    Upload Signed Contract
                                  </p>
                                  <p class="text-xs text-muted-foreground mt-1">
                                    Drag & drop or click to browse
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            class="document-item"
                            id="document-deposit-receipt"
                          >
                            <div
                              class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                            >
                              <div class="flex items-center gap-2">
                                <span
                                  class="icon icon-file text-muted-foreground h-5 w-5"
                                ></span>
                                <div>
                                  <p class="font-medium text-sm">
                                    Deposit Receipt
                                  </p>
                                </div>
                              </div>
                              <div class="relative">
                                <input
                                  type="file"
                                  id="file-deposit-receipt"
                                  accept="application/pdf"
                                  class="hidden"
                                  data-document-id="deposit-receipt"
                                  data-step-id="exchange-contracts"
                                  data-phase-id="contract"
                                />
                                <div
                                  class="file-upload-area"
                                  data-document-id="deposit-receipt"
                                  data-step-id="exchange-contracts"
                                  data-phase-id="contract"
                                >
                                  <span
                                    class="icon icon-upload h-5 w-5 mx-auto mb-2 text-muted-foreground"
                                  ></span>
                                  <p class="text-sm font-medium">
                                    Upload Deposit Receipt
                                  </p>
                                  <p class="text-xs text-muted-foreground mt-1">
                                    Drag & drop or click to browse
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="flex justify-end">
                          <button
                            class="button button-primary step-complete-btn"
                            disabled
                            data-step-id="exchange-contracts-complete"
                            data-phase-id="contract"
                          >
                            <span class="icon icon-check mr-2"></span> Mark as
                            Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Completion Phase -->
                <div
                  class="rounded-xl border bg-card p-6 shadow-sm transition-all duration-500 opacity-50"
                  id="phase-completion"
                >
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center border-2 border-muted-foreground/30 bg-background"
                      >
                        <span class="icon icon-clock"></span>
                      </div>
                      <h2 class="text-xl font-semibold">Completion Phase</h2>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-muted-foreground" id="phase-status-completion">
                        Waiting</span
                      >
                    </div>
                  </div>

                  <div class="space-y-4 mt-6">
                    <!-- Transfer Document Preparation Step -->
                    <div
                      class="border rounded-lg overflow-hidden transition-all duration-300 border-border"
                      id="step-transfer-document-preparation"
                    >
                      <div
                        class="flex items-center justify-between p-4 cursor-pointer"
                        data-step-id="transfer-document-preparation"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-6 h-6 rounded-full flex items-center justify-center border border-muted-foreground/50 text-muted-foreground"
                          >
                            <span class="text-xs">1</span>
                          </div>
                          <h3 class="font-medium">
                            Transfer Document Preparation
                          </h3>
                        </div>
                        <div class="flex items-center gap-3">
                          <span
                            class="text-xs font-medium text-muted-foreground"
                            >Pending</span
                          >
                          <span
                            class="icon icon-chevron-right text-muted-foreground"
                          ></span>
                        </div>
                      </div>
                      <div
                        class="step-content p-4 pt-0 border-t border-border animate-slideDown"
                        style="display: none"
                      >
                        <p class="text-sm text-muted-foreground mb-4">
                          Preparation of all documents required for the legal
                          transfer of the property.
                        </p>

                        <h4 class="text-sm font-medium mb-3">
                          Required Documents
                        </h4>
                        <div class="space-y-4 mb-6">
                          <div
                            class="document-item"
                            id="document-transfer-deed"
                          >
                            <div
                              class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                            >
                              <div class="flex items-center gap-2">
                                <span
                                  class="icon icon-file text-muted-foreground h-5 w-5"
                                ></span>
                                <div>
                                  <p class="font-medium text-sm">
                                    Transfer Deed
                                  </p>
                                </div>
                              </div>
                              <div class="relative">
                                <input
                                  type="file"
                                  id="file-transfer-deed"
                                  accept="application/pdf"
                                  class="hidden"
                                  data-document-id="transfer-deed"
                                  data-step-id="transfer-document-preparation"
                                  data-phase-id="completion"
                                />
                                <div
                                  class="file-upload-area"
                                  data-document-id="transfer-deed"
                                  data-step-id="transfer-document-preparation"
                                  data-phase-id="completion"
                                >
                                  <span
                                    class="icon icon-upload h-5 w-5 mx-auto mb-2 text-muted-foreground"
                                  ></span>
                                  <p class="text-sm font-medium">
                                    Upload Transfer Deed
                                  </p>
                                  <p class="text-xs text-muted-foreground mt-1">
                                    Drag & drop or click to browse
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="flex justify-end">
                          <button
                            class="button button-primary step-complete-btn"
                            disabled
                            data-step-id="transfer-document-preparation-complete"
                            data-phase-id="completion"
                          >
                            <span class="icon icon-check mr-2"></span> Mark as
                            Complete
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Paying Stamp Duty & Fees Step -->
                    <div
                      class="border rounded-lg overflow-hidden transition-all duration-300 border-border"
                      id="step-paying-stamp-duty"
                    >
                      <div
                        class="flex items-center justify-between p-4 cursor-pointer"
                        data-step-id="paying-stamp-duty"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-6 h-6 rounded-full flex items-center justify-center border border-muted-foreground/50 text-muted-foreground"
                          >
                            <span class="text-xs">2</span>
                          </div>
                          <h3 class="font-medium">Paying Stamp Duty & Fees</h3>
                        </div>
                        <div class="flex items-center gap-3">
                          <span
                            class="text-xs font-medium text-muted-foreground"
                            >Pending</span
                          >
                          <span
                            class="icon icon-chevron-right text-muted-foreground"
                          ></span>
                        </div>
                      </div>
                      <div
                        class="step-content p-4 pt-0 border-t border-border animate-slideDown"
                        style="display: none"
                      >
                        <p class="text-sm text-muted-foreground mb-4">
                          Payment of all necessary government fees, including
                          stamp duty, to complete the transaction legally.
                        </p>

                        <h4 class="text-sm font-medium mb-3">
                          Required Documents
                        </h4>
                        <div class="space-y-4 mb-6">
                          <div
                            class="document-item"
                            id="document-stamp-duty-receipt"
                          >
                            <div
                              class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                            >
                              <div class="flex items-center gap-2">
                                <span
                                  class="icon icon-file text-muted-foreground h-5 w-5"
                                ></span>
                                <div>
                                  <p class="font-medium text-sm">
                                    Stamp Duty Receipt
                                  </p>
                                </div>
                              </div>
                              <div class="relative">
                                <input
                                  type="file"
                                  id="file-stamp-duty-receipt"
                                  accept="application/pdf"
                                  class="hidden"
                                  data-document-id="stamp-duty-receipt"
                                  data-step-id="paying-stamp-duty"
                                  data-phase-id="completion"
                                />
                                <div
                                  class="file-upload-area"
                                  data-document-id="stamp-duty-receipt"
                                  data-step-id="paying-stamp-duty"
                                  data-phase-id="completion"
                                >
                                  <span
                                    class="icon icon-upload h-5 w-5 mx-auto mb-2 text-muted-foreground"
                                  ></span>
                                  <p class="text-sm font-medium">
                                    Upload Stamp Duty Receipt
                                  </p>
                                  <p class="text-xs text-muted-foreground mt-1">
                                    Drag & drop or click to browse
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="document-item" id="document-fee-receipts">
                            <div
                              class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                            >
                              <div class="flex items-center gap-2">
                                <span
                                  class="icon icon-file text-muted-foreground h-5 w-5"
                                ></span>
                                <div>
                                  <p class="font-medium text-sm">
                                    Other Fee Receipts
                                  </p>
                                </div>
                              </div>
                              <div class="relative">
                                <input
                                  type="file"
                                  id="file-fee-receipts"
                                  accept="application/pdf"
                                  class="hidden"
                                  data-document-id="fee-receipts"
                                  data-step-id="paying-stamp-duty"
                                  data-phase-id="completion"
                                />
                                <div
                                  class="file-upload-area"
                                  data-document-id="fee-receipts"
                                  data-step-id="paying-stamp-duty"
                                  data-phase-id="completion"
                                >
                                  <span
                                    class="icon icon-upload h-5 w-5 mx-auto mb-2 text-muted-foreground"
                                  ></span>
                                  <p class="text-sm font-medium">
                                    Upload Other Fee Receipts
                                  </p>
                                  <p class="text-xs text-muted-foreground mt-1">
                                    Drag & drop or click to browse
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="flex justify-end">
                          <button
                            class="button button-primary step-complete-btn"
                            disabled
                            data-step-id="paying-stamp-duty-complete"
                            data-phase-id="completion"
                          >
                            <span class="icon icon-check mr-2"></span> Mark as
                            Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Document Preview Modal -->
          <div id="document-preview" class="document-preview">
            <!-- Preview content will be added here via JavaScript -->
          </div>

          <!-- Toast Notifications -->
          <div
            id="toast-container"
            class="fixed top-4 right-4 z-50 flex flex-col gap-2"
          ></div>
        </div>

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
