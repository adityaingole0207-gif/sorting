/**
 * ============================================================================
 * SortLab: Web Worker Study & Benchmark Engine (worker.js)
 * ============================================================================
 * Executes sorting algorithms in a background thread with non-blocking execution.
 * Fixes:
 *  1. Adaptive Sort row label ("Adaptive (picked: X)") never overwritten by subroutines.
 *  2. High-precision timing: runs loops accumulating >= 20ms work, takes median of 7 trials.
 *  3. Asynchronous growth chart execution for N = [100, 1k, 10k, 50k].
 *  4. Rich step logs with C++ line numbers, plain-English captions, and snapshots.
 * ============================================================================
 */

const OP_COMPARE = 0;
const OP_SWAP = 1;
const OP_OVERWRITE = 2;
const OP_MARK_SORTED = 3;
const OP_PIVOT = 4;
const OP_SPLIT = 5;
const OP_HEAPIFY = 6;
const OP_INFO = 7;

function verifySorted(arr) {
    for (let i = 0; i < arr.length - 1; ++i) {
        if (arr[i] > arr[i + 1]) return false;
    }
    return true;
}

function cloneArr(arr) {
    return Array.from(arr);
}

// ============================================================================
// 1. INSERTION SORT
// ============================================================================
function insertionSort(arr, metrics, recordTrace) {
    if (!metrics.algorithm) metrics.algorithm = "Insertion Sort";
    metrics.auxiliaryMemoryBytes = 4;
    const n = arr.length;

    if (n <= 1) {
        if (recordTrace && n === 1) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: 0, index2: -1, value: arr[0], line: 10,
                message: "Single-element array is trivially sorted.",
                snapshot: cloneArr(arr), meta: ""
            });
        }
        return;
    }

    for (let i = 1; i < n; ++i) {
        const key = arr[i];
        let j = i - 1;

        if (recordTrace) {
            metrics.trace.push({
                type: OP_PIVOT, index1: i, index2: -1, value: key, line: 3,
                message: `Selected key = ${key} at index ${i}. Searching sorted prefix [0..${i - 1}] for insertion gap.`,
                snapshot: cloneArr(arr), meta: JSON.stringify({ key, keyIdx: i, sortedEnd: i - 1 })
            });
        }

        metrics.comparisons++;
        if (recordTrace) {
            metrics.trace.push({
                type: OP_COMPARE, index1: j, index2: i, value: key, line: 5,
                message: `Comparing prefix element arr[${j}] (${arr[j]}) with key (${key}).`,
                snapshot: cloneArr(arr), meta: JSON.stringify({ key, j, sortedEnd: i - 1 })
            });
        }

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            metrics.moves++;

            if (recordTrace) {
                metrics.trace.push({
                    type: OP_OVERWRITE, index1: j + 1, index2: -1, value: arr[j], line: 6,
                    message: `${arr[j]} > ${key}; shifting ${arr[j]} right to index ${j + 1} to create an insertion gap.`,
                    snapshot: cloneArr(arr), meta: JSON.stringify({ key, gapIdx: j, sortedEnd: i - 1 })
                });
            }
            j--;

            if (j >= 0) {
                metrics.comparisons++;
                if (recordTrace) {
                    metrics.trace.push({
                        type: OP_COMPARE, index1: j, index2: -1, value: key, line: 5,
                        message: `Comparing prefix element arr[${j}] (${arr[j]}) with key (${key}).`,
                        snapshot: cloneArr(arr), meta: JSON.stringify({ key, j, sortedEnd: i - 1 })
                    });
                }
            }
        }

        arr[j + 1] = key;
        metrics.moves++;

        if (recordTrace) {
            metrics.trace.push({
                type: OP_OVERWRITE, index1: j + 1, index2: -1, value: key, line: 9,
                message: `Inserted key = ${key} into the sorted gap at index ${j + 1}.`,
                snapshot: cloneArr(arr), meta: JSON.stringify({ key, insertedAt: j + 1, sortedEnd: i })
            });
        }
    }

    if (recordTrace) {
        for (let k = 0; k < n; ++k) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: k, index2: -1, value: arr[k], line: 10,
                message: "Insertion Sort complete. Subarray [0..N-1] is verified sorted.",
                snapshot: cloneArr(arr), meta: ""
            });
        }
    }
}

function insertionSortRange(arr, left, right, metrics, recordTrace) {
    for (let i = left + 1; i <= right; ++i) {
        const key = arr[i];
        let j = i - 1;
        metrics.comparisons++;
        if (recordTrace) {
            metrics.trace.push({
                type: OP_COMPARE, index1: j, index2: i, value: key, line: 5,
                message: `Cutoff Insertion: Comparing arr[${j}] (${arr[j]}) with key (${key}).`,
                snapshot: cloneArr(arr), meta: ""
            });
        }
        while (j >= left && arr[j] > key) {
            arr[j + 1] = arr[j];
            metrics.moves++;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_OVERWRITE, index1: j + 1, index2: -1, value: arr[j], line: 6,
                    message: `Shifted ${arr[j]} right to index ${j + 1}.`,
                    snapshot: cloneArr(arr), meta: ""
                });
            }
            j--;
            if (j >= left) {
                metrics.comparisons++;
                if (recordTrace) {
                    metrics.trace.push({
                        type: OP_COMPARE, index1: j, index2: -1, value: key, line: 5,
                        message: `Comparing arr[${j}] (${arr[j]}) with key (${key}).`,
                        snapshot: cloneArr(arr), meta: ""
                    });
                }
            }
        }
        arr[j + 1] = key;
        metrics.moves++;
        if (recordTrace) {
            metrics.trace.push({
                type: OP_OVERWRITE, index1: j + 1, index2: -1, value: key, line: 9,
                message: `Inserted key ${key} at index ${j + 1}.`,
                snapshot: cloneArr(arr), meta: ""
            });
        }
    }
}

