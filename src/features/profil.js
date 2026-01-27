import React, { useState } from "react";
import { Widget } from "../utils/components";
import { TEXT_COLOR } from "../utils/constants";

const linkStyle = { color: TEXT_COLOR, textDecoration: "underline" };


const CLUB_IG = {
  
  koSu: "https://www.instagram.com/kosusabanci?igsh=MTA0dDI1MjlhNnhqMA==",
  
  
  Tiyatro: "https://www.instagram.com/suoyunculari?igsh=bWdpdTF4NW1uZWdm",
  
  
  
  SUmoda: "https://www.instagram.com/sumoda.club?igsh=MTM5azc1OGN5Z3JtcQ==",

  KAVEK: "https://www.instagram.com/kaveksabanci?igsh=MWdwdGl3anZjanZoaA==",

  
  IES: "https://www.instagram.com/iessabanci?igsh=Z2N6ZjA4a3dxbW83",

  
  GGK: "https://www.instagram.com/sabanciggk?igsh=MWtzNmg4Nmo0OGp0MA==",

  
  SUFirst: "https://www.instagram.com/sufirst?igsh=NW9hYjhocXMweDdl",
  

  
  Müzikus: "https://www.instagram.com/muzikussabanci?igsh=MWcxMmViM20wb3EwNg==",

  
  suDosk: "https://www.instagram.com/sudosk?igsh=MXRxMDZvbTE2MnI0Zw==",
  
  
  UNIBJK: "https://www.instagram.com/unibjkcom?igsh=MWRqc2U1aHpydGJidw==",

  
  
  Offtown: "https://www.instagram.com/offtownfestival?igsh=a25haDhocXZldWxs",
};


function ensureHttp(url) {
  if (!url) return "";
  var u = String(url).trim();
  if (u === "") return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return "https://" + u;
}

function safeText(v) {
  if (v === null || v === undefined) return "—";
  var t = String(v).trim();
  if (t === "") return "—";
  return t;
}

function renderClubs(clubs) {
  if (!clubs) return "—";

  var list = [];
  if (Array.isArray(clubs)) {
    list = clubs;
  } else {
    list = String(clubs)
      .split(",")
      .map(function (c) {
        return String(c).trim();
      })
      .filter(function (c) {
        return c !== "";
      });
  }

  if (!list || list.length === 0) return "—";

  return list.map(function (club, idx) {
    var href = CLUB_IG[club];

    return (
      <React.Fragment key={club + "_" + idx}>
        {idx > 0 ? ", " : ""}
        {href ? (
          <a
            href={ensureHttp(href)}
            target="_blank"
            rel="noreferrer"
            style={linkStyle}
          >
            {club}
          </a>
        ) : (
          <span>{club}</span>
        )}
      </React.Fragment>
    );
  });
}

