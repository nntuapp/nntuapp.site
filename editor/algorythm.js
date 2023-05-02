var tt = [];
var teachers = [];
var lessons = [];
var teachersToShow = [];
var lessonsToShow = [];

var blurred = false;
var userGroup = '';
var uploading = false;

var isFLevelAlert = false;
var pos = {left: 0, mouseX: 0, speed: 0, acc: 0, time: null, prevX: 0};

const days = ['day0','day1', 'day2', 'day3', 'day4', 'day5', 'day6'];
const startLabelsSE = ['start0','start1','start2','start3','start4','start5','start6'];
const stopLabelsSE = ['stop0','stop1','stop2','stop3','stop4','stop5','stop6'];
const borderlines = ['line0','line1','line2','line3','line4','line5','line6'];
const timeTitles = ['title0','title1','title2','title3','title4','title5','title6'];
const timeCards = ['time0','time1','time2','time3','time4','time5','time6'];

const weekDays = ['wday0','wday1', 'wday2', 'wday3', 'wday4', 'wday5', 'wday6'];

const mainStartTimes = ["7:30", "9:20", "11:10", "13:15", "15:00", "16:45", "18:30", "20:15"];
const mainStopTimes = ["9:05", "10:55", "12:45", "14:50", "16:35", "18:20", "20:05", "21:50"];
const sStartTimes = ["8:00", "9:45", "11:35", "13:40", "15:25", "17:10", "18:55", "20:40"];
const sStopTimes = ["9:35", "11:20", "13:10", "15:15", "17:00", "18:45", "20:30", "22:15"];

const messages = ['Укажите название занятия 😳', 'Укажите день занятия 📆', 'Укажите тип занятия ☝️', 'Укажите время занятия ⏰', 'Укажите время занятия ⏰', 'Неверный код 😭', 'Расписание загружено на сервер 🥳', 'Проблемы с подключением 😬', 'Расписание не загружено 😳'];

const descriptions = ['Эти данные необходимы', 'Эти данные необходимы', 'Эти данные необходимы', 'Эти данные необходимы', 'Эти данные необходимы', 'Проверьте правильность введённого кода', 'Вы поделились этим расписанием. Ура!', 'Проверьте своё подключение к интернету', 'Проверьте правильность введённой группы и подключение к интернету'];

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var tempLessonIndex = -1

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

Lesson.fromJSON = function(json){
    const obj = JSON.parse(json)
    return new Lesson(obj.startTime, obj.stopTime, obj.day, obj.weeks, obj.rooms, obj.name, obj.type, obj.teacher, obj.note)
}

function getGroup(cookiename = 'group') {
    var results = document.cookie.match ( '(^|;) ?' + cookiename + '=([^;]*)(;|$)' );
    if ( results )
      return ( decodeURIComponent(results[2] ) );
    else
      return null;
}


function saveGroup(group) {
    var exp_date = new Date();
    exp_date.setFullYear(exp_date.getFullYear() + 1);
    document.cookie = "group=" + encodeURIComponent(group) + "; expires=" + exp_date.toUTCString();
}


function saveTTLocally(tt){
    localStorage.setItem('tt', JSON.stringify(tt));
    // console.log(JSON.parse(localStorage.getItem('tt')));
}

function constructLesson(data){
    return new Lesson(data.startTime, data.stopTime, data.day, data.weeks, data.rooms, data.name, data.type, data.teacher, data.note);
}

function getLocalTT(key = 'tt'){
    var saved = localStorage.getItem(key);
    if (saved) {
        tempTT = JSON.parse(saved);
        for (i = 0; i < tempTT.length; i++){
            tt.push(constructLesson(tempTT[i]));
        }
        fillIn();
    } else {
        loadTT();
    }
}

