// Client-side JavaScript will go here.
console.log('Rumfor Market Tracker script loaded.');

document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.querySelector('.message-board form');

    if (messageForm) {
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const contentTextarea = messageForm.querySelector('textarea[name="content"]');
            const content = contentTextarea.value.trim();
            const marketId = messageForm.action.match(/markets\/(\d+)/)[1];

            if (!content) {
                return;
            }

            try {
                const response = await fetch(`/api/markets/${marketId}/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // In a real app, a bearer token would be included
                        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ content })
                });

                if (!response.ok) {
                    throw new Error('Failed to post message');
                }

                const newMessage = await response.json();

                // Dynamically add the new message to the UI
                const messageBoard = document.querySelector('.message-board');
                const newMessageDiv = document.createElement('div');
                newMessageDiv.classList.add('message');
                newMessageDiv.innerHTML = `
                    <p><strong>You:</strong> ${content}</p>
                    <small>${new Date().toLocaleDateString()}</small>
                `;
                messageBoard.insertBefore(newMessageDiv, messageForm);

                // Clear the textarea
                contentTextarea.value = '';

            } catch (error) {
                console.error('Error posting message:', error);
                alert('Could not post your message. Please try again.');
            }
        });
    }

    document.querySelectorAll('.vote-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const marketId = e.target.dataset.marketId;
            const attributeId = e.target.dataset.attributeId;

            try {
                const response = await fetch(`/api/markets/${marketId}/attributes/${attributeId}/vote`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to cast vote');
                }

                // Increment the vote count in the UI
                const tagSpan = e.target.parentElement;
                const currentText = tagSpan.innerText;
                const match = currentText.match(/\((\d+)\)/);
                if (match) {
                    const currentCount = parseInt(match[1], 10);
                    tagSpan.innerHTML = tagSpan.innerHTML.replace(`(${currentCount})`, `(${currentCount + 1})`);
                }
                e.target.disabled = true; // Prevent multiple votes
                e.target.innerText = '✓';

            } catch (error) {
                console.error('Error casting vote:', error);
            }
        });
    });

    const voteButtons = document.querySelectorAll('.attribute-tags .tag button');
    voteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const tag = e.target.closest('.tag');
            const marketId = window.location.pathname.split('/').pop(); // Simple way to get ID from URL
            const attributeId = tag.dataset.attributeId; // Assumes we add data-attribute-id to the tag

            e.target.disabled = true;
            e.target.textContent = 'Voted!';

            try {
                const response = await fetch(`/api/markets/${marketId}/attributes/${attributeId}/vote`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    // Re-enable button if vote failed
                    e.target.disabled = false;
                    e.target.textContent = '+1';
                    throw new Error('Failed to vote');
                }

                console.log('Vote successful');

            } catch (error) {
                console.error('Error voting:', error);
                alert('Your vote could not be recorded.');
            }
        });
    });
});
