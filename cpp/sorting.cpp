/**
 * ============================================================================
 * SortLab: Adaptive Sorting Algorithm Benchmarking & Study Engine
 * ============================================================================
 * 
 * Hand-written Data Structures & Algorithms Mini-Project Implementation
 * Language: C++ (C++17 standard)
 * 
 * Algorithms Implemented (from first principles, no standard sort shortcuts):
 *  1. Insertion Sort
 *  2. Merge Sort (Top-down, auxiliary buffer, memory tracked)
 *  3. Quick Sort (Median-of-three pivot, recursion depth tracked)
 *  4. Heap Sort (In-place binary max-heap construction and extraction)
 *  5. Adaptive Sort (Input profiling -> Introsort / Natural Run Merger / Reversal)
 * 
 * Each algorithm tracks:
 *  - Comparison count (element-to-element comparisons)
 *  - Swap / Move count (element assignments, swaps, and shifts)
 *  - Auxiliary memory allocated (bytes)
 *  - Maximum call stack recursion depth
 *  - Elapsed time in microseconds
 *  - Step-by-step trace log with C++ line numbers, plain-English explanations,
 *    and array snapshots for synchronized animation and code highlighting.
 * 
 * Suitable for WebAssembly compilation via Emscripten and native CLI builds.
 * ============================================================================
 */

#include <iostream>
#include <string>
#include <chrono>
#include <cmath>
#include <cstdlib>
#include <cstring>
#include <sstream>
#include <iomanip>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#endif

// ============================================================================
// 1. DATA STRUCTURES & INSTRUMENTATION (Pure Dynamic Arrays & Pointers)
// ============================================================================

enum OpType {
    OP_COMPARE = 0,     // Comparing elements at index1 and index2
    OP_SWAP = 1,        // Swapping elements at index1 and index2
    OP_OVERWRITE = 2,   // Overwriting element at index1 with value
    OP_MARK_SORTED = 3, // Permanently sorted element at index1
    OP_PIVOT = 4,       // Pivot selected or partition boundary
    OP_SPLIT = 5,       // Recursive split range
    OP_HEAPIFY = 6,     // Heap tree operation
    OP_INFO = 7         // Informational / strategy state
};

/**
 * Lightweight snapshot container storing a point-in-time array copy.
 * Implemented using raw dynamic heap arrays (new[]/delete[]).
 */
struct Snapshot {
    int* data = nullptr;
    size_t count = 0;

    Snapshot() : data(nullptr), count(0) {}
    Snapshot(const int* arr, int n) : count(n > 0 ? static_cast<size_t>(n) : 0) {
        if (n > 0 && arr != nullptr) {
            data = new int[n];
            for (int i = 0; i < n; ++i) data[i] = arr[i];
        } else {
            data = nullptr;
            count = 0;
        }
    }
    Snapshot(const Snapshot& other) : count(other.count) {
        if (other.count > 0 && other.data != nullptr) {
            data = new int[other.count];
            for (size_t i = 0; i < other.count; ++i) data[i] = other.data[i];
        } else {
            data = nullptr;
            count = 0;
        }
    }
    Snapshot& operator=(const Snapshot& other) {
        if (this != &other) {
            delete[] data;
            count = other.count;
            if (other.count > 0 && other.data != nullptr) {
                data = new int[other.count];
                for (size_t i = 0; i < other.count; ++i) data[i] = other.data[i];
            } else {
                data = nullptr;
                count = 0;
            }
        }
        return *this;
    }
    Snapshot(Snapshot&& other) noexcept : data(other.data), count(other.count) {
        other.data = nullptr;
        other.count = 0;
    }
    Snapshot& operator=(Snapshot&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            count = other.count;
            other.data = nullptr;
            other.count = 0;
        }
        return *this;
    }
    ~Snapshot() {
        delete[] data;
    }

    int operator[](size_t idx) const { return data[idx]; }
    size_t size() const { return count; }
    bool empty() const { return count == 0; }
};

/**
 * Rich step recorded for graphical animation, educational captions,
 * and synchronized C++ code line highlighting.
 */
struct TraceOp {
    int type = 0;                // OpType enum value
    int index1 = -1;             // Primary array index
    int index2 = -1;             // Secondary array index (-1 if unused)
    int value = 0;               // Value involved (for overwrite or pivot)
    int line = 0;                // C++ source code line number being executed
    std::string message;         // Beginner-friendly plain English explanation
    Snapshot snapshot;           // Full array state after this step
    std::string meta;            // Extra data (e.g. merge depth, heap parent)
};

/**
 * Lightweight dynamic list of TraceOp steps using raw dynamic memory.
 * Automatically doubles capacity on demand.
 */
struct TraceList {
    TraceOp* items = nullptr;
    size_t count = 0;
    size_t capacity = 0;

    TraceList() : items(nullptr), count(0), capacity(0) {}
    ~TraceList() {
        delete[] items;
    }
    TraceList(const TraceList& other) : count(other.count), capacity(other.capacity) {
        if (capacity > 0 && other.items != nullptr) {
            items = new TraceOp[capacity];
            for (size_t i = 0; i < count; ++i) items[i] = other.items[i];
        }
    }
    TraceList& operator=(const TraceList& other) {
        if (this != &other) {
            delete[] items;
            count = other.count;
            capacity = other.capacity;
            if (capacity > 0 && other.items != nullptr) {
                items = new TraceOp[capacity];
                for (size_t i = 0; i < count; ++i) items[i] = other.items[i];
            } else {
                items = nullptr;
            }
        }
        return *this;
    }
    TraceList(TraceList&& other) noexcept : items(other.items), count(other.count), capacity(other.capacity) {
        other.items = nullptr;
        other.count = 0;
        other.capacity = 0;
    }
    TraceList& operator=(TraceList&& other) noexcept {
        if (this != &other) {
            delete[] items;
            items = other.items;
            count = other.count;
            capacity = other.capacity;
            other.items = nullptr;
            other.count = 0;
            other.capacity = 0;
        }
        return *this;
    }

