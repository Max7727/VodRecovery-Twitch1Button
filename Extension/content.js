(() => {
  const BUTTON_ID = "vodrec-inject-btn";
  let lastUrl = location.href;

  const SYSTEM_ROUTES = new Set([
    "directory", "downloads", "wallet", "settings",
    "subscriptions", "friends", "messages", "inventory",
    "drops", "videos", "moderator", "search"
  ]);

  function getChannelName() {
    const segments = window.location.pathname.split("/").filter(Boolean);
    if (!segments.length) return null;
    const candidate = segments[0].toLowerCase();
    return SYSTEM_ROUTES.has(candidate) ? null : candidate;
  }

  function createVodRecButton(channel) {
    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.setAttribute("title", `Record ${channel} via VodRecovery`);
    btn.setAttribute("aria-label", "VodRecovery Record");

    // Twitch-like purple button styling
    btn.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: #9146FF;
      color: #FFFFFF;
      font-weight: 600;
      font-size: 13px;
      height: 30px;
      padding: 0 10px;
      margin-left: 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.15s ease;
      vertical-align: middle;
      z-index: 9999;
    `;

    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 6px;">
        <circle cx="12" cy="12" r="8" fill="#FF4444" />
      </svg>
      <span>VodRec</span>
    `;

    btn.addEventListener("mouseenter", () => {
      btn.style.backgroundColor = "#772CE8";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.backgroundColor = "#9146FF";
    });

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Triggers your Windows batch script via the custom URI
      window.location.href = `vodrec://${channel}`;
    });

    return btn;
  }

  function tryMountButton() {
    const channel = getChannelName();
    const existing = document.getElementById(BUTTON_ID);

    if (!channel) {
      if (existing) existing.remove();
      return;
    }

    if (existing && existing.dataset.channel !== channel) {
      existing.remove();
    } else if (existing) {
      return;
    }

    // Try finding the channel buttons row (near Follow / Subscribe)
    const targetContainer =
      document.querySelector('[data-a-target="user-channel-header-actions"]') ||
      document.querySelector('div[data-target="channel-header-right"]') ||
      document.querySelector('[data-a-target="follow-button"]')?.parentElement;

    if (targetContainer) {
      const btn = createVodRecButton(channel);
      btn.dataset.channel = channel;
      targetContainer.appendChild(btn);
    }
  }

  // Handle Twitch page route updates without refreshing
  function checkUrlChange() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      tryMountButton();
    }
  }

  let timeoutId = null;
  const observer = new MutationObserver(() => {
    checkUrlChange();
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        tryMountButton();
      }, 250);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // First run
  tryMountButton();
})();