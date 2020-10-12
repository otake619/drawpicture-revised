//描画領域に関するcanvasの設定
let canvas = document.getElementById("picture");
let ctx = canvas.getContext("2d");
//ダウンロードに関する入力ボタンを取得
let downloadCanvas = document.getElementById("download");
//右クリックを離す、またはcanvas外へ出てしまう前の描画座標
let xPosition = null;
let yPosition = null;
//右クリックを押し続けているかのフラグ
let isHold = false;
//canvasのエリア内にいるかのフラグ
let isArea = false;
//canvasに描画された内容をpngでダウンロード
downloadCanvas.onclick = download();
//描画する線の色
let drawingColor;
//描画する線の太さ
let drawingWidth;
//カラーコードを設定
const RED = "#ff0000";
const BLACK = "#000000";
const WHITE = "#ffffff";
const PURPLE = "#800080";
const GREEN = "#008000";
const AQUA = "#00ffff";
const GRAY = "#808080";
const BLUE = "#0000ff";

//画面描画後の処理
window.addEventListener('load', () => {
    //canvas要素の大きさを指定(単位はpx)
    canvas.width = 700;
    canvas.height = 600;
    
    //描画する線の太さ(初期設定は5.0)
    drawingWidth = 5.0;
    //ペイントの初期設定(最初は黒)
    drawingColor = "#000000";
    //現在の色を表示
    document.getElementById("currentColor").style.backgroundColor = drawingColor;
});

//各色カラーパレットを選択後の処理
document.getElementById("red").addEventListener('click', () => {
  changeColor(RED);
});
document.getElementById("black").addEventListener('click', () => {
  changeColor(BLACK);
});
document.getElementById("aqua").addEventListener('click', () => {
  changeColor(AQUA);
});
document.getElementById("purple").addEventListener('click', () => {
  changeColor(PURPLE);
});
document.getElementById("white").addEventListener('click', () => {
  changeColor(WHITE);
});
document.getElementById("gray").addEventListener('click', () => {
  changeColor(GRAY);
});
document.getElementById("green").addEventListener('click', () => {
  changeColor(GREEN);
});
document.getElementById("blue").addEventListener('click', () => {
  changeColor(BLUE);
});

//線の太さを変更
document.getElementById("width").onclick = changeWidth;
//リセットボタンを選択
document.getElementById("reset").onclick = reset;

/**
 * ペンの色を指定したカラーコードに変更する
 * @param  {string} colorCode カラーコード文字列
 * @return {void}
 */
function changeColor(colorCode){
  //ペイントの色を指定したカラーコードへ変更
  drawingColor = colorCode;
  // 白の場合は透明で塗りつぶしする
  if (colorCode !== WHITE) {
    sourceOver();
  } else {
    destinationOut();
  }
  //現在の色を表示
  displayColor();
}

canvas.addEventListener('mousedown', (event) => {
    drawStart(event);
    draw(event);
});

canvas.addEventListener('mouseup', () => {
    mouseout();
});

canvas.addEventListener('mousemove', (event) => {
    draw(event);
});
//canvas領域外に出た時の処理
document.addEventListener('mousemove', (event) => {
    if(!event.target.closest('#picture')) {
      outOfArea();
      console.log(isArea);
    } else {
      isArea = true;
      console.log(isArea);
    }
});

//canvas領域に描画された内容をpng画像へと変換
function download() {
    let download = document.getElementById("download");
    let image = document.getElementById("picture").toDataURL("image/png").replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}

//canvas要素に描画する
function draw(e){
    //右クリックが押されていた時だけ描画
    if(isHold === true && isArea === true){
        //座標設定
        x = e.layerX;
        y = e.layerY;
        //線の太さ
        ctx.lineWidth = drawingWidth;
        //ペイントする際の先端の形状
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        //描画に関する色設定
        ctx.strokeStyle = drawingColor;
        //描画する始点をxPosition,yPositionへ変更
        ctx.moveTo(x, y);
        //パスを繋ぐメソッド
        ctx.lineTo(xPosition, yPosition);
        //パスを描画する

        ctx.stroke();
        //次の描画位置
        xPosition = x;
        yPosition = y;
    } else {
        //右クリックが離されていたら、描画しない
        //設定を変更することもあり得るため、関数を抜ける
        return;
    }
}

function changeWidth(){
    //描画する線の太さ
    drawingWidth = document.getElementById("width").value;
}

//描画された内容を消去
function reset(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//右クリックが押されて、描画が開始した状態
function drawStart(e){
    isHold = true;
    //canvasに新しくパスを作成
    ctx.beginPath();
    //カーソルをペンの画像へ変更
    document.body.style.cursor = "url(./image/pen.png), auto";
    //イベントが起きた座標を取得
    xPosition = e.layerX;
    yPosition = e.layerY;
}

//右クリックから指が離れた状態
function mouseout(){
    isHold = false;
    //作成したパスを閉じる
    ctx.closePath();
    //マウスカーソルの形状をデフォルトへ戻す
    document.body.style.cursor = "auto";
    //座標をリセット
    xPosition = null;
    yPosition = null;
}

//canvas範囲外にマウスが出た時
function outOfArea(){
  isArea = false;
  isHold = false;
  //マウスカーソルの形状をデフォルトへ戻す
  document.body.style.cursor = "auto";
}

//現在編集中の色を表示
function displayColor(){
    //現在の色を表示
    document.getElementById("currentColor").style.backgroundColor = drawingColor;
}

function sourceOver(){
    //描画の方法。
    //線が重なった場合、新規の線が一番上に表示される。
    ctx.globalCompositeOperation = 'source-over';
}

function destinationOut(){
    ctx.globalCompositeOperation = 'destination-out';
}