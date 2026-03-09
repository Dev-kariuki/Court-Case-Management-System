<?php
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
    <title>Register user</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
    <link rel="stylesheet" href="styles/register.css" />
    <link rel="shortcut icon" href="assets/icon.jpeg" type="image/x-icon" />
  </head>

  <body>
    <div class="container">
      <h2>Sign Up</h2>
      <form id="signup-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="first-name">First Name</label>
            <input
              type="text"
              id="first-name"
              name="first-name"
              required
              placeholder="Enter first name"
            />
            <div class="error" id="first-name-error"></div>
          </div>
          <div class="form-group">
            <label for="last-name">Last Name</label>
            <input
              type="text"
              id="last-name"
              name="last-name"
              required
              placeholder="Enter last name"
            />
            <div class="error" id="last-name-error"></div>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter email"
            />
            <div class="error" id="email-error"></div>
          </div>
          <div class="form-group">
            <label for="role">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              required
              placeholder="Enter role"
            />
            <div class="error" id="role-error"></div>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter password"
            />
            <div class="error" id="password-error"></div>
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              required
              placeholder="Confirm password"
            />
            <div class="error" id="confirm-password-error"></div>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
             <label for="admin">Is Admin?</label>
             <select id="admin" name="admin">
               <option value="1">Yes</option>
               <option value="0" selected>No</option>
             </select>
           </div>
           <div class="form-group">
              <label for="client">Is Client?</label>
              <select id="client" name="client">
                <option value="1">Yes</option>
                <option value="0" selected>No</option>
              </select>
            </div>
        </div>

        
        <div class="form-grid">
          <div class="form-group">
            <label for="case-no">Case no</label>
            <input
              type="text"
              id="case-no"
              name="case-no"
              placeholder="Enter case number"
            />
          </div>
          <div class="form-group">
            <label for="team-access">Team Access</label>
            <select id="team-access" name="team-access">
              <option value="1">Access Granted</option>
              <option value="0">Access Denied</option>
            </select>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label for="tasks-access">Tasks Access</label>
            <select id="tasks-access" name="tasks-access">
              <option value="1">Access Granted</option>
              <option value="0">Access Denied</option>
            </select>
          </div>
          <div class="form-group">
            <label for="cases-access">Cases Access</label>
            <select id="cases-access" name="cases-access">
              <option value="1">Access Granted</option>
              <option value="0">Access Denied</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="calendar-access">Calendar Access</label>
          <select id="calendar-access" name="calendar-access">
            <option value="1">Access Granted</option>
            <option value="0">Access Denied</option>
          </select>
        </div>

        <div
              id="upload-container"
              class="border-2 mb-3 border-dashed rounded-lg p-3 text-center cursor-pointer border-black hover:border-blue-800 hover:bg-blue-50 transition-all">
              <div class="flex flex-col items-center gap-3">
                <div class="p-3 rounded-full bg-blue-100">
                  <i
                    class="fas fa-cloud-upload-alt"
                    style="font-size: 30px; color: #333"
                  ></i>
                </div>
                <div>
                  <p class="font-medium text-sm">Upload your image</p>
                  <p class="text-xs text-gray-500 mt-1">
                    Drag and drop files here or click to browse
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Accepted formats: jpg, jpeg, png
                  </p>
                </div>
              </div>
            </div>
            <input
              type="file"
              id="file-input"
              multiple
              accept=".jpg,.jpeg,.png"
              class="hidden"
            />
            <div id="selected-files" class="mt-4 mb-2 space-y-2">
              <div id="files-list" class="grid gap-2">
                <!-- Selected files will be populated here by JavaScript -->
              </div>
            </div>

        <button type="submit" class="btn">Sign Up</button>
      </form>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script>
      const uploadContainer = document.getElementById("upload-container");
      const fileInput = document.getElementById("file-input");
      const filesList = document.getElementById("files-list");
      let fileUpload = null;
      
      
      uploadContainer.addEventListener("click", () => {
        fileInput.click();
      });
      
      uploadContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadContainer.classList.add("border-blue-500", "bg-blue-50");
      });
      
      uploadContainer.addEventListener("dragleave", () => {
        uploadContainer.classList.remove("border-blue-500", "bg-blue-50");
      });
      
      uploadContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadContainer.classList.remove("border-blue-500", "bg-blue-50");
        
        fileUpload = e.dataTransfer.files[0];
        handleFile(e.dataTransfer.files[0]);
      });
      
      fileInput.addEventListener("change", () => {
        fileUpload = fileInput.files[0];
        handleFile(fileInput.files[0]);
      });


      function validateForm() {
        let isValid = true;

        // Clear previous errors
        document.querySelectorAll(".error").forEach(function (errorElement) {
          errorElement.textContent = "";
        });

        // Validate first name
        let firstName = document.getElementById("first-name").value;
        if (!firstName) {
          document.getElementById("first-name-error").textContent =
            "First Name is required.";
          isValid = false;
        }

        // Validate last name
        let lastName = document.getElementById("last-name").value;
        if (!lastName) {
          document.getElementById("last-name-error").textContent =
            "Last Name is required.";
          isValid = false;
        }

        // Validate email
        let email = document.getElementById("email").value;
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email || !emailPattern.test(email)) {
          document.getElementById("email-error").textContent =
            "Please enter a valid email.";
          isValid = false;
        }

        // Validate password
        let password = document.getElementById("password").value;
        if (!password || password.length < 6) {
          document.getElementById("password-error").textContent =
            "Password must be at least 6 characters.";
          isValid = false;
        }

        // Validate confirm password
        let confirmPassword = document.getElementById("confirm-password").value;
        if (confirmPassword !== password) {
          document.getElementById("confirm-password-error").textContent =
            "Passwords do not match.";
          isValid = false;
        }

        return isValid;
      }

      function handleFile(file) {
        filesList.innerHTML = "";
        if (file) {
          const fileName = file.name;
          const fileSize = file.size / 1024; // Size in KB
          const fileType = file.type;

          const fileItem = document.createElement("div");
          fileItem.className =
            "file-item flex items-center justify-between bg-gray-50 p-2 rounded";


          fileItem.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="overflow-hidden">
              <p class="text-sm font-medium truncate">${file.name}</p>
              <p class="text-xs text-gray-500">${formatFileSize(file.size)}</p>
            </div>
          </div>
        `;

        filesList.append(fileItem);
        }
      }

      function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + " bytes";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        else return (bytes / 1048576).toFixed(1) + " MB";
      }

      // Handle form submission
      $(document).ready(function() {
        $('#signup-form').on('submit', function(e) {
          
          if (!validateForm()) {
            e.preventDefault();
            return;
          }else{
            e.preventDefault();
            var formData = new FormData();
            formData.append('fname', $('#first-name').val());
            formData.append('lname', $('#last-name').val());
            formData.append('email', $('#email').val());
            formData.append('role', $('#role').val());
            formData.append('password', $('#password').val());
            formData.append('admin', $('#admin').val());
            formData.append('client', $('#client').val());
            formData.append('caseNo', $('#case-no').val());
            formData.append('tasksAccess', $('#tasks-access').val());
            formData.append('teamAccess', $('#team-access').val());
            formData.append('casesAccess', $('#cases-access').val());
            formData.append('calendarAccess', $('#calendar-access').val());        
            formData.append('file', fileUpload);
            
            // Send data to PHP script using AJAX
            $.ajax({
              url: 'logic/add-user.php',
              type: 'POST',
              data: formData,
              processData: false,
              contentType: false,
              success: function(response) {
                if (response === 'success') {
                  window.location.href = 'index.php';
                } else {
                  alert('Error: ' + response);
                }
              },
              error: function() {
                console.log('Error occurred while sending the request.');
              }
            });
          }
          
          
        })
      });

      
    </script>
  </body>
</html>
