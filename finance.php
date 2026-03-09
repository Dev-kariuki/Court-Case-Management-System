<?php require_once 'components/sidebar.php';?>

      <div
        class="animate-fadeUp"
        style="display: flex; flex-direction: column; gap: 20px"
      >
        <div>
          <h2>GENERAL REQUISITION</h2>
          <div class='amount-container'>

            <div class="amount-section">
              <i class="fas fa-wallet"></i>
              <h2>Amount Spent</h2>
              <p class="amount spent" id="amount-spent">KES 0</p>
            </div>
            <div class="amount-section">
              <i class="fas fa-money-bill-wave"></i>
              <h2>Amount Earned</h2>
              <p class="amount earned" id="amount-earned">KES 0</p>
            </div>
            <div class="amount-section">
              <i class="fas fa-chart-line"></i>
              <h2>Profit</h2>
              <p class="amount profit" id="profit">KES 0</p>
            </div>
          </div> 
        </div>
        <div>
          <h2>ADMINISTRATION REQUISITION</h2>
          <div class="amount-container">
            <div class="amount-section">
              <i class="fas fa-wallet"></i>
              <h2>Amount Spent</h2>
              <p class="amount spent" id="admin-amount-spent">KES 0</p>
            </div>
            <div class="amount-section">
              <i class="fas fa-money-bill-wave"></i>
              <h2>Amount Earned</h2>
              <p class="amount earned" id="admin-amount-earned">KES 0</p>
            </div>
            <div class="amount-section">
              <i class="fas fa-chart-line"></i>
              <h2>Profit</h2>
              <p class="amount profit" id="admin-profit">KES 0</p>
            </div>
          </div>
        </div>
        <div class="search-file-container">
          <input
            type="text"
            class="search-bar"
            id="search-bar"
            placeholder="Search receipt..."
          />
          <div class="button-container">
            <button class="search-btn" id="search-btn">
              <i class="fa-solid fa-magnifying-glass"></i> &nbsp; Search
            </button>
            <input type="file" id="task-file-input" class="task-file-input" />
            <?php
              if(isset($_SESSION['admin']) && $_SESSION['admin'] == 1){
                echo '<button class="task-file-btn" id="toggle-receipt">
                  <i class="fa-solid fa-plus"></i> &nbsp; Add Expenditure Receipt
                </button>';
              }
            ?>
          </div>
        </div>
        <div class="finance-container">
          <div id="receipts-container">
            <h2 style="text-align: center; font-weight: 900; margin-top: 20px;" id="no-receipt">NO RECEIPT FOUND</h2>
          </div>
        </div>
      </div>
    </section>
    <section class="add-receipt-overlay" id="add-receipt-overlay">
      <div id="add-receipt-form" class="add-receipt-form">
        <div class="receipt-header">
          <h2>Add New Receipt</h2>
          <button
            id="close-receipt"
            style="
              width: max-content;
              margin-bottom: 0;
              background: transparent;
              border: none;
              font-size: 30px;
              cursor: pointer;
              color: var(--gray-700);
            "
          >
            &times;
          </button>
        </div>
        <form id="add-receipt-form">
          <div class="receipt-div">
            <label for="receipt-title">Receipt Title:</label>
            <input
              type="text"
              id="receipt-title"
              required
              name="receipt-title"
              placeholder="Enter receipt title"
            />
          </div>
          <div class="receipt-div" style="margin-bottom: 10px;">
            <label for="category">Expense Category:</label>
            <select name="category" style="padding: 12px; border-radius: 5px; font-size: 14px;" id="category" required>
              <option value="1">General Expense</option>
              <option value="0">Administration Requisition</option>
            </select>
          </div>
          <div class="receipt-div">
            <label for="receipt-date">Date:</label>
            <input type="date" id="receipt-date" name="receipt-date" required />
          </div>
          <div class="receipt-div">
            <label for="receipt-amount">Amount:</label>
            <p style="font-size: 12px; color: #777;">To add an expense, make the amount negative e.g., -2000</p>
            <input
              required
              name="receipt-amount"
              type="number"
              id="receipt-amount"
              required
              placeholder="Enter amount"
            />
          </div>
          <div class="form-group">
            <label class="label">Image</label>
            <div class="file-upload" id="dropZone">
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
                type="file"
                id="fileUpload"
                accept="image/*"
                style="display: none"
                required
              />
            </div>
            <div id="fileList"></div>
          </div>
          <button type="submit" class="button">Add Receipt</button>
        </form>
      </div>
    </section>
    <div id="success-toast" class="toast">
      <span id="toast-message">Success! 🎉</span>
    </div>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script>
      const closeReceipt = document.getElementById("close-receipt");
      const toggleReceipt = document.getElementById("toggle-receipt");
      const receiptoverlay = document.getElementById("add-receipt-overlay");
      const receiptCont = document.getElementById("receipts-container");
      const noReceipt = document.getElementById("no-receipt");
      const isAdmin = <?= isset($_SESSION['admin']) && $_SESSION['admin'] == 1 ? 'true' : 'false' ?>;
      const searchBtn = document.getElementById("search-btn");
      const searchBar = document.getElementById("search-bar");

      searchBtn.addEventListener("click", () => {
        const searchValue = searchBar.value.toLowerCase();
        const receipts = document.querySelectorAll(".receipt");

        receipts.forEach((receipt) => {
          const title = receipt.querySelector(".receipt-title").textContent.toLowerCase();
          if (title.includes(searchValue)) {
            receipt.style.display = "flex";
          } else {
            receipt.style.display = "none";
          }
        });
      });

      if(toggleReceipt){
        toggleReceipt.addEventListener("click", () => {
          receiptoverlay.style.display = "flex";
        });
      }

      closeReceipt.addEventListener("click", () => {
        receiptoverlay.style.display = "none";
      });

      function swipe(imageUrl) {
        window.open(
          imageUrl,
          "Image",
          "width=800,height=600,resizable=1"
        );
      }

      document.addEventListener("DOMContentLoaded", () => {
        // File upload handling
        const dropZone = document.getElementById("dropZone");
        const fileUpload = document.getElementById("fileUpload");
        const fileList = document.getElementById("fileList");
        let uploadFile = null;

        fetchReceipts();

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

        // Add new receipt function
        document.getElementById('add-receipt-form').addEventListener('submit', (e)=>{
          e.preventDefault();
          const formData = new FormData(e.target);

          formData.append("file", uploadFile[0]);
          
          $.ajax({
            url: "logic/add-finance.php",
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
                fetchReceipts();
                receiptoverlay.style.display = "none";
                const toast = document.getElementById("success-toast");
                const toastMessage = document.getElementById("toast-message");

                toastMessage.textContent = `${formData.get('receipt-title')} has been added successfully`;
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

        function deleteReceipt(receiptId, imageUrl) {
          $.ajax({
            url: 'logic/delete-finance.php',  // Your PHP delete script path
            method: 'POST',
            data: { id: receiptId, image: imageUrl },
            success: function(response) {
              if (response.trim() === 'success') {
                alert('Receipt deleted successfully');
                window.location.reload(); // Reload the page to reflect changes
              } else {
                alert('Error deleting receipt: ' + response);
              }
            },
            error: function() {
              alert('An error occurred while deleting.');
            }
          });
        }


        function fetchReceipts(){
          $.ajax({
            url: "logic/get-finance.php",
            type: "GET",
            success: function (response) {
              const data = response;
              if (data.length > 0) {
              receiptCont.innerHTML = ""; // Clear previous receipts
              noReceipt.style.display = "none";

              let amountSpent = 0, amountEarned = 0, profit = 0;
              let adminSpent = 0, adminEarned = 0, adminProfit = 0;

              data.forEach((receipt) => {
                const receiptDiv = document.createElement("div");
                receiptDiv.classList.add("receipt");

                const imageUrl = `logic/uploads/${receipt.image}`;
                receiptDiv.setAttribute("onclick", `swipe('${imageUrl}')`);

                receiptDiv.innerHTML = `
                  <div class="receipt-info">
                    <img src="${imageUrl}" alt="Receipt Image" />
                    <div>
                      <div class="receipt-title">${receipt.title}</div>
                      <div class="receipt-date">${new Date(receipt['date_of_receipt']).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).replace(/ /g, ' ').replace(/(\d+)(st|nd|rd|th)/, '$1$2')}</div>
                      <div class="receipt-category">${receipt.category == '1' ? 'General Requisition' : 'Administration Requisition'}</div>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="receipt-amount ${receipt.amount < 0 ? 'deduct' : ''}">${receipt.amount}</div>
                    ${
                      isAdmin ? `
                      <button class="delete-receipt-btn" data-receipt-id="${receipt.id}"><i class="fas fa-trash"></i></button>
                      ` : ''
                    }
                  </div>
                `;

                const deleteButton = receiptDiv.querySelector('.delete-receipt-btn');
                if(deleteButton){
                  deleteButton.addEventListener('click', function() {
                    // Prevent the click event from bubbling up to the receiptDiv
                    event.stopPropagation();
                    const receiptId = this.dataset.receiptId;
                    if (confirm('Are you sure you want to delete this receipt?')) {
                      deleteReceipt(receiptId, imageUrl);
                    }
                  });
                }


                receiptCont.appendChild(receiptDiv);

                if(receipt.category == '1'){
                  // Track general totals
                  if (receipt.amount < 0) {
                    amountSpent += Math.abs(receipt.amount);
                  } else {
                    amountEarned += receipt.amount;
                  }
                }

                // Track admin totals for category 0
                if (receipt.category == '0') {
                  if (receipt.amount < 0) {
                    adminSpent += Math.abs(receipt.amount);
                  } else {
                    adminEarned += receipt.amount;
                  }
                }
              });

              profit = amountEarned - amountSpent;
              adminProfit = adminEarned - adminSpent;

              // Set general totals
              document.getElementById("amount-earned").textContent = `KES ${amountEarned}`;
              document.getElementById("amount-spent").textContent = `KES ${amountSpent}`;
              document.getElementById("profit").textContent = `KES ${profit}`;

              // Set admin totals
              document.getElementById("admin-amount-earned").textContent = `KES ${adminEarned}`;
              document.getElementById("admin-amount-spent").textContent = `KES ${adminSpent}`;
              document.getElementById("admin-profit").textContent = `KES ${adminProfit}`;
            }

            },
            error: function (error) {
              console.error("Error fetching receipts:", error);
            },
          })
        }

      });
    </script>
  </body>
</html>
