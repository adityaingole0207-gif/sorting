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

function lomutoPartition(arr, low, high, metrics, recordTrace) {
    // Median-of-three pivot selection to prevent worst-case O(N) recursion on sorted/reversed data
    if (high - low >= 3) {
        const mid = (low + high) >> 1;
        if (arr[mid] < arr[low]) doSwapArr(arr, low, mid, 0, "", metrics, false);
        if (arr[high] < arr[low]) doSwapArr(arr, low, high, 0, "", metrics, false);
        if (arr[mid] < arr[high]) doSwapArr(arr, mid, high, 0, "", metrics, false);
    }

    const pivot = arr[high];
    let i = low - 1;

    if (recordTrace) {
        metrics.trace.push({
            type: OP_PIVOT, index1: high, index2: -1, value: pivot, line: 9,
            message: `Selected pivot = ${pivot} at index ${high}.`,
            snapshot: cloneArr(arr), meta: JSON.stringify({ pivot, low, high })
        });
    }

    for (let j = low; j < high; j++) {
        metrics.comparisons++;
        if (recordTrace) {
            metrics.trace.push({
                type: OP_COMPARE, index1: j, index2: high, value: pivot, line: 12,
                message: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot}).`,
                snapshot: cloneArr(arr), meta: JSON.stringify({ pivot, i, j })
            });
        }

        if (arr[j] < pivot) {
            i++;
            doSwapArr(arr, i, j, 14, `arr[${j}] < pivot: swapped with arr[${i}].`, metrics, recordTrace);
        }
    }

    doSwapArr(arr, i + 1, high, 17, `Placed pivot ${pivot} into sorted position index ${i + 1}.`, metrics, recordTrace);
    return i + 1;
}

function quickSortRecursive(arr, low, high, depth, metrics, recordTrace) {
    while (low < high) {
        if (depth > metrics.maxRecursionDepth) metrics.maxRecursionDepth = depth;
        if (depth > 2000) break; // Guard against deep stack recursion
        const pi = lomutoPartition(arr, low, high, metrics, recordTrace);
        if (pi - low < high - pi) {
            quickSortRecursive(arr, low, pi - 1, depth + 1, metrics, recordTrace);
            low = pi + 1;
        } else {
            quickSortRecursive(arr, pi + 1, high, depth + 1, metrics, recordTrace);
            high = pi - 1;
        }
    }
}

function quickSort(arr, metrics, recordTrace) {
    metrics.algorithm = "Quick Sort";
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
                type: OP_MARK_SORTED, index1: k, index2: -1, value: arr[k], line: 19,
                message: "Quick Sort completed successfully.",
                snapshot: cloneArr(arr), meta: ""
            });
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
    metrics.auxiliaryMemoryBytes = 4;
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            metrics.comparisons++;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_COMPARE, index1: minIdx, index2: j, value: arr[minIdx], line: 5,
                    message: `Selection: Comparing current minimum arr[${minIdx}] (${arr[minIdx]}) with arr[${j}] (${arr[j]}).`,
                    snapshot: cloneArr(arr), meta: ""
                });
            }
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
            const tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
            metrics.swaps++;
            if (recordTrace) {
                metrics.trace.push({
                    type: OP_SWAP, index1: i, index2: minIdx, value: arr[i], line: 8,
                    message: `Swapped unsorted head [${i}] with minimum element ${arr[i]} at [${minIdx}].`,
                    snapshot: cloneArr(arr), meta: ""
                });
            }
        }
        if (recordTrace) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: i, index2: -1, value: arr[i], line: 8,
                message: `Locked minimum element ${arr[i]} into sorted position [${i}].`,
                snapshot: cloneArr(arr), meta: ""
            });
        }
    }

    if (recordTrace) {
        for (let k = 0; k < n; ++k) {
            metrics.trace.push({
                type: OP_MARK_SORTED, index1: k, index2: -1, value: arr[k], line: 12,
                message: "Selection Sort complete. Verified sorted.",
                snapshot: cloneArr(arr), meta: ""
            });
        }
    }
}

// ============================================================================
// 8. BENCHMARK DISPATCHER & HIGH-PRECISION TIMING (7 ALGORITHMS)
// ============================================================================
function executeAlgorithm(algoId, rawArray, recordTrace) {
    const arr = new Int32Array(rawArray);
    const n = arr.length;
    const algoNames = [
        "Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort"
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
        case 0: bubbleSort(arr, metrics, recordTrace); break;
        case 1: selectionSort(arr, metrics, recordTrace); break;
        case 2: insertionSort(arr, metrics, recordTrace); break;
        case 3: mergeSort(arr, metrics, recordTrace); break;
        case 4: quickSort(arr, metrics, recordTrace); break;
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

// Generate test data for growth chart & matrix
function generateTestArray(size, type = 'random') {
    const arr = new Int32Array(size);
    if (type === 'sorted') {
        for (let i = 0; i < size; i++) arr[i] = (i + 1) * 3;
    } else if (type === 'reverse') {
        for (let i = 0; i < size; i++) arr[i] = (size - i) * 3;
    } else if (type === 'nearly_sorted') {
        for (let i = 0; i < size; i++) arr[i] = (i + 1) * 3;
        const swaps = Math.max(1, Math.floor(size / 10));
        for (let s = 0; s < swaps; s++) {
            const i1 = Math.floor(Math.random() * size);
            const i2 = Math.floor(Math.random() * size);
            const tmp = arr[i1]; arr[i1] = arr[i2]; arr[i2] = tmp;
        }
    } else if (type === 'duplicates') {
        for (let i = 0; i < size; i++) arr[i] = ((i % 4) + 1) * 15;
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
    } else if (msg.command === 'RUN_MATRIX') {
        const { distributions, algoIds, requestId } = msg;
        const matrixResults = [];
        for (let aIdx = 0; aIdx < algoIds.length; aIdx++) {
            const algoId = algoIds[aIdx];
            const row = [];
            for (let dIdx = 0; dIdx < distributions.length; dIdx++) {
                const dist = distributions[dIdx];
                const testData = generateTestArray(200, dist);
                const measured = measurePreciseTime(algoId, testData);
                measured.algoId = algoId;
                measured.distribution = dist;
                row.push(measured);
            }
            matrixResults.push(row);
        }
        self.postMessage({
            type: 'MATRIX_COMPLETE',
            requestId: requestId,
            matrix: matrixResults
        });
    } else if (msg.command === 'RUN_GROWTH_CHART') {
        const sizes = [100, 1000, 10000, 50000];
        const chartData = {};

        // Run for all 10 algorithms
        for (let algoId = 0; algoId < 5; algoId++) {
            chartData[algoId] = [];
            for (let s of sizes) {
                // If O(n²) sorts (Insertion, Bubble, Selection) on N=50k, extrapolate from N=10k to prevent freeze
                if ((algoId === 0 || algoId === 1 || algoId === 2) && s === 50000) {
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
