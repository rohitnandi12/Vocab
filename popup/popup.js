
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
// refresh_list();
submitWord.onclick = function (element) {

    let word = document.getElementById('wordInput').value;
    let meaning = document.getElementById('meaningInput').value;
    //cleance word
    word = word.trim().toLowerCase();
    meaning = meaning.trim().toLowerCase();
    // Store word to db.
    console.log(word+" : "+meaning);
    storage_module.insertWord(word,meaning);
    notify_module.notify("AddedWord",word,meaning);
    //refresh_list();
};