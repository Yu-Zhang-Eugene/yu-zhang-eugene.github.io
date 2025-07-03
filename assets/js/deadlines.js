/* ==========================================================================
   AI Deadlines Interactive Scripts
   ========================================================================== */

$(document).ready(function () {
    $('#category-select').on('change', function () {
      const selected = $(this).val();

      $('.conference').each(function () {
        const category = $(this).data('category');

        if (selected === 'all' || category === selected) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
  });