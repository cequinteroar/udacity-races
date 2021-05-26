// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
let store = {
	track_id: undefined,
	player_id: undefined,
	race_id: undefined
}

const updateStore = (store, newState) => {
	store = Object.assign(store, newState)
}

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
	onPageLoad()
	setupClickHandlers()
})

async function onPageLoad() {
	try {
		getTracks()
			.then(tracks => {
				const html = renderTrackCards(tracks)
				renderAt('#tracks', html)
			});

		getRacers()
			.then((racers) => {
				const html = renderRacerCars(racers)
				renderAt('#racers', html)
			});
	} catch (error) {
		console.log("Problem getting tracks and racers ::", error.message)
		console.error(error)
	}
}

function setupClickHandlers() {
	document.addEventListener('click', function (event) {
		const { target } = event

		// Race track form field
		if (target.matches('.card.track')) {
			if (!target.id) {
				handleSelectTrack(target.parentElement);
			} else {
				handleSelectTrack(target);
			}
		}

		// Podracer form field
		if (target.matches('.card.podracer')) {
			if (!target.id) {
				handleSelectPodRacer(target.parentElement);
			} else {
				handleSelectPodRacer(target);
			}
		}

		// Submit create race form
		if (target.matches('#submit-create-race')) {
			event.preventDefault()

			// start race
			handleCreateRace()
		}

		// Handle acceleration click
		if (target.matches('#gas-peddle') || target.matches('.fa-running')) {
			handleAccelerate(target)
		}

	}, false)
}

async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch (error) {
		console.log("an error shouldn't be possible here")
		console.log(error)
	}
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
	try {

		// Get player_id and track_id from the store
		const player_id = store.player_id;
		const track_id = store.track_id;

		// Invoke the API call to create the race, then save the result
		const race = await createRace(player_id, track_id);

		// Update the store with the race id
		updateStore(store, { race_id: race.ID })


		// render starting UI
		renderAt('#race', renderRaceStartView(race.Track, race.racers))

		//	Countdown function
		await runCountdown();

		//	Race functions
		await startRace(store.race_id - 1)
		await runRace(store.race_id - 1)

	} catch (err) {
		console.log(err)
	}
}

function runRace(raceID) {
	return new Promise(resolve => {
		// SetInterval method to get race info every 500ms
		const raceInterval = setInterval(() => {
			getRace(raceID).then(data => {
				if (data.status === "in-progress") {
					renderAt('#leaderBoard', raceProgress(data.positions))
				}

				console.log(data);

				if (data.status === "finished") {
					renderAt('#race', resultsView(data.positions)) // to render the results view
					clearInterval(raceInterval) // to stop the interval from repeating
					resolve(data); // resolve the promise
				}
			})
				.catch(error => console.log("error while getting race: ", error))
		}, 500);
	}).catch(error => console.log("Error while running the race", error));
}

async function runCountdown() {
	try {
		// wait for the DOM to load
		await delay(1000)
		let timer = 3;

		return new Promise(resolve => {
			// SetInterval method to count down once per second
			const countdownInterval = setInterval(() => {
				// run this DOM manipulation to decrement the countdown for the user
				document.getElementById('big-numbers').innerHTML = --timer


				// If the countdown is done, clear the interval, resolve the promise, and return
				if (timer <= 0) {
					clearInterval(countdownInterval);
					updateStore(store, {started: true});
					resolve();
				}
			}, 1000)
			return resolve;
		})
	} catch (error) {
		console.log(error);
	}
}

