import { useEffect, useState } from "react";
import "./fire.css";
import { getParticleCount } from "../utils";

const getRandomArray = (length: number) => {
  const randomArray: number[] = [];
  for (let i = 0; i < length; i++) {
    randomArray.push(Math.random());
  }
  return randomArray;
};

const getParticles = (particleCount: number, randomArray: number[]) => {
  if (randomArray.length < particleCount)
    throw new Error("randomArray to short");
  const particles: React.ReactNode[] = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(
      <div
        key={"fire" + i}
        className="fire-particle"
        data-index={i}
        data-animation-delay={`${randomArray[i] * 2}s`}
      />,
    );
  }
  return particles;
};

const MAXIMUM_PARTICLES = 30;

export default function Fire({
  progress,
  text,
  paused,
}: {
  progress: number;
  text: string;
  paused: boolean;
}) {
  const particleCount = getParticleCount(progress);

  const [randomArray, setRandomArray] = useState(
    getRandomArray(MAXIMUM_PARTICLES),
  );
  useEffect(() => {
    if (particleCount === 0) setRandomArray(getRandomArray(MAXIMUM_PARTICLES));
  }, [particleCount]);

  const [particles, setParticles] = useState(
    getParticles(particleCount, randomArray),
  );
  useEffect(() => {
    if (!paused || particleCount < particles.length) {
      setParticles(getParticles(particleCount, randomArray));
    }
  }, [particleCount, particles.length, paused, randomArray]);

  return (
    <div className="grid place-items-center">
      <div className="z-20 col-start-1 row-start-1 text-shadow-sm">{text}</div>
      {/* <div className="z-10 col-start-1 row-start-1 h-4 w-8 bg-black blur-sm"></div> */}
      <div className="z-0 col-start-1 row-start-1">
        <div className="flex justify-center">
          <div
            className="fire"
            data-parts={particles.length}
            style={{ animationPlayState: paused ? "paused" : "running" }}
          >
            {particles}
          </div>
        </div>
      </div>
    </div>
  );
}