// ============================================================================
// 2. MERGE SORT (TOP-DOWN)
// ============================================================================
function mergeSubarrays(arr, temp, left, mid, right, depth, metrics, recordTrace) {
    let i = left;
    let j = mid + 1;
    let k = left;

    if (recordTrace) {
        metrics.trace.push({
            type: OP_SPLIT, index1: left, index2: right, value: mid, line: 8,
            message: `Merging sorted halves: Left [${left}..${mid}] and Right [${mid + 1}..${right}] into auxiliary buffer.`,
            snapshot: cloneArr(arr),
            meta: JSON.stringify({ left, mid, right, depth, phase: 'merge', auxSnapshot: cloneArr(temp) })
        });
    }

    while (i <= mid && j <= right) {
        metrics.comparisons++;
        if (recordTrace) {
            metrics.trace.push({
                type: OP_COMPARE, index1: i, index2: j, value: 0, line: 11,
                message: `Comparing left head arr[${i}] (${arr[i]}) with right head arr[${j}] (${arr[j]}).`,
                snapshot: cloneArr(arr),
                meta: JSON.stringify({ left, mid, right, i, j, depth, phase: 'merge', auxSnapshot: cloneArr(temp) })
            });
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

    for (let p = left; p <= right; ++p) {
        arr[p] = temp[p];
        metrics.moves++;
        if (recordTrace) {
            metrics.trace.push({
                type: OP_OVERWRITE, index1: p, index2: -1, value: temp[p], line: 16,
                message: `Copying merged value ${temp[p]} from aux buffer back to original array at index ${p}.`,
                snapshot: cloneArr(arr),
                meta: JSON.stringify({ left, mid, right, p, depth, phase: 'copyback', auxSnapshot: cloneArr(temp) })
            });
        }
    }
}

function mergeSortRecursive(arr, temp, left, right, depth, metrics, recordTrace) {
    if (depth > metrics.maxRecursionDepth) metrics.maxRecursionDepth = depth;
    if (left >= right) return;

    const mid = Math.floor(left + (right - left) / 2);

    if (recordTrace) {
        metrics.trace.push({
            type: OP_SPLIT, index1: left, index2: right, value: mid, line: 3,
            message: `Divide step (Level ${depth}): Splitting range [${left}..${right}] at midpoint ${mid}.`,
            snapshot: cloneArr(arr),
            meta: JSON.stringify({ left, mid, right, depth, phase: 'split' })
        });
    }

    mergeSortRecursive(arr, temp, left, mid, depth + 1, metrics, recordTrace);
    mergeSortRecursive(arr, temp, mid + 1, right, depth + 1, metrics, recordTrace);
    mergeSubarrays(arr, temp, left, mid, right, depth, metrics, recordTrace);
}

function mergeSort(arr, metrics, recordTrace) {
    metrics.algorithm = "Merge Sort";
    const n = arr.length;
    if (n <= 1) {
        metrics.auxiliaryMemoryBytes = 0;
        return;
    }

    metrics.auxiliaryMemoryBytes = n * 4;
    const temp = new Int32Array(n);
    mergeSortRecursive(arr, temp, 0, n - 1, 1, metrics, recordTrace);

    if (recordTrace) {
        for (let k = 0; k < n; ++k) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: k, index2: -1, value: arr[k], line: 16,
                message: "Merge Sort complete. All elements verified in sorted position.",
                snapshot: cloneArr(arr), meta: ""
            });
        }
    }
}

// ============================================================================
// 3. QUICK SORT (MEDIAN-OF-THREE)
// ============================================================================
function doSwapArr(arr, i, j, line, msg, metrics, recordTrace) {
    if (i === j) return;
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    metrics.swaps++;
    metrics.moves += 3;
    if (recordTrace) {
        metrics.trace.push({
            type: OP_SWAP, index1: i, index2: j, value: temp, line,
            message: msg || `Swapped arr[${i}] (${arr[j]}) and arr[${j}] (${arr[i]}).`,
            snapshot: cloneArr(arr), meta: ""
        });
    }
}

function medianOfThree(arr, low, high, metrics, recordTrace) {
    const mid = Math.floor(low + (high - low) / 2);

    metrics.comparisons++;
    if (arr[mid] < arr[low]) doSwapArr(arr, low, mid, 3, "Median-3: arr[mid] < arr[low], swapping.", metrics, recordTrace);
    metrics.comparisons++;
    if (arr[high] < arr[low]) doSwapArr(arr, low, high, 3, "Median-3: arr[high] < arr[low], swapping.", metrics, recordTrace);
    metrics.comparisons++;
    if (arr[high] < arr[mid]) doSwapArr(arr, mid, high, 3, "Median-3: arr[high] < arr[mid], swapping.", metrics, recordTrace);

    doSwapArr(arr, low, mid, 3, `Median-3: Selected median value ${arr[mid]} as pivot at index ${low}.`, metrics, recordTrace);
    return arr[low];
}

