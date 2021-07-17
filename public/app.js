console.log("Sanity Check: JS is working!");
// routes for database CRUD
let backendRouteSaveData = new URL("http://localhost:8000/save-data");
let backendRouteAllDate = new URL("http://localhost:8000/all-data");
let backendRouteMatchData = new URL("http://localhost:8000/match-data");
let backendRouteDeleteMatchData = new URL("http://localhost:8000/delete-match-data");

// send result data to backend to save it to db
const saveData = async (backendRoute, formObj) => {
    try {
        const response = await fetch(backendRoute, {
            method: 'POST', 
            body: JSON.stringify(formObj),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let json = await response.json();
        console.log('json',json);
        let mList = document.getElementById('result-list');
        mList.innerHTML = '';
        let pre = document.createElement('pre');
        pre.innerHTML = JSON.stringify(json, null, 4);
        mList.appendChild(pre);
    }catch (error) {
        console.log(error);
    }
};

// request all saved result data from backend that fetch from db
const getAllData = async (backendRoute) => {
    try {
        const response = await fetch(backendRoute, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let json = await response.json();
        console.log('json',json);
        let mList = document.getElementById('result-list');
        mList.innerHTML = '';
        let ul = document.createElement('ul');
	    ul.id = 'list-group';
	    ul.className = 'list-group';
        mList.appendChild(ul);
        for(let i=0; i<json.length; i++){
            let li = document.createElement('li');
	        li.className = 	'list-group-item';
            ul.appendChild(li);
            let pre = document.createElement('pre');
            pre.innerHTML = JSON.stringify(json[i], null, 4);
            let checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.id = "oneResult";
            checkbox.value = json[i]._id;
            checkbox.name = "oneResult";
            li.appendChild(checkbox);
            li.appendChild(pre);
        }
    }catch (error) {
        console.log(error);
    }
};

// request matched saved result data from backend that fetch from db
const getMatchData = async (backendRoute, formObj) => {
    try {
        const response = await fetch(backendRoute, {
            method: 'POST', 
            body: JSON.stringify(formObj), 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let json = await response.json();
        console.log('json',json);
        let mList = document.getElementById('result-list');
        mList.innerHTML = '';
        let ul = document.createElement('ul');
	    ul.id = 'list-group';
	    ul.className = 'list-group';
        mList.appendChild(ul);
        for(let i=0; i<json.length; i++){
            let li = document.createElement('li');
	        li.className = 	'list-group-item';
            ul.appendChild(li);
            let pre = document.createElement('pre');
            pre.innerHTML = JSON.stringify(json[i], null, 4);
            let checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.id = "oneResult";
            checkbox.value = json[i]._id;
            checkbox.name = "oneResult";
            li.appendChild(checkbox);
            li.appendChild(pre);
        }
    }catch (error) {
        console.log(error);
    }
};

// delete selected saved result data from backend from db
const deleteMatchData = async (backendRoute, selectedID) => {
    try {
        const response = await fetch(backendRoute, {
            method: 'POST', 
            body: JSON.stringify(selectedID), 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log('Deleting ids:',selectedID);
        let json = await response.json();
        let mList = document.getElementById('result-list');
        mList.innerHTML = '';
        let pre = document.createElement('pre');
        pre.innerHTML = JSON.stringify('Deleted '+json.deletedCount+' documents', null, 4);
        mList.appendChild(pre);
    }catch (error) {
        console.log(error);
    }
};

// submit button clicked, pass form data into helper functions and invoke it
$(document).ready(function(){
    $("#button1").click(function(){
        let formArr = $("#form1").serializeArray();
        let formObj = formArr.reduce((map, obj) => {
            map[obj.name] = obj.value;
            return map;
        }, {});
        document.getElementById('result-list').innerHTML = 
        '<p style="color:blue;font-size:46px;"><strong> ... Accessing DB please wait ... </strong></p>';
	    console.log('formObj',formObj);
        saveData(backendRouteSaveData, formObj);
    });
    $("#button2").click(function(){
        document.getElementById('result-list').innerHTML = 
        '<p style="color:blue;font-size:46px;"><strong> ... Accessing DB please wait ... </strong></p>';
        getAllData(backendRouteAllDate);
    });
    $("#button3").click(function(){
        let formArr = $("#form1").serializeArray();
        let formObj = formArr.reduce((map, obj) => {
            map[obj.name] = obj.value;
            return map;
        }, {});
        document.getElementById('result-list').innerHTML = 
        '<p style="color:blue;font-size:46px;"><strong> ... Accessing DB please wait ... </strong></p>';
        getMatchData(backendRouteMatchData, formObj);
    });    
    $("#button4").click(function(){
        let selectedID = [];
        $('#list-group input:checked').each(function() {
            selectedID.push($(this).attr('value'));
        });
        document.getElementById('result-list').innerHTML = 
        '<p style="color:blue;font-size:46px;"><strong> ... Accessing DB please wait ... </strong></p>';
        deleteMatchData(backendRouteDeleteMatchData, selectedID);
    });
});