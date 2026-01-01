// Main JavaScript for portfolio website

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initMobileMenu();
  initSmoothScrolling();
  initIntersectionObserver();
  
  // Load projects if on home page
  if (document.getElementById('projects-grid')) {
    loadProjects();
  }
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('hidden');
  });

  // Close mobile menu when a link is clicked
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just "#"
      if (href === '#') return;
      
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        e.preventDefault();
        const navHeight = 64; // Height of fixed nav
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Intersection Observer for Fade-in Animations
 */
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all fade-in sections
  document.querySelectorAll('.fade-in-section').forEach(section => {
    observer.observe(section);
  });
}

/**
 * Load and Render Projects
 */
async function loadProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  try {
    // Fetch projects with cache-busting
    const response = await fetch(`/data/projects.json?v=${Date.now()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const projects = await response.json();
    
    if (!Array.isArray(projects) || projects.length === 0) {
      throw new Error('No projects found');
    }

    // Clear container
    container.innerHTML = '';
    
    // Render each project card
    projects.forEach((project, index) => {
      const card = createProjectCard(project);
      container.appendChild(card);
      
      // Add fade-in observer to cards
      setTimeout(() => {
        card.classList.add('fade-in-section');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('fade-in');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
        
        observer.observe(card);
      }, index * 50); // Stagger the animation slightly
    });
    
  } catch (error) {
    console.error('Error loading projects:', error);
    container.innerHTML = `
      <div class="col-span-full">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-red-900 mb-2">Unable to Load Projects</h3>
          <p class="text-red-700">There was an error loading the projects. Please try again later.</p>
        </div>
      </div>
    `;
  }
}

/**
 * Create Project Card Element
 */
function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 card-hover';
  
  // Limit technologies shown to 3, with "+N more" indicator
  const techToShow = project.technologies ? project.technologies.slice(0, 3) : [];
  const remainingTech = project.technologies ? project.technologies.length - 3 : 0;
  
  card.innerHTML = `
    <!-- Image Container with Gradient -->
    <div class="relative h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
      ${project.image ? `
        <img 
          src="${project.image}" 
          alt="${project.title}" 
          class="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
          onerror="this.style.display='none'"
        />
      ` : ''}
      
      <!-- Year Badge -->
      ${project.year ? `
        <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
          ${project.year}
        </div>
      ` : ''}
    </div>
    
    <!-- Card Content -->
    <div class="p-6">
      <!-- Category -->
      ${project.category ? `
        <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-3">
          ${project.category}
        </span>
      ` : ''}
      
      <!-- Title -->
      <h3 class="text-xl font-bold font-grotesk text-gray-900 mb-2">
        ${project.title}
      </h3>
      
      <!-- Short Description -->
      ${project.shortDescription ? `
        <p class="text-gray-600 mb-4 line-clamp-3">
          ${project.shortDescription}
        </p>
      ` : ''}
      
      <!-- Technologies -->
      ${project.technologies && project.technologies.length > 0 ? `
        <div class="flex flex-wrap gap-2 mb-4">
          ${techToShow.map(tech => `
            <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              ${tech}
            </span>
          `).join('')}
          ${remainingTech > 0 ? `
            <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +${remainingTech} more
            </span>
          ` : ''}
        </div>
      ` : ''}
      
      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2 mt-4">
        <a 
          href="/project/${project.slug}" 
          class="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          View Details
        </a>
        ${project.liveUrl ? `
          <a 
            href="${project.liveUrl}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            title="View live site"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ` : ''}
      </div>
    </div>
  `;
  
  return card;
}