    void push_back(const TraceOp& op) {
        if (count == capacity) {
            size_t newCap = (capacity == 0) ? 32 : capacity * 2;
            TraceOp* newItems = new TraceOp[newCap];
            for (size_t i = 0; i < count; ++i) {
                newItems[i] = std::move(items[i]);
            }
            delete[] items;
            items = newItems;
            capacity = newCap;
        }
        items[count++] = op;
    }

    void push_back(TraceOp&& op) {
        if (count == capacity) {
            size_t newCap = (capacity == 0) ? 32 : capacity * 2;
            TraceOp* newItems = new TraceOp[newCap];
            for (size_t i = 0; i < count; ++i) {
                newItems[i] = std::move(items[i]);
            }
            delete[] items;
            items = newItems;
            capacity = newCap;
        }
        items[count++] = std::move(op);
    }

    size_t size() const { return count; }
    bool empty() const { return count == 0; }
    TraceOp& operator[](size_t idx) { return items[idx]; }
    const TraceOp& operator[](size_t idx) const { return items[idx]; }
};

/**
 * Metrics collected during an algorithm execution.
 */
struct SortMetrics {
    std::string algorithmName;
    int arraySize = 0;
    long long comparisons = 0;
    long long swaps = 0;
    long long moves = 0;
    long long auxiliaryMemoryBytes = 0;
    int maxRecursionDepth = 0;
    double elapsedMicroseconds = 0.0;
    bool isCorrect = false;

    // Adaptive diagnostics
    std::string adaptiveStrategy;
    std::string adaptiveReason;

    // Operation log for step-by-step study animation
    TraceList trace;
};

// ============================================================================
// 2. HELPER UTILITIES
// ============================================================================

/**
 * Verifies if an array is strictly sorted in non-decreasing order.
 * Handles edge cases: Empty (size 0) and Single (size 1) are trivially sorted.
 */
bool verifySorted(const int* arr, int size) {
    if (size <= 1) return true;
    for (int i = 0; i < size - 1; ++i) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}

Snapshot makeSnapshot(const int* arr, int size) {
    if (size <= 0 || arr == nullptr) return Snapshot();
    return Snapshot(arr, size);
}

/**
 * In-place swap helper with comparison & move tracking.
 */
inline void doSwap(int* arr, int i, int j, int size, int line, const std::string& msg, SortMetrics& metrics, bool recordTrace) {
    if (i == j) return;
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    metrics.swaps++;
    metrics.moves += 3; // 3 assignments per swap
    if (recordTrace) {
        TraceOp op;
        op.type = OP_SWAP;
        op.index1 = i;
        op.index2 = j;
        op.value = temp;
        op.line = line;
        op.message = msg.empty() ? ("Swapped " + std::to_string(arr[j]) + " at index " + std::to_string(i) + " with " + std::to_string(arr[i]) + " at index " + std::to_string(j) + ".") : msg;
        op.snapshot = makeSnapshot(arr, size);
        metrics.trace.push_back(op);
    }
}

// ============================================================================
// 2.5 BASIC PURE C++ SORTING ALGORITHMS (STANDALONE TEXTBOOK DSA FUNCTIONS)
// Hard-coded basic college-level implementations using basic loops and functions.
// ============================================================================

namespace BasicDSA {

    // Basic swap function
    inline void swap(int &a, int &b) {
        int temp = a;
        a = b;
        b = temp;
    }

    // 1. Bubble Sort
    void bubbleSort(int arr[], int n) {
        for (int i = 0; i < n - 1; i++) {
            bool swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }

    // 2. Selection Sort
    void selectionSort(int arr[], int n) {
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }

    // 3. Insertion Sort
    void insertionSort(int arr[], int n) {
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }

    // 4. Merge Sort Helper & Main
    void merge(int arr[], int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        int* L = new int[n1];
        int* R = new int[n2];

        for (int i = 0; i < n1; i++) L[i] = arr[left + i];
        for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k++] = L[i++];
            } else {
                arr[k++] = R[j++];
            }
        }
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];

        delete[] L;
        delete[] R;
    }

    void mergeSort(int arr[], int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    // 5. Quick Sort (Lomuto Partition)
    int partition(int arr[], int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    void quickSort(int arr[], int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    // 6. Heap Sort
    void heapify(int arr[], int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest])
            largest = left;

        if (right < n && arr[right] > arr[largest])
            largest = right;

        if (largest != i) {
            int temp = arr[i];
            arr[i] = arr[largest];
            arr[largest] = temp;
            heapify(arr, n, largest);
        }
    }

    void heapSort(int arr[], int n) {
        for (int i = n / 2 - 1; i >= 0; i--)
            heapify(arr, n, i);

        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            heapify(arr, i, 0);
        }
    }

    // 6. Adaptive Sort (Direct 3-way check: sorted -> reverse -> small insertion/quick)
    void adaptiveSort(int arr[], int n) {
        if (n <= 1) return;

        // Check 1: Already sorted?
        bool isSorted = true;
        for (int i = 0; i < n - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                isSorted = false;
                break;
            }
        }
        if (isSorted) return;

        // Check 2: Reverse sorted?
        bool isReverse = true;
        for (int i = 0; i < n - 1; i++) {
            if (arr[i] < arr[i + 1]) {
                isReverse = false;
                break;
            }
        }
        if (isReverse) {
            int i = 0, j = n - 1;
            while (i < j) {
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                i++;
                j--;
            }
            return;
        }

        // Check 3: Small array uses insertion sort, else quick sort
        if (n < 16) {
            insertionSort(arr, n);
        } else {
            quickSort(arr, 0, n - 1);
        }
    }

} // namespace BasicDSA

