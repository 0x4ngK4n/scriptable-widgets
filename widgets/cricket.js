// Functiona and variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// Basically fetching data from espncricinfo and processing the JSON data.

const url = 'https://hs-consumer-api.espncricinfo.com/v1/pages/matches/current?latest=true'
const req = new Request(url)
const res = await req.loadJSON()
y = res.matches

//Yeah only the below teams matter to me, no offense but add your country if you'd like to see their matches as well.
//P.S. remove other entries from this list as a widget only has a limited space to display.
teams_which_matter = ['India','Australia','New Zealand', 'Pakistan', 'England', 'South Africa', 'Bangladesh', 'West Indies', 'Sri Lanka', 'Afghanistan', 'Zimbabwe']

var banner = new Array()
var toss = new Array()
var matchStatus = new Array()
var score = new Array()
var overs = new Array()
var score2 = new Array()
var overs2 = new Array()


for (i=0; i < y.length; i++) {
      if(typeof(y[i].internationalClassId) == "number") {
        if (y[i].liveInning == null) {
          continue
        }
        if (!checkDate(y[i].startDate, y[i].endDate)) {
          continue
        }
        if (!(teams_which_matter.includes(y[i].teams[0].team.name) || teams_which_matter.includes(y[i].teams[1].team.name))) {    
    continue
}
        if (y[i].teams[0].isLive || y[i].teams[0].isHome || true) {
            banner.push(y[i].series.longName)
            toss.push(y[i].statusText)
            var innings0Len = y[i].teams[0].inningNumbers.length
            var innings0 = y[i].teams[0].inningNumbers[innings0Len-1]
            var innings1Len = y[i].teams[1].inningNumbers.length
            var innings1 = y[i].teams[1].inningNumbers[innings1Len-1]
            matchStatus.push(y[i].statusEng)
            if (y[i].teams[0].score == null) {  
              score.push(y[i].teams[0].team.abbreviation + ": yet to score")  
              }
            else {
              score.push(y[i].teams[0].team.abbreviation + ": " + y[i].teams[0].score)
            }
            if (y[i].teams[0].scoreInfo == null) {
              if (innings0 > innings1) {
                overs.push("yet to start")
              }
              else {
                overs.push("completed")
              }
            }
            else {
              overs.push(y[i].teams[0].scoreInfo)
            }
          }
        if (y[i].teams[1].isLive || y[i].teams[1].isHome || true) {
          if (y[i].teams[1].score == null) {
            score2.push(y[i].teams[1].team.abbreviation + ": yet to bat")  
            }
          else {
            score2.push(y[i].teams[1].team.abbreviation + ": " + y[i].teams[1].score)
          }
          if (y[i].teams[1].scoreInfo == null) {
            if (innings0 > innings1) {
                overs2.push("yet to start")
              }
              else {
                overs2.push("completed")
              }
            }
           else {
            overs2.push(y[i].teams[1].scoreInfo)
           } 
           }
        }   
  }

/*
console.log(banner)
console.log(toss)
console.log(matchStatus)
console.log(score)
console.log(overs)
console.log(score2)
console.log(overs2)
*/

var maxLen = Math.max(banner.length, toss.length, matchStatus.length, score.length, overs.length, score2.length, overs2.length)

if (config.runsInWidget) {
        let widget = createWidget("Cricket Score Tracker", banner, toss, matchStatus, score, overs, score2, overs2, maxLen)  
        Script.setWidget(widget)  
        Script.complete()
      
}

//Ensures to display only today's or ongoing matches (if Test match)
function checkDate(startFullDate, endFullDate) {
  let d = new Date()
  let currentDay = d.getDate().toString()
  let currentMonth = (d.getMonth() + 1).toString()
  startFullDate = startFullDate.split("T")[0].toString()
  endFullDate = endFullDate.split("T")[0].toString()
  if (parseInt(currentMonth) >= parseInt(startFullDate.split("-")[1]) && parseInt(currentMonth) <= parseInt(endFullDate.split("-")[1])) {
    if (parseInt(currentDay) >= parseInt(startFullDate.split("-")[2]) && parseInt(currentDay) <= parseInt(endFullDate.split("-")[2])) {
      return true
    }
  }
  return false
}

function createRow(title, value) {
  let row = new UITableRow()
  row.addText(title)
  if (value == null) {
    row.addText("yet to start").rightAligned() 
  } else {
    row.addText(value.toString()).rightAligned()  
  }
  return row
}

function createWidget(pretitle, title, title1, title1p1, title2, title3, title4, title5, maxL) {
  let w = new ListWidget()
  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [
    new Color("1d67de"),
    new Color("253f69")
  ]
  w.backgroundGradient = gradient
  let preTxt = w.addText(pretitle)
  preTxt.textColor = Color.white()
  preTxt.textOpacity = 0.8
  preTxt.font = Font.systemFont(22)
  w.addSpacer(5)
  for (j = 0; j < maxL; j++) {
    if(typeof(title[j]) == "undefined"){
        title[j] = "--no data--"
      }
    let titleTxt = w.addText("Match: " + title[j])
    titleTxt.textColor = Color.white()
    titleTxt.font = Font.systemFont(16)
    w.addSpacer(5)
    if(typeof(title1[j]) == "undefined"){
        title1[j] = "--no data--"
      }
    let titleTxt1 = w.addText("Match Current Status: " + title1[j])
    titleTxt1.textColor = Color.white()
    titleTxt1.font = Font.systemFont(10)
    w.addSpacer(5)
    if(typeof(title1p1[j]) == "undefined"){
        title1p1[j] = "--no data--"
      }
    let titleTxt1p1 = w.addText("Match Final Status: " + title1p1[j])
    titleTxt1p1.textColor = Color.white()
    titleTxt1p1.font = Font.systemFont(10)
    w.addSpacer(5)
    if(typeof(title2[j]) == "undefined"){
        title2[j] = "--no data--"
      }
    let titleTxt2 = w.addText("Score: " + title2[j])
    titleTxt2.textColor = Color.white()
    titleTxt2.font = Font.systemFont(10)
    w.addSpacer(5)
    if(typeof(title3[j]) == "undefined"){
        title3[j] = "--no data--"
      }
    let titleTxt3 = w.addText("Overs: " + title3[j])
    titleTxt3.textColor = Color.white()
    titleTxt3.font = Font.systemFont(10)
    w.addSpacer(5)
    if(typeof(title4[j]) == "undefined"){
        title4[j] = "--no data--"
      }
    let titleTxt4 = w.addText("Score: " + title4[j])
    titleTxt4.textColor = Color.white()
    titleTxt4.font = Font.systemFont(10)
    w.addSpacer(5)
    if(typeof(title5[j]) == "undefined"){
        title5[j] = "--no data--"
      }
    let titleTxt5 = w.addText("Overs: " + title5[j])
    titleTxt5.textColor = Color.white()
    titleTxt5.font = Font.systemFont(10)
    w.addSpacer(5)
    let titleTxt6 = w.addText("--------------------------")
    titleTxt6.textColor = Color.white()
    titleTxt6.font = Font.systemFont(8)
    w.addSpacer(5)
  }
  return w
}
