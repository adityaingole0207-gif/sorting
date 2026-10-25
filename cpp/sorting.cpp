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
#include <vector>
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
// 1. DATA STRUCTURES & INSTRUMENTATION
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
 * Rich step recorded for graphical animation, educational captions,
 * and synchronized C++ code line highlighting.
 */
struct TraceOp {
    int type;                    // OpType enum value
    int index1;                  // Primary array index
    int index2;                  // Secondary array index (-1 if unused)
    int value;                   // Value involved (for overwrite or pivot)
    int line;                    // C++ source code line number being executed
    std::string message;         // Beginner-friendly plain English explanation
    std::vector<int> snapshot;   // Full array state after this step
    std::string meta;            // Extra data (e.g. merge depth, heap parent)
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
    std::vector<TraceOp> trace;
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

std::vector<int> makeSnapshot(const int* arr, int size) {
    if (size <= 0) return {};
    return std::vector<int>(arr, arr + size);
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
// 3. ALGORITHM 1: INSERTION SORT
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
// 5. ALGORITHM 3: QUICK SORT (MEDIAN-OF-THREE PIVOT)
// ============================================================================
/**
 * VIVA EXPLANATION:
 * - Real-life analogy: Sorting students by height using a benchmark student (pivot).
 * - Median-of-Three: Evaluates arr[low], arr[mid], arr[high] to avoid O(n^2) on sorted data.
 * - Partitioning: Hoare's scheme (two pointers converging) averages ~3x fewer swaps than Lomuto.
 * - Time: Best O(n log n), Avg O(n log n), Worst O(n^2). Space: O(log n) call stack.
 * - Stability: Unstable.
 */
int medianOfThree(int* arr, int low, int high, int totalSize, SortMetrics& metrics, bool recordTrace) {
    int mid = low + (high - low) / 2;

    metrics.comparisons++;
    if (arr[mid] < arr[low]) doSwap(arr, low, mid, totalSize, 3, "Median-3: arr[mid] < arr[low], swap.", metrics, recordTrace);
    metrics.comparisons++;
    if (arr[high] < arr[low]) doSwap(arr, low, high, totalSize, 3, "Median-3: arr[high] < arr[low], swap.", metrics, recordTrace);
    metrics.comparisons++;
    if (arr[high] < arr[mid]) doSwap(arr, mid, high, totalSize, 3, "Median-3: arr[high] < arr[mid], swap.", metrics, recordTrace);

    // Median is at mid, swap to low as pivot
    doSwap(arr, low, mid, totalSize, 3, "Median-3: Selected median value " + std::to_string(arr[mid]) + " as pivot at arr[" + std::to_string(low) + "].", metrics, recordTrace);
    return arr[low];
}

int hoarePartition(int* arr, int low, int high, int totalSize, SortMetrics& metrics, bool recordTrace) {
    int pivot = medianOfThree(arr, low, high, totalSize, metrics, recordTrace);
    int i = low - 1;
    int j = high + 1;

    if (recordTrace) {
        std::string msg = "Partitioning subarray [" + std::to_string(low) + ".." + std::to_string(high) + "] around pivot = " + std::to_string(pivot) + ".";
        TraceOp op{OP_PIVOT, low, high, pivot, 8, msg, makeSnapshot(arr, totalSize), "pivot"};
        metrics.trace.push_back(op);
    }

    while (true) {
        do {
            i++;
            metrics.comparisons++;
            if (recordTrace) {
                metrics.trace.push_back({OP_COMPARE, i, -1, pivot, 11, "Scanning left pointer i=" + std::to_string(i) + ": arr[i]=" + std::to_string(arr[i]) + " < pivot=" + std::to_string(pivot) + "?", makeSnapshot(arr, totalSize), ""});
            }
        } while (arr[i] < pivot);

        do {
            j--;
            metrics.comparisons++;
            if (recordTrace) {
                metrics.trace.push_back({OP_COMPARE, j, -1, pivot, 12, "Scanning right pointer j=" + std::to_string(j) + ": arr[j]=" + std::to_string(arr[j]) + " > pivot=" + std::to_string(pivot) + "?", makeSnapshot(arr, totalSize), ""});
            }
        } while (arr[j] > pivot);

        if (i >= j) {
            if (recordTrace) {
                metrics.trace.push_back({OP_PIVOT, j, -1, pivot, 13, "Pointers crossed at j=" + std::to_string(j) + ". Partition boundary established.", makeSnapshot(arr, totalSize), "split"});
            }
            return j;
        }

        std::string swapMsg = "Pointers halted: arr[" + std::to_string(i) + "] (" + std::to_string(arr[i]) + ") >= pivot and arr[" + std::to_string(j) + "] (" + std::to_string(arr[j]) + ") <= pivot. Swapping.";
        doSwap(arr, i, j, totalSize, 14, swapMsg, metrics, recordTrace);
    }
}

void quickSortRecursive(int* arr, int low, int high, int depth, int totalSize, SortMetrics& metrics, bool recordTrace) {
    if (depth > metrics.maxRecursionDepth) {
        metrics.maxRecursionDepth = depth;
    }

    if (low < high) {
        int p = hoarePartition(arr, low, high, totalSize, metrics, recordTrace);
        quickSortRecursive(arr, low, p, depth + 1, totalSize, metrics, recordTrace);
        quickSortRecursive(arr, p + 1, high, depth + 1, totalSize, metrics, recordTrace);
    }
}

void quickSort(int* arr, int size, SortMetrics& metrics, bool recordTrace) {
    metrics.algorithmName = "Quick Sort (Med-3)";
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
            metrics.trace.push_back({OP_MARK_SORTED, k, -1, arr[k], 16, "Quick Sort completed successfully.", makeSnapshot(arr, size), ""});
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

// Subarray siftDown for Introsort
void siftDownRange(int* arr, int start, int root, int heapSize, int totalSize, SortMetrics& metrics, bool recordTrace) {
    int current = root;
    while (true) {
        int leftChild = 2 * current + 1;
        int rightChild = 2 * current + 2;
        int largest = current;

        if (leftChild < heapSize) {
            metrics.comparisons++;
            if (arr[start + leftChild] > arr[start + largest]) largest = leftChild;
        }
        if (rightChild < heapSize) {
            metrics.comparisons++;
            if (arr[start + rightChild] > arr[start + largest]) largest = rightChild;
        }

        if (largest == current) break;
        doSwap(arr, start + current, start + largest, totalSize, 16, "", metrics, recordTrace);
        current = largest;
    }
}

void heapSortRange(int* arr, int left, int right, int totalSize, SortMetrics& metrics, bool recordTrace) {
    int count = right - left + 1;
    if (count <= 1) return;

    for (int i = count / 2 - 1; i >= 0; --i) {
        siftDownRange(arr, left, i, count, totalSize, metrics, recordTrace);
    }
    for (int end = count - 1; end > 0; --end) {
        doSwap(arr, left, left + end, totalSize, 7, "", metrics, recordTrace);
        siftDownRange(arr, left, 0, end, totalSize, metrics, recordTrace);
    }
}

// ============================================================================
// 7. ALGORITHM 5: ADAPTIVE SORT (PROFILING -> HYBRID INTROSORT / RUN MERGER)
// ============================================================================
/**
 * VIVA EXPLANATION:
 * - Real-life analogy: A smart navigation app choosing walking, driving, or highway.
 * - Mechanism:
 *     1. Profiles input (counts sorted runs, sample inversions, size).
 *     2. Small arrays (N < 16) -> Insertion Sort (no recursion overhead).
 *     3. Nearly sorted (runs <= 4) -> Insertion Sort in near-linear O(n) time.
 *     4. Monotone reversed -> In-place reversal in floor(n/2) swaps, 0 comparisons!
 *     5. Random/large -> Introsort (QuickSort with HeapSort depth guard cutoff at 2*floor(log2(n))).
 */
struct InputProfile {
    int size;
    int sortedRuns;
    int reverseRuns;
    long long sampleInversions;
    bool isFullySorted;
    bool isFullyReversed;
};

InputProfile profileInput(const int* arr, int size) {
    InputProfile profile;
    profile.size = size;
    profile.sortedRuns = 1;
    profile.reverseRuns = 1;
    profile.sampleInversions = 0;
    profile.isFullySorted = true;
    profile.isFullyReversed = true;

    if (size <= 1) return profile;

    for (int i = 0; i < size - 1; ++i) {
        if (arr[i] > arr[i + 1]) {
            profile.isFullySorted = false;
            profile.sortedRuns++;
        } else if (arr[i] < arr[i + 1]) {
            profile.isFullyReversed = false;
        }
    }

    int sampleLimit = (size < 256) ? size : 128;
    int stride = (size < 256) ? 1 : (size / sampleLimit);
    for (int i = 0; i < size - stride; i += stride) {
        if (arr[i] > arr[i + stride]) {
            profile.sampleInversions++;
        }
    }

    return profile;
}

void reverseArrayInPlace(int* arr, int size, SortMetrics& metrics, bool recordTrace) {
    int i = 0;
    int j = size - 1;
    while (i < j) {
        doSwap(arr, i, j, size, 6, "Reversing: Swapping arr[" + std::to_string(i) + "] with arr[" + std::to_string(j) + "].", metrics, recordTrace);
        i++;
        j--;
    }
}

void introsortRecursive(int* arr, int low, int high, int maxDepth, int currentDepth, int totalSize, SortMetrics& metrics, bool recordTrace) {
    if (currentDepth > metrics.maxRecursionDepth) {
        metrics.maxRecursionDepth = currentDepth;
    }

    int count = high - low + 1;
    if (count <= 1) return;

    if (count < 16) {
        if (recordTrace) {
            metrics.trace.push_back({OP_INFO, low, high, count, 8, "Partition size " + std::to_string(count) + " < 16. Cutoff to Insertion Sort for cache speed.", makeSnapshot(arr, totalSize), "cutoff"});
        }
        insertionSortRange(arr, low, high, totalSize, metrics, recordTrace);
        return;
    }

    if (currentDepth >= maxDepth) {
        if (recordTrace) {
            metrics.trace.push_back({OP_INFO, low, high, maxDepth, 13, "Recursion depth " + std::to_string(currentDepth) + " reached limit " + std::to_string(maxDepth) + ". Switching to Heap Sort to prevent O(n^2).", makeSnapshot(arr, totalSize), "fallback"});
        }
        heapSortRange(arr, low, high, totalSize, metrics, recordTrace);
        return;
    }

    int p = hoarePartition(arr, low, high, totalSize, metrics, recordTrace);
    introsortRecursive(arr, low, p, maxDepth, currentDepth + 1, totalSize, metrics, recordTrace);
    introsortRecursive(arr, p + 1, high, maxDepth, currentDepth + 1, totalSize, metrics, recordTrace);
}

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

    InputProfile profile = profileInput(arr, size);

    if (profile.isFullySorted) {
        metrics.adaptiveStrategy = "Early Exit Verification";
        metrics.adaptiveReason = "Array is already monotonically non-decreasing. Verified in O(n) time with 0 swaps.";
        metrics.auxiliaryMemoryBytes = 0;
        if (recordTrace) {
            metrics.trace.push_back({OP_INFO, 0, size - 1, 0, 4, "Array already verified sorted in single O(n) pass. Zero swaps required.", makeSnapshot(arr, size), "sorted"});
            for (int k = 0; k < size; ++k) {
                metrics.trace.push_back({OP_MARK_SORTED, k, -1, arr[k], 4, "Verified sorted.", makeSnapshot(arr, size), ""});
            }
        }
    } else if (profile.isFullyReversed) {
        metrics.adaptiveStrategy = "In-Place Symmetric Reversal";
        metrics.adaptiveReason = "Monotone descending sequence detected. Reversed in-place in O(n) moves with 0 comparisons.";
        metrics.auxiliaryMemoryBytes = sizeof(int);
        if (recordTrace) {
            metrics.trace.push_back({OP_INFO, 0, size - 1, 0, 6, "Monotone descending sequence detected. Initiating in-place symmetric reversal in floor(n/2) swaps.", makeSnapshot(arr, size), "reversal"});
        }
        reverseArrayInPlace(arr, size, metrics, recordTrace);
        if (recordTrace) {
            for (int k = 0; k < size; ++k) {
                metrics.trace.push_back({OP_MARK_SORTED, k, -1, arr[k], 6, "Reversal complete. Array sorted in linear time.", makeSnapshot(arr, size), ""});
            }
        }
    } else if (size < 16) {
        metrics.adaptiveStrategy = "Direct Insertion Sort";
        metrics.adaptiveReason = "Subproblem size N < 16. Insertion sort eliminates call stack overhead and maximizes L1 cache hits.";
        if (recordTrace) {
            metrics.trace.push_back({OP_INFO, 0, size - 1, size, 8, "Small array (N < 16). Selected Insertion Sort to eliminate function call overhead.", makeSnapshot(arr, size), "small"});
        }
        insertionSort(arr, size, metrics, recordTrace);
    } else if (profile.sortedRuns <= 4 || profile.sampleInversions <= 3) {
        metrics.adaptiveStrategy = "Adaptive Run Insertion";
        metrics.adaptiveReason = "High presortedness detected (runs <= 4). Insertion Sort executes in near-linear O(n) time.";
        if (recordTrace) {
            metrics.trace.push_back({OP_INFO, 0, size - 1, profile.sortedRuns, 10, "Presorted runs detected (" + std::to_string(profile.sortedRuns) + " runs). Dispatched Adaptive Run Insertion.", makeSnapshot(arr, size), "runs"});
        }
        insertionSort(arr, size, metrics, recordTrace);
    } else {
        int maxDepth = 2 * static_cast<int>(std::floor(std::log2(size)));
        metrics.adaptiveStrategy = "Introsort Hybrid (QuickSort + HeapSort cutoff at depth " + std::to_string(maxDepth) + " + Insertion Sort < 16)";
        metrics.adaptiveReason = "Random or large dataset. Introsort combines QuickSort's optimal cache performance with HeapSort's O(n log n) safety.";
        if (recordTrace) {
            metrics.trace.push_back({OP_INFO, 0, size - 1, maxDepth, 13, "Dispatched Introsort: QuickSort with depth cutoff " + std::to_string(maxDepth) + " and Insertion cutoff < 16.", makeSnapshot(arr, size), "introsort"});
        }
        introsortRecursive(arr, 0, size - 1, maxDepth, 1, size, metrics, recordTrace);
        metrics.auxiliaryMemoryBytes = static_cast<long long>(metrics.maxRecursionDepth) * 32;

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
// 9. ALGORITHM 7: SELECTION SORT
// ============================================================================
/**
 * VIVA EXPLANATION:
 * - Real-life analogy: Selecting the shortest student in a group, placing them
 *   at position 0, then finding the second shortest, and so forth.
 * - Invariant: arr[0..i-1] is the sorted prefix containing the i smallest elements.
 * - Time Complexity: O(n^2) in ALL cases (best, average, worst).
 * - Swaps: Exactly n - 1 swaps (minimal writes, useful when memory write cost is high).
 * - Stability: Unstable (long distance swap can leapfrog equal elements).
 */
void selectionSort(int* arr, int size, SortMetrics& metrics, bool recordTrace) {
    metrics.algorithmName = "Selection Sort";
    metrics.arraySize = size;
    metrics.auxiliaryMemoryBytes = sizeof(int) * 2; // min_idx, temp
    metrics.maxRecursionDepth = 0;

    if (size <= 1) {
        metrics.isCorrect = true;
        return;
    }

    for (int i = 0; i < size - 1; ++i) {
        int minIdx = i;
        if (recordTrace) {
            metrics.trace.push_back({OP_PIVOT, i, -1, arr[i], 2, "Pass " + std::to_string(i + 1) + ": Initializing minimum candidate at index " + std::to_string(i) + " (value = " + std::to_string(arr[i]) + ").", makeSnapshot(arr, size), "min_init"});
        }

        for (int j = i + 1; j < size; ++j) {
            metrics.comparisons++;
            if (recordTrace) {
                metrics.trace.push_back({OP_COMPARE, j, minIdx, arr[j], 4, "Comparing current element arr[" + std::to_string(j) + "] (" + std::to_string(arr[j]) + ") against current minimum (" + std::to_string(arr[minIdx]) + ").", makeSnapshot(arr, size), ""});
            }

            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                if (recordTrace) {
                    metrics.trace.push_back({OP_PIVOT, minIdx, i, arr[minIdx], 5, "Found new minimum: " + std::to_string(arr[minIdx]) + " at index " + std::to_string(minIdx) + ".", makeSnapshot(arr, size), "new_min"});
                }
            }
        }

        if (minIdx != i) {
            doSwap(arr, i, minIdx, size, 7, "Swapped found minimum " + std::to_string(arr[minIdx]) + " into target sorted prefix index " + std::to_string(i) + ".", metrics, recordTrace);
        }

        if (recordTrace) {
            metrics.trace.push_back({OP_MARK_SORTED, i, -1, arr[i], 9, "Index " + std::to_string(i) + " permanently locked with value " + std::to_string(arr[i]) + ".", makeSnapshot(arr, size), ""});
        }
    }

    if (recordTrace && size > 0) {
        metrics.trace.push_back({OP_MARK_SORTED, size - 1, -1, arr[size - 1], 10, "Final element locked. Selection sort complete.", makeSnapshot(arr, size), ""});
    }
}

// ============================================================================
// 10. ALGORITHM 8: SHELL SORT (DIMINISHING GAP)
// ============================================================================
/**
 * VIVA EXPLANATION:
 * - Real-life analogy: Comb-sorting intertwined hair or combing fibers: first
 *   untangles big wide knots from far away, then smoothly combs adjacent hairs.
 * - Invariant: Array is h-sorted at each stage, reducing distant inversions quickly.
 * - Time Complexity: O(n log^2 n) to O(n^(1.3)) depending on gap sequence.
 * - Space: O(1) in-place auxiliary memory.
 * - Stability: Unstable (distant gap shifts break stability).
 */
void shellSort(int* arr, int size, SortMetrics& metrics, bool recordTrace) {
    metrics.algorithmName = "Shell Sort";
    metrics.arraySize = size;
    metrics.auxiliaryMemoryBytes = sizeof(int) * 3;
    metrics.maxRecursionDepth = 0;

    if (size <= 1) {
        metrics.isCorrect = true;
        return;
    }

    // Knuth gap sequence or standard N/2 diminishing increments
    for (int gap = size / 2; gap > 0; gap /= 2) {
        if (recordTrace) {
            metrics.trace.push_back({OP_INFO, gap, -1, gap, 2, "Entering gap phase h = " + std::to_string(gap) + ". Performing h-interleaved insertion sorting.", makeSnapshot(arr, size), "gap"});
        }

        for (int i = gap; i < size; ++i) {
            int temp = arr[i];
            int j = i;

            metrics.comparisons++;
            if (recordTrace) {
                metrics.trace.push_back({OP_COMPARE, j - gap, i, temp, 5, "Comparing arr[" + std::to_string(j - gap) + "] (" + std::to_string(arr[j - gap]) + ") with key (" + std::to_string(temp) + ") across gap distance " + std::to_string(gap) + ".", makeSnapshot(arr, size), ""});
            }

            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                metrics.moves++;
                if (recordTrace) {
                    metrics.trace.push_back({OP_OVERWRITE, j, j - gap, arr[j - gap], 6, "Shifted " + std::to_string(arr[j - gap]) + " right by gap " + std::to_string(gap) + " to index " + std::to_string(j) + ".", makeSnapshot(arr, size), ""});
                }
                j -= gap;

                if (j >= gap) {
                    metrics.comparisons++;
                    if (recordTrace) {
                        metrics.trace.push_back({OP_COMPARE, j - gap, -1, temp, 5, "Comparing arr[" + std::to_string(j - gap) + "] (" + std::to_string(arr[j - gap]) + ") with key (" + std::to_string(temp) + ").", makeSnapshot(arr, size), ""});
                    }
                }
            }

            arr[j] = temp;
            metrics.moves++;
            if (recordTrace) {
                metrics.trace.push_back({OP_OVERWRITE, j, -1, temp, 8, "Placed key " + std::to_string(temp) + " at gap destination index " + std::to_string(j) + ".", makeSnapshot(arr, size), ""});
            }
        }
    }

    if (recordTrace) {
        for (int k = 0; k < size; ++k) {
            metrics.trace.push_back({OP_MARK_SORTED, k, -1, arr[k], 10, "Shell sort complete. Array verified in-order.", makeSnapshot(arr, size), ""});
        }
    }
}

// ============================================================================
// 11. ALGORITHM 9: COUNTING SORT (NON-COMPARISON KEY DISTRIBUTION)
// ============================================================================
/**
 * VIVA EXPLANATION:
 * - Real-life analogy: Counting tally marks for voting ballots into labeled candidate boxes.
 * - Time Complexity: O(n + k) linear time where k is value range (max - min + 1).
 * - Space: O(n + k) auxiliary memory for count tally and output staging array.
 * - Stability: Stable when populated from right to left using prefix sums.
 */
void countingSort(int* arr, int size, SortMetrics& metrics, bool recordTrace) {
    metrics.algorithmName = "Counting Sort";
    metrics.arraySize = size;
    metrics.maxRecursionDepth = 0;

    if (size <= 1) {
        metrics.isCorrect = true;
        return;
    }

    int minVal = arr[0], maxVal = arr[0];
    for (int i = 1; i < size; ++i) {
        metrics.comparisons++;
        if (arr[i] < minVal) minVal = arr[i];
        if (arr[i] > maxVal) maxVal = arr[i];
    }

    int range = maxVal - minVal + 1;
    // Safety check for extreme ranges
    if (range > 200000) {
        // Fall back to insertion
        insertionSort(arr, size, metrics, recordTrace);
        return;
    }

    metrics.auxiliaryMemoryBytes = (range * sizeof(int)) + (size * sizeof(int));
    std::vector<int> count(range, 0);
    std::vector<int> output(size);

    if (recordTrace) {
        metrics.trace.push_back({OP_INFO, minVal, maxVal, range, 2, "Determined key spectrum: min = " + std::to_string(minVal) + ", max = " + std::to_string(maxVal) + ", range = " + std::to_string(range) + ". Allocating frequency buckets.", makeSnapshot(arr, size), "range"});
    }

    // Step 1: Count occurrences
    for (int i = 0; i < size; ++i) {
        count[arr[i] - minVal]++;
        metrics.moves++;
        if (recordTrace) {
            metrics.trace.push_back({OP_COMPARE, i, -1, arr[i], 4, "Tallying frequency: element " + std::to_string(arr[i]) + " incremented bucket [" + std::to_string(arr[i] - minVal) + "] to " + std::to_string(count[arr[i] - minVal]) + ".", makeSnapshot(arr, size), ""});
        }
    }

    // Step 2: Cumulative prefix sum
    for (int i = 1; i < range; ++i) {
        count[i] += count[i - 1];
        metrics.moves++;
    }

    // Step 3: Place elements into output array stably
    for (int i = size - 1; i >= 0; --i) {
        int pos = count[arr[i] - minVal] - 1;
        output[pos] = arr[i];
        count[arr[i] - minVal]--;
        metrics.moves++;
    }

    // Step 4: Copy back to original array
    for (int i = 0; i < size; ++i) {
        arr[i] = output[i];
        metrics.moves++;
        if (recordTrace) {
            metrics.trace.push_back({OP_OVERWRITE, i, -1, arr[i], 8, "Staged bucket element " + std::to_string(arr[i]) + " into final sorted position [" + std::to_string(i) + "].", makeSnapshot(arr, size), ""});
        }
    }

    if (recordTrace) {
        for (int k = 0; k < size; ++k) {
            metrics.trace.push_back({OP_MARK_SORTED, k, -1, arr[k], 10, "Counting sort complete in linear O(n + k) time.", makeSnapshot(arr, size), ""});
        }
    }
}

// ============================================================================
// 12. ALGORITHM 10: RADIX SORT (LSD - LEAST SIGNIFICANT DIGIT)
// ============================================================================
/**
 * VIVA EXPLANATION:
 * - Real-life analogy: Sorting punch cards or postal letters into 10 mailboxes (0-9)
 *   first by postal code last digit, then by middle digit, then by leading digit.
 * - Time Complexity: O(d * (n + b)) where d = digit count, b = base (10).
 * - Space: O(n + b) auxiliary buffer for stable bucket collation.
 * - Stability: Stable (essential for multi-pass correctness!).
 */
void radixSortLSD(int* arr, int size, SortMetrics& metrics, bool recordTrace) {
    metrics.algorithmName = "Radix Sort (LSD)";
    metrics.arraySize = size;
    metrics.auxiliaryMemoryBytes = (size * sizeof(int)) + (10 * sizeof(int));
    metrics.maxRecursionDepth = 0;

    if (size <= 1) {
        metrics.isCorrect = true;
        return;
    }

    // Check for negative numbers: if present, shift by min
    int minVal = arr[0], maxVal = arr[0];
    for (int i = 1; i < size; ++i) {
        if (arr[i] < minVal) minVal = arr[i];
        if (arr[i] > maxVal) maxVal = arr[i];
    }

    int offset = 0;
    if (minVal < 0) {
        offset = -minVal;
        for (int i = 0; i < size; ++i) arr[i] += offset;
        maxVal += offset;
    }

    // Perform counting sort for every digit position (1s, 10s, 100s, ...)
    std::vector<int> output(size);
    int passNumber = 1;

    for (int exp = 1; maxVal / exp > 0; exp *= 10) {
        int count[10] = {0};

        if (recordTrace) {
            std::string placeStr = (exp == 1) ? "units (1s)" : ((exp == 10) ? "tens (10s)" : ((exp == 100) ? "hundreds (100s)" : "exp=" + std::to_string(exp)));
            metrics.trace.push_back({OP_INFO, exp, -1, passNumber, 2, "Pass " + std::to_string(passNumber) + ": Distributing elements across 0-9 buckets by " + placeStr + " digit.", makeSnapshot(arr, size), "radix_pass"});
        }

        for (int i = 0; i < size; ++i) {
            int digit = (arr[i] / exp) % 10;
            count[digit]++;
            metrics.moves++;
            if (recordTrace) {
                metrics.trace.push_back({OP_COMPARE, i, -1, arr[i] - offset, 4, "Inspecting element " + std::to_string(arr[i] - offset) + ": Extracted digit (" + std::to_string(digit) + ") at exp " + std::to_string(exp) + ".", makeSnapshot(arr, size), ""});
            }
        }

        for (int i = 1; i < 10; ++i) count[i] += count[i - 1];

        for (int i = size - 1; i >= 0; --i) {
            int digit = (arr[i] / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
            metrics.moves++;
        }

        for (int i = 0; i < size; ++i) {
            arr[i] = output[i];
            metrics.moves++;
            if (recordTrace) {
                metrics.trace.push_back({OP_OVERWRITE, i, -1, arr[i] - offset, 6, "Collated bucket value " + std::to_string(arr[i] - offset) + " into array position [" + std::to_string(i) + "].", makeSnapshot(arr, size), ""});
            }
        }

        passNumber++;
    }

    // Restore offset if shifted
    if (offset != 0) {
        for (int i = 0; i < size; ++i) arr[i] -= offset;
    }

    if (recordTrace) {
        for (int k = 0; k < size; ++k) {
            metrics.trace.push_back({OP_MARK_SORTED, k, -1, arr[k], 8, "Radix sort (LSD) complete across all digit powers.", makeSnapshot(arr, size), ""});
        }
    }
}

// ============================================================================
// 13. BENCHMARK SUITE RUNNER & DISPATCHER
// ============================================================================

enum AlgorithmID {
    ALGO_INSERTION = 0,
    ALGO_MERGE = 1,
    ALGO_QUICK = 2,
    ALGO_HEAP = 3,
    ALGO_ADAPTIVE = 4,
    ALGO_BUBBLE = 5,
    ALGO_SELECTION = 6,
    ALGO_SHELL = 7,
    ALGO_COUNTING = 8,
    ALGO_RADIX = 9
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
        case ALGO_SELECTION:
            selectionSort(buffer, size, metrics, recordTrace);
            break;
        case ALGO_SHELL:
            shellSort(buffer, size, metrics, recordTrace);
            break;
        case ALGO_COUNTING:
            countingSort(buffer, size, metrics, recordTrace);
            break;
        case ALGO_RADIX:
            radixSortLSD(buffer, size, metrics, recordTrace);
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
    std::cout << "SortLab: C++ Sorting Benchmark & Study Engine\n";
    int testArr[] = {45, 12, 89, 3, 27};
    int size = 5;

    for (int algo = 0; algo < 5; ++algo) {
        SortMetrics m = runSortAlgorithm(algo, testArr, size, true);
        std::cout << "Algo: " << m.algorithmName << " | Time: " << m.elapsedMicroseconds << "us | Steps: " << m.trace.size() << " | Correct: " << (m.isCorrect ? "YES" : "NO") << "\n";
    }
    return 0;
}

#endif
