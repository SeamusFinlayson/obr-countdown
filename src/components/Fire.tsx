import { useEffect, useState } from "react";
import "./fire.css";

const randomArray: number[] = [];
for (let i = 0; i < 100; i++) {
  randomArray.push(Math.random());
}

const getParticles = (quantity: number) => {
  const particles: React.ReactNode[] = [];
  for (let i = 0; i < quantity; i++) {
    particles.push(
      <div
        key={i}
        className="particle"
        data-index={i}
        data-animation-delay={`${randomArray[i] * 2}s`}
      />,
    );
  }
  return particles;
};

export default function Fire({
  progress,
  text,
}: {
  progress: number;
  text: string;
}) {
  const quantity = Math.ceil((progress / 100) * 30);
  const [particles, setParticles] = useState(getParticles(quantity));
  useEffect(() => {
    setParticles(getParticles(quantity));
  }, [quantity]);

  return (
    <div className="grid place-items-center">
      <div className="text-shadow-fire z-20 col-start-1 row-start-1">
        {text}
      </div>
      {/* <div className="z-10 col-start-1 row-start-1 h-4 w-8 bg-black blur-sm"></div> */}
      <div className="z-0 col-start-1 row-start-1">
        <div className="flex justify-center">
          <div className="fire" data-parts={quantity}>
            {particles}
          </div>
        </div>
      </div>
    </div>
  );
}
