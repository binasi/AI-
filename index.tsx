import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { 
  Upload, Image as ImageIcon, Copy, RefreshCw, Wand2, Settings, 
  Loader2, Sparkles, Languages, Shirt, Camera, Layers, Download, Globe,
  Sun, Moon, Clipboard, Check, ChevronRight, Trash2
} from "lucide-react";

// --- Styles ---
const styles = `
:root {
  /* Default Light Mode Variables */
  --bg-app: #f4f6f8;
  --bg-card: #ffffff;
  --text-main: #1e293b;
  --text-sub: #64748b;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-light: #eff6ff;
  --border: #e2e8f0;
  --input-bg: #f8fafc;
  --ring: rgba(37, 99, 235, 0.2);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --radius: 16px;
}

[data-theme='dark'] {
  --bg-app: #0f172a;
  --bg-card: #1e293b;
  --text-main: #f1f5f9;
  --text-sub: #94a3b8;
  --primary: #60a5fa;
  --primary-hover: #3b82f6;
  --primary-light: rgba(96, 165, 250, 0.1);
  --border: #334155;
  --input-bg: #0f172a;
  --ring: rgba(96, 165, 250, 0.2);
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-app);
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.3s, color 0.3s;
}

/* Layout */
.app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  min-height: 100vh;
}

/* Navbar */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-actions {
  display: flex;
  gap: 0.75rem;
}

.icon-btn {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-sub);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
  background: var(--primary-light);
}

/* Tab Navigation */
.tab-nav {
  display: inline-flex;
  background: var(--bg-card);
  padding: 0.25rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-sub);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-item.active {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

/* Main Grid */
.content-grid {
  display: grid;
  grid-template-columns: 420px 520px; /* Narrower and fixed width columns */
  justify-content: center; /* Center the grid */
  gap: 2rem;
  align-items: stretch; /* Forces equal height */
}

@media (max-width: 1000px) {
  .content-grid {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin: 0 auto;
  }
}

/* Cards */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%; /* Fill the grid area */
  box-sizing: border-box;
  position: relative;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

/* Upload Area */
.uploader {
  border: 2px dashed var(--border);
  border-radius: 12px;
  background: var(--input-bg);
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  outline: none;
  flex: 1; /* Allow stretching if needed */
}

.uploader:hover, .uploader:focus {
  border-color: var(--primary);
  background: var(--primary-light);
}

.uploader.has-file {
  border: none;
  background: #000;
  padding: 0;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Keeps entire image visible */
  max-height: 400px;
}

.upload-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-sub);
  text-align: center;
  padding: 1rem;
}

.upload-hint span {
  font-size: 0.85rem;
  font-weight: 500;
}

.reset-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Form Elements */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-sub);
}

.input, .select {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--input-bg);
  color: var(--text-main);
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s;
}

.input:focus, .select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--ring);
}

/* Primary Button */
.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.85rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: auto; /* Push to bottom if space permits */
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Prompt Result */
.result-box {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem;
  font-family: 'SF Mono', 'Monaco', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-main);
  resize: none;
  width: 100%;
  box-sizing: border-box;
  flex: 1; /* Fill remaining height */
  min-height: 300px;
}

/* Result Actions */
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.action-sm {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-sub);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.1s;
}

.action-sm:hover {
  background: var(--border);
  color: var(--text-main);
  border-color: var(--text-sub);
}

.action-sm.danger:hover {
  color: #ef4444;
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

/* Studio Specific */
.mode-toggle {
  display: flex;
  background: var(--input-bg);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.mode-btn {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px;
  border-radius: 7px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-sub);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
}

.mode-btn.active {
  background: var(--bg-card);
  color: var(--primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.generated-container {
  background: var(--input-bg);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  flex: 1; /* Fill height */
  min-height: 400px; /* Baseline height */
  position: relative; /* For absolute image positioning */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Using absolute positioning to prevent image from stretching container height */
.generated-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-sub);
  opacity: 0.5;
  z-index: 1; /* Ensure text is above if needed */
}

/* Two column upload row */
.upload-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.hint-text {
  font-size: 0.8rem;
  color: var(--text-sub);
  margin-top: -4px;
}
`;

