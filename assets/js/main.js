const blankText = '\u00A0';
var answers = [];

function initialisePage() {
	var numSlots = 6;
	initialiseSlots(numSlots);
	answers = retrieveAnswers();
}

function retrieveAnswers() {
	const exampleAnswers = [
		['why', 'i', 'never', 'scam', 'the', 'rich'],
		['i', 'accidentally', 'ruined', 'the', 'biggest', 'prank'],
		['we', 'pretend', 'every', 'mistake', 'is', 'real'],
		['we', 'finally', 'ruined', 'every', 'expensive', 'scam'],
		['every', 'prank', 'we', 'pretend', 'is', 'real'],
		['this', 'is', 'why', 'you', 'only', 'survive'],
		['we', 'rate', 'the', 'biggest', 'illegal', 'prank']
	];
	
	selectedAnswers = exampleAnswers[Math.floor(Math.random() * exampleAnswers.length)];
	console.log(selectedAnswers);
	return selectedAnswers;
}

function slotAnimationStart(event) {
	const slots = getSlots();
	
	 // Find the next slot to animate
	let nextSlotIdx = slots.indexOf(event.target) + 1;
	while (nextSlotIdx < slots.length && slots[nextSlotIdx].classList.contains('fixed')) {
		nextSlotIdx++;
	}
	
	if (nextSlotIdx < slots.length) {
		setTimeout(() => slots[nextSlotIdx].classList.add('animateFlip'), 200);
	} else {
		// Last slot has been animated, do follow up
		setTimeout(startNextRound, 1000);
	}
}

function startNextRound() {
	const slots = getSlots();
	const boardContainer = document.getElementById('boardContainer');
	
	const historyRow = document.createElement('div');
	historyRow.classList.add('historyRow');
	boardContainer.appendChild(historyRow);
	
	for (const slot of slots) {
		const backElement = slot.getElementsByClassName('back')[0];
		
		// Animate correct options
		if (backElement.classList.contains('correct') && !slot.classList.contains('fixed')) {
			slot.classList.add('fixed');
			slot.classList.add('roundTransition');
			backElement.classList.add('fixed');
			backElement.classList.add('roundTransition');
			setTimeout(() => {
				slot.classList.remove('roundTransition');
				backElement.classList.remove('roundTransition');
			}, 800);
		}
		
		// Populate the history board
		
		const historyToken = document.createElement('div');
		historyToken.classList.add('token');
		historyToken.textContent = getSlotText(slot);
		if (backElement.classList.contains('correct')) historyToken.classList.add('correct');
		if (backElement.classList.contains('semiCorrect')) historyToken.classList.add('semiCorrect');
		if (backElement.classList.contains('wrong')) historyToken.classList.add('wrong');
		historyRow.appendChild(historyToken);
	}
	
	clearSlots();
	enableButtons();
}

function initialiseSlots(numSlots) {
	const headlineContainer = document.getElementById('headlineContainer');
	
	const clearButton = document.createElement('button');
	clearButton.id = 'clearButton';
	clearButton.classList.add('clearButton');
	clearButton.addEventListener('click', clearSlots);
	headlineContainer.appendChild(clearButton);
	
	for (let i=0; i<numSlots; i++) {
		// HTML structure:
		// <div class="slot">					<!-- Main container that flex grows -->
		//   <span>Text</span>					<!-- Contains transparent text for autosizing container -->
		//   <div class="front">				<!-- Face with position: absolute -->
		//     <span class="inner">Text</span>	<!-- Span containing actual displayed text -->
		//   </div>
		//   <div class="back">
		//     <span class="inner">Text</span>
		//   </div>
		// </div>
		
		const slotElement = document.createElement('div');
		slotElement.classList.add('slot');
		slotElement.addEventListener('animationstart', slotAnimationStart);
		headlineContainer.appendChild(slotElement);
		
		const slotSpan = document.createElement('span');
		slotSpan.textContent = blankText;
		slotElement.appendChild(slotSpan);
		
		const frontElement = document.createElement('div');
		frontElement.classList.add('front');
		slotElement.appendChild(frontElement);
		
		const frontSpan = document.createElement('span');
		frontSpan.classList.add('inner');
		frontSpan.textContent = blankText;
		frontElement.appendChild(frontSpan);
		
		const backElement = document.createElement('div');
		backElement.classList.add('back');
		slotElement.appendChild(backElement);
		
		const backSpan = document.createElement('span');
		backSpan.classList.add('inner');
		backSpan.textContent = blankText;
		backElement.appendChild(backSpan);
	}
	
	const enterButton = document.createElement('button');
	enterButton.id = 'enterButton';
	enterButton.classList.add('enterButton');
	enterButton.addEventListener('click', submitAnswer);
	headlineContainer.appendChild(enterButton);
}