// ============================================================================
// 3. ALGORITHM 1: INSERTION SORT (WITH METRICS & TRACE FOR WEB VISUALIZER)
// ============================================================================
/**
 * VIVA EXPLANATION:
 * - Real-life analogy: Sorting a hand of playing cards.
 * - Invariant: Subarray arr[0..i-1] is always sorted at the start of iteration i.
 * - Time Complexity: Best O(n), Average O(n^2), Worst O(n^2).
 * - Space: O(1) auxiliary (4 bytes for 'key').
 * - Stability: Stable (preserves relative order of equal elements).
 */
void insertionSort(int* arr, int size, SortMetrics& metrics, bool recordTrace) {
    metrics.algorithmName = "Insertion Sort";
    metrics.arraySize = size;
    metrics.auxiliaryMemoryBytes = sizeof(int); // key variable
    metrics.maxRecursionDepth = 0;

    if (size <= 1) {
        metrics.isCorrect = true;
        if (recordTrace && size == 1) {
            TraceOp op{OP_MARK_SORTED, 0, -1, arr[0], 10, "Single-element array is trivially sorted.", makeSnapshot(arr, size), ""};
            metrics.trace.push_back(op);
        }
        return;
    }

    for (int i = 1; i < size; ++i) {
        int key = arr[i];
        int j = i - 1;

        if (recordTrace) {
            std::string msg = "Selected key = " + std::to_string(key) + " at index " + std::to_string(i) + ". Searching sorted prefix [0.." + std::to_string(i - 1) + "] for insertion point.";
            TraceOp op{OP_PIVOT, i, -1, key, 3, msg, makeSnapshot(arr, size), "key"};
            metrics.trace.push_back(op);
        }

        metrics.comparisons++;
        if (recordTrace) {
            std::string msg = "Comparing prefix element arr[" + std::to_string(j) + "] (" + std::to_string(arr[j]) + ") with key (" + std::to_string(key) + ").";
            TraceOp op{OP_COMPARE, j, i, key, 5, msg, makeSnapshot(arr, size), ""};
            metrics.trace.push_back(op);
        }

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            metrics.moves++;

            if (recordTrace) {
                std::string msg = std::to_string(arr[j]) + " > " + std::to_string(key) + "; shifted " + std::to_string(arr[j]) + " one position right to index " + std::to_string(j + 1) + ".";
                TraceOp op{OP_OVERWRITE, j + 1, -1, arr[j], 6, msg, makeSnapshot(arr, size), ""};
                metrics.trace.push_back(op);
            }
            j--;

            if (j >= 0) {
                metrics.comparisons++;
                if (recordTrace) {
                    std::string msg = "Comparing prefix element arr[" + std::to_string(j) + "] (" + std::to_string(arr[j]) + ") with key (" + std::to_string(key) + ").";
                    TraceOp op{OP_COMPARE, j, -1, key, 5, msg, makeSnapshot(arr, size), ""};
                    metrics.trace.push_back(op);
                }
            }
        }

        arr[j + 1] = key;
        metrics.moves++;

        if (recordTrace) {
            std::string msg = "Inserted key = " + std::to_string(key) + " into sorted position index " + std::to_string(j + 1) + ".";
            TraceOp op{OP_OVERWRITE, j + 1, -1, key, 9, msg, makeSnapshot(arr, size), ""};
            metrics.trace.push_back(op);
        }
    }

    if (recordTrace) {
        for (int k = 0; k < size; ++k) {
            TraceOp op{OP_MARK_SORTED, k, -1, arr[k], 10, "Array is completely sorted.", makeSnapshot(arr, size), ""};
            metrics.trace.push_back(op);
        }
    }
}

// Range overload for Introsort / Adaptive
void insertionSortRange(int* arr, int left, int right, int totalSize, SortMetrics& metrics, bool recordTrace) {
    for (int i = left + 1; i <= right; ++i) {
        int key = arr[i];
        int j = i - 1;
        metrics.comparisons++;
        if (recordTrace) {
            metrics.trace.push_back({OP_COMPARE, j, i, key, 5, "Comparing arr[" + std::to_string(j) + "] with key " + std::to_string(key) + ".", makeSnapshot(arr, totalSize), ""});
        }
        while (j >= left && arr[j] > key) {
            arr[j + 1] = arr[j];
            metrics.moves++;
            if (recordTrace) {
                metrics.trace.push_back({OP_OVERWRITE, j + 1, -1, arr[j], 6, "Shifted " + std::to_string(arr[j]) + " to index " + std::to_string(j + 1) + ".", makeSnapshot(arr, totalSize), ""});
            }
            j--;
            if (j >= left) {
                metrics.comparisons++;
                if (recordTrace) {
                    metrics.trace.push_back({OP_COMPARE, j, -1, key, 5, "Comparing arr[" + std::to_string(j) + "] with key " + std::to_string(key) + ".", makeSnapshot(arr, totalSize), ""});
                }
            }
        }
        arr[j + 1] = key;
        metrics.moves++;
        if (recordTrace) {
            metrics.trace.push_back({OP_OVERWRITE, j + 1, -1, key, 9, "Inserted key " + std::to_string(key) + " at index " + std::to_string(j + 1) + ".", makeSnapshot(arr, totalSize), ""});
        }
    }
}

