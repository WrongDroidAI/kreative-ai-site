const chatMessages = document.querySelector("#chatMessages");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const bookingForm = document.querySelector("#bookingForm");
const bookingStatus = document.querySelector("#bookingStatus");
const quickPrompts = document.querySelectorAll("[data-question]");
const toolTabs = document.querySelectorAll("[data-tool-panel]");
const toolPanels = document.querySelectorAll(".tool-panel");

const answers = [
  {
    keywords: ["what do you do", "learn", "teach", "class", "session"],
    response:
      "Kreative AI helps with AI graphics, AI video, vibe coding, teaching, branding, and visual storytelling. The work is grounded in 26 years of photography experience, commercial brand work, catalog design, and video production."
  },
  {
    keywords: ["tools", "chatgpt", "dall", "flux", "runway", "seedream", "seedance", "photoshop"],
    response:
      "The current tool set includes ChatGPT and LLMs, DALL-E, Flux, Seedream, Runway, Seedance, Photoshop-style post-production, HTML, CSS, JavaScript, Python, REST APIs, CMS thinking, and personalization workflows. What other tools should I add?"
  },
  {
    keywords: ["vibe", "coding", "app", "website", "prototype", "build"],
    response:
      "Vibe coding means describing what you want to build, working with an AI coding assistant, testing the result, and shaping it step by step. On this site it shows up as web prototypes, prompt utilities, AI helpers, and lightweight automation."
  },
  {
    keywords: ["image", "photo", "photography", "photoreal", "visual", "volkswagen", "coke", "cocacola", "coca-cola", "drivergear", "catalog", "video", "production", "generative", "content", "creative"],
    response:
      "The visual work is grounded in real production experience: 26 years of photography, photography for Volkswagen and Coca-Cola, DriverGear catalog design, and video production. That translates into AI direction through lighting, lens, focal length, aperture, depth of field, composition, subject direction, and brand consistency."
  },
  {
    keywords: ["sample", "portfolio", "case", "show", "proof"],
    response:
      "Strong samples to add: Volkswagen/DriverGear-style catalog work, Coca-Cola photography, a photoreal AI campaign set, AI video storyboard, vibe-coded tool, visual identity system, prompt library, and personalized asset system."
  },
  {
    keywords: ["api", "automation", "cms", "contentful", "braze", "personalized", "dynamic"],
    response:
      "The systems lane should show how prompts, audience data, asset variants, review criteria, naming, and channel handoff can become a repeatable creative pipeline."
  },
  {
    keywords: ["book", "appointment", "schedule", "call", "meet"],
    response:
      "Use the form below to start a project, request a session, or tell me which AI tools and sample types should be added to the site."
  },
  {
    keywords: ["beginner", "new", "start", "scared", "confused"],
    response:
      "Beginners are welcome. The sessions are built around plain language, hands-on examples, and real tasks so AI feels usable instead of overwhelming."
  }
];

function addMessage(text, sender = "agent") {
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAgentResponse(question) {
  const normalized = question.toLowerCase();
  const match = answers.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  if (match) {
    return match.response;
  }

  return "Great question. Kreative AI focuses on AI graphics, video, coding, teaching, branding, and visual storytelling. If there is a tool or sample you want represented, tell me its name and what you use it for.";
}

function askAgent(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;

  addMessage(cleanQuestion, "user");
  window.setTimeout(() => {
    addMessage(getAgentResponse(cleanQuestion));
  }, 280);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  askAgent(chatInput.value);
  chatInput.value = "";
});

quickPrompts.forEach((button) => {
  button.addEventListener("click", () => {
    askAgent(button.dataset.question);
  });
});

toolTabs.forEach((button) => {
  button.addEventListener("click", () => {
    const panelId = `tool-${button.dataset.toolPanel}`;

    toolTabs.forEach((tab) => tab.classList.remove("is-active"));
    toolPanels.forEach((panel) => panel.classList.remove("is-active"));

    button.classList.add("is-active");
    document.querySelector(`#${panelId}`).classList.add("is-active");
  });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const appointment = Object.fromEntries(formData.entries());
  appointment.requestedAt = new Date().toISOString();

  const savedAppointments = JSON.parse(localStorage.getItem("kreativeAppointments") || "[]");
  savedAppointments.push(appointment);
  localStorage.setItem("kreativeAppointments", JSON.stringify(savedAppointments));

  bookingStatus.textContent = `Thanks, ${appointment.name}. Your ${appointment.session.toLowerCase()} request is saved.`;
  bookingForm.reset();
  addMessage("I saved your request. A live version can send this to email, CRM, calendar, CMS, or an automation workflow.");
});

addMessage("Hi, I'm the Kreative AI helper. Ask me about AI graphics, video, coding, teaching, branding, tools, samples, or what to add next.");
