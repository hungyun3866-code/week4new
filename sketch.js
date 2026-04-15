let input, slider, btn, sel;
let isMoving = false; 
let time = 0;          
let iframeDiv, myIframe;

let inputW = 150;
let sliderW = 150;
let spacing = 20;

// 已調深、無螢光感的沈穩色票 (莫蘭迪色系)
let paletteColors = ['#98a886', '#879673', '#758261', '#97a97c', '#87986a', '#718355'];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 1. 文字輸入框 (預設為教科系)
  input = createInput('教科系');
  input.position(20, 20);
  input.size(inputW);

  // 2. 滑桿 (文字大小控制)
  slider = createSlider(15, 80, 40);
  let sliderX = 20 + inputW + spacing;
  slider.position(sliderX, 22);
  slider.size(sliderW);

  // 3. 跳動開關按鈕
  btn = createButton('逐字跳動開關');
  let btnX = sliderX + sliderW + spacing;
  btn.position(btnX, 20);
  btn.mousePressed(toggleMove);

  // 4. 下拉選單
  sel = createSelect();
  let selX = btnX + btn.width + spacing + 30; 
  sel.position(selX, 20);
  sel.option('淡江教科系', 'https://www.et.tku.edu.tw');
  sel.option('淡江大學', 'https://www.tku.edu.tw');
  sel.changed(changeWebpage); 

  // 5. 產生中央網頁 DIV (優化大小與置中)
  iframeDiv = createDiv('');
  
  // 設定寬高為比例（佔螢幕 85% 寬、80% 高）
  iframeDiv.style('width', '85%');
  iframeDiv.style('height', '80%');
  
  // 置中核心邏輯
  iframeDiv.position(windowWidth / 2, windowHeight / 2);
  iframeDiv.style('transform', 'translate(-50%, -50%)'); // 將物件中心點對齊畫面中心
  
  // 視覺美化：深綠邊框、圓角與陰影
  iframeDiv.style('background', 'white');
  iframeDiv.style('border', '3px solid #718355');
  iframeDiv.style('border-radius', '15px');
  iframeDiv.style('box-shadow', '0 15px 40px rgba(0,0,0,0.4)');
  iframeDiv.style('overflow', 'hidden');
  iframeDiv.style('z-index', '100');
  iframeDiv.style('opacity', '0.98'); 
  
  // 建立 iframe 標籤
  iframeDiv.html('<iframe id="myIframe" src="https://www.et.tku.edu.tw" style="width:100%; height:100%; border:none;"></iframe>');
  myIframe = select('#myIframe');

  textAlign(CENTER, CENTER);
}

// 切換網頁同時更新文字框
function changeWebpage() {
  let url = sel.value(); 
  let name = sel.elt.options[sel.elt.selectedIndex].text; 
  
  myIframe.attribute('src', url);
  
  if (name === '淡江教科系') {
    input.value('教科系');
  } else if (name === '淡江大學') {
    input.value('淡江大學');
  }
}

function toggleMove() {
  isMoving = !isMoving;
}

function draw() {
  background('#e0e0e0'); 

  let fontSize = slider.value();
  textSize(fontSize);
  let txt = input.value(); 

  if (txt.length > 0) {
    let charStep = fontSize * 0.8 + 5; 
    let rowHeight = fontSize * 2.8; 
    let sentenceWidth = txt.length * charStep;
    let sentenceGap = fontSize * 1.2; 
    let rowCount = 0;

    for (let y = rowHeight; y < height; y += rowHeight) {
      let xOffset = 0;
      let sentenceIndex = 0;

      while (xOffset < width + sentenceWidth) {
        for (let j = 0; j < txt.length; j++) {
          let char = txt[j];
          let col = paletteColors[(sentenceIndex * txt.length + j) % paletteColors.length];
          
          let baseX = xOffset + (j * charStep);
          let baseY = y;

          let maxJumpX = charStep * 0.7; 
          let maxJumpY = rowHeight * 0.8; 

          let jX = isMoving ? (noise(baseX * 0.01, rowCount, time) - 0.5) * maxJumpX : 0;
          let jY = isMoving ? (noise(baseX * 0.01 + 50, rowCount, time) - 0.5) * maxJumpY : 0;

          fill(col);
          text(char, baseX + jX, baseY + jY);
        }
        xOffset += sentenceWidth + sentenceGap;
        sentenceIndex++;
      }
      rowCount++;
    }
  }

  if (isMoving) {
    time += 0.02; 
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 視窗縮放時，重新定位中心
  iframeDiv.position(windowWidth / 2, windowHeight / 2);
}