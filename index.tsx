
import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { 
  Upload, Image as ImageIcon, Copy, RefreshCw, Wand2, Settings, 
  Loader2, Sparkles, Languages, Shirt, Camera, Layers, Download, Globe,
  Sun, Moon, Clipboard
} from "lucide-react";

// --- Styles ---
const styles = `
:root {
  /* Default Light Mode Variables */
  --bg-color: #f8fafc;
  --card-bg: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --accent: #6366f1;
  --accent-hover: #4f46e5;
  --border: #e2e8f0;
  --input-bg: #f1f5f9;
  --success: #10b981;
}

[data-theme='dark'] {
  --bg-color: #0f172a;
  --card-bg: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --accent: #818cf8;
  --accent-hover: #6366f1;
  --border: #334155;
  --input-bg: #0f172a;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.3s, color 0.3s;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.top-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: var(--card-bg);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.action-btn:hover {
  background: var(--input-bg);
  color: var(--text-primary);
  border-color: var(--accent);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 1rem;
}

.header h1 {
  font-size: 2.5rem;
  background: linear-gradient(to right, var(--accent), #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.header p {
  color: var(--text-secondary);
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 1rem;
}

.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--text-primary);
  background-color: var(--input-bg);
}

.tab-btn.active {
  color: white;
  background-color: var(--accent);
}

/* Grids & Layout */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  flex: 1;
}

@media (max-width: 768px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
  .top-actions {
    position: relative;
    top: auto;
    right: auto;
    margin: 0 auto 1rem auto;
    width: fit-content;
  }
}

.card {
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  height: fit-content;
}

/* Upload Areas */
.upload-group {
  display: flex;
  gap: 1rem;
}

.upload-area {
  border: 2px dashed var(--border);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  position: relative;
  overflow: hidden;
  background-color: var(--input-bg);
  flex: 1;
  outline: none; /* remove default browser outline */
}

.upload-area:focus {
  border-color: var(--accent);
  background-color: rgba(99, 102, 241, 0.05);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.upload-area:hover {
  border-color: var(--accent);
  background-color: rgba(99, 102, 241, 0.05);
}

.upload-area.has-image {
  padding: 0;
  border: none;
  background-color: black;
}

.upload-area.small {
  min-height: 150px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 400px;
  pointer-events: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.upload-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-weight: 600;
  display: block;
}

/* Controls */
.controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.select-input, .text-input, .textarea-input {
  background-color: var(--input-bg);
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  width: 100%;
  box-sizing: border-box;
}

.select-input:focus, .text-input:focus, .textarea-input:focus {
  outline: none;
  border-color: var(--accent);
}

.textarea-input {
  resize: vertical;
  min-height: 80px;
}

/* Buttons */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--accent);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--accent-hover);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--border);
}

/* Results */
.result-area-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.result-textarea {
  flex: 1;
  background-color: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-primary);
  resize: none;
  width: 100%;
  box-sizing: border-box;
}

.result-image-container {
  flex: 1;
  background-color: #000;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
}

.generated-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.result-actions {
  display: flex;
  gap: 0.5rem;
}

.tag {
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--accent);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
  gap: 1rem;
  padding: 2rem;
  text-align: center;
}
`;

