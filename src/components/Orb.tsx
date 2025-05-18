import { useEffect, useState } from "react";
import "./orb.css";
import { getParticleCount, getRandomArray } from "../utils";

const MAXIMUM_PARTICLES = 30;

const getParticles = (particleCount: number, randomArray: number[]) => {
  const particles: React.ReactNode[] = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(
      <div
        key={"orb" + i}
        className="orb-particle"
        data-left={
          (particleCount / MAXIMUM_PARTICLES) *
          (0.7 + 0.2 * Math.sin(100 * i)) *
          Math.cos(i)
        }
        data-bottom={
          (particleCount / MAXIMUM_PARTICLES) *
          (0.7 + 0.2 * Math.sin(100 * i)) *
          Math.sin(i)
        }
        data-animation-delay={`${randomArray[i] * 2}s`}
      />,
    );
  }
  return particles;
};

export default function Orb({
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
  }, [particleCount, randomArray, paused, particles.length]);

  return (
    <div className="grid place-items-center">
      <div className="z-20 col-start-1 row-start-1 text-shadow-sm">{text}</div>
      {/* <div className="z-10 col-start-1 row-start-1 h-4 w-8 bg-black blur-sm"></div> */}
      <div className="z-0 col-start-1 row-start-1">
        <div className="flex justify-center">
          <div
            className="orb"
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
