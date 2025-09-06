export function prepareBackground() {
    const canvas = document.getElementById("background");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 300; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2;
        const alpha = 0.5 + Math.random() * 0.5;
        const colors = ["white", "#aaf", "#ffa"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fill();
    }
}