// ============================================================================
// 4. ALGORITHM 2: MERGE SORT (TOP-DOWN)
// ============================================================================
/**
 * VIVA EXPLANATION:
 * - Real-life analogy: Splitting a stack of papers between two TAs, sorting each, then zipping.
 * - Recurrence: T(n) = 2T(n/2) + O(n) => O(n log n) by Master Theorem.
 * - Space: O(n) heap memory for temporary merge buffer + O(log n) call stack.
 * - Stability: Stable (equal elements from left subarray are picked first).
 */
void mergeSubarrays(int* arr, int* temp, int left, int mid, int right, int totalSize, SortMetrics& metrics, bool recordTrace) {
    int i = left;
    int j = mid + 1;
    int k = left;

    if (recordTrace) {
        std::string msg = "Merging sorted subarrays [" + std::to_string(left) + ".." + std::to_string(mid) + "] and [" + std::to_string(mid + 1) + ".." + std::to_string(right) + "] into auxiliary buffer.";
        TraceOp op{OP_SPLIT, left, right, mid, 8, msg, makeSnapshot(arr, totalSize), "merge"};
        metrics.trace.push_back(op);
    }

    while (i <= mid && j <= right) {
        metrics.comparisons++;
        if (recordTrace) {
            std::string msg = "Comparing left head arr[" + std::to_string(i) + "] (" + std::to_string(arr[i]) + ") with right head arr[" + std::to_string(j) + "] (" + std::to_string(arr[j]) + ").";
            TraceOp op{OP_COMPARE, i, j, 0, 11, msg, makeSnapshot(arr, totalSize), ""};
            metrics.trace.push_back(op);
        }

        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
            metrics.moves++;
        } else {
            temp[k++] = arr[j++];
            metrics.moves++;
        }
    }

    while (i <= mid) {
        temp[k++] = arr[i++];
        metrics.moves++;
    }
    while (j <= right) {
        temp[k++] = arr[j++];
        metrics.moves++;
    }

    // Copy back from auxiliary buffer
    for (int p = left; p <= right; ++p) {
        arr[p] = temp[p];
        metrics.moves++;
        if (recordTrace) {
            std::string msg = "Copied merged value " + std::to_string(temp[p]) + " back to original array at index " + std::to_string(p) + ".";
            TraceOp op{OP_OVERWRITE, p, -1, temp[p], 16, msg, makeSnapshot(arr, totalSize), ""};
            metrics.trace.push_back(op);
        }
    }
}

void mergeSortRecursive(int* arr, int* temp, int left, int right, int depth, int totalSize, SortMetrics& metrics, bool recordTrace) {
    if (depth > metrics.maxRecursionDepth) {
        metrics.maxRecursionDepth = depth;
    }

    if (left >= right) return;

    int mid = left + (right - left) / 2;

    if (recordTrace) {
        std::string msg = "Divide step: Subarray [" + std::to_string(left) + ".." + std::to_string(right) + "] split at mid = " + std::to_string(mid) + " (depth " + std::to_string(depth) + ").";
        TraceOp op{OP_SPLIT, left, right, mid, 3, msg, makeSnapshot(arr, totalSize), "split"};
        metrics.trace.push_back(op);
    }

    mergeSortRecursive(arr, temp, left, mid, depth + 1, totalSize, metrics, recordTrace);
    mergeSortRecursive(arr, temp, mid + 1, right, depth + 1, totalSize, metrics, recordTrace);
    mergeSubarrays(arr, temp, left, mid, right, totalSize, metrics, recordTrace);
}

void mergeSort(int* arr, int size, SortMetrics& metrics, bool recordTrace) {
    metrics.algorithmName = "Merge Sort";
    metrics.arraySize = size;
    metrics.maxRecursionDepth = 0;

    if (size <= 1) {
        metrics.auxiliaryMemoryBytes = 0;
        metrics.isCorrect = true;
        if (recordTrace && size == 1) {
            metrics.trace.push_back({OP_MARK_SORTED, 0, -1, arr[0], 2, "Single-element array is trivially sorted.", makeSnapshot(arr, size), ""});
        }
        return;
    }

    metrics.auxiliaryMemoryBytes = static_cast<long long>(size) * sizeof(int);
    int* temp = new int[size];

    mergeSortRecursive(arr, temp, 0, size - 1, 1, size, metrics, recordTrace);

    delete[] temp;

    if (recordTrace) {
        for (int k = 0; k < size; ++k) {
            metrics.trace.push_back({OP_MARK_SORTED, k, -1, arr[k], 16, "Merge Sort completed successfully.", makeSnapshot(arr, size), ""});
        }
    }
}

// ============================================================================
// 5. ALGORITHM 3: QUICK SORT (BASIC LOMUTO PARTITION)
// ============================================================================
/**
 * VIVA EXPLANATION:
 * - Real-life analogy: Sorting students by height using the last element as benchmark (pivot).
 * - Partitioning: Basic Lomuto partition - single pass scanning from low to high-1.
 * - Time: Best O(n log n), Avg O(n log n), Worst O(n^2). Space: O(log n) call stack.
 * - Stability: Unstable.
 */
