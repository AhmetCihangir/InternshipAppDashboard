import { Typography } from "@mui/material";
import { Widget } from "../utils/components";
import { useState, useRef, useEffect } from "react";

import { useAuth } from "../utils/AuthContext";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { BG_COLOR, TEXT_COLOR } from "../utils/constants";
import { useStateContext } from "../utils/StateContext";

const WidgetAutoMailing = () => {
    return (
        <Widget title="Auto Mailing" index={1}>
            <Mailbox />
        </Widget>
    );
};

const sendMail = async (to, subject, body, user) => {


    await addDoc(collection(db, "mail"), {
        to: to,

        from: user.getEmails()[0],

        replyTo: user.getEmails()[0],

        message: {
            subject: subject,
            text: body,
            html: `<div>${body}</div>`,
        },

        headers: {
            "From": `${user.getName()} <internshipappdashboard.firebaseapp.com>`
        }

    });

}




function Mailbox() {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const editorRef = useRef(null);

    const [font, setFont] = useState("Arial");
    const [fontSize, setFontSize] = useState("14px");
    const [color, setColor] = useState("#e0e7ff");
    const [showInternList, setShowInternList] = useState(false);

    const { user } = useAuth();
    const { internList } = useStateContext();

    const selectIntern = (internEmail) => {
        setTo(internEmail);
        setShowInternList(false);
    };



    const formatText = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handleSend = async () => {
        const body = editorRef.current.innerHTML;
        if (!to || !subject || !body) return;

        alert("Message sent!");

        await sendMail(to, subject, body, user);

        setTo("");
        setSubject("");
        editorRef.current.innerHTML = "";
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "80%",
                gap: "20px",
                padding: "40px",
                background:
                    "linear-gradient(180deg, #050b3c 0%, #020726 100%)",
                color: "#e0e7ff",
                fontFamily: "Inter, Arial, sans-serif",
            }}
        >

            <div
                style={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "16px",
                    padding: "20px",
                    maxWidth: "800px",
                    margin: "0 auto",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                }}
            >
                {/* Inputs */}
                {/* <input
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
                /> */}


                {/* TO (Kime) - INTERN BUTONLU */}
                <div style={{ marginBottom: "15px", position: "relative" }}>
                    <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        marginBottom: "8px" 
                    }}>
                        <label style={{ fontWeight: 500 }}>
                            To:
                        </label>
                        <button
                            onClick={() => setShowInternList(!showInternList)}
                            style={{
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "none",
                                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                                color: "white",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: "5px"
                            }}
                        >
                            <span>👥</span>
                            Select Intern
                        </button>
                    </div>
                    
                    <input
                        placeholder="recipient@example.com"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        style={inputStyle}
                    />

                    {/* INTERN DROPDOWN LIST */}
                    {showInternList && (
                        <div style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            background: "rgba(10, 20, 60, 0.95)",
                            backdropFilter: "blur(10px)",
                            borderRadius: "8px",
                            padding: "10px",
                            marginTop: "5px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                            zIndex: 100,
                            maxHeight: "200px",
                            overflowY: "auto",
                            border: "1px solid rgba(59,130,246,0.3)"
                        }}>
                            <div style={{ 
                                display: "flex", 
                                justifyContent: "space-between",
                                marginBottom: "8px",
                                paddingBottom: "5px",
                                borderBottom: "1px solid rgba(255,255,255,0.1)"
                            }}>
                                <strong style={{ fontSize: "12px" }}>Interns ({internList.length})</strong>
                                <button
                                    onClick={() => setShowInternList(false)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#93c5fd",
                                        cursor: "pointer",
                                        fontSize: "12px"
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                            
                            {internList.map(intern => (
                                <div
                                    key={intern.getUserID()}
                                    onClick={() => selectIntern(intern.getEmails()[0])}
                                    style={{
                                        padding: "8px 10px",
                                        marginBottom: "5px",
                                        borderRadius: "5px",
                                        background: "rgba(255,255,255,0.05)",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        border: to === intern.getEmails()[0] 
                                            ? "1px solid #3b82f6" 
                                            : "1px solid transparent"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(59,130,246,0.2)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                    }}
                                >
                                    <div style={{
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        fontSize: "12px"
                                    }}>
                                        {intern.getName().charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 500, fontSize: "13px" }}>
                                            {intern.getName()}
                                        </div>
                                        <div style={{ 
                                            fontSize: "11px", 
                                            color: "#93c5fd",
                                            marginTop: "2px"
                                        }}>
                                            {intern.getEmails()[0]}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                {/* SUBJECT (Konu) */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                        Subject:
                    </label>
                    <input
                        placeholder="Email subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        style={inputStyle}
                    />
                </div>




                {/* TOOLBAR */}
                <div
                    style={{
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                        marginBottom: "10px",
                        alignItems: "center",
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
                        style={{
                            backgroundColor: "#022c22"
                        }}
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

                    <Typography sx={{
                        textAlign: "center",
                    }}>
                        | Align:
                    </Typography>

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

            <Mails />

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
    boxSizing: "border-box",
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

const getAllEmails = async (email) => {
    const emails = [];

    const ref = collection(db, "mail");
    console.log(email)
    const q = query(ref, where("to", "==", email));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        emails.push(data);
    });

    return emails;

}

const Mails = () => {
    const { user } = useAuth();

    const [emails, setEmails] = useState([]);


    useEffect(() => {
        const fetchMails = async () => {
            const fetchedEmails = await getAllEmails(user.getEmails()[0]);

            console.log("Fetched Emails: ", fetchedEmails);

            setEmails(fetchedEmails);
        };

        fetchMails();
    }, []);

    return (
        <div style={{
            padding: "20px",
            maxHeight: "300px",
            overflowY: "auto",
            // backgroundColor : BG_COLOR
        }}>

            {
                emails.map((mail, index) => (
                    <div key={index} style={{
                        borderBottom: "1px solid #444",
                        paddingBottom: "10px",
                        marginBottom: "10px",
                    }}>
                        <Typography variant="subtitle2" sx={{ color : TEXT_COLOR }}>From: {mail.from}</Typography>
                        <Typography variant="subtitle2" sx={{ color : TEXT_COLOR }}>To: {mail.to}</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color : TEXT_COLOR }}>{mail.message.subject}</Typography>
                        <Typography variant="body2" sx={{ color : TEXT_COLOR }} dangerouslySetInnerHTML={{ __html: mail.message.html }} />
                    </div>
                ))
            }
        </div>
    )

}


export default WidgetAutoMailing;