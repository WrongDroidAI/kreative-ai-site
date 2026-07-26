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
const workflowFigure = document.querySelector(".workflow-figure");
const workflowImage = document.querySelector(".workflow-figure img");
const workflowVideoSource = "assets/workflow-hover-video.mp4?v=workflow-2";

const kreativeProfile = {
  name: "Kreative AI Your AI",
  focus:
    "A personal, proactive AI that learns how each customer thinks, grows with their goals, and helps them use AI to improve and stay relevant.",
  proof:
    "26 years of photography experience, photography for Volkswagen and Coca-Cola, DriverGear catalog design, and video production.",
  contact:
    "Use the Contact Us form to start a conversation about Kreative AI Your AI, availability, and next steps.",
  dataNeeded: [
    "Preferred contact email, phone, calendar link, and service area",
    "Final onboarding flow and early-access availability",
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
    keywords: ["your ai", "my ai", "personal ai", "main product", "remember", "memory"],
    response:
      "Kreative AI Your AI is a personal AI built around one customer. It begins with a thoughtful interview, learns the customer's goals and preferences, remembers what matters, and becomes more useful over time."
  },
  {
    keywords: ["proactive", "reach out", "notification", "email", "text", "sms", "phone", "voice"],
    response:
      "With permission, Your AI can stay active while the customer is away and reach out through the app, email, notifications, text messages, or clearly identified AI voice calls. The customer controls channels, frequency, topics, quiet hours, and opt-out."
  },
  {
    keywords: ["privacy", "private", "secure", "data", "training", "control"],
    response:
      "Your information belongs to you. The product is being designed to protect customer information, never sell it, never use it to train shared AI models, and never share it without permission. Customers also control what the AI remembers and how it reaches them."
  },
  {
    keywords: ["what do you do", "learn", "teach", "class", "session"],
    response:
      "Kreative AI helps with AI graphics, AI video, vibe coding, teaching, branding, and visual storytelling. The work is grounded in 26 years of photography experience, commercial brand work, catalog design, and video production."
  },
  {
    keywords: ["visitor guide", "guide me", "where should i start"],
    response:
      "Start with Your AI for the product promise, How It Works for the relationship, Your Control for privacy and outreach choices, then Contact Us to begin a conversation."
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
      kreativeProfile.contact
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
  if (!chatMessages) return;

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

  return "Great question. I can answer best about Kreative AI Your AI, how it learns, proactive support, privacy controls, creative AI work, tools, and contacting the team.";
}

function askAgent(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;

  addMessage(cleanQuestion, "user");
  window.setTimeout(() => {
    addMessage(getAgentResponse(cleanQuestion));
  }, 280);
}

if (chatForm && chatInput) {
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    askAgent(chatInput.value);
    chatInput.value = "";
  });
}

quickPrompts.forEach((button) => {
  button.addEventListener("click", () => {
    askAgent(button.dataset.question);
  });
});

if (agentModes.length) {
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
}

function getWorkflowTargetRect(image) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const maxWidth = Math.min(window.innerWidth * 0.96, 1800);
  const maxHeight = window.innerHeight * 0.88;
  let width = maxWidth;
  let height = width / imageRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * imageRatio;
  }

  return {
    height,
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width
  };
}

function animateWorkflowImage() {
  if (!workflowFigure || !workflowImage || workflowFigure.classList.contains("is-zooming")) return;

  const start = workflowImage.getBoundingClientRect();
  const target = getWorkflowTargetRect(workflowImage);
  const backdrop = document.createElement("div");
  const clone = document.createElement("video");
  let isClosing = false;

  backdrop.className = "workflow-zoom-backdrop";
  clone.className = "workflow-zoom-clone";
  clone.src = workflowVideoSource;
  clone.autoplay = true;
  clone.muted = true;
  clone.loop = true;
  clone.playsInline = true;

  Object.assign(clone.style, {
    height: `${start.height}px`,
    left: `${start.left}px`,
    top: `${start.top}px`,
    width: `${start.width}px`
  });

  document.body.append(backdrop, clone);
  workflowFigure.classList.add("is-zooming");
  clone.play().catch(() => {});

  backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 180,
    easing: "ease-out",
    fill: "forwards"
  });

  clone.animate(
    [
      {
        height: `${start.height}px`,
        left: `${start.left}px`,
        top: `${start.top}px`,
        width: `${start.width}px`
      },
      {
        height: `${target.height}px`,
        left: `${target.left}px`,
        top: `${target.top}px`,
        width: `${target.width}px`
      }
    ],
    {
      duration: 360,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "forwards"
    }
  );

  function closeWorkflowImage() {
    if (isClosing) return;
    isClosing = true;

    backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 160,
      easing: "ease-in",
      fill: "forwards"
    });

    const closeAnimation = clone.animate(
      [
        {
          height: `${target.height}px`,
          left: `${target.left}px`,
          top: `${target.top}px`,
          width: `${target.width}px`
        },
        {
          height: `${start.height}px`,
          left: `${start.left}px`,
          top: `${start.top}px`,
          width: `${start.width}px`
        }
      ],
      {
        duration: 230,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        fill: "forwards"
      }
    );

    closeAnimation.onfinish = () => {
      clone.pause();
      backdrop.remove();
      clone.remove();
      workflowFigure.classList.remove("is-zooming");
    };
  }

  clone.addEventListener("mouseleave", closeWorkflowImage);
  clone.addEventListener("click", closeWorkflowImage);
  backdrop.addEventListener("click", closeWorkflowImage);
}

if (workflowFigure && workflowImage) {
  workflowImage.addEventListener("mouseenter", animateWorkflowImage);
}

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

if (chatMessages) {
  addMessage("Hi, I'm the Kreative AI helper. Ask me about Your AI, how it learns, proactive support, privacy controls, or how to contact us.");
}
