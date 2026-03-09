const createBtn = document.getElementById("create-misc-btn");
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Lucide icons
  const icons = {
    "arrow-left-icon": "arrow-left",
    "trash-icon-0": "trash",
    "plus-icon": "plus",
    "upload-area-icon": "upload",
    "save-icon": "save",
    "check-icon": "check",
    "x-icon": "x",
  };

  Object.entries(icons).forEach(([elementId, iconName]) => {
    const element = document.getElementById(elementId);
    if (element) {
      const icon = lucide[iconName];
      if (icon) {
        // Create the icon with appropriate size
        const size = elementId === "plus-icon" ? 16 : 20;
        element.innerHTML = icon.toSvg({ width: size, height: size });
      }
    }
  });

  // Set default date to today
  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  // Track parties and files
  let partyCount = 1;

  // Handle adding and removing parties
  const partiesContainer = document.getElementById("parties-container");
  const addPartyBtn = document.getElementById("add-party-btn");

  addPartyBtn.addEventListener("click", () => {
    addParty();
  });

  function addParty() {
    const partyItem = document.createElement("div");
    partyItem.className = "party-item flex items-end gap-3 slide-up";
    partyItem.innerHTML = `
      <div class="flex-1">
        <label for="party-${partyCount}" class="block text-gray-700 text-sm font-medium mb-1 sr-only">Party Name</label>
        <input type="text" id="party-${partyCount}" name="parties[]" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full name or organization" required>
        <p id="party-${partyCount}-error" class="text-red-500 text-xs mt-1 hidden"></p>
      </div>
      <button type="button" class="remove-party px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 mb-[2px]">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    partiesContainer.appendChild(partyItem);

    // Enable all remove buttons when we have more than one party
    document.querySelectorAll(".remove-party").forEach((button) => {
      button.disabled = false;
    });

    partyCount++;

    // Add event listener to the new remove button
    const removeButton = partyItem.querySelector(".remove-party");
    removeButton.addEventListener("click", () => {
      removeParty(partyItem);
    });
  }

  function removeParty(partyItem) {
    if (document.querySelectorAll(".party-item").length > 1) {
      partyItem.remove();

      // If only one party remains, disable its remove button
      if (document.querySelectorAll(".party-item").length === 1) {
        document.querySelector(".remove-party").disabled = true;
      }
    }
  }

  // Form handling and validation
  const caseForm = document.getElementById("case-form");

  caseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {
      submitForm();
    }
  });

  function validateForm() {
    let isValid = true;

    // Validate title
    const titleInput = document.getElementById("title");
    const titleError = document.getElementById("title-error");

    if (titleInput.value.length < 5) {
      titleError.textContent = "Title must be at least 5 characters";
      titleError.classList.remove("hidden");
      titleInput.classList.add("border-red-500");
      isValid = false;
    } else {
      titleError.classList.add("hidden");
      titleInput.classList.remove("border-red-500");
    }

    // Validate description
    const descriptionInput = document.getElementById("description");
    const descriptionError = document.getElementById("description-error");

    if (descriptionInput.value.length < 10) {
      descriptionError.textContent =
        "Description must be at least 10 characters";
      descriptionError.classList.remove("hidden");
      descriptionInput.classList.add("border-red-500");
      isValid = false;
    } else {
      descriptionError.classList.add("hidden");
      descriptionInput.classList.remove("border-red-500");
    }

    // Validate parties (at least one is required)
    const partyInputs = document.querySelectorAll('input[name="parties[]"]');
    let hasValidParty = false;

    partyInputs.forEach((input, index) => {
      const errorElement =
        document.getElementById(`party-${index}-error`) ||
        document.getElementById(`party-0-error`);

      if (input.value.trim().length > 0) {
        hasValidParty = true;
        errorElement.classList.add("hidden");
        input.classList.remove("border-red-500");
      } else {
        errorElement.textContent = "Party name is required";
        errorElement.classList.remove("hidden");
        input.classList.add("border-red-500");
      }
    });

    if (!hasValidParty) {
      isValid = false;
    }

    if (!isValid) {
      // Add shake animation to the form
      caseForm.classList.add("shake");
      setTimeout(() => {
        caseForm.classList.remove("shake");
      }, 400);
    }

    return isValid;
  }

  function submitForm() {
    const formData = new FormData(caseForm);
    const location = localStorage.getItem("Location");
    formData.append("file_location", location);

    $.ajax({
      url: "logic/add-misc-case.php",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        if (response === "success") {
          // Show success toast
          const successToast = document.getElementById("success-toast");
          const successMessage = document.getElementById("success-message");
          createBtn.disabled = true;

          successMessage.textContent = `"${formData.get(
            "title"
          )}" has been added successfully!`;
          successToast.classList.add("slide-in-right");
          successToast.style.opacity = "1";
          successToast.style.pointerEvents = "auto";

          setTimeout(() => {
            successToast.classList.remove("slide-in-right");
            successToast.style.opacity = "0";
            successToast.style.pointerEvents = "none";

            window.location.href = "misc-cases.php";
          }, 2000);
        } else {
          alert("Error: " + response);
        }
      },
      error: function () {
        console.log("Error occurred while sending the request.");
      },
    });
  }
});