function getCard(lesson, lessonIndex){
    if (lesson.name == "Сетевые технологии"){
        console.log(lesson)
    }
    addTeachersAndLessonNames(lesson.name, lesson.teacher);
    if (lesson.weeks.includes(-1) && lesson.weeks.includes(-2)){
        return `<p><div class = "purpleCell" onclick = "editExistingOne(tt[${lessonIndex}], ${lessonIndex})">
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
        return `<p><div class = "blueCell" onclick = "editExistingOne(tt[${lessonIndex}], ${lessonIndex})">
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
        return `<p><div class = "redCell" onclick = "editExistingOne(tt[${lessonIndex}], ${lessonIndex})">
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
        return `<p><div class = "purpleCell" onclick = "editExistingOne(tt[${lessonIndex}], ${lessonIndex})">
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
    var tempString = input.replace(/ /g, '');
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
    var tempString = input.replace(/:/g, '');
    tempString = tempString.replace(/ /g, '');
    tempString = tempString.replace(/;/g, '');
    tempString = tempString.replace(/,/g, '');
    return parseInt(tempString);
}

function fillIn(){
    if (tt.length == 0){
        showAlert(8, fLevel = true);
    }
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
        // console.log(tt[i].weeks);
        document.getElementById(days[tt[i].day]).innerHTML += getCard(tt[i], i);
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
        document.getElementById('haha').style.opacity = '1';
        document.getElementById('haha').style.filter = 'none';
        document.getElementById('haha').style.webkitFilter = 'none';
    } else {
        document.getElementById('haha').style.opacity = '0';
        // document.getElementById('haha').style.filter = 'blur(20px)';
        // document.getElementById('haha').style.webkitFilter = 'blur(20px)';
        // document.getElementById('haha').style.display = 'none';
        document.getElementById('haha').style.visibility = 'hidden';
    }
}

function blurCards(cardsArray, blur){
    // for (i = 0; i < cardsArray.length; i++){
    //     if (blur){
    //         cardsArray[i].style.filter = 'blur(8px)'
    //     } else {
    //         cardsArray[i].style.filter = 'none'
    //     }
    // }
}


function blurMainInterface(active){
    // if (active){
    //     document.getElementById('mainInterface').style.filter = 'blur(8px)';
    //     document.getElementById('mainInterface').style.webkitFilter = 'blur(8px)';
    //     blurCards(document.getElementsByClassName('blueCell'), true);
    //     blurCards(document.getElementsByClassName('redCell'), true);
    //     blurCards(document.getElementsByClassName('purpleCell'), true);
    // } else {
    //     document.getElementById('mainInterface').style.filter = 'none';
    //     document.getElementById('mainInterface').style.webkitFilter = 'none';
    //     blurCards(document.getElementsByClassName('blueCell'), false);
    //     blurCards(document.getElementsByClassName('redCell'), false);
    //     blurCards(document.getElementsByClassName('purpleCell'), false);
    // }
}

function applyGroup(){
    blurMainInterface(false);
    showGroupPopup(false);
    userGroup = document.getElementById('groupField').value;
    userGroup = userGroup.replace(/ /g, '-');
    userGroup = userGroup.toUpperCase();
    updateGroupLabel(userGroup);
    saveGroup(userGroup);
    loadTT(userGroup);
}

function askGroup(){
    document.getElementById('groupField').value = userGroup;
    document.getElementById('groupField').addEventListener("keyup", function(event){
        if (event.keyCode == 13){
            document.getElementById('groupField').value = document.getElementById('groupField').value.replace(/\n/g, '');
            applyGroup();
        }
    });
    blurMainInterface(true);
    showGroupPopup(true);
}

var tempLesson = new Lesson();
tempLesson.emptyFill();

function changeTempLessonName(){
    tempLesson.name = document.getElementById('lessonNameField').value;
}

