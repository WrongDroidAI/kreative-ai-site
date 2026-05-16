const chatMessages = document.querySelector("#chatMessages");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const bookingForm = document.querySelector("#bookingForm");
const bookingStatus = document.querySelector("#bookingStatus");
const quickPrompts = document.querySelectorAll("[data-question]");
const agentModes = document.querySelectorAll("[data-mode]");
const toolTabs = document.querySelectorAll("[data-tool-panel]");
const toolPanels = document.querySelectorAll(".tool-panel");
const toolSelect = document.querySelector("#toolSelect");
const toolDetail = document.querySelector("#toolDetail");

const kreativeProfile = {
  name: "Kreative AI",
  focus:
    "AI graphics, AI video, vibe coding, teaching, branding, and visual storytelling.",
  proof:
    "26 years of photography experience, photography for Volkswagen and Coca-Cola, DriverGear catalog design, and video production.",
  contact:
    "Use the contact form for now. Add your preferred email, phone, calendar link, and follow-up rules to make this a live booking agent.",
  dataNeeded: [
    "Preferred contact email, phone, calendar link, and service area",
    "Exact service names, package names, workshop formats, and pricing language",
    "Appointment length, availability rules, cancellation language, and follow-up process",
    "Final tool list, including which tools you teach, consult on, or use for production",
    "Portfolio links, case studies, approved client examples, and sample descriptions",
    "Preferred answer style for the agent: casual, corporate, technical, beginner-friendly, or sales-focused"
  ]
};

const toolLibrary = [
  {
    name: "ChatGPT",
    category: "LLM",
    use:
      "Strategy, ideation, writing, prompt refinement, research synthesis, teaching plans, and code collaboration.",
    sample:
      "A brand prompt system, workshop outline, campaign concept map, FAQ agent, or internal workflow assistant."
  },
  {
    name: "Claude",
    category: "LLM",
    use:
      "Long-form reasoning, content structure, document analysis, coding support, and careful critique of creative work.",
    sample:
      "A creative brief analyzer, landing-page rewrite, tool comparison, or coding partner for a prototype."
  },
  {
    name: "Nano-Banana",
    category: "AI graphics",
    use:
      "This week's image generation lane for fast visual exploration, campaign roughs, and style testing.",
    sample:
      "Before-and-after prompt revisions showing how lighting, camera angle, mood, and brand language improve output."
  },
  {
    name: "Chat Image 2",
    category: "AI graphics",
    use:
      "Conversational image generation and revision, useful for teaching prompt iteration and creative direction.",
    sample:
      "A prompt conversation that turns a rough idea into a finished visual direction."
  },
  {
    name: "Runway",
    category: "AI video",
    use:
      "AI video generation, motion concepts, scene tests, social video, and storyboard-to-motion workflows.",
    sample:
      "A storyboard, prompt sheet, generated clips, and notes on pacing, camera movement, and continuity."
  },
  {
    name: "SeaDance 2.0",
    category: "AI video",
    use:
      "This week's motion tool for AI video generation, image-to-video tests, and visual continuity experiments.",
    sample:
      "A prompt-to-motion breakdown for a branded short or product story."
  },
  {
    name: "Kling",
    category: "AI video",
    use:
      "Cinematic movement, image-to-video tests, character motion, and visual storytelling sequences.",
    sample:
      "A scene progression showing how still images become a cohesive moving story."
  },
  {
    name: "Veo3",
    category: "AI video",
    use:
      "High-level AI video concepting, scene generation, cinematic tests, and video storytelling exploration.",
    sample:
      "A short scene test with notes on prompt, camera move, subject action, and story purpose."
  },
  {
    name: "LLMs",
    category: "Planning and prompting",
    use:
      "Language models for strategy, prompt design, content planning, teaching, critique, coding support, and workflow thinking.",
    sample:
      "A reusable prompt system that turns brand, audience, goal, and channel inputs into creative direction."
  },
  {
    name: "PINOKIO",
    category: "Local AI tools",
    use:
      "Local AI tool management and experimentation, useful for testing creative AI workflows beyond hosted web tools.",
    sample:
      "A local workflow demo showing how a tool is installed, tested, evaluated, and folded into production."
  },
  {
    name: "Photoshop",
    category: "Post-production",
    use:
      "Image cleanup, compositing, retouching, color correction, layout prep, and finishing AI-generated assets.",
    sample:
      "AI image cleanup with notes on what was generated, corrected, extended, or composited."
  },
  {
    name: "Canva",
    category: "Design",
    use:
      "Fast layouts, social posts, decks, teaching materials, brand kits, and client-friendly design handoffs.",
    sample:
      "A reusable brand/social template set built from AI-generated visuals and campaign copy."
  },
  {
    name: "HTML, CSS, JavaScript",
    category: "Vibe coding",
    use:
      "Landing pages, interactive prototypes, prompt tools, AI helper interfaces, forms, and lightweight apps.",
    sample:
      "A working web prototype like this site, a prompt generator, or a visual-brief builder."
  },
  {
    name: "Python",
    category: "Automation",
    use:
      "Data cleanup, asset organization, batch workflows, file processing, and AI-assisted production tasks.",
    sample:
      "An automation that organizes image prompts, filenames, metadata, or production notes."
  },
  {
    name: "APIs and CMS workflows",
    category: "Systems",
    use:
      "Connecting forms, content systems, AI outputs, personalization logic, and repeatable creative pipelines.",
    sample:
      "A content workflow showing how prompts, assets, review criteria, and publishing handoffs connect."
  }
];

