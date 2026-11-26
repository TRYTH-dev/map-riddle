document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('google-signin-btn');
  const spinner = document.getElementById('loading-spinner');

  if (btn) {
    btn.addEventListener('click', function() {
      if (spinner) {
        spinner.classList.remove('hidden');
      }
      btn.classList.add('opacity-90', 'pointer-events-none');
      
      setTimeout(function() {
        if (spinner) {
          spinner.classList.add('hidden');
        }
        btn.classList.remove('opacity-90', 'pointer-events-none');
      }, 1600);
    });
  }
});