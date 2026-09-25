import { useEffect, useRef, useState } from "react";
import "./App.css";

/* =========================================================
   GAME CONTENT
   ========================================================= */

const openingKey = "CWC2026initialpword72";

const adminPassword = "apassword";

/* =========================================================
   STAGE 1 — PART 1
   ========================================================= */

const stage1Part1 = {
  title: "Stage 1 — Part 1 of 2",
  location: "ADD LOCATION HERE",
  question: "ADD QUESTION HERE",
  password: "password",
  history: "ADD HISTORICAL INFORMATION HERE",
};

/* =========================================================
   STAGE 1 — PART 2
   ========================================================= */

const stage1Part2 = {
  title: "Stage 1 — Part 2 of 2",
  location: "ADD LOCATION HERE",
  question: "ADD QUESTION HERE",
  password: "password",
  history: "ADD HISTORICAL INFORMATION HERE",
};

/* =========================================================
   STAGE 2 — AUDI CAMERA / AI
   ========================================================= */

const stage2 = {
  title: "Stage 2",
  location: "ADD LOCATION HERE",
  question:
    "Find the Audi logo with its four interlocking rings and take a photograph of it using the camera.",
  aiInstruction:
    "Check whether the photograph clearly shows an Audi logo consisting of four interlocking rings. The four rings must be visibly identifiable in the newly captured photograph. Ignore other objects in the scene. Accept photographs where the logo is photographed from an angle, at a distance, or with other surroundings visible, as long as the four Audi rings are clearly identifiable.",
  history: "ADD HISTORICAL INFORMATION HERE",
};

/* =========================================================
   STAGES 3–11
   ========================================================= */

const stage3 = {
  title: "Stage 3",
  location: "ADD LOCATION HERE",
  question: "ADD QUESTION HERE",
  password: "password",
  history: "ADD HISTORICAL INFORMATION HERE",
};

const stage4 = {
  title: "Stage 4",
  location: "ADD LOCATION HERE",
  question: "ADD QUESTION HERE",
  password: "password",
  history: "ADD HISTORICAL INFORMATION HERE",
};

const stage5 = {
  title: "Stage 5",
  location: "ADD LOCATION HERE",
  question: "ADD QUESTION HERE",
  password: "password",
  history: "ADD HISTORICAL INFORMATION HERE",
};

const stage6 = {
  title: "Stage 6",
  location: "ADD LOCATION HERE",
  question: "ADD QUESTION HERE",
  password: "password",
  history: "ADD HISTORICAL INFORMATION HERE",
};

const stage7 = {
  title: "Stage 7",
  location: "ADD LOCATION HERE",
  question: "ADD QUESTION HERE",
  password: "password",
  history: "ADD HISTORICAL INFORMATION HERE",
};

const stage8 = {
  title: "Stage 8",
  location: "ADD LOCATION HERE",
  question: "ADD QUESTION HERE",
  password: "password",
  history: "ADD HISTORICAL INFORMATION HERE",
};

const stage9 = {
  title: "Stage 9",
  location: "ADD LOCATION HERE",
  question: "ADD QUESTION HERE",
  password: "password",
  history: "ADD HISTORICAL INFORMATION HERE",
};

const stage10 = {
  title: "Stage 10",
  location: "ADD LOCATION HERE",
  question: "ADD QUESTION HERE",
  password: "password",
  history: "ADD HISTORICAL INFORMATION HERE",
};

const stage11 = {
  title: "Stage 11",
  location: "ADD LOCATION HERE",
  question: "ADD QUESTION HERE",
  password: "password",
  history: "ADD HISTORICAL INFORMATION HERE",
};

/* =========================================================
   STAGE 12 — GPS
   ========================================================= */

const stage12 = {
  title: "Stage 12",
  location: "Final location",
  question: "Reach the final GPS location.",
  latitude: 52.1830833,
  longitude: 0.16525,
  radius: 5,
  history: "ADD HISTORICAL INFORMATION HERE",
};

