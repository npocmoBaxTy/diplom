import React, { useState } from "react";

const ChatComponent = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const OPENROUTER_API_KEY =
    "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"; // Ваш API ключ

  const sendMessage = async () => {
    if (!userMessage) return;

    setLoading(true);
    setError(null);
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setUserMessage("");

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "huggingfaceh4/zephyr-7b-beta:free",
            messages: newMessages,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = data.choices[0].message.content;
      setMessages([...newMessages, { role: "assistant", content: botMessage }]);
    } catch (err) {
      setError("Произошла ошибка при запросе.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // предотвращаем создание новой строки
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 bg-white shadow-lg space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 px-6 rounded-xl flex justify-end ${
              message.role === "user"
                ? " text-teal-700 bg-black/5 text-right max-w-md ml-auto"
                : "max-w-md bg-transparent text-black self-start"
            }`}
          >
            <pre className="max-w-md whitespace-break-spaces">
              {message.content}
            </pre>
          </div>
        ))}
        {loading && (
          <div className="max-w-md p-4 rounded-lg bg-gray-300 text-gray-600 self-center">
            <p>Загрузка...</p>
          </div>
        )}
        {error && (
          <div className="max-w-md p-4 rounded-lg bg-red-200 text-red-600 self-center">
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="duration-200 animate-in fade-in slide-in-from-bottom-12">
        <div className="overflow-hidden rounded-lg border shadow-md">
          <div className="relative flex w-full min-w-0 justify-between px-1 py-1">
            <button
              className="items-center justify-center whitespace-nowrap font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-1 gap-2 leading-6 text-muted-foreground hover:bg-accent hover:text-accent-foreground relative flex shrink-0 transition-all bg-background disabled:bg-slate-2 disabled:text-slate-9 rounded-lg focus-visible:ring-border size-8 p-1"
              data-state="closed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                ></path>
              </svg>
            </button>
            <button className="items-center justify-center whitespace-nowrap font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-1 gap-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground text-xs relative flex shrink-0 px-3 py-2 transition-all bg-background disabled:bg-slate-2 disabled:text-slate-9 rounded-lg focus-visible:ring-border h-8 w-min pl-2 pr-1">
              New Room
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                ></path>
              </svg>
            </button>
          </div>
          <div className="duration-200 relative flex w-full flex-col self-center animate-in fade-in slide-in-from-bottom-12">
            <div className="relative w-full">
              <div className="flex max-h-40 overflow-auto bg-accent/80 text-slate-11 shadow-border transition-colors focus-within:bg-accent focus-within:text-slate-12 focus-within:shadow-inner rounded-none">
                <textarea
                  name="Chat Input"
                  placeholder="Start a message..."
                  value={userMessage}
                  onKeyDown={handleKeyDown}
                  className="h-full overflow-hidden py-3 pl-4 pr-20 w-full resize-none bg-transparent focus:outline-none focus:ring-opacity-50"
                  style={{ height: "48px" }}
                  onChange={(e) => setUserMessage(e.target.value)}
                ></textarea>
              </div>
              <div className="absolute bottom-1.5 right-1.5 flex gap-1">
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-1 focus-visible:ring-ring gap-2 leading-6 hover:bg-accent h-9 w-9 transition-all text-slate-11 hover:text-slate-12"
                  data-state="closed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="size-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                    ></path>
                  </svg>
                </button>
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-1 focus-visible:ring-ring gap-2 leading-6 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 w-9 transition-all opacity-40"
                  data-state="closed"
                  onClick={sendMessage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="size-5"
                  >
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
