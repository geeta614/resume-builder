function addProject() {
  const container = document.getElementById("projectsContainer");
  const firstProject = container.querySelector(".project-entry");
  const clone = firstProject.cloneNode(true);

  clone.querySelectorAll("input, textarea").forEach(input => input.value = "");

  const removeBtn = clone.querySelector(".remove-btn");
  if (removeBtn) {
    removeBtn.onclick = function () {
      removeProject(removeBtn);
    };
  }

  container.appendChild(clone);
}

function removeProject(button) {
  const container = document.getElementById("projectsContainer");
  const allProjects = container.querySelectorAll(".project-entry");

  // Allow removing all (0 projects allowed)
  const projectToRemove = button.closest(".project-entry");
  if (projectToRemove) {
    projectToRemove.remove();
  }
}

function addExperience() {
  const container = document.getElementById("experienceContainer");
  const firstExperience = container.querySelector(".experience-entry");
  const clone = firstExperience.cloneNode(true);

  clone.querySelectorAll("input, textarea").forEach(input => input.value = "");

  const removeBtn = clone.querySelector(".remove-btn");
  if (removeBtn) {
    removeBtn.onclick = function () {
      removeExperience(removeBtn);
    };
  }

  container.appendChild(clone);
}

function removeExperience(button) {
  const container = document.getElementById("experienceContainer");
  const entryToRemove = button.closest(".experience-entry");
  if (entryToRemove) {
    entryToRemove.remove();
  }
}

function generatePreview() {
  // Validate required fields before generating
  const requiredFields = [
    "name", "email", "phone",
    "college", "degree", "duration1", "cgpa",
    "languages", "tools", "courseWork"
  ];

  for (const id of requiredFields) {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      alert(`Please fill the required field: ${el.placeholder}`);
      el.focus();
      return;
    }
  }

  // Prepare projects section, skip empty entries
  const projectElements = document.querySelectorAll(".project-entry");
  let projectHTML = "";

  projectElements.forEach(entry => {
    const title = entry.querySelector(".projectTitle").value.trim();
    // Only include projects with at least a title or description or tech stack
    if (
      title ||
      entry.querySelector(".projectPoints").value.trim() ||
      entry.querySelector(".techStack").value.trim()
    ) {
      const git = entry.querySelector(".projectGit").value.trim();
      const live = entry.querySelector(".projectLink").value.trim();
      const date = entry.querySelector(".projectDate").value.trim();
      const desc = listify(entry.querySelector(".projectPoints").value);
      const stack = entry.querySelector(".techStack").value.trim();

      projectHTML += `
        <p><strong>${title || "(No Title)"}</strong> |
        ${formatLink(git, "GitHub")} |
        ${formatLink(live, "Live")} |
        ${date}</p>
        <ul>${desc}</ul>
        <p><em>Tech Stack:</em> ${stack}</p>
      `;
    }
  });

  // Prepare experience section, skip empty entries
  let experienceHTML = "";
  const experienceElements = document.querySelectorAll(".experience-entry");

  experienceElements.forEach(entry => {
    const role = entry.querySelector(".jobRole").value.trim();
    const org = entry.querySelector(".jobOrg").value.trim();
    const duration = entry.querySelector(".jobDuration").value.trim();
    const desc = listify(entry.querySelector(".jobDesc").value);

    // Only include if at least role or org or description is filled
    if (role || org || desc) {
      experienceHTML += `
        <p><strong>${role || "(No Role)"}</strong> | ${org || "(No Organization)"} | ${duration}</p>
        <ul>${desc}</ul>
      `;
    }
  });

  // Prepare other optional fields with listify or empty string
  const positionsHTML = listify(get("positions"));
  const achievementsHTML = listify(get("achievements"));
  const certificationsHTML = listify(get("certifications"));

  const template = `
    <div style="font-family: 'Georgia', serif; max-width: 800px; margin: auto; color: black;">
      <h1 style="text-align: center;">${get("name")}</h1>
      <p style="text-align: center;">
        ${get("phone")} | ${get("email")} | 
        ${getLink("linkedin", "LinkedIn")} |
        ${getLink("github", "GitHub")} |
        ${getLink("leetcode", "LeetCode")}
      </p>

      <hr />

      <h2>Education</h2>
      <p><strong>${get("college")}</strong><br />
      <em>${get("degree")}</em><br />
      ${get("duration1")} | CGPA: ${get("cgpa")}</p>

      ${get("school12") ? `<p><strong>${get("school12")}</strong><br />${get("duration12")} | Percentage: ${get("percent12")}%</p>` : ""}
      ${get("school10") ? `<p><strong>${get("school10")}</strong><br />${get("duration10")} | Percentage: ${get("percent10")}%</p>` : ""}

      <hr />

      ${projectHTML ? `<h2>Projects</h2>${projectHTML}<hr />` : ""}

      ${experienceHTML ? `<h2>Experience</h2>${experienceHTML}<hr />` : ""}

      <h2>Technical Skills</h2>
      <p><strong>Languages:</strong> ${get("languages")}</p>
      <p><strong>Tools:</strong> ${get("tools")}</p>
      <p><strong>Course Work:</strong> ${get("courseWork")}</p>

      ${positionsHTML ? `<hr /><h2>Positions of Responsibility</h2><ul>${positionsHTML}</ul>` : ""}
      ${achievementsHTML ? `<hr /><h2>Achievements</h2><ul>${achievementsHTML}</ul>` : ""}
      ${certificationsHTML ? `<hr /><h2>Certifications</h2><ul>${certificationsHTML}</ul>` : ""}
    </div>
  `;

  const target = document.getElementById("resumeTemplate");
  target.innerHTML = template;
  target.style.display = "block";

  document.getElementById("downloadBtn").style.display = "inline-block";
  target.scrollIntoView({ behavior: "smooth" });
}

function downloadPDF() {
  const target = document.getElementById("resumeTemplate");
  if (target.innerHTML.trim() === "") {
    alert("Please generate the preview first.");
    return;
  }

  target.style.display = "block";
  window.scrollTo(0, 0);

  target.classList.add("bw-print", "pdf-compact", "ats-optimized");

  setTimeout(() => {
    html2pdf()
      .set({
        margin: 0.5,
        filename: "MyResume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
      })
      .from(target)
      .save()
      .then(() => {
        target.classList.remove("bw-print", "pdf-compact");
      });
  }, 500);
}

function get(id) {
  return document.getElementById(id).value || "";
}

function getLink(id, label = "") {
  const url = document.getElementById(id).value.trim();
  if (!url) return "";
  const display = label || url;
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${display}</a>`;
}

function formatLink(url, label = "") {
  if (!url) return "";
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function listify(text) {
  if (!text) return "";
  return text
    .split("*")
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => `<li>${item}</li>`)
    .join("");
}
