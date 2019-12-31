function convertTime(time){
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/am|pm|AM|PM/);
    if (AMPM !== null && AMPM !== undefined) {
        AMPM = AMPM[0];
        if((AMPM === "PM" || AMPM === "pm") && hours<12) hours = hours+12;
        if((AMPM === "AM" || AMPM === "am") && hours===12) hours = hours-12;
    }
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if(hours<10) sHours = "0" + sHours;
    if(minutes<10) sMinutes = "0" + sMinutes;
    return {hr:+sHours,min:+sMinutes};
}
function parseScheduleWA(){
    var tbody = $('[id="STDNT_WEEK_SCHD$scroll$0"]', $('#ptifrmtgtframe')[0].contentWindow.document).children()[0];
    var termsched = tbody.firstElementChild.firstElementChild.firstElementChild.innerText
    var tbodymain = tbody.children[1].firstElementChild.firstElementChild.firstElementChild
    var jsonObj = {};
    jsonObj.title = termsched;
    var schedule = [];
    var offset = 0;
    if (tbodymain.children[0].children.length != 2){
        offset = 1;
    }
    for (var i=1; i<tbodymain.childElementCount; i++){
        item = {}
        var course = tbodymain.children[i].children[0+offset].firstElementChild.innerText.split('\n');
        classI = {}
        classI.class = course[0].split("-")[0];
        classI.sec = course[0].split("-")[1];
        classI.type = course[1].split(" ")[0];
        classI.nbr = course[1].split(" ")[1].slice(1, -1);
        item.course = classI;
        var sched = tbodymain.children[i].children[1+offset].firstElementChild.innerText.split('\n');
        subscheds = [];
        locs = [];
        for (var j=0; j<sched.length; j+=2){
            subschedObj = {};
            days = sched[j].split(" ")[0].split(/(?=[A-Z])/);
            subschedObj.days = days.map(function(e){return e.toUpperCase()});
            time = {}
            try {
                time.from = convertTime(sched[j].split(" ")[1]);
                time.to = convertTime(sched[j].split(" ")[3]);
            }
            catch(err) {
                // this means time is not provided
                continue;
            }
            subschedObj.time = time;
            subscheds.push(subschedObj)
            locs.push(sched[j+1]);
        }
        item.sched = subscheds;
        item.location = locs;
        schedule.push(item);
    }
    jsonObj.schedule = schedule;
    return jsonObj;
}

