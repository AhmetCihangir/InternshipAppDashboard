import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { Widget } from "../utils/components";
import { TEXT_COLOR } from "../utils/constants";
import { db } from "../firebase"; // ✅ src/firebase.js

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Firestore: _3true1wrong array, isTrue string, text string
const normalizeFacts = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((x) => x && typeof x.text === "string")
    .map((x) => ({
      text: x.text,
      isTrue: String(x.isTrue).toLowerCase() === "true", // ✅ "true"/"false" -> boolean
    }));
};

const Widget3true1wrong = () => {
  const [started, setStarted] = useState(false);
  const [personIndex, setPersonIndex] = useState(0);
  const [score, setScore] = useState(0);

  const [pickedText, setPickedText] = useState(null);
  const [results, setResults] = useState([]);
  const [showFinal, setShowFinal] = useState(false);

  // ✅ Firestore'dan gelecek oyuncular
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [playersError, setPlayersError] = useState("");
  const [debugInfo, setDebugInfo] = useState(""); // ✅ localhost test için

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoadingPlayers(true);
        setPlayersError("");
        setDebugInfo("");

        const snap = await getDocs(collection(db, "users"));

        const list = snap.docs.map((doc) => {
          const data = doc.data() || {};
          return {
            id: doc.id,
            name: data.name || data.fullName || "İsimsiz",
            facts: normalizeFacts(data._3true1wrong),
          };
        });

        // sadece 4 fact olanları al (oyun 3 true 1 wrong olduğu için)
        const filtered = list.filter((p) => p.facts.length === 4);

        // isim sıralı olsun
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

        setPlayers(filtered);
        
      } catch (e) {
        console.error("Firestore fetch error:", e);
        setPlayersError("Firebase verisi alınamadı (Firestore / users).");
        setDebugInfo(`❌ Firebase Hata: ${e?.code || e?.message || "unknown"}`);
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, []);

  const person = players[personIndex];
  const totalPeople = players.length;

  const options = useMemo(() => {
    if (!person) return [];
    return shuffle(person.facts);
  }, [person]); // ✅ personIndex gereksizdi

  // ✅ son kişide %100 olsun diye (personIndex+1)/totalPeople
  const progress =
    totalPeople === 0 ? 0 : Math.round(((personIndex + 1) / totalPeople) * 100);

  const handlePick = (opt) => {
    if (pickedText) return;
    setPickedText(opt.text);

    const isCorrect = opt.isTrue === false; // yanlış olanı seçmek = doğru hamle
    if (isCorrect) setScore((s) => s + 10);

    setResults((prev) => [
      ...prev,
      {
        personId: person.id,
        personName: person.name,
        correct: isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    setPickedText(null);

    if (personIndex + 1 < totalPeople) {
      setPersonIndex((i) => i + 1);
    } else {
      setShowFinal(true);
    }
  };

  const isFinished = started && showFinal;

  const resetGame = () => {
    setStarted(false);
    setPersonIndex(0);
    setScore(0);
    setPickedText(null);
    setResults([]);
    setShowFinal(false);
  };

  // Başlat butonu sadece data geldiyse aktif olsun
  const canStart = !loadingPlayers && !playersError && totalPeople > 0;

  return (
    <Widget title="3 True 1 Wrong Quiz" index={0}>
      <Box>
        {/* ✅ Localhost Firebase bağlantı durumunu net gör */}
        <Typography sx={{ color: TEXT_COLOR, opacity: 0.85, mb: 2 }}>
          {loadingPlayers ? "⏳ Firebase kontrol ediliyor..." : debugInfo}
        </Typography>

        {loadingPlayers ? (
          <Card sx={{ background: "transparent", border: `1px solid ${TEXT_COLOR}` }}>
            <CardContent>
              <Typography sx={{ color: TEXT_COLOR }}>Veriler yükleniyor...</Typography>
            </CardContent>
          </Card>
        ) : playersError ? (
          <Card sx={{ background: "transparent", border: `1px solid ${TEXT_COLOR}` }}>
            <CardContent>
              <Typography sx={{ color: TEXT_COLOR }}>{playersError}</Typography>
              <Typography sx={{ color: TEXT_COLOR, opacity: 0.85, mt: 1 }}>
                Firestore’da <b>users</b> collection ve her user doc’unda{" "}
                <b>name</b> + <b>_3true1wrong</b> (4 eleman) olmalı.
              </Typography>
              <Typography sx={{ color: TEXT_COLOR, opacity: 0.85, mt: 1 }}>
                Debug: {debugInfo}
              </Typography>
            </CardContent>
          </Card>
        ) : !started ? (
          <Card sx={{ background: "transparent", border: `1px solid ${TEXT_COLOR}` }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: TEXT_COLOR }}>
                3 True 1 Wrong
              </Typography>
              <Typography mt={1} sx={{ color: TEXT_COLOR }}>
                Gerçeklerle yalanlar iç içe.<br />
                Her ekip üyesi hakkında <b>3 doğru</b> ve <b>1 yanlış</b> bilgi göreceksin.<br />
                Görevin: <b>yanlış olanı bulmak</b> <br />
                Doğru hamle = <b>+10 puan</b> 💥
              </Typography>

              <Stack direction="row" spacing={2} mt={3}>
                <Button variant="contained" onClick={() => setStarted(true)} disabled={!canStart}>
                  Başla
                </Button>
              </Stack>

              {!canStart && (
                <Typography mt={2} sx={{ color: TEXT_COLOR, opacity: 0.85 }}>
                  Oyun başlayamadı: Firestore’dan oyuncu verisi gelmedi.
                </Typography>
              )}
            </CardContent>
          </Card>
        ) : isFinished ? (
          <Card sx={{ background: "transparent", border: `1px solid ${TEXT_COLOR}` }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: TEXT_COLOR }}>
                Oyun Bitti 🎉
              </Typography>
              <Typography mt={1} variant="h6" sx={{ color: TEXT_COLOR }}>
                Toplam Puan: {score}
              </Typography>

              <Divider sx={{ my: 2, borderColor: TEXT_COLOR, opacity: 0.3 }} />

              {(() => {
                let msg = "Ekibini biraz daha tanımaya ne dersin?";
                if (score >= 80) msg = "Ekibini çok iyi tanıyorsun! 🔥";
                else if (score >= 50) msg = "Fena değil! Ekibini oldukça tanıyorsun. 👏";
                else if (score >= 20) msg = "İyi bir başlangıç! Biraz daha sohbet zamanı 🙂";

                return (
                  <Stack spacing={1.5}>
                    <Typography variant="h6" sx={{ color: TEXT_COLOR }}>
                      {msg}
                    </Typography>

                    <Typography sx={{ color: TEXT_COLOR, opacity: 0.95 }}>
                      Bu linkten takım arkadaşlarının müzik zevklerine de ulaşabilirsin{" "}
                      <a
                        href="https://open.spotify.com/playlist/2M1JtdzNCKcQVhh8Yg7C5l?si=73xhm7lvRJWA3_FLCY0ZQA&pi=3ii14BltSeids"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: TEXT_COLOR,
                          textDecoration: "underline",
                        }}
                      >
                        Spotify listesini dinle
                      </a>
                    </Typography>
                  </Stack>
                );
              })()}

              <Stack direction="row" spacing={2} mt={3}>
                <Button variant="contained" onClick={resetGame}>
                  Yeniden Başlat
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ background: "transparent", border: `1px solid ${TEXT_COLOR}` }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography sx={{ color: TEXT_COLOR }}>
                  İlerleme: {personIndex + 1}/{totalPeople}
                </Typography>
                <LinearProgress variant="determinate" value={progress} />
              </Stack>

              <Divider sx={{ my: 2, borderColor: TEXT_COLOR, opacity: 0.3 }} />

              <Typography variant="h5" sx={{ color: TEXT_COLOR }}>
                {person?.name}
              </Typography>
              <Typography mt={0.5} sx={{ color: TEXT_COLOR }}>
                Skor: <b>{score}</b>
              </Typography>

              <Typography mt={2} sx={{ color: TEXT_COLOR }}>
                Yanlış olan bilgiyi seç:
              </Typography>

              <Stack mt={2} spacing={1}>
                {options.map((opt, i) => {
                  const reveal = pickedText !== null;
                  const chosen = pickedText === opt.text;

                  const suffix =
                    reveal && chosen ? (opt.isTrue === false ? " ✅" : " ❌") : "";

                  return (
                    <Button
                      key={i}
                      variant="outlined"
                      onClick={() => handlePick(opt)}
                      disabled={reveal}
                      sx={{
                        justifyContent: "flex-start",
                        color: TEXT_COLOR,
                        borderColor: TEXT_COLOR,
                        textTransform: "none",
                      }}
                    >
                      {opt.text}
                      {suffix}
                    </Button>
                  );
                })}
              </Stack>

              <Stack direction="row" spacing={2} mt={3}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!pickedText || results.length !== personIndex + 1}
                >
                  Next
                </Button>
                <Button variant="text" onClick={resetGame} sx={{ color: TEXT_COLOR }}>
                  Sıfırla
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Box>
    </Widget>
  );
};

export default Widget3true1wrong;
