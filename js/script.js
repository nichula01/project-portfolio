// Navigation behavior, active states, and scroll reveals

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdown = dropdownToggle ? dropdownToggle.closest(".dropdown") : null;

  const closeDropdown = () => {
    if (dropdown && dropdown.classList.contains("open")) {
      dropdown.classList.remove("open");
      dropdownToggle.setAttribute("aria-expanded", "false");
    }
  };

  const closeMobileMenu = () => {
    if (navMenu && navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      if (navToggle) {
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    }
  };

  if (navMenu && !navMenu.id) {
    navMenu.id = "primary-navigation";
  }

  if (navToggle && navMenu) {
    navToggle.setAttribute("aria-controls", navMenu.id);
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (dropdown && dropdownToggle) {
    dropdownToggle.setAttribute("aria-haspopup", "true");
    dropdownToggle.setAttribute("aria-expanded", "false");
    dropdownToggle.addEventListener("click", (event) => {
      event.preventDefault();
      const isOpen = dropdown.classList.toggle("open");
      dropdownToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.addEventListener("click", (event) => {
    if (
      dropdown &&
      dropdownToggle &&
      !dropdown.contains(event.target) &&
      !dropdownToggle.contains(event.target)
    ) {
      closeDropdown();
    }

    if (
      navMenu &&
      navToggle &&
      !navMenu.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdown();
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });


  const navLinks = document.querySelectorAll(".nav-link");
  const currentPath =
    window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
      if (dropdown && dropdown.contains(link)) {
        closeDropdown();
      }
    });
  });

  const updateActiveNav = () => {
    const currentHash = window.location.hash;
    let hasActive = false;

    navLinks.forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");

      const href = link.getAttribute("href") || "";
      const [linkPath, linkHash] = href.split("#");

      if (linkPath === currentPath) {
        const hasMatchingHash =
          (linkHash && `#${linkHash}` === currentHash) ||
          (!linkHash && !currentHash);

        if (hasMatchingHash) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
          hasActive = true;
        }
      }
    });

    if (!hasActive && currentPath === "index.html") {
      const homeLink = document.querySelector('.nav-link[href="index.html"]');
      if (homeLink) {
        homeLink.classList.add("active");
        homeLink.setAttribute("aria-current", "page");
      }
    }
  };

  updateActiveNav();
  window.addEventListener("hashchange", updateActiveNav);

  if (currentPath.startsWith("week")) {
    const weeksToggle = document.querySelector(".dropdown-toggle");
    if (weeksToggle) {
      weeksToggle.classList.add("active");
    }
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  /* --- Satellite Scan & Parallax Animation --- */
  /* --- Antigravity Particle Network --- */
  const canvas = document.getElementById("antigravity-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth > 768 ? 100 : 50;
    const connectionDistance = 150;

    // Mouse state
    const mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
      // Relative to canvas position if needed, but for full screen fixed:
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2; // Slow speed
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 2 + 1;
        this.color = `rgba(0, 150, 136, ${Math.random() * 0.5 + 0.2})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction (repel)
        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (200 - distance) / 200;
            const directionX = forceDirectionX * force * 0.5;
            const directionY = forceDirectionY * force * 0.5;
            this.vx -= directionX;
            this.vy -= directionY;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Re-init particles to fit screen if needed, or just let them flow
    }
    window.addEventListener('resize', resize);

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.update();
        p.draw();

        // Connect particles
        for (let j = index; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 150, 136, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    }

    init();
    animate();
  }

  /* --- Week 1 Interactions --- */

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const triggers = document.querySelectorAll('.lightbox-trigger img'); // Select images inside triggers

    triggers.forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt || img.nextElementSibling?.textContent || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Esc key support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
  }

  // Code Block Copy & Collapse
  const codeWrappers = document.querySelectorAll('.code-block-wrapper');
  codeWrappers.forEach(wrapper => {
    const header = wrapper.querySelector('.code-header');
    const content = wrapper.querySelector('.code-content');
    const copyBtn = wrapper.querySelector('.copy-btn');

    // Collapse Logic (Click header excluding button)
    // Default open, click to toggle? Or default closed? User said "Collapsible code block area titled...".
    // Let's make it toggleable.
    header.style.cursor = 'pointer';
    header.addEventListener('click', (e) => {
      if (e.target.closest('.copy-btn')) return; // Ignore copy button click

      const isOpen = content.style.display !== 'none';
      content.style.display = isOpen ? 'none' : 'block';
      // Optional element to show state could be added here
    });

    // Copy Logic
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const codeText = content.querySelector('code').innerText;
        try {
          await navigator.clipboard.writeText(codeText);
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Copied!
          `;
          setTimeout(() => {
            copyBtn.innerHTML = originalText;
          }, 2000);
        } catch (err) {
          console.error('Failed to copy', err);
        }
      });
    }
  });

});