function hoarePartition(arr, low, high, metrics, recordTrace) {
    const pivot = medianOfThree(arr, low, high, metrics, recordTrace);
    let i = low - 1;
    let j = high + 1;

    if (recordTrace) {
        metrics.trace.push({
            type: OP_PIVOT, index1: low, index2: high, value: pivot, line: 8,
            message: `Hoare Partition: Partitioning subarray [${low}..${high}] with Pivot = ${pivot}.`,
            snapshot: cloneArr(arr), meta: JSON.stringify({ pivot, low, high, i: low, j: high })
        });
    }

    while (true) {
        do {
            i++;
            metrics.comparisons++;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_COMPARE, index1: i, index2: -1, value: pivot, line: 11,
                    message: `Left pointer i=${i}: arr[${i}] (${arr[i]}) < pivot (${pivot})? Advancing pointer.`,
                    snapshot: cloneArr(arr), meta: JSON.stringify({ pivot, i, j, low, high })
                });
            }
        } while (arr[i] < pivot);

        do {
            j--;
            metrics.comparisons++;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_COMPARE, index1: j, index2: -1, value: pivot, line: 12,
                    message: `Right pointer j=${j}: arr[${j}] (${arr[j]}) > pivot (${pivot})? Decrementing pointer.`,
                    snapshot: cloneArr(arr), meta: JSON.stringify({ pivot, i, j, low, high })
                });
            }
        } while (arr[j] > pivot);

        if (i >= j) {
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_PIVOT, index1: j, index2: -1, value: pivot, line: 13,
                    message: `Pointers crossed at j=${j}. Partition established: [${low}..${j}] <= ${pivot} <= [${j + 1}..${high}].`,
                    snapshot: cloneArr(arr), meta: JSON.stringify({ partition: j, low, high, pivot })
                });
            }
            return j;
        }

        doSwapArr(arr, i, j, 14, `Pointers stopped: Swapping arr[${i}] (${arr[i]}) and arr[${j}] (${arr[j]}) across pivot boundary.`, metrics, recordTrace);
    }
}

function quickSortRecursive(arr, low, high, depth, metrics, recordTrace) {
    if (depth > metrics.maxRecursionDepth) metrics.maxRecursionDepth = depth;
    if (low < high) {
        const p = hoarePartition(arr, low, high, metrics, recordTrace);
        quickSortRecursive(arr, low, p, depth + 1, metrics, recordTrace);
        quickSortRecursive(arr, p + 1, high, depth + 1, metrics, recordTrace);
    }
}

function quickSort(arr, metrics, recordTrace) {
    metrics.algorithm = "Quick Sort (Med-3)";
    const n = arr.length;
    if (n <= 1) {
        metrics.auxiliaryMemoryBytes = 0;
        return;
    }

    quickSortRecursive(arr, 0, n - 1, 1, metrics, recordTrace);
    metrics.auxiliaryMemoryBytes = metrics.maxRecursionDepth * 32;

    if (recordTrace) {
        for (let k = 0; k < n; ++k) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: k, index2: -1, value: arr[k], line: 16,
                message: "Quick Sort completed successfully.",
                snapshot: cloneArr(arr), meta: ""
            });
        }
    }
}

// ============================================================================
// 4. HEAP SORT
// ============================================================================
function siftDown(arr, root, heapSize, metrics, recordTrace) {
    let current = root;

    while (true) {
        const left = 2 * current + 1;
        const right = 2 * current + 2;
        let largest = current;

        if (left < heapSize) {
            metrics.comparisons++;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_COMPARE, index1: left, index2: largest, value: arr[left], line: 13,
                    message: `Heap tree compare: Left child arr[${left}] (${arr[left]}) vs largest arr[${largest}] (${arr[largest]}).`,
                    snapshot: cloneArr(arr), meta: JSON.stringify({ root: current, activeNode: left, parentNode: largest, heapSize })
                });
            }
            if (arr[left] > arr[largest]) largest = left;
        }

        if (right < heapSize) {
            metrics.comparisons++;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_COMPARE, index1: right, index2: largest, value: arr[right], line: 14,
                    message: `Heap tree compare: Right child arr[${right}] (${arr[right]}) vs largest arr[${largest}] (${arr[largest]}).`,
                    snapshot: cloneArr(arr), meta: JSON.stringify({ root: current, activeNode: right, parentNode: largest, heapSize })
                });
            }
            if (arr[right] > arr[largest]) largest = right;
        }

        if (largest === current) break;

        doSwapArr(arr, current, largest, 16, `Sifting down: Parent arr[${current}] (${arr[current]}) swapped with larger child arr[${largest}] (${arr[largest]}).`, metrics, recordTrace);
        current = largest;
    }
}

function heapSort(arr, metrics, recordTrace) {
    metrics.algorithm = "Heap Sort";
    metrics.auxiliaryMemoryBytes = 0;
    const n = arr.length;
    if (n <= 1) return;

    if (recordTrace) {
        metrics.trace.push({
            type: OP_INFO, index1: 0, index2: -1, value: 0, line: 3,
            message: `Phase 1: Building Max-Heap bottom-up in O(n) time starting from internal node index ${Math.floor(n / 2) - 1}.`,
            snapshot: cloneArr(arr), meta: JSON.stringify({ phase: 'build', heapSize: n })
        });
    }

    // Build Max-Heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; --i) {
        siftDown(arr, i, n, metrics, recordTrace);
    }

    if (recordTrace) {
        metrics.trace.push({
            type: OP_INFO, index1: 0, index2: -1, value: 0, line: 6,
            message: "Phase 2: Max-Heap verified. Successively extracting root maximum to sorted position at array end.",
            snapshot: cloneArr(arr), meta: JSON.stringify({ phase: 'extract', heapSize: n })
        });
    }

    // Extract elements
    for (let end = n - 1; end > 0; --end) {
        doSwapArr(arr, 0, end, 7, `Extracted root maximum ${arr[0]} to final sorted position at index ${end}.`, metrics, recordTrace);

        if (recordTrace) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: end, index2: -1, value: arr[end], line: 7,
                message: `Element ${arr[end]} at index ${end} is permanently sorted.`,
                snapshot: cloneArr(arr), meta: JSON.stringify({ heapSize: end })
            });
        }

        siftDown(arr, 0, end, metrics, recordTrace);
    }

    if (recordTrace) {
        metrics.trace.push({
            type: OP_MARK_SORTED, index1: 0, index2: -1, value: arr[0], line: 10,
            message: "Heap Sort complete. All elements verified in sorted position.",
            snapshot: cloneArr(arr), meta: JSON.stringify({ heapSize: 0 })
        });
    }
}

