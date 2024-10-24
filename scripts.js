// Dictionary hashed object
let hashedDictionary = {};

// Function to hash a word using SHA-256 secute hash algorithm
//In JavaScript, SHA stands for Secure Hash Algorithm. It’s a family of cryptographic hash functions designed to ensure data integrity. The most commonly used versions are SHA-1, SHA-256, and SHA-512.
async function hashWord(word) {
    const encoder = new TextEncoder();
    const data = encoder.encode(word.trim());  // Remove any extra spaces
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Function to handle loading of dictionary file
function loadDictionaryFile() {
    const dictionaryInput = document.getElementById('dictionary-input').files[0];
    if (dictionaryInput) {
        const reader = new FileReader();
        reader.onload = async function(event) {
            const dictionaryContent = event.target.result;
            const words = dictionaryContent.split('\n').map(word => word.trim()).filter(word => word);  // Split by line and trim
            hashedDictionary = {};  // Reset the dictionary

            for (let word of words) {
                const hash = await hashWord(word);
                hashedDictionary[word] = hash;
            }
            alert('Dictionary loaded and hashed successfully!');
        };
        reader.readAsText(dictionaryInput);
    } else {
        alert('Please upload a dictionary file.');
    }
}

// Function to handle the input (either from text box or file)
function checkHashes() {
    const textArea = document.getElementById('text-input').value;
    const fileInput = document.getElementById('file-input').files[0];

    if (fileInput) {
        // If file is uploaded, read the file
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileContent = event.target.result;
            processText(fileContent);
        };
        reader.readAsText(fileInput);
    } else if (textArea) {
        // If text is provided in textarea
        processText(textArea);
    } else {
        alert("Please provide input via text or file.");
    }
}

// Function to process the text and check hashes
async function processText(text) {
    const words = text.match(/\b\w+\b/g); // Extract words from the text
    const resultSection = document.getElementById('result-section');
    resultSection.innerHTML = "<h2>Hash Results:</h2>";

    if (words && Object.keys(hashedDictionary).length > 0) {
        for (let word of words) {
            const hash = await hashWord(word);
            let message = `Word: ${word} - Hash: ${hash} - `;

            // Check if the hash matches any word in the dictionary
            if (Object.values(hashedDictionary).includes(hash)) {
                message += "<span style='color: green;'>Match found in dictionary</span>";
            } else {
                message += "<span style='color: red;'>No match found</span>";
            }

            const paragraph = document.createElement('p');
            paragraph.innerHTML = message;
            resultSection.appendChild(paragraph);
        }
    } else {
        resultSection.innerHTML = "<p>No valid words found in the text or dictionary not loaded.</p>";
    }
}

// Event listener to load dictionary file when selected
document.getElementById('dictionary-input').addEventListener('change', loadDictionaryFile);