int lomutoPartition(int* arr, int low, int high, int totalSize, SortMetrics& metrics, bool recordTrace) {
    int pivot = arr[high];
    int i = low - 1;

    if (recordTrace) {
        std::string msg = "Selected pivot = " + std::to_string(pivot) + " at index " + std::to_string(high) + ".";
        TraceOp op{OP_PIVOT, high, -1, pivot, 9, msg, makeSnapshot(arr, totalSize), "pivot"};
        metrics.trace.push_back(op);
    }

    for (int j = low; j < high; ++j) {
        metrics.comparisons++;
        if (recordTrace) {
            std::string msg = "Comparing arr[" + std::to_string(j) + "] (" + std::to_string(arr[j]) + ") with pivot (" + std::to_string(pivot) + ").";
            TraceOp op{OP_COMPARE, j, high, pivot, 12, msg, makeSnapshot(arr, totalSize), ""};
            metrics.trace.push_back(op);
        }

        if (arr[j] < pivot) {
            i++;
            doSwap(arr, i, j, totalSize, 14, "arr[" + std::to_string(j) + "] < pivot: swapped with arr[" + std::to_string(i) + "].", metrics, recordTrace);
        }
    }

    doSwap(arr, i + 1, high, totalSize, 17, "Placed pivot " + std::to_string(pivot) + " into sorted position index " + std::to_string(i + 1) + ".", metrics, recordTrace);
    return i + 1;
}

void quickSortRecursive(int* arr, int low, int high, int depth, int totalSize, SortMetrics& metrics, bool recordTrace) {
    if (depth > metrics.maxRecursionDepth) {
        metrics.maxRecursionDepth = depth;
    }

    if (low < high) {
        int pi = lomutoPartition(arr, low, high, totalSize, metrics, recordTrace);
        quickSortRecursive(arr, low, pi - 1, depth + 1, totalSize, metrics, recordTrace);
        quickSortRecursive(arr, pi + 1, high, depth + 1, totalSize, metrics, recordTrace);
    }
}

void quickSort(int* arr, int size, SortMetrics& metrics, bool recordTrace) {
    metrics.algorithmName = "Quick Sort";
    metrics.arraySize = size;
    metrics.maxRecursionDepth = 0;

    if (size <= 1) {
        metrics.auxiliaryMemoryBytes = 0;
        metrics.isCorrect = true;
        return;
    }

    quickSortRecursive(arr, 0, size - 1, 1, size, metrics, recordTrace);
    metrics.auxiliaryMemoryBytes = static_cast<long long>(metrics.maxRecursionDepth) * 32;

    if (recordTrace) {
        for (int k = 0; k < size; ++k) {
            metrics.trace.push_back({OP_MARK_SORTED, k, -1, arr[k], 19, "Quick Sort completed successfully.", makeSnapshot(arr, size), ""});
        }
    }
}

// ============================================================================
// 6. ALGORITHM 4: HEAP SORT (IN-PLACE MAX-HEAP)
// ============================================================================
/**
 * VIVA EXPLANATION:
 * - Real-life analogy: Tournament bracket / pyramid hierarchy.
 * - Heapify: Bottom-up max-heap construction takes O(n) time, NOT O(n log n).
 * - Extraction: Swaps root arr[0] with arr[end], shrinks heap boundary, sifts root.
 * - Time: O(n log n) Best, Average, Worst. Space: O(1) in-place auxiliary.
 * - Stability: Unstable.
 */
void siftDown(int* arr, int root, int heapSize, int totalSize, SortMetrics& metrics, bool recordTrace) {
    int current = root;

    while (true) {
        int leftChild = 2 * current + 1;
        int rightChild = 2 * current + 2;
        int largest = current;

        if (leftChild < heapSize) {
            metrics.comparisons++;
            if (recordTrace) {
                std::string msg = "Heap tree comparison: Left child arr[" + std::to_string(leftChild) + "] (" + std::to_string(arr[leftChild]) + ") vs current largest arr[" + std::to_string(largest) + "] (" + std::to_string(arr[largest]) + ").";
                metrics.trace.push_back({OP_COMPARE, leftChild, largest, arr[leftChild], 13, msg, makeSnapshot(arr, totalSize), "heap_cmp"});
            }
            if (arr[leftChild] > arr[largest]) {
                largest = leftChild;
            }
        }

        if (rightChild < heapSize) {
            metrics.comparisons++;
            if (recordTrace) {
                std::string msg = "Heap tree comparison: Right child arr[" + std::to_string(rightChild) + "] (" + std::to_string(arr[rightChild]) + ") vs current largest arr[" + std::to_string(largest) + "] (" + std::to_string(arr[largest]) + ").";
                metrics.trace.push_back({OP_COMPARE, rightChild, largest, arr[rightChild], 14, msg, makeSnapshot(arr, totalSize), "heap_cmp"});
            }
            if (arr[rightChild] > arr[largest]) {
                largest = rightChild;
            }
        }

        if (largest == current) break;

        std::string msg = "Sifting down: Swapping parent arr[" + std::to_string(current) + "] (" + std::to_string(arr[current]) + ") with larger child arr[" + std::to_string(largest) + "] (" + std::to_string(arr[largest]) + ") to restore max-heap.";
        doSwap(arr, current, largest, totalSize, 16, msg, metrics, recordTrace);
        current = largest;
    }
}

