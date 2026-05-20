import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  Video,
  Headphones,
  MapPin,
  LocateFixed,
  Camera,
  Upload,
  Sparkles,
  Leaf,
  Home,
  TreePine,
  Waves,
  Bird,
  CheckCircle2,
  Navigation,
  ChevronRight,
  RotateCcw,
  Info,
  Eye,
  Ear,
} from "lucide-react";

const stops = [
  {
    id: 1,
    title: "保安林入口",
    subtitle: "為什麼會有這片森林",
    lat: 23.34355,
    lng: 120.13782,
    radius: 75,
    icon: TreePine,
    color: "bg-green-700",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=85",
    audio:
      "你現在看到的這片森林，並不是單純因為風景漂亮而存在。過去，嘉義沿海長期受到東北季風與強烈海風吹襲，風會帶起大量砂土，影響農田與聚落。為了改善海岸環境，人們開始種植能夠耐風、耐鹽的樹木，慢慢形成今天的好美保安林。",
    task: "請停下來十秒鐘，感受風從哪個方向來。",
    feedback:
      "你剛剛感受到的風，就是保安林存在的重要原因。它不是單純景觀，而是替聚落與農田抵擋風砂的自然屏障。",
  },
  {
    id: 2,
    title: "木麻黃觀察點",
    subtitle: "像松樹卻不是松樹",
    lat: 23.34402,
    lng: 120.13835,
    radius: 75,
    icon: Leaf,
    color: "bg-lime-700",
    image:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1400&q=85",
    audio:
      "走進好美保安林，最容易看見的樹種之一，就是木麻黃。很多人會以為它是松樹，但其實木麻黃不是松樹。你看到像針葉的部分，其實是細長的枝條。這樣的構造可以減少水分蒸散，幫助它適應乾燥、強風與鹽分高的海岸環境。",
    task: "請找一棵木麻黃，觀察它像針葉的枝條。",
    feedback:
      "木麻黃的外型是適應海岸環境的結果。它能耐風、耐旱、耐鹽，因此常被種在海岸防風林中。",
  },
  {
    id: 3,
    title: "水樣森林",
    subtitle: "水面上的森林",
    lat: 23.34446,
    lng: 120.13892,
    radius: 90,
    icon: Waves,
    color: "bg-sky-700",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=85",
    audio:
      "現在，請你先停下來。看一看眼前的水面。如果光線剛好，你可能會看到樹木、天空與雲影倒映在水面之上。這裡被稱為水樣森林。它會隨著光線、潮汐、降雨與風改變，每一次看到的樣子都可能不同。",
    task: "看水面十秒鐘：今天的倒影清楚嗎？水面安靜還是被風吹動？",
    feedback:
      "水樣森林不是固定不變的風景。它會隨著自然條件改變，因此每一次觀察都可能留下不同記憶。",
  },
  {
    id: 4,
    title: "濕地生物觀察點",
    subtitle: "濕地裡的小生命",
    lat: 23.3449,
    lng: 120.13946,
    radius: 90,
    icon: Bird,
    color: "bg-cyan-700",
    image:
      "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=1400&q=85",
    audio:
      "好美保安林不只有樹。森林、水域、泥灘地與潮間帶交織在一起，讓這裡成為許多生物生活的地方。水邊可能有招潮蟹與彈塗魚，樹梢或濕地邊也可能看到白鷺、小白鷺或翠鳥。",
    task: "請找一個生命跡象：鳥叫聲、泥灘小洞、蟹的活動，或樹梢上的鳥。",
    feedback:
      "你剛剛找的不是單一動物，而是濕地生態的一部分。保安林、水域、泥灘與生物共同構成完整的海岸生態系。",
  },
];

