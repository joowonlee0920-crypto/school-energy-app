import { useEffect, useMemo, useState } from "react";

const ROOM_PRESETS = {
  room1: {
    label: "2학년 1반 교실",
    timeZone: "아침시간",
    boardOn: true,
    airconMode: "off",
    desktopOn: false,
    tabletOn: false,
    frontDoorOpen: false,
    backDoorOpen: false,
    windows: [false, false, false, false],
    lights: [true, true, true, true, false, false, false, false, false, false],
    seats: [
      true, true, true, true, true,
      true, true, true, true, true,
      true, true, true, true, true,
      true, true, true, true, true,
      true, true, true, true, false,
      false, false, false, false, false,
    ],
    sensorData: {
      outsideTemp: 18,
      indoorTemp: 24,
      pm25: 27,
      airQuality: "좋음",
    },
  },
  room2: {
    label: "2학년 2반 교실",
    timeZone: "점심시간",
    boardOn: true,
    airconMode: "cool",
    desktopOn: true,
    tabletOn: true,
    frontDoorOpen: false,
    backDoorOpen: false,
    windows: [true, false, true, false],
    lights: [true, true, true, true, true, true, false, false, false, false],
    seats: [
      true, true, true, true, true,
      true, true, true, true, true,
      true, true, true, true, true,
      true, true, false, false, false,
      false, false, false, false, false,
      false, false, false, false, false,
    ],
    sensorData: {
      outsideTemp: 20,
      indoorTemp: 27,
      pm25: 36,
      airQuality: "보통",
    },
  },
  lab: {
    label: "과학실",
    timeZone: "실험시간",
    boardOn: true,
    airconMode: "heat",
    desktopOn: true,
    tabletOn: false,
    frontDoorOpen: true,
    backDoorOpen: false,
    windows: [false, true, false, true],
    lights: [true, true, true, true, true, true, true, true, false, false],
    seats: [
      true, true, true, true, true,
      true, true, true, true, true,
      true, true, true, true, true,
      false, false, false, false, false,
      false, false, false, false, false,
      false, false, false, false, false,
    ],
    sensorData: {
      outsideTemp: 14,
      indoorTemp: 19,
      pm25: 22,
      airQuality: "좋음",
    },
  },
};

