// Firebase Seed Button Component
import React, { useState } from 'react';
import { seedAll } from '../utils/seedFirebase';

const SeedButton = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSeed = async () => {
        if (!window.confirm('Firebase\'e 10 stajyer ve 200 task eklenecek. Devam?')) {
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await seedAll();
            setResult(`✅ Başarılı! ${data.interns} stajyer, ${data.tasks} task eklendi.`);
        } catch (err) {
            setError(`❌ Hata: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <button
                onClick={handleSeed}
                disabled={loading}
                style={{
                    padding: '15px 30px',
                    fontSize: '16px',
                    backgroundColor: loading ? '#666' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'wait' : 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
            >
                {loading ? '⏳ Yükleniyor...' : '🌱 Firebase\'e Veri Ekle'}
            </button>

            {result && (
                <div style={{ marginTop: '15px', color: '#4CAF50', fontSize: '18px' }}>
                    {result}
                </div>
            )}

            {error && (
                <div style={{ marginTop: '15px', color: '#f44336', fontSize: '16px' }}>
                    {error}
                </div>
            )}

            <div style={{ marginTop: '20px', color: '#aaa', fontSize: '14px' }}>
                10 Stajyer: Eray, Can, Cihangir, Fatmanur, Vedat, Burak, Zeynep, Ece, Ceylin, Tutku<br />
                200 Task: 5 günlük staj simülasyonu
            </div>
        </div>
    );
};

export default SeedButton;
