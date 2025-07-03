/* ==========================================================================
   AI Deadlines Interactive Scripts
   ========================================================================== */

$(document).ready(function () {
    $('#category-select').on('change', function () {
      const selected = $(this).val();

      $('#deadline-body tr').each(function () {
        const rowCategory = $(this).data('category');

        if (selected === 'all' || rowCategory === selected) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
  });