function changeTempLessonRoom(){
    tempLesson.rooms = roomsFromString(document.getElementById('roomField').value);
    if (tempLesson.rooms.length > 0){
        try{
            if (tempLesson.rooms[0].charAt(0) == '6'){
                fillTimes(false);
                if (mainStartTimes.includes(tempLesson.startTime) && mainStopTimes.includes(tempLesson.stopTime)){
                    let index = mainStartTimes.indexOf(tempLesson.startTime);
                    colorizeTime(index);
                    tempLesson.startTime = sStartTimes[index];
                    tempLesson.stopTime = sStopTimes[index];
                }
            } else if (tempLesson.rooms[0].charAt(0) > '0' && tempLesson.rooms[0].charAt(0) < '6'){
                fillTimes(true);
                if (sStartTimes.includes(tempLesson.startTime) && sStopTimes.includes(tempLesson.stopTime)){
                    let index = sStartTimes.indexOf(tempLesson.startTime);
                    colorizeTime(index);
                    tempLesson.startTime = mainStartTimes[index];
                    tempLesson.stopTime = mainStopTimes[index];
                }
            }
        } catch {
            console.log('Была отправлена пустая строка (видимо)')
        }
    }
}

function setTempTeacher(){
    tempLesson.teacher = document.getElementById('teacherField').value;
}

function setTempNotes(){
    tempLesson.note = document.getElementById('notesField').value;
}

function chooseADay(id){
    for (i = 0; i < weekDays.length; i ++){
        if (weekDays[i] == id){
            document.getElementById(weekDays[i]).style.backgroundColor = '#006CB2';
            document.getElementById(weekDays[i]).style.color = 'white';
        } else {
            document.getElementById(weekDays[i]).style.backgroundColor = '#eeeeee';
            document.getElementById(weekDays[i]).style.color = 'black';
        }
    }
}

function chooseType(type){
    document.getElementById('lectureButton').style.backgroundColor = '#eeeeee';
    document.getElementById('lectureButton').style.color = 'black';
    document.getElementById('practiceButton').style.backgroundColor = '#eeeeee';
    document.getElementById('practiceButton').style.color = 'black';
    document.getElementById('labaButton').style.backgroundColor = '#eeeeee';
    document.getElementById('labaButton').style.color = 'black';
    document.getElementById('customTypeField').backgroundColor = '#eeeeee';
    document.getElementById('customTypeField').color = 'black';

    if (type == 'Лекция'){
        document.getElementById('lectureButton').style.backgroundColor = '#006CB2';
        document.getElementById('lectureButton').style.color = 'white';
    } else if (type == 'Практика') {
        document.getElementById('practiceButton').style.backgroundColor = '#006CB2';
        document.getElementById('practiceButton').style.color = 'white';
    } else if (type == 'Лаб.работа') {
        document.getElementById('labaButton').style.backgroundColor = '#006CB2';
        document.getElementById('labaButton').style.color = 'white';
    } else {
        document.getElementById('customTypeField').backgroundColor = '#006CB2';
        document.getElementById('customTypeField').color = 'white';
        document.getElementById('customTypeField').value = type;
    }
}

function setDay(day){
    tempLesson.day = day;
    chooseADay(weekDays[day]);
}

function setType(type){
    if (type != ''){
        tempLesson.type = type;
    } else {
        tempLesson.type = document.getElementById('customTypeField').value;
    }
    chooseType(tempLesson.type);
}

function colorizeWeeks(weeks){
    if (weeks.includes(-2)){
        document.getElementById('evenButton').style.backgroundColor = '#006CB2';
        document.getElementById('evenButton').style.color = 'white';
    } else {
        document.getElementById('evenButton').style.backgroundColor = '#eeeeee';
        document.getElementById('evenButton').style.color = 'black';
    }

    if (weeks.includes(-1)){
        document.getElementById('oddButton').style.backgroundColor = '#CD2D09';
        document.getElementById('oddButton').style.color = 'white';
    } else {
        document.getElementById('oddButton').style.backgroundColor = '#eeeeee';
        document.getElementById('oddButton').style.color = 'black';
    }
}

function setEven(){
    if (tempLesson.weeks.includes(-2)){
        tempLesson.weeks = tempLesson.weeks.remove(-2);
    } else {
        tempLesson.weeks.push(-2);
    }
    colorizeWeeks(tempLesson.weeks);
}

function setOdd(){
    if (tempLesson.weeks.includes(-1)){
        tempLesson.weeks =  tempLesson.weeks.remove(-1);
    } else {
        tempLesson.weeks.push(-1);
    }
    colorizeWeeks(tempLesson.weeks);
}

