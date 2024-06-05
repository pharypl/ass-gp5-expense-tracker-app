// js code to generate colors-box enable or disable

let colorIcons = document.querySelector('.color-icons'),
icons = document.querySelector('.color-icon .icons');

icons.addEventListener("click", ()=> {​
    colorIcons.classList.toggle('open');
})

// js code to switch colors (also day night mode)
// getting all .btn elements

let buttons = document.querySelectorAll(".btn");

for(var button of buttons) {
    button.addEventListener("click", (e) => {
       console.log(e);
    })
}