/* =========================================================
   FINAL TREASURE
   ========================================================= */

const finalWhat3Words = "///ADD.WHAT3WORDS.HERE";

/* =========================================================
   NORMAL STAGES
   ========================================================= */

const normalStages = [
  stage3,
  stage4,
  stage5,
  stage6,
  stage7,
  stage8,
  stage9,
  stage10,
  stage11,
];

type StageData = {
  title: string;
  location: string;
  question: string;
  password?: string;
  history: string;
};

/* =========================================================
   APP
   ========================================================= */

export default function App() {
  /* -------------------------------------------------------
     OPENING
     ------------------------------------------------------- */

  const [gameUnlocked, setGameUnlocked] = useState(false);
  const [openingInput, setOpeningInput] = useState("");
  const [openingError, setOpeningError] = useState("");

  /* -------------------------------------------------------
     LOCATION PERMISSION
     ------------------------------------------------------- */

  const [locationPermissionRequested, setLocationPermissionRequested] =
    useState(false);

  const [locationPermissionError, setLocationPermissionError] = useState("");

  /* -------------------------------------------------------
     GAME
     ------------------------------------------------------- */

  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  /* -------------------------------------------------------
     STAGE 1
     ------------------------------------------------------- */

  const [stage1Part, setStage1Part] = useState<1 | 2>(1);
  const [stage1Answer, setStage1Answer] = useState("");

  /* -------------------------------------------------------
     NORMAL ANSWERS
     ------------------------------------------------------- */

  const [answer, setAnswer] = useState("");

  /* -------------------------------------------------------
     STAGE 2 CAMERA
     ------------------------------------------------------- */

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<File | null>(null);

  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(
    null
  );

  const [aiChecking, setAiChecking] = useState(false);
  const [cameraError, setCameraError] = useState("");

  /* -------------------------------------------------------
     STAGE 12 GPS
     ------------------------------------------------------- */

  const [locationDistance, setLocationDistance] = useState<number | null>(
    null
  );

  const [locationReady, setLocationReady] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(false);

  /* -------------------------------------------------------
     GENERAL MESSAGE
     ------------------------------------------------------- */

  const [stageMessage, setStageMessage] = useState("");

  /* -------------------------------------------------------
     FINAL
     ------------------------------------------------------- */

  const [showFinal, setShowFinal] = useState(false);

  /* -------------------------------------------------------
     ADMIN
     ------------------------------------------------------- */

  const [showAdmin, setShowAdmin] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminError, setAdminError] = useState("");

  /* =======================================================
     CAMERA REFERENCES
     ======================================================= */

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /* =======================================================
     STOP CAMERA
     ======================================================= */

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    setCameraActive(false);
  }

  /* =======================================================
     START CAMERA
     ======================================================= */

  async function startCamera() {
    setCameraError("");
    setStageMessage("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Your browser does not support camera access.");
      return;
    }

    try {
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      setCameraActive(true);

      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
      }, 100);
    } catch {
      setCameraError(
        "Camera access was not granted. Please allow camera access and try again."
      );
    }
  }

  /* =======================================================
     TAKE PHOTO
     ======================================================= */

  function takePhoto() {
    const video = videoRef.current;

    if (!video) {
      setCameraError("Camera is not ready yet.");
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError("The camera is still starting. Try again in a moment.");
      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError("Could not capture the photograph.");
      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Could not create the photograph.");
          return;
        }

        const file = new File(
          [blob],
          `stage-2-photo-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        if (capturedImageUrl) {
          URL.revokeObjectURL(capturedImageUrl);
        }

        const url = URL.createObjectURL(file);

        setCapturedImage(file);
        setCapturedImageUrl(url);

        stopCamera();

        setStageMessage(
          "Photo captured. Submit it for the Audi logo check."
        );
      },
      "image/jpeg",
      0.9
    );
  }

  /* =======================================================
     RETAKE PHOTO
     ======================================================= */

  function retakePhoto() {
    if (capturedImageUrl) {
      URL.revokeObjectURL(capturedImageUrl);
    }

    setCapturedImage(null);
    setCapturedImageUrl(null);
    setCameraError("");
    setStageMessage("");

    startCamera();
  }

  /* =======================================================
     CLEAN UP CAMERA / IMAGE URL
     ======================================================= */

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }

      if (capturedImageUrl) {
        URL.revokeObjectURL(capturedImageUrl);
      }
    };
  }, [capturedImageUrl]);

  /* =======================================================
     REQUEST LOCATION PERMISSION
     ======================================================= */

  function requestLocationPermission() {
    setLocationPermissionRequested(true);
    setLocationPermissionError("");

    if (!navigator.geolocation) {
      setLocationPermissionError(
        "This device or browser does not support location services."
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        /* Permission granted. */
      },
      () => {
        setLocationPermissionError(
          "Location access was not granted. You can continue, but location access will be needed for Stage 12."
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  }

  /* =======================================================
     OPENING KEY
     ======================================================= */

  function unlockGame() {
    if (openingInput === openingKey) {
      setGameUnlocked(true);
      setOpeningError("");
    } else {
      setOpeningError("That key is not correct.");
    }
  }

  /* =======================================================
     REQUEST LOCATION AFTER OPENING
     ======================================================= */

  useEffect(() => {
    if (gameUnlocked && !locationPermissionRequested) {
      requestLocationPermission();
    }
  }, [gameUnlocked, locationPermissionRequested]);

  /* =======================================================
     COMPLETE STAGE
     ======================================================= */

  function markStageComplete(stageNumber: number) {
    setCompletedStages((previous) => {
      if (previous.includes(stageNumber)) {
        return previous;
      }

      return [...previous, stageNumber].sort(
        (a, b) => a - b
      );
    });

    setStageMessage("Stage complete!");

    setAnswer("");
    setStage1Answer("");
    setCapturedImage(null);

    if (capturedImageUrl) {
      URL.revokeObjectURL(capturedImageUrl);
      setCapturedImageUrl(null);
    }

    stopCamera();

    setLocationDistance(null);
    setLocationReady(false);
  }

  /* =======================================================
     OPEN STAGE
     ======================================================= */

  function openStage(stageNumber: number) {
    stopCamera();

    setSelectedStage(stageNumber);
    setStageMessage("");
    setAnswer("");
    setStage1Answer("");
    setCapturedImage(null);

    if (capturedImageUrl) {
      URL.revokeObjectURL(capturedImageUrl);
      setCapturedImageUrl(null);
    }

    setLocationDistance(null);
    setLocationReady(false);
    setCameraError("");

    if (stageNumber === 1) {
      if (completedStages.includes(1)) {
        setStage1Part(2);
      } else {
        setStage1Part(1);
      }
    }
  }

  /* =======================================================
     STAGE 1
     ======================================================= */

  function submitStage1() {
    const currentPassword =
      stage1Part === 1
        ? stage1Part1.password
        : stage1Part2.password;

    if (stage1Answer === currentPassword) {
      if (stage1Part === 1) {
        setStage1Part(2);
        setStage1Answer("");

        setStageMessage(
          "Part 1 complete. Part 2 unlocked."
        );
      } else {
        markStageComplete(1);
      }
    } else {
      setStageMessage("That answer is not correct.");
    }
  }

  /* =======================================================
     NORMAL PASSWORD STAGES
     ======================================================= */

  function submitNormalStage(
    stageNumber: number,
    stage: StageData
  ) {
    if (answer === stage.password) {
      markStageComplete(stageNumber);
    } else {
      setStageMessage("That answer is not correct.");
    }
  }

  /* =======================================================
     STAGE 2 — AI RECOGNITION
     ======================================================= */

  async function checkStage2Image() {
    if (!capturedImage) {
      setStageMessage("Take a photograph first.");
      return;
    }

    setAiChecking(true);
    setStageMessage("");

    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Could not read the image."));
          }
        };

        reader.onerror = () => {
          reject(new Error("Could not read the image."));
        };

        reader.readAsDataURL(capturedImage);
      });

      const response = await fetch("/api/recognise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageData,
        }),
      });

      if (!response.ok) {
        throw new Error("AI recognition request failed.");
      }

      const result = await response.json();

      if (result.match === true) {
        markStageComplete(2);
      } else {
        setStageMessage(
          "The AI could not confirm the four Audi rings. Try taking another photo."
        );
      }
    } catch (error) {
      console.error(error);

      setStageMessage(
        "There was a problem connecting to the AI recognition service."
      );
    } finally {
      setAiChecking(false);
    }
  }

  /* =======================================================
     GPS DISTANCE
     ======================================================= */

  function getDistanceInMetres(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number
  ) {
    const earthRadius = 6371000;

    const toRadians = (degrees: number) =>
      (degrees * Math.PI) / 180;

    const latitudeDifference = toRadians(
      latitude2 - latitude1
    );

    const longitudeDifference = toRadians(
      longitude2 - longitude1
    );

    const a =
      Math.sin(latitudeDifference / 2) ** 2 +
      Math.cos(toRadians(latitude1)) *
        Math.cos(toRadians(latitude2)) *
        Math.sin(longitudeDifference / 2) ** 2;

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadius * c;
  }

  /* =======================================================
     STAGE 12 — CHECK LOCATION
     ======================================================= */

  function checkStage12Location() {
    setCheckingLocation(true);
    setStageMessage("");

    if (!navigator.geolocation) {
      setStageMessage(
        "Location services are not available on this device."
      );

      setCheckingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance =
          getDistanceInMetres(
            position.coords.latitude,
            position.coords.longitude,
            stage12.latitude,
            stage12.longitude
          );

        setLocationDistance(distance);

        if (distance <= stage12.radius) {
          setLocationReady(true);

          setStageMessage(
            "You are close enough! You can now submit your location."
          );
        } else {
          setLocationReady(false);

          setStageMessage(
            "You're not close enough yet. Get closer to the location."
          );
        }

        setCheckingLocation(false);
      },
      () => {
        setLocationReady(false);

        setStageMessage(
          "We couldn't get your location. Make sure location access is enabled."
        );

        setCheckingLocation(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );
  }

  /* =======================================================
     STAGE 12 — SUBMIT
     ======================================================= */

  function submitStage12() {
    if (!locationReady) {
      setStageMessage(
        "You need to be within 5 metres first."
      );

      return;
    }

    markStageComplete(12);
  }

  /* =======================================================
     ADMIN LOGIN
     ======================================================= */

  function submitAdmin() {
    if (adminInput === adminPassword) {
      setAdminUnlocked(true);
      setAdminError("");
      setAdminInput("");
    } else {
      setAdminError("Incorrect admin password.");
    }
  }

  /* =======================================================
     ADMIN COMPLETE
     ======================================================= */

  function adminCompleteStage(stageNumber: number) {
    markStageComplete(stageNumber);
  }

  /* =======================================================
     ADMIN UNCOMPLETE
     ======================================================= */

  function adminUncompleteStage(stageNumber: number) {
    setCompletedStages((previous) =>
      previous.filter(
        (stage) => stage !== stageNumber
      )
    );

    if (stageNumber === 1) {
      setStage1Part(1);
    }

    if (stageNumber === 12) {
      setShowFinal(false);
    }

    setStageMessage(
      `Stage ${stageNumber} marked incomplete.`
    );
  }

  /* =======================================================
     FINAL CHECK
     ======================================================= */

  useEffect(() => {
    if (completedStages.length === 12) {
      setShowFinal(true);
      setSelectedStage(null);
    }
  }, [completedStages]);

  /* =======================================================
     OPENING SCREEN
     ======================================================= */

  if (!gameUnlocked) {
    return (
      <main className="game opening-screen">
        <p className="eyebrow">
          CWC TREASURE HUNT 2026
        </p>

        <h1>THE HUNT</h1>

        <p className="clue">
          Enter the key you have been given to
          begin your adventure.
        </p>

        <input
          type="text"
          value={openingInput}
          onChange={(event) =>
            setOpeningInput(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              unlockGame();
            }
          }}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Enter key"
        />

        <button onClick={unlockGame}>
          UNLOCK
        </button>

        {openingError && (
          <p className="error">
            {openingError}
          </p>
        )}
      </main>
    );
  }

  /* =======================================================
     FINAL SCREEN
     ======================================================= */

  if (showFinal) {
    return (
      <main className="map-page">
        <section className="final-panel">
          <div className="final-icon">
            🏆
          </div>

          <p className="eyebrow">
            ALL STAGES COMPLETE
          </p>

          <h1>
            THE TREASURE AWAITS
          </h1>

          <div className="what3words">
            <p>
              YOUR FINAL LOCATION
            </p>

            <strong>
              {finalWhat3Words}
            </strong>
          </div>

          <p className="final-instruction">
            Make your way to the location
            above to find the treasure.
          </p>

          <button
            onClick={() => {
              setShowAdmin(true);
              setAdminUnlocked(false);
              setAdminError("");
            }}
          >
            ADMIN
          </button>
        </section>

        {showAdmin && (
          <AdminPanel
            adminInput={adminInput}
            setAdminInput={setAdminInput}
            adminError={adminError}
            setAdminError={setAdminError}
            adminUnlocked={adminUnlocked}
            submitAdmin={submitAdmin}
            completedStages={completedStages}
            adminCompleteStage={adminCompleteStage}
            adminUncompleteStage={adminUncompleteStage}
            close={() => setShowAdmin(false)}
          />
        )}
      </main>
    );
  }

  /* =======================================================
     STAGE SCREEN
     ======================================================= */

  if (selectedStage !== null) {
    return (
      <StageScreen
        selectedStage={selectedStage}
        completedStages={completedStages}
        stage1Part={stage1Part}
        stage1Answer={stage1Answer}
        setStage1Answer={setStage1Answer}
        submitStage1={submitStage1}
        stageMessage={stageMessage}
        answer={answer}
        setAnswer={setAnswer}
        submitNormalStage={submitNormalStage}
        cameraActive={cameraActive}
        videoRef={videoRef}
        startCamera={startCamera}
        takePhoto={takePhoto}
        capturedImage={capturedImage}
        capturedImageUrl={capturedImageUrl}
        retakePhoto={retakePhoto}
        checkStage2Image={checkStage2Image}
        aiChecking={aiChecking}
        cameraError={cameraError}
        checkStage12Location={checkStage12Location}
        submitStage12={submitStage12}
        locationDistance={locationDistance}
        locationReady={locationReady}
        checkingLocation={checkingLocation}
        onBack={() => {
          stopCamera();
          setSelectedStage(null);
        }}
      />
    );
  }

  /* =======================================================
     MAIN MAP
     ======================================================= */

  return (
    <main className="map-page">
      <header className="map-header">
        <p className="eyebrow">
          CWC TREASURE HUNT 2026
        </p>

        <h1>THE MAP</h1>

        <p>
          {completedStages.length} / 12
          stages complete
        </p>
      </header>

      {locationPermissionError && (
        <div className="location-box">
          <h2>
            LOCATION ACCESS
          </h2>

          <p>
            {locationPermissionError}
          </p>

          <button
            onClick={
              requestLocationPermission
            }
          >
            TRY AGAIN
          </button>
        </div>
      )}

      <section className="doors">
        {Array.from(
          { length: 12 },
          (_, index) => {
            const stageNumber = index + 1;

            const completed =
              completedStages.includes(
                stageNumber
              );

            return (
              <button
                key={stageNumber}
                className={`door ${
                  completed ? "completed" : ""
                }`}
                onClick={() =>
                  openStage(stageNumber)
                }
              >
                <span className="door-number">
                  {completed
                    ? "✓"
                    : stageNumber}
                </span>

                {completed && (
                  <span className="door-complete">
                    COMPLETE
                  </span>
                )}
              </button>
            );
          }
        )}
      </section>

      <p className="progress">
        {completedStages.length === 12
          ? "ALL STAGES COMPLETE"
          : "Complete all 12 doors to unlock the treasure."}
      </p>

      <button
        onClick={() => {
          setShowAdmin(true);
          setAdminUnlocked(false);
          setAdminError("");
        }}
      >
        ADMIN
      </button>

      {showAdmin && (
        <AdminPanel
          adminInput={adminInput}
          setAdminInput={setAdminInput}
          adminError={adminError}
          setAdminError={setAdminError}
          adminUnlocked={adminUnlocked}
          submitAdmin={submitAdmin}
          completedStages={completedStages}
          adminCompleteStage={adminCompleteStage}
          adminUncompleteStage={adminUncompleteStage}
          close={() => setShowAdmin(false)}
        />
      )}
    </main>
  );
}

/* =========================================================
   STAGE SCREEN
   ========================================================= */

function StageScreen({
  selectedStage,
  completedStages,
  stage1Part,
  stage1Answer,
  setStage1Answer,
  submitStage1,
  stageMessage,
  answer,
  setAnswer,
  submitNormalStage,
  cameraActive,
  videoRef,
  startCamera,
  takePhoto,
  capturedImage,
  capturedImageUrl,
  retakePhoto,
  checkStage2Image,
  aiChecking,
  cameraError,
  checkStage12Location,
  submitStage12,
  locationDistance,
  locationReady,
  checkingLocation,
  onBack,
}: {
  selectedStage: number;
  completedStages: number[];
  stage1Part: 1 | 2;
  stage1Answer: string;
  setStage1Answer: (value: string) => void;
  submitStage1: () => void;
  stageMessage: string;
  answer: string;
  setAnswer: (value: string) => void;
  submitNormalStage: (
    stageNumber: number,
    stage: StageData
  ) => void;

  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  startCamera: () => void;
  takePhoto: () => void;

  capturedImage: File | null;
  capturedImageUrl: string | null;

  retakePhoto: () => void;

  checkStage2Image: () => void;

  aiChecking: boolean;

  cameraError: string;

  checkStage12Location: () => void;
  submitStage12: () => void;

  locationDistance: number | null;
  locationReady: boolean;
  checkingLocation: boolean;

  onBack: () => void;
}) {
  const isCompleted =
    completedStages.includes(selectedStage);

  /* =======================================================
     COMPLETED STAGE
     ======================================================= */

  if (isCompleted) {
    let history = "";

    if (selectedStage === 1) {
      history = stage1Part1.history;
    } else if (selectedStage === 2) {
      history = stage2.history;
    } else if (selectedStage === 12) {
      history = stage12.history;
    } else {
      history =
        normalStages[selectedStage - 3]?.history || "";
    }

    return (
      <main className="map-page stage-page">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← BACK TO MAP
        </button>

        <section className="stage-content completed-content">
          <div className="success-mark">
            ✓
          </div>

          <p className="eyebrow">
            STAGE COMPLETE
          </p>

          <h1>
            DOOR {selectedStage}
          </h1>

          <div className="history-box">
            <h3>HISTORY</h3>

            <p>
              {history}
            </p>
          </div>

          <button onClick={onBack}>
            RETURN TO MAP
          </button>
        </section>
      </main>
    );
  }

  /* =======================================================
     STAGE INFORMATION
     ======================================================= */

  let title = "";
  let location = "";
  let question = "";

  if (selectedStage === 1) {
    const data =
      stage1Part === 1
        ? stage1Part1
        : stage1Part2;

    title = data.title;
    location = data.location;
    question = data.question;
  } else if (selectedStage === 2) {
    title = stage2.title;
    location = stage2.location;
    question = stage2.question;
  } else if (selectedStage === 12) {
    title = stage12.title;
    location = stage12.location;
    question = stage12.question;
  } else {
    const data =
      normalStages[selectedStage - 3];

    title = data.title;
    location = data.location;
    question = data.question;
  }

  /* =======================================================
     STAGE PAGE
     ======================================================= */

  return (
    <main className="map-page stage-page">
      <button
        className="back-button"
        onClick={onBack}
      >
        ← BACK TO MAP
      </button>

      <section className="stage-content">
        <div className="stage-number">
          {selectedStage}
        </div>

        <h1>{title}</h1>

        <div className="location-box">
          <div className="location-icon">
            📍
          </div>

          <h2>LOCATION</h2>

          <p>
            {location}
          </p>
        </div>

        <div className="question-box">
          <div className="question-icon">
            🗺️
          </div>

          <h2>
            YOUR CHALLENGE
          </h2>

          <p>
            {question}
          </p>
        </div>

        {/* =================================================
            STAGE 1
           ================================================= */}

        {selectedStage === 1 && (
          <div className="answer-area">
            <p>
              ENTER THE ANSWER
            </p>

            <input
              type="text"
              value={stage1Answer}
              onChange={(event) =>
                setStage1Answer(
                  event.target.value
                )
              }
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Enter answer"
            />

            <button
              onClick={submitStage1}
            >
              SUBMIT
            </button>
          </div>
        )}

        {/* =================================================
            STAGE 2 — CAMERA
           ================================================= */}

        {selectedStage === 2 && (
          <div className="answer-area">
            <p>
              CAMERA CHALLENGE
            </p>

            {!cameraActive &&
              !capturedImage && (
                <>
                  <p>
                    You must take a
                    new photograph
                    of the four Audi
                    rings.
                  </p>

                  <button
                    onClick={startCamera}
                  >
                    OPEN CAMERA
                  </button>
                </>
              )}

            {cameraActive && (
              <>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "600px",
                    margin: "20px auto",
                    overflow: "hidden",
                    borderRadius: "8px",
                    border: "3px solid #704421",
                    background: "#000",
                  }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: "100%",
                      display: "block",
                    }}
                  />
                </div>

                <button
                  onClick={takePhoto}
                >
                  TAKE PHOTO
                </button>

                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  style={{
                    background: "transparent",
                    color: "#5b351d",
                    border: "1px solid #80552e",
                  }}
                >
                  CANCEL CAMERA
                </button>
              </>
            )}

            {capturedImage &&
              capturedImageUrl && (
                <>
                  <p>
                    <strong>
                      PHOTO CAPTURED
                    </strong>
                  </p>

                  <img
                    src={capturedImageUrl}
                    alt="Captured Audi logo"
                    style={{
                      width: "100%",
                      maxWidth: "600px",
                      display: "block",
                      margin: "20px auto",
                      borderRadius: "8px",
                      border: "3px solid #704421",
                    }}
                  />

                  <button
                    onClick={checkStage2Image}
                    disabled={aiChecking}
                  >
                    {aiChecking
                      ? "CHECKING PHOTO..."
                      : "SUBMIT PHOTO"}
                  </button>

                  <button
                    onClick={retakePhoto}
                    disabled={aiChecking}
                    style={{
                      background: "transparent",
                      color: "#5b351d",
                      border: "1px solid #80552e",
                    }}
                  >
                    RETAKE PHOTO
                  </button>
                </>
              )}

            {cameraError && (
              <p className="error">
                {cameraError}
              </p>
            )}
          </div>
        )}

        {/* =================================================
            STAGES 3–11
           ================================================= */}

        {selectedStage >= 3 &&
          selectedStage <= 11 && (
            <div className="answer-area">
              <p>
                ENTER THE ANSWER
              </p>

              <input
                type="text"
                value={answer}
                onChange={(event) =>
                  setAnswer(
                    event.target.value
                  )
                }
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Enter answer"
              />

              <button
                onClick={() =>
                  submitNormalStage(
                    selectedStage,
                    normalStages[
                      selectedStage - 3
                    ]
                  )
                }
              >
                SUBMIT
              </button>
            </div>
          )}

        {/* =================================================
            STAGE 12 — GPS
           ================================================= */}

        {selectedStage === 12 && (
          <div className="answer-area">
            <p>
              GPS CHALLENGE
            </p>

            <p>
              You need to be within{" "}
              <strong>
                5 metres
              </strong>{" "}
              of the correct
              location.
            </p>

            {!locationReady && (
              <button
                onClick={
                  checkStage12Location
                }
                disabled={
                  checkingLocation
                }
              >
                {checkingLocation
                  ? "CHECKING LOCATION..."
                  : "CHECK MY LOCATION"}
              </button>
            )}

            {locationDistance !== null && (
              <p>
                Distance from
                target:{" "}
                <strong>
                  {Math.round(
                    locationDistance * 10
                  ) / 10}{" "}
                  m
                </strong>
              </p>
            )}

            {locationReady && (
              <>
                <p>
                  ✅ You are within
                  5 metres.
                </p>

                <button
                  onClick={
                    submitStage12
                  }
                >
                  SUBMIT LOCATION
                </button>
              </>
            )}
          </div>
        )}

        {stageMessage && (
          <p className="error">
            {stageMessage}
          </p>
        )}
      </section>
    </main>
  );
}

/* =========================================================
   ADMIN PANEL
   ========================================================= */

function AdminPanel({
  adminInput,
  setAdminInput,
  adminError,
  setAdminError,
  adminUnlocked,
  submitAdmin,
  completedStages,
  adminCompleteStage,
  adminUncompleteStage,
  close,
}: {
  adminInput: string;
  setAdminInput: (value: string) => void;
  adminError: string;
  setAdminError: (value: string) => void;
  adminUnlocked: boolean;
  submitAdmin: () => void;
  completedStages: number[];
  adminCompleteStage: (
    stageNumber: number
  ) => void;
  adminUncompleteStage: (
    stageNumber: number
  ) => void;
  close: () => void;
}) {
  return (
    <div className="admin-panel">
      <h2>ADMIN</h2>

      {!adminUnlocked ? (
        <>
          <input
            type="password"
            value={adminInput}
            onChange={(event) => {
              setAdminInput(
                event.target.value
              );

              setAdminError("");
            }}
            placeholder="Admin password"
          />

          <button
            onClick={submitAdmin}
          >
            UNLOCK ADMIN
          </button>

          {adminError && (
            <p className="error">
              {adminError}
            </p>
          )}
        </>
      ) : (
        <>
          <p>
            Admin controls
            unlocked.
          </p>

          <div className="admin-controls">
            {Array.from(
              { length: 12 },
              (_, index) => {
                const stageNumber =
                  index + 1;

                const completed =
                  completedStages.includes(
                    stageNumber
                  );

                return (
                  <div
                    key={stageNumber}
                  >
                    <span>
                      Stage{" "}
                      {stageNumber}
                    </span>

                    {completed ? (
                      <button
                        onClick={() =>
                          adminUncompleteStage(
                            stageNumber
                          )
                        }
                      >
                        UNCOMPLETE
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          adminCompleteStage(
                            stageNumber
                          )
                        }
                      >
                        COMPLETE
                      </button>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </>
      )}

      <button onClick={close}>
        CLOSE
      </button>
    </div>
  );
}