const answers = [
  {
    keywords: ["what do you do", "learn", "teach", "class", "session"],
    response:
      "Kreative AI helps with AI graphics, AI video, vibe coding, teaching, branding, and visual storytelling. The work is grounded in 26 years of photography experience, commercial brand work, catalog design, and video production."
  },
  {
    keywords: ["visitor guide", "guide me", "where should i start"],
    response:
      "Start with What I Do for the big picture, Tools for the platforms and workflows, Proof for sample categories, then Contact if you want a project, lesson, or creative system built."
  },
  {
    keywords: ["tools", "tool", "recommend", "chatgpt", "claude", "nano-banana", "nano banana", "chat image", "seadance", "sea dance", "veo3", "runway", "kling", "llm", "pinokio", "photoshop", "canva"],
    response: () =>
      `The current tool set includes ${toolLibrary.map((tool) => tool.name).join(", ")}. Use the dropdown above for details, and tell me which tools should be added or removed.`
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
    response: () =>
      `${kreativeProfile.contact} I still need the final booking link, appointment length, available days, and the exact message you want people to receive after they request a session.`
  },
  {
    keywords: ["data", "dataset", "information", "need", "missing", "agent"],
    response: () =>
      `To answer accurately, I need: ${kreativeProfile.dataNeeded.join("; ")}.`
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
  const directTool = toolLibrary.find((tool) => normalized.includes(tool.name.toLowerCase()));

  if (directTool) {
    return `${directTool.name}: ${directTool.use} A strong sample would be: ${directTool.sample}`;
  }

  const match = answers.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  if (match) {
    return typeof match.response === "function" ? match.response() : match.response;
  }

  return "Great question. I can answer best about AI graphics, video, coding, teaching, branding, tools, portfolio samples, and booking. If you want this live agent to answer that topic accurately, add the approved fact, link, or policy to the site knowledge base.";
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

agentModes.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.mode;
    const modePrompts = {
      guide: "Give me the visitor guide.",
      tool: "Recommend which AI tool I should use.",
      booking: "Can you help me book?",
      portfolio: "What samples should I add?"
    };

    agentModes.forEach((modeButton) => modeButton.classList.remove("is-active"));
    button.classList.add("is-active");
    askAgent(modePrompts[mode]);
  });
});

function renderToolDetail(toolName) {
  const selectedTool = toolLibrary.find((tool) => tool.name === toolName);

  if (!selectedTool) {
    toolDetail.innerHTML = "<p>Select a tool to see the kind of work, prompts, and outcomes it supports.</p>";
    return;
  }

  toolDetail.innerHTML = `
    <span>${selectedTool.category}</span>
    <h3>${selectedTool.name}</h3>
    <p>${selectedTool.use}</p>
    <strong>Sample to show:</strong>
    <p>${selectedTool.sample}</p>
  `;
}

toolLibrary.forEach((tool) => {
  const option = document.createElement("option");
  option.value = tool.name;
  option.textContent = `${tool.name} - ${tool.category}`;
  toolSelect.appendChild(option);
});

toolSelect.addEventListener("change", () => {
  renderToolDetail(toolSelect.value);
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
