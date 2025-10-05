let cStage = document.getElementById("colorStage")
let cButton = document.getElementById("colorButton")


const qImage = document.getElementById("quokkaImage")
const qButton = document.getElementById("imageToggle")

let changeColor = function() 
{
    let rComp = Math.random() * 255
    let gComp = Math.random() * 255
    let bComp = Math.random() * 255

    cStage.style.backgroundColor = "rgb(" + rComp + ", " + gComp + ", " + bComp + ")"
}

let toggleImage = () =>
{
    console.log(qImage.src)
    if(qImage.src.includes("quokka1")) {
        qImage.src = "images/quokka2.jpg"
    }
    else {
        qImage.src = "images/quokka1.jpg"
    }
}

qButton.addEventListener("click", toggleImage)
cButton.addEventListener("click", changeColor);
window.addEventListener("load", changeColor)