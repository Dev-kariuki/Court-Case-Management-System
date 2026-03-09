<?php
require_once 'logic/db-conn.php';
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="shortcut icon" href="assets/icon.jpeg" type="image/x-icon" />
      <link
      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
      rel="stylesheet"
      />
      <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
      />
      <link rel="stylesheet" href="styles/case.css" />
      <link rel="stylesheet" href="styles/styles.css" />
      <title>Case page</title>
      <style>
        body{
          background: #efe9e9;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
        }
        
        section{
          min-height: max-content;
        }

        .logout-button{
          background-color: #e74c3c;
          color: white;
          padding: 10px 15px;
          width: max-content;
          align-self: flex-end;
        }
      </style>
  </head>
    <body>  
      <button class="logout-button btn-icon" id="logout-button">
        <i class="fas fa-sign-out-alt"></i>
        Logout
      </button>
      <div style="display: flex; flex-direction: column; gap: 20px; width: 100%">
        <!-- Case Header -->
        <section id="case-header" class="card glass-card">
          <div class="case-status-badge" id="case-status-badge">Active</div>
          <h1 id="case-title">Loading case...</h1>
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

        <!-- Court Info -->
        <section id="court-info" class="card glass-card" style="width: 100%">
          <h2 class="card-title">
            <i class="fas fa-balance-scale"></i> Court Information
          </h2>
          <div class="card-content">
            <div id="court-details" class="court-details"></div>
          </div>
        </section>

        <!-- Parties Involved -->
        <section
          id="parties-involved"
          class="card glass-card two-column-span"
          style="width: 100%">
          
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-users"></i> Parties Involved
            </h2>
          </div>
          <div class="card-content">
            <div id="parties-container" class="parties-grid"></div>
          </div>
        </section>

        <!-- Document Gallery -->
        <section id="document-gallery" class="card glass-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-file-alt"></i> Case Documents
            </h2>
          </div>
          <div class="card-content">
            <div id="documents-container" class="documents-grid"></div>
          </div>
        </section>

        <!-- Document Gallery -->
        <section id="document-gallery" class="card glass-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-file-alt"></i> Pleadings
            </h2>
          </div>
          <div class="card-content">
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
        <section id="document-gallery" class="card glass-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-file-alt"></i> Court Documents
            </h2>
          </div>
          <div class="card-content">
            <div id="court-docs-container" class="documents-grid"></div>
          </div>
        </section>

        <!-- Document Gallery -->
        <section id="correspondence-documents" class="card glass-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-file-alt"></i> Correspondences
            </h2>
          </div>
          <div class="card-content">
            <div id="correspondence-documents-container" class="documents-grid"></div>
          </div>
        </section>

        <!-- Document Gallery -->
        <section id="attendance-memo-documents" class="card glass-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-file-alt"></i> Court Attendance memo & Client updates
            </h2>
          </div>
          <div class="card-content">
            <div id="attendance-memo-documents-container" class="documents-grid"></div>
          </div>
        </section>

        <!-- Confidential Documents -->
        <section
          id="client-confidential-docs"
          class="card glass-card two-column-span"
          style="width: 100%; margin-top: 15px;">
          <div class="card-header">
            <h2 class="card-title" style="font-size: 1.1rem">
              <i class="fas fa-file-alt"></i> Client-Advocate Documents
            </h2>
          </div>
          <div class="card-content">
            <div id="client-confidential-docs-container" class="documents-grid"></div>
          </div>
        </section>        

        <!-- Case Timeline -->
        <section id="case-timeline" class="card glass-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-list"></i> Case Timeline
            </h2>
          </div>
          <div class="card-content">
            <div id="timeline-container" class="timeline">
              <div class="timeline-line"></div>
              <!-- Timeline steps will be inserted here -->
            </div>
          </div>
        </section>
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="script/client.js"></script>
    <script>
      $(document).ready(function(){
        $("#logout-button").click(function(){
          $.ajax({
            url: 'logic/logout.php',
            type: 'POST',
            success: function(response) {
              window.location.href = 'login.php';
            },
            error: function() {
              alert('Error logging out. Please try again.');
            }
          });
        });
      });
    </script>
  </body>
</html>
