<?php require_once 'components/sidebar.php';?>
        <header class="card-style">
            <h1>Announcements</h1>
            <button class="add-btn" aria-label="Add announcement" id="openAddBtn">+</button>
        </header>
        <div class="card-list" id="announcements"></div>
        <h2 id="noAnnouncements" style="display:none; margin-top: 20px; text-align: center; font-weight: 900;">NO ANNOUNCEMENTS YET</h2>
    </div>

    <!-- Announcement Details Modal -->
    <div style="display:none" id="detailsBackdrop" class="modal-backdrop"></div>
    <div style="display:none" id="detailsModal" class="modal">
        <img src="" alt="" class="modal-img" id="detailsImg" style="display:none" />
        <div class="modal-header">
        <div class="modal-title" id="detailsTitle"></div>
        <button class="close-btn" aria-label="Close" id="closeModalBtn">&times;</button>
        </div>
        <div class="modal-body">
        <span class="modal-date" id="detailsDate"></span>
        <div id="detailsDesc"></div>
        </div>
        <div id="detailsModalFooter" class="modal-footer" style="padding: 15px; width: 100%;">
            <!-- Delete button will be added here dynamically -->
        </div>
    </div>

    <!-- Add Announcement Modal -->
    <div style="display:none" id="addBackdrop" class="modal-backdrop"></div>
    <div style="display:none" id="addModal" class="modal">
        <div class="modal-header">
        <div class="modal-title">Add Announcement</div>
        <button class="close-btn" aria-label="Close" id="closeAddBtn">&times;</button>
        </div>
        <form class="add-form modal-body" id="addForm" autocomplete="off">
        <label for="title">Title</label>
        <input id="title" name="title" required maxlength="80" placeholder="Announcement title"/>
        <label for="description">Description</label>
        <textarea id="description" required maxlength="400" name="description" placeholder="Description"></textarea>
        <label for="image">Image</label>
        <div class="file-upload" id="dropZone" style="margin-bottom: 10px;">
              <i
                class="fas fa-cloud-upload-alt"
                style="font-size: 30px; color: #333"
              ></i>
              <p style="font-size: 0.875rem">
                Click to upload or drag and drop
              </p>
              <p style="font-size: 0.75rem; color: #666">
                Image
              </p>
              <input
                name="image"
                type="file"
                id="image"
                accept="image/*"
                style="display: none"
                required
              />
            </div>
            <div id="fileList"></div>
        <div class="add-form-actions">
            <button type="button" class="cancel-btn" id="cancelAddBtn">Cancel</button>
            <button class="submit-btn" type="submit">Add</button>
        </div>
        </form>
    </div>
    </section>
    <?php require 'components/chat-notification.php';?>
    <div id="success-toast" class="toast">
      <span id="toast-message">Success! 🎉</span>
    </div>
    <script src="script/announcements.js"></script>
    <script>
        function scrollToAnchorWhenReady(hash, retries = 10) {
            const target = document.querySelector(hash);
            if (target) {
            target.scrollIntoView({ behavior: "smooth" });
            } else if (retries > 0) {
            setTimeout(() => scrollToAnchorWhenReady(hash, retries - 1), 200);
            }
        }

        window.addEventListener("load", function () {
            if (window.location.hash) {
            scrollToAnchorWhenReady(window.location.hash);
            }
        });

        document.addEventListener('DOMContentLoaded', ()=>{
            const dropZone = document.getElementById("dropZone");
            const fileUpload = document.getElementById("image");
            const fileList = document.getElementById("fileList");
            let uploadFile = null;

            dropZone.addEventListener("click", () => fileUpload.click());

            dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.style.borderColor = "#2563eb";
            });

            dropZone.addEventListener("dragleave", () => {
            dropZone.style.borderColor = "";
            });

            dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.style.borderColor = "";
            const file = e.dataTransfer.files;
            handleFile(file);
            });

            fileUpload.addEventListener("change", () => {
            const file = fileUpload.files;
            handleFile(file);
            });

            // Handle files
            function handleFile(file) {
            uploadFile = file;
            updateFileList();
            }

            // Update the file list display
            function updateFileList() {
            fileList.innerHTML = "";
            const listItem = document.createElement("div");
            listItem.title = "Click to remove file";
            listItem.class = "file-listed";
            listItem.id = "file";
            listItem.innerHTML = `<p>${uploadFile[0].name}</p><p>${
                uploadFile[0].size / 1000
                }KB</p>`;
                listItem.addEventListener("click", () => removeFile()); // Add click event to remove file
                fileList.appendChild(listItem);
            
            }

            // Remove a specific file
            function removeFile() {
            uploadFile = null; // Clear the selected file
            updateFileList(); // Update the file list display
            }

            document.getElementById('addForm').addEventListener('submit', (e)=>{
                e.preventDefault();
                const formData = new FormData(e.target);

                formData.append("file", uploadFile[0]);
                
                $.ajax({
                    url: "logic/add-announcements.php",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                    if(response == 'success'){
                        // Clear the form and file list
                        e.target.reset(); // Native and safest

                        fileList.innerHTML = ""; // Clear the file list display
                        uploadFile = null; // Clear the selected file
                        fetchAnnouncements();
                        closeAddModal();
                        const toast = document.getElementById("success-toast");
                        const toastMessage = document.getElementById("toast-message");

                        toastMessage.textContent = `${formData.get('title')} has been added successfully`;
                        toast.classList.add("show");

                        // Hide after 3 seconds
                        setTimeout(() => {
                        toast.classList.remove("show");
                        }, 3000);
                    } else {
                        alert("Failed to add case. Please try again.");
                    }
                    },
                    error: function (xhr, status, error) {
                    console.error("Error:", error);
                    alert("An error occurred while adding the case.");
                    },
                })
                })
        })
    </script>
</body>
</html>
