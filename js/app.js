(function() {
  'use strict';

  const movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  // ADD YOUR CODE HERE
  $('.btn-large').on('click', (event) => {
    event.preventDefault();
    let scrText = $('#search').val();
    $('#search').val('');
    var $xhr = $.getJSON(`https://omdb-api.now.sh/?s=${scrText}`);

    $xhr.done(function(data) {
      if ($xhr.status !== 200) {
          return;
      }
      for (let movie of data.Search) {
        let obj = {};
        obj.title = movie.Title;
        obj.poster = movie.Poster;
        obj.id = movie.imdbID;
        obj.year = movie.Year;

        console.log(" start processing ", obj.title, "(", obj.id, ")");
        let $plotData = $.getJSON(`http://www.omdbapi.com/?apikey=31c7676c&i=${obj.id}`);
        $plotData.done(function(data1) {
          if ($plotData.status !== 200) {
            return;
          }
          obj.plot = data1.Plot;
          movies.push(obj);
          renderMovies();
        })
      }
    });
  })
})();
