import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

interface PhysicsImageProps {
  src: string;
  width?: number;
  height?: number;
  boxWidth?: number; // ✅ must be here
  boxHeight?: number; // ✅ must be here
}

const PhysicsImage: React.FC<PhysicsImageProps> = ({
  src,
  width = 50,
  height = 50,
  boxWidth = 400,
  boxHeight = 400,
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create();

    const render = Render.create({
      element: sceneRef.current!,
      engine,
      options: {
        width: boxWidth,
        height: boxHeight,
        wireframes: false,
        background: "transparent",
      },
    });

    const imageBody = Bodies.rectangle(
      boxWidth / 2,
      boxHeight / 2,
      width,
      height,
      {
        restitution: 0.8,
        render: {
          sprite: {
            texture: src,
            xScale: width / 100,
            yScale: height / 100,
          },
        },
      }
    );

    const walls = [
      Bodies.rectangle(boxWidth / 2, 0, boxWidth, 20, { isStatic: true }),
      Bodies.rectangle(boxWidth / 2, boxHeight, boxWidth, 20, {
        isStatic: true,
      }),
      Bodies.rectangle(0, boxHeight / 2, 20, boxHeight, { isStatic: true }),
      Bodies.rectangle(boxWidth, boxHeight / 2, 20, boxHeight, {
        isStatic: true,
      }),
    ];

    World.add(engine.world, [imageBody, ...walls]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, { mouse });
    World.add(engine.world, mouseConstraint);

    Engine.run(engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [src, width, height, boxWidth, boxHeight]);

  return <div ref={sceneRef} />;
};

export default PhysicsImage;
