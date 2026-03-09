// Dom Select Element

const tabs = document.querySelectorAll(".filter-btn");
const issueContainer = document.getElementById("issueContainer");
const issueCount = document.getElementById("issueCount");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const loader = document.getElementById("loader");

const modal = document.getElementById("issueModal");

let issues = [];
let filteredIssues = [];

// Loader Spinner Logic

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

// Data Fetch Logic

async function loadIssues() {
  showLoader();

  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );

  const data = await res.json();

  issues = data.data;

  displayIssues(issues);

  hideLoader();
}

loadIssues();

// Display Issue Logic

function displayIssues(issueArray) {
  issueContainer.innerHTML = "";

  issueCount.innerText = issueArray.length + " Issues";

  issueArray.forEach((issue) => {
    const priority = issue.priority.toUpperCase();

    const border =
      issue.status === "open" ? "border-green-500" : "border-purple-500";

    let priorityColor = "bg-gray-200 text-gray-600";

    if (priority === "HIGH") priorityColor = "bg-red-100 text-red-600";

    if (priority === "MEDIUM") priorityColor = "bg-yellow-100 text-yellow-600";

    const labelsHTML = issue.labels
      .map((label) => {
        const text = label.toUpperCase();

        let color = "bg-gray-100 text-gray-600";
        let icon = "fa-tag";

        if (text === "BUG") {
          color = "bg-red-100 text-red-600";
          icon = "fa-bug";
        }

        if (text === "HELP WANTED") {
          color = "bg-yellow-100 text-yellow-600";
          icon = "fa-handshake";
        }

        if (text === "ENHANCEMENT") {
          color = "bg-green-100 text-green-600";
          icon = "fa-wand-magic-sparkles";
        }

        return `
      <span class="text-xs px-2 py-1 rounded ${color} flex items-center gap-1">
      <i class="fa-solid ${icon}"></i>
      ${text}
      </span>
      `;
      })
      .join("");

    const card = document.createElement("div");

    card.className = `bg-white rounded-xl shadow p-5 border-t-4 ${border}`;

    card.onclick = () => openModal(issue);

    card.innerHTML = `

<div class="flex justify-between items-center mb-3">

<span class="text-sm">
<img src="${
      issue.status === "open" ? "./assets/open.svg" : "./assets/closed.svg"
    }"
class="w-4 h-4">
</span>

<span class="px-3 py-1 text-xs rounded-full ${priorityColor}">
${priority}
</span>

</div>

<h3 class="font-semibold text-lg mb-2">
${issue.title}
</h3>

<p class="text-gray-500 text-sm mb-3">
${issue.description}
</p>

<div class="flex gap-2 mb-4 flex-wrap">
${labelsHTML}
</div>

<hr class="border-gray-200 my-3">

<div class="text-xs text-gray-400 space-y-1">

<p>
#${issue.id} by ${issue.assignee ? issue.assignee : issue.author}
</p>

<p>
${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : ""}
</p>

</div>

`;

    issueContainer.appendChild(card);
  });
}

// Tab Filter Logic

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    showLoader();

    tabs.forEach((btn) => {
      btn.classList.replace("active-tab", "inactive-tab");
    });

    tab.classList.replace("inactive-tab", "active-tab");

    filterIssues(tab.innerText.toLowerCase());

    setTimeout(hideLoader, 200);
  });
});

function filterIssues(filter) {
  const base = filteredIssues.length ? filteredIssues : issues;

  if (filter === "all") displayIssues(base);

  if (filter === "open") displayIssues(base.filter((i) => i.status === "open"));

  if (filter === "closed")
    displayIssues(base.filter((i) => i.status === "closed"));
}

// Search Logic

searchBtn.addEventListener("click", () => {
  showLoader();

  const text = searchInput.value.toLowerCase();

  filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(text) ||
      issue.description.toLowerCase().includes(text),
  );

  displayIssues(filteredIssues);

  hideLoader();
});

// Modal Logic

function openModal(issue) {
  document.getElementById("modalTitle").innerText = issue.title;

  document.getElementById("modalDescription").innerText = issue.description;

  document.getElementById("modalAuthor").innerText =
    "Opened by " + issue.author;

  document.getElementById("modalDate").innerText = issue.createdAt
    ? new Date(issue.createdAt).toLocaleDateString()
    : "";

  document.getElementById("modalAssignee").innerText = issue.assignee
    ? issue.assignee
    : issue.author;

  const status = document.getElementById("modalStatus");

  status.innerText = issue.status;

  status.className =
    issue.status === "open"
      ? "px-3 py-1 rounded-full bg-green-500 text-white"
      : "px-3 py-1 rounded-full bg-purple-500 text-white";

  const priority = document.getElementById("modalPriority");

  const p = issue.priority.toUpperCase();

  priority.innerText = p;

  if (p === "HIGH")
    priority.className =
      "mt-2 inline-block px-3 py-1 rounded-full bg-red-500 text-white text-sm";

  if (p === "MEDIUM")
    priority.className =
      "mt-2 inline-block px-3 py-1 rounded-full bg-yellow-500 text-white text-sm";

  if (p === "LOW")
    priority.className =
      "mt-2 inline-block px-3 py-1 rounded-full bg-gray-500 text-white text-sm";

  const labelsContainer = document.getElementById("modalLabels");

  labelsContainer.innerHTML = "";

  issue.labels.forEach((label) => {
    const text = label.toUpperCase();

    let color = "bg-gray-100 text-gray-600";
    let icon = "fa-tag";

    if (text === "BUG") {
      color = "bg-red-100 text-red-600";
      icon = "fa-bug";
    }

    if (text === "HELP WANTED") {
      color = "bg-yellow-100 text-yellow-600";
      icon = "fa-handshake";
    }

    if (text === "ENHANCEMENT") {
      color = "bg-green-100 text-green-600";
      icon = "fa-wand-magic-sparkles";
    }

    const span = document.createElement("span");

    span.className = `px-2 py-1 text-xs rounded ${color} flex items-center gap-1`;

    span.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    ${text}
    `;

    labelsContainer.appendChild(span);
  });

  modal.showModal();
}