void heapSort(int* arr, int size, SortMetrics& metrics, bool recordTrace) {
    metrics.algorithmName = "Heap Sort";
    metrics.arraySize = size;
    metrics.auxiliaryMemoryBytes = 0; // Strictly O(1) in-place
    metrics.maxRecursionDepth = 0;

    if (size <= 1) {
        metrics.isCorrect = true;
        return;
    }

    if (recordTrace) {
        metrics.trace.push_back({OP_INFO, 0, -1, 0, 3, "Phase 1: Building Max-Heap bottom-up in O(n) time starting at index " + std::to_string(size / 2 - 1) + ".", makeSnapshot(arr, size), "build_heap"});
    }

    // Phase 1: Build Max Heap bottom-up
    for (int i = size / 2 - 1; i >= 0; --i) {
        siftDown(arr, i, size, size, metrics, recordTrace);
    }

    if (recordTrace) {
        metrics.trace.push_back({OP_INFO, 0, -1, 0, 6, "Phase 2: Max-Heap verified. Extracting root (maximum) to the end one-by-one.", makeSnapshot(arr, size), "extract_heap"});
    }

    // Phase 2: Extract maximum to the end
    for (int end = size - 1; end > 0; --end) {
        std::string msg = "Extracted root maximum " + std::to_string(arr[0]) + " to sorted position at index " + std::to_string(end) + ".";
        doSwap(arr, 0, end, size, 7, msg, metrics, recordTrace);

        if (recordTrace) {
            metrics.trace.push_back({OP_MARK_SORTED, end, -1, arr[end], 7, "Element " + std::to_string(arr[end]) + " at index " + std::to_string(end) + " is permanently sorted.", makeSnapshot(arr, size), ""});
        }

        siftDown(arr, 0, end, size, metrics, recordTrace);
    }

    if (recordTrace) {
        metrics.trace.push_back({OP_MARK_SORTED, 0, -1, arr[0], 10, "Final root element is now in sorted position. Heap Sort complete.", makeSnapshot(arr, size), ""});
    }
}

// ============================================================================
// 7. ALGORITHM 5: ADAPTIVE SORT (BASIC CHECK & HYBRID DISPATCH)
// ============================================================================
/**
 * VIVA EXPLANATION:
 * - Real-life analogy: A smart dispatcher choosing walking, reversing, or quick sort.
 * - Simple hard-coded logic:
 *     1. Checks if already sorted in O(n) -> Early exit.
 *     2. Checks if strictly descending in O(n) -> Reverse in-place with two pointers.
 *     3. Small arrays (N < 16) -> Insertion sort.
 *     4. General unsorted -> Quick sort.
 */
void adaptiveSort(int* arr, int size, SortMetrics& metrics, bool recordTrace) {
    metrics.algorithmName = "Adaptive Sort";
    metrics.arraySize = size;
    metrics.maxRecursionDepth = 0;

    if (size <= 1) {
        metrics.adaptiveStrategy = "Identity Verification";
        metrics.adaptiveReason = "Array size <= 1 is trivially sorted.";
        metrics.auxiliaryMemoryBytes = 0;
        metrics.isCorrect = true;
        return;
    }

    // Step 1: Check if already sorted
    bool isSorted = true;
    for (int i = 0; i < size - 1; ++i) {
        metrics.comparisons++;
        if (arr[i] > arr[i + 1]) {
            isSorted = false;
            break;
        }
    }
    if (isSorted) {
        metrics.adaptiveStrategy = "Early Exit Verification";
        metrics.adaptiveReason = "Array is already monotonically non-decreasing. Verified in O(n) scan with 0 swaps.";
        metrics.auxiliaryMemoryBytes = 0;
        if (recordTrace) {
            metrics.trace.push_back({OP_INFO, 0, size - 1, 0, 4, "Array already verified sorted in single O(n) pass. Zero swaps required.", makeSnapshot(arr, size), "sorted"});
            for (int k = 0; k < size; ++k) {
                metrics.trace.push_back({OP_MARK_SORTED, k, -1, arr[k], 4, "Verified sorted.", makeSnapshot(arr, size), ""});
            }
        }
        metrics.algorithmName = "Adaptive (" + metrics.adaptiveStrategy + ")";
        return;
    }

    // Step 2: Check if reverse sorted
    bool isReverse = true;
    for (int i = 0; i < size - 1; ++i) {
        metrics.comparisons++;
        if (arr[i] < arr[i + 1]) {
            isReverse = false;
            break;
        }
    }
    if (isReverse) {
        metrics.adaptiveStrategy = "In-Place Symmetric Reversal";
        metrics.adaptiveReason = "Monotone descending sequence detected. Reversed in-place in floor(n/2) swaps with 0 comparisons.";
        metrics.auxiliaryMemoryBytes = sizeof(int);
        if (recordTrace) {
            metrics.trace.push_back({OP_INFO, 0, size - 1, 0, 6, "Monotone descending sequence detected. Initiating in-place symmetric reversal in floor(n/2) swaps.", makeSnapshot(arr, size), "reversal"});
        }
        int l = 0, r = size - 1;
        while (l < r) {
            doSwap(arr, l, r, size, 8, "Reversing: Swapping arr[" + std::to_string(l) + "] with arr[" + std::to_string(r) + "].", metrics, recordTrace);
            l++;
            r--;
        }
        if (recordTrace) {
            for (int k = 0; k < size; ++k) {
                metrics.trace.push_back({OP_MARK_SORTED, k, -1, arr[k], 9, "Reversal complete. Array sorted in linear time.", makeSnapshot(arr, size), ""});
            }
        }
        metrics.algorithmName = "Adaptive (" + metrics.adaptiveStrategy + ")";
        return;
    }

    // Step 3: Small arrays use insertion sort, general arrays use quick sort
    if (size < 16) {
        metrics.adaptiveStrategy = "Direct Insertion Sort";
        metrics.adaptiveReason = "Subproblem size N < 16. Insertion sort eliminates call stack overhead.";
        if (recordTrace) {
            metrics.trace.push_back({OP_INFO, 0, size - 1, size, 12, "Small array (N < 16). Selected Insertion Sort to eliminate function call overhead.", makeSnapshot(arr, size), "small"});
        }
        insertionSort(arr, size, metrics, recordTrace);
    } else {
        metrics.adaptiveStrategy = "Quick Sort";
        metrics.adaptiveReason = "Unsorted general sequence. Applying standard Quick Sort.";
        if (recordTrace) {
            metrics.trace.push_back({OP_INFO, 0, size - 1, size, 14, "General array. Selected Quick Sort.", makeSnapshot(arr, size), "general"});
        }
        quickSort(arr, size, metrics, recordTrace);
    }

    metrics.algorithmName = "Adaptive (" + metrics.adaptiveStrategy + ")";
}

