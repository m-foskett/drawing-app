import { useEffect, useRef, useState } from "react"
// Custom Hook: useDraw(drawLine)
  // Params:
  // - drawLine: simple line drawing function using the 2d canvas context
  // Returns:
  // - canvasRef: ref for HTMLCanvasElement
  // - onMouseDown: simple mouseDown handler function
  // - clear: simple clear canvas function
export const useDraw = (onDraw: ({canvasContext, currentPoint, prevPoint}: Draw) => void) => {
    // State Variables
    const [mouseDown, setMouseDown] = useState<boolean>(false);
    const [boundingRect, setBoundingRect] = useState<Point>({x: 0, y: 0})
    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevPoint = useRef<Point | null>(null);
    // Event Handler Function: onMouseDown()
    const onMouseDown = () => setMouseDown(true);
    // Custom Function: clear()
    // - Clears the canvas
    const clear = () => {
        const canvas = canvasRef.current;
        // Guard Clause
        if(!canvas) return;

        const canvasContext = canvas.getContext('2d');
        // Guard Clause
        if(!canvasContext) return;
        // Clear the canvas
        let startingPointX = 0, startingPointY = 0;
        canvasContext.clearRect(startingPointX, startingPointY, canvas.width, canvas.height);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        // Canvas Handler
        const handler = (e: MouseEvent) => {
            // Guard Clause: If the mouse is not pressed down then return
            if (!mouseDown) return;
            // Guard Clause
            if(!canvas) return;
            // Get the current point of the cursor in the canvas
            const currentPoint = computePointInCanvas(e);
            const canvasContext = canvas?.getContext('2d');
            // Guard Clause
            if(!canvasContext || !currentPoint) return;
            let scaledCurrent: Point = {
                x: currentPoint.x * canvas.width/canvas.clientWidth,
                y: currentPoint.y * canvas.height/canvas?.clientHeight
            };
            // Call onDraw function passed as param
            onDraw({canvasContext, currentPoint: scaledCurrent, prevPoint: prevPoint.current});
            // Update the previous point to the current point
            prevPoint.current = scaledCurrent;
        }
        // Mouse Up Handler
        const mouseUpHandler = () => {
            setMouseDown(false);
            prevPoint.current = null;
        }
        // Custom Function: computePointInCanvas(e)
        // Params:
        // - e: the mouse event
        // Returns:
        // - { x, y }:
        const computePointInCanvas = (e: MouseEvent) => {
            // Guard Clause
            if(!canvas) return;
            // Get the current cursor point, both x and y coordinates
            const x = e.clientX - boundingRect.x;
            const y = e.clientY - boundingRect.y;
            return { x, y } as Point;
        }
        // Add a mouse move event listener for the canvas
        canvas?.addEventListener('mousemove', handler);
        // Add an mouse up event listener for the window
        window.addEventListener('mouseup', mouseUpHandler);
        // Remove Event Listeners
        return () => {
            canvas?.removeEventListener('mousemove', handler);
            window.removeEventListener('mouseup', mouseUpHandler);
        }
    }, [onDraw, mouseDown, boundingRect.x, boundingRect.y]);

    useEffect(() => {
        const canvas = canvasRef.current;
        // Resize Handler
        const resizeHandler = () => {
            // Guard Clause
            if(!canvas) return;
            // Get the outer dimensions of the canvas
            const rect = canvas.getBoundingClientRect();
            let point: Point = {x: rect.x, y: rect.y};
            setBoundingRect(point);
        }
        // Add a window resize event listener
        window?.addEventListener('resize', resizeHandler);
        resizeHandler();
        // Remove Event Listener
        return () => {
            window?.removeEventListener('resize', resizeHandler);
        }
    }, [boundingRect.x, boundingRect.y]);

    return { canvasRef, onMouseDown, clear };
}