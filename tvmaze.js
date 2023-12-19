"use strict";

const missingImageUrl = 'http://tinyurl.com/missing-tv';
const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

// async function getShowsByTerm( /* term */) {
//   // ADD: Remove placeholder & make request to TVMaze search shows API.

//   return [
//     {
//       id: 1767,
//       name: "The Bletchley Circle",
//       summary:
//         `<p><b>The Bletchley Circle</b> follows the journey of four ordinary 
//            women with extraordinary skills that helped to end World War II.</p>
//          <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their 
//            normal lives, modestly setting aside the part they played in 
//            producing crucial intelligence, which helped the Allies to victory 
//            and shortened the war. When Susan discovers a hidden code behind an
//            unsolved murder she is met by skepticism from the police. She 
//            quickly realises she can only begin to crack the murders and bring
//            the culprit to justice with her former friends.</p>`,
//       image:
//           "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
//     }
//   ]
// }

async function searchShows(query) {
  let response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  // console.log (response);
  let shows = response.data.map(result =>{
    let show = result.show;
    return  {
      id: show.id,
      name: show.name,
      summary: `${show.summary}`,
      image: show.image ? show.image.medium : missingImageUrl
    }
  })

  return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    let $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="card" data-show-id="${show.id}">
           <img 
              src=${show.image}
              alt= ${show.name} 
              class="card-img-top">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-primary getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }

}


// /** Handle search form submission: get shows from API and display.
//  *    Hide episodes area (that only gets shown if they ask for episodes)
//  */

// async function searchForShowAndDisplay() {
//   const term = $("#searchForm-term").val();
//   const shows = await getShowsByTerm(term);

//   $episodesArea.hide();
//   populateShows(shows);
// }

$searchForm.on("submit", async function handleSearch(evt) {
  evt.preventDefault();
  let query = $('#search-query').val();
  if(!query) return;
  $episodesArea.hide();
  let shows = await searchShows(query);
  populateShows(shows); 
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
async function getEpisodes(showid) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${showid}/episodes`);
  // console.log (show);
  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }))
  return episodes;
}

function populateEpisodes (episodes) {
  $('#episodes-list').empty();
  for(let episode of episodes) {
    const $episode =  $(
      `<li>
      ${episode.name}(season${episode.season},number${episode.number})
      </li>`
    )
    $('#episodes-list').append($episode);
  }
  $episodesArea.show();
}

$showsList.on('click', ".getEpisodes", async function handleEpisodeClick(e)  {
  // e.preventDefault();
  let showid = $(e.target).closest('.Show').data('show-id');
  console.log(showid);
  let episodes = await getEpisodes(showid);
  populateEpisodes(episodes);
})

