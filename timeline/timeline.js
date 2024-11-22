const CODE_SAMPLES = {
    fortran: `program hello
    print *, 'Hello, World!'
end program hello`,

    cobol: `IDENTIFICATION DIVISION.
PROGRAM-ID. HELLOWORLD.
PROCEDURE DIVISION.
MAIN.
    DISPLAY 'Hello, World!'.
    STOP RUN.`,

    basic: `10 PRINT "Hello, World!"
20 END`,

    c: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,

    smalltalk: `Transcript show: 'Hello, World!'.`,

    cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!";
    return 0;
}`,

    python: `print("Hello, World!")`,

    java: `class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!"); 
    }
}`,
    
    javascript: `console.log("Hello, World!");`,

    php: `<?php echo 'Hello, World!'; ?>`,

    csharp: `public class Program {
    public static void Main(string[] args) {
        System.Console.WriteLine("Hello, World!");
    }
}`,
    
    rust: `fn main() {
    println!("Hello, World!");
}`
};


var codeSampleShown = false;
var lastLanguage = "nothing";

const delay = ms => new Promise(res => setTimeout(res, ms));


function drawLines() {
    const boxes = document.querySelectorAll('.timeline-box');
    const svg = document.getElementById('svg-lines');
    
    svg.innerHTML = '';  // Clear previous lines

    boxes.forEach((box, index) => {
        if (index < boxes.length - 1) {
            const startX = box.offsetLeft + box.offsetWidth / 2;
            const startY = box.offsetTop + box.offsetHeight;
            const nextBox = boxes[index + 1];
            const endX = nextBox.offsetLeft + nextBox.offsetWidth / 2;
            const endY = nextBox.offsetTop;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', startX);
            line.setAttribute('y1', startY);
            line.setAttribute('x2', endX);
            line.setAttribute('y2', endY);
            line.setAttribute('stroke', 'black');
            line.setAttribute('stroke-width', '1');

            svg.appendChild(line);
        }
    });
}

async function clickTimelineBox(box) {
    const timeline = document.getElementById('timeline');
    const codeDisplay = document.getElementById('code-display');
    const codeSample = document.getElementById('code-sample');

    timeline.style.transform = 'translateX(-55%)';    

    const language = box.dataset.code;
    if (codeSampleShown) {
        if (language === lastLanguage) {
            hideCodeSample();
            return;
        }
        codeDisplay.classList.add('hidden')
        await delay(250);
    }
    else {
        await delay(500);
    }
    
    codeSample.textContent = CODE_SAMPLES[language];
    codeDisplay.style.left = '50%';
    const boxRect = box.getBoundingClientRect()
    const boxOffsetTop = boxRect.top + window.scrollY;
    codeDisplay.style.top = `${boxOffsetTop}px`;
    
    codeSample.classList.remove(`language-${lastLanguage}`);
    codeSample.classList.add(`language-${language}`);
    delete codeSample.dataset.highlighted;
    hljs.highlightElement(codeSample);
    
    lastLanguage = language;

    codeDisplay.classList.remove('hidden');
    
    codeSampleShown = true;
}


async function hideCodeSample() {
    const timeline = document.getElementById('timeline');
    const codeDisplay = document.getElementById('code-display');

    codeDisplay.classList.add('hidden');

    await delay(250)
    codeDisplay.style.left = '-1000px';  // move far off screen
    codeDisplay.style.top = '-1000px';
    timeline.style.removeProperty('transform')

    codeSampleShown = false;
}


function setupTimelineBox() {
    const closeButton = document.getElementById('code-display-close-button');

    closeButton.onclick = hideCodeSample

    document.querySelectorAll('.timeline-box').forEach(box => {
        box.addEventListener('click', () => clickTimelineBox(box));
    });
}


document.addEventListener('DOMContentLoaded', () => {
    drawLines();
    setupTimelineBox();
});