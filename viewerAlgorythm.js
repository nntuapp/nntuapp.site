const firstWeekInCalendar = 5;

var tt = [];
var blurred = false;
var userGroup = '';

var nowWeek = 0;

const days = ['day0','day1', 'day2', 'day3', 'day4', 'day5', 'day6'];

class Lesson {
    constructor(startTime, stopTime, day, weeks, rooms, name, type, teacher, note) {
        this.startTime = startTime;
        this.stopTime = stopTime;
        this.day = day;
        this.weeks = weeks;
        this.rooms = rooms;
        this.name = name;
        this.type = type;
        this.teacher = teacher;
        this.note = note;
    };

    emptyFill(){
        this.startTime = '';
        this.stopTime = '';
        this.day = -1;
        this.weeks = [];
        this.rooms = [];
        this.name = '';
        this.type = '';
        this.teacher = '';
        this.note = '';
    }

    get stringRooms(){
        return this.rooms.join(', ');
    };

    get stringWeeks(){
        var output = '';
        var tempWeeks = [...this.weeks];
        if (tempWeeks.includes(-2)){
            output += '<span style="color: #006CB2">ЧН</span>';
            var index = tempWeeks.indexOf(-2);
            tempWeeks.splice(index, 1);
        };
        if (tempWeeks.includes(-1)){
            if (output.length > 0){
                output += ' + ';
            }
            var index = tempWeeks.indexOf(-1);
            tempWeeks.splice(index, 1);
            output += '<span style="color: #CD2D09">НЧ</span>';
        }
        if (tempWeeks.length > 0) {
            if (output.length > 0){
                output += ' + ';
            }
            output += tempWeeks.join(', ');
            if (tempWeeks.length > 1){
                output += ' НЕДЕЛИ';
            } else {output += ' НЕДЕЛЯ';}
        }
        return output;
    };
}

Date.prototype.getWeekNumber = function(){
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};
  
function getGroup(cookiename = 'group') {
    var results = document.cookie.match ( '(^|;) ?' + cookiename + '=([^;]*)(;|$)' );
    if ( results )
      return ( decodeURIComponent(results[2] ) );
    else
      return null;
}


function saveGroup(group) {
    document.cookie = "group=" + encodeURIComponent(group);
}
  

function getCard(lesson, lessonIndex){
    if (lesson.weeks.includes(-1) && lesson.weeks.includes(-2)){
        return `<p><div class = "purpleCell" onclick = "showFullDetail(tt[${lessonIndex}], ${lessonIndex})">
            <div class = "table">
                <div class="numbersCol">
                    <div class = "time">${lesson.startTime}<br>––<br>${lesson.stopTime}</div>
                    <div class = "room">${lesson.stringRooms}</div>
                </div>
                <div class = "dataPlace">
                    <div class = "purpleTitle">${lesson.name}</div>
                    <div class = "teacherLabel">${lesson.teacher}</div>
                    <div class = "noteLabel">${lesson.note}</div>
                    <div class = "weekNTypeLabel">${lesson.stringWeeks}, ${lesson.type.toUpperCase()}</div>
                </div>
            </div>
        </div> </p>`;
    } else if (lesson.weeks.includes(-2)) {
        return `<p><div class = "blueCell" onclick = "showFullDetail(tt[${lessonIndex}], ${lessonIndex})">
            <div class = "table">
                <div class="numbersCol">
                    <div class = "time">${lesson.startTime}<br>––<br>${lesson.stopTime}</div>
                    <div class = "room">${lesson.stringRooms}</div>
                </div>
                <div class = "dataPlace">
                    <div class = "blueTitle">${lesson.name}</div>
                    <div class = "teacherLabel">${lesson.teacher}</div>
                    <div class = "noteLabel">${lesson.note}</div>
                    <div class = "weekNTypeLabel">${lesson.stringWeeks}, ${lesson.type.toUpperCase()}</div>
                </div>
            </div>
        </div> </p>`;
    } else if (lesson.weeks.includes(-1)){
        return `<p><div class = "redCell" onclick = "showFullDetail(tt[${lessonIndex}], ${lessonIndex})">
            <div class = "table">
                <div class="numbersCol">
                    <div class = "time">${lesson.startTime}<br>––<br>${lesson.stopTime}</div>
                    <div class = "room">${lesson.stringRooms}</div>
                </div>
                <div class = "dataPlace">
                    <div class = "redTitle">${lesson.name}</div>
                    <div class = "teacherLabel">${lesson.teacher}</div>
                    <div class = "noteLabel">${lesson.note}</div>
                    <div class = "weekNTypeLabel">${lesson.stringWeeks}, ${lesson.type.toUpperCase()}</div>
                </div>
            </div>
        </div> </p>`;
    } else {
        return `<p><div class = "purpleCell" onclick = "showFullDetail(tt[${lessonIndex}], ${lessonIndex})">
            <div class = "table">
                <div class="numbersCol">
                    <div class = "time">${lesson.startTime}<br>––<br>${lesson.stopTime}</div>
                    <div class = "room">${lesson.stringRooms}</div>
                </div>
                <div class = "dataPlace">
                    <div class = "purpleTitle">${lesson.name}</div>
                    <div class = "teacherLabel">${lesson.teacher}</div>
                    <div class = "noteLabel">${lesson.note}</div>
                    <div class = "weekNTypeLabel">${lesson.stringWeeks}, ${lesson.type.toUpperCase()}</div>
                </div>
            </div>
        </div> </p>`;
    }
}