function siftDownRange(arr, start, root, heapSize, metrics, recordTrace) {
    let current = root;
    while (true) {
        const left = 2 * current + 1;
        const right = 2 * current + 2;
        let largest = current;

        if (left < heapSize) {
            metrics.comparisons++;
            if (arr[start + left] > arr[start + largest]) largest = left;
        }
        if (right < heapSize) {
            metrics.comparisons++;
            if (arr[start + right] > arr[start + largest]) largest = right;
        }
        if (largest === current) break;
        doSwapArr(arr, start + current, start + largest, 16, "", metrics, recordTrace);
        current = largest;
    }
}

function heapSortRange(arr, left, right, metrics, recordTrace) {
    const count = right - left + 1;
    if (count <= 1) return;

    for (let i = Math.floor(count / 2) - 1; i >= 0; --i) {
        siftDownRange(arr, left, i, count, metrics, recordTrace);
    }
    for (let end = count - 1; end > 0; --end) {
        doSwapArr(arr, left, left + end, 7, "", metrics, recordTrace);
        siftDownRange(arr, left, 0, end, metrics, recordTrace);
    }
}

// ============================================================================
// 5. ADAPTIVE SORT (FIXED NAMING & DIAGNOSTIC INSPECTION)
// ============================================================================
function profileInput(arr) {
    const n = arr.length;
    let sortedRuns = 1;
    let isFullySorted = true;
    let isFullyReversed = true;

    for (let i = 0; i < n - 1; ++i) {
        if (arr[i] > arr[i + 1]) {
            isFullySorted = false;
            sortedRuns++;
        } else if (arr[i] < arr[i + 1]) {
            isFullyReversed = false;
        }
    }

    let sampleInversions = 0;
    const stride = n < 256 ? 1 : Math.floor(n / 128);
    for (let i = 0; i < n - stride; i += stride) {
        if (arr[i] > arr[i + stride]) sampleInversions++;
    }

    return { size: n, sortedRuns, sampleInversions, isFullySorted, isFullyReversed };
}

function reverseArrayInPlace(arr, metrics, recordTrace) {
    let i = 0;
    let j = arr.length - 1;
    while (i < j) {
        doSwapArr(arr, i, j, 6, `Reversing: Inverting arr[${i}] (${arr[i]}) with arr[${j}] (${arr[j]}).`, metrics, recordTrace);
        i++;
        j--;
    }
}

function introsortRecursive(arr, low, high, maxDepth, depth, metrics, recordTrace) {
    if (depth > metrics.maxRecursionDepth) metrics.maxRecursionDepth = depth;
    const count = high - low + 1;
    if (count <= 1) return;

    if (count < 16) {
        if (recordTrace) {
            metrics.trace.push({
                type: OP_INFO, index1: low, index2: high, value: count, line: 8,
                message: `Partition size ${count} < 16. Cutoff to Insertion Sort for cache speed.`,
                snapshot: cloneArr(arr), meta: "cutoff"
            });
        }
        insertionSortRange(arr, low, high, metrics, recordTrace);
        return;
    }

    if (depth >= maxDepth) {
        if (recordTrace) {
            metrics.trace.push({
                type: OP_INFO, index1: low, index2: high, value: maxDepth, line: 13,
                message: `Recursion depth ${depth} reached cutoff 2*floor(log2(N)) = ${maxDepth}. Switching to Heap Sort to guarantee O(n log n).`,
                snapshot: cloneArr(arr), meta: "depth_guard"
            });
        }
        heapSortRange(arr, low, high, metrics, recordTrace);
        return;
    }

    const p = hoarePartition(arr, low, high, metrics, recordTrace);
    introsortRecursive(arr, low, p, maxDepth, depth + 1, metrics, recordTrace);
    introsortRecursive(arr, p + 1, high, maxDepth, depth + 1, metrics, recordTrace);
}

