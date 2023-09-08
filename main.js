import './style.css';
import Quagga from 'quagga';
import JsBarcode from 'jsbarcode';

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const quaggaCanvas = document.getElementById("quagga_canvas");
const resultText = document.getElementById("result_text");

startButton.addEventListener("click", () => {
    console.log("startButton: Started", Quagga);
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: quaggaCanvas,
        },
        decoder: {
            readers: ["ean_reader"]
        }
    }, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Initialized.");
        Quagga.start();
    });

    Quagga.onProcessed((result) => {
        if (result == null || typeof (result) != "object" || result.boxes == undefined) return;
        const ctx = Quagga.canvas.ctx.overlay;
        const canvas = Quagga.canvas.dom.overlay;
        ctx.clearRect(0, 0, parseInt(canvas.width), parseInt(canvas.height));
        Quagga.ImageDebug.drawPath(result.box,
            { x: 0, y: 1 }, ctx, { color: "blue", lineWidth: 5 });
    });

    Quagga.onDetected((result) => {
        console.log(result.codeResult.code);
        result_text.innerText = result.codeResult.code;
        JsBarcode("#js-barcode", result.codeResult.code, {format: "EAN13"});
    });
});

stopButton.addEventListener("click", () => {
    console.log("stopButton: Stopped");
    Quagga.stop();
});
