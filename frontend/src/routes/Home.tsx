import React from "react";
import BuildIt from "#/assets/build-it.svg?react";
import Clip from "#/assets/clip.svg?react";

function HeroHeading() {
  return (
    <div className="w-[304px] text-center flex flex-col gap-4 items-center py-4">
      <BuildIt width={88} height={104} />
      <h1 className="text-[38px] leading-[32px] -tracking-[0.02em]">
        Let&apos;s Start Building!
      </h1>
      <p className="mx-4 text-sm">
        All Hands makes it easy to build and maintain software using a simple
        prompt. Not sure how to start?{" "}
        <span className="text-hyperlink underline underline-offset-[3px]">
          Read this
        </span>
      </p>
    </div>
  );
}

function TaskInput() {
  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        className="bg-[#404040] placeholder:text-[#A3A3A3] border border-[#525252] w-[600px] rounded-lg px-[16px] py-[18px] text-[17px] leading-5"
        placeholder="What do you want to build?"
      />
      <span className="flex items-center text-[#A3A3A3] text-xs leading-[18px] -tracking-[0.08px]">
        <Clip width={16} height={16} />
        Attach a file
      </span>
    </div>
  );
}

interface SuggestionBoxProps {
  title: string;
  description: string;
}

function SuggestionBox({ title, description }: SuggestionBoxProps) {
  return (
    <div className="w-[304px] h-[100px] border border-[#525252] rounded-xl flex flex-col items-center justify-center">
      <span className="text-[16px] leading-6 -tracking-[0.01em] font-[600]">
        {title}
      </span>
      <span className="text-sm">{description}</span>
    </div>
  );
}

function Home() {
  return (
    <div className="bg-root-secondary h-full rounded-xl flex flex-col items-center justify-center gap-16">
      <HeroHeading />
      <TaskInput />
      <div className="flex gap-4">
        <SuggestionBox
          title="Make a To-do List App"
          description="Track your daily work"
        />
        <SuggestionBox
          title="+ Import Project"
          description="from your desktop"
        />
      </div>
    </div>
  );
}

export default Home;