function weeksFromString(input){
    var weeks = [];
    var tempString = input.replaceAll(' ', '');
    while (tempString.includes(',')){
        var index = tempString.indexOf(',');
        try {
            let tempWeek = parseInt(tempString.slice(0, index));
            if (!isNaN(tempWeek)){
                weeks.push(tempWeek);
            }
        } catch {
            console.log('Ошибка в обработке недель');
        }
        tempString = tempString.slice(index + 1);
    }
    var left = 0;
    try {
        left = parseInt(tempString);
        if (isNaN(left)){left = 0;}
    } catch {
        left = 0;
    }
    if (left != 0) {
        weeks.push(left);
    }
    return weeks;
}

function stringFromWeeks(weeks){
    return weeks.join(', ');
}

function stringFromRooms(rooms){
    return rooms.join(', ');
}


function cleanUpString(input){
    if (input == '' || input == ' ') {return input;}
    var output = input;
    while (output.charAt(0) == ' '){
        output = output.slice(1);
    }
    while (output.charAt(output.length - 1) == ' ' && output != ' '){
        output = output.slice(0, output.length - 2);
    }
    return output
}


function roomsFromString(input){
    var rooms = [];
    tempString = cleanUpString(input);
    while (tempString.includes(',')){
        var index = tempString.indexOf(',');
        try {
            rooms.push(cleanUpString(tempString.slice(0, index)));
        } catch {
            console.log('Ошибка в обработке аудиторий');
        }
        tempString = tempString.slice(index + 1);
    }
    if (tempString != '') {
        rooms.push(cleanUpString(tempString));
    }
    return rooms;
}

function estTimeFromString(input){
    var tempString = input.replaceAll(':', '');
    tempString = tempString.replaceAll(' ', '');
    tempString = tempString.replaceAll(';', '');
    tempString = tempString.replaceAll(',', '');
    return parseInt(tempString);
}

function fillIn(){
    tt.sort(function(a,b){
        var startA = estTimeFromString(a.startTime);
        var startB = estTimeFromString(b.startTime);
        if (startA > startB){
            return 1;
        } else if (startA < startB){    
            return -1;
        }
        else return 0;
    });
    for (i = 0; i < days.length; i++){
        document.getElementById(days[i]).innerHTML = '';
    }
    for (i = 0; i < tt.length; i++){
        var actual = (nowWeek%2 == 1 && tt[i].weeks.includes(-1)) || (nowWeek%2 == 0 && tt[i].weeks.includes(-2)) || tt[i].weeks.includes(nowWeek);
        if (actual){
            document.getElementById(days[tt[i].day]).innerHTML += getCard(tt[i], i);
        }
    }
}