// --- Translations ---
const translations = {
  en: {
    title: "AI Creative Studio",
    subtitle: "Prompt Engineering & Commercial Image Generation",
    tab_prompt: "Prompt Extractor",
    tab_studio: "Commercial Studio",
    input_image: "Input Image",
    upload_placeholder: "Upload or Paste (Ctrl+V)",
    reset: "Reset",
    vision_model: "Vision Model",
    output_format: "Output Format",
    model_custom: "Custom...",
    fmt_doubao: "Doubao/Jimeng (Chinese)",
    fmt_mj: "Midjourney v6",
    fmt_sd: "Stable Diffusion Tags",
    fmt_desc: "Descriptive (English)",
    gen_prompt_btn: "Generate Prompt",
    gen_prompt_label: "Generated Prompt",
    translate_btn: "Translate to CN",
    copy_btn: "Copy",
    analyzing: "Analyzing Image... (High Fidelity)",
    prompt_placeholder: "Prompt will appear here...",
    
    studio_mode_product: "Product Shot",
    studio_mode_fashion: "Fashion / Try-On",
    studio_product_label: "Product Image",
    studio_person_label: "Person/Model",
    studio_clothing_label: "Clothing/Outfit",
    bg_atmosphere: "Background Style (Advanced Aesthetic)",
    bg_zen_stone: "Zen Garden & Stone (Earthy/Water)",
    bg_vintage_wood: "Wabi-Sabi Wood (Warm/Vintage)",
    bg_textured_paper: "Textured Paper (Elegant/Clean)",
    bg_oriental: "New Oriental (Red/Gold Accents)",
    bg_nature: "Organic Sunlight (Soft Floral)",
    details_label: "Additional Details (Optional)",
    details_ph: "E.g. floating, water splashes, red lighting...",
    gen_model_label: "Generator Model",
    gen_studio_btn: "Generate Commercial Shot",
    studio_result_label: "Studio Result",
    save_btn: "Save",
    generating: "Generating High-Res Image...",
    studio_waiting: "Generated image will appear here",
    lang_btn: "中文",
    theme_dark: "Dark",
    theme_light: "Light",

    // Prompts
    prompt_doubao_sys: "You are an expert image analyst. Reverse-engineer this image into a prompt that can reproduce it with 90% similarity. Output in Simplified Chinese. Focus on: 1. Main Subject (Action, expression, clothing) 2. Scene & Environment 3. Art Style (Photography, 3D, Oil Painting, etc.) 4. Lighting & Color 5. Composition.",
    prompt_mj_sys: "You are a Midjourney expert. Reverse-engineer this image. Create a prompt to reproduce this image with 90% accuracy. Format: [Subject] + [Environment] + [Art Style] + [Lighting/Color] + [Camera/Render Details] + --ar [Aspect Ratio].",
    prompt_sd_sys: "You are a Stable Diffusion expert. Reverse-engineer this image into danbooru-style tags. Include: quality tags (masterpiece, best quality, 8k), subject tags, style tags, lighting tags, composition tags. Ensure 90% visual similarity.",
    prompt_desc_sys: "Describe this image in extreme detail so an AI can recreate it with 90% accuracy. Include subject, setting, medium, lighting, color palette, and composition.",
  },
  zh: {
    title: "AI 创意工坊",
    subtitle: "提示词提取 & 商业图像生成",
    tab_prompt: "提示词提取",
    tab_studio: "商业摄影棚",
    input_image: "上传图片",
    upload_placeholder: "点击上传 或 粘贴图片 (Ctrl+V)",
    reset: "重置",
    vision_model: "视觉模型",
    output_format: "输出格式",
    model_custom: "自定义...",
    fmt_doubao: "豆包 / 即梦 (中文优化)",
    fmt_mj: "Midjourney v6",
    fmt_sd: "Stable Diffusion (标签)",
    fmt_desc: "详细描述 (英文)",
    gen_prompt_btn: "生成提示词",
    gen_prompt_label: "生成结果",
    translate_btn: "转中文",
    copy_btn: "复制",
    analyzing: "深度分析中... (高保真)",
    prompt_placeholder: "生成的提示词将显示在这里...",
    
    studio_mode_product: "产品摄影",
    studio_mode_fashion: "模特换装",
    studio_product_label: "产品原图",
    studio_person_label: "模特/人物",
    studio_clothing_label: "服装/参考",
    bg_atmosphere: "背景风格 (高级感)",
    bg_zen_stone: "禅意岩石与流水 (自然/素雅)",
    bg_vintage_wood: "中古风胡桃木 (侘寂/暖调)",
    bg_textured_paper: "肌理感纸艺 (极简/干净)",
    bg_oriental: "新中式美学 (古风/典雅)",
    bg_nature: "自然光影花艺 (清新)",
    details_label: "额外细节 (可选)",
    details_ph: "例如：悬浮效果，水珠飞溅，红色灯光...",
    gen_model_label: "生成模型",
    gen_studio_btn: "生成商业大片",
    studio_result_label: "生成结果",
    save_btn: "保存",
    generating: "正在生成高清大图...",
    studio_waiting: "生成的图片将显示在这里",
    lang_btn: "English",
    theme_dark: "深色模式",
    theme_light: "浅色模式",

     // Prompts
    prompt_doubao_sys: "你是一位顶级AI绘画提示词专家。请对这张图片进行“逆向工程”，生成一段能让AI（如豆包、即梦）还原出90%相似度画面的提示词。请使用简体中文。请详细包含：\n1. 主体描述（外貌、动作、服装、表情）\n2. 场景与环境（背景细节）\n3. 艺术风格（如：商业摄影、3D渲染、油画、赛博朋克等，需具体）\n4. 光影与色彩（光线方向、色调、氛围）\n5. 构图与镜头（视角、景深）\n\n请直接输出可以直接使用的提示词段落。",
    prompt_mj_sys: "You are a Midjourney expert. Reverse-engineer this image. Create a prompt to reproduce this image with 90% accuracy. Format: [Subject] + [Environment] + [Art Style] + [Lighting/Color] + [Camera/Render Details] + --ar [Aspect Ratio].",
    prompt_sd_sys: "You are a Stable Diffusion expert. Reverse-engineer this image into danbooru-style tags. Include: quality tags (masterpiece, best quality, 8k), subject tags, style tags, lighting tags, composition tags. Ensure 90% visual similarity.",
    prompt_desc_sys: "Describe this image in extreme detail so an AI can recreate it with 90% accuracy. Include subject, setting, medium, lighting, color palette, and composition.",
  }
};

