document.getElementById('skinsForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission
    
    const player = document.getElementById('player').value;
    const holeNumber = document.getElementById('holeNumber').value;
    const score = document.getElementById('score').value;
    
    console.log(`Player: ${player}, Hole Number: ${holeNumber}, Score: ${score}`);
    // Here, you would typically process the form data, such as updating a scoreboard or database
});
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('skinsForm');
    const earningsTotal = document.getElementById('earningsTotal');
    const holeResultsDiv = document.getElementById('holeResults');
    const playerEarnings = { JB: 0, KJ: 0, Mike: 0, Nick: 0, Percy: 0 };
    const scoreValues = { "Bogey+": 0, "Par": 1, "Birdie": 2, "Eagle": 5 };
    let holeResults = []; // To store results of each hole

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const player = document.getElementById('player').value;
        const holeNumber = parseInt(document.getElementById('holeNumber').value, 10);
        const score = document.getElementById('score').value;
        const moneyEarned = scoreValues[score];
        
        // Process the current submission
        processSubmission(player, holeNumber, score, moneyEarned);
    });

    function processSubmission(player, holeNumber, score, moneyEarned) {
        // Check if the hole already has submissions
        let hole = holeResults.find(hole => hole.holeNumber === holeNumber);
        if (hole) {
            // Add to existing submissions if not already submitted by the same player
            if (!hole.submissions.some(sub => sub.player === player)) {
                hole.submissions.push({ player, score, moneyEarned });
            }
        } else {
            // Create a new hole result if it's the first submission for this hole
            holeResults.push({
                holeNumber,
                submissions: [{ player, score, moneyEarned }]
            });
        }
        updateResults();
    }

    function updateResults() {
        // Reset earnings for recalculation
        for (let player in playerEarnings) {
            playerEarnings[player] = 0;
        }

        holeResultsDiv.innerHTML = ''; // Clear previous hole results

        holeResults.forEach(hole => {
            const winners = determineWinners(hole.submissions);
            if (winners.length === 1) {
                // Update earnings for the winner
                const winner = winners[0];
                playerEarnings[winner.player] += winner.moneyEarned;
                // Display hole result
                holeResultsDiv.innerHTML += `Hole #${hole.holeNumber}: ${winner.player} - ${winner.score} - $${winner.moneyEarned}<br>`;
            } else {
                // Display tie
                holeResultsDiv.innerHTML += `Hole #${hole.holeNumber}: Tie, no winner - Carry Over<br>`;
            }
        });

        // Update the earnings total display
        earningsTotal.innerHTML = Object.entries(playerEarnings)
            .map(([player, earnings]) => `${player}: $${earnings}`)
            .join(' | ');
    }

    function determineWinners(submissions) {
        // Sort submissions by moneyEarned, then filter to find the lowest scores (highest earnings)
        const sortedSubmissions = submissions.sort((a, b) => b.moneyEarned - a.moneyEarned);
        const highestEarnings = sortedSubmissions[0].moneyEarned;
        return sortedSubmissions.filter(sub => sub.moneyEarned === highestEarnings);
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Existing setup and functions

    document.getElementById('emailResults').addEventListener('click', function() {
        const subject = encodeURIComponent("B9B Skins Game Results");
        let body = encodeURIComponent(`B9B Skins Game Results:\n\n` + formatResultsForEmail());
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });

    function formatResultsForEmail() {
    const gameDate = document.getElementById('gameDate').value;
    const courseName = document.getElementById('courseName').value;

    let results = `Date: ${gameDate}\nCourse Name: ${courseName}\n\n`;

    results += "Running Totals:\n";
    results += document.getElementById('earningsTotal').innerText.replace(/ \| /g, '\n') + "\n\n";
    results += "Hole Breakdowns:\n";
    results += document.getElementById('holeResults').innerText.replace(/<br>/g, '\n');
    return results;
}

});
document.addEventListener('DOMContentLoaded', function() {
    // Previous setup

    // Modification: Update the processSubmission function to handle both new submissions and edits
    function processSubmission(player, holeNumber, score, moneyEarned, isEdit = false) {
        let hole = holeResults.find(hole => hole.holeNumber === holeNumber);
        if (hole && !isEdit) {
            // Handle new submissions differently from edits
            // Code for adding a new submission without overriding
        } else {
            // This is an edit or a new hole
            holeResults = holeResults.filter(hole => hole.holeNumber !== holeNumber); // Remove the old entry if editing
            holeResults.push({
                holeNumber,
                submissions: [{ player, score, moneyEarned }]
            });
        }
        updateResults();
    }

    function updateResults() {
        // Reset earnings for recalculation
        // Update UI for totals and hole results
        
        holeResults.forEach(hole => {
            // Generate results string
            // Modification: Include an "Edit" button next to each hole result
            const editButtonHtml = `<button onclick="editHoleResult(${hole.holeNumber})">Edit</button>`;
            holeResultsDiv.innerHTML += `Hole #${hole.holeNumber}: ${winner.player} - ${winner.score} - $${winner.moneyEarned} ${editButtonHtml}<br>`;
        });
    }
});

// New function to handle editing a hole result
function editHoleResult(holeNumber) {
    const hole = holeResults.find(hole => hole.holeNumber === holeNumber);
    if (hole) {
        const submission = hole.submissions[0]; // Assuming one submission per hole for simplicity
        // Populate the form with the existing values
        document.getElementById('player').value = submission.player;
        document.getElementById('holeNumber').value = hole.holeNumber;
        document.getElementById('score').value = submission.score;
        // Optionally, indicate editing mode or disable adding new holes while editing
    }
}

// Modify the form submission handler to check if it's an edit or a new submission
document.getElementById('skinsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const player = document.getElementById('player').value;
    const holeNumber = parseInt(document.getElementById('holeNumber').value, 10);
    const score = document.getElementById('score').value;
    const moneyEarned = scoreValues[score];
    const isEdit = checkIfEdit(holeNumber); // Implement this function to determine if it's an edit
    processSubmission(player, holeNumber, score, moneyEarned, isEdit);
});
  
