function initialisePage() {
	var numSlots = 6;
	initialiseSlots(numSlots);
}

function initialiseSlots(numSlots) {
	const headlineContainer = document.getElementById('headlineContainer');
	
	const clearButton = document.createElement('button');
	clearButton.classList.add('clearButton');
	clearButton.addEventListener('click', clearSlots);
	headlineContainer.appendChild(clearButton);
	
	const blankText = '\u00A0';
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
	enterButton.classList.add('enterButton');
	enterButton.addEventListener('click', submitAnswer);
	headlineContainer.appendChild(enterButton);
}

function getSlots() {
	const headlineContainer = document.getElementById('headlineContainer');
	const childElements = Array.from(headlineContainer.children);
	return childElements.filter(el => el.classList.contains('slot'));
}

function getNextSlot() {
	// Gets the next empty `slot` element in left-to-right order;
	// Returns -1 if all slots are non-empty
	const slots = getSlots();
	for (const slot of slots) {
		if (getSlotSpan(slot).textContent === '\u00A0') return slot;
	}
	
	return -1;
}

function getSlotSpan(slot) {
	const spans = slot.getElementsByTagName('span');
	if (spans.length > 0) {
		return spans[0];
	} else {
		return null;
	}
}
	
function selectToken(token) {
	const nextSlot = getNextSlot();
	if (nextSlot === -1) return; // No empty slots
	
	// Hide the token option
	token.style.display = 'none';
	getSlotSpan(nextSlot).textContent = token.textContent.toUpperCase();
	
	const faceSpans = nextSlot.getElementsByClassName('inner');
	for (const span of faceSpans) {
		span.textContent = token.textContent.toUpperCase();
	}
	
	nextSlot.token = token;
	nextSlot.classList.add('filled');
	nextSlot.addEventListener('click', removeTokenOnClick);
}

function removeTokenOnClick(event) {
	const slot = event.target.parentNode;
	removeToken(slot);
	slot.removeEventListener('click', removeTokenOnClick);
}

function removeToken(slot) {
	if (slot.token) {
		slot.classList.remove('filled');
		getSlotSpan(slot).textContent = '\u00A0';
		slot.token.style.display = 'block'
		slot.token = null;
		
		slot.classList.remove('correct');
		slot.classList.remove('semiCorrect');
		slot.classList.remove('wrong');
		slot.classList.remove('animateFlip');
	}
}

function clearSlots() {
	const slots = getSlots();
	for (const slot of slots) {
		removeToken(slot);
	}
}

function submitAnswer() {
	const answers = ['why', 'i', 'never', 'scam', 'the', 'rich'];
	
	// Check if all slots are filled
	if (getNextSlot() === -1) {
		const slots = getSlots();
		for (let i = 0; i < slots.length; i++) {
			const slot = slots[i];
			slot.classList.add('animateFlip');
			
			const backElement = slot.getElementsByClassName('back')[0];
			const slotText = slot.token.textContent.toLowerCase();
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