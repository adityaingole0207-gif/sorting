# SortLab: Adaptive Sorting Algorithm Benchmarking & Study Platform

> **Data Structures & Algorithms Laboratory & Interactive Study Platform**  
> **Aesthetic Direction:** Refined Technical Journal & Modern Lab Notebook  
> **Core Engine:** Hand-written C++17 with Web Worker non-blocking execution and WebAssembly support.  
> **Active Localhost Server:** `http://localhost:8080/`

---

## 1. Project Overview & Section Architecture

**SortLab** is an interactive study platform, gamified challenge arena, and empirical benchmarking workbench designed for university students learning Data Structures & Algorithms in C++.

It is organized into **five core sections** accessible from the top navigation:

### 01 // Visualizer (The 3-Step Interactive Workflow)
The visualizer presents three numbered steps on one cohesive screen:
1. **Step 1: Enter Input**:
   - Type custom numbers (comma or space separated, e.g. `45, 12, 89, 3, 27`) with real-time validation and helpful error feedback.
   - Quick preset distribution buttons: **Random**, **Sorted**, **Reverse**, **Nearly sorted**, and **Many duplicates**.
   - Array size slider ($N \in [5, 60]$) with quick generation chips.
   - Interactive array preview displaying in-memory indices `[0], [1], [2]...` and box values.
2. **Step 2: Choose Algorithm (All 10 Core DSA Algorithms)**:
   - Selectable chips for:
     1. **Insertion Sort** ($O(n)$ best, $O(n^2)$ worst, stable, in-place)
     2. **Merge Sort** ($O(n \log n)$ all cases, stable, $O(n)$ space)
     3. **Quick Sort (Med-3)** ($O(n \log n)$ avg, unstable, $O(\log n)$ stack)
     4. **Heap Sort** ($O(n \log n)$ all cases, unstable, $O(1)$ space)
     5. **Adaptive Sort** ($O(n)$ to $O(n \log n)$, Introsort/Run-merge hybrid)
     6. **Bubble Sort** ($O(n)$ best with swapped flag, $O(n^2)$ worst, stable)
     7. **Selection Sort** ($O(n^2)$ comparisons, at most $n-1$ writes/swaps)
     8. **Shell Sort** ($O(n \log^2 n)$ / $O(n^{1.3})$, diminishing gap sequence)
     9. **Counting Sort** ($O(n + k)$ non-comparison distribution, stable)
     10. **Radix Sort (LSD)** ($O(d \cdot (n + b))$ base-10 digit-by-digit passes)
   - Instant one-line conceptual summary and average-case complexity badge.
   - Multi-lane comparison mode toggle for concurrent race execution.
3. **Step 3: Watch and Learn (Visual Workspace + Synchronized Code)**:
   - Primary **Visualize** button, with **Play**, **Pause**, **Next Step**, **Previous Step**, **Restart**, and speed slider.
   - Animated bars displaying their numeric values directly on each bar.
   - Distinct, non-boxy color states: Idle, Comparing (orange), Swapping (bright blue), Pivot/Key (yellow), Sorted (green).
   - **Student Step-by-Step Inspection HUD**:
     - **Phase Badge**: Identifies current loop phase (e.g. `Comparing Keys`, `Swapping Values`, `Partition Benchmark`, `Slot Finalized`).
     - **Action Note**: Immediate, plain-English breakdown of the current operation.
     - **Algorithmic Invariant**: Formal mathematical loop invariant for the current algorithm at this stage.
   - **Algorithm-specific structural helpers**:
     - *Heap Sort*: Interactive **SVG Binary Heap Tree** showing node indices, values, and color states in real time!
     - *Merge Sort*: Recursion split & merge level bounds and auxiliary buffer display.
     - *Quick Sort*: Active pivot element and `[low..high]` partition range indicators.
     - *Adaptive Sort*: Input invariant profiling metrics $\to$ Dispatched strategy $\to$ Theoretical rationale.
   - **Synchronized C++ source code viewer**: The exact C++ line being executed is highlighted in real time, with a one-click toggle to **Pseudocode**.

---

### 02 // Interactive Game Arcade (Learn DSA by Playing)
Gamified learning arena with player XP tracking and level ranks (Novice $\to$ Apprentice $\to$ Strategist $\to$ Master $\to$ Grandmaster):
1. **Mode A: Sort It Yourself (Manual Puzzle)**:
   - Interactive sorting puzzle with 6 shuffled number tiles.
   - Rule enforcement toggles: **Bubble Sort** (adjacent swaps only), **Selection Sort** (find minimum and place), or **Free Puzzle**.
   - Live move counter, comparison counter, par tracking, and star rating system (⭐⭐⭐).
   - "Need a Hint" (highlights inverted pairs) and "Check If Sorted" verification.
   - Awards **+150 XP** upon victory.