function customWeeks(){
    var tempWeeks = [];
    if (tempLesson.weeks.includes(-1)){tempWeeks.push(-1);}
    if (tempLesson.weeks.includes(-2)){tempWeeks.push(-2);}
    tempWeeks = tempWeeks.concat(weeksFromString(document.getElementById('customWeeks').value));
    tempLesson.weeks = tempWeeks;
    colorizeWeeks(tempLesson.weeks);
}

function fillTimes(main){
    for (i = 0; i < startLabelsSE.length; i++){
        if (main){
            document.getElementById(startLabelsSE[i]).innerHTML = mainStartTimes[i];
            document.getElementById(stopLabelsSE[i]).innerHTML = mainStopTimes[i];
        } else {
            document.getElementById(startLabelsSE[i]).innerHTML = sStartTimes[i];
            document.getElementById(stopLabelsSE[i]).innerHTML = sStopTimes[i];
        }
    }
}

function colorizeTime(index){
    for (i = 0; i < timeCards.length; i++){
        if (i == index){
            document.getElementById(timeCards[i]).style.backgroundColor = '#006CB2';
            document.getElementById(timeTitles[i]).style.color = 'white';
            document.getElementById(startLabelsSE[i]).style.color = 'white';
            document.getElementById(borderlines[i]).style.backgroundColor = 'white';
            document.getElementById(stopLabelsSE[i]).style.color = 'white';
        } else {
            document.getElementById(timeCards[i]).style.backgroundColor = '#eeeeee';
            document.getElementById(timeTitles[i]).style.color = 'black';
            document.getElementById(startLabelsSE[i]).style.color = 'black';
            document.getElementById(borderlines[i]).style.backgroundColor = 'black';
            document.getElementById(stopLabelsSE[i]).style.color = 'black';
        }
    }
}

function setCardTime(index){
    tempLesson.startTime = document.getElementById(startLabelsSE[index]).innerHTML;
    tempLesson.stopTime = document.getElementById(stopLabelsSE[index]).innerHTML;
    colorizeTime(index);
}

function setCustomTime(){
    colorizeTime(-1);
    tempLesson.startTime = document.getElementById('customStartTime').value;
    tempLesson.stopTime = document.getElementById('customStopTime').value;
    tempLesson.startTime = cleanUpString(tempLesson.startTime);
    tempLesson.stopTime = cleanUpString(tempLesson.stopTime);
    tempLesson.startTime = tempLesson.startTime.replace(/ /g,':').replace(/\./g, ':').replace(/,/g,':').replace(/;/g,':');
    tempLesson.stopTime = tempLesson.stopTime.replace(/ /g,':').replace(/\./g, ':').replace(/,/g,':').replace(/;/g,':');
}

function emptyEditorPopup() {
    chooseType('');
    colorizeTime(-1);
    colorizeWeeks([]);
    fillTimes(true);
    chooseADay('');

    document.getElementById('lessonNameField').value = '';
    document.getElementById('roomField').value = '';
    document.getElementById('teacherField').value = '';
    document.getElementById('notesField').value = '';
    document.getElementById('customStartTime').value = '';
    document.getElementById('customStopTime').value = '';
    document.getElementById('customTypeField').value = '';
    document.getElementById('customWeeks').value = '';
}

function addTeachersAndLessonNames(name, teacher){
    if (!teachers.includes(teacher)){
        teachers.push(teacher)
    }
    if (!lessons.includes(name)){
        lessons.push(name)
    }
}

function saveButton(withDupl){
    let status = checkIfComplete();
    if (status == 0){
        if (tempLessonIndex != -1){
            tt[tempLessonIndex] = tempLesson;
        } else {
            tt.push(tempLesson);
        }
        if (withDupl){
            const json = JSON.stringify(tempLesson)
            console.log("\n")
            const duplicate = Lesson.fromJSON(json)
            console.log(duplicate)
            console.log("\n")
            tt.push(duplicate)
        }
        // addTeachersAndLessonNames(tempLesson.name, tempLesson.teacher);
        tempLesson = new Lesson();
        tempLesson.emptyFill();
        saveTTLocally(tt);
        fillIn();
        showEditor(false);
        blurMainInterface(false);
    } else {
        showAlert(status - 1);
    }
}