// --- Translations ---
const translations = {
  en: {
    app_name: "Creative Studio",
    tab_extract: "Prompt Extractor",
    tab_studio: "Commercial Studio",
    
    // Prompt Extractor
    upload_title: "Input Image",
    upload_hint: "Drop or Paste (Ctrl+V)",
    model_label: "Vision Model",
    format_label: "Output Format",
    btn_generate: "Analyze & Generate",
    result_title: "Generated Prompt",
    btn_copy: "Copy",
    btn_translate: "Translate CN",
    
    // Studio
    mode_product: "Product Shot",
    mode_fashion: "Virtual Try-On",
    lbl_product: "Product Image",
    lbl_model: "Model/Person",
    lbl_garment: "Garment",
    bg_style: "Background Aesthetic",
    details_ph: "Extra details (e.g., 'soft lighting', 'luxury feel')...",
    btn_create: "Generate Studio Shot",
    result_studio: "Studio Result",
    btn_download: "Download",
    btn_clear: "Clear",
    
    // Backgrounds
    bg_zen: "Zen Garden (Stone/Water)",
    bg_wood: "Vintage Wood (Wabi-sabi)",
    bg_paper: "Textured Paper (Clean)",
    bg_oriental: "New Oriental (Red/Gold)",
    bg_nature: "Organic Sunlight (Nature)",
    bg_silk: "Luxurious Silk (Champagne)",
    bg_podium: "Geometric Podium (Pastel)",
    bg_water_dark: "Dark Water Ripple (Moody)",
    bg_sand: "Desert Sand (Organic)",
    bg_ceramic: "White Ceramic (Minimalist)",
    bg_window: "Window Shadow (Linen/Cloth)",
    bg_screen: "Antique Screen & Bonsai",
    bg_glass: "Diffused Glass & Stone",

    analyzing: "Analyzing...",
    creating: "Rendering...",
    fashion_default_bg: "Default Studio (Custom BG coming soon)",
  },
  zh: {
    app_name: "AI 创意工坊",
    tab_extract: "提示词提取",
    tab_studio: "商业摄影棚",
    
    // Prompt Extractor
    upload_title: "上传参考图",
    upload_hint: "拖拽或粘贴图片 (Ctrl+V)",
    model_label: "视觉模型",
    format_label: "输出格式",
    btn_generate: "智能分析生成",
    result_title: "生成结果",
    btn_copy: "复制内容",
    btn_translate: "转为中文",
    
    // Studio
    mode_product: "产品摄影",
    mode_fashion: "虚拟试衣",
    lbl_product: "产品原图",
    lbl_model: "模特/人物",
    lbl_garment: "服装/参考",
    bg_style: "背景风格 (高级感)",
    details_ph: "额外细节（如：柔光，悬浮，水花...）",
    btn_create: "生成商业大片",
    result_studio: "成图结果",
    btn_download: "保存图片",
    btn_clear: "清空",
    
    // Backgrounds
    bg_zen: "禅意岩石与流水 (自然)",
    bg_wood: "中古胡桃木 (侘寂风)",
    bg_paper: "极简肌理纸艺 (干净)",
    bg_oriental: "新中式美学 (典雅)",
    bg_nature: "自然光影花艺 (清新)",
    bg_silk: "奢华丝绸褶皱 (香槟色)",
    bg_podium: "几何立体展台 (马卡龙)",
    bg_water_dark: "暗调水波纹 (高级黑)",
    bg_sand: "大漠流沙纹理 (有机)",
    bg_ceramic: "纯白陶瓷质感 (极简)",
    bg_window: "窗边柔光与亚麻布 (生活感)",
    bg_screen: "古风屏风与盆景 (古典)",
    bg_glass: "朦胧磨砂玻璃与石材 (现代)",

    analyzing: "深度分析中...",
    creating: "正在渲染高清图...",
    fashion_default_bg: "默认影棚 (自定义背景开发中)",
  }
};

