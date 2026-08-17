import { useState } from "react";
import {
  Palette,
  Check,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";

import "./Themes.css";

const themes = [
  {
    id: "midnight",
    name: "Midnight",
    description: "Premium dark workspace",
    icon: Moon,
  },
  {
    id: "light",
    name: "Light",
    description: "Clean and bright workspace",
    icon: Sun,
  },
  {
    id: "aurora",
    name: "Aurora",
    description: "Modern colorful workspace",
    icon: Sparkles,
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Deep blue productivity",
    icon: Sparkles,
  },
  {
    id: "emerald",
    name: "Emerald",
    description: "Fresh green workspace",
    icon: Sparkles,
  },
  {
    id: "rose",
    name: "Rose",
    description: "Elegant pink workspace",
    icon: Sparkles,
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm orange workspace",
    icon: Sparkles,
  },
  {
    id: "cyber",
    name: "Cyber",
    description: "Futuristic neon workspace",
    icon: Sparkles,
  },
  {
    id: "violet",
    name: "Violet",
    description: "Luxury purple workspace",
    icon: Sparkles,
  },
];

function Themes() {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("taskflow-theme") ||
      "midnight"
  );

  const changeTheme = (theme) => {
    setCurrentTheme(theme);

    localStorage.setItem(
      "taskflow-theme",
      theme
    );

    window.dispatchEvent(
      new CustomEvent("themeChange", {
        detail: theme,
      })
    );
  };

  return (
    <div className="themes-page">

      {/* HEADER */}

      <div className="themes-header">

        <div>
          <span className="themes-label">
            APPEARANCE
          </span>

          <h1>Themes</h1>

          <p>
            Customize the look and feel of
            your TaskFlow workspace.
          </p>
        </div>

        <div className="themes-icon">
          <Palette size={23} />
        </div>

      </div>


      {/* CURRENT THEME */}

      <section className="current-theme-card">

        <div>
          <span>ACTIVE THEME</span>

          <h2>
            {themes.find(
              (theme) =>
                theme.id === currentTheme
            )?.name || "Midnight"}
          </h2>

          <p>
            Your selected theme is saved
            automatically.
          </p>
        </div>

        <div className="active-check">
          <Check size={20} />
        </div>

      </section>


      {/* THEME OPTIONS */}

      <section className="theme-section">

        <div className="section-heading">

          <span>THEME COLLECTION</span>

          <h2>Choose your style</h2>

        </div>


        <div className="theme-grid">

          {themes.map((theme) => {

            const Icon = theme.icon;

            const active =
              currentTheme === theme.id;

            return (
              <button
                key={theme.id}
                type="button"
                className={`theme-card ${
                  active ? "active" : ""
                } ${theme.id}`}
                onClick={() =>
                  changeTheme(theme.id)
                }
              >

                <div className="theme-preview">

                  <div className="preview-top" />

                  <div className="preview-content">

                    <div className="preview-line long" />
                    <div className="preview-line" />

                    <div className="preview-boxes">
                      <div />
                      <div />
                      <div />
                    </div>

                  </div>

                </div>


                <div className="theme-info">

                  <div className="theme-name">

                    <Icon size={17} />

                    <strong>
                      {theme.name}
                    </strong>

                  </div>

                  <p>
                    {theme.description}
                  </p>

                </div>


                {active && (
                  <div className="theme-selected">
                    <Check size={14} />
                  </div>
                )}

              </button>
            );
          })}

        </div>

      </section>

    </div>
  );
}

export default Themes;