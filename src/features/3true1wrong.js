import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import { Widget } from "../utils/components";
import { TEXT_COLOR } from "../utils/constants";


const PLAYERS = [
  {
    id: "u1",
    name: "Can",
    facts: [
      { text: "Skyrim'de 1350+ saatim var", isTrue: true },
      { text: "Geçen yaz bir yatırım bankasında staj yaparken yanlışlıkla bütün veritabanını sildim ", isTrue: false }, // veritabanı silme olayı yanlış
      { text: "Hür irademle hiç smart_pointer kullanmadım", isTrue: true },
      { text: "Veri bazlı çözüm süreçlerine ilgim var", isTrue: true },
    ],
  },
  {
    id: "u2",
    name: "Ceylin",
    facts: [
      { text: "Tek çocuğum", isTrue: true },
      { text: "9 yıl bale yaptım", isTrue: true },
      { text: "2 kere kolumu kırdım", isTrue: false },
      { text: "Bisiklete binmeyi bilmiyorum", isTrue: true },
    ],
  },
  {
    id: "u3",
    name: "Eray",
    facts: [
      { text: "Günlük Asya yemekleriyle besleniyorum", isTrue: true },
      { text: "Osman adında ekşi mayam var", isTrue: true },
      { text: "Ejderha sesi çıkarabiliyorum", isTrue: true },
      { text: "Tek bacağımla koşabiliyorum", isTrue: false },
    ],
  },
  {
    id: "u4",
    name: "Ece",
    facts: [
      { text: "Vegan ve sağlıklı besleniyorum", isTrue: true },
      { text: "Diziye başladım mı sezon finalini görmeden kalkmam", isTrue: true },
      { text: "Kedi değil, köpek insanıyım", isTrue: true },
      { text: "Sabah insanıyım, güneş doğmadan spora giderim", isTrue: false },
    ],
  },
  {
    id: "u5",
    name: "Tutku",
    facts: [
      { text: "Geceleri daha verimli çalışırım", isTrue: false },
      { text: "Kahveyi şekersiz içerim", isTrue: true },
      { text: "Bir şarkıyı yüzlerce kez dinleyebilirim", isTrue: true },
      { text: "Köpekleri kedilerden daha çok severim", isTrue: true },
    ],
  },
  {
    id: "u6",
    name: "Cihangir",
    facts: [
      { text: "Korece biliyorum", isTrue: true },
      { text: "İki kuşum ve bir kedim var", isTrue: true },
      { text: "Bilgisayar okuyorum", isTrue: true },
      { text: "19 yaşındayım", isTrue: false },
    ],
  },
  {
    id: "u7",
    name: "Burak",
    facts: [
      { text: "Gitar çalıyorum", isTrue: true },
      { text: "Microsoft hesabım çalındı", isTrue: true },
      { text: "Elektronik mühendisliği okuyacağım", isTrue: true },
      { text: "Brawlhallada rankim Diamond", isTrue: false },
    ],
  },
  {
    id: "u8",
    name: "Vedat",
    facts: [
      { text: "En sevdiğim renk mavi", isTrue: true },
      { text: "Bir tane abim var", isTrue: true },
      { text: "Futbol oynamayı severim", isTrue: true },
      { text: "Müzik dinlemem", isTrue: false },
    ],
  },
  {
    id: "u9",
    name: "Zeynep",
    facts: [
      { text: "Hiç kemiğim kırılmadı", isTrue: true },
      { text: "3 kardeşin en küçüğüyüm", isTrue: true },
      { text: "Zeytinden nefret ederim", isTrue: true },
      { text: "Hayatım boyunca aynı evde yaşadım", isTrue: false },
    ],
  },
  {
    id: "u10",
    name: "Fatmanur",
    facts: [
      { text: "Bir dönem vejetaryendim", isTrue: true },
      { text: "Odamda VR gözlük var", isTrue: true },
      { text: "Dün bilgisayarımı Kadıköy'de unuttum", isTrue: true },
      { text: "Hiç renkli kıyafetim yok", isTrue: false },
    ],
  },
];


const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const Widget3true1wrong = () => {
  const [started, setStarted] = useState(false);
  const [personIndex, setPersonIndex] = useState(0);
  const [score, setScore] = useState(0);


  const [pickedText, setPickedText] = useState(null);

  const [results, setResults] = useState([]); 

  
  const [showFinal, setShowFinal] = useState(false);

  const person = PLAYERS[personIndex];
  const totalPeople = PLAYERS.length;

  const options = useMemo(() => {
    if (!person) return [];
    return shuffle(person.facts);
  }, [personIndex, person]);

  const progress =
    totalPeople === 0 ? 0 : Math.round((personIndex / totalPeople) * 100);

  const handlePick = (opt) => {
    if (pickedText) return; 
    setPickedText(opt.text);

    const isCorrect = opt.isTrue === false; 
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

  return (
    <Widget title="3 True 1 Wrong Quiz" index={0}>
      <Box>
        {!started ? (
          <Card sx={{ background: "transparent", border: `1px solid ${TEXT_COLOR}` }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: TEXT_COLOR }}>
                3 True 1 Wrong
              </Typography>
              <Typography mt={1} sx={{ color: TEXT_COLOR }}>
                Gerçeklerle yalanlar iç içe.<br />
                Her ekip üyesi hakkında <b>3 doğru</b> ve <b>1 yanlış</b> bilgi göreceksin.<br />
                Görevin: <b>yanlış olanı bulmak</b> 
                Doğru hamle = <b>+10 puan</b> 💥
              </Typography>

              <Stack direction="row" spacing={2} mt={3}>
                <Button variant="contained" onClick={() => setStarted(true)}>
                  Başla
                </Button>
              </Stack>
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
                        Bu linkten takım arkadaşlarının müzik zevklerine de ulaşabilirsin {" "}
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