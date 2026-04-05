import { useMemo, useState } from "react";

export default function App() {
  const [roomName, setRoomName] = useState("2학년 1반 교실");
  const [timeZone, setTimeZone] = useState("아침시간");
  const [brightness, setBrightness] = useState(40);
  const [temperature, setTemperature] = useState(23);
  const [co2, setCo2] = useState(900);
  const [devices, setDevices] = useState(4);

  const [boardOn, setBoardOn] = useState(true);
  const [airconOn, setAirconOn] = useState(false);
  const [frontDoorOpen, setFrontDoorOpen] = useState(false);
  const [backDoorOpen, setBackDoorOpen] = useState(false);
  const [windows, setWindows] = useState([false, false, false, false]);

  const [lights, setLights] = useState([
    true, true, true, true, false,
    false, false, false, false, false,
  ]);

  const [seats, setSeats] = useState([
    true, true, true, true, true,
    true, true, true, true, true,
    true, true, true, true, true,
    true, true, true, true, true,
    true, true, true, true, false,
    false, false, false, false, false,
  ]);

  const people = useMemo(() => seats.filter(Boolean).length, [seats]);
  const lightsOnCount = useMemo(() => lights.filter(Boolean).length, [lights]);
  const openWindowCount = useMemo(() => windows.filter(Boolean).length, [windows]);

  const data = useMemo(() => {
    const power =
      lightsOnCount * 20 +
      devices * 60 +
      (boardOn ? 120 : 0) +
      (airconOn ? 300 : 0);

    let status = "쾌적";
    let message = "현재 상태가 비교적 안정적입니다.";

    if (co2 > 1500) {
      status = "환기 필요";
      message = "이산화탄소 농도가 높습니다. 창문을 열어 환기하세요.";
    } else if (temperature > 27 && !airconOn) {
      status = "주의";
      message = "실내 온도가 높습니다. 냉난방기를 켜거나 환기를 검토하세요.";
    } else if (temperature > 27 && airconOn) {
      status = "관리 중";
      message = "실내 온도가 높지만 냉난방기가 가동 중입니다.";
    } else if (temperature < 19 && !airconOn) {
      status = "주의";
      message = "실내 온도가 낮습니다. 난방 상태를 확인하세요.";
    } else if (temperature < 19 && airconOn) {
      status = "관리 중";
      message = "실내 온도가 낮아 냉난방기가 가동 중입니다.";
    } else if (brightness > 75) {
      message = "자연채광이 충분합니다. 일부 전등을 꺼도 됩니다.";
    } else if (brightness < 30) {
      message = "실내가 어두워 전등 점등이 필요합니다.";
    }

    if (co2 > 1000 && openWindowCount === 0) {
      message += " 현재 창문이 모두 닫혀 있습니다.";
    }

    return { power, status, message };
  }, [
    lightsOnCount,
    devices,
    boardOn,
    airconOn,
    co2,
    temperature,
    brightness,
    openWindowCount,
  ]);

  const toggleSeat = (index) => {
    setSeats((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const toggleLight = (index) => {
    setLights((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const toggleWindow = (index) => {
    setWindows((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const lightPositions = [
    { id: 1, left: "22%", top: "170px" },
    { id: 2, left: "36%", top: "170px" },
    { id: 3, left: "50%", top: "170px" },
    { id: 4, left: "64%", top: "170px" },
    { id: 5, left: "78%", top: "170px" },

    { id: 6, left: "22%", top: "235px" },
    { id: 7, left: "36%", top: "235px" },
    { id: 8, left: "50%", top: "235px" },
    { id: 9, left: "64%", top: "235px" },
    { id: 10, left: "78%", top: "235px" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerCard}>
          <div>
            <div style={styles.badge}>학교 전력량 분석 프로젝트</div>
            <h1 style={styles.title}>스마트 교실 관리 앱</h1>
            <p style={styles.subtitle}>
              현재 교실 상태를 시뮬레이션하고 전력과 환경 정보를 함께 확인하는 프로토타입
            </p>
          </div>

          <div style={styles.timeCard}>
            <div style={styles.timeLabel}>조사 시간대</div>
            <div style={styles.timeValue}>{timeZone}</div>
          </div>
        </div>

        <div style={styles.mainGrid}>
          <div style={styles.leftCol}>
            <div style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <div style={styles.smallLabel}>가상 공간</div>
                  <h2 style={styles.roomTitle}>{roomName}</h2>
                </div>

                <div style={styles.buttonRow}>
                  <div style={styles.miniInfo}>학생 {people}명</div>
                  <div style={styles.miniInfo}>전등 {lightsOnCount}/10</div>
                  <div style={styles.miniInfo}>창문 {openWindowCount}/4</div>
                </div>
              </div>

              <div style={styles.classroomBox}>
                <div style={styles.classroomInnerPanel}>
                  <button
                    type="button"
                    onClick={() => setBoardOn((v) => !v)}
                    style={{
                      ...styles.board,
                      background: boardOn
                        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
                        : "#94a3b8",
                      boxShadow: boardOn
                        ? "0 12px 24px rgba(15,23,42,0.18)"
                        : "none",
                    }}
                    title={`전자칠판 ${boardOn ? "켜짐" : "꺼짐"}`}
                  >
                    전자칠판
                  </button>

                  <button
                    type="button"
                    onClick={() => setAirconOn((v) => !v)}
                    style={{
                      ...styles.airconFront,
                      background: airconOn ? "#dbeafe" : "#eef2f7",
                      borderColor: airconOn ? "#60a5fa" : "#dbe3ee",
                      color: airconOn ? "#2563eb" : "#64748b",
                      boxShadow: airconOn
                        ? "0 8px 18px rgba(59,130,246,0.18)"
                        : "none",
                    }}
                    title={`냉난방기 ${airconOn ? "켜짐" : "꺼짐"}`}
                  >
                    <div style={styles.airconIconWrap}>
                      <AirconIcon />
                    </div>
                    냉난방기
                  </button>

                  <button
                    type="button"
                    onClick={() => setAirconOn((v) => !v)}
                    style={{
                      ...styles.airconBack,
                      background: airconOn ? "#dbeafe" : "#eef2f7",
                      borderColor: airconOn ? "#60a5fa" : "#dbe3ee",
                      color: airconOn ? "#2563eb" : "#64748b",
                      boxShadow: airconOn
                        ? "0 8px 18px rgba(59,130,246,0.18)"
                        : "none",
                    }}
                    title={`냉난방기 ${airconOn ? "켜짐" : "꺼짐"}`}
                  >
                    <div style={styles.airconIconWrap}>
                      <AirconIcon />
                    </div>
                    냉난방기
                  </button>

                  <div style={styles.windowWall}>
                    {windows.map((isOpen, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleWindow(i)}
                        style={{
                          ...styles.windowBox,
                          background: isOpen ? "#dbeafe" : "#f1f5f9",
                          borderColor: isOpen ? "#60a5fa" : "#dbe3ee",
                          color: isOpen ? "#2563eb" : "#64748b",
                        }}
                        title={`창문 ${i + 1} ${isOpen ? "열림" : "닫힘"}`}
                      >
                        창문
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setFrontDoorOpen((v) => !v)}
                    style={{
                      ...styles.frontDoor,
                      background: frontDoorOpen ? "#86efac" : "#a8b3c2",
                    }}
                    title={`앞문 ${frontDoorOpen ? "열림" : "닫힘"}`}
                  >
                    앞문
                  </button>

                  <button
                    type="button"
                    onClick={() => setBackDoorOpen((v) => !v)}
                    style={{
                      ...styles.backDoor,
                      background: backDoorOpen ? "#86efac" : "#a8b3c2",
                    }}
                    title={`뒷문 ${backDoorOpen ? "열림" : "닫힘"}`}
                  >
                    뒷문
                  </button>

                  <div style={styles.lightZoneLabel}>조명 영역</div>
                  {lightPositions.map((light, index) => (
                    <button
                      key={light.id}
                      type="button"
                      onClick={() => toggleLight(index)}
                      style={{
                        ...styles.lightIconButton,
                        left: light.left,
                        top: light.top,
                        color: lights[index] ? "#f59e0b" : "#cbd5e1",
                        opacity: lights[index] ? 1 : 0.38,
                        filter: lights[index]
                          ? "drop-shadow(0 0 12px rgba(245,158,11,0.38))"
                          : "none",
                      }}
                      title={`전등 ${light.id} ${lights[index] ? "켜짐" : "꺼짐"}`}
                    >
                      <LightBulbIcon />
                    </button>
                  ))}

                  <div style={styles.seatZoneLabel}>착석 영역</div>
                  <div style={styles.seatsGrid}>
                    {seats.map((occupied, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleSeat(index)}
                        style={{
                          ...styles.personIconButton,
                          color: occupied ? "#3b82f6" : "#cbd5e1",
                          opacity: occupied ? 1 : 0.3,
                          transform: occupied ? "scale(1)" : "scale(0.9)",
                          filter: occupied
                            ? "drop-shadow(0 6px 10px rgba(59,130,246,0.15))"
                            : "none",
                        }}
                        title={`자리 ${index + 1} ${occupied ? "착석" : "비어 있음"}`}
                      >
                        <PersonSilhouetteIcon />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.statsGrid}>
                <InfoCard label="전등 상태" value={`${lightsOnCount}/10`} />
                <InfoCard label="예상 전력" value={`${data.power}W`} />
                <InfoCard label="공기 상태" value={data.status} />
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>분석 결과</h3>
              <div style={styles.messageBox}>{data.message}</div>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>환경 조절 패널</h3>

            <TextInput
              label="공간 이름"
              value={roomName}
              onChange={setRoomName}
            />

            <SelectInput
              label="조사 시간대"
              value={timeZone}
              onChange={setTimeZone}
              options={["아침시간", "점심시간", "하교 후"]}
            />

            <Slider
              label="밝기"
              value={brightness}
              setValue={setBrightness}
              min={0}
              max={100}
            />
            <Slider
              label="온도"
              value={temperature}
              setValue={setTemperature}
              min={10}
              max={35}
            />
            <Slider
              label="CO₂"
              value={co2}
              setValue={setCo2}
              min={400}
              max={2000}
            />
            <Slider
              label="기기 수"
              value={devices}
              setValue={setDevices}
              min={0}
              max={10}
            />

            <div style={styles.legendBox}>
              <div style={styles.legendTitle}>도형 클릭 기능</div>

              <div style={styles.legendRow}>
                <div style={styles.legendIcon}><LightBulbIcon /></div>
                <span>전등 클릭: 켜짐 / 꺼짐 변경</span>
              </div>

              <div style={styles.legendRow}>
                <div style={styles.legendIcon}><PersonSilhouetteIcon /></div>
                <span>학생 클릭: 착석 / 빈자리 변경</span>
              </div>

              <div style={styles.legendRow}>
                <div style={styles.legendIcon}><AirconIcon /></div>
                <span>냉난방기 클릭: 켜짐 / 꺼짐 변경</span>
              </div>

              <div style={styles.legendRow}>
                <div style={{ ...styles.legendRectThin, background: "#dbeafe" }} />
                <span>창문 클릭: 열림 / 닫힘 변경</span>
              </div>

              <div style={styles.legendRow}>
                <div style={{ ...styles.legendRectThin, background: "#86efac" }} />
                <span>문 클릭: 열림 / 닫힘 변경</span>
              </div>

              <div style={styles.legendRow}>
                <div style={{ ...styles.legendBoard, background: "#1e293b" }} />
                <span>전자칠판 클릭: 켜짐 / 꺼짐 변경</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LightBulbIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-4.74 12.15c.62.57 1.13 1.2 1.44 1.95l.15.35h6.3l.15-.35c.31-.75.82-1.38 1.44-1.95A7 7 0 0 0 12 2Z" />
      <path d="M9.5 18h5a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1Z" />
      <path d="M10 20h4a2 2 0 0 1-4 0Z" />
    </svg>
  );
}

function PersonSilhouetteIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M5 19c0-3.35 3.13-5.5 7-5.5s7 2.15 7 5.5" />
    </svg>
  );
}

function AirconIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="7" rx="2" fill="currentColor" opacity="0.9" />
      <path d="M8 15c0 1-.6 1.5-1.4 2.2-.7.6-1.1 1.1-1.1 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 15c0 1-.6 1.5-1.4 2.2-.7.6-1.1 1.1-1.1 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16 15c0 1-.6 1.5-1.4 2.2-.7.6-1.1 1.1-1.1 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function InfoCard({ label, value }) {
  return (
    <div style={styles.infoCard}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value}</div>
    </div>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <div style={styles.controlBlock}>
      <label style={styles.controlLabel}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <div style={styles.controlBlock}>
      <label style={styles.controlLabel}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function Slider({ label, value, setValue, min, max }) {
  return (
    <div style={styles.controlBlock}>
      <div style={styles.sliderTop}>
        <span style={styles.controlLabel}>{label}</span>
        <span style={styles.sliderValue}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={styles.range}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #eff6ff 0%, #e0f2fe 35%, #eef2ff 100%)",
    padding: "24px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "grid",
    gap: "24px",
  },
  headerCard: {
    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(10px)",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(255,255,255,0.6)",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-block",
    background: "#eef2ff",
    color: "#4338ca",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: 700,
  },
  title: {
    margin: "14px 0 8px",
    fontSize: "40px",
    lineHeight: 1.1,
    color: "#0f172a",
  },
  subtitle: {
    margin: 0,
    color: "#475569",
    fontSize: "16px",
  },
  timeCard: {
    minWidth: "180px",
    background: "#f8fafc",
    borderRadius: "20px",
    padding: "18px",
    alignSelf: "flex-start",
    border: "1px solid #e2e8f0",
  },
  timeLabel: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "6px",
  },
  timeValue: {
    fontSize: "24px",
    fontWeight: 800,
    color: "#1e293b",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.25fr 0.75fr",
    gap: "24px",
  },
  leftCol: {
    display: "grid",
    gap: "24px",
  },
  card: {
    background: "rgba(255,255,255,0.86)",
    backdropFilter: "blur(10px)",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(255,255,255,0.7)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  miniInfo: {
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "10px 12px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#334155",
    border: "1px solid #e2e8f0",
  },
  smallLabel: {
    color: "#64748b",
    fontSize: "13px",
  },
  roomTitle: {
    margin: "6px 0 0",
    color: "#0f172a",
    fontSize: "28px",
  },
  classroomBox: {
    marginTop: "20px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,1) 100%)",
    borderRadius: "28px",
    minHeight: "900px",
    position: "relative",
    overflow: "hidden",
    padding: "18px",
    border: "1px solid #e2e8f0",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
  },
  classroomInnerPanel: {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "864px",
    borderRadius: "24px",
    background:
      "linear-gradient(180deg, #f8fbff 0%, #f3f7fb 100%)",
    border: "1px solid #e2e8f0",
  },
  board: {
    position: "absolute",
    top: "18px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "280px",
    height: "42px",
    color: "#ffffff",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    letterSpacing: "0.5px",
    border: "none",
    cursor: "pointer",
  },
  airconFront: {
    position: "absolute",
    top: "78px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "140px",
    height: "38px",
    borderRadius: "12px",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  airconBack: {
    position: "absolute",
    bottom: "34px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "140px",
    height: "38px",
    borderRadius: "12px",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  airconIconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  lightZoneLabel: {
    position: "absolute",
    top: "126px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "12px",
    fontWeight: 700,
    color: "#94a3b8",
    letterSpacing: "0.08em",
  },
  seatZoneLabel: {
    position: "absolute",
    top: "300px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "12px",
    fontWeight: 700,
    color: "#94a3b8",
    letterSpacing: "0.08em",
  },
  windowWall: {
    position: "absolute",
    left: "18px",
    top: "300px",
    bottom: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  windowBox: {
    width: "22px",
    height: "96px",
    borderRadius: "10px",
    border: "4px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "9px",
    fontWeight: 700,
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    overflow: "hidden",
    cursor: "pointer",
  },
  frontDoor: {
    position: "absolute",
    right: "0px",
    top: "325px",
    width: "26px",
    height: "120px",
    borderTopLeftRadius: "14px",
    borderBottomLeftRadius: "14px",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    border: "none",
    cursor: "pointer",
  },
  backDoor: {
    position: "absolute",
    right: "0px",
    bottom: "180px",
    width: "26px",
    height: "120px",
    borderTopLeftRadius: "14px",
    borderBottomLeftRadius: "14px",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    border: "none",
    cursor: "pointer",
  },
  lightIconButton: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    background: "transparent",
    border: "none",
    padding: 0,
    margin: 0,
    lineHeight: 1,
    cursor: "pointer",
    zIndex: 3,
  },
  seatsGrid: {
    position: "absolute",
    top: "330px",
    left: "110px",
    right: "100px",
    bottom: "120px",
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "34px 24px",
    alignContent: "start",
    justifyItems: "center",
  },
  personIconButton: {
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    padding: 0,
    margin: 0,
    cursor: "pointer",
  },
  statsGrid: {
    marginTop: "18px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
  },
  infoCard: {
    background: "#f8fafc",
    borderRadius: "18px",
    padding: "16px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
  },
  infoLabel: {
    fontSize: "13px",
    color: "#64748b",
  },
  infoValue: {
    marginTop: "8px",
    fontSize: "24px",
    fontWeight: 800,
    color: "#0f172a",
  },
  sectionTitle: {
    margin: "0 0 16px",
    color: "#0f172a",
    fontSize: "22px",
  },
  messageBox: {
    background: "#f8fafc",
    borderRadius: "18px",
    padding: "18px",
    color: "#334155",
    lineHeight: 1.6,
    border: "1px solid #e2e8f0",
  },
  controlBlock: {
    marginBottom: "18px",
  },
  controlLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: 700,
    color: "#334155",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    boxSizing: "border-box",
    background: "#ffffff",
  },
  sliderTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderValue: {
    color: "#64748b",
    fontWeight: 700,
  },
  range: {
    width: "100%",
  },
  legendBox: {
    marginTop: "20px",
    background: "#f8fafc",
    borderRadius: "18px",
    padding: "16px",
    display: "grid",
    gap: "10px",
    border: "1px solid #e2e8f0",
  },
  legendTitle: {
    fontSize: "14px",
    fontWeight: 800,
    color: "#334155",
    marginBottom: "4px",
  },
  legendRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#475569",
    fontSize: "14px",
  },
  legendIcon: {
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
  },
  legendRectThin: {
    width: "10px",
    height: "22px",
    borderRadius: "4px",
  },
  legendBoard: {
    width: "28px",
    height: "10px",
    borderRadius: "4px",
  },
};