function closeButton(deleting) {
    if (tempLessonIndex != -1 && deleting){
        tt.splice(tempLessonIndex,1);
        saveTTLocally(tt);
        tempLessonIndex = -1;
    }
    fillIn();
    tempLesson = new Lesson();
    tempLesson.emptyFill();
    showEditor(false);
    blurMainInterface(false);
    emptyEditorPopup();
}



function showEditor(active) {
    if (active){
        // document.getElementById('haha').style.display = 'flex';
        document.getElementById('singleEditorBackground').style.visibility = 'visible';
        document.getElementById('singleEditorBackground').style.filter = 'none';
        document.getElementById('singleEditorBackground').style.webkitFilter = 'none';
        document.getElementById('singleEditorBackground').style.opacity = '1';
    } else {
        tempLessonIndex = -1;
        document.getElementById('singleEditorBackground').style.opacity = '0';
        // document.getElementById('singleEditorBackground').style.filter = 'blur(20px)';
        // document.getElementById('singleEditorBackground').style.webkitFilter = 'blur(20px)';
        // document.getElementById('haha').style.display = 'none';
        document.getElementById('singleEditorBackground').style.visibility = 'hidden';
    }
}

function newLesson(){
    emptyEditorPopup();
    blurMainInterface(true);
    showEditor(true);
}

function editExistingOne(lesson, lessonIndex){
    emptyEditorPopup();
    tempLessonIndex = lessonIndex;
    tempLesson = Lesson.fromJSON(JSON.stringify(lesson));


    chooseType(lesson.type);
    setDay(lesson.day);

    if (mainStartTimes.includes(lesson.startTime) && mainStopTimes.includes(lesson.stopTime)){
        let index = mainStartTimes.indexOf(lesson.startTime);
        fillTimes(true);
        colorizeTime(index);
    } else if (sStartTimes.includes(lesson.startTime) && sStopTimes.includes(lesson.stopTime)){
        let index = sStartTimes.indexOf(lesson.startTime);
        fillTimes(false);
        colorizeTime(index);
    } else {
        document.getElementById('customStartTime').value = lesson.startTime;
        document.getElementById('customStopTime').value = lesson.stopTime;
    }

    var tempWeeks = [...lesson.weeks];
    colorizeWeeks(tempWeeks);
    if (tempWeeks.includes(-2)){
        // colorizeWeeks([-2]);
        var index = tempWeeks.indexOf(-2);
        tempWeeks.splice(index, 1);
    } if (tempWeeks.includes(-1)){
        // colorizeWeeks([-1]);
        var index = tempWeeks.indexOf(-1);
        tempWeeks.splice(index, 1);
    } if (tempWeeks.length > 0){
        document.getElementById('customWeeks').value = stringFromWeeks(tempWeeks);
    }

    document.getElementById('lessonNameField').value = lesson.name;
    document.getElementById('roomField').value = stringFromWeeks(lesson.rooms);
    document.getElementById('teacherField').value = lesson.teacher;
    document.getElementById('notesField').value = lesson.note;
    blurMainInterface(true);
    showEditor(true);
}

function dismiss() {
    document.getElementById('singleEditorBackground').style.opacity = '0';
    document.getElementById('haha').style.opacity = '0';
    document.getElementById('errorAlert').style.opacity = '0';
    document.getElementById('codePopupBackground').style.opacity = '0';
    // document.getElementById('singleEditorBackground').style.filter = 'blur(20px)';
    // document.getElementById('singleEditorBackground').style.webkitFilter = 'blur(20px)';
    document.getElementById('singleEditorBackground').style.visibility = 'hidden';
    // document.getElementById('haha').style.filter = 'blur(20px)';
    // document.getElementById('haha').style.webkitFilter = 'blur(20px)';
    document.getElementById('haha').style.visibility = 'hidden';
    // document.getElementById('errorAlert').style.filter = 'blur(20px)';
    // document.getElementById('errorAlert').style.webkitFilter = 'blur(20px)';
    document.getElementById('errorAlert').style.visibility = 'hidden';
    // document.getElementById('codePopupBackground').style.filter = 'blur(20px)';
    // document.getElementById('codePopupBackground').style.webkitFilter = 'blur(20px)';
    document.getElementById('codePopupBackground').style.visibility = 'hidden'
    blurMainInterface(false);
}