2. **Mode B: Algorithm Battle Royale (Bet & Race)**:
   - Choose a dataset scenario (**Reverse**, **Nearly Sorted**, **Duplicates**, **Random**).
   - Wager on your predicted champion (the algorithm that will finish with the lowest runtime and comparison count).
   - Watch 4 parallel race tracks animate live progress bars, comparison counts, and elapsed microseconds.
   - 1st, 2nd, and 3rd place podium with detailed analytical feedback explaining why the winner prevailed.
   - Awards **+100 XP** and builds a win streak (`🔥 1`, `🔥 2`...).
3. **Mode C: Step Predictor Duel (Quick-Fire Invariants)**:
   - 5-round interactive rapid-fire quiz testing invariants, partition pivots, tree child indices, and asymptotic rules.
   - Dynamic combo multiplier (`x1` $\to$ `x2` $\to$ `x3`) and immediate educational feedback.

---

### 03 // Learn (DSA Comprehensive Study Monograph)
Dedicated educational guide for all 10 algorithms:
- **Conceptual summary & Real-life analogy** (e.g. Insertion Sort = sorting playing cards in hand; Merge Sort = splitting exam papers between two TAs).
- **Step-by-step numerical walkthrough** with sample arrays.
- **Full C++ code implementation** with beginner-friendly viva explanations.
- **Complexity reference table** (best, average, worst, auxiliary space, stability, in-place).
- **Advantages, disadvantages, and practical when-to-use guide**.
- **Common viva voce & oral exam questions** (4 per algorithm) with accordion toggles.
- **"Test yourself" mini-quiz** (3 interactive questions per algorithm = 30 total questions) with instant grading and **+25 XP** rewards!

---

### 04 // Compare (Assignment Requirements & Benchmarks)
Addresses the formal university assignment requirements:
> *"Implement merge sort, quicksort, heap sort, insertion sort, and an adaptive sorting approach. Compare execution time, comparisons, memory use, and behavior on sorted data."*
1. **10-Algorithm Benchmark Suite**: Runs all 10 algorithms on the user's input (or custom sizes up to $N = 100,000$), displaying execution time (averaged across 7 runs with standard deviation), comparisons, swaps/moves, auxiliary memory (bytes), recursion depth, correctness verification (`PASS/FAIL`), and efficiency rankings with winner badges (`[FASTEST TIME]`, `[MIN COMPS]`, `[MIN MEMORY]`).
2. **Behavior Analysis Matrix**: 10 Algorithms $\times$ 5 Input Distributions ($N = 200$) grid with color-coded heatmap cells.
3. **Asymptotic Growth Chart (Fig. 1)**: Empirical $T(n)$ vs $n$ scaling curve plotted across $n \in [100, 1\text{k}, 10\text{k}, 50\text{k}]$.
4. **Auto-Generated Empirical Deductions**: Plain-English academic insights explaining why specific algorithms won on the current data distribution.
5. **Data Export**: One-click **Export CSV** and **Copy Lab Report** (formatted Markdown).

---

### 05 // About (Academic Credentials & Architecture)
- Course context: Data Structures & Algorithms Mini-Project.
- Academic project team: Alex Mercer, Priya Sharma, David Chen.
- Technology Architecture: Hand-written C++17 compiled to WebAssembly via Emscripten, non-blocking pure JavaScript Web Worker fallback engine, vanilla HTML5, CSS3, modern Canvas / Chart.js.

---

## 2. Directory Structure

```
sorting/
├── cpp/
│   ├── sorting.cpp            # All 10 C++17 hand-written algorithms, counters, CLI & WASM exports
│   ├── build_wasm.bat         # Windows build script using Emscripten (emcc)
│   ├── build_wasm.sh          # Linux / macOS / WSL build script using Emscripten (emcc)
│   └── build_native.bat       # Native C++ CLI executable compiler (g++, clang++, or cl)
├── web/
│   ├── index.html             # 5-section study platform (01 Viz, 02 Arcade, 03 Learn, 04 Compare, 05 About)
│   ├── style.css              # Soft Editorial Laboratory design, palettes for all 10 algos, arcade CSS
│   ├── app.js                 # Master orchestrator: 10 algorithms, visualizer, arcade game, study monograph
│   └── worker.js              # Background Web Worker engine for non-blocking execution of all 10 algos
├── server/
│   ├── server.js              # Optional Node.js/Express server (serves web & runs native CLI)
│   └── package.json           # Node.js dependencies (express, cors)
├── run_app.bat                # 1-Click launcher to open SortLab in default browser
├── run_server.bat             # 1-Click zero-dependency local HTTP server (PowerShell / Node / Python)
├── setup_git_and_push.bat     # Automated Git repository setup and remote GitHub push helper
├── vercel.json                # Vercel deployment configuration (web directory output)
└── README.md                  # Comprehensive manual, study notes & Viva Voce survival guide
```