const App = () => {
  const [lang, setLang] = useState<'zh' | 'en'>('zh'); 
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const t = (key: string) => translations[lang][key as keyof typeof translations['en']] || key;

  const [activeTab, setActiveTab] = useState<'prompt' | 'studio'>('prompt');
  
  // State
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("gemini-2.5-flash"); 
  const [studioModel, setStudioModel] = useState("gemini-2.5-flash-image"); 
  
  // Prompt Extractor
  const [file1, setFile1] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  const [base64_1, setBase64_1] = useState<string | null>(null);
  const [promptResult, setPromptResult] = useState("");
  const [promptMode, setPromptMode] = useState("doubao-jimeng");

  // Studio - Product
  const [studioType, setStudioType] = useState<'product' | 'fashion'>('product');
  const [productBg, setProductBg] = useState("zen");
  const [productDetails, setProductDetails] = useState("");
  
  // Studio - Fashion
  const [file2, setFile2] = useState<File | null>(null); 
  const [preview2, setPreview2] = useState<string | null>(null);
  const [base64_2, setBase64_2] = useState<string | null>(null);
  const [fashionDetails, setFashionDetails] = useState("");

  const [studioResult, setStudioResult] = useState<string | null>(null);

  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    document.body.setAttribute('data-theme', theme);
    return () => { document.head.removeChild(styleSheet); };
  }, [theme]);

  const handleFile = (file: File, slot: 1 | 2) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = (reader.result as string).split(",")[1];
      const url = URL.createObjectURL(file);
      if (slot === 1) {
        setFile1(file); setPreview1(url); setBase64_1(b64); setPromptResult("");
      } else {
        setFile2(file); setPreview2(url); setBase64_2(b64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent, slot: 1 | 2) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) { handleFile(file, slot); e.preventDefault(); }
        return;
      }
    }
  };

  const reset = (slot: 1 | 2) => {
    if (slot === 1) { setFile1(null); setPreview1(null); setBase64_1(null); setPromptResult(""); }
    else { setFile2(null); setPreview2(null); setBase64_2(null); }
  };

  const clearResult = () => {
    setStudioResult(null);
  };

  const generatePrompt = async () => {
    if (!base64_1 || !process.env.API_KEY) return;
    setLoading(true);
    setPromptResult("");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sysPrompts = {
        "doubao-jimeng": "你是一位顶级AI绘画提示词专家。请对这张图片进行“逆向工程”，生成一段能让AI（如豆包、即梦）还原出90%相似度画面的提示词。请使用简体中文。请详细包含：\n1. 主体描述（外貌、动作、服装、表情）\n2. 场景与环境（背景细节）\n3. 艺术风格（如：商业摄影、3D渲染、油画、赛博朋克等，需具体）\n4. 光影与色彩（光线方向、色调、氛围）\n5. 构图与镜头（视角、景深）\n\n请直接输出可以直接使用的提示词段落。",
        "midjourney": "You are a Midjourney expert. Reverse-engineer this image. Create a prompt to reproduce this image with 90% accuracy. Format: [Subject] + [Environment] + [Art Style] + [Lighting/Color] + [Camera/Render Details] + --ar [Aspect Ratio].",
        "stable-diffusion": "You are a Stable Diffusion expert. Reverse-engineer this image into danbooru-style tags. Include: quality tags (masterpiece, best quality, 8k), subject tags, style tags, lighting tags, composition tags. Ensure 90% visual similarity.",
        "descriptive": "Describe this image in extreme detail so an AI can recreate it with 90% accuracy. Include subject, setting, medium, lighting, color palette, and composition."
      };
      
      const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [{ inlineData: { mimeType: file1?.type || "image/png", data: base64_1 } }, { text: sysPrompts[promptMode as keyof typeof sysPrompts] }] },
        config: { safetySettings: [{ category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }, { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE }] }
      });
      setPromptResult(response.text || "No response.");
    } catch (e: any) { setPromptResult(`Error: ${e.message}`); }
    finally { setLoading(false); }
  };

  const translate = async () => {
    if (!promptResult || !process.env.API_KEY) return;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Translate this AI prompt to high-quality Simplified Chinese: ${promptResult}`
    });
    if (res.text) setPromptResult(res.text);
  };

  const generateStudio = async () => {
    if (!base64_1 || !process.env.API_KEY) return;
    setLoading(true);
    setStudioResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const bgPrompts: Record<string, string> = {
        "zen": "a high-end Zen aesthetic background. Smooth natural stones, a shallow water surface with gentle ripples, and a single elegant flower branch. Soft, serene lighting, beige and earth tones. Composition has negative space (wabi-sabi).",
        "wood": "a vintage wabi-sabi wooden table surface. Deep rich walnut wood texture, dappled sunlight shadows from plants (gobo effect). Warm, nostalgic, elegant atmosphere.",
        "paper": "a clean, textured beige paper background with soft, organic curves and subtle plant shadows. Minimalist, elegant, high-key lighting. Modern oriental aesthetic.",
        "oriental": "a new chinese style aesthetic background. Subtle red or gold accents, antique wooden props, soft atmospheric fog. Elegant and sophisticated commercial photography.",
        "nature": "an outdoor setting with dappled sunlight through green leaves. Fresh, organic, eco-friendly commercial aesthetic. Shallow depth of field.",
        "silk": "a luxurious background of flowing silk fabric in champagne or soft beige tones. Elegant folds, soft specular highlights, premium fashion aesthetic.",
        "podium": "a minimalist geometric podium scene. Pastel tones (soft pink, mint, or blue), clean architectural shapes, soft studio lighting. Modern product display.",
        "water_dark": "a moody, high-end dark water surface. Deep black/blue reflection, ripples, dramatic rim lighting. Premium luxury vibe.",
        "sand": "an organic desert sand texture background. Warm golden dunes, natural grain details, soft sunset lighting. Earthy and raw.",
        "ceramic": "a pure white unglazed ceramic texture background. Minimalist, clean, matte finish, soft shadows. High-key art gallery aesthetic.",
        "window": "a cozy window-side setting with beige linen cloth and dappled soft sunlight shadows. Lifestyle product photography, warm and natural.",
        "screen": "a classical Chinese setting with an antique wooden screen and a small bonsai tree. Elegant, culturally rich, sophisticated background.",
        "glass": "a modern composition with frosted glass blocks and rough grey stone. Soft diffused lighting, contemporary art style."
      };

      const parts: any[] = [];
      let prompt = "";

      if (studioType === 'product') {
         prompt = `Generate a high-end commercial product image. Input Image 1 is the product. Place it into ${bgPrompts[productBg]}. Ensure correct lighting/shadows. Context: ${productDetails}`;
      } else {
         prompt = `High-fashion commercial shot. Image 1 is model, Image 2 is clothing. Create image of model wearing outfit in a professional studio setting. Pose: Professional. Context: ${fashionDetails}`;
      }

      parts.push({ text: prompt });
      parts.push({ inlineData: { mimeType: file1?.type || "image/png", data: base64_1 } });
      if (studioType === 'fashion' && base64_2) {
        parts.push({ inlineData: { mimeType: file2?.type || "image/png", data: base64_2 } });
      }

      const res = await ai.models.generateContent({
        model: studioModel,
        contents: { parts },
        config: { safetySettings: [{ category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }, { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE }] }
      });

      for (const part of res.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setStudioResult(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e: any) { alert(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="nav">
        <div className="brand">
          <Sparkles className="icon-brand" /> {t('app_name')}
        </div>
        <div className="nav-actions">
           <button className="icon-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
             {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
           </button>
           <button className="icon-btn" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}>
             <Globe size={18} />
           </button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="tab-nav">
        <button className={`tab-item ${activeTab === 'prompt' ? 'active' : ''}`} onClick={() => setActiveTab('prompt')}>
          <Layers size={18} /> {t('tab_extract')}
        </button>
        <button className={`tab-item ${activeTab === 'studio' ? 'active' : ''}`} onClick={() => setActiveTab('studio')}>
          <Camera size={18} /> {t('tab_studio')}
        </button>
      </div>

      {activeTab === 'prompt' && (
        <div className="content-grid">
          {/* Left Col: Input */}
          <div className="card">
            <h3 className="card-title"><Upload size={20}/> {t('upload_title')}</h3>
            <div 
              className={`uploader ${preview1 ? 'has-file' : ''}`} 
              onClick={() => ref1.current?.click()}
              onPaste={(e) => handlePaste(e, 1)}
              tabIndex={0}
            >
              <input type="file" ref={ref1} style={{display:'none'}} accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 1)} />
              {preview1 ? (
                <>
                  <img src={preview1} className="preview-img" />
                  <button className="reset-btn" onClick={(e) => { e.stopPropagation(); reset(1); }}>Reset</button>
                </>
              ) : (
                <div className="upload-hint">
                  <Upload size={32} strokeWidth={1.5} />
                  <span>{t('upload_hint')}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="label">{t('format_label')}</label>
              <select className="select" value={promptMode} onChange={(e) => setPromptMode(e.target.value)}>
                <option value="doubao-jimeng">豆包 / 即梦 (Chinese Optimized)</option>
                <option value="midjourney">Midjourney v6</option>
                <option value="stable-diffusion">Stable Diffusion (Tags)</option>
                <option value="descriptive">Descriptive (English)</option>
              </select>
            </div>
            
             <div className="form-group">
              <label className="label">{t('model_label')}</label>
              <select className="select" value={model} onChange={(e) => setModel(e.target.value)}>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
              </select>
            </div>

            <button className="btn-primary" disabled={loading || !base64_1} onClick={generatePrompt}>
              {loading ? <Loader2 className="animate-spin"/> : <Wand2 />} {t('btn_generate')}
            </button>
          </div>

          {/* Right Col: Result */}
          <div className="card">
            <div className="result-header">
              <h3 className="card-title"><Check size={20}/> {t('result_title')}</h3>
              <div style={{display:'flex', gap:'8px'}}>
                {promptResult && <button className="action-sm" onClick={translate}><Languages size={14}/> {t('btn_translate')}</button>}
                {promptResult && <button className="action-sm" onClick={() => navigator.clipboard.writeText(promptResult)}><Copy size={14}/> {t('btn_copy')}</button>}
              </div>
            </div>
            {loading ? (
               <div className="result-box" style={{display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-sub)', gap:'10px'}}>
                  <Loader2 className="animate-spin" /> {t('analyzing')}
               </div>
            ) : (
               <textarea className="result-box" value={promptResult} readOnly placeholder="..." />
            )}
          </div>
        </div>
      )}

      {activeTab === 'studio' && (
         <div className="content-grid">
           {/* Left Col: Controls */}
           <div className="card">
              <div className="mode-toggle">
                <button className={`mode-btn ${studioType === 'product' ? 'active' : ''}`} onClick={() => setStudioType('product')}>
                   <Camera size={16}/> {t('mode_product')}
                </button>
                <button className={`mode-btn ${studioType === 'fashion' ? 'active' : ''}`} onClick={() => setStudioType('fashion')}>
                   <Shirt size={16}/> {t('mode_fashion')}
                </button>
              </div>

              {/* Dynamic Uploader Section */}
              {studioType === 'product' ? (
                // Product Mode Inputs
                <>
                  <div className="form-group">
                    <label className="label">{t('lbl_product')}</label>
                    <div 
                      className={`uploader ${preview1 ? 'has-file' : ''}`} 
                      onClick={() => ref1.current?.click()}
                      onPaste={(e) => handlePaste(e, 1)}
                      tabIndex={0}
                      style={{minHeight: '200px'}}
                    >
                      <input type="file" ref={ref1} style={{display:'none'}} accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 1)} />
                      {preview1 ? (
                        <>
                          <img src={preview1} className="preview-img" />
                          <button className="reset-btn" onClick={(e) => { e.stopPropagation(); reset(1); }}>Reset</button>
                        </>
                      ) : <div className="upload-hint"><Upload size={24} /><span>{t('upload_hint')}</span></div>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label">{t('bg_style')}</label>
                    <select className="select" value={productBg} onChange={(e) => setProductBg(e.target.value)}>
                        <optgroup label="Nature & Zen (自然禅意)">
                          <option value="zen">{t('bg_zen')}</option>
                          <option value="wood">{t('bg_wood')}</option>
                          <option value="window">{t('bg_window')}</option>
                          <option value="screen">{t('bg_screen')}</option>
                          <option value="sand">{t('bg_sand')}</option>
                          <option value="nature">{t('bg_nature')}</option>
                        </optgroup>
                        <optgroup label="Modern & Premium (现代高级)">
                          <option value="paper">{t('bg_paper')}</option>
                          <option value="ceramic">{t('bg_ceramic')}</option>
                          <option value="glass">{t('bg_glass')}</option>
                          <option value="silk">{t('bg_silk')}</option>
                          <option value="water_dark">{t('bg_water_dark')}</option>
                          <option value="podium">{t('bg_podium')}</option>
                          <option value="oriental">{t('bg_oriental')}</option>
                        </optgroup>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="label">Details</label>
                    <input className="input" placeholder={t('details_ph')} value={productDetails} onChange={(e) => setProductDetails(e.target.value)} />
                  </div>
                </>
              ) : (
                // Fashion Mode Inputs
                <>
                  <div className="upload-row">
                    <div className="form-group">
                      <label className="label">{t('lbl_model')}</label>
                      <div 
                        className={`uploader ${preview1 ? 'has-file' : ''}`} 
                        onClick={() => ref1.current?.click()}
                        onPaste={(e) => handlePaste(e, 1)}
                        tabIndex={0}
                        style={{minHeight: '200px'}}
                      >
                        <input type="file" ref={ref1} style={{display:'none'}} accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 1)} />
                        {preview1 ? (
                          <>
                            <img src={preview1} className="preview-img" />
                            <button className="reset-btn" onClick={(e) => { e.stopPropagation(); reset(1); }}>Reset</button>
                          </>
                        ) : <div className="upload-hint"><Upload size={24} /><span>{t('upload_hint')}</span></div>}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="label">{t('lbl_garment')}</label>
                      <div 
                        className={`uploader ${preview2 ? 'has-file' : ''}`} 
                        onClick={() => ref2.current?.click()}
                        onPaste={(e) => handlePaste(e, 2)}
                        tabIndex={0}
                        style={{minHeight: '200px'}}
                      >
                        <input type="file" ref={ref2} style={{display:'none'}} accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 2)} />
                        {preview2 ? (
                          <>
                            <img src={preview2} className="preview-img" />
                            <button className="reset-btn" onClick={(e) => { e.stopPropagation(); reset(2); }}>Reset</button>
                          </>
                        ) : <div className="upload-hint"><Shirt size={24} /><span>{t('upload_hint')}</span></div>}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label">{t('bg_style')}</label>
                    <select className="select" disabled>
                        <option>{t('fashion_default_bg')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="label">Details</label>
                    <input className="input" placeholder={t('details_ph')} value={fashionDetails} onChange={(e) => setFashionDetails(e.target.value)} />
                  </div>
                </>
              )}

               <button className="btn-primary" disabled={loading || !base64_1 || (studioType === 'fashion' && !base64_2)} onClick={generateStudio}>
                {loading ? <Loader2 className="animate-spin"/> : <Sparkles />} {t('btn_create')}
              </button>
           </div>

           {/* Right Col: Output */}
           <div className="card">
              <div className="result-header">
                <h3 className="card-title"><Layers size={20}/> {t('result_studio')}</h3>
                <div style={{display:'flex', gap:'8px'}}>
                  {studioResult && (
                    <>
                      <button className="action-sm danger" onClick={clearResult}>
                        <Trash2 size={14}/> {t('btn_clear')}
                      </button>
                      <a href={studioResult} download="studio-shot.png" className="action-sm" style={{textDecoration:'none'}}>
                        <Download size={14}/> {t('btn_download')}
                      </a>
                    </>
                  )}
                </div>
              </div>
              <div className="generated-container">
                {loading ? (
                   <div className="empty-state">
                      <Loader2 size={40} className="animate-spin" />
                      <span>{t('creating')}</span>
                   </div>
                ) : studioResult ? (
                   <img src={studioResult} className="generated-img" />
                ) : (
                   <div className="empty-state">
                      <ImageIcon size={48} />
                      <span>{t('result_studio')}</span>
                   </div>
                )}
              </div>
           </div>
         </div>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);