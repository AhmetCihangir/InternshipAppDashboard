// Firebase Seed Script - Populates Firestore with 10 interns and 200 tasks
import { db } from "../firebase";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";

// 10 Interns data
const INTERNS = [
    { id: "intern_eray", name: "Eray", role: "CS", department: "Engineering" },
    { id: "intern_can", name: "Can", role: "CS", department: "Engineering" },
    { id: "intern_cihangir", name: "Cihangir", role: "CS", department: "Engineering" },
    { id: "intern_fatmanur", name: "Fatmanur", role: "CS", department: "Engineering" },
    { id: "intern_vedat", name: "Vedat", role: "DSA", department: "Data Science" },
    { id: "intern_burak", name: "Burak", role: "CS", department: "Engineering" },
    { id: "intern_zeynep", name: "Zeynep", role: "DSA", department: "Data Science" },
    { id: "intern_ece", name: "Ece", role: "CS", department: "Engineering" },
    { id: "intern_ceylin", name: "Ceylin", role: "CS", department: "Engineering" },
    { id: "intern_tutku", name: "Tutku", role: "DSA", department: "Data Science" },
];

// Day to date mapping
const dayToDate = {
    "Pazartesi": "2026-01-27",
    "Salı": "2026-01-28",
    "Çarşamba": "2026-01-29",
    "Perşembe": "2026-01-30",
    "Cuma": "2026-01-31"
};