function loadTT(group = userGroup){
    var request = new XMLHttpRequest();
    var data = JSON.stringify({
        key: receiveKey,
        groupName: group
    });

    request.open("POST", address, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onreadystatechange = function(){
        if (this.readyState === XMLHttpRequest.DONE){
            tt = [];
            downloadedTT = JSON.parse(this.responseText);
            for (i = 0; i < downloadedTT.days.length; i++){
                tt.push(new Lesson(downloadedTT.startTimes[i], downloadedTT.stopTimes[i], downloadedTT.days[i], weeksFromString(downloadedTT.weeks[i]), roomsFromString(downloadedTT.rooms[i]), downloadedTT.names[i], downloadedTT.types[i], downloadedTT.teachers[i], downloadedTT.notes[i]));
            }
            // console.log(tt);
            fillIn();
        }
    };
    request.send(data);
}

function updateGroupLabel(group){
    document.getElementById('groupLabel').innerHTML = `Группа: ${group}`;
}


function showGroupPopup(active){
    if (active){
        // document.getElementById('haha').style.display = 'flex';
        document.getElementById('haha').style.visibility = 'visible';
        document.getElementById('haha').style.filter = 'none';
        document.getElementById('haha').style.webkitFilter = 'none';
    } else {
        document.getElementById('haha').style.filter = 'blur(20px)';
        document.getElementById('haha').style.webkitFilter = 'blur(20px)';
        // document.getElementById('haha').style.display = 'none';
        document.getElementById('haha').style.visibility = 'hidden';
    }
}

function blurCards(cardsArray, blur){
    for (i = 0; i < cardsArray.length; i++){
        if (blur){
            cardsArray[i].style.filter = 'blur(8px)'
        } else {
            cardsArray[i].style.filter = 'none'
        }
    }
}


function blurMainInterface(active){
    if (active){
        document.getElementById('mainInterface').style.filter = 'blur(8px)';
        document.getElementById('mainInterface').style.webkitFilter = 'blur(8px)';
        blurCards(document.getElementsByClassName('blueCell'), true);
        blurCards(document.getElementsByClassName('redCell'), true);
        blurCards(document.getElementsByClassName('purpleCell'), true);
    } else {
        document.getElementById('mainInterface').style.filter = 'none';
        document.getElementById('mainInterface').style.webkitFilter = 'none';
        blurCards(document.getElementsByClassName('blueCell'), false);
        blurCards(document.getElementsByClassName('redCell'), false);
        blurCards(document.getElementsByClassName('purpleCell'), false);
    }
}

function applyGroup(){
    blurMainInterface(false);
    showGroupPopup(false);
    userGroup = document.getElementById('groupField').value;
    userGroup = userGroup.replaceAll(' ', '-');
    userGroup = userGroup.toUpperCase();
    updateGroupLabel(userGroup);
    saveGroup(userGroup);
    loadTT(userGroup);
}

function askGroup(){
    document.getElementById('groupField').value = userGroup;
    document.getElementById('groupField').addEventListener("keyup", function(event){
        if (event.keyCode == 13){
            document.getElementById('groupField').value = document.getElementById('groupField').value.replaceAll('\n', '');
            applyGroup();
        }
    });
    blurMainInterface(true);
    showGroupPopup(true);
}

function getNowWeek(){
    return new Date().getWeekNumber() - firstWeekInCalendar;
}

function updateWeekLabel(){
    document.getElementById('weekLabel').innerHTML = `${nowWeek} неделя`;
}

function updateWeek(){
    if (nowWeek <= 1) {nowWeek = 1;}
    updateWeekLabel();
    fillIn();
}

function nextWeek(){
    nowWeek += 1;
    updateWeek();
}

function prevWeek(){
    nowWeek -= 1;
    updateWeek();
}

function openEditor(){
    window.open('/editor/editor.html');
}

function init(){
    nowWeek = getNowWeek();
    updateWeekLabel();
    const tempGroup = getGroup();
    if (tempGroup== '' || tempGroup == null){
        askGroup();
    } else {
        userGroup = tempGroup;
        updateGroupLabel(userGroup);
        loadTT();
    }
}


document.onreadystatechange = function(){
    if (document.readyState == 'complete'){
        init();
    }
}

function showFullDetail(){

}