const plantResults = [
  {
    name: "木麻黃",
    confidence: 88,
    note: "常見於海岸防風林，枝條細長像針葉，具有耐風、耐鹽、耐旱特性。",
  },
  {
    name: "海茄苳",
    confidence: 63,
    note: "常見於濕地與海岸環境，能適應潮濕與鹽分較高的土壤。",
  },
  {
    name: "水黃皮",
    confidence: 42,
    note: "濱海地區常見植物，可作為海岸植物觀察對象。",
  },
];

function distanceMeters(a: any, b: any) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function BigButton({ children, onClick, icon: Icon, secondary = false }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-[64px] w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-xl font-black shadow-sm transition ${
        secondary
          ? "border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
          : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300"
      }`}
    >
      {Icon && <Icon className="h-7 w-7" />}
      {children}
    </button>
  );
}

function AudioBar({ playing, setPlaying, label = "播放音頻" }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
      <button
        onClick={() => setPlaying(!playing)}
        style={{
          width: "100%",
          backgroundColor: "#047857",
          color: "white",
          border: "none",
          borderRadius: "18px",
          padding: "18px",
          fontSize: "1.2rem",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        <Headphones />

        {playing ? "播放中..." : label}
      </button>
      <div className="mt-4 h-3 rounded-full bg-white">
        <div
          className="h-3 rounded-full bg-emerald-700 transition-all"
          style={{ width: playing ? "54%" : "0%" }}
        />
      </div>
    </div>
  );
}

function HomePage({ setMode }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-emerald-950 text-white">
      <img
        className="absolute inset-0 h-full w-full object-cover opacity-55"
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=90"
        alt=""
      />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/85 via-emerald-950/50 to-emerald-950/90" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="mx-auto mb-5 inline-flex rounded-full border border-white/30 bg-white/10 px-5 py-2 text-lg font-bold backdrop-blur">
            好美里一站式自動導覽網站
          </p>
          <h1 className="text-5xl font-black leading-tight md:text-7xl">
            走進好美里
          </h1>
          <p className="mt-6 text-2xl font-bold leading-relaxed text-emerald-50">
            先用音頻影片認識地方，再依位置自動開啟導覽點位，最後完成公民科學觀察。
          </p>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            {/* 認識好美 */}
            <button
              onClick={() => setMode("intro")}
              className="rounded-3xl p-8 text-white shadow-2xl transition hover:scale-105"
              style={{
                backgroundColor: "#047857",
                border: "3px solid rgba(255,255,255,0.2)",
              }}
            >
              <Video className="mx-auto mb-4 h-14 w-14" />

              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "900",
                  marginBottom: "12px",
                }}
              >
                認識好美
              </h2>

              <p
                style={{
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  color: "#d1fae5",
                }}
              >
                以音頻影片認識好美里與保安林背景
              </p>
            </button>

            {/* 自動導覽 */}
            <button
              onClick={() => setMode("guide")}
              className="rounded-3xl p-8 text-white shadow-2xl transition hover:scale-105"
              style={{
                backgroundColor: "#0369a1",
                border: "3px solid rgba(255,255,255,0.2)",
              }}
            >
              <LocateFixed className="mx-auto mb-4 h-14 w-14" />

              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "900",
                  marginBottom: "12px",
                }}
              >
                自動導覽
              </h2>

              <p
                style={{
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  color: "#e0f2fe",
                }}
              >
                根據位置自動跳出附近導覽點位
              </p>
            </button>

            {/* 公民科學 */}
            <button
              onClick={() => setMode("science")}
              className="rounded-3xl p-8 text-white shadow-2xl transition hover:scale-105"
              style={{
                backgroundColor: "#ea580c",
                border: "3px solid rgba(255,255,255,0.2)",
              }}
            >
              <Camera className="mx-auto mb-4 h-14 w-14" />

              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "900",
                  marginBottom: "12px",
                }}
              >
                公民科學
              </h2>

              <p
                style={{
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  color: "#ffedd5",
                }}
              >
                上傳照片並記錄濕地生態觀察
              </p>
            </button>
          </div>
          <div className="mx-auto mt-8 grid max-w-4xl gap-4 text-left md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <Video className="h-8 w-8" />
              <p className="mt-3 text-xl font-black">音頻影片開場</p>
              <p className="mt-2 text-emerald-50">
                以聲音為主、簡單畫面為輔，降低閱讀負擔。
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <MapPin className="h-8 w-8" />
              <p className="mt-3 text-xl font-black">自動偵測點位</p>
              <p className="mt-2 text-emerald-50">
                使用 GPS 判斷附近導覽站，跳出對應音頻。
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <Sparkles className="h-8 w-8" />
              <p className="mt-3 text-xl font-black">公民科學紀錄</p>
              <p className="mt-2 text-emerald-50">
                拍照上傳、AI 初步辨識、累積觀察資料。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function IntroPage({ setMode }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="min-h-screen bg-[#f6f5ef] px-5 py-6 text-stone-950">
      <div className="mx-auto max-w-6xl space-y-5">
        <BigButton onClick={() => setMode("home")} secondary icon={Home}>
          回首頁
        </BigButton>
        <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            <div className="relative min-h-[520px] bg-emerald-950 text-white">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-emerald-950/45 to-emerald-950/90" />
              <div className="relative flex min-h-[520px] flex-col justify-end p-6 md:p-10">
                <div className="mb-auto flex items-center justify-between">
                  <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                    音頻為主・畫面為輔
                  </span>
                  <Volume2 className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-black md:text-6xl">認識好美里</h1>
                <p className="mt-4 max-w-3xl text-2xl font-bold leading-relaxed text-emerald-50">
                  這不是長篇文字介紹，而是一段約 2
                  分鐘的地方開場影片。使用者可以看簡單畫面、聽語音，先理解好美里與海岸生活，再進入保安林導覽。
                </p>
                <div className="mt-6 max-w-xl">
                  <AudioBar
                    playing={playing}
                    setPlaying={setPlaying}
                    label="播放好美里介紹影片"
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-emerald-950">
                影片呈現方式
              </h2>
              <div className="mt-4 space-y-4">
                {[
                  [Ear, "聽", "以旁白介紹好美里、海岸生活與保安林背景。"],
                  [Eye, "看", "畫面只放少量照片、地圖、關鍵字，避免閱讀壓力。"],
                  [
                    Headphones,
                    "進入",
                    "影片結束後只保留一個按鈕：開始自動導覽。",
                  ],
                ].map(([Icon, title, text]) => (
                  <div
                    key={title}
                    className="flex gap-3 rounded-2xl bg-emerald-50 p-4"
                  >
                    <Icon className="h-7 w-7 shrink-0 text-emerald-700" />
                    <div>
                      <p className="text-xl font-black text-emerald-950">
                        {title}
                      </p>
                      <p className="mt-1 text-lg leading-8 text-stone-700">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <BigButton onClick={() => setMode("guide")} icon={ChevronRight}>
              看完後開始導覽
            </BigButton>
          </aside>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-black text-emerald-950">
            好美里介紹影片腳本
          </h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 p-5">
              <p className="text-xl font-black text-emerald-950">
                畫面一：地方位置
              </p>
              <p className="mt-2 text-lg leading-8 text-stone-700">
                簡單地圖＋海岸照片。旁白說明好美里位於嘉義布袋沿海，是與海洋生活密切相關的地方。
              </p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-5">
              <p className="text-xl font-black text-sky-950">畫面二：人與海</p>
              <p className="mt-2 text-lg leading-8 text-stone-700">
                漁村、鹽業、海風、聚落生活照片。旁白說明居民依靠海生活，也面對海風、飛砂、潮水與颱風。
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-5">
              <p className="text-xl font-black text-amber-950">
                畫面三：進入保安林
              </p>
              <p className="mt-2 text-lg leading-8 text-stone-700">
                保安林與水樣森林照片。旁白收束：接下來走進的不是單純風景，而是地方與自然共存的故事。
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-stone-50 p-5 text-xl leading-9 text-stone-800">
            歡迎來到好美里。這裡位於嘉義布袋沿海，長久以來與海洋、漁業、鹽業和地方信仰有著密切關係。對過去的居民來說，海帶來生活，也帶來挑戰。強烈的海風、飛砂、潮水與颱風，都是這片土地需要面對的環境力量。因此，當我們等一下走進好美保安林時，看到的不只是森林與水面，而是一段人與海岸長期共存的地方故事。現在，請準備好耳機，接下來讓導覽帶你一步一步走進好美濕地保安林。
          </div>
        </section>
      </div>
    </div>
  );
}

function MapMock({ userPos, nearest, setUserPos }) {
  const points = [
    [15, 72],
    [35, 52],
    [58, 33],
    [82, 20],
  ];

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "24px",
        padding: "16px",
        marginTop: "16px",
      }}
    >
      <h3 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "16px" }}>
        自動定位路線圖
      </h3>

      <div
        style={{
          position: "relative",
          height: "340px",
          borderRadius: "20px",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #d1fae5 0%, #e0f2fe 50%, #ecfccb 100%)",
          border: "2px solid #bbf7d0",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <path
            d="M15 72 C30 45 45 62 58 33 C70 12 76 35 82 20"
            fill="none"
            stroke="#166534"
            strokeWidth="3"
            strokeDasharray="3 4"
            strokeLinecap="round"
          />
        </svg>

        {stops.map((stop, index) => {
          const [x, y] = points[index];
          const Icon = stop.icon;

          return (
            <button
              key={stop.id}
              onClick={() => setUserPos({ lat: stop.lat, lng: stop.lng })}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                width: "58px",
                height: "58px",
                borderRadius: "999px",
                border: "4px solid white",
                backgroundColor:
                  nearest?.id === stop.id ? "#f97316" : "#047857",
                color: "white",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon />
            </button>
          );
        })}

        {userPos && nearest && (
          <div
            style={{
              position: "absolute",
              left: `${points[nearest.id - 1][0] + 6}%`,
              top: `${points[nearest.id - 1][1] + 8}%`,
              transform: "translate(-50%, -50%)",
              width: "28px",
              height: "28px",
              borderRadius: "999px",
              backgroundColor: "#2563eb",
              border: "4px solid white",
              boxShadow: "0 0 0 6px rgba(37,99,235,0.25)",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            left: "16px",
            right: "16px",
            bottom: "16px",
            background: "rgba(255,255,255,0.92)",
            borderRadius: "16px",
            padding: "12px",
            fontWeight: 700,
            color: "#064e3b",
          }}
        >
          點擊地圖站點可模擬定位；正式版會改由手機 GPS 自動判斷最近點位。
        </div>
      </div>
    </div>
  );
}

function GuidePage({ setMode }) {
  const [userPos, setUserPos] = useState(null);
  const [status, setStatus] = useState("尚未定位");
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);

  const nearest = useMemo(() => {
    if (!userPos) return null;
    return stops
      .map((s) => ({ ...s, distance: distanceMeters(userPos, s) }))
      .sort((a, b) => a.distance - b.distance)[0];
  }, [userPos]);

  function getGPS() {
    if (!navigator.geolocation) {
      setStatus("此瀏覽器不支援定位，請使用示範定位。");
      return;
    }
    setStatus("定位中，請允許瀏覽器存取位置。");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("定位成功，系統已跳出最近導覽點位。");
      },
      () => setStatus("定位失敗或未允許權限，請使用示範定位或點擊地圖站點。"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f5ef] px-5 py-6 text-stone-950">
      <div className="mx-auto max-w-6xl space-y-5">
        <div
          className="grid gap-3 md:grid-cols-3"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "#f6f5ef",
            padding: "12px 0",
          }}
        >
          <BigButton onClick={() => setMode("home")} secondary icon={Home}>
            回首頁
          </BigButton>
          <BigButton onClick={getGPS} icon={LocateFixed}>
            使用我的位置
          </BigButton>
          <BigButton
            onClick={() => {
              setUserPos({ lat: stops[2].lat, lng: stops[2].lng });
              setStatus("已使用示範定位：接近水樣森林");
            }}
            secondary
            icon={RotateCcw}
          >
            示範定位
          </BigButton>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <h1 className="text-4xl font-black text-emerald-950">自動定位導覽</h1>
          <p className="mt-3 text-xl leading-8 text-stone-700">
            根據使用者 GPS 位置，跳出附近點位的介紹、音頻與任務。
          </p>
          <p className="mt-3 rounded-2xl bg-emerald-50 p-4 text-lg font-bold text-emerald-900">
            {status}
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1fr_430px]">
          <MapMock
            userPos={userPos}
            nearest={nearest}
            setUserPos={(pos) => {
              setUserPos(pos);
              setStatus("已模擬移動到站點附近。");
              setDone(false);
              setPlaying(false);
            }}
          />
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            {!nearest ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <MapPin className="h-16 w-16 text-stone-400" />
                <h2 className="mt-4 text-3xl font-black text-stone-800">
                  等待定位
                </h2>
                <p className="mt-2 text-xl leading-8 text-stone-600">
                  請按使用我的位置，或點擊地圖站點。
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white ${nearest.color}`}
                  >
                    <nearest.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-orange-600">
                      偵測到附近點位
                    </p>
                    <h2 className="text-3xl font-black text-stone-950">
                      {nearest.title}
                    </h2>
                    <p className="mt-2 text-xl font-bold text-stone-600">
                      {nearest.subtitle}
                    </p>
                  </div>
                </div>
                <img
                  src={nearest.image}
                  alt=""
                  className="mt-5 h-44 w-full rounded-2xl object-cover"
                />
                <div className="mt-5">
                  <AudioBar
                    playing={playing}
                    setPlaying={setPlaying}
                    label="播放本站導覽"
                  />
                </div>
                <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-lg leading-8 text-stone-800">
                  {nearest.audio}
                </div>
                <div className="mt-5 rounded-2xl bg-amber-50 p-4">
                  <p className="text-xl font-black text-amber-900">本站任務</p>
                  <p className="mt-2 text-xl font-bold leading-8 text-stone-800">
                    {nearest.task}
                  </p>
                  <button
                    onClick={() => setDone(true)}
                    style={{
                      width: "100%",
                      backgroundColor: done ? "#16a34a" : "#047857",
                      color: "white",
                      border: "none",
                      borderRadius: "20px",
                      padding: "20px",
                      fontSize: "1.3rem",
                      fontWeight: "800",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      cursor: "pointer",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                      transition: "0.3s",
                    }}
                  >
                    <CheckCircle2 />

                    {done ? "已完成觀察" : "我完成觀察了"}
                  </button>
                  {done && (
                    <p className="mt-4 rounded-xl bg-white p-4 text-lg leading-8 text-stone-700">
                      {nearest.feedback}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SciencePage({ setMode }) {
  const PLANTNET_API_KEY = "2b10Src7a5Hrr35zqpB4yutOae";

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("請先拍攝或上傳植物照片。");

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

    setResults([]);
    setSelected(null);

    setMessage("照片已上傳，可以開始 AI 初步辨識。");
  }

  async function identifyPlant() {
    if (!file) {
      setMessage("請先上傳植物照片。");
      return;
    }

    setLoading(true);
    setMessage("AI 辨識中，請稍候……");

    try {
      const formData = new FormData();

      formData.append("images", file);
      formData.append("organs", "leaf");

      const response = await fetch(
        `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_API_KEY}&lang=zh`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("PlantNet error:", errorText);
        setMessage("AI 辨識失敗：" + errorText);
        return;
      }

      const data = await response.json();

      const parsed = (data.results || []).slice(0, 5).map((item) => ({
        name:
          item.species?.commonNames?.[0] ||
          item.species?.scientificNameWithoutAuthor ||
          "未知植物",

        scientific: item.species?.scientificNameWithoutAuthor || "無資料",

        confidence: Math.round((item.score || 0) * 100),
      }));

      setResults(parsed);

      if (parsed.length === 0) {
        setMessage("沒有找到明確植物結果。");
      } else {
        setMessage("AI 已完成初步辨識。");
      }
    } catch (err) {
      console.error(err);

      setMessage("辨識失敗，請確認 API KEY 或網路。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5ef] px-5 py-6 text-stone-950">
      <div className="mx-auto max-w-5xl space-y-5">
        <BigButton onClick={() => setMode("home")} secondary icon={Home}>
          回首頁
        </BigButton>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h1 className="text-4xl font-black text-emerald-950">公民科學家</h1>

          <p className="mt-3 text-xl leading-8 text-stone-700">
            拍下植物，AI 初步辨識，再由使用者確認並送出觀察紀錄。
          </p>

          <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-lg font-bold leading-8 text-emerald-900">
            {message}
          </p>
        </section>

        <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-emerald-950">
              上傳植物照片
            </h2>

            <label
              htmlFor="plant-photo"
              className="mt-5 flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-6 text-center transition hover:bg-emerald-100"
            >
              {preview ? (
                <img
                  src={preview}
                  className="h-60 w-full rounded-2xl object-cover"
                  alt=""
                />
              ) : (
                <>
                  <Upload className="h-16 w-16 text-emerald-700" />

                  <p className="mt-4 text-2xl font-black text-emerald-950">
                    點這裡拍照或上傳
                  </p>

                  <p className="mt-2 text-lg leading-8 text-stone-600">
                    建議拍攝葉片、花、果實。
                  </p>
                </>
              )}
            </label>

            <input
              id="plant-photo"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <div className="mt-5">
              <button
                onClick={identifyPlant}
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: loading ? "#94a3b8" : "#047857",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  padding: "20px",
                  fontSize: "1.3rem",
                  fontWeight: "900",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                }}
              >
                <Sparkles />

                {loading ? "AI 辨識中……" : "AI 初步辨識"}
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-emerald-950">
              AI 辨識結果
            </h2>

            {results.length === 0 ? (
              <p className="mt-5 rounded-2xl bg-stone-50 p-6 text-center text-lg text-stone-600">
                尚無辨識結果。
              </p>
            ) : (
              <div className="mt-5 space-y-3">
                {results.map((r, index) => (
                  <button
                    key={index}
                    onClick={() => setSelected(r)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selected?.name === r.name
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-stone-200 bg-white hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black text-stone-950">
                        {r.name}
                      </p>

                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-800">
                        {r.confidence}%
                      </span>
                    </div>

                    <p className="mt-2 text-lg leading-8 text-stone-700">
                      學名：{r.scientific}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {selected && (
              <div className="mt-5 rounded-2xl bg-amber-50 p-5">
                <p className="text-xl font-black text-amber-900">
                  確認後上傳觀察紀錄
                </p>

                <p className="mt-2 text-lg leading-8 text-stone-700">
                  你選擇了「{selected.name}」。
                </p>

                <button
                  style={{
                    width: "100%",
                    marginTop: "16px",
                    backgroundColor: "#ea580c",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    padding: "20px",
                    fontSize: "1.3rem",
                    fontWeight: "900",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  <CheckCircle2 />
                  送出觀察紀錄
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function HaomeiOneStopAudioVideoGuide() {
  const [mode, setMode] = useState("home");
  if (mode === "intro") return <IntroPage setMode={setMode} />;
  if (mode === "guide") return <GuidePage setMode={setMode} />;
  if (mode === "science") return <SciencePage setMode={setMode} />;
  return <HomePage setMode={setMode} />;
}
