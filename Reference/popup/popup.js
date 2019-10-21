
var refresh_list = function () {
    let displayStoredWords = document.getElementById('displayStoredWords');

    chrome.storage.sync.get(null, function (data) { 
        var words = Object.keys(data);//.sort();
        displayStoredWords.innerHTML = "";
        for(i=0; i<words.length; i++){
            console.log(words[i])
            let li = document.createElement('li');
            li.append(words[i]);
            displayStoredWords.appendChild(li);
        }
    });
    
    
};

let submitWord = document.getElementById('submitWord');
refresh_list();
submitWord.onclick = function (element) {

    let word = document.getElementById('wordInput').value;
    // Store word to db.
    storage_module.insertWord(word)
    console.log("submitted word is "+word);
    
    refresh_list();
};


