"use client";

import { FormEvent, useState } from "react";
import { useChat } from "@/context/chat";

export function ChatHeader() {
  return (
    <header className="e9wb6 xl:hs-overlay-layout-open:me-96 md:hs-overlay-minified:ms-13 fl36v ufjzp fixed fuv09 e33ca flex flex-wrap qxd8q md:flex-nowrap v1j7n pqybq aqyoh gdxvw dark:bg-neutral-800">
      <nav className="fglch f52jl flex ygsjd ox2cl items-center w-full mx-auto">
        <div className="flex items-center hrhwk">
          <a
            className="flex jkwm1 items-center b1nd2 s53ws sfv8v w4xo0 s1lil r7y0w pb094 r4zik focus:outline-hidden g6srb disabled:opacity-50 disabled:pointer-events-none dark:text-cyan-500 dark:hover:bg-cyan-700/20 dark:focus:bg-cyan-700/20"
            href="#"
          >
            Get Plus
          </a>
        </div>
      </nav>
    </header>
  );
}

export function ChatLabelTags() {
  return (
    <div className="jl6n6 mt-4">
      <div className="flex flex-wrap jkwm1 m4ww2 twqg7">
        {[
          "Health",
          "Learn",
          "Technology",
          "Life stuff",
          "Science",
          "Language",
        ].map((tag) => (
          <a
            key={tag}
            className="od5va sfv8v inline-flex items-center b1nd2 w4xo0 c9jt8 f4yn1 czpu9 pb094 focus:outline-hidden am1b2 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
            href="#"
          >
            {tag}
          </a>
        ))}
      </div>
    </div>
  );
}

export function ChatContainer() {
  const { messages } = useChat();
  return (
    <div className="h1r77 flex flex-col ox2cl ksbry d0l1a w-full mx-auto fglch xf1r4 ids43 flex-1">
      <div className="flex flex-col jkwm1 items-center hlt95 sm:flex-none">
        <h1 className="w6mr2 a3jay dtief c9jt8 dark:text-neutral-200">
          What can I help with?
        </h1>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className="max-w-md rounded border p-2 text-sm dark:border-gray-700"
          >
            {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatInput() {
  const { sendMessage } = useChat();
  const [value, setValue] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    sendMessage(value.trim());
    setValue("");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="aqyoh rsdjd dwbp4 piqys lvyi2 dark:bg-neutral-800 dark:border-neutral-600"
    >
      <label htmlFor="chat-input" className="et50x">
        Ask anything...
      </label>
      <div className="sa2ld jxswk">
        <textarea
          id="chat-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything..."
          className="dkig0 ja90s oqskk sa2ld z47ts mi0xb block w-full w4poy azddh zsuop c9jt8 wl876 focus:outline-hidden k16qo vv6e0 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:text-neutral-200 dark:placeholder-neutral-500 overflow-y-auto xwpzv y0qzi qjpoo n3xnc dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        />
        <div className="kmove flex ox2cl items-center n6i5x mt-2">
          <div className="flex items-center n6i5x gap-2">
            <button
              type="button"
              className="flex jkwm1 items-center vyfcq yl1cu w4xo0 fd43e d05xb pb094 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden r17tr dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
            >
              Add Media
            </button>
            <button
              type="button"
              className="flex jkwm1 items-center n6i5x od5va jxswk w4xo0 fd43e d05xb pb094 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden r17tr dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
            >
              Tools
            </button>
          </div>
          <div className="flex items-center n6i5x ms-auto gap-2">
            <select className="od5va yuavq e2bhr inline-flex jkwm1 items-center w9dei aqyoh c9jt8 w4xo0 pb094 gpv41 d05xb focus:outline-hidden r17tr dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
              <option>gpt-4o</option>
              <option>gpt-o3</option>
            </select>
            <button
              type="button"
              className="flex jkwm1 items-center b1nd2 yl1cu w4xo0 fd43e d05xb pb094 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden r17tr dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
            >
              Send voice message
            </button>
            <button
              type="submit"
              className="inline-flex e731n jkwm1 items-center yl1cu w4xo0 sikx1 pb094 kew0r dmaxi bnf6b disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden ukj8s"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