function checkIfComplete(){
    if (tempLesson.name == ''){return 1;}
    if (tempLesson.day == -1){return 2;}
    if (tempLesson.type == ''){return 3;}
    if (tempLesson.startTime == ''){return 4;}
    if (tempLesson.stopTime == ''){return 5;}
    if (tempLesson.weeks.length == 0){
        tempLesson.weeks = [-1,-2];
        colorizeWeeks(tempLesson.weeks);
    }
    return 0;
}

function showAlert(messageID, fLevel = false){
    // blur2level(true);
    document.getElementById('alertText').innerHTML = messages[messageID];
    document.getElementById('alertDescription').innerHTML = descriptions[messageID];


    // document.getElementById('errorAlert').style.filter = 'none';
    // document.getElementById('errorAlert').style.webkitFilter = 'none';
    document.getElementById('errorAlert').style.visibility = 'visible';
    document.getElementById('errorAlert').style.opacity = '1';
    isFLevelAlert = fLevel
}

function dismissAlert(){
    blur2level(false);
    // document.getElementById('errorAlert').style.filter = 'blur(20px)';
    // document.getElementById('errorAlert').style.webkitFilter = 'blur(20px)';
    document.getElementById('errorAlert').style.opacity = '0';
    document.getElementById('errorAlert').style.visibility = 'hidden';
    // document.getElementById('mainInterface').style.filter = 'blur(8px)';
    // document.getElementById('mainInterface').style.webkitFilter = 'blur(8px)';
    if (uploading){
        uploading = false;
        showCodePopup(false);
        blurMainInterface(false);
    }
    if (isFLevelAlert){
        isFLevelAlert = false;
        blurMainInterface(false);
    }
}

function blur2level(toBlur){
    if (toBlur){
        // document.getElementById('singleEditorBackground').style.filter = 'blur(8px)';
        // document.getElementById('singleEditorBackground').style.webkitFilter = 'blur(8px)';
        // document.getElementById('codePopupBackground').style.filter = 'blur(8px)';
        // document.getElementById('codePopupBackground').style.webkitFilter = 'blur(8px)';
    } else {
        document.getElementById('singleEditorBackground').style.filter = 'none';
        document.getElementById('singleEditorBackground').style.webkitFilter = 'none';
        document.getElementById('codePopupBackground').style.filter = 'none';
        document.getElementById('codePopupBackground').style.webkitFilter = 'none';
    }
}

function openVK(){
    window.open('https://vk.com/nntuapp', '_blank').focus();
}

function sendEmail(){
    window.open('mailto:nntuapp@inbox.ru', '_blank').focus();
}

function showCodePopup(toShow){
    if (toShow){
        document.getElementById('codePopupBackground').style.filter = 'none';
        document.getElementById('codePopupBackground').style.webkitFilter = 'none';
        document.getElementById('codePopupBackground').style.visibility = 'visible'
        document.getElementById('codePopupBackground').style.opacity = '1'
    } else {
        // document.getElementById('codePopupBackground').style.filter = 'blur(20px)';
        // document.getElementById('codePopupBackground').style.webkitFilter = 'blur(20px)';
        document.getElementById('codePopupBackground').style.opacity = '0'
        document.getElementById('codePopupBackground').style.visibility = 'hidden'
    }
}

function askCode(){
    blurMainInterface(true);
    showCodePopup(true);
}

