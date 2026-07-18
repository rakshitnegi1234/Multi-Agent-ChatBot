import {
  Code2,
  Copy,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearArtifact, setArtifactOpen } from "../Redux/artifactSlice";

function ActiveArtifact({ activeArtifact }) {
  const [activeTab, setActiveTab] = useState("preview");
  const [activeFile, setActiveFile] = useState("html");
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const codeFiles = useMemo(() => {
    const files = activeArtifact.files || {};
    const entries = [
      {
        id: "html",
        label: "HTML",
        language: "html",
        code: files.html,
      },
      {
        id: "css",
        label: "CSS",
        language: "css",
        code: files.css,
      },
      {
        id: "js",
        label: "JS",
        language: "javascript",
        code: files.js,
      },
    ].filter((file) => String(file.code || "").trim());

    return entries.length
      ? entries
      : [
          {
            id: "html",
            label: "HTML",
            language: activeArtifact.language || "html",
            code: activeArtifact.code,
          },
        ];
  }, [activeArtifact]);
  const selectedCodeFile =
    codeFiles.find((file) => file.id === activeFile) || codeFiles[0];

  const handleCopy = async () => {
    if (!selectedCodeFile?.code) return;

    await navigator.clipboard.writeText(selectedCodeFile.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const handleClear = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(
      clearArtifact({
        conversationId: selectedConversation?._id,
        dismissedAt: Date.now(),
      }),
    );
  };

  return (
    <>
      <div className="flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#10131a]/80 px-5">
        <div className="min-w-0">
          <h2 className="truncate text-[14px] font-semibold tracking-tight text-slate-100">
            {activeArtifact.title}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-600">
            {activeArtifact.language}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-transparent text-slate-500 transition-colors duration-150 hover:border-rose-400/20 hover:bg-rose-400/10 hover:text-rose-200"
            onClick={handleClear}
            title="Clear artifact"
            type="button"
          >
            <X size={15} />
          </button>
          <button
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-slate-600 transition-colors duration-150 hover:bg-white/[0.07] hover:text-slate-300"
            onClick={() => dispatch(setArtifactOpen(false))}
            title="Close artifacts"
          >
            <PanelRightClose size={16} />
          </button>
        </div>
      </div>

      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-white/[0.06] px-4">
        <button
          className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors duration-150 ${
            activeTab === "preview"
              ? "bg-cyan-400/10 text-cyan-200"
              : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          <Eye size={13} />
          Preview
        </button>
        <button
          className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors duration-150 ${
            activeTab === "code"
              ? "bg-cyan-400/10 text-cyan-200"
              : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"
          }`}
          onClick={() => setActiveTab("code")}
        >
          <Code2 size={13} />
          Code
        </button>
      </div>

      <div className="min-h-0 flex-1 bg-[#0d0f14]">
        {activeTab === "preview" ? (
          <div className="h-full bg-[#eef2f7] p-4">
            <iframe
              className="h-full w-full rounded-lg border border-slate-200 bg-white shadow-2xl shadow-black/10"
              title={activeArtifact.title}
              srcDoc={activeArtifact.preview}
            />
          </div>
        ) : (
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex min-h-10 shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] bg-[#090b10] px-3 py-2">
              <div className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {codeFiles.map((file) => {
                  const isActive = selectedCodeFile?.id === file.id;

                  return (
                    <button
                      key={file.id}
                      type="button"
                      onClick={() => setActiveFile(file.id)}
                      className={`h-7 cursor-pointer rounded-lg px-3 text-[11px] font-semibold transition-colors duration-150 ${
                        isActive
                          ? "bg-cyan-400/10 text-cyan-200"
                          : "text-slate-500 hover:bg-white/[0.06] hover:text-slate-300"
                      }`}
                    >
                      {file.label}
                    </button>
                  );
                })}
              </div>
              <button
                className="inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-[11px] font-medium text-slate-500 transition-colors duration-150 hover:bg-white/[0.06] hover:text-slate-200"
                onClick={handleCopy}
                type="button"
              >
                <Copy size={12} />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="min-h-0 flex-1 overflow-auto p-4 font-mono text-[12px] leading-5 text-slate-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <code>{selectedCodeFile?.code}</code>
            </pre>
          </div>
        )}
      </div>
    </>
  );
}

function Artifacts() {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { activeArtifact, activeConversationId, isOpen } = useSelector(
    (state) => state.artifact,
  );
  const visibleArtifact =
    selectedConversation?._id &&
    activeConversationId === selectedConversation._id
      ? activeArtifact
      : null;

  if (!isOpen) {
    if (!visibleArtifact) return null;

    return (
      <button
        className="fixed bottom-24 right-4 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-cyan-400/20 bg-[#151821] text-cyan-200 shadow-xl shadow-black/40 transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/[0.07] hover:text-white active:scale-95 xl:bottom-auto xl:top-22"
        onClick={() => dispatch(setArtifactOpen(true))}
        title="Open artifacts"
      >
        <PanelRightOpen size={17} />
      </button>
    );
  }

  return (
    <>
      {visibleArtifact && (
        <button
          aria-label="Close artifacts"
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm xl:hidden"
          onClick={() => dispatch(setArtifactOpen(false))}
          type="button"
        />
      )}
      <aside
        className={`artifact-panel fixed inset-y-3 right-3 z-50 flex h-[calc(100dvh_-_24px)] w-[min(430px,calc(100vw_-_24px))] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0d12]/96 shadow-2xl shadow-black/50 backdrop-blur-xl transition-all duration-200 ease-out xl:static xl:z-auto xl:h-auto xl:w-[430px] xl:rounded-none xl:border-y-0 xl:border-r-0 xl:shadow-none ${
          visibleArtifact
            ? "translate-x-0 opacity-100"
            : "pointer-events-none hidden translate-x-[calc(100%+24px)] opacity-0 xl:pointer-events-auto xl:flex xl:translate-x-0 xl:opacity-100"
        }`}
      >
        {visibleArtifact ? (
          <ActiveArtifact
            key={`${activeConversationId}-${visibleArtifact.title}-${
              visibleArtifact.code?.length || 0
            }`}
            activeArtifact={visibleArtifact}
          />
        ) : (
          <>
            <div className="flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#10131a]/80 px-5">
              <div className="min-w-0">
                <h2 className="truncate text-[14px] font-semibold tracking-tight text-slate-100">
                  Artifacts
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-600">empty</p>
              </div>
              <button
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-slate-600 transition-colors duration-150 hover:bg-white/[0.07] hover:text-slate-300"
                onClick={() => dispatch(setArtifactOpen(false))}
                title="Close artifacts"
              >
                <PanelRightClose size={16} />
              </button>
            </div>

            <div className="flex flex-1 items-center justify-center px-6 text-center">
              <div className="w-full max-w-[280px]">
                <div className="artifact-float relative mx-auto mb-6 h-[132px] w-[200px]">
                  <div className="absolute left-0 top-5 h-[92px] w-[164px] rounded-2xl border border-white/[0.08] bg-white/[0.035] shadow-2xl shadow-black/30" />
                  <div className="absolute right-0 top-0 h-[106px] w-[170px] overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#101923] shadow-[0_0_42px_rgba(34,211,238,0.10)]">
                    <div className="flex h-7 items-center gap-1.5 border-b border-white/[0.07] px-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-300/70" />
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-300/70" />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/70" />
                    </div>
                    <div className="grid grid-cols-[44px_1fr] gap-2 p-3">
                      <div className="h-14 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.07]" />
                      <div className="space-y-2">
                        <div className="h-2 rounded-full bg-slate-500/35" />
                        <div className="h-2 rounded-full bg-slate-600/25" />
                        <div className="h-6 rounded-lg border border-white/[0.06] bg-white/[0.04]" />
                      </div>
                    </div>
                  </div>
                  <div className="artifact-glow absolute bottom-0 left-1/2 grid h-14 w-14 -translate-x-1/2 place-items-center rounded-2xl border border-cyan-300/25 bg-[#08222a] text-cyan-200">
                    <Sparkles size={20} />
                  </div>
                </div>

                <p className="text-[14px] font-semibold text-slate-200">
                  No artifact selected
                </p>
                <p className="mx-auto mt-2 max-w-[220px] text-[12px] leading-relaxed text-slate-600">
                  Generated code previews will appear here.
                </p>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default Artifacts;