function handleSelectPodRacer(target) {
	console.log("selected a pod", target.id)

	// remove class selected from all racer options
	const selected = document.querySelector('#racers .selected')
	if (selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// Save the selected racer to the store
	updateStore(store, { player_id: target.id })
}

function handleSelectTrack(target) {
	console.log("selected a track", target.id)

	// remove class selected from all track options
	const selected = document.querySelector('#tracks .selected')
	if (selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// Save the selected track id to the store
	updateStore(store, { track_id: target.id })

}

function handleAccelerate() {
	console.log("accelerate button clicked");
	accelerate(store.race_id - 1);
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')

	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function selectImg(name) {
	let url = "";
	switch (name) {
		case "Hatake Kakashi":
			url = "kakashi.png";
			break;
		case "Naruto Uzumaki":
			url = "naruto.png";
			break;
		case "Sasuke Uchiha":
			url = "sasuke.png";
			break;
		case "Hinata Hyuga":
			url = "hinata.png";
			break;
		case "Rock Lee":
			url = "lee.png";
			break;
		default:
			url=''
	}
	return url;
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer;

	const imgUrl = selectImg(driver_name);

	return `
		<li class="card podracer" id="${id}">
			<img class="card podracer" src="../assets/pictures/${imgUrl}" alt="${driver_name}" />
			<p class="card podracer"><i class="fas fa-tachometer-alt"></i> ${top_speed}</p>
			<p class="card podracer"><i class="fas fa-angle-double-up"></i>	 ${acceleration}</p>
			<p class="card podracer"><i class="fas fa-fist-raised"></i> ${handling}</p>
		</li>
	`
}

function renderTrackCards(tracks) {
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')

	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {
	const { id, name } = track

	return `
		<li id="${id}" class="card track">
			<img class="card track" src="../assets/pictures/${name}.jpg" alt="${name}" />
		</li>
	`
}

function renderCountdown(count) {
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(track, racers) {
	return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the running ninja to win!</p>
				<button id="gas-peddle"><i class="fas fa-running"></i></button>
			</section>
		</main>
		<footer></footer>
	`
}

function resultsView(positions) {
	positions.sort((a, b) => (a.final_position > b.final_position) ? 1 : -1)

	return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`
}

function raceProgress(positions) {
	let userPlayer = positions.find(e => e.id === parseInt(store.player_id));
	userPlayer.driver_name += " (you)"

	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
	let count = 1

	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`
	});

	return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`
}

function renderAt(element, html) {
	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:8000'

function defaultFetchOpts() {
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': SERVER,
		},
	}
}

// API: FETCHING race info

function getTracks() {
	// GET request to `${SERVER}/api/tracks`	
	return fetch(`${SERVER}/api/tracks`)
		.then(res => res.json())
		.catch(err => console.log("Problem with tracks retrieval request::", err));
}

function getRacers() {
	// GET request to `${SERVER}/api/cars`
	return fetch(`${SERVER}/api/cars`)
		.then(res => res.json())
		.catch(err => console.log("Problem with racers retrieval request::", err));
}

function createRace(player_id, track_id) {
	player_id = parseInt(player_id)
	track_id = parseInt(track_id)
	const body = { player_id, track_id }

	return fetch(`${SERVER}/api/races`, {
		method: 'POST',
		...defaultFetchOpts(),
		dataType: 'jsonp',
		body: JSON.stringify(body)
	})
		.then(res => res.json())
		.catch(err => console.log("Problem with createRace request::", err))
}

function getRace(id) {
	// GET request to `${SERVER}/api/races/${id}`	
	return fetch(`${SERVER}/api/races/${id}`)
		.then(res => res.json())
		.catch(err => console.log("Problem with getRace request::", err))
}

function startRace(id) {
	return fetch(`${SERVER}/api/races/${id}/start`, {
		method: 'POST',
		...defaultFetchOpts(),
	})
		.then(res => res.json())
		.catch(err => console.log("Problem with getRace request::", err))
}

function accelerate(id) {
	// POST request to `${SERVER}/api/races/${id}/accelerate`
	// options parameter provided as defaultFetchOpts
	// no body or datatype needed for this request
	return fetch(`${SERVER}/api/races/${id}/accelerate`, {
		method: 'POST',
		...defaultFetchOpts(),
	})
		.then(res => res.text()).then(console.log)
		.catch(err => console.log("Problem with acceleration request::", err))
}
