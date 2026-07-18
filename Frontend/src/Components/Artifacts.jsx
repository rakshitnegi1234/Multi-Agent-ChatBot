import { Code2, Eye, PanelRightClose, PanelRightOpen, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearArtifact, setArtifactOpen } from "../Redux/artifactSlice";

function Artifacts() {
  const [activeTab, setActiveTab] = useState("preview");
  const dispatch = useDispatch();
  const { activeArtifact, isOpen } = useSelector((state) => state.artifact);

  if (!isOpen) {
    return (
      <button
        className="fixed right-3 top-20 z-40 hidden h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#151821] text-slate-400 shadow-xl shadow-black/30 transition-colors duration-150 hover:bg-white/[0.07] hover:text-slate-100 xl:flex"
        onClick={() => dispatch(setArtifactOpen(true))}
        title="Open artifacts"
      >
        <PanelRightOpen size={17} />
      </button>
    );
  }

  return (
    <aside className="hidden w-[430px] shrink-0 border-l border-white/[0.06] bg-[#0b0d12] xl:flex xl:flex-col">
      <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
        <div className="min-w-0">
          <h2 className="truncate text-[14px] font-semibold tracking-tight text-slate-100">
            {activeArtifact?.title || "Artifacts"}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-600">
            {activeArtifact ? activeArtifact.language : "empty"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {activeArtifact && (
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg border-none bg-transparent text-slate-600 transition-colors duration-150 hover:bg-white/[0.07] hover:text-slate-300"
              onClick={() => dispatch(clearArtifact())}
              title="Clear artifact"
            >
              <X size={15} />
            </button>
          )}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg border-none bg-transparent text-slate-600 transition-colors duration-150 hover:bg-white/[0.07] hover:text-slate-300"
            onClick={() => dispatch(setArtifactOpen(false))}
            title="Close artifacts"
          >
            <PanelRightClose size={16} />
          </button>
        </div>
      </div>

      {activeArtifact ? (
        <>
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-white/[0.06] px-4">
            <button
              className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors duration-150 ${
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
              className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors duration-150 ${
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
              <iframe
                className="h-full w-full border-0 bg-white"
                title={activeArtifact.title}
                sandbox="allow-scripts"
                srcDoc={activeArtifact.preview}
              />
            ) : (
              <pre className="h-full overflow-auto p-4 text-[12px] leading-5 text-slate-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <code>{activeArtifact.code}</code>
              </pre>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <div className="max-w-[230px]">
            <p className="text-[13px] font-medium text-slate-400">
              Generated code and previews will appear here.
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-600">
              Ask the coding agent to build an app to open a previewable artifact.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Artifacts;