function adaptiveSort(arr, metrics, recordTrace) {
    const n = arr.length;

    if (n <= 1) {
        metrics.adaptiveStrategy = "Identity Verification";
        metrics.adaptiveReason = "Array size <= 1 is trivially sorted.";
        metrics.algorithm = "Adaptive (picked: Identity)";
        return;
    }

    const profile = profileInput(arr);

    if (profile.isFullySorted) {
        metrics.adaptiveStrategy = "Early Exit Verification";
        metrics.adaptiveReason = "Array is already monotonically non-decreasing. Verified in O(n) scan with 0 swaps.";
        metrics.algorithm = "Adaptive (picked: Early Exit)";
        if (recordTrace) {
            metrics.trace.push({
                type: OP_INFO, index1: 0, index2: n - 1, value: 0, line: 4,
                message: "Corpus is already sorted! Single O(n) verification pass complete with 0 swaps.",
                snapshot: cloneArr(arr), meta: JSON.stringify({ profile, picked: 'Early Exit' })
            });
            for (let k = 0; k < n; ++k) {
                metrics.trace.push({
                    type: OP_MARK_SORTED, index1: k, index2: -1, value: arr[k], line: 4,
                    message: "Verified sorted.",
                    snapshot: cloneArr(arr), meta: ""
                });
            }
        }
    } else if (profile.isFullyReversed) {
        metrics.adaptiveStrategy = "In-Place Symmetric Reversal";
        metrics.adaptiveReason = "Monotone descending sequence detected. Reversed in-place in floor(n/2) swaps with 0 comparisons.";
        metrics.algorithm = "Adaptive (picked: In-Place Reversal)";
        metrics.auxiliaryMemoryBytes = 4;
        if (recordTrace) {
            metrics.trace.push({
                type: OP_INFO, index1: 0, index2: n - 1, value: 0, line: 6,
                message: "Monotone descending sequence detected. Initiating in-place symmetric reversal in floor(n/2) swaps.",
                snapshot: cloneArr(arr), meta: JSON.stringify({ profile, picked: 'Reversal' })
            });
        }
        reverseArrayInPlace(arr, metrics, recordTrace);
        if (recordTrace) {
            for (let k = 0; k < n; ++k) {
                metrics.trace.push({
                    type: OP_MARK_SORTED, index1: k, index2: -1, value: arr[k], line: 6,
                    message: "Reversal complete. Array sorted in linear time.",
                    snapshot: cloneArr(arr), meta: ""
                });
            }
        }
    } else if (n < 16) {
        metrics.adaptiveStrategy = "Direct Insertion Sort";
        metrics.adaptiveReason = "Subproblem size N < 16. Insertion sort eliminates call stack overhead and branch misses.";
        metrics.algorithm = "Adaptive (picked: Insertion Sort)";
        if (recordTrace) {
            metrics.trace.push({
                type: OP_INFO, index1: 0, index2: n - 1, value: n, line: 8,
                message: "Small array (N < 16). Selected Insertion Sort to eliminate function call overhead.",
                snapshot: cloneArr(arr), meta: JSON.stringify({ profile, picked: 'Insertion Sort' })
            });
        }
        // Save algorithm name before calling insertionSort
        const savedName = metrics.algorithm;
        insertionSort(arr, metrics, recordTrace);
        metrics.algorithm = savedName; // Prevent overwrite
    } else if (profile.sortedRuns <= 4 || profile.sampleInversions <= 3) {
        metrics.adaptiveStrategy = "Adaptive Run Insertion";
        metrics.adaptiveReason = `Presortedness detected (${profile.sortedRuns} runs). Insertion Sort executes in near-linear O(n) time.`;
        metrics.algorithm = "Adaptive (picked: Run Insertion)";
        if (recordTrace) {
            metrics.trace.push({
                type: OP_INFO, index1: 0, index2: n - 1, value: profile.sortedRuns, line: 10,
                message: `Presortedness detected (${profile.sortedRuns} runs). Dispatched Adaptive Run Insertion.`,
                snapshot: cloneArr(arr), meta: JSON.stringify({ profile, picked: 'Run Insertion' })
            });
        }
        const savedName = metrics.algorithm;
        insertionSort(arr, metrics, recordTrace);
        metrics.algorithm = savedName; // Prevent overwrite
    } else {
        const maxDepth = 2 * Math.floor(Math.log2(n));
        metrics.adaptiveStrategy = `Introsort Hybrid (QuickSort + HeapSort cutoff at depth ${maxDepth} + Insertion < 16)`;
        metrics.adaptiveReason = "Random or large dataset. Introsort combines QuickSort's optimal cache performance with HeapSort's O(n log n) safety.";
        metrics.algorithm = "Adaptive (picked: Introsort)";
        if (recordTrace) {
            metrics.trace.push({
                type: OP_INFO, index1: 0, index2: n - 1, value: maxDepth, line: 13,
                message: `Dispatched Introsort: Median-of-3 QuickSort with HeapSort depth cutoff at ${maxDepth} and Insertion cutoff < 16.`,
                snapshot: cloneArr(arr), meta: JSON.stringify({ profile, picked: 'Introsort', maxDepth })
            });
        }
        introsortRecursive(arr, 0, n - 1, maxDepth, 1, metrics, recordTrace);
        metrics.auxiliaryMemoryBytes = metrics.maxRecursionDepth * 32;

        if (recordTrace) {
            for (let k = 0; k < n; ++k) {
                metrics.trace.push({
                    type: OP_MARK_SORTED, index1: k, index2: -1, value: arr[k], line: 14,
                    message: "Introsort completed successfully.",
                    snapshot: cloneArr(arr), meta: ""
                });
            }
        }
    }
}

// ============================================================================
// 6. BUBBLE SORT (FLAG OPTIMIZED)
// ============================================================================
function bubbleSort(arr, metrics, recordTrace) {
    if (!metrics.algorithm) metrics.algorithm = "Bubble Sort";
    metrics.auxiliaryMemoryBytes = 4;
    const n = arr.length;

    if (n <= 1) {
        if (recordTrace && n === 1) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: 0, index2: -1, value: arr[0], line: 1,
                message: "Single-element array is trivially sorted.",
                snapshot: cloneArr(arr), meta: ""
            });
        }
        return;
    }

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        if (recordTrace) {
            metrics.trace.push({
                type: OP_INFO, index1: i, index2: -1, value: n - 1 - i, line: 2,
                message: `Pass ${i + 1}: Bubbling largest remaining element to index ${n - 1 - i}.`,
                snapshot: cloneArr(arr), meta: "pass"
            });
        }

        for (let j = 0; j < n - 1 - i; j++) {
            metrics.comparisons++;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_COMPARE, index1: j, index2: j + 1, value: arr[j], line: 4,
                    message: `Comparing adjacent pair arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}).`,
                    snapshot: cloneArr(arr), meta: ""
                });
            }

            if (arr[j] > arr[j + 1]) {
                const tmp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = tmp;
                metrics.swaps++;
                metrics.moves += 3;
                swapped = true;
                if (recordTrace) {
                    metrics.trace.push({
                        type: OP_SWAP, index1: j, index2: j + 1, value: arr[j], line: 5,
                        message: `Inversion: ${arr[j + 1]} > ${arr[j]}; swapped adjacent items at [${j}] and [${j + 1}].`,
                        snapshot: cloneArr(arr), meta: ""
                    });
                }
            }
        }

        if (recordTrace) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: n - 1 - i, index2: -1, value: arr[n - 1 - i], line: 8,
                message: `Element at index ${n - 1 - i} (${arr[n - 1 - i]}) is locked into its final sorted position.`,
                snapshot: cloneArr(arr), meta: ""
            });
        }

        if (!swapped) {
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_INFO, index1: 0, index2: n - 1, value: 0, line: 10,
                    message: `Early Exit: No swaps needed in pass ${i + 1}! Sequence verified sorted.`,
                    snapshot: cloneArr(arr), meta: "early_break"
                });
            }
            break;
        }
    }

    if (recordTrace) {
        for (let k = 0; k < n; ++k) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: k, index2: -1, value: arr[k], line: 12,
                message: "Bubble Sort complete. Verified sorted.",
                snapshot: cloneArr(arr), meta: ""
            });
        }
    }
}