function getSlots() {
	const headlineContainer = document.getElementById('headlineContainer');
	const childElements = Array.from(headlineContainer.children);
	return childElements.filter(el => el.classList.contains('slot'));
}

function getNextEmptySlot() {
	// Gets the next empty `slot` element in left-to-right order;
	// Returns -1 if all slots are non-empty
	const slots = getSlots();
	for (const slot of slots) {
		if (getSlotText(slot) === blankText) return slot;
	}
	
	return -1;
}

function getSlotText(slot) {
	const spans = slot.getElementsByTagName('span');
	if (spans.length > 0) {
		return spans[0].textContent;
	} else {
		return null;
	}
}

function getSlotBack(slot) {
	return slot.getElementsByClassName('back')[0];
}

function updateSlotText(slot, text) {
	// Update text in all the slot spans
	const slotSpans = slot.getElementsByTagName('span');
	for (const span of slotSpans) {
		span.textContent = text;
	}
}
	
function selectToken(token) {
	const nextSlot = getNextEmptySlot();
	if (nextSlot === -1) return; // No empty slots
	
	// Hide the token option
	token.style.display = 'none';
	
	updateSlotText(nextSlot, token.textContent.toUpperCase())
	nextSlot.token = token;
	nextSlot.classList.add('filled');
	nextSlot.addEventListener('click', removeTokenOnClick);
	
	if (token.classList.contains('semiCorrect')) nextSlot.classList.add('semiCorrectTint');
}

function findAncestorWithClass(element, className) {
	let parent = element.parentElement;

	while (parent && !parent.classList.contains(className)) {
		parent = parent.parentElement;
	}

	return parent;
}

function removeTokenOnClick(event) {
	const slot = findAncestorWithClass(event.target, 'slot');
	clearSlot(slot);
	slot.removeEventListener('click', removeTokenOnClick);
}

function clearSlot(slot) {
	if (slot.classList.contains('fixed')) return;
	
	const slotBack = getSlotBack(slot);
	
	if (slot.token) {
		updateSlotText(slot, blankText);
		
		if (slotBack.classList.contains('semiCorrect')) slot.token.classList.add('semiCorrect');
		if (!slotBack.classList.contains('wrong')) slot.token.style.display = 'block';
		slot.token = null;
	}
	
	slot.classList.remove('filled');
	slot.classList.remove('submitted');
	slot.classList.remove('animateFlip');
	slot.classList.remove('semiCorrectTint');
	
	slotBack.classList.remove('correct');
	slotBack.classList.remove('semiCorrect');
	slotBack.classList.remove('wrong');
}

function clearSlots() {
	const slots = getSlots();
	for (const slot of slots) {
		clearSlot(slot);
	}
}

function disableButtons() {
	document.getElementById('clearButton').disabled = true;
	document.getElementById('enterButton').disabled = true;
}

function enableButtons() {
	document.getElementById('clearButton').disabled = false;
	document.getElementById('enterButton').disabled = false;
}

function submitAnswer() {
	// Check if all slots are filled
	if (getNextEmptySlot() === -1) {
		// Temporarily disable clear/enter buttons while animating answer
		disableButtons();
		
		let animationStarted = false;
		const slots = getSlots();
		for (let i = 0; i < slots.length; i++) {
			const slot = slots[i];
			if (slot.classList.contains('fixed')) continue;
			
			slot.classList.add('submitted');
			slot.removeEventListener('click', removeTokenOnClick);
			if (!animationStarted) {
				slot.classList.add('animateFlip'); // Start animation on the first slot. Other slots are animated by animationStart event handler
				animationStarted = true;
			}
			
			const backElement = slot.getElementsByClassName('back')[0];
			const slotText = getSlotText(slot).toLowerCase();
			if (slotText === answers[i]) {
				// Exact match
				backElement.classList.add('correct');
			} else if (answers.includes(slotText)) {
				// Match but wrong position
				backElement.classList.add('semiCorrect');
			} else {
				// No match
				backElement.classList.add('wrong');
			}
		}
	}
}


document.addEventListener('DOMContentLoaded', initialisePage);