const WidgetProfil = () => {
  const users = [
    {
      id: "u1",
      name: "Ece Lüle",
      departmentClass: "Bilgisayar Bilimi ve Mühendisliği, 2. Sınıf",
      highSchool: "Malatya Fen Lisesi",
      location: "Tuzla/ İstanbul",
      phone: "+90 552 525 37 77",
      emailSchool: "ece.lule@sabanciuniv.edu",
      emailCompany: "ece.lule@entrophi.co",
      linkedin: "www.linkedin.com/in/ece-lüle",
      github: "https://github.com/ecelule",
      clubs: "koSu"
    },
    {
      id: "u2",
      name: "Tutku Sıla Baş",
      departmentClass: "Veri Bilimi ve Analitiği / Endüstri Mühendisliği, 2. Sınıf",
      highSchool: "Beşiktaş Atatürk Anadolu Lisesi",
      location: "Bayrampaşa/ İstanbul",
      phone: "+90 543 878 48 36",
      emailSchool: "tutku.bas@sabanciuniv.edu",
      emailCompany: "tutku.bas@entrophi.co",
      linkedin: "http://linkedin.com/in/tutku-sıla-baş-307468362",
      github: "https://github.com/tutkusilabas",
      clubs: "Tiyatro"
    },
    {
      id: "u3",
      name: "Eray Bahar",
      departmentClass: "Bilgisayar Bilimi ve Mühendisliği, 2. Sınıf",
      highSchool: "Eyüboğlu Fen Lisesi",
      location: "Kurtköy/ İstanbul",
      phone: "+90 546 560 7706",
      emailSchool: "eray.bahar@sabanciuniv.edu",
      emailCompany: "eray.bahar@entrophi.co",
      linkedin: "https://www.linkedin.com/in/eraybahar/",
      github: "https://github.com/ErayBahar",
      clubs: "SUmoda"
    },
    {
      id: "u4",
      name: "Ayça Ceylin Oktay",
      departmentClass: "Bilgisayar Bilimi ve Mühendisliği, 2. Sınıf",
      highSchool: "Saint Michel Fransız Lisesi",
      location: "Beşiktaş/ İstanbul",
      phone: "+90 543 647 90 67",
      emailSchool: "ceylin.oktay@sabanciuniv.edu",
      emailCompany: "ceylin.oktay@entrophi.co",
      linkedin: "www.linkedin.com/in/ayça-ceylin-oktay-bb804032a",
      github: "https://github.com/ceylinoktay-prog",
      clubs: "KAVEK"
    },
    {
      id: "u5",
      name: "Ahmet Cihangir Gündoğdu",
      departmentClass: "Bilgisayar Bilimi ve Mühendisliği, 1. Sınıf",
      highSchool: "Hüseyin Avni Sözen Anadolu Lisesi",
      location: "—",
      phone: "+90 507 270 58 19",
      emailSchool: "cihangir.gundogdu@sabanciuniv.edu",
      emailCompany: "cihangir.gundogdu@entrophi.co",
      linkedin:
        "https://www.linkedin.com/in/ahmet-cihangir-g%C3%BCndo%C4%9Fdu?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      github: "https://github.com/AhmetCihangir",
      clubs: "IES, GGK, SUFirst, SuO"
    },
    {
      id: "u6",
      name: "Burak Bekdaş",
      departmentClass: "Elektronik Mühendisliği, 1. Sınıf",
      highSchool: "Haydarpaşa Lisesi",
      location: "Ataşehir/ İstanbul",
      phone: "+90 542 241 09 01",
      emailSchool: "burak.bekdas@sabanciuniv.edu",
      emailCompany: "burak.bekdas@entrophi.co",
      linkedin: "https://www.linkedin.com/in/burak-bekdas/",
      github: "https://github.com/Leshiro",
      clubs: "Müzikus, suDosk"
    },
    {
      id: "u7",
      name: "Vedat Yasin Bayrakçıoğlu",
      departmentClass: "Endüstri Mühendisliği, 1. Sınıf",
      highSchool: "Yaşam Tasarım Fen Lisesi",
      location: "Alanya/ Antalya",
      phone: "+90 554 111 47 60",
      emailSchool: "vedat.bayrakcioglu@sabanciuniv.edu",
      emailCompany: "vedat.bayrakcioglu@entrophi.co",
      linkedin: "www.linkedin.com/in/vedat-yasin-bayrakçıoğlu-student-668888333/",
      github: "https://github.com/vyb35",
      clubs: ""
    },
    {
      id: "u8",
      name: "Can Sever",
      departmentClass: "Bilgisayar Bilimi ve Mühendisliği, 3. Sınıf",
      highSchool: "Nilüfer Borsa İstanbul Fen Lisesi",
      location: "Nilüfer/Bursa",
      phone: "+90 552 232 2395",
      emailSchool: "can.sever@sabanciuniv.edu",
      emailCompany: "can.sever@entrophi.co",
      linkedin: "https://linkedin.com/in/canreves",
      github: "https://github.com/canreves",
      clubs: "UNIBJK"
    },
    {
      id: "u9",
      name: "Fatmanur Bakar",
      departmentClass:
        "Bilgisayar Bilimi ve Mühendisliği / Görsel Sanatlar ve Görsel İletişim Tasarımı , 3. Sınıf",
      highSchool: "Övgü Terzibaşıoğlu Anadolu lisesi",
      location: "Tuzla/ İstanbul",
      phone: "+90 553 080 16 46",
      emailSchool: "fatmanur.bakar@sabanciuniv.edu",
      emailCompany: "fatmanur.bakar@entrophi.co",
      linkedin: "https://www.linkedin.com/in/fatmanur-bakar-aba8742a1/",
      github: "https://github.com/fatmanvr",
      clubs: "IES, Offtown"
    },
    {
      id: "u10",
      name: "Zeynep Taygar",
      departmentClass: "Veri Bilimi ve Analitiği, 3. Sınıf",
      highSchool: "Ahmet Keleşoğlu Anadolu Lisesi",
      location: "Ümraniye/ İstanbul",
      phone: "+90 546 883 85 24",
      emailSchool: "zeynep.taygar@sabanciuniv.edu",
      emailCompany: "zeynep.taygar@entrophi.co",
      linkedin: "https://www.linkedin.com/in/zeynep-taygar-9ba7a4352",
      github: "https://github.com/zeynep-ty",
      clubs: ""
    }
  ];

  const [selectedUserId, setSelectedUserId] = useState(users[0].id);
  var selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <Widget title="Profil" index={3}>
      <div style={{ display: "flex", gap: "16px", height: "100%" }}>

        {/* SOL */}
        <div
          style={{
            width: "40%",
            borderRight: "1px solid #2a2a2a",
            paddingRight: "12px",
            overflowY: "auto",
            maxHeight: "320px"
          }}
        >
          <div style={{ fontWeight: "600", marginBottom: "10px", color: TEXT_COLOR }}>
            Stajyerler
          </div>

          {users.map(function (u) {
            var isActive = u.id === selectedUserId;
            return (
              <div
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                style={{
                  padding: "10px",
                  marginBottom: "8px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border: isActive ? "1px solid #6b6b6b" : "1px solid transparent",
                  background: isActive ? "rgba(255,255,255,0.06)" : "transparent"
                }}
              >
                <div style={{ fontWeight: "600", color: TEXT_COLOR }}>{u.name}</div>
                <div style={{ fontSize: "12px", opacity: 0.85, color: TEXT_COLOR }}>
                  {u.departmentClass}
                </div>
              </div>
            );
          })}
        </div>

        {/* SAĞ */}
        <div style={{ width: "60%", paddingLeft: "4px", color: TEXT_COLOR }}>
          {!selectedUser ? (
            <div>Bir stajyer seç</div>
          ) : (
            <div>
              <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>
                👤 {selectedUser.name}
              </div>

              <div style={{ lineHeight: "1.8" }}>
                <div>🎓 <b>Bölüm / Sınıf:</b> {safeText(selectedUser.departmentClass)}</div>
                <div>🏫 <b>Lise:</b> {safeText(selectedUser.highSchool)}</div>
                <div>📍 <b>İlçe/Şehir:</b> {safeText(selectedUser.location)}</div>

                <div>📞 <b>Tel:</b>{" "}
                  {selectedUser.phone ? (
                    <a
                      href={`https://wa.me/${String(selectedUser.phone).replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      style={linkStyle}
                    >
                      {safeText(selectedUser.phone)}
                    </a>
                  ) : "—"}
                </div>

                <div style={{ marginTop: "10px" }}>
                  📧 <b>Okul Mail:</b>{" "}
                  {selectedUser.emailSchool ? (
                    <a href={`mailto:${selectedUser.emailSchool}`} style={linkStyle}>
                      {safeText(selectedUser.emailSchool)}
                    </a>
                  ) : "—"}
                </div>

                <div>
                  📧 <b>Şirket Mail:</b>{" "}
                  {selectedUser.emailCompany ? (
                    <a href={`mailto:${selectedUser.emailCompany}`} style={linkStyle}>
                      {safeText(selectedUser.emailCompany)}
                    </a>
                  ) : "—"}
                </div>

                <div style={{ marginTop: "10px" }}>
                  🔗 <b>LinkedIn:</b>{" "}
                  {selectedUser.linkedin ? (
                    <a href={ensureHttp(selectedUser.linkedin)} style={linkStyle} target="_blank" rel="noreferrer">
                      Aç
                    </a>
                  ) : "—"}
                </div>

                <div>
                  💻 <b>GitHub:</b>{" "}
                  {selectedUser.github ? (
                    <a href={ensureHttp(selectedUser.github)} style={linkStyle} target="_blank" rel="noreferrer">
                      Aç
                    </a>
                  ) : "—"}
                </div>

                <div style={{ marginTop: "10px" }}>
                  🎭 <b>Kulüpler:</b> {renderClubs(selectedUser.clubs)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Widget>
  );
};

export default WidgetProfil;