// Full 200 tasks dataset
const ALL_TASKS = [
    { id: 1, name: "Eray", day: "Pazartesi", task: "Git repo fork ve clone işlemi", point: 1, status: "Completed" },
    { id: 2, name: "Eray", day: "Pazartesi", task: "VS Code eklentilerinin kurulumu", point: 1, status: "Completed" },
    { id: 3, name: "Eray", day: "Pazartesi", task: "Proje dizin yapısının incelenmesi", point: 2, status: "Completed" },
    { id: 4, name: "Eray", day: "Pazartesi", task: "Virtual Environment oluşturma", point: 1, status: "Completed" },
    { id: 5, name: "Can", day: "Pazartesi", task: "Node.js ve NPM kurulum kontrolü", point: 1, status: "Completed" },
    { id: 6, name: "Can", day: "Pazartesi", task: "React projesinin init edilmesi", point: 3, status: "Completed" },
    { id: 7, name: "Can", day: "Pazartesi", task: "Package.json incelenmesi", point: 2, status: "Completed" },
    { id: 8, name: "Can", day: "Pazartesi", task: "İlk commit'in atılması", point: 1, status: "Completed" },
    { id: 9, name: "Cihangir", day: "Pazartesi", task: "Flask iskelet yapısının kurulması", point: 3, status: "Completed" },
    { id: 10, name: "Cihangir", day: "Pazartesi", task: "Postman/Insomnia kurulumu", point: 1, status: "Completed" },
    { id: 11, name: "Cihangir", day: "Pazartesi", task: "Flask-Cors eklenmesi", point: 2, status: "Completed" },
    { id: 12, name: "Cihangir", day: "Pazartesi", task: "Debug modunun aktif edilmesi", point: 1, status: "Completed" },
    { id: 13, name: "Fatmanur", day: "Pazartesi", task: "GitHub Projects board oluşturulması", point: 2, status: "Completed" },
    { id: 14, name: "Fatmanur", day: "Pazartesi", task: "Readme.md ilk taslağı", point: 2, status: "Completed" },
    { id: 15, name: "Fatmanur", day: "Pazartesi", task: "İletişim kanallarının testi", point: 1, status: "Completed" },
    { id: 16, name: "Fatmanur", day: "Pazartesi", task: ".gitignore düzenlenmesi", point: 1, status: "Completed" },
    { id: 17, name: "Vedat", day: "Pazartesi", task: "Jupyter Notebook kurulumu", point: 2, status: "Completed" },
    { id: 18, name: "Vedat", day: "Pazartesi", task: "CSV veri setinin indirilmesi", point: 1, status: "Completed" },
    { id: 19, name: "Vedat", day: "Pazartesi", task: "Pandas import edilmesi", point: 1, status: "Completed" },
    { id: 20, name: "Vedat", day: "Pazartesi", task: "Veri setinin head incelenmesi", point: 2, status: "Completed" },
    { id: 21, name: "Burak", day: "Pazartesi", task: "Docker Desktop kurulumu", point: 2, status: "Completed" },
    { id: 22, name: "Burak", day: "Pazartesi", task: "PostgreSQL image pull", point: 2, status: "Completed" },
    { id: 23, name: "Burak", day: "Pazartesi", task: "DB bağlantı string oluşturma", point: 3, status: "Completed" },
    { id: 24, name: "Burak", day: "Pazartesi", task: "PgAdmin erişim testi", point: 2, status: "In Progress" },
    { id: 25, name: "Zeynep", day: "Pazartesi", task: "Değişken tiplerinin analizi", point: 2, status: "Completed" },
    { id: 26, name: "Zeynep", day: "Pazartesi", task: "Eksik veri kontrolü", point: 3, status: "Completed" },
    { id: 27, name: "Zeynep", day: "Pazartesi", task: "Duplicate satırların temizlenmesi", point: 2, status: "Completed" },
    { id: 28, name: "Zeynep", day: "Pazartesi", task: "Temel istatistiklerin çıkarılması", point: 2, status: "Completed" },
    { id: 29, name: "Ece", day: "Pazartesi", task: "Figma tasarımının incelenmesi", point: 2, status: "Completed" },
    { id: 30, name: "Ece", day: "Pazartesi", task: "Global CSS değişkenleri tanımlama", point: 3, status: "Completed" },
    { id: 31, name: "Ece", day: "Pazartesi", task: "Font ailesinin import edilmesi", point: 1, status: "Completed" },
    { id: 32, name: "Ece", day: "Pazartesi", task: "Favicon ve başlık düzenlemesi", point: 1, status: "Completed" },
    { id: 33, name: "Ceylin", day: "Pazartesi", task: "React Router Dom kurulumu", point: 2, status: "Completed" },
    { id: 34, name: "Ceylin", day: "Pazartesi", task: "Sayfa yapısı klasörlenmesi", point: 2, status: "Completed" },
    { id: 35, name: "Ceylin", day: "Pazartesi", task: "Boş komponentlerin açılması", point: 1, status: "Completed" },
    { id: 36, name: "Ceylin", day: "Pazartesi", task: "VS Code Live Share", point: 1, status: "Completed" },
    { id: 37, name: "Tutku", day: "Pazartesi", task: "Kategorik değişkenlerin belirlenmesi", point: 2, status: "Completed" },
    { id: 38, name: "Tutku", day: "Pazartesi", task: "Sayısal değişken dağılımı", point: 3, status: "Completed" },
    { id: 39, name: "Tutku", day: "Pazartesi", task: "Gereksiz kolonların drop edilmesi", point: 2, status: "Completed" },
    { id: 40, name: "Tutku", day: "Pazartesi", task: "İlk analiz notebook yükleme", point: 1, status: "Completed" },
    { id: 41, name: "Eray", day: "Salı", task: "Flask User modelinin oluşturulması", point: 3, status: "Completed" },
    { id: 42, name: "Eray", day: "Salı", task: "GET /users endpoint yazımı", point: 2, status: "Completed" },
    { id: 43, name: "Eray", day: "Salı", task: "SQLAlchemy yapılandırılması", point: 3, status: "Completed" },
    { id: 44, name: "Eray", day: "Salı", task: "Mock data scripti oluşturma", point: 2, status: "Completed" },
    { id: 45, name: "Can", day: "Salı", task: "Navbar komponentinin kodlanması", point: 3, status: "Completed" },
    { id: 46, name: "Can", day: "Salı", task: "Footer komponentinin kodlanması", point: 2, status: "Completed" },
    { id: 47, name: "Can", day: "Salı", task: "Material UI entegrasyonu", point: 3, status: "Completed" },
    { id: 48, name: "Can", day: "Salı", task: "Responsive tasarım kontrolü", point: 2, status: "Completed" },
    { id: 49, name: "Cihangir", day: "Salı", task: "Login API endpoint yazımı", point: 5, status: "Completed" },
    { id: 50, name: "Cihangir", day: "Salı", task: "Password Hashing araştırması", point: 3, status: "Completed" },
    { id: 51, name: "Cihangir", day: "Salı", task: "Request validation", point: 2, status: "Completed" },
    { id: 52, name: "Cihangir", day: "Salı", task: "HTTP Status kodları düzenleme", point: 1, status: "Completed" },
    { id: 53, name: "Fatmanur", day: "Salı", task: "Swagger UI kurulumu", point: 3, status: "Completed" },
    { id: 54, name: "Fatmanur", day: "Salı", task: "API endpoint dökümantasyonu", point: 2, status: "Completed" },
    { id: 55, name: "Fatmanur", day: "Salı", task: "Proje dosya düzeni refactor", point: 3, status: "Completed" },
    { id: 56, name: "Fatmanur", day: "Salı", task: "requirements.txt güncelleme", point: 1, status: "Completed" },
    { id: 57, name: "Vedat", day: "Salı", task: "Outlier tespiti - Boxplot", point: 3, status: "Completed" },
    { id: 58, name: "Vedat", day: "Salı", task: "Z-Score ile aykırı değer temizliği", point: 5, status: "Completed" },
    { id: 59, name: "Vedat", day: "Salı", task: "Histogram grafikleri", point: 2, status: "Completed" },
    { id: 60, name: "Vedat", day: "Salı", task: "Veri temizliği raporu", point: 2, status: "Completed" },
    { id: 61, name: "Burak", day: "Salı", task: "Docker Compose dosyası yazımı", point: 5, status: "Completed" },
    { id: 62, name: "Burak", day: "Salı", task: "Container bağlantısı", point: 3, status: "Completed" },
    { id: 63, name: "Burak", day: "Salı", task: "Environment değişkenleri yönetimi", point: 2, status: "Completed" },
    { id: 64, name: "Burak", day: "Salı", task: "Docker log incelemesi", point: 1, status: "Completed" },
    { id: 65, name: "Zeynep", day: "Salı", task: "Matplotlib çizgi grafik", point: 2, status: "Completed" },
    { id: 66, name: "Zeynep", day: "Salı", task: "Seaborn Scatter Plot", point: 3, status: "Completed" },
    { id: 67, name: "Zeynep", day: "Salı", task: "Korelasyon Heatmap", point: 5, status: "Completed" },
    { id: 68, name: "Zeynep", day: "Salı", task: "Grafik renk ve etiketleme", point: 2, status: "Completed" },
    { id: 69, name: "Ece", day: "Salı", task: "Login sayfası CSS tasarımı", point: 3, status: "Completed" },
    { id: 70, name: "Ece", day: "Salı", task: "Buton hover efektleri", point: 2, status: "Completed" },
    { id: 71, name: "Ece", day: "Salı", task: "Input focus state tasarımları", point: 2, status: "Completed" },
    { id: 72, name: "Ece", day: "Salı", task: "Flexbox sayfa ortalama", point: 1, status: "Completed" },
    { id: 73, name: "Ceylin", day: "Salı", task: "Axios instance oluşturma", point: 2, status: "Completed" },
    { id: 74, name: "Ceylin", day: "Salı", task: "Login form state yönetimi", point: 3, status: "Completed" },
    { id: 75, name: "Ceylin", day: "Salı", task: "Backend POST isteği denemesi", point: 3, status: "Failed" },
    { id: 76, name: "Ceylin", day: "Salı", task: "Hata mesajları gösterimi", point: 2, status: "Completed" },
    { id: 77, name: "Tutku", day: "Salı", task: "One-Hot Encoding işlemi", point: 5, status: "Completed" },
    { id: 78, name: "Tutku", day: "Salı", task: "Label Encoding işlemi", point: 3, status: "Completed" },
    { id: 79, name: "Tutku", day: "Salı", task: "Train/Test veri bölme", point: 3, status: "Completed" },
    { id: 80, name: "Tutku", day: "Salı", task: "Feature Scaling", point: 3, status: "Completed" },
    { id: 81, name: "Eray", day: "Çarşamba", task: "JWT implementasyonu", point: 5, status: "Completed" },
    { id: 82, name: "Eray", day: "Çarşamba", task: "Token doğrulama decorator", point: 5, status: "Completed" },
    { id: 83, name: "Eray", day: "Çarşamba", task: "Refresh token araştırması", point: 3, status: "In Progress" },
    { id: 84, name: "Eray", day: "Çarşamba", task: "Postman ile token testi", point: 2, status: "Completed" },
    { id: 85, name: "Can", day: "Çarşamba", task: "Dashboard Sidebar menüsü", point: 3, status: "Completed" },
    { id: 86, name: "Can", day: "Çarşamba", task: "Profil dropdown menüsü", point: 2, status: "Completed" },
    { id: 87, name: "Can", day: "Çarşamba", task: "Context API auth state", point: 5, status: "Completed" },
    { id: 88, name: "Can", day: "Çarşamba", task: "Logout fonksiyonu yazımı", point: 2, status: "Completed" },
    { id: 89, name: "Cihangir", day: "Çarşamba", task: "Database Migration hatası çözümü", point: 8, status: "Completed" },
    { id: 90, name: "Cihangir", day: "Çarşamba", task: "Task CRUD API", point: 5, status: "Completed" },
    { id: 91, name: "Cihangir", day: "Çarşamba", task: "SQL Join optimizasyonu", point: 3, status: "Completed" },
    { id: 92, name: "Cihangir", day: "Çarşamba", task: "Code Review: JWT kodu", point: 2, status: "Completed" },
    { id: 93, name: "Fatmanur", day: "Çarşamba", task: "Pytest Unit Test yazımı", point: 5, status: "Completed" },
    { id: 94, name: "Fatmanur", day: "Çarşamba", task: "Test coverage raporu", point: 3, status: "Completed" },
    { id: 95, name: "Fatmanur", day: "Çarşamba", task: "Hatalı test case düzeltme", point: 2, status: "Completed" },
    { id: 96, name: "Fatmanur", day: "Çarşamba", task: "Fixture verileri hazırlama", point: 2, status: "Completed" },
    { id: 97, name: "Vedat", day: "Çarşamba", task: "Karmaşık SQL sorguları", point: 5, status: "Completed" },
    { id: 98, name: "Vedat", day: "Çarşamba", task: "Pandas GroupBy işlemleri", point: 3, status: "Completed" },
    { id: 99, name: "Vedat", day: "Çarşamba", task: "Pivot table oluşturma", point: 3, status: "Completed" },
    { id: 100, name: "Vedat", day: "Çarşamba", task: "Time-series hazırlık", point: 2, status: "Completed" },
    { id: 101, name: "Burak", day: "Çarşamba", task: "Github Actions CI pipeline", point: 5, status: "Failed" },
    { id: 102, name: "Burak", day: "Çarşamba", task: "YAML syntax hatası bulma", point: 3, status: "Completed" },
    { id: 103, name: "Burak", day: "Çarşamba", task: "Docker volume ayarı", point: 3, status: "Completed" },
    { id: 104, name: "Burak", day: "Çarşamba", task: "Redis container ekleme", point: 2, status: "Completed" },
    { id: 105, name: "Zeynep", day: "Çarşamba", task: "Plotly interaktif grafik", point: 5, status: "Completed" },
    { id: 106, name: "Zeynep", day: "Çarşamba", task: "Pasta grafiği çizimi", point: 2, status: "Completed" },
    { id: 107, name: "Zeynep", day: "Çarşamba", task: "Grafik PNG export", point: 2, status: "Completed" },
    { id: 108, name: "Zeynep", day: "Çarşamba", task: "Missingno görselleştirme", point: 3, status: "Completed" },
    { id: 109, name: "Ece", day: "Çarşamba", task: "Dark/Light Mode altyapısı", point: 5, status: "Completed" },
    { id: 110, name: "Ece", day: "Çarşamba", task: "Tema değiştirme butonu", point: 2, status: "Completed" },
    { id: 111, name: "Ece", day: "Çarşamba", task: "CSS Grid layout düzenleme", point: 3, status: "Completed" },
    { id: 112, name: "Ece", day: "Çarşamba", task: "Hamburger menu yapımı", point: 3, status: "In Progress" },
    { id: 113, name: "Ceylin", day: "Çarşamba", task: "CORS hatası çözümü", point: 3, status: "Completed" },
    { id: 114, name: "Ceylin", day: "Çarşamba", task: "JWT LocalStorage kaydetme", point: 2, status: "Completed" },
    { id: 115, name: "Ceylin", day: "Çarşamba", task: "Protected Route yapısı", point: 5, status: "Completed" },
    { id: 116, name: "Ceylin", day: "Çarşamba", task: "Dashboard veri çekme", point: 3, status: "In Progress" },
    { id: 117, name: "Tutku", day: "Çarşamba", task: "Lineer Regresyon modeli", point: 5, status: "Completed" },
    { id: 118, name: "Tutku", day: "Çarşamba", task: "Model eğitimi (Fit)", point: 3, status: "Completed" },
    { id: 119, name: "Tutku", day: "Çarşamba", task: "Tahmin denemeleri", point: 2, status: "Completed" },
    { id: 120, name: "Tutku", day: "Çarşamba", task: "R2 Score hesabı", point: 3, status: "In Progress" },
    { id: 121, name: "Eray", day: "Perşembe", task: "Admin yetki kontrolü", point: 3, status: "Completed" },
    { id: 122, name: "Eray", day: "Perşembe", task: "Exception Handling", point: 3, status: "Completed" },
    { id: 123, name: "Eray", day: "Perşembe", task: "Loglama altyapısı", point: 2, status: "Completed" },
    { id: 124, name: "Eray", day: "Perşembe", task: "Code Refactoring", point: 3, status: "Completed" },
    { id: 125, name: "Can", day: "Perşembe", task: "Chart.js entegrasyonu", point: 5, status: "Completed" },
    { id: 126, name: "Can", day: "Perşembe", task: "Dashboard Pie Chart", point: 3, status: "Completed" },
    { id: 127, name: "Can", day: "Perşembe", task: "Dashboard Bar Chart", point: 3, status: "Completed" },
    { id: 128, name: "Can", day: "Perşembe", task: "Grafik responsive ayarı", point: 2, status: "Completed" },
    { id: 129, name: "Cihangir", day: "Perşembe", task: "Migration sorunu fixleme", point: 5, status: "Completed" },
    { id: 130, name: "Cihangir", day: "Perşembe", task: "Task POST endpoint", point: 3, status: "Completed" },
    { id: 131, name: "Cihangir", day: "Perşembe", task: "Task DELETE endpoint", point: 2, status: "Completed" },
    { id: 132, name: "Cihangir", day: "Perşembe", task: "API response optimizasyonu", point: 3, status: "Completed" },
    { id: 133, name: "Fatmanur", day: "Perşembe", task: "Cypress araştırması", point: 3, status: "Completed" },
    { id: 134, name: "Fatmanur", day: "Perşembe", task: "User Stories testi", point: 3, status: "Completed" },
    { id: 135, name: "Fatmanur", day: "Perşembe", task: "Bug raporlama şablonu", point: 1, status: "Completed" },
    { id: 136, name: "Fatmanur", day: "Perşembe", task: "Grafik kodları testi", point: 2, status: "Completed" },
    { id: 137, name: "Vedat", day: "Perşembe", task: "Feature Engineering", point: 5, status: "Completed" },
    { id: 138, name: "Vedat", day: "Perşembe", task: "Yeni değişken türetme", point: 3, status: "Completed" },
    { id: 139, name: "Vedat", day: "Perşembe", task: "Değişken eleme", point: 3, status: "Completed" },
    { id: 140, name: "Vedat", day: "Perşembe", task: "Analiz bulgularını rapora dökme", point: 2, status: "Completed" },
    { id: 141, name: "Burak", day: "Perşembe", task: "CI/CD pipeline fix", point: 3, status: "Completed" },
    { id: 142, name: "Burak", day: "Perşembe", task: "Otomatik testlerin CI koşması", point: 3, status: "Completed" },
    { id: 143, name: "Burak", day: "Perşembe", task: "Dockerfile optimizasyonu", point: 5, status: "Completed" },
    { id: 144, name: "Burak", day: "Perşembe", task: "Container boyut küçültme", point: 2, status: "In Progress" },
    { id: 145, name: "Zeynep", day: "Perşembe", task: "Sunum PPT taslağı", point: 2, status: "Completed" },
    { id: 146, name: "Zeynep", day: "Perşembe", task: "Grafiklere yorum yazma", point: 3, status: "Completed" },
    { id: 147, name: "Zeynep", day: "Perşembe", task: "Data Storytelling", point: 5, status: "Completed" },
    { id: 148, name: "Zeynep", day: "Perşembe", task: "Sunum provası", point: 2, status: "Completed" },
    { id: 149, name: "Ece", day: "Perşembe", task: "Modal tasarımı", point: 3, status: "Completed" },
    { id: 150, name: "Ece", day: "Perşembe", task: "Toast mesajları stili", point: 2, status: "Completed" },
    { id: 151, name: "Ece", day: "Perşembe", task: "Cross-browser uyumluluk", point: 3, status: "Completed" },
    { id: 152, name: "Ece", day: "Perşembe", task: "CSS kod temizliği", point: 2, status: "Completed" },
    { id: 153, name: "Ceylin", day: "Perşembe", task: "Task listeleme entegrasyonu", point: 5, status: "Completed" },
    { id: 154, name: "Ceylin", day: "Perşembe", task: "Task ekleme formunun bağlanması", point: 3, status: "Completed" },
    { id: 155, name: "Ceylin", day: "Perşembe", task: "Loading spinner ekleme", point: 2, status: "Completed" },
    { id: 156, name: "Ceylin", day: "Perşembe", task: "useEffect dependency fix", point: 2, status: "Completed" },
    { id: 157, name: "Tutku", day: "Perşembe", task: "Random Forest model", point: 5, status: "Completed" },
    { id: 158, name: "Tutku", day: "Perşembe", task: "Hyperparameter Tuning", point: 8, status: "In Progress" },
    { id: 159, name: "Tutku", day: "Perşembe", task: "MSE, RMSE karşılaştırma", point: 3, status: "Completed" },
    { id: 160, name: "Tutku", day: "Perşembe", task: "Overfitting kontrolü", point: 3, status: "Completed" },
    { id: 161, name: "Eray", day: "Cuma", task: "Production ortam değişkenleri", point: 2, status: "Completed" },
    { id: 162, name: "Eray", day: "Cuma", task: "Son kontroller ve sistem testi", point: 3, status: "Completed" },
    { id: 163, name: "Eray", day: "Cuma", task: "Teknik sunum hazırlığı", point: 2, status: "Completed" },
    { id: 164, name: "Eray", day: "Cuma", task: "Demo sunumu", point: 5, status: "Completed" },
    { id: 165, name: "Can", day: "Cuma", task: "Görsel hata düzeltmeleri", point: 2, status: "Completed" },
    { id: 166, name: "Can", day: "Cuma", task: "Kullanılmayan import temizliği", point: 1, status: "Completed" },
    { id: 167, name: "Can", day: "Cuma", task: "Ekran görüntüleri alınması", point: 1, status: "Completed" },
    { id: 168, name: "Can", day: "Cuma", task: "UI/UX sunum bölümü", point: 3, status: "Completed" },
    { id: 169, name: "Cihangir", day: "Cuma", task: "Veritabanı yedeği alınması", point: 2, status: "Completed" },
    { id: 170, name: "Cihangir", day: "Cuma", task: "API son test", point: 3, status: "Completed" },
    { id: 171, name: "Cihangir", day: "Cuma", task: "Kod yorum satırları düzenleme", point: 1, status: "Completed" },
    { id: 172, name: "Cihangir", day: "Cuma", task: "Backend mimarisi sunumu", point: 2, status: "Completed" },
    { id: 173, name: "Fatmanur", day: "Cuma", task: "Sprint raporu derleme", point: 3, status: "Completed" },
    { id: 174, name: "Fatmanur", day: "Cuma", task: "Readme.md son hali", point: 2, status: "Completed" },
    { id: 175, name: "Fatmanur", day: "Cuma", task: "Teslim dokümanı", point: 2, status: "Completed" },
    { id: 176, name: "Fatmanur", day: "Cuma", task: "Geri bildirim toplantısı notları", point: 1, status: "Completed" },
    { id: 177, name: "Vedat", day: "Cuma", task: "Final Notebook temizliği", point: 2, status: "Completed" },
    { id: 178, name: "Vedat", day: "Cuma", task: "Markdown açıklamaları ekleme", point: 2, status: "Completed" },
    { id: 179, name: "Vedat", day: "Cuma", task: "Analiz sonuçları özet metni", point: 3, status: "Completed" },
    { id: 180, name: "Vedat", day: "Cuma", task: "Veri kaynakçaları ekleme", point: 1, status: "Completed" },
    { id: 181, name: "Burak", day: "Cuma", task: "Teknik Borç listesi", point: 3, status: "Completed" },
    { id: 182, name: "Burak", day: "Cuma", task: "Docker Hub'a push", point: 3, status: "Completed" },
    { id: 183, name: "Burak", day: "Cuma", task: "Sunucu maliyet raporu", point: 2, status: "Completed" },
    { id: 184, name: "Burak", day: "Cuma", task: "Deployment sunumu", point: 2, status: "Completed" },
    { id: 185, name: "Zeynep", day: "Cuma", task: "Sunum son şekli", point: 3, status: "Completed" },
    { id: 186, name: "Zeynep", day: "Cuma", task: "Renk uyumu kontrolü", point: 1, status: "Completed" },
    { id: 187, name: "Zeynep", day: "Cuma", task: "Proje klasörü zipleme", point: 1, status: "Completed" },
    { id: 188, name: "Zeynep", day: "Cuma", task: "Teşekkür maili taslağı", point: 1, status: "Completed" },
    { id: 189, name: "Ece", day: "Cuma", task: "console.log temizliği", point: 2, status: "Completed" },
    { id: 190, name: "Ece", day: "Cuma", task: "CSS minify edilmesi", point: 2, status: "Completed" },
    { id: 191, name: "Ece", day: "Cuma", task: "Kırık link kontrolü", point: 2, status: "Completed" },
    { id: 192, name: "Ece", day: "Cuma", task: "Tasarım sunumu hazırlığı", point: 2, status: "Completed" },
    { id: 193, name: "Ceylin", day: "Cuma", task: "React build alınması", point: 3, status: "Completed" },
    { id: 194, name: "Ceylin", day: "Cuma", task: "Build sunucuya atılması", point: 2, status: "Completed" },
    { id: 195, name: "Ceylin", day: "Cuma", task: "Canlıda kullanıcı testi", point: 3, status: "Completed" },
    { id: 196, name: "Ceylin", day: "Cuma", task: "Frontend sunumu", point: 2, status: "Completed" },
    { id: 197, name: "Tutku", day: "Cuma", task: "Model kaydedilmesi (.pkl)", point: 2, status: "Completed" },
    { id: 198, name: "Tutku", day: "Cuma", task: "Model API scripti", point: 5, status: "In Progress" },
    { id: 199, name: "Tutku", day: "Cuma", task: "Model metrikleri tablosu", point: 2, status: "Completed" },
    { id: 200, name: "Tutku", day: "Cuma", task: "AI/Model sunumu", point: 3, status: "Completed" },
];

