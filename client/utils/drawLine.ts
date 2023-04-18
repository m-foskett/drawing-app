type DrawLineProps = Draw & {
    colour: string;
}
// Function: drawLine({canvasContext, prevPoint, currentPoint}: Draw)
// - Simple line drawing function using the 2d canvas context
// Params:
// - {canvasContext, prevPoint, currentPoint}: Draw
//    - Draw is a custom type (see typings.d.ts)
export const drawLine = ({prevPoint, currentPoint, canvasContext, colour}: DrawLineProps) => {
    // Get the x and y values of the currentPoint being drawn
    const {x: currentX, y: currentY } = currentPoint;
    // Set the lineColour of the brush
    const lineColour = colour;
    // Set the lineWidth of the brush
    const lineWidth = 5;
    // Drawing Path Creation ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Set the starting point of the path to be the previous point if it exists else use the current point
    let startPoint = prevPoint ?? currentPoint;
    canvasContext.beginPath();
    canvasContext.lineWidth = lineWidth;
    canvasContext.strokeStyle = lineColour;
    // Draw the Line from startPoint to currentPoint
    canvasContext.moveTo(startPoint.x, startPoint.y);
    canvasContext.lineTo(currentX, currentY);
    canvasContext.stroke();
    // Draw the brush stroke about the starting point
    canvasContext.fillStyle = lineColour;
    canvasContext.beginPath();
    let radius = 2, startAngle = 0, endAngle = 2 * Math.PI;
    canvasContext.arc(startPoint.x, startPoint.y, radius, startAngle, endAngle);
    canvasContext.fill();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}