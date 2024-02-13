function initialisePage() {
	var numSlots = 6;
	initialiseSlots(numSlots);
}

function initialiseSlots(numSlots) {
	const headlineContainer = document.getElementById('headlineContainer');
	
	for (let i=0; i<numSlots; i++) {
		const slotElement = document.createElement('div');
		slotElement.classList.add('slot');
		slotElement.textContent = '\u00A0';
		headlineContainer.appendChild(slotElement);
	}
}

function getNextSlot() {
	// Gets the next empty `slot` element in left-to-right order;
	// Returns -1 if all slots are non-empty
	const headlineContainer = document.getElementById('headlineContainer');
	const slots = headlineContainer.children;
	
	for (const slot of slots) {
		if (slot.classList.contains('slot') && slot.textContent === '\u00A0') return slot;
	}
	
	return -1;
}
	
function selectToken(token) {
	const nextSlot = getNextSlot();
	if (nextSlot === -1) return; // No empty slots
	
	token.style.display = 'none';
	nextSlot.textContent = token.textContent.toUpperCase();
	nextSlot.classList.add('filled');
	nextSlot.token = token;
	nextSlot.addEventListener('click', removeToken);
}

function removeToken(event) {
	const slot = event.target;
	slot.classList.remove('filled');
	slot.textContent = '\u00A0';
	slot.token.style.display = 'block'
	slot.token = null;
	slot.removeEventListener('click', removeToken);
}





document.addEventListener('DOMContentLoaded', initialisePage);