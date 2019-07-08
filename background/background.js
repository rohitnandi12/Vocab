/****************************************
Module which handles the persistance related functionalities.
*************************************** */
var storage_module = (function(){

    //word_data = {word,definition, url}
    var _insertWord = function(word){
        
        chrome.storage.sync.get(word,function(result){
            // check if word already exists
            if($.isEmptyObject(result)){
                // Add the word
                let wordObj = {};
                wordObj[word] = word;
                chrome.storage.sync.set(wordObj, function(){
                    console.log("Word "+word+" successfully saved");
                });
            }else{
                console.log("The word "+word+" already exists");
            }
        });       
    }
    return {
        insertWord : _insertWord
    }
})();

