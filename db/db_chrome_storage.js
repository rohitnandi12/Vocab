/***************************************
Module which handles the persistance related functionalities.
*************************************** */
var storage_module = (function(){

    //word_data = {word,definition, url}
    var _insertWord = function(word,meaning){
        console.log("Word "+word+" with Meaning "+meaning+" is about to be saved");
        chrome.storage.sync.get(word,function(result){
            // check if word already exists
            if($.isEmptyObject(result)){
                // Add the word
                let wordObj = {};
                wordObj[word] = meaning;
                chrome.storage.sync.set(wordObj, function(){
                    console.log("Word "+word+" successfully saved");
                });
            }else{
                console.log("The word "+word+" already exists");
            }
        });       
    }

    var _getAllWords = function(callback){
        chrome.storage.sync.get(null, callback);
    }
    return {
        insertWord : _insertWord,
        getAllWords : _getAllWords

    }
})();