function upload(code, group = userGroup){
    uploading = true;
    showAlert(7);
    var request = new XMLHttpRequest();
    

    var startTimes = [];
    var stopTimes = [];
    var days = [];
    var weeks = [];
    var rooms = [];
    var names = [];
    var types = [];
    var teachers = [];
    var notes = [];

    for (i = 0; i < tt.length; i++){
        startTimes.push(tt[i].startTime);
        stopTimes.push(tt[i].stopTime);
        days.push(tt[i].day);
        weeks.push(stringFromWeeks(tt[i].weeks));
        rooms.push(stringFromRooms(tt[i].rooms));
        names.push(tt[i].name);
        types.push(tt[i].type);
        teachers.push(tt[i].teacher);
        notes.push(tt[i].note);
    }

    var data = JSON.stringify({
        key: postKey,
        code: code,
        groupName: group,
        startTimes: startTimes,
        stopTimes: stopTimes,
        days: days,
        weeks: weeks,
        rooms: rooms,
        names: names,
        types: types,
        teachers: teachers,
        notes: notes
    });

    console.log(data);

    request.open("POST", address, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onreadystatechange = function(){
        console.log(this)
        if (this.status == 401){
            showAlert(5);
        } else if (this.status == 200){
            showAlert(6);
        } else {
            showAlert(7);
        }
        
        // tt = [];
        // downloadedTT = JSON.parse(this.responseText);
        // for (i = 0; i < downloadedTT.days.length; i++){
        //     tt.push(new Lesson(downloadedTT.startTimes[i], downloadedTT.stopTimes[i], downloadedTT.days[i], weeksFromString(downloadedTT.weeks[i]), roomsFromString(downloadedTT.rooms[i]), downloadedTT.names[i], downloadedTT.types[i], downloadedTT.teachers[i], downloadedTT.notes[i]));
        // }
        // console.log(tt);
        // fillIn();
    };
    request.send(data);
}

function uploadButton(){
    upload(document.getElementById('codeField').value);
}


function init(){
    const tempGroup = getGroup();
    document.getElementById('days').addEventListener('mousedown', mouseDownHandler);
    if (tempGroup== '' || tempGroup == null){
        askGroup();
    } else {
        userGroup = tempGroup;
        updateGroupLabel(userGroup);
        getLocalTT();
    }
    
    loadTeachers()
}



document.onreadystatechange = function(){
    if (document.readyState == 'complete'){
        init();
    }
}

const mouseDownHandler = function(e){
    document.getElementById('days').style.cursor = 'grabbing';
    document.getElementById('days').style.userSelect = 'none'

    pos.time = Date.now()
    pos.left = document.getElementById('days').scrollLeft;
    pos.speed = 0;
    pos.acc = 0;
    pos.prevX = e.clientX;
    pos.mouseX = e.clientX;


    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
}

const mouseMoveHandler = function(e){
    const dx = e.clientX - pos.mouseX;

    const dt = Date.now() - pos.time;
    pos.time = Date.now();

    const newSpeed = (dx - pos.prevX)/dt;
    pos.acc = (newSpeed - pos.speed)/dt;
    pos.speed = newSpeed;
    pos.prevX = dx;

    document.getElementById('days').scrollLeft = pos.left - dx;
}

const mouseUpHandler = function(){
    document.getElementById('days').style.cursor = 'grab';
    document.getElementById('days').style.removeProperty('user-select');
    document.removeEventListener('mousemove', mouseMoveHandler);
    // let inert = setInterval(function(){
    //     const dt = 16;
    //     if (pos.speed == 0){
    //         clearInterval(inert);
    //     } else {
    //         pos.speed += pos.acc*dt;
    //         let newLeft = pos.left + pos.speed*dt;
    //         pos.speed = (document.getElementById('days').scrollLeft - pos.left)/dt;
    //         pos.left = newLeft;
    //         document.getElementById('days').scrollLeft = pos.left;
    //         console.log(pos.speed);
    //     }
    // }, 16);
}



function findSuggestions(keyword){
    var output = []
    for (i = 0; i < teachers.length; i ++){
        if (teachers[i].toUpperCase().includes(keyword.toUpperCase())){
            output.push(teachers[i])
        }
        if (output.length == 10){break}
    }
    teachersToShow = output
}

function showSuggestions(){
    var shouldHide = (teachersToShow.length == 0) || (document.getElementById("teacherField").value == "") || (teachersToShow.length == 1 && document.getElementById("teacherField").value == teachersToShow[0])
    if (shouldHide){
        document.getElementById('teachersContainer').style.maxHeight = '0px'
        document.getElementById('teachersContainer').style.visibility = 'hidden'
    } else {
        document.getElementById('teachersContainer').style.visibility = 'visible'
        document.getElementById('teachersContainer').style.maxHeight = '1000px'
    }
    var htmlTeachers = []
    for (i = 0; i < teachersToShow.length; i ++){
        htmlTeachers.push(`<div class = "teacherButton" onclick = "chooseSuggestion(this.innerHTML)">${teachersToShow[i]}</div>`)
    }
    document.getElementById('teachersContainer').innerHTML = htmlTeachers.join('')
}

function newKeyWord(element){
    const keyword = element.value
    findSuggestions(keyword)
    showSuggestions()
    setTempTeacher()
}

function chooseSuggestion(newTeacher){
    document.getElementById("teacherField").value = newTeacher
    findSuggestions(newTeacher)
    showSuggestions()
    setTempTeacher()
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const badData = ["", "Экологи", "Знания","Часть 1","Часть 2", "Материаловение", "Иностраннный язык", "Часть 2. Дискретная математика"]
function clearBadData(){
    for (i = 0; i < badData.length; i ++){
        if (lessons.includes(badData[i])){
            lessons.splice(lessons.indexOf(badData[i]), 1)
        }
    }
}

function findLessonSuggestions(keyword){
    var output = []
    for (i = 0; i < lessons.length; i ++){
        if (lessons[i].toUpperCase().includes(keyword.toUpperCase())){
            output.push(lessons[i])
        }
        if (output.length == 10){break}
    }
    lessonsToShow = output
}

function showLessonSuggestions(){
    var shouldHide = (lessonsToShow.length == 0) || (document.getElementById("lessonNameField").value == "") || (lessonsToShow.includes(document.getElementById("lessonNameField").value))
    if (shouldHide){
        document.getElementById('lessonsContainer').style.maxHeight = '0px'
        document.getElementById('lessonsContainer').style.visibility = 'hidden'
    } else {
        document.getElementById('lessonsContainer').style.visibility = 'visible'
        document.getElementById('lessonsContainer').style.maxHeight = '1000px'
    }
    var htmlLessons = []
    for (i = 0; i < lessonsToShow.length; i ++){
        htmlLessons.push(`<div class = "teacherButton" onclick = "chooseLessonSuggestion(this.innerHTML)">${lessonsToShow[i]}</div>`)
    }
    document.getElementById('lessonsContainer').innerHTML = htmlLessons.join('')
}

function chooseLessonSuggestion(newLesson){
    document.getElementById("lessonNameField").value = newLesson
    findLessonSuggestions(newLesson)
    showLessonSuggestions()
    changeTempLessonName()
}

function newKeyLesson(element){
    const keyword = element.value
    findLessonSuggestions(keyword)
    showLessonSuggestions()
    changeTempLessonName()
}

function loadTeachers(){
    const request = new XMLHttpRequest()
    request.open("GET", "http://nntuapp.ru/teachers.json", true)
    request.onload = function(){
        if (request.status >= 200 && request.status < 400){
            // Success!
            data = JSON.parse(request.responseText);
            for (i = 0; i < data.length; i ++){
                var counter = data[i]
                teachers.push(counter.name)
                var disc = counter.disciplines
                if (disc){
                    var tempLessons = disc.split(/(?:,|;)+/).map(function(el){
                        var output = el.replace(/}/g,")")
                        output = output.replace(/{/g, "(")
                        output = output.replace(/"/g,"")
                        output = output.trim()
                        return capitalizeFirstLetter(output)
                    })
                    if (tempLessons != [""]){
                        lessons = lessons.concat(tempLessons)
                    }
                }
            }
            lessons = [...new Set(lessons)].sort(function(a, b){
                return a.length - b.length;
            })
            clearBadData()
          } else {
            console.log("no connection")
          }
    }
    request.send()
}
