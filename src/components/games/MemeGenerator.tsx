import { useState } from 'react';
import { Laugh, Download, Sparkles } from 'lucide-react';

const memeTemplates = [
  {
    id: 1,
    name: 'Distracted Developer',
    topText: 'Me writing code',
    bottomText: 'Stack Overflow',
  },
  {
    id: 2,
    name: 'Success Kid',
    topText: 'Code compiles',
    bottomText: 'On first try',
  },
  {
    id: 3,
    name: 'Tech Brain',
    topText: 'Learning new framework',
    bottomText: 'Forgetting old framework',
  },
  {
    id: 4,
    name: 'Two Buttons',
    topText: 'Fix the bug',
    bottomText: 'Ship it anyway',
  },
  {
    id: 5,
    name: 'This Is Fine',
    topText: 'Production server down',
    bottomText: "It's fine, everything's fine",
  },
  {
    id: 6,
    name: 'Drake No/Yes',
    topText: 'Reading documentation',
    bottomText: 'Random Stack Overflow answer',
  },
];

type MemeGeneratorProps = {
  onComplete: (score: number, duration: number) => void;
  onClose: () => void;
};

export const MemeGenerator = ({ onComplete, onClose }: MemeGeneratorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState(memeTemplates[0]);
  const [topText, setTopText] = useState(memeTemplates[0].topText);
  const [bottomText, setBottomText] = useState(memeTemplates[0].bottomText);
  const [memesCreated, setMemesCreated] = useState(0);
  const [startTime] = useState(Date.now());

  const handleTemplateChange = (template: typeof memeTemplates[0]) => {
    setSelectedTemplate(template);
    setTopText(template.topText);
    setBottomText(template.bottomText);
  };

  const handleSaveMeme = () => {
    setMemesCreated(memesCreated + 1);
  };

  const handleFinish = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const score = memesCreated * 50;
    onComplete(score, duration);
  };

  const colors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-orange-500',
    'from-indigo-500 to-purple-500',
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Templates</h3>
            </div>

            <div className="space-y-2">
              {memeTemplates.map((template, index) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedTemplate.id === template.id
                      ? 'bg-blue-500/20 border-2 border-blue-500'
                      : 'bg-slate-900/50 border-2 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className={`w-full h-16 bg-gradient-to-br ${colors[index]} rounded-lg mb-2 flex items-center justify-center`}>
                    <span className="text-white font-bold text-xs">MEME</span>
                  </div>
                  <p className="text-sm font-medium text-white">{template.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-4">
            <div className="text-center">
              <Laugh className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm text-slate-400 mb-1">Memes Created</p>
              <p className="text-3xl font-bold text-white">{memesCreated}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-6">Create Your Tech Meme</h3>

            <div className="mb-6">
              <div
                className={`relative w-full aspect-square max-w-md mx-auto bg-gradient-to-br ${
                  colors[memeTemplates.findIndex((t) => t.id === selectedTemplate.id)]
                } rounded-xl p-8 flex flex-col justify-between`}
              >
                <div className="text-center">
                  <p className="text-white font-bold text-2xl sm:text-3xl uppercase drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">
                    {topText}
                  </p>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 bg-slate-900/40 backdrop-blur rounded-full flex items-center justify-center">
                    <span className="text-white/60 font-bold text-xs">IMAGE</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-white font-bold text-2xl sm:text-3xl uppercase drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">
                    {bottomText}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Top Text
                </label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter top text..."
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Bottom Text
                </label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter bottom text..."
                  maxLength={50}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveMeme}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition"
              >
                <Download className="w-5 h-5" />
                Save Meme
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Finish & Submit
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Exit Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