// --- Components ---

const App = () => {
  const [lang, setLang] = useState<'zh' | 'en'>('zh'); 
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Default to light
  const t = (key: string) => translations[lang][key as keyof typeof translations['en']] || key;

  const [activeTab, setActiveTab] = useState<'prompt' | 'studio'>('prompt');
  
  // --- Common State ---
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("gemini-2.5-flash"); 
  const [studioModel, setStudioModel] = useState("gemini-2.5-flash-image"); 
  
  // --- Prompt Extractor State ---
  const [file1, setFile1] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  const [base64_1, setBase64_1] = useState<string | null>(null);
  const [promptResult, setPromptResult] = useState("");
  const [promptMode, setPromptMode] = useState("doubao-jimeng");
  const [translateLoading, setTranslateLoading] = useState(false);
  const [customModel, setCustomModel] = useState("");

  // --- Studio State ---
  const [studioType, setStudioType] = useState<'product' | 'fashion'>('product');
  const [file2, setFile2] = useState<File | null>(null); 
  const [preview2, setPreview2] = useState<string | null>(null);
  const [base64_2, setBase64_2] = useState<string | null>(null);
  const [studioResultImage, setStudioResultImage] = useState<string | null>(null);
  const [studioPrompt, setStudioPrompt] = useState("");
  const [backgroundStyle, setBackgroundStyle] = useState("zen-stone");

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    
    // Set initial theme on body
    document.body.setAttribute('data-theme', theme);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // --- Helpers ---
  const handleFile = (file: File, slot: 1 | 2) => {
    if (!file.type.startsWith("image/")) return;
    
    const objectUrl = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = (reader.result as string).split(",")[1];
      if (slot === 1) {
        setFile1(file);
        setPreview1(objectUrl);
        setBase64_1(b64);
        setPromptResult(""); 
      } else {
        setFile2(file);
        setPreview2(objectUrl);
        setBase64_2(b64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent, slot: 1 | 2) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
           handleFile(file, slot);
           e.preventDefault();
        }
        return; // Only handle first image found
      }
    }
  };

  const resetImage = (slot: 1 | 2) => {
    if (slot === 1) {
      setFile1(null); setPreview1(null); setBase64_1(null); setPromptResult("");
    } else {
      setFile2(null); setPreview2(null); setBase64_2(null);
    }
  };

  // --- Logic: Prompt Extraction ---
  const translateToChinese = async () => {
    if (!promptResult || !process.env.API_KEY) return;
    setTranslateLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Translate the following AI image generation prompt into high-quality Simplified Chinese. 
        Focus on descriptive, artistic Chinese suitable for AI platforms like Doubao or Jimeng.
        Original Text: ${promptResult}`
      });
      if (response.text) setPromptResult(response.text);
    } catch (e) { alert("Translation failed"); } 
    finally { setTranslateLoading(false); }
  };

  const generatePrompt = async () => {
    if (!base64_1 || !process.env.API_KEY) return;
    setLoading(true);
    setPromptResult("");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const targetModel = model === "custom" ? customModel : model;
      
      let userPrompt = "";
      
      if (promptMode === "midjourney") {
        userPrompt = translations[lang].prompt_mj_sys;
      } else if (promptMode === "stable-diffusion") {
        userPrompt = translations[lang].prompt_sd_sys;
      } else if (promptMode === "doubao-jimeng") {
        userPrompt = translations[lang].prompt_doubao_sys;
      } else {
        userPrompt = translations[lang].prompt_desc_sys;
      }

      const response = await ai.models.generateContent({
        model: targetModel,
        contents: { parts: [{ inlineData: { mimeType: file1?.type || "image/png", data: base64_1 } }, { text: userPrompt }] },
        config: {
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ]
        }
      });
      setPromptResult(response.text || "No response.");
    } catch (error: any) {
      setPromptResult(`Error: ${error.message}`);
    } finally { setLoading(false); }
  };

  // --- Logic: Studio Generation ---
  const generateStudioImage = async () => {
    if (!base64_1 || !process.env.API_KEY) return;
    setLoading(true);
    setStudioResultImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const parts: any[] = [];
      let finalPrompt = "";
      
      const bgPrompts: Record<string, string> = {
        "zen-stone": "a high-end Zen aesthetic background. Smooth natural stones, a shallow water surface with gentle ripples, and a single elegant flower branch. Soft, serene lighting, beige and earth tones. Composition has negative space (wabi-sabi).",
        "vintage-wood": "a vintage wabi-sabi wooden table surface. Deep rich walnut wood texture, dappled sunlight shadows from plants (gobo effect). Warm, nostalgic, elegant atmosphere. Ancient chinese aesthetic.",
        "textured-paper": "a clean, textured beige paper background with soft, organic curves and subtle plant shadows. Minimalist, elegant, high-key lighting. Modern oriental aesthetic.",
        "oriental": "a new chinese style aesthetic background. Subtle red or gold accents, antique wooden props, soft atmospheric fog. Elegant and sophisticated commercial photography.",
        "nature-sunlight": "an outdoor setting with dappled sunlight through green leaves. Fresh, organic, eco-friendly commercial aesthetic. Shallow depth of field."
      };

      const selectedBg = bgPrompts[backgroundStyle] || "a professional commercial studio setting";

      if (studioType === 'product') {
        finalPrompt = `Generate a photorealistic high-end commercial product image. 
        Input Image 1 is the product. Place this exact product into ${selectedBg}.
        Ensure the lighting matches the product's form. The product must be the clear focus.
        Blend the product naturally with the ground/surface (shadows/reflections).
        Additional context: ${studioPrompt}`;
        
        parts.push({ text: finalPrompt });
        parts.push({ inlineData: { mimeType: file1?.type || "image/png", data: base64_1 } });
      } else {
        // Fashion / Try-On
        finalPrompt = `Generate a photorealistic high-fashion commercial shot.
        Input Image 1 is the person/model. Input Image 2 is the clothing/outfit.
        Task: Create an image of the person from Image 1 wearing the outfit from Image 2.
        Setting: ${selectedBg}.
        Maintain the identity of the person and the texture of the clothing.
        Pose: Professional model pose suitable for the outfit.
        Additional context: ${studioPrompt}`;

        parts.push({ text: finalPrompt });
        parts.push({ inlineData: { mimeType: file1?.type || "image/png", data: base64_1 } });
        if (base64_2) {
          parts.push({ inlineData: { mimeType: file2?.type || "image/png", data: base64_2 } });
        }
      }

      const response = await ai.models.generateContent({
        model: studioModel,
        contents: { parts: parts },
        config: {
           safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
           ]
        }
      });

      // Parse Image Response
      let foundImage = false;
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            setStudioResultImage(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }
      }
      
      if (!foundImage) {
        const text = response.text;
        alert(`Generation complete but no image returned. Model Output: ${text}`);
      }

    } catch (error: any) {
      alert(`Generation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0], slot);
      e.target.value = ''; // Reset value to allow re-uploading the same file
    }
  }

  return (
    <div className="container">
      <div className="top-actions">
        <button className="action-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} 
          {/* Text is optional, icon conveys meaning well */}
        </button>
        <button className="action-btn" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}>
          <Globe size={16} /> {t('lang_btn')}
        </button>
      </div>

      <div className="header">
        <h1><Sparkles size={32} /> {t('title')}</h1>
        <p>{t('subtitle')}</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'prompt' ? 'active' : ''}`}
          onClick={() => setActiveTab('prompt')}
        >
          <Layers size={18} /> {t('tab_prompt')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('studio')}
        >
          <Camera size={18} /> {t('tab_studio')}
        </button>
      </div>

      {activeTab === 'prompt' ? (
        // --- TAB 1: PROMPT EXTRACTOR ---
        <div className="main-grid">
          <div className="card">
            <span className="upload-label">{t('input_image')}</span>
            <div 
              className={`upload-area ${preview1 ? 'has-image' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0], 1); }}
              onClick={() => fileInputRef1.current?.click()}
              onPaste={(e) => handlePaste(e, 1)}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef1.current?.click(); }}
            >
              <input type="file" ref={fileInputRef1} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleInputChange(e, 1)} />
              {preview1 ? <img src={preview1} className="preview-image" alt="Preview" /> : (
                <div className="upload-placeholder"><Upload size={48} /><span>{t('upload_placeholder')}</span></div>
              )}
            </div>
            {preview1 && <button className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); resetImage(1); }}><RefreshCw size={14} /> {t('reset')}</button>}

            <div className="controls">
              <div className="input-group">
                <label>{t('vision_model')}</label>
                <select className="select-input" value={model} onChange={(e) => setModel(e.target.value)}>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
                  <option value="custom">{t('model_custom')}</option>
                </select>
                {model === 'custom' && <input className="text-input" placeholder="Model Name" value={customModel} onChange={(e) => setCustomModel(e.target.value)} />}
              </div>
              <div className="input-group">
                <label>{t('output_format')}</label>
                <select className="select-input" value={promptMode} onChange={(e) => setPromptMode(e.target.value)}>
                  <option value="doubao-jimeng">{t('fmt_doubao')}</option>
                  <option value="midjourney">{t('fmt_mj')}</option>
                  <option value="stable-diffusion">{t('fmt_sd')}</option>
                  <option value="descriptive">{t('fmt_desc')}</option>
                </select>
              </div>
              <button className="btn btn-primary" disabled={!base64_1 || loading} onClick={generatePrompt}>
                {loading ? <Loader2 className="animate-spin" /> : <ImageIcon />} {t('gen_prompt_btn')}
              </button>
            </div>
          </div>

          <div className="card">
             <div className="result-header">
                <label>{t('gen_prompt_label')}</label>
                <div className="result-actions">
                  {promptResult && <button className="btn btn-secondary" onClick={translateToChinese} disabled={translateLoading}><Languages size={14} /> {t('translate_btn')}</button>}
                  {promptResult && <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(promptResult)}><Copy size={14} /> {t('copy_btn')}</button>}
                </div>
             </div>
             <div className="result-area-container">
               {loading ? (
                 <div className="loading-overlay"><Loader2 className="animate-spin" size={32}/><span>{t('analyzing')}</span></div>
               ) : (
                 <textarea className="result-textarea" value={promptResult} onChange={(e) => setPromptResult(e.target.value)} placeholder={t('prompt_placeholder')} />
               )}
             </div>
          </div>
        </div>
      ) : (
        // --- TAB 2: COMMERCIAL STUDIO ---
        <div className="main-grid">
          <div className="card">
             <div className="input-group" style={{flexDirection: 'row', gap: '1rem', marginBottom: '1rem'}}>
                <button 
                  className={`btn ${studioType === 'product' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{flex:1}}
                  onClick={() => setStudioType('product')}
                >
                  <Camera size={16}/> {t('studio_mode_product')}
                </button>
                <button 
                  className={`btn ${studioType === 'fashion' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{flex:1}}
                  onClick={() => setStudioType('fashion')}
                >
                  <Shirt size={16}/> {t('studio_mode_fashion')}
                </button>
             </div>

             <div className="upload-group">
                <div style={{flex: 1}}>
                  <span className="upload-label">{studioType === 'product' ? t('studio_product_label') : t('studio_person_label')}</span>
                  <div 
                    className={`upload-area small ${preview1 ? 'has-image' : ''}`}
                    onClick={() => fileInputRef1.current?.click()}
                    onPaste={(e) => handlePaste(e, 1)}
                    tabIndex={0}
                  >
                    <input type="file" ref={fileInputRef1} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleInputChange(e, 1)} />
                    {preview1 ? <img src={preview1} className="preview-image" /> : (
                      <div className="upload-placeholder"><Upload size={24} /><span>{t('upload_placeholder')}</span></div>
                    )}
                  </div>
                </div>
                
                {studioType === 'fashion' && (
                  <div style={{flex: 1}}>
                    <span className="upload-label">{t('studio_clothing_label')}</span>
                     <div 
                      className={`upload-area small ${preview2 ? 'has-image' : ''}`}
                      onClick={() => fileInputRef2.current?.click()}
                      onPaste={(e) => handlePaste(e, 2)}
                      tabIndex={0}
                    >
                      <input type="file" ref={fileInputRef2} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleInputChange(e, 2)} />
                      {preview2 ? <img src={preview2} className="preview-image" /> : (
                        <div className="upload-placeholder"><Shirt size={24} /><span>{t('upload_placeholder')}</span></div>
                      )}
                    </div>
                  </div>
                )}
             </div>

             <div className="controls" style={{marginTop: '1rem'}}>
                <div className="input-group">
                   <label>{t('bg_atmosphere')}</label>
                   <select className="select-input" value={backgroundStyle} onChange={(e) => setBackgroundStyle(e.target.value)}>
                     <option value="zen-stone">{t('bg_zen_stone')}</option>
                     <option value="vintage-wood">{t('bg_vintage_wood')}</option>
                     <option value="textured-paper">{t('bg_textured_paper')}</option>
                     <option value="oriental">{t('bg_oriental')}</option>
                     <option value="nature-sunlight">{t('bg_nature')}</option>
                   </select>
                </div>

                <div className="input-group">
                  <label>{t('details_label')}</label>
                  <input 
                    className="text-input" 
                    placeholder={t('details_ph')}
                    value={studioPrompt}
                    onChange={(e) => setStudioPrompt(e.target.value)}
                  />
                </div>

                 <div className="input-group">
                   <label>{t('gen_model_label')}</label>
                   <select className="select-input" value={studioModel} onChange={(e) => setStudioModel(e.target.value)}>
                     <option value="gemini-2.5-flash-image">Gemini 2.5 Flash Image</option>
                     <option value="gemini-3-pro-image-preview">Gemini 3 Pro Image</option>
                   </select>
                </div>

                <button 
                  className="btn btn-primary" 
                  disabled={!base64_1 || (studioType === 'fashion' && !base64_2) || loading}
                  onClick={generateStudioImage}
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Wand2 />} 
                  {t('gen_studio_btn')}
                </button>
             </div>
          </div>

          <div className="card">
            <div className="result-header">
               <label>{t('studio_result_label')}</label>
               {studioResultImage && (
                  <a href={studioResultImage} download="studio-generated.png" className="btn btn-secondary" style={{textDecoration:'none'}}>
                    <Download size={14}/> {t('save_btn')}
                  </a>
               )}
            </div>
            <div className="result-area-container">
               {loading ? (
                 <div className="loading-overlay"><Loader2 className="animate-spin" size={40}/><span>{t('generating')}<br/>This may take a few seconds</span></div>
               ) : studioResultImage ? (
                 <div className="result-image-container">
                   <img src={studioResultImage} className="generated-image" alt="Generated Studio Shot" />
                 </div>
               ) : (
                 <div className="loading-overlay" style={{opacity: 0.5}}>
                   <Camera size={48} />
                   <span>{t('studio_waiting')}</span>
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
