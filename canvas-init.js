// Initialize Canvas Animations
document.addEventListener('DOMContentLoaded', function() {
  // Neural network visuals removed per user request.

  // Initialize Matrix Rain Animation on matrixCanvas
  if (typeof MatrixRainAnimation !== 'undefined') {
    try {
      new MatrixRainAnimation('matrixCanvas');
    } catch (e) {
      console.log('Matrix animation not available');
    }
  }

  // Initialize Particle System Animation on particleCanvas
  if (typeof ParticleSystemAnimation !== 'undefined') {
    try {
      new ParticleSystemAnimation('particleCanvas');
    } catch (e) {
      console.log('Particle animation not available');
    }
  }

  // Mouse Trail Effect
  const mouseTrail = document.getElementById('mouseTrail');
  if (mouseTrail) {
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update trail position smoothly
      const dx = mouseX - trailX;
      const dy = mouseY - trailY;
      trailX += dx * 0.3;
      trailY += dy * 0.3;

      mouseTrail.style.left = trailX + 'px';
      mouseTrail.style.top = trailY + 'px';
      mouseTrail.style.opacity = '0.7';
    });

    document.addEventListener('mouseleave', function() {
      mouseTrail.style.opacity = '0';
    });
  }

  // Scroll Progress Bar
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', function() {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      scrollProgress.style.width = scrollPercentage + '%';
    });
  }
});