function parseScheduleSB(){
    var classMap = {
        "Accounting": "",
        "Aerospace Engineering": "AEROSP",
        "Afroamerican & African Studies": "AAS",
        "Air Force Officer Education": "AERO",
        "American Culture": "AMCULT",
        "American Sign Language": "RCASL",
        "Anatomy": "ANATOMY",
        "Anesthesia": "",
        "Anthropological Archaeology": "",
        "Anthropology,Biological": "",
        "Anthropology,Cultural": "",
        "Applied Exercise Science": "",
        "Applied Liberal Arts": "",
        "Applied Physics": "",
        "Arab American Studies": "",
        "Arabic Language": "",
        "Architecture": "",
        "Armenian Language": "",
        "Art and Design": "",
        "Art and Design Study Abroad": "",
        "Arts Administration": "",
        "Asian Languages": "ASIANLAN",
        "Asian Studies": "",
        "Asian/Pacific Island Amer Std": "",
        "Astronomy": "",
        "Athletic Training": "",
        "Automotive Engineering Program": "",
        "Baroque Cello": "",
        "Bassoon": "",
        "Bioinformatics": "",
        "Biological Chemistry": "",
        "Biology": "BIO",
        "Biomaterials": "",
        "Biomedical Engineering": "",
        "Biomedical Sciences": "",
        "Biophysics": "",
        "Biostatistics": "",
        "Bosnian/Croatian/Serbian": "",
        "Business Abroad": "",
        "Business Administration": "",
        "Business Communication": "",
        "Business Econ & Public Policy": "",
        "Business Law": "",
        "Cancer Biology": "",
        "Carillon": "",
        "Catalan": "",
        "Cell and Developmental Biology": "",
        "Cello": "",
        "Cellular And Molecular Biology": "",
        "Chamber Music": "",
        "Chemical Biology": "",
        "Chemical Engineering": "",
        "Chemistry": "CHEM",
        "Chinese Studies": "",
        "Civil & Environmental Engin": "",
        "Clarinet": "",
        "Classical Archaeology": "",
        "Classical Civilization": "",
        "Climate & Meteorology": "",
        "Clinical Pharm Translational S": "",
        "Cognitive Science": "",
        "College Honors": "",
        "Communication Studies": "",
        "Comparative Literature": "",
        "Complex Systems": "",
        "Composition": "",
        "Comprehensive Studies Program": "",
        "Conducting": "",
        "Core Courses": "",
        "Czech": "",
        "Dance": "",
        "Dent Hyg Deg Complet E-Learn": "",
        "Dental Education": "",
        "Dental Hygiene": "",
        "Dentistry": "",
        "Design Science": "",
        "Digital Studies": "",
        "Double Bass": "",
        "Dutch": "",
        "Early Music": "",
        "Earth & Environmental Sciences": "",
        "Ecology & Evolutionary Biology": "",
        "Economics": "",
        "Educ C Behavior Sci In Educ": "",
        "Education": "",
        "Elec Engin & Computer Sci": "EECS",
        "Endodontics": "",
        "Energy Systems Engineering": "",
        "Engineering": "ENGR",
        "Engineering Education Research": "",
        "English Lang & Literature": "",
        "English Language Institute": "",
        "Ensemble": "",
        "Entrepreneurial Studies": "",
        "Entrepreneurship": "",
        "Environment": "",
        "Environment and Sustainability": "",
        "Environmental Health Sciences": "",
        "Environmental Sciences & Engin": "",
        "Epidemiology": "",
        "European Studies": "",
        "Family Medicine": "",
        "Film, Television, and Media": "",
        "Finance": "",
        "Fine Arts": "",
        "Flute": "",
        "French": "",
        "French Horn": "",
        "Geography": "",
        "German": "",
        "Great Books": "",
        "Greek": "",
        "Harp": "",
        "Health & Health Care Research": "",
        "Health Behavior & Health Educ": "",
        "Health Management And Policy": "",
        "Health Sciences": "",
        "Hebrew Language": "",
        "History": "",
        "History of Art": "",
        "Human Genetics": "",
        "Humanities": "",
        "Immunology": "",
        "Immunology, Health and Society": "",
        "Industrial & Operations Engin": "",
        "Information": "",
        "Institute For The Humanities": "",
        "Inteflex Medical School": "",
        "Integrative Systems & Design": "",
        "Interarts Performance": "",
        "Interdivisional": "",
        "Internal Medicine": "",
        "International & Regional Sts": "",
        "International Studies": "",
        "Islamic Studies": "",
        "Italian": "",
        "Japanese Studies": "",
        "Jazz & Improvisational Studies": "",
        "Judaic Studies": "",
        "Kinesiology": "",
        "Korean Studies": "",
        "Languages": "",
        "Latin": "",
        "Latin Amer & Caribbean Stu": "",
        "Latina/o American Studies": "",
        "Law": "",
        "Learning Health Sciences": "",
        "Linguistics": "",
        "Lloyd Hall Scholars Program": "",
        "Macromolecular Science": "",
        "Management & Organizations": "",
        "Manufacturing": "",
        "Marketing": "",
        "Materials Science Engineering": "",
        "Mathematics": "MATH",
        "Mechanical Engineering": "",
        "Medical Education": "",
        "Medical School Administration": "",
        "Medicinal Chemistry": "",
        "Medieval & Early Modern Std": "",
        "Microbiology": "",
        "Middle East Languages": "",
        "Middle East Studies": "",
        "Middle Eastern & N African Stu": "",
        "Military Science": "",
        "Modern Greek": "",
        "Molec, Cell & Develop Biology": "",
        "Movement Science": "",
        "Museum Studies": "",
        "Museums": "",
        "Music Education": "",
        "Music Performance": "",
        "Musical Theatre": "",
        "Musicology": "MUSICOL",
        "Native American Studies": "",
        "Natural Sciences": "",
        "Naval Arch & Marine Engin": "",
        "Naval Science": "",
        "Neurology": "",
        "Neuroscience": "",
        "Nuclear Engin & Radiolog Sci": "",
        "Nursing": "",
        "Nutritional Sciences": "",
        "Oboe": "",
        "Opera": "",
        "Oral Biology": "",
        "Oral Diagnosis": "",
        "Oral Health Sciences": "",
        "Oral Pathology": "",
        "Oral Surgery": "",
        "Organ": "",
        "Organ Literature": "",
        "Organizational Studies": "",
        "Orthodontics": "",
        "Otorhinolaryngology": "",
        "Pathology": "",
        "Pediatric Dentistry": "",
        "Pediatrics": "",
        "Percussion": "",
        "Performing Arts & Technology": "",
        "Periodontics": "",
        "Persian Language": "",
        "Pharmaceutical Sciences": "",
        "Pharmacology": "",
        "Pharmacy": "",
        "Philos, Politics & Economics": "",
        "Philosophy": "",
        "Physical Education": "",
        "Physical Medicine & Rehab": "",
        "Physics": "",
        "Physiology": "",
        "Piano": "",
        "Piano Literature and Pedagogy": "",
        "Polish": "",
        "Political Science": "",
        "Portuguese": "",
        "Postbac Premed Program": "",
        "Professional Nursing Education": "",
        "Prosthodontics": "",
        "Psychology": "",
        "Public Health": "",
        "Public Policy": "",
        "Rackham Graduate School": "",
        "Radiology": "",
        "Religion": "",
        "Restorative": "",
        "Robotics": "ROB",
        "Robotics & Auton Vehicle Engin": "",
        "Romance Languages&Literatures": "",
        "Romance Linguistics": "",
        "Russian": "",
        "Russian, E Europe & Euras Stu": "",
        "Sacred Music": "",
        "Scandinavian": "",
        "Sch of Inform Study Abroad": "",
        "SI Applied Data Science": "",
        "Slavic": "",
        "Social Sciences": "",
        "Social Work": "",
        "Sociology": "",
        "South Asian Studies": "",
        "Southeast Asian Studies": "",
        "Space Science & Engineering": "",
        "Spanish": "",
        "Sport Management": "",
        "Statistics": "STATS",
        "Strategy": "",
        "Study Abroad": "",
        "Survey Methodology": "",
        "Sweetland Center for Writing": "",
        "Technical Communication": "TCHNCLCM",
        "Technology & Operations": "",
        "Theatre & Drama": "",
        "Theory": "",
        "Transcultural Studies": "",
        "Trombone": "",
        "Trumpet-Cornet": "",
        "Tuba": "",
        "Turkish Language": "",
        "Ukrainian": "",
        "University Arts": "",
        "University Courses": "",
        "Urban and Regional Planning": "",
        "Urban Design": "",
        "Urology": "",
        "Viola": "",
        "Violin": "",
        "Voice": "",
        "Voice Literature": "",
        "Wellness for Performing Arts": "",
        "Womens Studies": "",
        "Yiddish": ""
    };

    // $("#content > div.schedule-show > div.row.section-grid-row.hidden-sm.hidden-xs.show-for-print > div > table > tbody > tr > td.persist.col-icons > ul > li > button").each(function(){this.click()})
    var table = $('#content > div.schedule-show > div.row.section-grid-row.hidden-sm.hidden-xs.show-for-print > div > table');
    var termsched = $("#content > div.schedule-show > div.schedule-actions-container > div > div.row.bottom5.hidden-print > div.col-md-5.col-xs-9.pagination-row.no-padding-left.no-padding-right.hidden-acc.pull-right.view-button-container > span > div > ul > li.dropdown-header")[0].innerText;
    var tbodymain = table.children()[1];
    var jsonObj = {};
    jsonObj.title = termsched;
    var schedule = [];

    for (var i = 0; i < tbodymain.childElementCount; i+=2) {
        item = {}
        var course = tbodymain.children[i].children;
        var courseInfo = tbodymain.children[i+1];
        if (courseInfo === undefined || (courseInfo.getAttribute("data-id") !== null && courseInfo.getAttribute("data-id") !== "")) {
            tbodymain.children[i].children[1].children[0].children[0].children[0].click();
            tbodymain = table.children()[1];
            courseInfo = tbodymain.children[i+1].children[0].children[0].children[0].children[0].children[0];
        } else {
            courseInfo = courseInfo.children[0].children[0].children[0].children[0];
        }
        classI = {}
        classI.class = classMap[course[5].innerText.trim()] + " " + course[6].innerText.trim();
        classI.sec = course[4].innerText.trim();
        classI.type = courseInfo.children[5].childNodes[1].data;
        classI.nbr = course[3].innerText.trim();
        item.course = classI;
        var sched = course[7].children[0];
        subscheds = [];
        locs = [];
        if (sched !== undefined) {
            sched = sched.childNodes;
            var subschedObj = {"days": [], "time": {}};
            for (var j = 1; j < sched.length; ++j) {
                if (sched[j].nodeName === "SPAN"){
                    subschedObj.days.push(sched[j].getAttribute("aria-label").substring(0, 2).toUpperCase());
                } else {
                    var time = {};
                    var splStr = sched[j].data.trim().split(" - ");
                    subschedObj.time.from = convertTime(splStr[0]);
                    subschedObj.time.to = convertTime(splStr[1]);
                    locs.push(splStr[2]);
                    if (subschedObj !== {}) {
                        subscheds.push(subschedObj);
                        subschedObj = {"days": [], "time": {}};
                    }
                }
            }
        }
        item.sched = subscheds;
        item.location = locs;
        schedule.push(item);
    }
    jsonObj.schedule = schedule;
    return jsonObj;
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.msg === 'get_userdata') {
        var jsonO;
        if (location.host === "umich.collegescheduler.com") {
            jsonO = parseScheduleSB();
        } else {
            jsonO = parseScheduleWA();
        }
        console.log(jsonO);
        sendResponse(jsonO);
    }
});