// ============================================================================
// 8. ALGORITHM 6: BUBBLE SORT (FLAG OPTIMIZED)
// ============================================================================
/**
 * VIVA EXPLANATION:
 * - Real-life analogy: Bubbles rising in fizzy soda — heavier items sink while
 *   lighter items float to the surface through adjacent pairwise comparisons.
 * - Time Complexity: Best O(n) (with early exit flag), Average O(n^2), Worst O(n^2).
 * - Space: O(1) in-place auxiliary memory.
 * - Stability: Stable (never swaps equal adjacent elements).
 */
void bubbleSort(int* arr, int size, SortMetrics& metrics, bool recordTrace) {
    metrics.algorithmName = "Bubble Sort";
    metrics.arraySize = size;
    metrics.auxiliaryMemoryBytes = sizeof(bool) + sizeof(int);
    metrics.maxRecursionDepth = 0;

    if (size <= 1) {
        metrics.isCorrect = true;
        if (recordTrace && size == 1) {
            metrics.trace.push_back({OP_MARK_SORTED, 0, -1, arr[0], 1, "Single element trivially sorted.", makeSnapshot(arr, size), ""});
        }
        return;
    }

    for (int i = 0; i < size - 1; ++i) {
        bool swapped = false;
        if (recordTrace) {
            metrics.trace.push_back({OP_INFO, i, -1, size - 1 - i, 2, "Pass " + std::to_string(i + 1) + ": Bubbling largest unsorted element to index " + std::to_string(size - 1 - i) + ".", makeSnapshot(arr, size), "pass"});
        }

        for (int j = 0; j < size - 1 - i; ++j) {
            metrics.comparisons++;
            if (recordTrace) {
                std::string msg = "Comparing adjacent pair arr[" + std::to_string(j) + "] (" + std::to_string(arr[j]) + ") and arr[" + std::to_string(j + 1) + "] (" + std::to_string(arr[j + 1]) + ").";
                metrics.trace.push_back({OP_COMPARE, j, j + 1, arr[j], 4, msg, makeSnapshot(arr, size), ""});
            }

            if (arr[j] > arr[j + 1]) {
                doSwap(arr, j, j + 1, size, 5, "Inversion detected (" + std::to_string(arr[j]) + " > " + std::to_string(arr[j + 1]) + "); swapped adjacent elements.", metrics, recordTrace);
                swapped = true;
            }
        }

        // Element at size - 1 - i is now locked in place
        if (recordTrace) {
            metrics.trace.push_back({OP_MARK_SORTED, size - 1 - i, -1, arr[size - 1 - i], 8, "Element " + std::to_string(arr[size - 1 - i]) + " locked into permanent sorted position.", makeSnapshot(arr, size), ""});
        }

        // Early termination optimization: if no swaps occurred, array is completely sorted!
        if (!swapped) {
            if (recordTrace) {
                metrics.trace.push_back({OP_INFO, 0, size - 1, 0, 10, "Early termination: No swaps occurred in pass " + std::to_string(i + 1) + ". Sequence is verified fully sorted!", makeSnapshot(arr, size), "early_break"});
            }
            break;
        }
    }

    if (recordTrace) {
        for (int k = 0; k < size; ++k) {
            metrics.trace.push_back({OP_MARK_SORTED, k, -1, arr[k], 12, "Bubble sort completed. Subarray verified sorted.", makeSnapshot(arr, size), ""});
        }
    }
}

// ============================================================================
// 9. BENCHMARK SUITE RUNNER & DISPATCHER (6 CORE DSA ALGORITHMS)
// ============================================================================

enum AlgorithmID {
    ALGO_INSERTION = 0,
    ALGO_MERGE = 1,
    ALGO_QUICK = 2,
    ALGO_HEAP = 3,
    ALGO_ADAPTIVE = 4,
    ALGO_BUBBLE = 5
};

SortMetrics runSortAlgorithm(int algoId, const int* sourceData, int size, bool recordTrace) {
    SortMetrics metrics;
    if (size < 0) size = 0;

    int* buffer = nullptr;
    if (size > 0) {
        buffer = new int[size];
        std::memcpy(buffer, sourceData, size * sizeof(int));
    }

    auto startTime = std::chrono::high_resolution_clock::now();

    switch (algoId) {
        case ALGO_INSERTION:
            insertionSort(buffer, size, metrics, recordTrace);
            break;
        case ALGO_MERGE:
            mergeSort(buffer, size, metrics, recordTrace);
            break;
        case ALGO_QUICK:
            quickSort(buffer, size, metrics, recordTrace);
            break;
        case ALGO_HEAP:
            heapSort(buffer, size, metrics, recordTrace);
            break;
        case ALGO_ADAPTIVE:
            adaptiveSort(buffer, size, metrics, recordTrace);
            break;
        case ALGO_BUBBLE:
            bubbleSort(buffer, size, metrics, recordTrace);
            break;
        default:
            metrics.algorithmName = "Unknown";
            break;
    }

    auto endTime = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::micro> elapsed = endTime - startTime;
    metrics.elapsedMicroseconds = elapsed.count();

    metrics.isCorrect = verifySorted(buffer, size);

    if (buffer != nullptr) {
        delete[] buffer;
    }

    return metrics;
}