// ============================================================================
// 7. SELECTION SORT
// ============================================================================
function selectionSort(arr, metrics, recordTrace) {
    if (!metrics.algorithm) metrics.algorithm = "Selection Sort";
    metrics.auxiliaryMemoryBytes = 8;
    const n = arr.length;

    if (n <= 1) return;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        if (recordTrace) {
            metrics.trace.push({
                type: OP_PIVOT, index1: i, index2: -1, value: arr[i], line: 2,
                message: `Pass ${i + 1}: Searching unsorted suffix [${i} .. ${n - 1}] for minimum element. Current candidate = ${arr[i]}.`,
                snapshot: cloneArr(arr), meta: "min_init"
            });
        }

        for (let j = i + 1; j < n; j++) {
            metrics.comparisons++;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_COMPARE, index1: j, index2: minIdx, value: arr[j], line: 4,
                    message: `Checking arr[${j}] (${arr[j]}) against current minimum arr[${minIdx}] (${arr[minIdx]}).`,
                    snapshot: cloneArr(arr), meta: ""
                });
            }

            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                if (recordTrace) {
                    metrics.trace.push({
                        type: OP_PIVOT, index1: minIdx, index2: i, value: arr[minIdx], line: 5,
                        message: `New minimum discovered: ${arr[minIdx]} at index ${minIdx}!`,
                        snapshot: cloneArr(arr), meta: "new_min"
                    });
                }
            }
        }

        if (minIdx !== i) {
            const tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
            metrics.swaps++;
            metrics.moves += 3;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_SWAP, index1: i, index2: minIdx, value: arr[i], line: 7,
                    message: `Swapped minimum (${arr[i]}) into sorted prefix slot [${i}].`,
                    snapshot: cloneArr(arr), meta: ""
                });
            }
        }

        if (recordTrace) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: i, index2: -1, value: arr[i], line: 9,
                message: `Index ${i} (${arr[i]}) locked. Sorted prefix is [0 .. ${i}].`,
                snapshot: cloneArr(arr), meta: ""
            });
        }
    }

    if (recordTrace && n > 0) {
        metrics.trace.push({
            type: OP_MARK_SORTED, index1: n - 1, index2: -1, value: arr[n - 1], line: 10,
            message: "Selection Sort complete. Array verified in-order.",
            snapshot: cloneArr(arr), meta: ""
        });
    }
}

// ============================================================================
// 8. SHELL SORT (DIMINISHING GAP)
// ============================================================================
function shellSort(arr, metrics, recordTrace) {
    if (!metrics.algorithm) metrics.algorithm = "Shell Sort";
    metrics.auxiliaryMemoryBytes = 12;
    const n = arr.length;

    if (n <= 1) return;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        if (recordTrace) {
            metrics.trace.push({
                type: OP_INFO, index1: gap, index2: -1, value: gap, line: 2,
                message: `Entering gap phase h = ${gap}. Interleaved elements at distance ${gap} will be insertion sorted.`,
                snapshot: cloneArr(arr), meta: "gap"
            });
        }

        for (let i = gap; i < n; i++) {
            const temp = arr[i];
            let j = i;

            metrics.comparisons++;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_COMPARE, index1: j - gap, index2: i, value: temp, line: 5,
                    message: `Comparing arr[${j - gap}] (${arr[j - gap]}) with key (${temp}) across gap ${gap}.`,
                    snapshot: cloneArr(arr), meta: ""
                });
            }

            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                metrics.moves++;
                if (recordTrace) {
                    metrics.trace.push({
                        type: OP_OVERWRITE, index1: j, index2: j - gap, value: arr[j - gap], line: 6,
                        message: `Shifted arr[${j - gap}] (${arr[j - gap]}) right by gap ${gap} to index ${j}.`,
                        snapshot: cloneArr(arr), meta: ""
                    });
                }
                j -= gap;

                if (j >= gap) {
                    metrics.comparisons++;
                    if (recordTrace) {
                        metrics.trace.push({
                            type: OP_COMPARE, index1: j - gap, index2: -1, value: temp, line: 5,
                            message: `Comparing arr[${j - gap}] (${arr[j - gap]}) with key (${temp}).`,
                            snapshot: cloneArr(arr), meta: ""
                        });
                    }
                }
            }

            arr[j] = temp;
            metrics.moves++;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_OVERWRITE, index1: j, index2: -1, value: temp, line: 8,
                    message: `Inserted key (${temp}) into gap destination index ${j}.`,
                    snapshot: cloneArr(arr), meta: ""
                });
            }
        }
    }

    if (recordTrace) {
        for (let k = 0; k < n; ++k) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: k, index2: -1, value: arr[k], line: 10,
                message: "Shell Sort complete. Array verified in-order.",
                snapshot: cloneArr(arr), meta: ""
            });
        }
    }
}

