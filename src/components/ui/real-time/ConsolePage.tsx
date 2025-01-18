/**
 * Running a local relay server will allow you to hide your API key
 * and run custom logic on the server
 *
 * Set the local relay server address to:
 * REACT_APP_LOCAL_RELAY_SERVER_URL=http://localhost:8081
 *
 * This will also require you to set OPENAI_API_KEY= in a `.env` file
 * You can run it with `npm run relay`, in parallel with `npm start`
 */
const LOCAL_RELAY_SERVER_URL: string =
  process.env.REACT_APP_LOCAL_RELAY_SERVER_URL || "";

import { useCallback, useEffect, useRef, useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { WavRecorder, WavStreamPlayer } from "@/lib/wavtools/index.js";
import { instructions } from "@/utils/conversation_config.js";
import { WavRenderer } from "@/utils/wav_renderer";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
import { useRouter } from "next/navigation";

// import './ConsolePage.scss';
import AnimatedLayout from "@/components/animations/AnimatedLayout";
import { PortfolioData } from "@/components/types/types";
import { Label } from "../label";
import Marquee from "../marquee";
import { RainbowButton } from "../rainbow-button";
import { Separator } from "../separator";
import { Switch } from "../switch";
import ColorPickerCard from "./ColorPickerCard";
import VoiceGridVisualization from "./VoiceGridVisualization";

/**
 * Type for result from get_weather() function call
 */
interface Coordinates {
  lat: number;
  lng: number;
  location?: string;
  temperature?: {
    value: number;
    units: string;
  };
  wind_speed?: {
    value: number;
    units: string;
  };
}

/**
 * Type for all event logs
 */
interface RealtimeEvent {
  time: string;
  source: "client" | "server";
  count?: number;
  event: { [key: string]: any };
}

interface Props {
  DATA?: PortfolioData;
}

interface CardData {
  title: string;
  summary: string;
  color: string;
  textColor: string;
}
export function ConsolePage(DATA: Props) {
  /**
   * Ask user for API Key
   * If we're using the local relay server, we don't need this
   */
  const [isVAD, setIsVAD] = useState(false);
  const [clientFrequencies, setClientFrequencies] = useState<any>(
    new Float32Array([0])
  );
  const router = useRouter();
  const { toast } = useToast();
  const [serverFrequencies, setServerFrequencies] = useState<any>(
    new Float32Array([0])
  );
  const [cardData, setCardData] = useState<CardData>();
  const [summaryOfCards, setSummaryOfCards] = useState<CardData[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const handleToggle = () => {
    setIsVAD((prev) => !prev);
    const newValue = !isVAD ? "server_vad" : "none";
    changeTurnEndType(newValue);
    console.log("Turn end type changed to:", newValue);
    // You can add any additional logic here
  };

  // to do- set open ai key immediately.
  const apiKey = LOCAL_RELAY_SERVER_URL
    ? ""
    : localStorage.getItem("tmp::voice_api_key") ||
      prompt("OpenAI API Key") ||
      "";
  if (apiKey !== "") {
    localStorage.setItem("tmp::voice_api_key", apiKey);
  }

  /**
   * Instantiate:
   * - WavRecorder (speech input)
   * - WavStreamPlayer (speech output)
   * - RealtimeClient (API client)
   */
  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 })
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 })
  );
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient(
      LOCAL_RELAY_SERVER_URL
        ? { url: LOCAL_RELAY_SERVER_URL }
        : {
            apiKey: apiKey,
            dangerouslyAllowAPIKeyInBrowser: true,
          }
    )
  );

  /**
   * References for
   * - Rendering audio visualization (canvas)
   * - Autoscrolling event logs
   * - Timing delta for event log displays
   */
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const serverCanvasRef = useRef<HTMLCanvasElement>(null);
  const eventsScrollHeightRef = useRef(0);
  const eventsScrollRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<string>(new Date().toISOString());

  /**
   * All of our variables for displaying application state
   * - items are all conversation items (dialog)
   * - realtimeEvents are event logs, which can be expanded
   * - memoryKv is for set_memory() function
   * - coords, marker are for get_weather() function
   */
  const [items, setItems] = useState<ItemType[]>([]);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<{
    [key: string]: boolean;
  }>({});
  const [isConnected, setIsConnected] = useState(false);
  const [canPushToTalk, setCanPushToTalk] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [memoryKv, setMemoryKv] = useState<{ [key: string]: any }>({});
  const [coords, setCoords] = useState<Coordinates | null>({
    lat: 37.775593,
    lng: -122.418137,
  });
  const [marker, setMarker] = useState<Coordinates | null>(null);

  /**
   * Utility for formatting the timing of logs
   */
  const formatTime = useCallback((timestamp: string) => {
    const startTime = startTimeRef.current;
    const t0 = new Date(startTime).valueOf();
    const t1 = new Date(timestamp).valueOf();
    const delta = t1 - t0;
    const hs = Math.floor(delta / 10) % 100;
    const s = Math.floor(delta / 1000) % 60;
    const m = Math.floor(delta / 60_000) % 60;
    const pad = (n: number) => {
      let s = n + "";
      while (s.length < 2) {
        s = "0" + s;
      }
      return s;
    };
    return `${pad(m)}:${pad(s)}.${pad(hs)}`;
  }, []);

  /**
   * When you click the API key
   */
  const resetAPIKey = useCallback(() => {
    const apiKey = prompt("OpenAI API Key");
    if (apiKey !== null) {
      localStorage.clear();
      localStorage.setItem("tmp::voice_api_key", apiKey);
      window.location.reload();
    }
  }, []);

  /**
   * Connect to conversation:
   * WavRecorder taks speech input, WavStreamPlayer output, client is API client
   */
  const connectConversation = useCallback(async () => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    // Set state variables
    startTimeRef.current = new Date().toISOString();
    setIsConnected(true);
    setSummaryOfCards([]);
    setShowSummary(false);
    setRealtimeEvents([]);
    setItems(client.conversation.getItems());

    // Connect to microphone
    await wavRecorder.begin();

    // Connect to audio output
    await wavStreamPlayer.connect();

    // Connect to realtime API
    await client.connect();
    client.sendUserMessageContent([
      {
        type: `input_text`,
        text: `Hi`,
        // text: `For testing purposes, I want you to list ten car brands. Number each item, e.g. "one (or whatever number you are one): the item name".`
      },
    ]);

    if (client.getTurnDetectionType() === "server_vad") {
      await wavRecorder.record((data) => client.appendInputAudio(data.mono));
    }
  }, []);

  /**
   * Disconnect and reset conversation state
   */
  const disconnectConversation = useCallback(async () => {
    setCardData(undefined);
    setIsConnected(false);
    setShowSummary(true);
    setRealtimeEvents([]);
    setItems([]);
    setMemoryKv({});
    setCoords({
      lat: 37.775593,
      lng: -122.418137,
    });
    setMarker(null);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;
    await wavStreamPlayer.interrupt();
  }, []);

  const deleteConversationItem = useCallback(async (id: string) => {
    const client = clientRef.current;
    client.deleteItem(id);
  }, []);

  /**
   * In push-to-talk mode, start recording
   * .appendInputAudio() for each sample
   */
  const startRecording = async () => {
    setIsRecording(true);
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const trackSampleOffset = await wavStreamPlayer.interrupt();
    if (trackSampleOffset?.trackId) {
      const { trackId, offset } = trackSampleOffset;
      await client.cancelResponse(trackId, offset);
    }
    await wavRecorder.record((data) => client.appendInputAudio(data.mono));
  };

  /**
   * In push-to-talk mode, stop recording
   */
  const stopRecording = async () => {
    setIsRecording(false);
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.pause();
    client.createResponse();
  };

  /**
   * Switch between Manual <> VAD mode for communication
   */
  const changeTurnEndType = async (value: string) => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    if (value === "none" && wavRecorder.getStatus() === "recording") {
      await wavRecorder.pause();
    }
    client.updateSession({
      turn_detection: value === "none" ? null : { type: "server_vad" },
    });
    if (value === "server_vad" && client.isConnected()) {
      await wavRecorder.record((data) => client.appendInputAudio(data.mono));
    }
    setCanPushToTalk(value === "none");
  };

  /**
   * Auto-scroll the event logs
   */
  useEffect(() => {
    if (eventsScrollRef.current) {
      const eventsEl = eventsScrollRef.current;
      const scrollHeight = eventsEl.scrollHeight;
      // Only scroll if height has just changed
      if (scrollHeight !== eventsScrollHeightRef.current) {
        eventsEl.scrollTop = scrollHeight;
        eventsScrollHeightRef.current = scrollHeight;
      }
    }
  }, [realtimeEvents]);

  /**
   * Auto-scroll the conversation logs
   */
  useEffect(() => {
    const conversationEls = [].slice.call(
      document.body.querySelectorAll("[data-conversation-content]")
    );
    for (const el of conversationEls) {
      const conversationEl = el as HTMLDivElement;
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }
  }, [items]);

  useEffect(() => {
    const email = sessionStorage.getItem("authToken");
    if (!email) {
      toast({
        title: "Please sign in.",
        duration: 3000,
      });
      router.push("/login");
      console.error("Email not found in localStorage");
      return;
    }
    let isLoaded = true;

    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    const render = () => {
      if (!isLoaded) return;

      // Fetch client frequencies
      const clientFrequencies = wavRecorder?.recording
        ? wavRecorder.getFrequencies("voice")
        : { values: new Float32Array([0]) };

      // Fetch server frequencies
      const serverFrequencies = wavStreamPlayer?.analyser
        ? wavStreamPlayer.getFrequencies("voice")
        : { values: new Float32Array([0]) };

      // Update state for the visualization components
      setClientFrequencies(clientFrequencies.values); // Update state with values only
      setServerFrequencies(serverFrequencies.values); // Update state with values only

      // Schedule the next animation frame
      window.requestAnimationFrame(render);
    };

    render();

    return () => {
      isLoaded = false; // Clean up when the component unmounts
    };
  }, []);

  /**
   * Set up render loops for the visualization canvas
   */
  useEffect(() => {
    let isLoaded = true;

    const wavRecorder = wavRecorderRef.current;
    const clientCanvas = clientCanvasRef.current;
    let clientCtx: CanvasRenderingContext2D | null = null;

    const wavStreamPlayer = wavStreamPlayerRef.current;
    const serverCanvas = serverCanvasRef.current;
    let serverCtx: CanvasRenderingContext2D | null = null;

    const render = () => {
      if (isLoaded) {
        if (clientCanvas) {
          if (!clientCanvas.width || !clientCanvas.height) {
            clientCanvas.width = clientCanvas.offsetWidth;
            clientCanvas.height = clientCanvas.offsetHeight;
          }
          clientCtx = clientCtx || clientCanvas.getContext("2d");
          if (clientCtx) {
            clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
            const result = wavRecorder.recording
              ? wavRecorder.getFrequencies("voice")
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              clientCanvas,
              clientCtx,
              result.values,
              "#0099ff",
              10,
              0,
              8
            );
          }
        }
        if (serverCanvas) {
          if (!serverCanvas.width || !serverCanvas.height) {
            serverCanvas.width = serverCanvas.offsetWidth;
            serverCanvas.height = serverCanvas.offsetHeight;
          }
          serverCtx = serverCtx || serverCanvas.getContext("2d");
          if (serverCtx) {
            serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height);
            const result = wavStreamPlayer.analyser
              ? wavStreamPlayer.getFrequencies("voice")
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              serverCanvas,
              serverCtx,
              result.values,
              "#009900",
              10,
              0,
              8
            );
          }
        }
        window.requestAnimationFrame(render);
      }
    };
    render();

    return () => {
      isLoaded = false;
    };
  }, []);

  /**
   * Core RealtimeClient and audio capture setup
   * Set all of our instructions, tools, events and more
   */
  useEffect(() => {
    // Get refs
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = clientRef.current;
    console.log(DATA);
    console.log(JSON.stringify(DATA));
    const newInstructions = instructions + JSON.stringify(DATA);
    console.log(newInstructions);

    // Set instructions
    client.updateSession({ instructions: newInstructions });
    // Set transcription, otherwise we don't get user transcriptions back
    client.updateSession({ voice: "verse" });
    // client.updateSession({ input_audio_transcription: { model: "whisper-1" } });

    // Add tools
    client.addTool(
      {
        name: "set_card_data",
        description:
          "Populates the cardData object with a title, summary, a random color, and an appropriate text color based on contrast.",
        parameters: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "The title of the card.",
            },
            summary: {
              type: "string",
              description: "A brief summary to include in the card.",
            },
          },
          required: ["title", "summary"],
        },
      },
      async ({ title, summary }: { [key: string]: any }) => {
        const colors = [
          { name: "Blush", hex: "#FFEDEB" },
          { name: "Lilac", hex: "#FFD7FF" },
          { name: "Dark Lilac", hex: "#FF45FF" },
          { name: "Lemon", hex: "#FFFF8F" },
          { name: "Mint", hex: "#D9FFD8" },
          { name: "Seafoam", hex: "#A6FFA3" },
          { name: "Sky", hex: "#E5F1FF" },
          { name: "Celeste", hex: "#CAFFFF" },
          { name: "Olive", hex: "#6D6837" },
          { name: "Charcoal", hex: "#393939" },
          { name: "Maroon", hex: "#512D0D" },
          { name: "Turquoise", hex: "#005454" },
          { name: "Terracotta", hex: "#C45600" },
          { name: "Indigo", hex: "#28044A" },
          { name: "Forest", hex: "#193918" },
          { name: "Kelly", hex: "#2D712A" },
        ];

        // Helper to determine the best text color based on background brightness
        const calculateTextColor = (hex: string): string => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          return brightness > 125 ? "black" : "white";
        };

        // Choose a random color
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Populate cardData with the provided title, summary, and calculated colors
        setCardData({
          title,
          summary,
          color: randomColor.hex,
          textColor: calculateTextColor(randomColor.hex),
        });
        setSummaryOfCards((prevItems) => [
          ...prevItems,
          {
            title,
            summary,
            color: randomColor.hex,
            textColor: calculateTextColor(randomColor.hex),
          },
        ]);

        return {
          ok: true,
          cardData: {
            title,
            summary,
            color: randomColor.hex,
            textColor: calculateTextColor(randomColor.hex),
          },
        };
      }
    );

    client.addTool(
      {
        name: "set_memory",
        description: "Saves important data about the user into memory.",
        parameters: {
          type: "object",
          properties: {
            key: {
              type: "string",
              description:
                "The key of the memory value. Always use lowercase and underscores, no other characters.",
            },
            value: {
              type: "string",
              description: "Value can be anything represented as a string",
            },
          },
          required: ["key", "value"],
        },
      },
      async ({ key, value }: { [key: string]: any }) => {
        setMemoryKv((memoryKv) => {
          const newKv = { ...memoryKv };
          newKv[key] = value;
          return newKv;
        });
        return { ok: true };
      }
    );
    // handle realtime events from client + server for event logging
    client.on("realtime.event", (realtimeEvent: RealtimeEvent) => {
      setRealtimeEvents((realtimeEvents) => {
        const lastEvent = realtimeEvents[realtimeEvents.length - 1];
        if (lastEvent?.event.type === realtimeEvent.event.type) {
          // if we receive multiple events in a row, aggregate them for display purposes
          lastEvent.count = (lastEvent.count || 0) + 1;
          return realtimeEvents.slice(0, -1).concat(lastEvent);
        } else {
          return realtimeEvents.concat(realtimeEvent);
        }
      });
    });
    client.on("error", (event: any) => console.error(event));
    client.on("conversation.interrupted", async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });
    client.on("conversation.updated", async ({ item, delta }: any) => {
      const items = client.conversation.getItems();
      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }
      if (item.status === "completed" && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }
      setItems(items);
    });

    setItems(client.conversation.getItems());
    // connectConversation()

    return () => {
      // cleanup; resets to defaults
      client.reset();
    };
  }, []);

  /**
   * Render the application
   */
  return (
    <div className="flex h-screen w-screen">
      {/* Left Side */}
      <div className="w-1/2 p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="mb-8 w-full">
            <div className="visualization">
              <div className="grid justify-center items-center">
                <div className="visualization-entry">
                  <VoiceGridVisualization
                    type="server"
                    frequencyData={serverFrequencies}
                    canvasRef={serverCanvasRef}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col items-center gap-4 w-full">
            {isConnected && canPushToTalk && (
              <RainbowButton
                disabled={!isConnected || !canPushToTalk}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                className="w-1/2"
              >
                {isRecording ? "Release to send" : "Push to talk"}
              </RainbowButton>
            )}
            <RainbowButton
              onClick={
                isConnected ? disconnectConversation : connectConversation
              }
              className="w-1/2"
            >
              {isConnected ? "Disconnect" : "Let's talk"}
            </RainbowButton>

            {/* API Key Button */}
            {/* {!LOCAL_RELAY_SERVER_URL && (
          <Button onClick={() => resetAPIKey()} className="w-full">Change Key</Button>
        )} */}

            {/* Switch */}
            <div className="flex items-center justify-center gap-2 mt-4 w-full">
              <Switch
                checked={isVAD}
                onCheckedChange={handleToggle}
                id="vad-mode"
              />
              <Label htmlFor="vad-mode">Open Mic</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="flex items-center px-4">
        <Separator orientation="vertical" className="h-full" />
      </div>

      {/* Right Side */}
      <div className="w-1/2 p-8 flex items-center justify-center">
        {cardData && (
          <div className="w-full">
            <AnimatedLayout>
              <ColorPickerCard cardData={cardData} />
            </AnimatedLayout>
          </div>
        )}
        {!cardData && !showSummary && (
          <>
            <p>Push to start talking 😇</p>
            {/* <img src="/swirlyarrow.png" alt="My Image" /> */}
          </>
        )}
        {showSummary && (
          <Marquee pauseOnHover vertical className="[--duration:20s] ">
            {summaryOfCards.map((item, idx) => (
              <ColorPickerCard cardData={item} key={idx} />
            ))}
          </Marquee>
        )}
      </div>
    </div>
  );
}
