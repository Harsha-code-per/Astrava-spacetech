"""
generate_labels.py
──────────────────
Unsupervised spectral classification of Near-Earth Asteroids.

Pipeline
--------
1. Load asteroid.csv
2. Filter to NEOs (neo == 'Y')
3. Drop rows missing `albedo` or `diameter`
4. K-Means cluster on albedo (k=3)
5. Map clusters → spectral classes by ascending albedo centroid:
       lowest  → C (Carbonaceous, dark)
       middle  → S (Silicaceous, moderate)
       highest → M (Metallic, bright)
6. Save asteroid_labeled.csv
"""

import sys
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# ── 1. Load ──────────────────────────────────────────────────────────────────
CSV_IN  = "asteroid.csv"
CSV_OUT = "asteroid_labeled.csv"

print("=" * 60)
print("  SPECTRAVEIN · Asteroid Spectral Classifier")
print("=" * 60)

df_raw = pd.read_csv(CSV_IN)
print(f"\n[LOAD]    {len(df_raw):,} total records loaded from '{CSV_IN}'")

# ── 2. Filter Near-Earth Objects ─────────────────────────────────────────────
df_neo = df_raw[df_raw["neo"].str.strip().str.upper() == "Y"].copy()
print(f"[FILTER]  {len(df_neo):,} Near-Earth Objects (neo == 'Y')")

# ── 3. Drop rows missing albedo or diameter ───────────────────────────────────
df_clean = df_neo.dropna(subset=["albedo", "diameter"]).copy()
dropped = len(df_neo) - len(df_clean)
print(f"[CLEAN]   {dropped:,} rows dropped (missing albedo/diameter)")
print(f"[CLEAN]   {len(df_clean):,} rows retained for clustering")

if len(df_clean) < 3:
    sys.exit("[ERROR] Not enough rows to form 3 clusters. Exiting.")

# ── 4. K-Means clustering on albedo ──────────────────────────────────────────
X = df_clean[["albedo"]].values          # shape (n, 1)

kmeans = KMeans(
    n_clusters=3,
    init="k-means++",                   # smarter centroid seeding
    n_init=20,                          # 20 independent runs → pick best inertia
    random_state=42,
)
df_clean["_cluster"] = kmeans.fit_predict(X)

centroids = kmeans.cluster_centers_.flatten()   # one centroid per cluster
print(f"\n[KMEANS]  Centroids (albedo):")
for cid, cval in enumerate(centroids):
    print(f"            Cluster {cid}: albedo = {cval:.4f}")

# ── 5. Map clusters to spectral classes by centroid rank ─────────────────────
# argsort gives cluster IDs sorted ascending by centroid value
sorted_cluster_ids = np.argsort(centroids)     # [low_id, mid_id, high_id]

spectral_map = {
    sorted_cluster_ids[0]: "C",   # lowest  albedo → Carbonaceous
    sorted_cluster_ids[1]: "S",   # middle  albedo → Silicaceous
    sorted_cluster_ids[2]: "M",   # highest albedo → Metallic
}

print(f"\n[MAP]     Cluster → Spectral Class:")
class_labels = {cls: centroids[cid] for cid, cls in spectral_map.items()}
for cls in ["C", "S", "M"]:
    cid = sorted_cluster_ids[["C", "S", "M"].index(cls)]
    print(f"            {cls}: Cluster {cid}  (centroid albedo = {centroids[cid]:.4f})")

df_clean["spectral_class"] = df_clean["_cluster"].map(spectral_map)

# ── 6. Clean up temp column and save ─────────────────────────────────────────
df_out = df_clean.drop(columns=["_cluster"])
df_out.to_csv(CSV_OUT, index=False)

# ── 7. Report ─────────────────────────────────────────────────────────────────
print(f"\n[SAVE]    Labeled dataset written to '{CSV_OUT}'  ({len(df_out):,} rows)")

counts = df_out["spectral_class"].value_counts().sort_index()
print("\n[RESULT]  Spectral Class Distribution:")
print("-" * 38)
for cls, count in counts.items():
    bar   = "█" * int(count / counts.max() * 30)
    pct   = count / counts.sum() * 100
    label = {"C": "Carbonaceous", "S": "Silicaceous", "M": "Metallic"}[cls]
    print(f"  {cls} ({label:<14}) {count:>5,}  {pct:5.1f}%  {bar}")

print("-" * 38)
print(f"  {'TOTAL':<20} {counts.sum():>5,}  100.0%")
print("\n[DONE]    ✓ Classification complete.\n")