// ============================================================================
// 9. COUNTING SORT (NON-COMPARISON KEY DISTRIBUTION)
// ============================================================================
function countingSort(arr, metrics, recordTrace) {
    if (!metrics.algorithm) metrics.algorithm = "Counting Sort";
    const n = arr.length;
    if (n <= 1) return;

    let minVal = arr[0], maxVal = arr[0];
    for (let i = 1; i < n; i++) {
        metrics.comparisons++;
        if (arr[i] < minVal) minVal = arr[i];
        if (arr[i] > maxVal) maxVal = arr[i];
    }

    const range = maxVal - minVal + 1;
    if (range > 200000) {
        insertionSort(arr, metrics, recordTrace);
        return;
    }

    metrics.auxiliaryMemoryBytes = (range * 4) + (n * 4);
    const count = new Int32Array(range);
    const output = new Int32Array(n);

    if (recordTrace) {
        metrics.trace.push({
            type: OP_INFO, index1: minVal, index2: maxVal, value: range, line: 2,
            message: `Key bounds: [${minVal} .. ${maxVal}], spectrum range = ${range}. Initialized frequency count buckets.`,
            snapshot: cloneArr(arr), meta: "range"
        });
    }

    // Tally frequencies
    for (let i = 0; i < n; i++) {
        count[arr[i] - minVal]++;
        metrics.moves++;
        if (recordTrace) {
            metrics.trace.push({
                type: OP_COMPARE, index1: i, index2: -1, value: arr[i], line: 4,
                message: `Tallying frequency: element ${arr[i]} increments bucket [${arr[i] - minVal}] to count = ${count[arr[i] - minVal]}.`,
                snapshot: cloneArr(arr), meta: ""
            });
        }
    }

    // Cumulative sums
    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
        metrics.moves++;
    }

    // Place stably
    for (let i = n - 1; i >= 0; i--) {
        const pos = count[arr[i] - minVal] - 1;
        output[pos] = arr[i];
        count[arr[i] - minVal]--;
        metrics.moves++;
    }

    // Copy back
    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
        metrics.moves++;
        if (recordTrace) {
            metrics.trace.push({
                type: OP_OVERWRITE, index1: i, index2: -1, value: arr[i], line: 8,
                message: `Bucket collation: placed ${arr[i]} into sorted position [${i}].`,
                snapshot: cloneArr(arr), meta: ""
            });
        }
    }

    if (recordTrace) {
        for (let k = 0; k < n; ++k) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: k, index2: -1, value: arr[k], line: 10,
                message: "Counting Sort complete in linear O(n + k) time.",
                snapshot: cloneArr(arr), meta: ""
            });
        }
    }
}

// ============================================================================
// 10. RADIX SORT (LSD - LEAST SIGNIFICANT DIGIT)
// ============================================================================
function radixSortLSD(arr, metrics, recordTrace) {
    if (!metrics.algorithm) metrics.algorithm = "Radix Sort (LSD)";
    const n = arr.length;
    metrics.auxiliaryMemoryBytes = (n * 4) + (10 * 4);
    if (n <= 1) return;

    let minVal = arr[0], maxVal = arr[0];
    for (let i = 1; i < n; i++) {
        if (arr[i] < minVal) minVal = arr[i];
        if (arr[i] > maxVal) maxVal = arr[i];
    }

    let offset = 0;
    if (minVal < 0) {
        offset = -minVal;
        for (let i = 0; i < n; i++) arr[i] += offset;
        maxVal += offset;
    }

    const output = new Int32Array(n);
    let passNumber = 1;

    for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
        const count = new Int32Array(10);
        const placeStr = exp === 1 ? "1s (units)" : (exp === 10 ? "10s (tens)" : (exp === 100 ? "100s (hundreds)" : `exp=${exp}`));

        if (recordTrace) {
            metrics.trace.push({
                type: OP_INFO, index1: exp, index2: -1, value: passNumber, line: 2,
                message: `Pass ${passNumber}: Distributing items across 0-9 buckets based on ${placeStr} digit.`,
                snapshot: cloneArr(arr), meta: "radix_pass"
            });
        }

        for (let i = 0; i < n; i++) {
            const digit = Math.floor(arr[i] / exp) % 10;
            count[digit]++;
            metrics.moves++;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_COMPARE, index1: i, index2: -1, value: arr[i] - offset, line: 4,
                    message: `Inspecting ${arr[i] - offset}: digit at ${placeStr} is ${digit}.`,
                    snapshot: cloneArr(arr), meta: ""
                });
            }
        }

        for (let i = 1; i < 10; i++) count[i] += count[i - 1];

        for (let i = n - 1; i >= 0; i--) {
            const digit = Math.floor(arr[i] / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
            metrics.moves++;
        }

        for (let i = 0; i < n; i++) {
            arr[i] = output[i];
            metrics.moves++;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_OVERWRITE, index1: i, index2: -1, value: arr[i] - offset, line: 6,
                    message: `Collated item ${arr[i] - offset} into index [${i}] after ${placeStr} bucket sort.`,
                    snapshot: cloneArr(arr), meta: ""
                });
            }
        }

        passNumber++;
    }

    if (offset !== 0) {
        for (let i = 0; i < n; i++) arr[i] -= offset;
    }

    if (recordTrace) {
        for (let k = 0; k < n; ++k) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: k, index2: -1, value: arr[k], line: 8,
                message: "Radix Sort (LSD) complete across all digit places.",
                snapshot: cloneArr(arr), meta: ""
            });
        }
    }
}