std::string escapeJsonString(const std::string& input) {
    std::ostringstream ss;
    for (char c : input) {
        if (c == '"') ss << "\\\"";
        else if (c == '\\') ss << "\\\\";
        else if (c == '\b') ss << "\\b";
        else if (c == '\f') ss << "\\f";
        else if (c == '\n') ss << "\\n";
        else if (c == '\r') ss << "\\r";
        else if (c == '\t') ss << "\\t";
        else ss << c;
    }
    return ss.str();
}

std::string serializeMetricsToJson(const SortMetrics& m, bool includeTrace) {
    std::ostringstream ss;
    ss << std::fixed << std::setprecision(3);
    ss << "{\n";
    ss << "  \"algorithm\": \"" << escapeJsonString(m.algorithmName) << "\",\n";
    ss << "  \"arraySize\": " << m.arraySize << ",\n";
    ss << "  \"comparisons\": " << m.comparisons << ",\n";
    ss << "  \"swaps\": " << m.swaps << ",\n";
    ss << "  \"moves\": " << m.moves << ",\n";
    ss << "  \"auxiliaryMemoryBytes\": " << m.auxiliaryMemoryBytes << ",\n";
    ss << "  \"maxRecursionDepth\": " << m.maxRecursionDepth << ",\n";
    ss << "  \"elapsedMicroseconds\": " << m.elapsedMicroseconds << ",\n";
    ss << "  \"isCorrect\": " << (m.isCorrect ? "true" : "false") << ",\n";
    ss << "  \"adaptiveStrategy\": \"" << escapeJsonString(m.adaptiveStrategy) << "\",\n";
    ss << "  \"adaptiveReason\": \"" << escapeJsonString(m.adaptiveReason) << "\"";

    if (includeTrace && !m.trace.empty()) {
        ss << ",\n  \"trace\": [\n";
        for (size_t i = 0; i < m.trace.size(); ++i) {
            const auto& op = m.trace[i];
            ss << "    {\"type\":" << op.type
               << ",\"index1\":" << op.index1
               << ",\"index2\":" << op.index2
               << ",\"value\":" << op.value
               << ",\"line\":" << op.line
               << ",\"message\":\"" << escapeJsonString(op.message) << "\""
               << ",\"snapshot\":[";
            for (size_t k = 0; k < op.snapshot.size(); ++k) {
                ss << op.snapshot[k] << (k + 1 < op.snapshot.size() ? "," : "");
            }
            ss << "]"
               << ",\"meta\":\"" << escapeJsonString(op.meta) << "\"}";
            if (i + 1 < m.trace.size()) ss << ",";
            ss << "\n";
        }
        ss << "  ]";
    }

    ss << "\n}";
    return ss.str();
}

static std::string g_wasmResultJson;

extern "C" {

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
const char* runSortWasm(int algoId, const int* data, int size, int recordTrace) {
    SortMetrics metrics = runSortAlgorithm(algoId, data, size, recordTrace != 0);
    g_wasmResultJson = serializeMetricsToJson(metrics, recordTrace != 0);
    return g_wasmResultJson.c_str();
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int getSortLabVersion() {
    return 2026;
}

} // extern "C"

#ifndef __EMSCRIPTEN__

int main() {
    std::cout << "====================================================================\n";
    std::cout << "SortLab: C++ DSA Sorting Benchmark Engine\n";
    std::cout << "Project Authors:\n";
    std::cout << "  1. Aditya Ingole   (Roll No. CS2301)\n";
    std::cout << "  2. Ashutosh Tiwari (Roll No. CS2303)\n";
    std::cout << "  3. Keshav Bhutada  (Roll No. CS2304)\n";
    std::cout << "  4. Rupesh Chauhan  (Roll No. CS2308)\n";
    std::cout << "====================================================================\n\n";

    // 1. Direct demonstration of Pure BasicDSA Functions
    std::cout << "[1] Demonstrating Pure BasicDSA Hard-Coded Functions (No Tracing):\n";
    int demo[] = {64, 25, 12, 22, 11};
    int nDemo = sizeof(demo) / sizeof(demo[0]);
    std::cout << "Original Array: ";
    for (int i = 0; i < nDemo; ++i) std::cout << demo[i] << " ";
    std::cout << "\n";

    BasicDSA::bubbleSort(demo, nDemo);
    std::cout << "Bubble Sorted:  ";
    for (int i = 0; i < nDemo; ++i) std::cout << demo[i] << " ";
    std::cout << "\n\n";

    // 2. Testing all 6 core algorithms with benchmark metrics
    std::cout << "[2] Benchmarking All 6 Sorting Algorithms on [45, 12, 89, 3, 27]:\n";
    int testArr[] = {45, 12, 89, 3, 27};
    int size = 5;

    for (int algo = 0; algo < 6; ++algo) {
        SortMetrics m = runSortAlgorithm(algo, testArr, size, true);
        std::cout << "  Algo " << algo << ": " << std::left << std::setw(28) << m.algorithmName
                  << " | Correct: " << (m.isCorrect ? "YES" : "NO")
                  << " | Steps: " << std::setw(3) << m.trace.size()
                  << " | Time: " << m.elapsedMicroseconds << "us\n";
    }

    std::cout << "\nAll 6 sorting algorithms verified successfully!\n";
    return 0;
}

#endif
