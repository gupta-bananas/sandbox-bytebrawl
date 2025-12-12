import { useState, useEffect, useCallback } from "react";
import Editor from "react-simple-code-editor";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { supabase } from "./lib/supabaseClient";

type SandboxProps = {
  roomId: number;
  userId: string;
};

// Language templates
const templateMap: Record<number, string> = {
  63: "// Javascript Template\nfunction solve() {\n  return 'Hello World';\n}",
  62: `// Java Template
class Main {
  public void solve() {
    System.out.println("Hello, world!");
  }

  public static void main(String[] args) {
    new Main().solve();
  }
}`,
  54: `// C++ Template
#include <iostream>
int main() {
  std::cout << "Hello, World!" << std::endl;
  return 0;
}`,
  71: `# Python Template
print("Hello, World!")`,
};

const languageMap: Record<number, string> = {
  63: "javascript",
  62: "java",
  54: "cpp",
  71: "python",
};

const judge0LanguageIds: Record<number, number> = {
  63: 63,
  62: 62,
  54: 54,
  71: 71,
};

export default function Sandbox({ roomId, userId }: SandboxProps) {
  const [myCode, setMyCode] = useState(templateMap[63]);
  const [myOutput, setMyOutput] = useState("");
  const [otherCode, setOtherCode] = useState("// Waiting for opponent...");
  const [otherOutput, setOtherOutput] = useState("");
  const [language, setLanguage] = useState(63);
  const [running, setRunning] = useState(false);

  // Highlighting
  const highlight = (code: string) => {
    const lang = languageMap[language];
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang, ignoreIllegals: true })
        .value;
    }
    return code;
  };
  type LiveCodeFile = {
    room_id: number;
    user_id: string;
    filename: string;
    code: string;
    language: string;
    output: string;
  };

  // Fetch opponent's existing code
  const fetchOpponentCode = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("live_code_files")
        .select("*")
        .eq("room_id", roomId)
        .neq("user_id", userId);

      if (error) {
        console.error("Error fetching opponent code:", error);
        return;
      }

      if (data && data.length > 0) {
        // Get the most recent file from the opponent
        const opponentFile = data[0] as LiveCodeFile;
        setOtherCode(opponentFile.code || "// Waiting for opponent...");
        setOtherOutput(opponentFile.output || "");
      }
    } catch (err) {
      console.error("Error fetching opponent code:", err);
    }
  }, [roomId, userId]);

  // Send current code to database when joining a room (so opponent sees it immediately)
  useEffect(() => {
    const announceJoin = async () => {
      try {
        await supabase.from("live_code_files").upsert({
          room_id: roomId,
          user_id: userId,
          filename: "main",
          code: myCode,
          language: languageMap[language],
          output: myOutput,
        });
      } catch (err) {
        console.error("Error announcing join:", err);
      }
    };

    announceJoin();
    // Only run when roomId or userId changes (i.e., when joining a room)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userId]);

  // Subscribe to Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_code_files",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const updatedFile = payload.new as LiveCodeFile;
          if (updatedFile.user_id !== userId) {
            setOtherCode(updatedFile.code || "// Waiting for opponent...");
            setOtherOutput(updatedFile.output || "");
          }
          // Also refetch to ensure we have the latest data, especially on INSERT
          if (payload.eventType === "INSERT") {
            fetchOpponentCode();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // pass the channel object, not a string
    };
  }, [roomId, userId, fetchOpponentCode]);

  // Handle typing & sync
  const handleMyCodeChange = async (newCode: string) => {
    setMyCode(newCode);

    try {
      await supabase.from("live_code_files").upsert({
        room_id: roomId,
        user_id: userId,
        filename: "main",
        code: newCode,
        language: languageMap[language],
        output: myOutput,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Run code
  const runCode = async () => {
    setRunning(true);
    let finalOutput = "";

    try {
      if (language === 63) {
        try {
          finalOutput = String(new Function(myCode + "; return solve();")());
        } catch (err) {
          finalOutput = String(err);
        }
      } else {
        const submission = await fetch(
          "https://ce.judge0.com/submissions/?base64_encoded=false&wait=false",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source_code: myCode,
              language_id: judge0LanguageIds[language],
              stdin: "",
            }),
          }
        );
        const { token } = await submission.json();

        let result;
        let attempts = 0;
        do {
          await new Promise((r) => setTimeout(r, 500));
          const res = await fetch(
            `https://ce.judge0.com/submissions/${token}?base64_encoded=false`
          );
          result = await res.json();
          attempts++;
          if (attempts > 20) {
            finalOutput = "Timeout: Execution took too long.";
            break;
          }
        } while (result.status.id <= 2);

        finalOutput =
          result.stdout ||
          result.stderr ||
          result.compile_output ||
          "No output";
      }

      setMyOutput(finalOutput);

      await supabase.from("live_code_files").upsert({
        room_id: roomId,
        user_id: userId,
        filename: "main",
        code: myCode,
        language: languageMap[language],
        output: finalOutput,
      });
    } catch (err) {
      console.error(err);
      setMyOutput(String(err));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col gap-4">
      <h1 className="text-2xl font-bold" style={{ marginBottom: 0 }}>1v1 Live Coding Sandbox</h1>
      <h2 className="text-lg font-bold" style={{ marginTop: 0 }}>Room: {roomId}</h2>

      <select
        value={language}
        onChange={(e) => {
          setMyCode(templateMap[Number(e.target.value)]);
          setLanguage(Number(e.target.value));
        }}
        className="border p-2 rounded w-fit"
      >
        <option value={63}>JavaScript</option>
        <option value={62}>Java</option>
        <option value={54}>C++</option>
        <option value={71}>Python</option>
      </select>

      <br />
      <br />

      

      <div className="flex gap-4">
        {/* Your editor */}
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="font-bold">You &nbsp; &nbsp;
            <button
              onClick={runCode}
              disabled={running}
              className="px-4 py-2 bg-gray-200 rounded w-fit disabled:opacity-50"
            >
              {running ? "Running..." : "Run Code"}
            </button>
          </h2>
          <Editor
            value={myCode}
            onValueChange={handleMyCodeChange}
            highlight={highlight}
            padding={10}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              minHeight: 300,
              backgroundColor: "#1e1e1e",
              border: "1px solid #ccc",
              borderRadius: 6,
              color: "white",
            }}
          />
          <pre className="border p-3 rounded bg-gray-50 text-black min-h-[50px]">
            <strong>Output:</strong> {"\n"} {myOutput}
          </pre>
        </div>

        {/* Opponent editor */}
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="font-bold">Opponent</h2>
          <Editor
            value={otherCode}
            onValueChange={() => {}}
            highlight={highlight}
            padding={10}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              minHeight: 300,
              backgroundColor: "#2e2e2e",
              border: "1px solid #ccc",
              borderRadius: 6,
              color: "white",
            }}
            readOnly
          />
          <pre className="border p-3 rounded bg-gray-50 text-black min-h-[50px]">
            <strong>Output:</strong> {"\n"} {otherOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
