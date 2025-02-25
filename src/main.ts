import "./style.css";
import DiagramRenderer from "./diagram";

const main = ()=>{
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const diagram = new DiagramRenderer(canvas);

    const animate = ()=>{
        diagram.render();
        requestAnimationFrame(animate);
    }
    animate();
}


main();