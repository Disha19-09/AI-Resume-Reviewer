const uploadBox = document.getElementById('uploadBox');
const resumeInput = document.getElementById('resumeInput');
const reviewBtn = document.getElementById('reviewBtn');
const fileChip = document.getElementById('fileChip');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const resultBox = document.getElementById('resultBox');
const feedbackText = document.getElementById('feedbackText');
const themeBtn = document.getElementById('themeBtn');
const themeLabel = document.getElementById('themeLabel');

let selectedFile = null;

themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
  themeLabel.textContent = isDark ? 'Dark mode' : 'Light mode';
});

uploadBox.addEventListener('click', () => resumeInput.click());

uploadBox.addEventListener('dragover', e => {
  e.preventDefault();
  uploadBox.classList.add('dragover');
});

uploadBox.addEventListener('dragleave', () => uploadBox.classList.remove('dragover'));

uploadBox.addEventListener('drop', e => {
  e.preventDefault();
  uploadBox.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) setFile(file);
});

resumeInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) setFile(file);
});

removeFile.addEventListener('click', e => {
  e.stopPropagation();
  clearFile();
});

function setFile(file) {
  const isPDF = file.type === 'application/pdf';
  const isTXT = file.name.endsWith('.txt');

  if (!isPDF && !isTXT) {
    uploadBox.querySelector('h3').textContent = 'Only PDF or TXT files, please';
    return;
  }

  selectedFile = file;
  fileName.textContent = file.name;
  fileChip.classList.add('visible');
  reviewBtn.disabled = false;
  uploadBox.querySelector('h3').textContent = 'Drop your file here';
}

function clearFile() {
  selectedFile = null;
  resumeInput.value = '';
  fileChip.classList.remove('visible');
  reviewBtn.disabled = true;
}

reviewBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  document.getElementById('resumeName').textContent =
    selectedFile.name.replace(/\.(txt|pdf)$/i, '');

  emptyState.style.display = 'none';
  resultBox.classList.remove('visible');
  loadingState.classList.add('visible');
  reviewBtn.textContent = 'Analysing…';
  reviewBtn.disabled = true;

  try {
    const formData = new FormData();
    formData.append('resume', selectedFile);

    const response = await fetch('/review', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    loadingState.classList.remove('visible');
    feedbackText.innerHTML = marked.parse(data.feedback);
    resultBox.classList.add('visible');

  } catch (error) {
    loadingState.classList.remove('visible');
    feedbackText.innerHTML = '<p>Something went wrong. Make sure your server is running.</p>';
    resultBox.classList.add('visible');
  }

  reviewBtn.textContent = 'Analyse my resume';
  reviewBtn.disabled = false;
});