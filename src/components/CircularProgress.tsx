import "./circularProgress.css";

export default function CircularProgress({
  progress,
  transitionDuration,
  text,
}: {
  progress: number;
  transitionDuration: number;
  text: string;
}) {
  return (
    <div className="relative mb-2 flex w-fit">
      <div className="size-20">
        <svg
          viewBox="0 0 250 250"
          className="circular-progress"
          data-progress={progress}
          data-stroke-width={15}
          data-transition-duration={`${transitionDuration}ms`}
        >
          <circle className="stroke-black opacity-10 dark:stroke-white"></circle>
          <circle className="fg stroke-primary dark:stroke-primary-dark -rotate-90"></circle>
        </svg>
      </div>
      <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
        <div className="text-base">{text}</div>
      </div>
    </div>
  );
}
