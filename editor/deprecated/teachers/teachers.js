var teachers = []
var lessons = []
var teachersToShow = []
var lessonsToShow = []

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
    // findSuggestions(keyword)
    // showSuggestions()
    findLessonSuggestions(keyword)
    showLessonSuggestions()
}

function chooseSuggestion(newTeacher){
    document.getElementById("teacherField").value = newTeacher
    findSuggestions(newTeacher)
    showSuggestions()
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function clearBadData(){
    if (lessons.includes("")){
        lessons.splice(lessons.indexOf(""), 1)
    }
    if (lessons.includes("Экологи")){
        lessons.splice(lessons.indexOf("Экологи"), 1)
    }
    if (lessons.includes("Знания")){
        lessons.splice(lessons.indexOf("Знания"), 1)
    }
    if (lessons.includes("Часть 1")){
        lessons.splice(lessons.indexOf("Часть 1"), 1)
    }
    if (lessons.includes("Часть 2")){
        lessons.splice(lessons.indexOf("Часть 2"), 1)
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
    var shouldHide = (lessonsToShow.length == 0) || (document.getElementById("lessonNameField").value == "") || (lessonsToShow.length == 1 && document.getElementById("lessonNameField").value == lessonsToShow[0])
    if (shouldHide){
        document.getElementById('lessonsContainer').style.maxHeight = '0px'
        document.getElementById('lessonsContainer').style.visibility = 'hidden'
    } else {
        document.getElementById('lessonsContainer').style.visibility = 'visible'
        document.getElementById('lessonsContainer').style.maxHeight = '1000px'
    }
    var htmlLessons = []
    for (i = 0; i < lessonsToShow.length; i ++){
        htmlLessons.push(`<div class = "teacherButton" onclick = "chooseSuggestion(this.innerHTML)">${lessonsToShow[i]}</div>`)
    }
    document.getElementById('lessonsContainer').innerHTML = htmlLessons.join('')
}

function loadTeachers(){
    const request = new XMLHttpRequest()
    request.open("GET", "https://nntuapp.site/teachers.json", true)
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

loadTeachers()