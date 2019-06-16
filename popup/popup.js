
var refresh_list = function () {
    let displayStoredWords = document.getElementById('displayStoredWords');
    // These words will come from db
    let words = ['aone','ctwo','bthree'];
    
    for(i=0; i<words.length; i++){
        console.log(words[i])
        let li = document.createElement('li');
        li.append(words[i]);
        displayStoredWords.appendChild(li);
    }
    
};

let submitWord = document.getElementById('submitWord');

// chrome.storage.sync.get('color', function(data){
//     changeColor.style.backgroundColor = data.color;
//     changeColor.setAttribute('value', data.color);
// });

console.log(submitWord);
refresh_list();
submitWord.onclick = function (element) {

    let word = document.getElementById('wordInput').value;
    // chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
    //     chrome.tabs.executeScript(
    //         tabs[0].id,
    //         {code: 'document.body.style.backgroundColor = "'+color+'";'}

    //     );
    // });
    console.log("submitted word is "+word);
    // word has to be store in db.
    refresh_list();
};