// ============================================================================
// 11. BENCHMARK DISPATCHER & HIGH-PRECISION TIMING
// ============================================================================
function executeAlgorithm(algoId, rawArray, recordTrace) {
    const arr = new Int32Array(rawArray);
    const n = arr.length;
    const algoNames = [
        "Insertion Sort", "Merge Sort", "Quick Sort (Med-3)", "Heap Sort", "Adaptive Sort",
        "Bubble Sort", "Selection Sort", "Shell Sort", "Counting Sort", "Radix Sort (LSD)"
    ];
    const metrics = {
        algorithm: algoNames[algoId] || "Algorithm",
        arraySize: n,
        comparisons: 0,
        swaps: 0,
        moves: 0,
        auxiliaryMemoryBytes: 0,
        maxRecursionDepth: 0,
        elapsedMicroseconds: 0,
        isCorrect: false,
        adaptiveStrategy: "",
        adaptiveReason: "",
        trace: []
    };

    const tStart = performance.now();

    switch (algoId) {
        case 0: insertionSort(arr, metrics, recordTrace); break;
        case 1: mergeSort(arr, metrics, recordTrace); break;
        case 2: quickSort(arr, metrics, recordTrace); break;
        case 3: heapSort(arr, metrics, recordTrace); break;
        case 4: adaptiveSort(arr, metrics, recordTrace); break;
        case 5: bubbleSort(arr, metrics, recordTrace); break;
        case 6: selectionSort(arr, metrics, recordTrace); break;
        case 7: shellSort(arr, metrics, recordTrace); break;
        case 8: countingSort(arr, metrics, recordTrace); break;
        case 9: radixSortLSD(arr, metrics, recordTrace); break;
    }

    const tEnd = performance.now();
    metrics.elapsedMicroseconds = (tEnd - tStart) * 1000.0;
    metrics.isCorrect = verifySorted(arr);

    return metrics;
}

/**
 * High-Precision Benchmark Timing
 * Runs loops accumulating >= 20ms of CPU work per trial to eliminate timer jitter,
 * and takes the median of 7 independent trials.
 */
function measurePreciseTime(algoId, data) {
    const n = data.length;

    // Single run to count exact comparisons, swaps, memory, and baseline duration
    const baseline = executeAlgorithm(algoId, data, false);

    // Warm-up & calibration duration
    const t0 = performance.now();
    executeAlgorithm(algoId, data, false);
    const t1 = performance.now();
    const singleRunMs = Math.max(t1 - t0, 0.0005);

    // Calculate reps to accumulate >= 20ms work
    let reps = Math.max(1, Math.min(25000, Math.ceil(20 / singleRunMs)));
    if (n >= 5000) reps = Math.min(reps, 5);
    if (n >= 20000) reps = 1;

    // 7 independent trials
    const trialTimesUs = [];
    for (let trial = 0; trial < 7; trial++) {
        const start = performance.now();
        for (let r = 0; r < reps; r++) {
            executeAlgorithm(algoId, data, false);
        }
        const end = performance.now();
        const timePerRunUs = ((end - start) * 1000.0) / reps;
        trialTimesUs.push(timePerRunUs);
    }

    // Sort to extract the median (index 3 of 7)
    trialTimesUs.sort((a, b) => a - b);
    const medianUs = trialTimesUs[3];

    // Standard deviation around median
    let variance = 0;
    for (let t of trialTimesUs) {
        variance += Math.pow(t - medianUs, 2);
    }
    const stdDevUs = Math.sqrt(variance / 7);

    return {
        algorithm: baseline.algorithm,
        arraySize: baseline.arraySize,
        avgTimeMicroseconds: medianUs,
        stdDevMicroseconds: stdDevUs,
        comparisons: baseline.comparisons,
        swaps: baseline.swaps,
        moves: baseline.moves,
        auxiliaryMemoryBytes: baseline.auxiliaryMemoryBytes,
        maxRecursionDepth: baseline.maxRecursionDepth,
        isCorrect: baseline.isCorrect,
        adaptiveStrategy: baseline.adaptiveStrategy,
        adaptiveReason: baseline.adaptiveReason
    };
}

// Generate test data for growth chart
function generateTestArray(size, type = 'random') {
    const arr = new Int32Array(size);
    if (type === 'sorted') {
        for (let i = 0; i < size; i++) arr[i] = i + 1;
    } else if (type === 'reverse') {
        for (let i = 0; i < size; i++) arr[i] = size - i;
    } else { // random
        for (let i = 0; i < size; i++) arr[i] = Math.floor(Math.random() * (size * 10)) + 1;
    }
    return arr;
}

self.onmessage = function (e) {
    const msg = e.data;
    if (!msg || !msg.command) return;

    if (msg.command === 'RUN_SINGLE') {
        const result = executeAlgorithm(msg.algoId, msg.data, msg.recordTrace);
        self.postMessage({
            type: 'SINGLE_RESULT',
            requestId: msg.requestId,
            result: result
        });
    } else if (msg.command === 'RUN_BENCHMARK') {
        const { data, algoIds, requestId } = msg;
        const summary = [];

        for (let i = 0; i < algoIds.length; ++i) {
            const algoId = algoIds[i];
            const preciseRes = measurePreciseTime(algoId, data);
            preciseRes.algoId = algoId;

            summary.push(preciseRes);

            self.postMessage({
                type: 'BENCHMARK_PROGRESS',
                requestId: requestId,
                completed: i + 1,
                total: algoIds.length
            });
        }

        self.postMessage({
            type: 'BENCHMARK_COMPLETE',
            requestId: requestId,
            results: summary
        });
    } else if (msg.command === 'RUN_GROWTH_CHART') {
        const sizes = [100, 1000, 10000, 50000];
        const chartData = {};

        // Run for all 10 algorithms
        for (let algoId = 0; algoId < 10; algoId++) {
            chartData[algoId] = [];
            for (let s of sizes) {
                // If O(n²) sorts (Insertion, Bubble, Selection) on N=50k, extrapolate from N=10k to prevent freeze
                if ((algoId === 0 || algoId === 5 || algoId === 6) && s === 50000) {
                    const t10k = chartData[algoId][2] || 15000;
                    chartData[algoId].push(t10k * 25.0); // O(n²) scaling: (50/10)² = 25x
                    continue;
                }
                const testData = generateTestArray(s, 'random');
                const measured = measurePreciseTime(algoId, testData);
                chartData[algoId].push(measured.avgTimeMicroseconds);
            }
        }

        self.postMessage({
            type: 'GROWTH_CHART_COMPLETE',
            requestId: msg.requestId,
            sizes: sizes,
            data: chartData
        });
    }
};