---

## 3. Implemented Algorithms & Complexity Ledger

| Algorithm | Best Case | Average Case | Worst Case | Auxiliary Space | Stable? | In-Place? | Key Mechanism |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **Insertion Sort** | $\mathcal{O}(n)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(1)$ | **Yes** | **Yes** | Shifts larger items right into sorted prefix $[0 \dots i-1]$. |
| **Merge Sort** | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n)$ | **Yes** | **No** | Divide-and-conquer; merges sorted halves using auxiliary buffer. |
| **Quick Sort (Med-3)** | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(\log n)$ | **No** | **Yes** | Median-of-three pivot ($A[\text{low}], A[\text{mid}], A[\text{high}]$) + Hoare partition. |
| **Heap Sort** | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n \log n)$ | $\mathcal{O}(1)$ | **No** | **Yes** | $\mathcal{O}(n)$ bottom-up max-heapify + iterative sift-down extraction. |
| **Adaptive Sort** | $\mathcal{O}(n)$ | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n \log n)$ | $\mathcal{O}(\log n)$ | **Varies** | **Yes** | Input profiling $\to$ Reversal / Run-merge / Introsort hybrid. |
| **Bubble Sort** | $\mathcal{O}(n)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(1)$ | **Yes** | **Yes** | Adjacent swaps with swapped boolean flag early exit. |
| **Selection Sort** | $\mathcal{O}(n^2)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(1)$ | **No** | **Yes** | Scans suffix for minimum element; at most $n - 1$ swaps. |
| **Shell Sort** | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n^{1.3})$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(1)$ | **No** | **Yes** | Diminishing gap sequence ($h$-sorting) reducing long-range inversions. |
| **Counting Sort** | $\mathcal{O}(n + k)$ | $\mathcal{O}(n + k)$ | $\mathcal{O}(n + k)$ | $\mathcal{O}(n + k)$ | **Yes** | **No** | Non-comparison frequency tallying with cumulative prefix sums. |
| **Radix Sort (LSD)** | $\mathcal{O}(d \cdot (n + b))$ | $\mathcal{O}(d \cdot (n + b))$ | $\mathcal{O}(d \cdot (n + b))$ | $\mathcal{O}(n + b)$ | **Yes** | **No** | Base-10 digit-by-digit stable Counting Sort passes. |

---

## 4. Deploy to Git & Vercel (Complete Guide)

SortLab is pre-configured with `vercel.json`, `.gitignore`, root `package.json`, and an automated `setup_git_and_push.bat` script.

### Step 1: Initialize Git and Push to GitHub

Double-click **`setup_git_and_push.bat`**, or execute in your terminal:

```bash
# 1. Initialize git
git init
git branch -M main

# 2. Add and commit all files
git add .
git commit -m "feat: complete SortLab adaptive study platform with 10 algorithms and arcade"

# 3. Create a repo on https://github.com/new (named 'sortlab')
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/sortlab.git
git push -u origin main
```

### Step 2: Deploy to Vercel in 30 Seconds

1. Go to [**vercel.com/new**](https://vercel.com/new).
2. Sign in with GitHub and select your **`sortlab`** repository.
3. The included `vercel.json` automatically sets the output directory to `web/` and configures clean URLs and security headers.
4. Click **Deploy**.
5. Your site is live instantly!

---

## 5. Local Build & Execution Modes

### Mode A: Instant Localhost HTTP Server (Active Now)
The local server is already running and accessible at:
👉 **`http://localhost:8080/`**

To launch or restart manually anytime, double-click **`run_server.bat`**.

---

### Mode B: Compile C++ to WebAssembly with Emscripten
To compile `/cpp/sorting.cpp` directly into WebAssembly:
```cmd
cd cpp
build_wasm.bat
```
*(On Linux/macOS: `chmod +x build_wasm.sh && ./build_wasm.sh`)*. This will generate `web/sorting_wasm.js` and `web/sorting_wasm.wasm`.

---

### Mode C: Native C++ Command-Line Executable
```bash
g++ -O2 -std=c++17 cpp/sorting.cpp -o sorting.exe
.\sorting.exe --algo 0 --data "45, 12, 89, 3, 27"
```