export default function App() {
  const [selectedRoomKey, setSelectedRoomKey] = useState("room1");

  const [roomName, setRoomName] = useState(ROOM_PRESETS.room1.label);
  const [timeZone, setTimeZone] = useState(ROOM_PRESETS.room1.timeZone);

  const [boardOn, setBoardOn] = useState(ROOM_PRESETS.room1.boardOn);
  const [airconMode, setAirconMode] = useState(ROOM_PRESETS.room1.airconMode);
  const [desktopOn, setDesktopOn] = useState(ROOM_PRESETS.room1.desktopOn);
  const [tabletOn, setTabletOn] = useState(ROOM_PRESETS.room1.tabletOn);

  const [frontDoorOpen, setFrontDoorOpen] = useState(ROOM_PRESETS.room1.frontDoorOpen);
  const [backDoorOpen, setBackDoorOpen] = useState(ROOM_PRESETS.room1.backDoorOpen);
  const [windows, setWindows] = useState(ROOM_PRESETS.room1.windows);

  const [lights, setLights] = useState(ROOM_PRESETS.room1.lights);
  const [seats, setSeats] = useState(ROOM_PRESETS.room1.seats);

  const [sensorData, setSensorData] = useState({
    ...ROOM_PRESETS.room1.sensorData,
    updatedAt: new Date(),
  });

  const [selected, setSelected] = useState({ type: "room", index: null });
  const [rightPanelTab, setRightPanelTab] = useState("control");

  const applyRoomPreset = (roomKey) => {
    const room = ROOM_PRESETS[roomKey];
    if (!room) return;

    setSelectedRoomKey(roomKey);
    setRoomName(room.label);
    setTimeZone(room.timeZone);

    setBoardOn(room.boardOn);
    setAirconMode(room.airconMode);
    setDesktopOn(room.desktopOn);
    setTabletOn(room.tabletOn);

    setFrontDoorOpen(room.frontDoorOpen);
    setBackDoorOpen(room.backDoorOpen);
    setWindows([...room.windows]);
    setLights([...room.lights]);
    setSeats([...room.seats]);

    setSensorData({
      ...room.sensorData,
      updatedAt: new Date(),
    });

    setSelected({ type: "room", index: null });
    setRightPanelTab("control");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prev) => {
        const outsideTemp = prev.outsideTemp;
        const indoorTemp = Math.max(17, Math.min(30, prev.indoorTemp + (Math.random() > 0.5 ? 1 : -1)));
        const pm25 = Math.max(8, Math.min(70, prev.pm25 + Math.floor(Math.random() * 7) - 3));

        let airQuality = "좋음";
        if (pm25 > 55) airQuality = "나쁨";
        else if (pm25 > 30) airQuality = "보통";

        return {
          outsideTemp,
          indoorTemp,
          pm25,
          airQuality,
          updatedAt: new Date(),
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const people = useMemo(() => seats.filter(Boolean).length, [seats]);
  const lightsOnCount = useMemo(() => lights.filter(Boolean).length, [lights]);
  const openWindowCount = useMemo(() => windows.filter(Boolean).length, [windows]);

  const brightnessLevel = useMemo(() => {
    if (lightsOnCount >= 8) return "매우 밝음";
    if (lightsOnCount >= 5) return "적정";
    if (lightsOnCount >= 2) return "조금 어두움";
    return "어두움";
  }, [lightsOnCount]);

  const airconPower = useMemo(() => {
    if (airconMode === "cool") return 320;
    if (airconMode === "heat") return 280;
    return 0;
  }, [airconMode]);

  const airconStatusText = useMemo(() => {
    if (airconMode === "cool") return "냉방 중";
    if (airconMode === "heat") return "난방 중";
    return "꺼짐";
  }, [airconMode]);

  const deviceStatus = useMemo(() => {
    const list = [];
    if (boardOn) list.push("전자칠판");
    if (airconMode === "cool") list.push("냉난방기(냉방)");
    if (airconMode === "heat") list.push("냉난방기(난방)");
    if (desktopOn) list.push("데스크탑 PC");
    if (tabletOn) list.push("태블릿함");
    return list;
  }, [boardOn, airconMode, desktopOn, tabletOn]);

  const totalPower = useMemo(() => {
    return (
      lightsOnCount * 20 +
      (boardOn ? 120 : 0) +
      airconPower +
      (desktopOn ? 150 : 0) +
      (tabletOn ? 80 : 0)
    );
  }, [lightsOnCount, boardOn, airconPower, desktopOn, tabletOn]);

  const analysis = useMemo(() => {
    let status = "쾌적";
    let message = "현재 교실 환경이 비교적 안정적입니다.";

    if (sensorData.pm25 > 55) {
      status = "주의";
      message = "교실 내 미세먼지 농도가 높습니다. 창문 상태와 공기질을 점검하고 환기를 우선 검토해 보세요.";
    } else if (sensorData.indoorTemp > 27 && airconMode !== "cool") {
      status = "냉방 필요";
      message = "실내 온도가 높습니다. 냉방 모드 전환이나 추가 환기를 통해 쾌적도를 높일 수 있습니다.";
    } else if (sensorData.indoorTemp < 19 && airconMode !== "heat") {
      status = "난방 필요";
      message = "실내 온도가 낮습니다. 난방 모드 전환을 고려하면 학습 환경이 더 안정적일 수 있습니다.";
    } else if (lightsOnCount <= 2) {
      status = "조도 부족";
      message = "켜진 전등 수가 적어 교실 조도가 부족할 수 있습니다. 필요한 구역의 조명을 추가로 켜 보세요.";
    } else if (openWindowCount === 0 && people > 20) {
      status = "환기 점검";
      message = "학생 수에 비해 환기가 부족할 수 있습니다. 창문 일부를 열어 공기 흐름을 확보하는 것이 좋습니다.";
    }

    return { status, message };
  }, [sensorData, airconMode, lightsOnCount, openWindowCount, people]);

  const toggleSeat = (index) => {
    setSeats((prev) => prev.map((v, i) => (i === index ? !v : v)));
    setSelected({ type: "seat", index });
    setRightPanelTab("control");
  };

  const setAllSeats = (value) => {
    setSeats(Array(30).fill(value));
    setSelected({ type: "room", index: null });
    setRightPanelTab("control");
  };

  const toggleLight = (index) => {
    setLights((prev) => prev.map((v, i) => (i === index ? !v : v)));
    setSelected({ type: "light", index });
    setRightPanelTab("control");
  };

  const setAllLights = (value) => {
    setLights(Array(10).fill(value));
    setSelected({ type: "room", index: null });
    setRightPanelTab("control");
  };

  const toggleWindow = (index) => {
    setWindows((prev) => prev.map((v, i) => (i === index ? !v : v)));
    setSelected({ type: "window", index });
    setRightPanelTab("control");
  };

  const toggleBoard = () => {
    setBoardOn((prev) => !prev);
    setSelected({ type: "board", index: null });
    setRightPanelTab("control");
  };

  const toggleDesktop = () => {
    setDesktopOn((prev) => !prev);
    setSelected({ type: "desktop", index: null });
    setRightPanelTab("control");
  };

  const toggleTablet = () => {
    setTabletOn((prev) => !prev);
    setSelected({ type: "tablet", index: null });
    setRightPanelTab("control");
  };

  const selectAircon = () => {
    setSelected({ type: "aircon", index: null });
    setRightPanelTab("control");
  };

  const setAirconState = (mode) => {
    setAirconMode(mode);
    setSelected({ type: "aircon", index: null });
    setRightPanelTab("control");
  };

  const toggleFrontDoor = () => {
    setFrontDoorOpen((prev) => !prev);
    setSelected({ type: "frontDoor", index: null });
    setRightPanelTab("control");
  };

  const toggleBackDoor = () => {
    setBackDoorOpen((prev) => !prev);
    setSelected({ type: "backDoor", index: null });
    setRightPanelTab("control");
  };

  const lightPositions = [
    { id: 1, left: "22%", top: "210px" },
    { id: 2, left: "36%", top: "210px" },
    { id: 3, left: "50%", top: "210px" },
    { id: 4, left: "64%", top: "210px" },
    { id: 5, left: "78%", top: "210px" },
    { id: 6, left: "22%", top: "275px" },
    { id: 7, left: "36%", top: "275px" },
    { id: 8, left: "50%", top: "275px" },
    { id: 9, left: "64%", top: "275px" },
    { id: 10, left: "78%", top: "275px" },
  ];

  const renderSelectedInfo = () => {
    if (selected.type === "light" && selected.index !== null) {
      const isOn = lights[selected.index];
      return (
        <>
          <ControlInfoCard label="현재 선택" value={`전등 ${selected.index + 1}`} />
          <ControlInfoCard label="상태" value={isOn ? "켜짐" : "꺼짐"} />
          <ControlInfoCard label="전력 사용" value={isOn ? "20W" : "0W"} />
          <button type="button" style={styles.primaryAction} onClick={() => toggleLight(selected.index)}>
            전등 {isOn ? "끄기" : "켜기"}
          </button>
        </>
      );
    }

    if (selected.type === "window" && selected.index !== null) {
      const isOpen = windows[selected.index];
      return (
        <>
          <ControlInfoCard label="현재 선택" value={`창문 ${selected.index + 1}`} />
          <ControlInfoCard label="상태" value={isOpen ? "열림" : "닫힘"} />
          <ControlInfoCard label="환기 영향" value={isOpen ? "환기 중" : "환기 없음"} />
          <button type="button" style={styles.primaryAction} onClick={() => toggleWindow(selected.index)}>
            창문 {isOpen ? "닫기" : "열기"}
          </button>
        </>
      );
    }

    if (selected.type === "aircon") {
      return (
        <>
          <ControlInfoCard label="현재 선택" value="냉난방기" />
          <ControlInfoCard label="상태" value={airconStatusText} />
          <ControlInfoCard label="전력 사용" value={`${airconPower}W`} />
          <div style={styles.modeButtonRow}>
            <button
              type="button"
              style={{ ...styles.modeButton, ...(airconMode === "off" ? styles.modeButtonActive : {}) }}
              onClick={() => setAirconState("off")}
            >
              끄기
            </button>
            <button
              type="button"
              style={{ ...styles.modeButton, ...(airconMode === "cool" ? styles.modeButtonActiveBlue : {}) }}
              onClick={() => setAirconState("cool")}
            >
              냉방
            </button>
            <button
              type="button"
              style={{ ...styles.modeButton, ...(airconMode === "heat" ? styles.modeButtonActiveRed : {}) }}
              onClick={() => setAirconState("heat")}
            >
              난방
            </button>
          </div>
        </>
      );
    }

    if (selected.type === "board") {
      return (
        <>
          <ControlInfoCard label="현재 선택" value="전자칠판" />
          <ControlInfoCard label="상태" value={boardOn ? "켜짐" : "꺼짐"} />
          <ControlInfoCard label="전력 사용" value={boardOn ? "120W" : "0W"} />
          <button type="button" style={styles.primaryAction} onClick={toggleBoard}>
            전자칠판 {boardOn ? "끄기" : "켜기"}
          </button>
        </>
      );
    }

    if (selected.type === "desktop") {
      return (
        <>
          <ControlInfoCard label="현재 선택" value="데스크탑 PC" />
          <ControlInfoCard label="상태" value={desktopOn ? "켜짐" : "꺼짐"} />
          <ControlInfoCard label="전력 사용" value={desktopOn ? "150W" : "0W"} />
          <button type="button" style={styles.primaryAction} onClick={toggleDesktop}>
            데스크탑 PC {desktopOn ? "끄기" : "켜기"}
          </button>
        </>
      );
    }

    if (selected.type === "tablet") {
      return (
        <>
          <ControlInfoCard label="현재 선택" value="태블릿함" />
          <ControlInfoCard label="상태" value={tabletOn ? "충전 중" : "대기"} />
          <ControlInfoCard label="전력 사용" value={tabletOn ? "80W" : "0W"} />
          <button type="button" style={styles.primaryAction} onClick={toggleTablet}>
            태블릿함 {tabletOn ? "끄기" : "켜기"}
          </button>
        </>
      );
    }

    if (selected.type === "seat" && selected.index !== null) {
      const occupied = seats[selected.index];
      return (
        <>
          <ControlInfoCard label="현재 선택" value={`학생 자리 ${selected.index + 1}`} />
          <ControlInfoCard label="상태" value={occupied ? "착석" : "비어 있음"} />
          <ControlInfoCard label="영향" value={occupied ? "재실 인원 반영" : "재실 인원 제외"} />
          <button type="button" style={styles.primaryAction} onClick={() => toggleSeat(selected.index)}>
            {occupied ? "자리 비우기" : "학생 추가"}
          </button>
        </>
      );
    }

    return (
      <>
        <ControlInfoCard label="현재 선택" value="전체 교실" />
        <ControlInfoCard label="켜진 전등 수" value={`${lightsOnCount}개`} />
        <ControlInfoCard label="작동 중 기기" value={deviceStatus.length ? deviceStatus.join(", ") : "없음"} />
        <button
          type="button"
          style={styles.secondaryAction}
          onClick={() => setSelected({ type: "room", index: null })}
        >
          전체 교실 보기
        </button>
      </>
    );
  };

  const statusTone = getStatusTone(analysis.status);

  return (
    <div style={styles.page}>
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />

      <div style={styles.container}>
        <div style={styles.headerCard}>
          <div style={styles.headerTopRow}>
            <div>
              <div style={styles.badge}>학교 전력량 분석 프로젝트</div>
              <h1 style={styles.title}>스마트 교실 관리 앱</h1>
              <p style={styles.headerDesc}>
                가상 교실 상태를 직관적으로 제어하고, 실시간 데이터와 분석 결과를 한 화면에서 확인할 수 있습니다.
              </p>
            </div>

            <div style={styles.headerStatusCard}>
              <div style={styles.headerStatusLabel}>현재 환경 평가</div>
              <div style={{ ...styles.headerStatusValue, color: statusTone.text }}>{analysis.status}</div>
              <div style={styles.headerStatusSub}>총 전력 사용 {totalPower}W</div>
            </div>
          </div>

          <div style={styles.headerControls}>
            <div style={styles.headerField}>
              <span style={styles.headerFieldLabel}>공간 선택</span>
              <select
                value={selectedRoomKey}
                onChange={(e) => applyRoomPreset(e.target.value)}
                style={styles.roomSelect}
              >
                {Object.entries(ROOM_PRESETS).map(([key, room]) => (
                  <option key={key} value={key}>
                    {room.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.headerMetaWrap}>
              <div style={styles.headerMetaChip}>시간대 · {timeZone}</div>
              <div style={styles.headerMetaChip}>재실 인원 · {people}명</div>
              <div style={styles.headerMetaChip}>환기 · 창문 {openWindowCount}개 열림</div>
            </div>
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

                <div style={styles.quickStatsRow}>
                  <MiniStat label="학생" value={`${people}명`} />
                  <MiniStat label="전등" value={`${lightsOnCount}/10`} />
                  <MiniStat label="창문" value={`${openWindowCount}/4`} />
                </div>
              </div>

              <div style={styles.bulkControlWrap}>
                <div style={styles.bulkControlGroup}>
                  <div style={styles.bulkControlTitle}>전등 전체 제어</div>
                  <div style={styles.bulkButtonRow}>
                    <button type="button" style={styles.bulkButtonPrimary} onClick={() => setAllLights(true)}>
                      전체 켜짐
                    </button>
                    <button type="button" style={styles.bulkButton} onClick={() => setAllLights(false)}>
                      전체 꺼짐
                    </button>
                  </div>
                </div>

                <div style={styles.bulkControlGroup}>
                  <div style={styles.bulkControlTitle}>학생 전체 제어</div>
                  <div style={styles.bulkButtonRow}>
                    <button type="button" style={styles.bulkButtonPrimary} onClick={() => setAllSeats(true)}>
                      전체 있음
                    </button>
                    <button type="button" style={styles.bulkButton} onClick={() => setAllSeats(false)}>
                      전체 없음
                    </button>
                  </div>
                </div>
              </div>

              <div
                style={styles.classroomBox}
                onClick={() => {
                  setSelected({ type: "room", index: null });
                  setRightPanelTab("control");
                }}
              >
                <div style={styles.classroomInnerPanel} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.roomGlow} />

                  <button
                    type="button"
                    onClick={() => {
                      setSelected({ type: "board", index: null });
                      setRightPanelTab("control");
                    }}
                    style={{
                      ...styles.board,
                      background: boardOn
                        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
                        : "linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)",
                      boxShadow: boardOn ? "0 14px 28px rgba(15,23,42,0.22)" : "none",
                      outline: selected.type === "board" ? "3px solid #93c5fd" : "none",
                    }}
                  >
                    전자칠판
                  </button>

                  <div style={styles.deviceRow}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected({ type: "desktop", index: null });
                        setRightPanelTab("control");
                      }}
                      style={{
                        ...styles.deviceBox,
                        ...(selected.type === "desktop" ? styles.deviceBoxSelected : {}),
                        background: desktopOn ? "#e0f2fe" : "#f8fafc",
                        borderColor: desktopOn ? "#38bdf8" : "#dbe3ee",
                        color: desktopOn ? "#0369a1" : "#64748b",
                      }}
                    >
                      <div style={styles.deviceIconWrap}><DesktopIcon /></div>
                      데스크탑 PC
                    </button>

                    <button
                      type="button"
                      onClick={selectAircon}
                      style={{
                        ...styles.deviceBox,
                        ...(selected.type === "aircon" ? styles.deviceBoxSelected : {}),
                        background:
                          airconMode === "cool"
                            ? "#dbeafe"
                            : airconMode === "heat"
                              ? "#fee2e2"
                              : "#f8fafc",
                        borderColor:
                          airconMode === "cool"
                            ? "#60a5fa"
                            : airconMode === "heat"
                              ? "#fca5a5"
                              : "#dbe3ee",
                        color:
                          airconMode === "cool"
                            ? "#2563eb"
                            : airconMode === "heat"
                              ? "#dc2626"
                              : "#64748b",
                      }}
                    >
                      <div style={styles.deviceIconWrap}><AirconIcon /></div>
                      냉난방기
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelected({ type: "tablet", index: null });
                        setRightPanelTab("control");
                      }}
                      style={{
                        ...styles.deviceBox,
                        ...(selected.type === "tablet" ? styles.deviceBoxSelected : {}),
                        background: tabletOn ? "#ecfeff" : "#f8fafc",
                        borderColor: tabletOn ? "#22d3ee" : "#dbe3ee",
                        color: tabletOn ? "#0f766e" : "#64748b",
                      }}
                    >
                      <div style={styles.deviceIconWrap}><TabletBoxIcon /></div>
                      태블릿함
                    </button>
                  </div>

                  <div style={styles.windowWall}>
                    {windows.map((isOpen, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleWindow(i)}
                        style={{
                          ...styles.windowBox,
                          outline: selected.type === "window" && selected.index === i ? "3px solid #93c5fd" : "none",
                          background: isOpen ? "linear-gradient(180deg, #dbeafe 0%, #eff6ff 100%)" : "#f1f5f9",
                          borderColor: isOpen ? "#60a5fa" : "#dbe3ee",
                          color: isOpen ? "#2563eb" : "#64748b",
                        }}
                      >
                        창문
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={toggleFrontDoor}
                    style={{
                      ...styles.frontDoor,
                      background: frontDoorOpen
                        ? "linear-gradient(180deg, #22c55e 0%, #4ade80 100%)"
                        : "linear-gradient(180deg, #94a3b8 0%, #cbd5e1 100%)",
                    }}
                  >
                    앞문
                  </button>

                  <button
                    type="button"
                    onClick={toggleBackDoor}
                    style={{
                      ...styles.backDoor,
                      background: backDoorOpen
                        ? "linear-gradient(180deg, #22c55e 0%, #4ade80 100%)"
                        : "linear-gradient(180deg, #94a3b8 0%, #cbd5e1 100%)",
                    }}
                  >
                    뒷문
                  </button>

                  <div style={styles.zoneChipLight}>조명 영역</div>
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
                        opacity: lights[index] ? 1 : 0.35,
                        transform: "translate(-50%, -50%) scale(1)",
                        filter: lights[index] ? "drop-shadow(0 0 10px rgba(245,158,11,0.45))" : "none",
                        outline: selected.type === "light" && selected.index === index ? "3px solid #fde68a" : "none",
                        borderRadius: "999px",
                      }}
                    >
                      <LightBulbIcon />
                    </button>
                  ))}

                  <div style={styles.zoneChipSeat}>착석 영역</div>
                  <div style={styles.seatsGrid}>
                    {seats.map((occupied, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleSeat(index)}
                        style={{
                          ...styles.personIconButton,
                          color: occupied ? "#2563eb" : "#cbd5e1",
                          opacity: occupied ? 1 : 0.3,
                          transform: selected.type === "seat" && selected.index === index ? "scale(1.08)" : "scale(1)",
                          boxShadow:
                            selected.type === "seat" && selected.index === index
                              ? "0 0 0 3px rgba(147,197,253,0.9)"
                              : "none",
                          borderRadius: "14px",
                        }}
                      >
                        <PersonSilhouetteIcon />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.rightCol}>
            <div style={styles.cardSticky}>
              <div style={styles.panelHeaderRow}>
                <div>
                  <h3 style={styles.sectionTitle}>교실 관리 패널</h3>
                  <div style={styles.sectionSub}>선택한 요소 제어와 실시간 상태를 확인할 수 있습니다.</div>
                </div>

                <div
                  style={{
                    ...styles.statusPill,
                    background: statusTone.bg,
                    color: statusTone.text,
                    borderColor: statusTone.border,
                  }}
                >
                  {analysis.status}
                </div>
              </div>

              <div style={styles.tabRow}>
                <button
                  type="button"
                  onClick={() => setRightPanelTab("control")}
                  style={{ ...styles.tabButton, ...(rightPanelTab === "control" ? styles.tabButtonActive : {}) }}
                >
                  교실 제어
                </button>
                <button
                  type="button"
                  onClick={() => setRightPanelTab("sensor")}
                  style={{ ...styles.tabButton, ...(rightPanelTab === "sensor" ? styles.tabButtonActive : {}) }}
                >
                  실시간 데이터
                </button>
              </div>

              {rightPanelTab === "control" ? (
                <>
                  <div style={styles.panelBlock}>
                    <div style={styles.panelTitle}>선택된 요소 정보</div>
                    <div style={styles.controlInfoGrid}>{renderSelectedInfo()}</div>
                  </div>

                  <div style={styles.panelBlock}>
                    <div style={styles.panelTitle}>교실 전체 요약</div>
                    <div style={styles.summaryGrid}>
                      <InfoCard label="켜진 전등 수" value={`${lightsOnCount}개`} />
                      <InfoCard label="작동 중 기기" value={deviceStatus.length ? `${deviceStatus.length}종` : "0종"} />
                      <InfoCard label="총 전력 사용" value={`${totalPower}W`} />
                      <InfoCard label="환기 상태" value={`${openWindowCount}개 열림`} />
                    </div>
                  </div>
                </>
              ) : (
                <div style={styles.sensorPanel}>
                  <SensorCard label="외부기온" value={`${sensorData.outsideTemp}°C`} />
                  <SensorCard label="실내온도" value={`${sensorData.indoorTemp}°C`} />
                  <SensorCard label="미세먼지" value={`${sensorData.pm25} ㎍/m³`} />
                  <SensorCard label="공기질" value={sensorData.airQuality} />
                  <SensorCard label="최근 업데이트" value={sensorData.updatedAt.toLocaleTimeString()} />
                </div>
              )}

              <div style={styles.panelSummaryWrap}>
                <div style={styles.panelTitle}>환경 요약</div>
                <div style={styles.statsGrid}>
                  <InfoCard label="예상 밝기" value={brightnessLevel} />
                  <InfoCard label="예상 전력" value={`${totalPower}W`} />
                  <InfoCard label="공기 상태" value={analysis.status} />
                </div>
              </div>

              <div style={styles.analysisWrap}>
                <div style={styles.analysisTitle}>분석 결과</div>
                <div style={styles.analysisMessage}>{analysis.message}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusTone(status) {
  if (status === "주의") {
    return { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" };
  }
  if (status === "냉방 필요" || status === "난방 필요" || status === "환기 점검" || status === "조도 부족") {
    return { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" };
  }
  return { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" };
}

function MiniStat({ label, value }) {
  return (
    <div style={styles.miniStat}>
      <div style={styles.miniStatLabel}>{label}</div>
      <div style={styles.miniStatValue}>{value}</div>
    </div>
  );
}

function LightBulbIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-4.74 12.15c.62.57 1.13 1.2 1.44 1.95l.15.35h6.3l.15-.35c.31-.75.82-1.38 1.44-1.95A7 7 0 0 0 12 2Z" />
      <path d="M9.5 18h5a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1Z" />
      <path d="M10 20h4a2 2 0 0 1-4 0Z" />
    </svg>
  );
}

function PersonSilhouetteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M5 19c0-3.35 3.13-5.5 7-5.5s7 2.15 7 5.5" />
    </svg>
  );
}

function AirconIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="7" rx="2" fill="currentColor" opacity="0.9" />
      <path d="M8 15c0 1-.6 1.5-1.4 2.2-.7.6-1.1 1.1-1.1 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 15c0 1-.6 1.5-1.4 2.2-.7.6-1.1 1.1-1.1 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16 15c0 1-.6 1.5-1.4 2.2-.7.6-1.1 1.1-1.1 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function DesktopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 20h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 16v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TabletBoxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 9h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 13h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
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

function SensorCard({ label, value }) {
  return (
    <div style={styles.sensorCard}>
      <div style={styles.sensorLabel}>{label}</div>
      <div style={styles.sensorValue}>{value}</div>
    </div>
  );
}

function ControlInfoCard({ label, value }) {
  return (
    <div style={styles.controlInfoCard}>
      <div style={styles.controlInfoLabel}>{label}</div>
      <div style={styles.controlInfoValue}>{value}</div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f5f9ff 0%, #eef4ff 52%, #f8fbff 100%)",
    padding: "24px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: "relative",
    overflow: "hidden",
  },
  bgOrb1: {
    position: "absolute",
    width: "380px",
    height: "380px",
    borderRadius: "999px",
    background: "rgba(96,165,250,0.12)",
    filter: "blur(28px)",
    top: "-80px",
    right: "-80px",
    pointerEvents: "none",
  },
  bgOrb2: {
    position: "absolute",
    width: "320px",
    height: "320px",
    borderRadius: "999px",
    background: "rgba(34,197,94,0.08)",
    filter: "blur(28px)",
    bottom: "-60px",
    left: "-60px",
    pointerEvents: "none",
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1440px",
    margin: "0 auto",
    display: "grid",
    gap: "22px",
  },
  headerCard: {
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(10px)",
    borderRadius: "28px",
    padding: "26px",
    boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
    border: "1px solid rgba(255,255,255,0.7)",
  },
  headerTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-block",
    background: "linear-gradient(135deg, #eef2ff 0%, #dbeafe 100%)",
    color: "#3730a3",
    borderRadius: "999px",
    padding: "7px 12px",
    fontSize: "12px",
    fontWeight: 800,
    width: "fit-content",
    border: "1px solid #c7d2fe",
  },
  title: {
    margin: "12px 0 8px",
    fontSize: "36px",
    lineHeight: 1.1,
    color: "#0f172a",
    letterSpacing: "-0.03em",
  },
  headerDesc: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.6,
    maxWidth: "700px",
  },
  headerStatusCard: {
    minWidth: "220px",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    borderRadius: "20px",
    padding: "16px 18px",
    border: "1px solid #dbeafe",
    boxShadow: "0 10px 24px rgba(59,130,246,0.08)",
  },
  headerStatusLabel: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
  },
  headerStatusValue: {
    marginTop: "8px",
    fontSize: "28px",
    fontWeight: 800,
    lineHeight: 1.1,
  },
  headerStatusSub: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#475569",
    fontWeight: 700,
  },
  headerControls: {
    marginTop: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: "14px",
    flexWrap: "wrap",
  },
  headerField: {
    display: "grid",
    gap: "7px",
  },
  headerFieldLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: 800,
  },
  roomSelect: {
    minWidth: "240px",
    height: "46px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    padding: "0 14px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#0f172a",
    cursor: "pointer",
    boxShadow: "0 3px 8px rgba(15,23,42,0.04)",
  },
  headerMetaWrap: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  headerMetaChip: {
    fontSize: "13px",
    color: "#334155",
    fontWeight: 700,
    background: "#f8fafc",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "22px",
    alignItems: "start",
  },
  leftCol: {
    display: "grid",
    gap: "16px",
  },
  rightCol: {
    display: "grid",
    gap: "16px",
  },
  card: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(8px)",
    borderRadius: "28px",
    padding: "22px",
    boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
    border: "1px solid rgba(255,255,255,0.75)",
  },
  cardSticky: {
    position: "sticky",
    top: "20px",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(8px)",
    borderRadius: "28px",
    padding: "22px",
    boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
    border: "1px solid rgba(255,255,255,0.75)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  smallLabel: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
  },
  roomTitle: {
    margin: "4px 0 0",
    color: "#0f172a",
    fontSize: "28px",
    letterSpacing: "-0.03em",
  },
  quickStatsRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  miniStat: {
    minWidth: "96px",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "16px",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 6px 14px rgba(15,23,42,0.04)",
  },
  miniStatLabel: {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: 700,
  },
  miniStatValue: {
    marginTop: "4px",
    fontSize: "18px",
    fontWeight: 800,
    color: "#0f172a",
  },
  bulkControlWrap: {
    marginTop: "18px",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  bulkControlGroup: {
    background: "linear-gradient(180deg, #f8fbff 0%, #f8fafc 100%)",
    borderRadius: "18px",
    padding: "14px",
    border: "1px solid #e2e8f0",
  },
  bulkControlTitle: {
    fontSize: "13px",
    fontWeight: 800,
    color: "#334155",
    marginBottom: "10px",
  },
  bulkButtonRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  bulkButton: {
    padding: "10px 13px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  bulkButtonPrimary: {
    padding: "10px 13px",
    borderRadius: "12px",
    border: "1px solid #93c5fd",
    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    color: "#1d4ed8",
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  classroomBox: {
    marginTop: "20px",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    borderRadius: "28px",
    minHeight: "910px",
    position: "relative",
    overflow: "hidden",
    padding: "16px",
    border: "1px solid #dbe7f3",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
  },
  classroomInnerPanel: {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "874px",
    borderRadius: "22px",
    background: "linear-gradient(180deg, #f9fcff 0%, #f1f6fb 100%)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  roomGlow: {
    position: "absolute",
    inset: "0 auto auto 50%",
    width: "80%",
    height: "180px",
    transform: "translateX(-50%)",
    background: "radial-gradient(circle, rgba(147,197,253,0.16) 0%, rgba(147,197,253,0) 70%)",
    pointerEvents: "none",
  },
  board: {
    position: "absolute",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "300px",
    height: "46px",
    color: "#ffffff",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    letterSpacing: "-0.01em",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  deviceRow: {
    position: "absolute",
    top: "92px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "16px",
  },
  deviceBox: {
    width: "156px",
    height: "50px",
    borderRadius: "14px",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 6px 14px rgba(15,23,42,0.04)",
  },
  deviceBoxSelected: {
    boxShadow: "0 0 0 3px rgba(147,197,253,0.9)",
  },
  deviceIconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  zoneChipLight: {
    position: "absolute",
    top: "160px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "11px",
    fontWeight: 800,
    color: "#64748b",
    background: "rgba(255,255,255,0.92)",
    border: "1px solid #e2e8f0",
    borderRadius: "999px",
    padding: "5px 10px",
  },
  zoneChipSeat: {
    position: "absolute",
    top: "340px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "11px",
    fontWeight: 800,
    color: "#64748b",
    background: "rgba(255,255,255,0.92)",
    border: "1px solid #e2e8f0",
    borderRadius: "999px",
    padding: "5px 10px",
  },
  windowWall: {
    position: "absolute",
    left: "18px",
    top: "340px",
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
    fontWeight: 800,
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  frontDoor: {
    position: "absolute",
    right: "0px",
    top: "365px",
    width: "28px",
    height: "124px",
    borderTopLeftRadius: "14px",
    borderBottomLeftRadius: "14px",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    writingMode: "vertical-rl",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(15,23,42,0.12)",
  },
  backDoor: {
    position: "absolute",
    right: "0px",
    bottom: "180px",
    width: "28px",
    height: "124px",
    borderTopLeftRadius: "14px",
    borderBottomLeftRadius: "14px",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    writingMode: "vertical-rl",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(15,23,42,0.12)",
  },
  lightIconButton: {
    position: "absolute",
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  seatsGrid: {
    position: "absolute",
    top: "372px",
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
    background: "rgba(255,255,255,0.55)",
    border: "none",
    padding: 0,
    cursor: "pointer",
    transition: "all 0.18s ease",
  },
  panelHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "22px",
    letterSpacing: "-0.02em",
  },
  sectionSub: {
    marginTop: "6px",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.5,
  },
  statusPill: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
    border: "1px solid",
  },
  tabRow: {
    display: "flex",
    gap: "8px",
    marginTop: "16px",
    marginBottom: "16px",
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "4px",
    border: "1px solid #e2e8f0",
  },
  tabButton: {
    flex: 1,
    padding: "11px 12px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    color: "#475569",
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  tabButtonActive: {
    background: "#ffffff",
    color: "#0f172a",
    boxShadow: "0 3px 10px rgba(15,23,42,0.07)",
  },
  panelBlock: {
    marginTop: "16px",
    background: "linear-gradient(180deg, #f8fbff 0%, #f8fafc 100%)",
    borderRadius: "18px",
    padding: "14px",
    border: "1px solid #e2e8f0",
  },
  panelTitle: {
    fontSize: "13px",
    fontWeight: 800,
    color: "#334155",
    marginBottom: "10px",
  },
  panelSummaryWrap: {
    marginTop: "16px",
    background: "linear-gradient(180deg, #f8fbff 0%, #f8fafc 100%)",
    borderRadius: "18px",
    padding: "14px",
    border: "1px solid #e2e8f0",
  },
  controlInfoGrid: {
    display: "grid",
    gap: "8px",
  },
  controlInfoCard: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 10px rgba(15,23,42,0.03)",
  },
  controlInfoLabel: {
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "4px",
    fontWeight: 700,
  },
  controlInfoValue: {
    fontSize: "17px",
    fontWeight: 800,
    color: "#0f172a",
  },
  primaryAction: {
    marginTop: "4px",
    padding: "12px 13px",
    borderRadius: "13px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(37,99,235,0.20)",
  },
  secondaryAction: {
    marginTop: "4px",
    padding: "12px 13px",
    borderRadius: "13px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    fontWeight: 800,
    cursor: "pointer",
  },
  modeButtonRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    marginTop: "6px",
  },
  modeButton: {
    padding: "10px 8px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    fontWeight: 800,
    cursor: "pointer",
  },
  modeButtonActive: {
    background: "#0f172a",
    color: "#ffffff",
    border: "1px solid #0f172a",
  },
  modeButtonActiveBlue: {
    background: "#2563eb",
    color: "#ffffff",
    border: "1px solid #2563eb",
  },
  modeButtonActiveRed: {
    background: "#dc2626",
    color: "#ffffff",
    border: "1px solid #dc2626",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
  },
  sensorPanel: {
    display: "grid",
    gap: "10px",
  },
  sensorCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    borderRadius: "16px",
    padding: "14px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 6px 14px rgba(15,23,42,0.04)",
  },
  sensorLabel: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "4px",
    fontWeight: 700,
  },
  sensorValue: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#0f172a",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },
  infoCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "16px",
    padding: "14px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
    boxShadow: "0 6px 14px rgba(15,23,42,0.04)",
  },
  infoLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: 700,
  },
  infoValue: {
    marginTop: "6px",
    fontSize: "22px",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.02em",
  },
  analysisWrap: {
    marginTop: "16px",
    background: "linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%)",
    borderRadius: "20px",
    padding: "16px",
    border: "1px solid #bfdbfe",
    boxShadow: "0 12px 26px rgba(59,130,246,0.10)",
  },
  analysisTitle: {
    fontSize: "16px",
    fontWeight: 800,
    color: "#1d4ed8",
    marginBottom: "10px",
  },
  analysisMessage: {
    color: "#1e3a8a",
    lineHeight: 1.7,
    fontSize: "17px",
    fontWeight: 700,
  },
};
