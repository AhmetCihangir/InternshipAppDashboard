import { Widget } from "../utils/components";
import { useState, useRef } from "react";

const WidgetAutoMailing = () => {
    return (
        <Widget title="Auto Mailing" index={1}>
            <Mailbox />
        </Widget>
    );
};



function Mailbox() {
  const [showForm, setShowForm] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const editorRef = useRef(null);

  const [font, setFont] = useState("Arial");
  const [fontSize, setFontSize] = useState("14px");
  const [color, setColor] = useState("#e0e7ff");

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleSend = () => {
    const body = editorRef.current.innerHTML;
    if (!to || !subject || !body) return;

    alert("Message sent!");
    setTo("");
    setSubject("");
    editorRef.current.innerHTML = "";
    setShowForm(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "linear-gradient(180deg, #050b3c 0%, #020726 100%)",
        color: "#e0e7ff",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {/* BAŞLIK + BUTON ORTADA */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginBottom: "12px", fontWeight: 600 }}>
          Auto Mailing
        </h2>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            background:
              "linear-gradient(135deg, #3b82f6, #2563eb)",
            border: "none",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(59,130,246,0.3)",
          }}
        >
          + Compose Mail
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "20px",
            maxWidth: "700px",
            margin: "0 auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* Inputs */}
          <input
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={inputStyle}
          />

          {/* TOOLBAR GERİ GELDİ */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            <select
              value={font}
              onChange={(e) => {
                setFont(e.target.value);
                formatText("fontName", e.target.value);
              }}
              style={toolbarSelect}
            >
              <option>Arial</option>
              <option>Verdana</option>
              <option>Tahoma</option>
              <option>Courier New</option>
            </select>

            <select
              value={fontSize}
              onChange={(e) => {
                setFontSize(e.target.value);
                formatText(
                  "fontSize",
                  e.target.value.replace("px", "")
                );
              }}
              style={toolbarSelect}
            >
              <option value="12px">12</option>
              <option value="14px">14</option>
              <option value="16px">16</option>
              <option value="18px">18</option>
            </select>

            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                formatText("foreColor", e.target.value);
              }}
            />

            <ToolbarButton onClick={() => formatText("bold")}>
              B
            </ToolbarButton>
            <ToolbarButton onClick={() => formatText("italic")}>
              I
            </ToolbarButton>
            <ToolbarButton onClick={() => formatText("underline")}>
              U
            </ToolbarButton>
            <ToolbarButton onClick={() => formatText("justifyLeft")}>
              L
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatText("justifyCenter")}
            >
              C
            </ToolbarButton>
            <ToolbarButton onClick={() => formatText("justifyRight")}>
              R
            </ToolbarButton>
          </div>

          {/* EDITOR */}
          <div
            ref={editorRef}
            contentEditable
            style={{
              minHeight: "150px",
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(0,0,0,0.4)",
              color,
              fontFamily: font,
              fontSize,
              outline: "none",
              marginBottom: "15px",
            }}
          />

          {/* ACTIONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              onClick={handleSend}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#22c55e",
                color: "#022c22",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Send
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "1px solid #ef4444",
                background: "transparent",
                color: "#ef4444",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: "10px",
  borderRadius: "10px",
  border: "none",
  background: "rgba(0,0,0,0.4)",
  color: "#e0e7ff",
  outline: "none",
};

const toolbarSelect = {
  background: "rgba(0,0,0,0.4)",
  color: "#e0e7ff",
  border: "none",
  borderRadius: "8px",
  padding: "6px",
};

const ToolbarButton = ({ children, ...props }) => (
  <button
    {...props}
    style={{
      background: "rgba(59,130,246,0.2)",
      color: "#93c5fd",
      border: "none",
      borderRadius: "8px",
      padding: "6px 10px",
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);


export default WidgetAutoMailing;