export async function seedInterns() {
    console.log("🌱 Seeding 10 interns to Firestore...");
    const batch = writeBatch(db);

    for (const intern of INTERNS) {
        const docRef = doc(db, "users", intern.id);
        batch.set(docRef, {
            name: intern.name,
            userID: intern.id,
            emails: [`${intern.name.toLowerCase()}@entrophi.co`],
            role: "Stajyer",
            department: intern.department,
            highSchool: "",
            telephone: "",
            github: "",
            linkedIn: "",
            clubs: [],
            location: "Istanbul",
            university: intern.role === "CS" ? "Computer Science" : "Data Science",
            _3true1wrong: [],
            musics: []
        });
    }

    await batch.commit();
    console.log("✅ 10 interns seeded successfully!");
    return INTERNS.length;
}

export async function seedTasks() {
    console.log("🌱 Seeding 200 tasks to Firestore...");

    // Firestore batch limit is 500 writes, so we're safe
    const batch = writeBatch(db);

    for (const task of ALL_TASKS) {
        const intern = INTERNS.find(i => i.name === task.name);
        const docRef = doc(db, "todos", `task_${task.id}`);

        batch.set(docRef, {
            title: task.task,
            description: `${task.day} görevi`,
            dueDate: dayToDate[task.day] || "2026-01-27",
            priority: task.point,
            responsibleUsers: intern ? [intern.id] : [],
            departments: [intern?.department || "Engineering"],
            status: task.status,
            value: task.point,
            taskID: `task_${task.id}`,
            createdAt: new Date().toISOString()
        });
    }

    await batch.commit();
    console.log("✅ 200 tasks seeded successfully!");
    return ALL_TASKS.length;
}

export async function seedAll() {
    try {
        const internCount = await seedInterns();
        const taskCount = await seedTasks();
        console.log(`🎉 All data seeded! ${internCount} interns, ${taskCount} tasks`);
        return { interns: internCount, tasks: taskCount };
    } catch (error) {
        console.error("❌ Seed error:", error);
        throw error;
    }
}
