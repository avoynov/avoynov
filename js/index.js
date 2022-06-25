
const styles = ["css/style.css", "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"];
const scripts = [];
const svgs = ["outline", "about", "skills"];


const templateHtmls = {};

function importAll() {
    // import needed modules
    styles.forEach((styleHref, index) => {
        const link = document.createElement("link");
        link.addEventListener("load", () => {
            moduleLoaded(index+1);
        });
        link.setAttribute("href", styleHref);
        link.setAttribute("rel", "stylesheet");
        document.head.appendChild(link);
    });

    scripts.forEach((src, index) => {
        const script = document.createElement("script");
        script.addEventListener("load", () => {
            moduleLoaded(styles.length + index + 1);
        });
        script.setAttribute("src", src);
        document.head.appendChild(script);
    });

    svgs.forEach((svgName, index) => {
        const path = svgName + ".txt";
        fetch("resources/" + path)
            .then(resp => resp.blob() )
            .then(blob => blob.text() )
            .then(text => {
                document.getElementById(svgName).innerHTML = text;
                moduleLoaded(index + styles.length + scripts.length + 1);
            });

        fetch("resources/" + svgName + "html.txt")
            .then(resp => resp.blob() )
            .then(blob => blob.text() )
            .then(text => {
                templateHtmls[svgName] = text;
                moduleLoaded(index + svgs.length + styles.length + scripts.length + 1);
            });
    });
}


const loadedModules = [];
let allModulesLoaded = false;

// Work out the expected sumation of the number of modules
// I'm using sumation to make sure that not only the correct number of modules
// are loaded, but also that the correct ones are loaded - eg not that one is loaded twice
const totalModules = scripts.length + svgs.length*2 + styles.length;
const expectedSumation = (totalModules + 1) / 2 * totalModules;

const progressBar = document.getElementById("progress");
function moduleLoaded(moduleNumber) {
    loadedModules.push(moduleNumber);

    // if all modules loaded, remove loading screen
    const modSumation = loadedModules.reduce(
        (prev, cur) => {
            return prev + cur;
        },
        0
    );

    const prog = loadedModules.length/totalModules;
    progressBar.style.setProperty("--prog", prog);

    if(expectedSumation === modSumation) {
        // All required modules have loaded
        const allModulesLoaded = true;
        setTimeout(loadInContent, 750);
    }
}


function iconPress(iconName) {
    history.pushState(undefined, iconName, iconName);
}






const loader = document.getElementById("loader");
const content = document.getElementById("content");
async function loadInContent() {
    loader.style.opacity = 0;
    await sleep(350);
    loader.style.display = "none";
    content.style.opacity = 1;
    const template = document.getElementById("main-content-template");

    const currentHistoryState = location.pathname.split("\/").splice(-1)[0] || "outline";
    setMainScreenContent(templateHtmls[currentHistoryState] || "Error 404");
}


document.addEventListener("popstate", e => {
    console.log(e);
});



importAll();



function sleep(ms) {
    return new Promise(done => {
        setTimeout(done, ms);
    });
}


const mainScreen = document.getElementById("main-screen");

async function setMainScreenContent(innerHTML) {
    mainScreen.classList.add("fade-out");
    await sleep(300);
    mainScreen.innerHTML = innerHTML;
    mainScreen.classList.remove("fade-out");
}









document.getElementById("logo").addEventListener("click", () => {
    document.documentElement.style.setProperty("--clr-accent", "rgb(134, 182, 255)");
});
