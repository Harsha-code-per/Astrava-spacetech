# Asteroid Classification & Mining Potential Engine
**A Papercloudtech Project** | Built for the 24Hr Space Tech Hackathon

## 🚀 Overview
An end-to-end mission control dashboard and machine learning pipeline designed to identify high-yield asteroid mining targets. We classify Near-Earth Objects (NEOs) using spectral data and calculate their economic viability by factoring in orbital mechanics (Delta-v accessibility) and resource composition.

## ⚙️ Tech Stack
* **Frontend:** Next.js, Tailwind CSS, Shadcn UI, Aceternity UI, Recharts
* **Backend:** Python, FastAPI, Pandas
* **Machine Learning:** Scikit-Learn (XGBoost/Random Forest classifier)
* **Data Sources:** NASA JPL Small-Body Database, SMASS Spectral Data

## 🧠 Core Engine
1. **Spectral Classifier:** Ingests asteroid reflectance data to predict taxonomic class (C, S, M).
2. **Economic Valuation:** Estimates total metallic yield based on predicted composition and physical volume.
3. **Accessibility Scoring:** Evaluates orbital elements to determine the fuel cost (Delta-v) required for extraction.