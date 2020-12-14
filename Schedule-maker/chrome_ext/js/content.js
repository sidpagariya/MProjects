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
        "Arab, Armen, Pers, Turk& Islam": "AAPTIS",
        "Afroamerican & African Studies": "CAAS",
        "Ancient Civiliz & Biblical Stu": "ACABS",
        "Accounting": "ACC",
        "Air Force Officer Education": "AERO",
        "Aerospace Engineering": "AEROSP",
        "Applied Exercise Science": "AES",
        "Applied Liberal Arts": "ALA",
        "American Culture": "AMCULT",
        "American Sign Language": "RCASL",
        "Anatomy and Cell Biology": "ANAT",
        "Anatomy": "ANATOMY",
        "Anesthesia": "ANESTH",
        "Anthropological Archaeology": "ANTHRARC",
        "Anthropology,Biological": "ANTHRBIO",
        "Anthropology,Cultural": "ANTHRCUL",
        "Atmos, Oceanic & Space Sci": "AOSS",
        "Applied Physics": "APPPHYS",
        "Arab American Studies": "ARABAM",
        "Arabic Language": "ARABIC",
        "Architecture": "ARCH",
        "Armenian Language": "ARMENIAN",
        "Art and Design": "ARTDES",
        "Arts Administration": "ARTSADMN",
        "Asian Studies": "ASIAN",
        "Asian Languages": "ASIANLAN",
        "Asian/Pacific Island Amer Std": "ASIANPAM",
        "Astronomy": "ASTRO",
        "Athletic Training": "AT",
        "Automotive Engineering Program": "AUTO",
        "Baroque Cello": "BARCELLO",
        "Bassoon": "BASSOON",
        "Bioinformatics": "BIOINF",
        "Biological Chemistry": "BIOLCHEM",
        "Biology": "BIOLOGY",
        "Biomaterials": "BIOMATLS",
        "Biomedical Engineering": "BIOMEDE",
        "Biophysics": "BIOPHYS",
        "Biostatistics": "BIOSTAT",
        "Bosnian/Croatian/Serbian": "BCS",
        "Business Abroad": "BUSABRD",
        "Business Administration": "BA",
        "Business Communication": "BCOM",
        "Business Econ & Public Policy": "BE",
        "Business Information Technolog": "BIT",
        "Business Law": "BL",
        "Cancer Biology": "CANCBIO",
        "Carillon": "CARILLON",
        "Buddhist Studies": "BUDDHST",
        "Catalan": "CATALAN",
        "Cell and Developmental Biology": "CDB",
        "Cello": "CELLO",
        "Cellular And Molecular Biology": "CMBIOL",
        "Chamber Music": "CHAMBER",
        "Chemical Biology": "CHEMBIO",
        "Civil & Environmental Engin": "CEE",
        "Chemical Engineering": "CHE",
        "Chemistry": "CHEM",
        "Chinese": "CHIN",
        "Chinese Studies": "CHIN",
        "Church Music": "CHURCHMU",
        "International Comparative Std": "CICS",
        "Japanese Studies": "CJS",
        "Clarinet": "CLARINET",
        "Classical Archaeology": "CLARCH",
        "Classical Civilization": "CLCIV",
        "Climate & Meteorology": "CLIMATE",
        "Clinical Pharm Translational S": "CPTS",
        "Complex Systems": "CMPLXSYS",
        "Cognitive Science": "COGSCI",
        "Communication and Media": "COMM",
        "Communication Studies": "COMM",
        "Composition": "COMP",
        "Comparative Literature": "COMPLIT",
        "Conducting": "CONDUCT",
        "Comprehensive Studies Program": "CSP",
        "Core Courses": "RCCORE",
        "Czech": "CZECH",
        "Dance": "DANCE",
        "Data Science": "DATASCI",
        "Dental Education": "DENTED",
        "Dental Hygiene": "DENTHYG",
        "Dentistry": "DENT",
        "Dermatology": "DERM",
        "Design Science": "DESCI",
        "Digital Studies": "DIGITAL",
        "Double Bass": "DBLBASS",
        "Dutch": "DUTCH",
        "Early Music": "EARLYMUS",
        "Earth & Environmental Sciences": "EARTH",
        "Environment and Sustainability": "EAS",
        "Economics": "ECON",
        "Educ C Behavior Sci In Educ": "EDBEHAVR",
        "Education D Curriculum & Instr": "EDCURINS",
        "Educ P Prof Development": "EDPROF",
        "Education": "EDUC",
        "Ecology & Evolutionary Biology": "EEB",
        "Elec Engin & Computer Sci": "EECS",
        "Endodontics": "ENDODONT",
        "Engineering Education Research": "EER",
        "Entrepreneurship": "ENTR",
        "Environmental Health Sciences": "EHS",
        "Environ & Industrial Health": "EIHLTH",
        "English Language Institute": "ELI",
        "English Lang & Literature": "ENGLISH",
        "Engineering": "ENGR",
        "Ensemble": "ENS",
        "Environmental Sciences & Engin": "ENSCEN",
        "Environment": "ENVIRON",
        "Epidemiology": "EPID",
        "Entrepreneurial Studies": "ES",
        "Energy Systems Engineering": "ESENG",
        "European Studies": "EURO",
        "Family Medicine": "FAMMED",
        "Film and Video Studies": "FILMVID",
        "Finance": "FIN",
        "Financial Engineering Program": "FINENG",
        "Fine Arts": "RCARTS",
        "Flute": "FLUTE",
        "French": "FRENCH",
        "French Horn": "FRENHORN",
        "Film, Television, and Media": "FTVM",
        "Geography": "GEOG",
        "Geological Sciences": "GEOSCI",
        "German": "GERMAN",
        "Greek": "GREEK",
        "Modern Greek": "MODGREEK",
        "Great Books": "GTBOOKS",
        "Harp": "HARP",
        "Health & Health Care Research": "HHCR",
        "Health Behavior & Health Educ": "HBEHED",
        "Hebrew Language": "HEBREW",
        "Health and Fitness": "HF",
        "History of Art": "HISTART",
        "History": "HISTORY",
        "Hebrew & Jewish Cultural Stu": "HJCS",
        "Health Management And Policy": "HMP",
        "College Honors": "HONORS",
        "Health Sciences": "HS",
        "Human Genetics": "HUMGEN",
        "Humanities": "RCHUMS",
        "Dent Hyg Deg Complet E-Learn": "HYGDCE",
        "Immunology": "IMMUNO",
        "Immunology, Health and Society": "IHS",
        "Institute For The Humanities": "INSTHUM",
        "International Studies": "INTLSTD",
        "Internal Medicine": "INTMED",
        "Interarts Performance": "INTPERF",
        "Industrial & Operations Engin": "IOE",
        "Inteflex Medical School": "INFLXMED",
        "Integrative Systems & Design": "ISD",
        "Interdivisional": "RCIDIV",
        "International & Regional Sts": "INTLRGN",
        "Islamic Studies": "ISLAM",
        "Italian": "ITALIAN",
        "Jazz & Improvisational Studies": "JAZZ",
        "Judaic Studies": "JUDAIC",
        "Kinesiology": "KINESLGY",
        "Korean Studies": "KRSTD",
        "Languages": "RCLANG",
        "Latin Amer & Caribbean Stu": "LACS",
        "Latin": "LATIN",
        "Latina/o American Studies": "LATINOAM",
        "Law": "LAW",
        "Law, History and Communication": "LHC",
        "Learning Health Sciences": "LHS",
        "Lloyd Hall Scholars Program": "LHSP",
        "Linguistics": "LING",
        "Macromolecular Science": "MACROMOL",
        "Mathematics": "MATH",
        "Materials Science Engineering": "MATSCIE",
        "Molec, Cell & Develop Biology": "MCDB",
        "Mechanical Engineering": "MECHENG",
        "Medical School Administration": "MEDADM",
        "Medicinal Chemistry": "MEDCHEM",
        "Medical Education": "MEDEDUC",
        "Medical & Biolog Illustration": "MEDILLUS",
        "Postbac Premed Program": "MEDPREP",
        "Middle East Languages": "MELANG",
        "Medieval & Early Modern Std": "MEMS",
        "Middle Eastern & N African Stu": "MENAS",
        "Manufacturing": "MFG",
        "Microbiology": "MICRBIOL",
        "Middle East Studies": "MIDEAST",
        "Military Science": "MILSCI",
        "Marketing": "MKT",
        "Management & Organizations": "MO",
        "Movement Science": "MOVESCI",
        "Museum Studies": "MSP",
        "Music Education": "MUSED",
        "Museums": "MUSEUMS",
        "Musicology": "MUSICOL",
        "Museum Methods": "MUSMETH",
        "Music Performance": "MUSPERF",
        "Museum Practice": "MUSPRACT",
        "Musical Theatre": "MUSTHTRE",
        "Native American Studies": "NATIVEAM",
        "Natural Sciences": "RCNSCI",
        "Naval Arch & Marine Engin": "NAVARCH",
        "Naval Science": "NAVSCI",
        "Near Eastern Studies": "NEAREAST",
        "Nuclear Engin & Radiolog Sci": "NERS",
        "Near East Languages": "NESLANG",
        "Neurology": "NEUROL",
        "Neuroscience": "NEUROSCI",
        "Nat Resources & Environment": "NRE",
        "Nursing": "NURS",
        "Nutritional Sciences": "NUTR",
        "Oboe": "OBOE",
        "Obstetrics and Gynecology": "OBSTGYN",
        "Opera": "OPERA",
        "Operations & Management Sci": "OMS",
        "Ophthalmology": "OPHTH",	
        "Oral Biology": "ORALBIOL",
        "Oral Diagnosis": "ORALDIAG",
        "Oral Health Sciences": "ORALHEAL",
        "Oral Pathology": "ORALPATH",
        "Oral Surgery": "ORALSURG",
        "Organ": "ORGAN",
        "Organ Literature": "ORGANLIT",
        "Organizational Studies": "ORGSTUDY",
        "Orthodontics": "ORTHO",
        "Otorhinolaryngology": "OTO",
        "Performing Arts & Technology": "PAT",
        "Pathology": "PATH",
        "Pediatrics": "PEDIAT",
        "Pediatric Dentistry": "PEDDENT",
        "Periodontics": "PERIODON",
        "Percussion": "PERCUSS",
        "Persian Language": "PERSIAN",
        "Pharmacy": "PHARMACY",
        "Pharmaceutical Chemistry": "PHARMCHM",
        "Pharmacognosy": "PHARMCOG",
        "Pharmaceutical Sciences": "PHARMSCI",
        "Philosophy": "PHIL",
        "Pharmacology": "PHRMACOL",
        "Physical Education": "PHYSED",
        "Physics": "PHYSICS",
        "Physiology": "PHYSIOL",
        "Biomedical Sciences": "PIBS",
        "Physical Medicine & Rehab": "PMR",
        "Piano": "PIANO",
        "Piano Literature and Pedagogy": "PIANOLP",
        "Polish": "POLISH",
        "Political Science": "POLSCI",
        "Portuguese": "PORTUG",
        "Philos, Politics & Economics": "PPE",
        "Professional Nursing Education": "PNE",
        "Prosthodontics": "PROSTHOD",
        "Psychology": "PSYCH",
        "Psychiatry": "PSYCHIAT",
        "Public Health": "PUBHLTH",
        "Public Policy": "PUBPOL",
        "Rackham Graduate School": "RACKHAM",
        "Radiation Oncology": "RADONCO",
        "Radiology": "RADIOL",
        "RC Fine Arts": "RCARTS",
        "RC American Sign Language": "RCASL",
        "RC Core Courses": "RCCORE",
        "RC Humanities": "RCHUMS",
        "RC Interdivisional": "RCIDIV",
        "RC Languages": "RCLANG",
        "RC Natural Sciences": "RCNSCI",
        "RC Social Sciences": "RCSSCI",
        "Russian, E Europe & Euras Stu": "REEES",
        "Russian & E European Stu": "REES",
        "Religion": "RELIGION",
        "Restorative": "RESTORA",
        "Robotics": "ROB",
        "Robotics & Auton Vehicle Engin": "RAV",
        "Romance Languages&Literatures": "ROMLANG",
        "Romance Linguistics": "ROMLING",
        "Russian": "RUSSIAN",
        "SI Applied Data Science": "SIADS",
        "Sch of Inform Study Abroad": "SIABRD",
        "Screen Arts & Cultures": "SAC",
        "South Asian Studies": "SAS",
        "Scandinavian": "SCAND",
        "Southeast Asian Studies": "SEAS",
        "Information": "SI",
        "Slavic": "SLAVIC",
        "Sport Management": "SM",
        "Sociology": "SOC",
        "Social & Administrative Sci": "SOCADMIN",
        "Space Science & Engineering": "SPACE",
        "Spanish": "SPANISH",
        "South and Southeast Asia": "SSEA",
        "Statistics": "STATS",
        "Study Abroad": "STDABRD",
        "Strategy": "STRATEGY",
        "Surgery": "SURGERY",
        "Survey Methodology": "SURVMETH",
        "Social Sciences": "RCSSCI",
        "Social Work": "SW",
        "Sweetland Writing Center": "SWC",
        "Technical Communication": "TCHNCLCM",
        "Theory": "THEORY",
        "Theatre & Drama": "THTREMUS",
        "Technology & Operations": "TO",
        "Transcultural Studies": "TCS",
        "Trombone": "TROMBONE",
        "Trumpet-Cornet": "TRUM",
        "Tuba": "TUBA",
        "Turkish Language": "TURKISH",
        "University Arts": "UARTS",
        "University Courses": "UC",
        "Ukrainian": "UKRAINE",
        "Urban Planning": "UP",
        "Urban and Regional Planning": "URP",
        "Urban Design": "UD",
        "Urology": "UROLOGY",
        "Viola": "VIOLA",
        "Violin": "VIOLIN",
        "Voice": "VOICE",
        "Voice Literature": "VOICELIT",
        "Womens Studies": "WOMENSTD",
        "Wellness for Performing Arts": "WELLNESS",
        "Sweetland Center for Writing": "WRITING",
        "Yiddish": "YIDDISH"
    };
    var table = $("table");
    var termsched = $("#scheduler-app > div > main > div > div > div > ul > li.dropdown-header");
    if (termsched.length < 1) {
        termsched = "Schedule";
    } else {
        termsched = termsched[0].innerText;
    }
    var tbodymain = table[0];
    var jsonObj = {};
    jsonObj.title = termsched;
    var schedule = [];

    for (var i = 1; i < tbodymain.childElementCount; i+=1) {
        item = {}
        var course = tbodymain.children[i].children[0].children;
        var offset = course.length > 8 ? 1 : 0
        var courseInfo = tbodymain.children[i].children[1].children[0].children[0];
        if (courseInfo === undefined) {
            tbodymain.children[i].children[0].children[1].children[0].click()
            // tbodymain = table[0];
            courseInfo = tbodymain.children[i].children[1].children[0].children[0].children[0].children[0].children[0];
        } else {
            courseInfo = courseInfo.children[0].children[0].children[0];
        }
        classI = {}
        if (classMap[course[4+offset].innerText.trim()] === undefined) {
            classI.class = course[4+offset].innerText.trim() + " " + course[5+offset].innerText.trim();
        } else {
            classI.class = classMap[course[4+offset].innerText.trim()] + " " + course[5+offset].innerText.trim();
        }
        
        // console.log(classI.class)
        classI.sec = course[3+offset].innerText.trim();
        // console.log(classI.sec)
        if (courseInfo.children[5].childNodes[0].innerText.indexOf("Seats Open") !== -1) {
            classI.type = courseInfo.children[6].childNodes[1].innerText;
        } else {
            classI.type = courseInfo.children[5].childNodes[1].innerText;
        }
        // console.log(classI.type)
        classI.nbr = course[2+offset].innerText.trim();
        // console.log(classI.nbr)
        item.course = classI;
        var sched = course[6+offset].children[0].children[0].children;
        subscheds = [];
        locs = [];
        if (sched.length > 0 && sched[0].childElementCount > 0) {
            var subschedObj = {"days": [], "time": {}};
            for (var j = 0; j < sched.length; ++j) {
                for (var k = 0; k < sched[j].childNodes[0].childElementCount; ++k) {
                    subschedObj.days.push(sched[j].childNodes[0].childNodes[k].getAttribute("aria-label").substring(0, 2).toUpperCase());
                }
                var splStr = sched[j].childNodes[1].data.trim().split(" - ");
                subschedObj.time.from = convertTime(splStr[0]);
                subschedObj.time.to = convertTime(splStr[1]);
                splStr = sched[j].childNodes[3].data.trim().split("- ")
                locs.push(splStr[1]);
                if (subschedObj !== {}) {
                    subscheds.push(subschedObj);
                    subschedObj = {"days": [], "time": {}};
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
        var jsonO = null;
        if (location.host === "umich.collegescheduler.com") {
            if (!/(schedules|favorites)\/[a-zA-Z0-9]*/.test(location.href)) {
                alert("Please go to a valid Schedule page.");
            } else {
                jsonO = parseScheduleSB();
            }
        } else {
            jsonO = parseScheduleWA();
        }
        console.log(jsonO);
        sendResponse(jsonO);
    }
});