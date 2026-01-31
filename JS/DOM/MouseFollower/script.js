const mousemove = document.querySelector(".mousemove");

let x,y =0;
addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    x = clientX;
    y = clientY;


});

function far (){
    console.log("hello");
    mousemove.style.transform = `translate(${x}px,${y}px)`
    requestAnimationFrame(far)
}
far()