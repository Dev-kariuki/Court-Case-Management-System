const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const browseButton = document.getElementById('browse-button');
const uploadButton = document.getElementById('upload-button');
const fileListDisplay = document.getElementById('file-list');

let selectedFiles = [];

// Drag & drop functionality
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('active');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('active');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('active');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFiles(files);
  }
});

// Browse button click event
browseButton.addEventListener('click', () => {
  fileInput.click();
});

// Handle file input change
fileInput.addEventListener('change', () => {
  const files = fileInput.files;
  if (files.length > 0) {
    handleFiles(files);
  }
});

// Handle files
function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    if (!selectedFiles.includes(files[i])) {
      selectedFiles.push(files[i]);
    }
  }
  updateFileList();
  uploadButton.disabled = false;
}

// Update the file list display
function updateFileList() {
  fileListDisplay.innerHTML = '';
  selectedFiles.forEach((file, index) => {
    const listItem = document.createElement('div');
    listItem.title = 'Click to remove file';
    listItem.id = 'file';
    listItem.innerHTML = `<p>${file.name}</p><p>${file.size / 1000}KB</p>`;
    listItem.dataset.index = index;  // Add a custom data attribute for the index
    listItem.addEventListener('click', () => removeFile(index));  // Add click event to remove file
    fileListDisplay.appendChild(listItem);
  });
}

// Remove a specific file
function removeFile(index) {
  selectedFiles.splice(index, 1);  // Remove the file from the array
  updateFileList();  // Update the file list display
  if (selectedFiles.length === 0) {
    uploadButton.disabled = true;  // Disable upload button if no files are left
  }
}

// Upload button click event
uploadButton.addEventListener('click', () => {
  if (selectedFiles.length > 0) {
    alert(`Uploading ${selectedFiles.length} file(s)...`);
    // Here you can implement the actual upload logic (e.g., send files to the server)
  }
});